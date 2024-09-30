"use client";
import Navbar from "../components/Navbar";
import React, { useState, useEffect, use } from "react";
import ReportFinancial from "../components/ReportFinancial";
import ReportLearning from "../components/ReportLearning";
import ReportStakeholder from "../components/ReportStakeholder";
import ReportInternal from "../components/ReportInternal";
import ReportFinancialView from "../components/ReportFinancialView";
import ReportStakeholderView from "../components/ReportStakeholderView";
import ReportInternalView from "../components/ReportInternalView";
import ReportLearningView from "../components/ReportLearningView";
import { useSession } from "next-auth/react";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import the autoTable plugin

// Type declaration for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}


const ReportsPage = () => {
  const { data: session, status, update } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  // State to manage the current view
  const [currentView, setCurrentView] = useState("default");
  const [selectedComponent, setSelectedComponent] = useState("");

  //Report Financial
  const [financialReports, setFinancialReports] = useState<ReportFinancialView[]>([]);

  //Report Stakeholder
  const [stakeholderReports, setStakeholderReport] = useState<ReportStakeholderView[]>([]);

  //Report Internal
  const [internalReports, setInternalReports] = useState<ReportInternalView[]>([]);
 
  //Report Learning
  const [learningReports, setLearningReports] = useState<ReportLearningView[]>([]);

  const [preparedByName, setPreparedByName] = useState("");
  const [preparedByRole, setPreparedByRole] = useState("");
  const [acknowledgedByName, setAcknowledgedByName] = useState("");
  const [acknowledgedByRole, setAcknowledgedByRole] = useState("");
  const [reviewedByName, setReviewedByName] = useState("");
  const [reviewedByRole, setReviewedByRole] = useState("");

  const [department, setDepartment] = useState("");
  const [headOfficer, setHeadOfficer] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/department/${department_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data); // Add this line to log the received data
          setDepartment(data.department_name);
          setHeadOfficer(data.head_officer);
          setDepartmentLandline(data.department_landline);
          setLocation(data.location);
          setEmail(data.email);
          setUniversity(data.university);
          setDepartmentDescription(data.description);
          setPreparedByName(data.preparedByName || '');
          setPreparedByRole(data.preparedByRole || '');
          setAcknowledgedByName(data.acknowledgedByName || '');
          setAcknowledgedByRole(data.acknowledgedByRole || '');
          setReviewedByName(data.reviewedByName || '');
          setReviewedByRole(data.reviewedByRole || '');
        } else {
          console.error(
            "Error fetching user profile data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }

    };
    fetchUserProfileData();
  }, [department_id]);

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (isEditing) {
      try {
        const res = await fetch(`http://localhost:8080/department/update/${department_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            head_officer: headOfficer,
            department_landline: departmentLandline,
            location: location,
            email: email,
            university: university,
            description: departmentDescription,
            preparedByName: preparedByName,
            preparedByRole: preparedByRole,
            acknowledgedByName: acknowledgedByName,
            acknowledgedByRole: acknowledgedByRole,
            reviewedByName: reviewedByName,
            reviewedByRole: reviewedByRole,
            department_id: department_id,
          }),
        });

        if (res.ok) {
          console.log("Edit successful");
          setIsEditing(false);
        } else {
          console.log("User profile update failed.");
        }
      } catch (error) {
        console.log("Error during saving user Profile", error);
      }
    } else {
      setIsEditing(true);
    }
  };
  

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
      const completeFinancialReports = financialData.filter(
        (report: any) =>
          report.target_code &&
          report.office_target &&
          report.key_performance_indicator &&
          report.actions &&
          report.budget &&
          report.incharge &&
          report.actual_performance !== null &&
          report.target_performance !== null &&
          report.ofi
      );

      setFinancialReports(completeFinancialReports);

        const stakeholderResponse = await fetch(
          `http://localhost:8080/bsc/stakeholder/get/${department_id}`
        );
        if (!stakeholderResponse.ok) {
          throw new Error("Failed to fetch stakeholder reports");
        }
        const stakeholderData = await stakeholderResponse.json();
        const completeStakeholderReports = stakeholderData.filter(
          (report: any) =>
            report.target_code &&
            report.office_target &&
            report.key_performance_indicator &&
            report.actions &&
            report.budget &&
            report.incharge &&
            report.actual_performance !== null &&
            report.target_performance !== null &&
            report.ofi
        );
  
        setStakeholderReport(completeStakeholderReports);
  

        //Fetch internal reports
        const internalResponse = await fetch(
          `http://localhost:8080/bsc/internal/get/${department_id}`
        );
        if (!internalResponse.ok) {
          throw new Error("Failed to fetch internal reports");
        }
        const internalData = await internalResponse.json();
        setInternalReports(internalData);
        const completeInternalReports = internalData.filter(
          (report: any) =>
            report.target_code &&
            report.office_target &&
            report.key_performance_indicator &&
            report.actions &&
            report.budget &&
            report.incharge &&
            report.actual_performance !== null &&
            report.target_performance !== null &&
            report.ofi
        );
  
        setInternalReports(completeInternalReports);
  
        //Fetch learning reports
        const learningResponse = await fetch(
          `http://localhost:8080/bsc/learning/get/${department_id}`
        );
        if (!learningResponse.ok) {
          throw new Error("Failed to fetch learning reports");
        }
        const learningData = await learningResponse.json();
        const completeLearningReports = learningData.filter(
          (report: any) =>
            report.target_code &&
            report.office_target &&
            report.key_performance_indicator &&
            report.actions &&
            report.budget &&
            report.incharge &&
            report.actual_performance !== null &&
            report.target_performance !== null &&
            report.ofi
        );
        setLearningReports(completeLearningReports);
       } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    getReports(department_id);
  }, [department_id]);
   
  const handleDownload = async () => {
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
      
      const transformedFinancial = transformData(financialReports).map((report) => ({
        "Target Code": report["Target Code"],
        "Office Target": report["Office Target"],
        KPI: report.KPI,
        Actions: report.Actions,
        Budget: report.Budget,
        "In-charge": report["In-charge"],
        "Actual Performance": report["Actual Performance"],
        "Target Performance": report["Target Performance"],
        OFI: report.OFI,
      }));

      const transformedStakeholder = transformData(stakeholderReports).map((report) => ({
        "Target Code": report["Target Code"],
        "Office Target": report["Office Target"],
        KPI: report.KPI,
        Actions: report.Actions,
        Budget: report.Budget,
        "In-charge": report["In-charge"],
        "Actual Performance": report["Actual Performance"],
        "Target Performance": report["Target Performance"],
        OFI: report.OFI,
      }));

      const transformedInternal = transformData(internalReports).map((report) => ({
        "Target Code": report["Target Code"],
        "Office Target": report["Office Target"],
        KPI: report.KPI,
        Actions: report.Actions,
        Budget: report.Budget,
        "In-charge": report["In-charge"],
        "Actual Performance": report["Actual Performance"],
        "Target Performance": report["Target Performance"],
        OFI: report.OFI,
      }));
       

      const transformedLearning = transformData(learningReports).map((report) => ({
        "Target Code": report["Target Code"],
        "Office Target": report["Office Target"],
        KPI: report.KPI,
        Actions: report.Actions,
        Budget: report.Budget,
        "In-charge": report["In-charge"],
        "Actual Performance": report["Actual Performance"],
        "Target Performance": report["Target Performance"],
        OFI: report.OFI,
      }));


    const doc = new jsPDF(); 
    let startY = 5; 

    const addSection = (reportTitle: string, reportData: any[]) => {
      
      doc.setFontSize(9);
    
      // Render the report title and update the starting Y position
      doc.setFont('Helvetica', 'bold'); 
      doc.text(reportTitle, 15, startY + 10); // Render title at 'startY + 5'
      
      
      // Update startY so that the table starts below the title
      startY += 15; // Adjust the value as needed to avoid overlap
      
      // Generate the table
      autoTable(doc, {
        head: [headers],
        body: reportData.map((row) => Object.values(row)),
        startY: startY, // Ensure the table starts after the title
        didDrawCell: (data: any) => {
          if (data.section === 'body' && data.row.index === reportData.length - 1) {
            startY = data.cell.y + data.cell.height + 5;
          }
        },
        headStyles: {
          fontSize: 7,
          fontStyle: 'bold',
          fillColor: "#A43214",
          textColor: [245, 245, 17],
          halign: 'center',
          lineColor: [0, 0, 0],  // Black border
          lineWidth: 0.1,        // Border thickness
        },
        bodyStyles: {
          fontSize: 7,
          fontStyle: 'normal',
          lineColor: [0, 0, 0],  // Black border
          lineWidth: 0.1,        // Border thickness
        },
      });
    };
    
    
    addSection("FINANCIAL PERSPECTIVE", transformedFinancial);
    addSection("STAKEHOLDER PERSPECTIVE", transformedStakeholder);
    addSection("INTERNAL PERSPECTIVE", transformedInternal);
    addSection("LEARNING AND GROWTH PERSPECTIVE", transformedLearning);
  
      doc.save("report.pdf");
  };


  return (
    <div className="flex flex-row w-full text-[rgb(59,59,59)]">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <div className="flex flex-row">
          <div className="mb-5 mt-[0rem] break-words font-bold text-[3rem]">
            REPORT
          </div>
          <div className="flex justify-center lg:ml-[76rem] mt-[0.5rem] border border-gray-200 bg-gray w-[16rem] h-[4rem] rounded-xl gap-2 px-1 py-1 text-md font-medium">
            <button
              onClick={() => setCurrentView("default")}
              className={`rounded-lg font-bold ${
                currentView === "default"
                  ? "bg-[#A43214] text-white"
                  : "border text-[#A43214]"
              } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
            >
              DEFAULT
            </button>
            <button
              onClick={() => setCurrentView("printed")}
              className={`rounded-lg font-bold ${
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
            <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              {selectedComponent === "Financial" && <ReportFinancial />}
              {selectedComponent === "Stakeholder" && <ReportStakeholder />}
              {selectedComponent === "Internal" && <ReportInternal />}
              {selectedComponent === "Learning" && <ReportLearning />}
            </div>
          </div>
        )}
        {currentView === "printed" && (
          <div>
            <div className="flex flex-row gap-8 w-[100%] mb-16">
              <div className="flex shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] mt-[0.5rem] border py-5 px-5 border-gray-200 bg-gray w-[48%] h-[auto] rounded-xl">
                <div className="flex flex-col">
                  <span className="font-bold text-2xl items-center mb-5">
                    REPORT VISUALIZATION
                  </span>
                  {/* insert the chart here */}
                </div>
              </div>
              <div className="flex mt-[0.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-200 bg-gray w-[48%] h-[auto] rounded-xl px-8 py-5">
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <span className="font-bold text-2xl items-center mb-5">
                      APPROVAL SECTION
                    </span>
                    <div className="justify-end ml-[23rem]">
                      <button
                        onClick={handleSave}
                        className="text-white bg-[#A43214] w-[8rem] inline-block break-words font-bold transition-all rounded-lg px-4 py-2"
                      >
                        {isEditing ? 'Save' : 'Edit'}
                      </button>
                    </div>
                  </div>
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <span className="font-normal text-[1.1rem]">Prepared By:</span>
                    <div className="flex flex-row mt-1 gap-10">
                    <input 
                      type="text" 
                      placeholder="Enter name"
                      name="preparedByName" 
                      value={preparedByName}
                      onChange={(e) => setPreparedByName(e.target.value)}
                      readOnly={!isEditing}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[28rem]" 
                    />
                    <input 
                      type="text" 
                      placeholder="Enter role"
                      name="preparedByRole" 
                      value={preparedByRole}
                      onChange={(e) => setPreparedByRole(e.target.value)}
                      readOnly={!isEditing}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[16rem]" 
                    />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-8">
                    <span className="font-normal text-[1.1rem]">Acknowledged By:</span>
                    <div className="flex flex-row mt-1 gap-10">
                    <input 
                      type="text" 
                      placeholder="Enter name"
                      name="acknowledgedByName" 
                      value={acknowledgedByName}
                      onChange={(e) => setAcknowledgedByName(e.target.value)}
                      readOnly={!isEditing}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[28rem]" 
                    />
                    <input 
                      type="text" 
                      placeholder="Enter role"
                      name="acknowledgedByRole" 
                      value={acknowledgedByRole}
                      onChange={(e) => setAcknowledgedByRole(e.target.value)}
                      readOnly={!isEditing}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[16rem]" 
                    />
                    </div>
                  </div>
                  <div className="flex flex-col mt-8">
                    <span className="font-normal text-[1.1rem]">Reviewed By:</span>
                    <div className="flex flex-row mt-1 gap-10">
                    <input 
                      type="text" 
                      placeholder="Enter name"
                      name="reviewedByName" 
                      value={reviewedByName}
                      onChange={(e) => setReviewedByName(e.target.value)}
                      readOnly={!isEditing}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[28rem]" 
                    />
                    <input 
                      type="text" 
                      placeholder="Enter role"
                      name="reviewedByRole"
                      value={reviewedByRole}
                      onChange={(e) => setReviewedByRole(e.target.value)}
                      readOnly={!isEditing}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[16rem]" 
                    />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
             {<ReportFinancialView/>}
             {<ReportStakeholderView/>}
             {<ReportInternalView/>}
             {<ReportLearningView/>}

            </div>
          </div>
        )}


        {currentView === "printed" && (
  
          <div className="flex flex-row justify-end items-end mr-8 mb-10">
            <button
              onClick={handleDownload}
              className=" text-[#A43214]
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
