"use client";
import { MenuItem, Select } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ReportInternal {
  id: number;
  actions: string;
  budget: number;
  incharge: string;
  ofi: string;
  target_code: string;
  office_target: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  perspective: string;
  evidence_link: string; 
}

const ReportInternal = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  const username = user?.username;

  // Values for the report
  const [InternalPerspective, setInternalPerspective] = useState("internal");
  const [internalActions, setInternalActions] = useState("");
  const [internalBudget, setInternalBudget] = useState<number>(0);
  const [internalIncharge, setInternalIncharge] = useState("");
  const [internalOFI, setInternalOFI] = useState("");

  const [internalTargetCode, setInternalTargetCode] = useState("");
  const [internalOfficeTarget, setInternalOfficeTarget] = useState("");
  const [internalKPI, setInternalKPI] = useState("");
  const [internalTargetPerformance, setInternalTargetPerformance] =
    useState("");
  const [internalActualPerformance, setInternalActualPerformance] =
    useState("");
    const [internalEvidenceLink, setInternalEvidenceLink] = useState(""); //link

  // Value for report
  const [internalReport, setInternalReport] = useState<ReportInternal[]>([]);
  const [primaryInternalReports, setPrimaryInternalReports] = useState<ReportInternal[]>([]);
  const allInternalReports = [ ...primaryInternalReports, ...internalReport,];
  const [isPrimaryReport, setIsPrimaryReport] = useState(false); 

  // Modal and edit id
  const [openModal, setOpenModal] = useState(false);
  const [reportEditId, setReportEditId] = useState(0);

  useEffect(() => {
    const getAllInternal = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/internal/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch internal reports");
        }
        const data = await response.json();
        console.log("response data:", data);
        setInternalReport(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching internal reports:", error);
      }
    };

    getAllInternal(department_id);
  }, [department_id]);


    useEffect(() => {
      const getPrimaryInternal = async (department_id: number) => {
        if(!department_id) {
          console.log("Department ID is not found.");
          return;
        }
        try {
           const response = await fetch (
            `http://localhost:8080/bsc/primaryInternalBsc/get/${department_id}`
           )
           if(!response.ok) {
            throw new Error ("Failed to fetch primary internal report.")
           }
           const res = await response.json();
           console.log("response data:", res);
           setPrimaryInternalReports(res);
           console.log(res);
        } catch (error) {
          console.error("Error fetching internal reports:", error);
        }
      } 
      getPrimaryInternal(department_id);
    },[department_id]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEditReport = (report: ReportInternal) => {
    const isPrimary = primaryInternalReports.some((p) => p.id === report.id);
    setIsPrimaryReport(isPrimary); 
    if (isPrimary) {
      handleEditPrimaryReport(report);
    } else {
      handleEditInternalReport(report);
    }
  };


  const handleEditInternalReport = (report: ReportInternal) => {
    setInternalTargetCode(report.target_code);
    setInternalOfficeTarget(report.office_target);
    setInternalKPI(report.key_performance_indicator);
    setInternalActualPerformance(report.actual_performance || "0");
    setInternalTargetPerformance(report.target_performance || "0");
    setReportEditId(report.id);
    setInternalPerspective(report.perspective);
    setInternalActions(report.actions);
    setInternalBudget(report.budget);
    setInternalIncharge(report.incharge);
    setInternalOFI(report.ofi);
    setInternalEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit: ", report);
  };

  const  handleEditPrimaryReport = (report: ReportInternal) => {
    setInternalTargetCode(report.target_code);
    setInternalOfficeTarget(report.office_target);
    setInternalKPI(report.key_performance_indicator);
    setInternalActualPerformance(report.actual_performance || "0");
    setInternalTargetPerformance(report.target_performance || "0");
    setReportEditId(report.id);
    setInternalPerspective(report.perspective);
    setInternalActions(report.actions);
    setInternalBudget(report.budget);
    setInternalIncharge(report.incharge);
    setInternalOFI(report.ofi);
    setInternalEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit: ", report);
  };

  

  const handleSaveReport = async () => {
    const updatedReport: ReportInternal = {
      id: reportEditId,
      actions: internalActions,
      perspective: InternalPerspective,
      budget: internalBudget,
      incharge: internalIncharge,
      ofi: internalOFI,
      target_code: internalTargetCode,
      office_target: internalOfficeTarget,
      key_performance_indicator: internalKPI,
      target_performance: internalTargetPerformance,
      actual_performance: internalActualPerformance,
      evidence_link: internalEvidenceLink, //link
      
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/internal/update/${reportEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReport),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update stakeholder report");
      }
      // Update the financialReports state directly
      setInternalReport((prevReports) =>
        prevReports.map((report) =>
          report.id === reportEditId ? updatedReport : report
        )
      );

      toast.success("Report updated successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating internal report:", error);
      toast.error("Failed to update report.");
    }
  };

  const handleSavePrimaryReport = async () => {
    const updatedPrimaryReport: ReportInternal = {
      id: reportEditId,
      actions: internalActions,
      perspective: InternalPerspective,
      budget: internalBudget,
      incharge: internalIncharge,
      ofi: internalOFI,
      target_code: internalTargetCode,
      office_target: internalOfficeTarget,
      key_performance_indicator: internalKPI,
      target_performance: internalTargetPerformance,
      actual_performance: internalActualPerformance,
      evidence_link: internalEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/primaryInternalBsc/update/${reportEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPrimaryReport), 
        }
      );
    
      if (!response.ok) {
        throw new Error("Failed to update primary internal report.");
      }
      setPrimaryInternalReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportEditId ? updatedPrimaryReport : report
        )
      );
    
      toast.success("Primary internal report updated successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating primary internal report:", error);
      toast.error("Failed to update report.");
    }
    };   

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
    <div>
      <div className="flex flex-row p-1 w-[75rem] h-auto">
        <img
          src="/internal.png"
          alt=""
          className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
        />
        <div className="flex flex-col">
          <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
            Internal Scorecard Overview
          </span>
          <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem] w-[88rem]">
            Each objective is categorized annually. Users must input the{" "}
            <span className="font-bold">
              actions taken, budget, person in charge,{" "}
            </span>
            and{" "}
            <span className="font-bold">
              opportunities for improvement (OFI).
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
        {/* <div className="p-2 font-bold w-[10rem]">Target Code</div> */}
        <div className="p-2 font-bold w-[18rem]">Office Target</div>
        <div className="p-2 font-bold w-[8rem]">KPI</div>
        <div className="p-2 font-bold w-[10rem]">Actions</div>
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
        <div className="p-2 w-[5rem] font-bold">OFI</div>
        <div className="p-2 w-[13rem] font-bold">Link of Evidence</div>
      </div>

      {allInternalReports.map((report, index) => (
        <div
          key={report.id}
          className={`flex items-center text-center ${
            index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
          }`}
        >
          {/* <div className="p-2 w-[10rem]">{report.target_code}</div> */}
          <div className="p-3 w-[20rem]">
            {report.office_target && report.office_target.length > 45
              ? `${report.office_target.substring(0, 35)}...`
              : report.office_target || "N/A"}
          </div>
          <div className="p-4 w-[8rem]">
            {report.key_performance_indicator &&
            report.key_performance_indicator.length > 20
              ? `${report.key_performance_indicator.substring(0, 20)}...`
              : report.key_performance_indicator || "N/A"}
          </div>
          <div className="p-4 w-[10rem]">{truncateString(report?.actions || "...", 8)}</div>
          <div className="p-4 w-[10rem]">{report?.budget || "..."}</div>
          <div className="p-4 w-[10rem]">{truncateString(report?.incharge || "...",8)}</div>
          <div className="p-4 w-[10rem] text-center">
            <span className="text-start mr-2">
              {report.actual_performance}
            </span>
            <span className="text-center">|</span>
            <span className="text-end ml-2">{report.target_performance}</span>
          </div>
          <div className="p-4 w-[5rem]">{truncateString(report?.ofi || "...",4)}</div>
          <div className="p-4 w-[13rem]">
            {report.evidence_link ? (
              <a href={report.evidence_link} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">
                {report.evidence_link.length > 20
                  ? `${report.evidence_link.substring(0, 15)}...`
                  : report.evidence_link}
              </a>
            ) : (
              "..."
            )}
          </div>
          <div className="ml-5 w-[5rem] flex items-center text-orange-700">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
                onClick={() => handleEditReport(report)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-10 h-[48rem] w-[85rem] items-center justify-center">
            <div className="flex flex-row items-center justify-center gap-10">
              <h2 className="text-2xl mb-5 mt-[1rem] font-semibold">
                Internal
              </h2>
              <button
                onClick={handleCloseModal}
                className="ml-[68rem] mt-[-3rem] text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-row gap-16 mb-5 items-center justify-center">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Code
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  disabled
                  type="text"
                  value={internalTargetCode}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  KPI
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  disabled
                  type="text"
                  value={internalKPI}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Budget
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={internalBudget}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) =>
                    setInternalBudget(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            <div className="flex flex-row gap-16 mb-5 ml-8">
              
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  In Charge
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={internalIncharge}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setInternalIncharge(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Performance (Actual | Target)
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  disabled
                  type="text"
                  value={
                    internalActualPerformance +
                    " | " +
                    internalTargetPerformance
                  }
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Link of Evidence
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input 
                  type="text"
                  value={internalEvidenceLink}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setInternalEvidenceLink(e.target.value)}
                />
              </div>
            </div>

            <div className=" mt-5 flex flex-row gap-36 items-center justify-center">
              <div className="flex flex-col">
                  <span className="mr-3 break-words font-regular text-md text-[#000000]">
                    Office Target
                    <span className="text-[#DD1414]">*</span>
                  </span>
                  <textarea
                    value={internalOfficeTarget}
                    className="text-lg font-regular border border-gray-300 bg-gray-50 w-[76.8rem] h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    disabled
                  />
                </div>
              </div>
            <div className=" mt-5 flex flex-row gap-36 items-center justify-center">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Actions
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={internalActions}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[76.8rem] h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setInternalActions(e.target.value)}
                />
              </div>
            </div>
            <div className=" mt-5 flex flex-row gap-36 items-center justify-center">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  OFI
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={internalOFI}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[76.8rem] h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setInternalOFI(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-row justify-center mt-10 gap-8">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-[#ffffff] text-[1.2rem] border border-[#A43214] text-[#A43214] font-semibold hover:bg-[#A43214] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-[9rem]"
              >
                Cancel
              </button>
              {isPrimaryReport ? ( 
            <button
              onClick={handleSavePrimaryReport} 
              className="text-[#ffffff] font-semibold px-4 py-2 mt-4 rounded-lg w-40"
              style={{
                background: "linear-gradient(to left, #8a252c, #AB3510)",
              }}
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleSaveReport} 
              className="text-[#ffffff] font-semibold px-4 py-2 mt-4 rounded-lg w-40"
              style={{
                background: "linear-gradient(to left, #8a252c, #AB3510)",
              }}
            >
              Save
            </button>
          )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportInternal;
