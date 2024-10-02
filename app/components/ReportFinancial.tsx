"use client";
import {
  Button,
  Card,
  Modal,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

interface ReportFinancial {
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

const ReportFinancial = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  const username = user?.username;
  // Values for report
  const [financialPerspective, setFinancialPerspective] = useState("financial");
  const [financialActions, setFinancialActions] = useState("");
  const [financialBudget, setFinancialBudget] = useState<number>(0);
  const [financialIncharge, setFinancialIncharge] = useState("");
  const [financialOfi, setFinancialOfi] = useState("");

  const [financialTargetCode, setFinancialTargetCode] = useState("");
  const [financialOfficeTarget, setFinancialOfficeTarget] = useState("");
  const [financialKPI, setFinancialKPI] = useState("");
  const [financialActualPerformance, setFinancialActualPerformance] =
    useState("");
  const [financialTargetPerformance, setFinancialTargetPerformance] =
    useState("");

  const [financialEvidenceLink, setFinancialEvidenceLink] = useState(""); //link

  //Report and Scorecard
  const [financialReports, setFinancialReports] = useState<ReportFinancial[]>([]);
  const [primaryFinancialReports, setPrimaryFinancialReports] = useState<ReportFinancial[]>([]);
  const allFinancialReports = [ ...primaryFinancialReports, ...financialReports,];
  const [isPrimaryReport, setIsPrimaryReport] = useState(false); 

  // Modal and edit mode
  const [openModal, setOpenModal] = useState(false); // State to control the modal
  const [reportEditId, setReportEditId] = useState(0); // State to store the report edit ID

  useEffect(() => {
    const getAllFinancial = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial reports");
        }
        const data = await response.json();
        console.log("response data:", data);
        setFinancialReports(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching financial reports:", error);
      }
    };

    getAllFinancial(department_id);
  }, [department_id]);
  
          useEffect(() => {
            const getPrimaryFinancial = async (department_id: number) => {
              if (!department_id) {
                console.log("Department ID is not found.");
                return;
              }

              try {
                const res = await fetch (
                  `http://localhost:8080/bsc/primaryFinancialBsc/get/${department_id}`
                );
                if(!res.ok) {
                  throw new Error ("Failed to fetch primary financial report.")
                }
                const result = await res.json();
                console.log("response data:", result);
                setPrimaryFinancialReports(result);
                console.log(result);
              } catch (error){
                console.error("Error fetching financial reports:", error);
              }
            };
            getPrimaryFinancial(department_id);
          },[department_id]);
   

  function truncateString(str: string | null | undefined, num: number): string {
    if (!str) {
      return ""; 
    }
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }
  

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  const handleEditReport = (report: ReportFinancial) => {
    const isPrimary = primaryFinancialReports.some((p) => p.id === report.id);
    setIsPrimaryReport(isPrimary); 
    if (isPrimary) {
      handleEditPrimaryReport(report);
    } else {
      handleEditFinancialReport(report);
    }
  };


  const handleEditFinancialReport = (report: ReportFinancial) => {
    setFinancialTargetCode(report.target_code);
    setFinancialOfficeTarget(report.office_target);
    setFinancialKPI(report.key_performance_indicator);
    setFinancialActualPerformance(report.actual_performance || "0");
    setFinancialTargetPerformance(report.target_performance || "0");
    setReportEditId(report.id);
    setFinancialPerspective(report.perspective);
    setFinancialActions(report.actions);
    setFinancialBudget(report.budget);
    setFinancialIncharge(report.incharge);
    setFinancialOfi(report.ofi);
    setFinancialEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit:", reportEditId);
  };

  
  const handleEditPrimaryReport = (report: ReportFinancial) => {
    setFinancialTargetCode(report.target_code);
    setFinancialOfficeTarget(report.office_target);
    setFinancialKPI(report.key_performance_indicator);
    setFinancialActualPerformance(report.actual_performance || "0");
    setFinancialTargetPerformance(report.target_performance || "0");
    setReportEditId(report.id);
    setFinancialPerspective(report.perspective);
    setFinancialActions(report.actions);
    setFinancialBudget(report.budget);
    setFinancialIncharge(report.incharge);
    setFinancialOfi(report.ofi);
    setOpenModal(true);
    console.log("Report ID to edit:", reportEditId);
  };

  const handleSaveReport = async () => {
    const updatedReport: ReportFinancial = {
      id: reportEditId,
      actions: financialActions,
      perspective: financialPerspective,
      budget: financialBudget,
      incharge: financialIncharge,
      ofi: financialOfi,
      target_code: financialTargetCode,
      office_target: financialOfficeTarget,
      key_performance_indicator: financialKPI,
      target_performance: financialTargetPerformance,
      actual_performance: financialActualPerformance,
      evidence_link: financialEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/financial/update/${reportEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReport),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update financial report");
      }
      // Update the financialReports state directly
      setFinancialReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportEditId ? updatedReport : report
        )
      );

      toast.success("Report updated successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating financial report:", error);
      toast.error("Failed to update report.");
    }
  };
   

  const handleSavePrimaryReport = async () => {
    const updatedPrimaryReport: ReportFinancial = {
      id: reportEditId,
      actions: financialActions,
      perspective: financialPerspective,
      budget: financialBudget,
      incharge: financialIncharge,
      ofi: financialOfi,
      target_code: financialTargetCode,
      office_target: financialOfficeTarget,
      key_performance_indicator: financialKPI,
      target_performance: financialTargetPerformance,
      actual_performance: financialActualPerformance,
      evidence_link: financialEvidenceLink, //link
    };

  try {
    const response = await fetch(
      `http://localhost:8080/bsc/primaryFinancialBsc/update/${reportEditId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPrimaryReport), 
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to update primary financial report.");
    }
    setPrimaryFinancialReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportEditId ? updatedPrimaryReport : report
      )
    );
  
    toast.success("Primary financial report updated successfully!");
    setOpenModal(false);
  } catch (error) {
    console.error("Error updating primary financial report:", error);
    toast.error("Failed to update report.");
  }
  };   

  return (
    <div>
      <div className="flex flex-row p-1 w-[75rem] h-auto">
        <img
          src="/financial.png"
          alt=""
          className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
        />
        <div className="flex flex-col">
          <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
            Financial Scorecard Overview
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

      {allFinancialReports.map((report, index) => (
        <div
          key={report.id}
          className={`flex items-center text-center ${
            index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
          }`}
        >
          {/* <div className="p-2 w-[10rem]">{report.target_code}</div> */}
          <div className="p-3 w-[20rem] ml-[-2rem]">
            {truncateString(report.office_target, 45)}
          </div>
          <div className="p-3 w-[8rem]">
            {truncateString(report.key_performance_indicator, 20)}
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
                Financial
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
                  value={financialTargetCode}
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
                  value={financialKPI}
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
                  value={financialBudget}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) =>
                    setFinancialBudget(parseFloat(e.target.value) || 0)
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
                  value={financialIncharge}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setFinancialIncharge(e.target.value)}
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
                    financialActualPerformance +
                    " | " +
                    financialTargetPerformance
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
                  value={financialEvidenceLink}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[23rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setFinancialEvidenceLink(e.target.value)}
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
                    value={financialOfficeTarget}
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
                  value={financialActions}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 w-[76.8rem] h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setFinancialActions(e.target.value)}
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
                    value={financialOfi}
                    className="text-lg font-regular border border-gray-300 bg-gray-50 w-[76.8rem] h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) => setFinancialOfi(e.target.value)}
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

export default ReportFinancial;
