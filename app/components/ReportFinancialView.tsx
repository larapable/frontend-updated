"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Import xlsx

interface ReportFinancialView {
  id: number;
  semester: string;
  target_code: string;
  office_target: string;
  actions: string;
  budget: number;
  incharge: string;
  ofi: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}

const ReportFinancialView = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  //Report
  const [financialReportsFirst, setFinancialReportsFirst] = useState<
    ReportFinancialView[]
  >([]);
  const [financialReportsSecond, setFinancialReportsSecond] = useState<
    ReportFinancialView[]
  >([]);

  useEffect(() => {
    const getFirstReports = async (department_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial reports");
        }
        const data = await response.json();
        //console.log("response data:", data);

        // Filter reports to only include the first semester
        const firstSemesterReports = data.filter(
          (report: ReportFinancialView) => report.semester === "1st"
        );

        setFinancialReportsFirst(firstSemesterReports);
      } catch (error) {
        console.error("Error fetching financial reports:", error);
      }
    };
    const getSecondReports = async (department_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial reports");
        }
        const data = await response.json();
        //console.log("response data:", data);

        // Filter reports to only include the first semester
        const secondSemesterReports = data.filter(
          (report: ReportFinancialView) => report.semester === "2nd"
        );

        setFinancialReportsSecond(secondSemesterReports);
      } catch (error) {
        console.error("Error fetching financial reports:", error);
      }
    };
    getFirstReports(department_id);
    getSecondReports(department_id);
  }, [department_id]);

  function truncateString(str: string | null | undefined, num: number): string {
    if (!str) {
      return "";
    }
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  const handleDownload = () => {
    // Define custom headers
    const headers = [
      "Target Code",
      "Office Target",
      "KPI",
      "Actions",
      "Budget",
      "In-charge",
      "Actual Performance",
      "Target Performance",
      "OFI",
    ];

    // Function to transform data to include only specified columns with custom headers
    const transformData = (data: ReportFinancialView[]) => {
      return data.map((report) => ({
        "Target Code": report.target_code,
        "Office Target": report.office_target,
        KPI: report.key_performance_indicator,
        Actions: report.actions,
        Budget: report.budget,
        "In-charge": report.incharge,
        "Actual Performance": report.actual_performance,
        "Target Performance": report.target_performance,
        OFI: report.ofi,
      }));
    };

    // Transform and filter data for both semesters
    const transformedReportsFirst = transformData(
      financialReportsFirst.filter(
        (report) =>
          report.target_code &&
          report.office_target &&
          report.key_performance_indicator &&
          report.actions &&
          report.budget &&
          report.incharge &&
          report.actual_performance !== null &&
          report.target_performance !== null &&
          report.ofi
      )
    );

    const transformedReportsSecond = transformData(
      financialReportsSecond.filter(
        (report) =>
          report.target_code &&
          report.office_target &&
          report.key_performance_indicator &&
          report.actions &&
          report.budget &&
          report.incharge &&
          report.actual_performance !== null &&
          report.target_performance !== null &&
          report.ofi
      )
    );

    // Create a worksheet array that includes a label row for each semester
    const worksheetData = [];

    // Add label for 1st semester and the transformed data for 1st semester
    worksheetData.push(["1st Semester Financial Report"]); // Label
    worksheetData.push(headers); // Add headers
    worksheetData.push(...transformedReportsFirst.map(Object.values)); // Data

    // Add a blank row or spacer between the two tables
    worksheetData.push([]);

    // Add label for 2nd semester and the transformed data for 2nd semester
    worksheetData.push(["2nd Semester Financial Report"]); // Label
    worksheetData.push(headers); // Add headers
    worksheetData.push(...transformedReportsSecond.map(Object.values)); // Data

    // Convert the worksheet data to a sheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");

    // Save the workbook
    XLSX.writeFile(workbook, "Financial_Report.xlsx");
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-5 rounded-lg pb-5">
        <div className="flex flex-row p-1 w-[75rem] h-auto">
          <img
            src="/first.png"
            alt=""
            className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
          />
          <div className="flex flex-col">
            {/* insert here ang year nga giset sa input goals */}
            <span className="font-bold text-2xl items-center mt-1 ml-[-0.5rem]">
              1ST SEMESTER S.Y{" "}
            </span>
            <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
              The 1st Semester Progress Report offers a detailed look into
              academic performance during the first half of the year.
            </span>
          </div>
        </div>
        <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
          <div className="p-2 font-bold w-[10rem]">Target Code</div>
          <div className="p-2 font-bold w-[15rem]">Office Target</div>
          <div className="p-2 font-bold w-[10rem]">KPI</div>
          <div className="p-2 font-bold w-[12rem]">Actions</div>
          <div className="p-2 font-bold w-[10rem]">Budget</div>
          <div className="p-2 font-bold w-[10rem]">In-charge</div>
          <div className="p-2 font-bold w-[10rem]">
            Performance <br />
            <div className="font-medium ">
              <span>Actual</span>
              <span className="font-bold">|</span>
              <span>Target</span>
            </div>
          </div>
          <div className="p-2 w-[10rem] font-bold">OFI</div>
        </div>
        {financialReportsFirst
          .filter(
            (report) =>
              report.target_code &&
              report.office_target &&
              report.key_performance_indicator &&
              report.actions &&
              report.budget &&
              report.incharge &&
              report.actual_performance !== null &&
              report.target_performance !== null &&
              report.ofi
          )
          .map((report, index) => (
            <div
              key={report.id}
              className={`flex items-center text-center ${
                index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
              }`}
            >
              <div className="p-2 w-[10rem]">{report.target_code}</div>
              <div className="p-2 w-[15rem]">
                {truncateString(report.office_target, 20)}
              </div>
              <div className="p-2 w-[10rem]">
                {truncateString(report.key_performance_indicator, 20)}
              </div>
              <div className="p-2 w-[12rem]">{report.actions}</div>
              <div className="p-2 w-[10rem]">{report.budget}</div>
              <div className="p-2 w-[10rem]">{report.incharge}</div>
              <div className="p-2 w-[10rem] text-center">
                <span className="text-start mr-2">
                  {report.actual_performance}%
                </span>
                <span className="text-center">|</span>
                <span className="text-end ml-2">
                  {report.target_performance}%
                </span>
              </div>
              <div className="p-2 w-[10rem]">{report.ofi}</div>
            </div>
          ))}
      </div>

      <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
        <div className="flex flex-row p-1 w-[75rem] h-auto">
          <img
            src="/second.png"
            alt=""
            className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
          />
          <div className="flex flex-col">
            {/* insert here ang year nga giset sa input goals */}
            <span className="font-bold text-2xl items-center mt-1 ml-[-0.5rem]">
              2ND SEMESTER S.Y{" "}
            </span>
            <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
              The 2nd Semester Progress Report offers a detailed look into
              academic performance during the second half of the year.
            </span>
          </div>
        </div>
        <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
          <div className="p-2 font-bold w-[10rem]">Target Code</div>
          <div className="p-2 font-bold w-[15rem]">Office Target</div>
          <div className="p-2 font-bold w-[10rem]">KPI</div>
          <div className="p-2 font-bold w-[12rem]">Actions</div>
          <div className="p-2 font-bold w-[10rem]">Budget</div>
          <div className="p-2 font-bold w-[10rem]">In-charge</div>
          <div className="p-2 font-bold w-[10rem]">
            Performance <br />
            <div className="font-medium ">
              <span>Actual</span>
              <span className="font-bold">|</span>
              <span>Target</span>
            </div>
          </div>
          <div className="p-2 w-[10rem] font-bold">OFI</div>
        </div>
        {financialReportsSecond
          .filter(
            (report) =>
              report.target_code &&
              report.office_target &&
              report.key_performance_indicator &&
              report.actions &&
              report.budget &&
              report.incharge &&
              report.actual_performance !== null &&
              report.target_performance !== null &&
              report.ofi
          )
          .map((report, index) => (
            <div
              key={report.id}
              className={`flex items-center text-center ${
                index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
              }`}
            >
              <div className="p-2 w-[10rem]">{report.target_code}</div>
              <div className="p-2 w-[15rem]">
                {truncateString(report.office_target, 20)}
              </div>
              <div className="p-2 w-[10rem]">
                {truncateString(report.key_performance_indicator, 20)}
              </div>
              <div className="p-2 w-[12rem]">{report.actions}</div>
              <div className="p-2 w-[10rem]">{report.budget}</div>
              <div className="p-2 w-[10rem]">{report.incharge}</div>
              <div className="p-2 w-[10rem] text-center">
                <span className="text-start mr-2">
                  {report.actual_performance}%
                </span>
                <span className="text-center">|</span>
                <span className="text-end ml-2">
                  {report.target_performance}%
                </span>
              </div>
              <div className="p-2 w-[10rem]">{report.ofi}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReportFinancialView;
