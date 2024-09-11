"use client";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import ReportFinancial from "../components/ReportFinancial";
import ReportLearning from "../components/ReportLearning";
import ReportStakeholder from "../components/ReportStakeholder";
import ReportInternal from "../components/ReportInternal";
import ReportFinancialView from "../components/ReportFinancialView";
import ReportStakeholderView from "../components/ReportStakeholderView";
import ReportInternalView from "../components/ReportInternalView";
import ReportLearningView from "../components/ReportLearningView";
import * as XLSX from "xlsx"; // Import xlsx
import { useSession } from "next-auth/react";

const ReportsPage = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  // State to manage the current view
  const [currentView, setCurrentView] = useState("default");

  const [selectedComponent, setSelectedComponent] = useState("");

  //Report Financial
  const [financialReportsFirst, setFinancialReportsFirst] = useState<
    ReportFinancialView[]
  >([]);
  const [financialReportsSecond, setFinancialReportsSecond] = useState<
    ReportFinancialView[]
  >([]);
  //Report Stakeholder
  const [stakeholderReportsFirst, setStakeholderReportFirst] = useState<
    ReportStakeholderView[]
  >([]);
  const [stakeholderReportsSecond, setStakeholderReportSecond] = useState<
    ReportStakeholderView[]
  >([]);
  //Report Internal
  const [internalReportsFirst, setInternalReportsFirst] = useState<
    ReportInternalView[]
  >([]);
  const [internalReportsSecond, setInternalReportsSecond] = useState<
    ReportInternalView[]
  >([]);
  //Report Learning
  const [learningReportsFirst, setLearningReportsFirst] = useState<
    ReportLearningView[]
  >([]);
  const [learningReportsSecond, setLearningReportsSecond] = useState<
    ReportLearningView[]
  >([]);

  const changeComponent = (componentName: string) => {
    localStorage.setItem("lastComponent", componentName);
    setSelectedComponent(componentName);
  };

  useEffect(() => {
    const lastComponent = localStorage.getItem("lastComponent");
    if (lastComponent) {
      setSelectedComponent(lastComponent);
    }
  }, []);

  useEffect(() => {
    const getReports = async (department_id: number) => {
      try {
        // Fetch financial reports
        const financialResponse = await fetch(
          `http://localhost:8080/bsc/financial/get/${department_id}`
        );
        if (!financialResponse.ok) {
          throw new Error("Failed to fetch financial reports");
        }
        const financialData = await financialResponse.json();

        // Filter financial reports for 1st and 2nd semester
        const firstSemesterFinancialReports = financialData.filter(
          (report: ReportFinancialView) => report.semester === "1st"
        );
        const secondSemesterFinancialReports = financialData.filter(
          (report: ReportFinancialView) => report.semester === "2nd"
        );

        setFinancialReportsFirst(firstSemesterFinancialReports);
        setFinancialReportsSecond(secondSemesterFinancialReports);

        // Fetch stakeholder reports
        const stakeholderResponse = await fetch(
          `http://localhost:8080/bsc/stakeholder/get/${department_id}`
        );
        if (!stakeholderResponse.ok) {
          throw new Error("Failed to fetch stakeholder reports");
        }
        const stakeholderData = await stakeholderResponse.json();

        // Filter stakeholder reports for 1st and 2nd semester
        const firstSemesterStakeholderReports = stakeholderData.filter(
          (report: ReportStakeholderView) => report.semester === "1st"
        );
        const secondSemesterStakeholderReports = stakeholderData.filter(
          (report: ReportStakeholderView) => report.semester === "2nd"
        );

        setStakeholderReportFirst(firstSemesterStakeholderReports);
        setStakeholderReportSecond(secondSemesterStakeholderReports);

        //Fetch internal reports
        const internalResponse = await fetch(
          `http://localhost:8080/bsc/internal/get/${department_id}`
        );
        if (!internalResponse.ok) {
          throw new Error("Failed to fetch internal reports");
        }
        const internalData = await internalResponse.json();

        // Filter internal reports for 1st and 2nd semester
        const firstSemesterInternalReports = internalData.filter(
          (report: ReportInternalView) => report.semester === "1st"
        );
        const secondSemesterInternalReports = internalData.filter(
          (report: ReportInternalView) => report.semester === "2nd"
        );

        setInternalReportsFirst(firstSemesterInternalReports);
        setInternalReportsSecond(secondSemesterInternalReports);

        //Fetch learning reports
        const learningResponse = await fetch(
          `http://localhost:8080/bsc/learning/get/${department_id}`
        );
        if (!learningResponse.ok) {
          throw new Error("Failed to fetch learning reports");
        }
        const learningData = await learningResponse.json();

        // Filter learning reports for 1st and 2nd semester
        const firstSemesterLearningReports = learningData.filter(
          (report: ReportLearningView) => report.semester === "1st"
        );
        const secondSemesterLearningReports = learningData.filter(
          (report: ReportLearningView) => report.semester === "2nd"
        );

        setLearningReportsFirst(firstSemesterLearningReports);
        setLearningReportsSecond(secondSemesterLearningReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    getReports(department_id);
  }, [department_id]);

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
    const transformData = (data: any[]) => {
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

    // Financial reports
    const transformedFinancialReportsFirst = transformData(
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
    const transformedFinancialReportsSecond = transformData(
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

    // Stakeholder reports
    const transformedStakeholderReportsFirst = transformData(
      stakeholderReportsFirst.filter(
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
    const transformedStakeholderReportsSecond = transformData(
      stakeholderReportsSecond.filter(
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

    // Internal reports
    const transformedInternalReportsFirst = transformData(
      internalReportsFirst.filter(
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
    const transformedInternalReportsSecond = transformData(
      internalReportsSecond.filter(
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

    // Learning reports
    const transformedLearningReportsFirst = transformData(
      learningReportsFirst.filter(
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
    const transformedLearningReportsSecond = transformData(
      learningReportsSecond.filter(
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

    // Create worksheets for each report type
    const createWorksheet = (
      reportTitle: string,
      firstSemData: any[],
      secondSemData: any[]
    ) => {
      const worksheetData = [];
      worksheetData.push([`1st Semester ${reportTitle}`]); // Label
      worksheetData.push(headers); // Add headers
      worksheetData.push(...firstSemData.map(Object.values)); // Data

      worksheetData.push([]); // Blank row between tables

      worksheetData.push([`2nd Semester ${reportTitle}`]); // Label
      worksheetData.push(headers); // Add headers
      worksheetData.push(...secondSemData.map(Object.values)); // Data

      return XLSX.utils.aoa_to_sheet(worksheetData);
    };

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add financial worksheet
    XLSX.utils.book_append_sheet(
      workbook,
      createWorksheet(
        "Financial Report",
        transformedFinancialReportsFirst,
        transformedFinancialReportsSecond
      ),
      "Financial Reports"
    );

    // Add stakeholder worksheet
    XLSX.utils.book_append_sheet(
      workbook,
      createWorksheet(
        "Stakeholder Report",
        transformedStakeholderReportsFirst,
        transformedStakeholderReportsSecond
      ),
      "Stakeholder Reports"
    );

    // Add internal worksheet
    XLSX.utils.book_append_sheet(
      workbook,
      createWorksheet(
        "Internal Report",
        transformedInternalReportsFirst,
        transformedInternalReportsSecond
      ),
      "Internal Reports"
    );

    // Add learning worksheet
    XLSX.utils.book_append_sheet(
      workbook,
      createWorksheet(
        "Learning Report",
        transformedLearningReportsFirst,
        transformedLearningReportsSecond
      ),
      "Learning Reports"
    );

    // Save the workbook
    XLSX.writeFile(workbook, "Report.xlsx");
  };

  return (
    <div className="flex flex-row w-full text-[rgb(59,59,59)]">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <div className="flex flex-row">
          <div className="mb-5 mt-[0rem] break-words font-bold text-[3rem]">
            REPORT
          </div>
          <div className="flex justify-center ml-[68rem] mt-[0.5rem] border border-gray-200 bg-gray w-[16rem] h-[4rem] rounded-xl gap-2 px-1 py-1 text-md font-medium">
            <button
              onClick={() => setCurrentView("default")}
              className={`rounded-lg ${
                currentView === "default"
                  ? "bg-[#A43214] text-white"
                  : "border text-[#A43214]"
              } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
            >
              DEFAULT
            </button>
            <button
              onClick={() => setCurrentView("printed")}
              className={`rounded-lg ${
                currentView === "printed"
                  ? "bg-[#A43214] text-white"
                  : "border text-[#A43214]"
              } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
            >
              REPORT
            </button>
          </div>
        </div>
        <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10">
          The Report feature in Atlas allows users to view a comprehensive
          summary of their progress over the past months. It provides a clear
          and concise overview of your accomplishments and areas for
          improvement, helping you stay on track and make informed decisions for
          future planning.
        </div>
        {/* perspectives toggle */}
        {currentView === "default" && (
          <div>
            <div className="flex justify-center mt-[0.5rem] border border-gray-200 bg-gray w-[44rem] h-[4rem] rounded-xl px-1 py-1">
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changeComponent("Financial")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    selectedComponent === "Financial"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  FINANCIAL
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changeComponent("Stakeholder")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    selectedComponent === "Stakeholder"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  STAKEHOLDER
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changeComponent("Internal")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    selectedComponent === "Internal"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  INTERNAL PROCESS
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border cursor-pointer"
                onClick={() => changeComponent("Learning")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    selectedComponent === "Learning"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  LEARNING & GROWTH
                </div>
              </div>
            </div>
            {/* end of perspectives toggle */}
            <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              {selectedComponent === "Financial" && <ReportFinancial />}
              {selectedComponent === "Stakeholder" && <ReportStakeholder />}
              {selectedComponent === "Internal" && <ReportInternal />}
              {selectedComponent === "Learning" && <ReportLearning />}
            </div>
          </div>
        )}
        {currentView === "printed" && (
          <div>
            <div className="flex justify-center mt-[0.5rem] border border-gray-200 bg-gray w-[44rem] h-[4rem] rounded-xl px-1 py-1">
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changeComponent("Financial")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    selectedComponent === "Financial"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  FINANCIAL
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changeComponent("Stakeholder")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    selectedComponent === "Stakeholder"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  STAKEHOLDER
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changeComponent("Internal")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    selectedComponent === "Internal"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  INTERNAL PROCESS
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border cursor-pointer"
                onClick={() => changeComponent("Learning")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    selectedComponent === "Learning"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  LEARNING & GROWTH
                </div>
              </div>
            </div>
            {/* end of perspectives toggle */}
            <div>
              {selectedComponent === "Financial" && <ReportFinancialView />}
              {selectedComponent === "Stakeholder" && <ReportStakeholderView />}
              {selectedComponent === "Internal" && <ReportInternalView />}
              {selectedComponent === "Learning" && <ReportLearningView />}
            </div>
          </div>
        )}
        {currentView === "printed" && (
          <div className="flex flex-row justify-end items-end mr-8 mb-10">
            <button
              onClick={handleDownload}
              className="
        hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white 
        inline-block break-words font-bold transition-all rounded-lg px-4 py-3"
            >
              Download Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
