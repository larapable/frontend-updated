"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

interface ReportInternalView {
  id: number;
  perspective: string;
  // target_code: string;
  office_target: string;
  // actions: string;
  // budget: number;
  incharge: string;
  // ofi: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  evidence_link: string; //link
}

const ReportInternalView = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  //Report
  const [internalReports, setInternalReports] = useState<ReportInternalView[]>(
    []
  );
  const [primaryInternalReports, setPrimaryInternalReports] = useState<
    ReportInternalView[]
  >([]);
  const allInternalReports = [...primaryInternalReports, ...internalReports];

  useEffect(() => {
    const getReports = async (department_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/internal/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch internal reports");
        }
        const data = await response.json();
        //console.log("response data:", data);
        setInternalReports(data);
      } catch (error) {
        console.error("Error fetching internal reports:", error);
      }
    };

    getReports(department_id);
  }, [department_id]);

  useEffect(() => {
    const getPrimaryReports = async (department_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryInternalBsc/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary internal reports");
        }
        const data = await response.json();
        setPrimaryInternalReports(data);
      } catch (error) {
        console.error("Error fetching primary internal reports: ", error);
      }
    };
    getPrimaryReports(department_id);
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

  return (
    <div className="flex flex-col gap-10  w-[92%]">
      <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] flex flex-col pt-4 pr-5 pl-5 h-auto mb-10 rounded-lg pb-5">
        <div className="flex flex-row p-1 w-[75rem] h-auto">
          <img
            src="/internal.png"
            alt=""
            className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
          />
          <div className="flex flex-col">
            {/* insert here ang year nga giset sa input goals */}
            <span className="font-bold text-2xl items-center mt-1 ml-[-0.5rem]">
              INTERNAL PERSPECTIVE
            </span>
            <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
              The Annual Progress Report offers a detailed look into academic
              performance during the first half of the year.
            </span>
          </div>
        </div>
        <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
          {/* <div className="p-2 font-bold w-[10rem]">Target Code</div> */}
          <div className="p-2 font-bold w-[20rem]">Office Target</div>
          <div className="p-2 font-bold w-[18rem]">KPI</div>
          {/* <div className="p-2 font-bold w-[10rem]">Actions</div>
        <div className="p-2 font-bold w-[10rem]">Budget</div> */}
          <div className="p-2 font-bold w-[10rem]">In-charge</div>
          <div className="p-2 font-bold w-[25rem]">
            Performance <br />
            <div className="font-medium ">
              <span>Actual</span>
              <span className="font-bold">|</span>
              <span>Target</span>
            </div>
          </div>
          {/* <div className="p-2 w-[5rem] font-bold">OFI</div> */}
          <div className="p-2 w-[13rem] font-bold">Link of Evidence</div>
        </div>
        {allInternalReports
          .filter(
            (report) =>
              // report.target_code &&
              report.office_target &&
              report.key_performance_indicator &&
              // report.actions &&
              // report.budget &&
              report.incharge &&
              report.actual_performance !== null &&
              report.target_performance !== null &&
              // report.ofi &&
              report.evidence_link
          )
          .map((report, index) => (
            <div
              key={report.id}
              className={`flex items-center text-center ${
                index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
              }`}
            >
              {/* <div className="p-2 w-[10rem]">{report.target_code}</div> */}
              <div className="p-2 w-[20rem]">
                {truncateString(report.office_target, 35)}
              </div>
              <div className="p-2 w-[18rem]">
                {truncateString(report.key_performance_indicator, 20)}
              </div>
              {/* <div className="p-2 w-[10rem]">{truncateString(report.actions, 8)}</div>
            <div className="p-2 w-[10rem]">{report.budget}</div> */}
              <div className="p-2 w-[10rem]">
                {truncateString(report.incharge, 8)}
              </div>
              <div className="p-2 w-[25rem] text-center">
                <span className="text-start mr-2">
                  {report.actual_performance}
                </span>
                <span className="text-center">|</span>
                <span className="text-end ml-2">
                  {report.target_performance}
                </span>
              </div>
              {/* <div className="p-2 w-[5rem]">{truncateString(report.ofi, 4)}</div> */}
              <div className="p-2 w-[13rem]">
                {report.evidence_link ? (
                  <a
                    href={report.evidence_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 underline"
                  >
                    {report.evidence_link.length > 20
                      ? `${report.evidence_link.substring(0, 15)}...`
                      : report.evidence_link}
                  </a>
                ) : (
                  "..."
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReportInternalView;
