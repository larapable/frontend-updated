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
import {Modal } from "@mui/material";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import the autoTable plugin
import { report } from "process";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Type declaration for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}


const ReportsPage = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
 

  // State to manage the current view
  const [currentView, setCurrentView] = useState("default");
  const [selectedComponent, setSelectedComponent] = useState("");

  //Report Financial
  const [financialReports, setFinancialReports] = useState<ReportFinancialView[]>([]);

  //Report Stakeholder
  const [stakeholderReports, setStakeholderReports] = useState<ReportStakeholderView[]>([]);

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


  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialSavePerformed, setInitialSavePerformed] = useState(false);
  const [chartData, setChartData] = useState({
    labels: ["Financial", "Stakeholder", "Internal", "Learning"],
    datasets: [
      {
        label: "Number of Reports",
        data: [0, 0, 0, 0], 
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });


  useEffect(() => {
    const fetchApproval = async () => {
      try {
        const res = await fetch(`http://localhost:8080/approval/get/${department_id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch approval data");
        }
        const data = await res.json();
        
        if (data.length > 0) {
          const approvalData = data[0]; // Access the first object in the array
          console.log("Approval data received:", approvalData);
  
          setPreparedByName(approvalData.preparedByName);
          setPreparedByRole(approvalData.preparedByRole);
          setAcknowledgedByName(approvalData.acknowledgedByName);
          setAcknowledgedByRole(approvalData.acknowledgedByRole);
          setReviewedByName(approvalData.reviewedByName);
          setReviewedByRole(approvalData.reviewedByRole);
          setIsReadOnly(true); 
          setInitialSavePerformed(true);
        } else {
          console.log("No approval data found.");
        }
      } catch (error) {
        console.error("Error fetching approval data:", error);
      }
    };
  
    if (department_id) {
      fetchApproval();
    }
  }, [department_id]);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default action of the button
  
    if (
      !preparedByName ||
      !preparedByRole ||
      !acknowledgedByName ||
      !acknowledgedByRole ||
      !reviewedByName ||
      !reviewedByRole
    ) {
      setModalMessage('Please fill in all required fields.');
      setShowModal(true);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/approval/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preparedByName,
          preparedByRole,
          acknowledgedByName,
          acknowledgedByRole,
          reviewedByName,
          reviewedByRole,
          department: { id: department_id },
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to insert approval details.");
      }
  
      setModalMessage('Approval details registered successfully!');
      setShowModal(true);
      setIsReadOnly(true); // Disable the fields after saving
      setInitialSavePerformed(true);
    } catch (error) {
      console.error("Error:", error);
      setModalMessage('An error occurred while registering the approval details. Please try again later.');
      setShowModal(true);
    }
  };
  

  const handleCancelSave = () => {
    setShowModal(false);
  };

  
  const handleEditSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
 
    if (isEditing) {
      setIsReadOnly(true); // Set to read-only when done editing
      try {
        const res = await fetch(`http://localhost:8080/approval/update/${department_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preparedByName: preparedByName,
            preparedByRole: preparedByRole,
            acknowledgedByName: acknowledgedByName,
            acknowledgedByRole: acknowledgedByRole,
            reviewedByName: reviewedByName,
            reviewedByRole: reviewedByRole,
            department: { id: department_id },
          }),
        });
 
        if (res.ok) {
          console.log("Edit successful");
          setIsEditing(false);
        } else {
          console.log("Approval profile update failed.");
        }
      } catch (error) {
        console.log("Error during saving Approval", error);
      }
    } else {
      setIsEditing(true); // Enable editing mode
      setIsReadOnly(false); // Set fields to editable
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
  
        // Fetch primary financial reports
        const primaryFinancialResponse = await fetch(
          `http://localhost:8080/bsc/primaryFinancialBsc/get/${department_id}`
        );
        if (!primaryFinancialResponse.ok) {
          throw new Error("Failed to fetch primary financial reports");
        }
        const primaryFinancialData = await primaryFinancialResponse.json();
  
        // Filter out incomplete reports from both sources
        const completeFinancialReports = [
          ...financialData.filter(
            (report: any) =>
              // report.target_code &&
              report.office_target &&
              report.key_performance_indicator &&
              // report.actions &&
              // report.budget &&
              report.incharge &&
              report.actual_performance !== null &&
              report.target_performance !== null &&
              report.evidence_link
              
          ),
          ...primaryFinancialData.filter(
            (report: any) =>
              // report.target_code &&
              report.office_target &&
              report.key_performance_indicator &&
              // report.actions &&
              // report.budget &&
              report.incharge &&
              report.actual_performance !== null &&
              report.target_performance !== null  &&
              report.evidence_link
              // report.ofi
          ),
        ];
  
        // Set the combined reports into a single state
        setFinancialReports(completeFinancialReports); 
        
        const stakeholderResponse = await fetch(
          `http://localhost:8080/bsc/stakeholder/get/${department_id}`
        );
        if (!stakeholderResponse.ok) {
          throw new Error("Failed to fetch stakeholder reports");
        }
        const stakeholderData = await stakeholderResponse.json();

         // Fetch primary stakeholder reports
         const primaryStakeholderResponse = await fetch(
          `http://localhost:8080/bsc/primaryStakeholderBsc/get/${department_id}`
        );
        if (!primaryStakeholderResponse.ok) {
          throw new Error("Failed to fetch primary stakeholder reports");
        }
        const primaryStakeholderData = await primaryStakeholderResponse.json();

        // Filter out incomplete reports from both sources
        const completeStakeholderReports = [
          ...stakeholderData.filter(
            (report: any) =>
              // report.target_code &&
              report.office_target &&
              report.key_performance_indicator &&
              // report.actions &&
              // report.budget &&
              report.incharge &&
              report.actual_performance !== null &&
              report.target_performance !== null &&
              report.evidence_link
              // report.ofi
          ),
          ...primaryStakeholderData.filter(
            (report: any) =>
              // report.target_code &&
              report.office_target &&
              report.key_performance_indicator &&
              // report.actions &&
              // report.budget &&
              report.incharge &&
              report.actual_performance !== null &&
              report.target_performance !== null &&
              report.evidence_link
              // report.ofi
          ),
        ];
  
        // Set the combined reports into a single state
        setStakeholderReports(completeStakeholderReports); 
  

        //Fetch internal reports
        const internalResponse = await fetch(
          `http://localhost:8080/bsc/internal/get/${department_id}`
        );
        if (!internalResponse.ok) {
          throw new Error("Failed to fetch internal reports");
        }
        const internalData = await internalResponse.json();

        // Fetch primary stakeholder reports
        const primaryInternalResponse = await fetch(
          `http://localhost:8080/bsc/primaryInternalBsc/get/${department_id}`
        );
        if (!primaryInternalResponse.ok) {
          throw new Error("Failed to fetch primary Internal reports");
        }
        const primaryInternalData = await primaryInternalResponse.json();
     
       // Filter out incomplete reports from both sources
       const completeInternalReports = [
        ...internalData.filter(
          (report: any) =>
            // report.target_code &&
            report.office_target &&
            report.key_performance_indicator &&
            // report.actions &&
            // report.budget &&
            report.incharge &&
            report.actual_performance !== null &&
            report.target_performance !== null &&
            report.evidence_link
            // report.ofi
        ),
        ...primaryInternalData.filter(
          (report: any) =>
            // report.target_code &&
            report.office_target &&
            report.key_performance_indicator &&
            // report.actions &&
            // report.budget &&
            report.incharge &&
            report.actual_performance !== null &&
            report.target_performance !== null &&
            report.evidence_link
            // report.ofi
        ),
      ];

  
        setInternalReports(completeInternalReports);
  
        //Fetch learning reports
        const learningResponse = await fetch(
          `http://localhost:8080/bsc/learning/get/${department_id}`
        );
        if (!learningResponse.ok) {
          throw new Error("Failed to fetch learning reports");
        }
        const learningData = await learningResponse.json();

         // Fetch primary stakeholder reports
         const primaryLearningResponse = await fetch(
          `http://localhost:8080/bsc/primaryLearningBsc/get/${department_id}`
        );
        if (!primaryLearningResponse.ok) {
          throw new Error("Failed to fetch primary learning reports");
        }
        const primaryLearningData = await primaryLearningResponse.json();

        // Filter out incomplete reports from both sources
       const completeLearningReports = [
        ...learningData.filter(
          (report: any) =>
            // report.target_code &&
            report.office_target &&
            report.key_performance_indicator &&
            // report.actions &&
            // report.budget &&
            report.incharge &&
            report.actual_performance !== null &&
            report.target_performance !== null &&
            report.evidence_link
            // report.ofi
        ),
        ...primaryLearningData.filter(
          (report: any) =>
            // report.target_code &&
            report.office_target &&
            report.key_performance_indicator &&
            // report.actions &&
            // report.budget &&
            report.incharge &&
            report.actual_performance !== null &&
            report.target_performance !== null &&
            report.evidence_link
            // report.ofi
        ),
      ];
        setLearningReports(completeLearningReports);
        console.log(completeLearningReports)

        setChartData({
          ...chartData,
          datasets: [
            {
              ...chartData.datasets[0], 
              data: [
                completeFinancialReports.length,
                completeStakeholderReports.length,
                completeInternalReports.length,
                completeLearningReports.length,
              ],
            },
          ],
        });

       } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    getReports(department_id);
  }, [department_id]);

   
  const handleDownload = async () => {
    const headers = [
      "Office Target",
      "KPI",
      "In-charge",
      "Actual Performance",
      "Target Performance",
      "Year",
      "Link of Evidence",
      ];

      const transformData = (data: any[]) => {
        return data.map((report) => ({
          // "Target Code": report.target_code,
          "Office Target": report.office_target,
          KPI: report.key_performance_indicator,
          // Actions: report.actions,
          // Budget: report.budget,
          "In-charge": report.incharge,
          "Actual Performance": report.actual_performance,
          "Target Performance": report.target_performance,
          "Link of Evidence": report.evidence_link
          // OFI: report.ofi,
        }));
      };
      
      const transformedFinancial = transformData(financialReports).map((report) => ({
        // "Target Code": report["Target Code"],
        "Office Target": report["Office Target"],
        KPI: report.KPI,
        // Actions: report.Actions,
        // Budget: report.Budget,
        "In-charge": report["In-charge"],
        "Actual Performance": report["Actual Performance"],
        "Target Performance": report["Target Performance"],
        "Link of Evidence": report["Link of Evidence"]
        
        // OFI: report.OFI,
      }));

      const transformedStakeholder = transformData(stakeholderReports).map((report) => ({
        // "Target Code": report["Target Code"],
        "Office Target": report["Office Target"],
        KPI: report.KPI,
        // Actions: report.Actions,
        // Budget: report.Budget,
        "In-charge": report["In-charge"],
        "Actual Performance": report["Actual Performance"],
        "Target Performance": report["Target Performance"],
        "Link of Evidence": report["Link of Evidence"]
        // OFI: report.OFI,
      }));

      const transformedInternal = transformData(internalReports).map((report) => ({
        // "Target Code": report["Target Code"],
        "Office Target": report["Office Target"],
        KPI: report.KPI,
        // Actions: report.Actions,
        // Budget: report.Budget,
        "In-charge": report["In-charge"],
        "Actual Performance": report["Actual Performance"],
        "Target Performance": report["Target Performance"],
        "Link of Evidence": report["Link of Evidence"]
        // OFI: report.OFI,
      }));
       

      const transformedLearning = transformData(learningReports).map((report) => ({
        // "Target Code": report["Target Code"],
        "Office Target": report["Office Target"],
        KPI: report.KPI,
        // Actions: report.Actions,
        // Budget: report.Budget,
        "In-charge": report["In-charge"],
        "Actual Performance": report["Actual Performance"],
        "Target Performance": report["Target Performance"],
        "Link of Evidence": report["Link of Evidence"]
        // OFI: report.OFI,
      }));


    const doc = new jsPDF(); 
    let startY = 5; 

    const imgProps = doc.getImageProperties('/cit.png'); // Replace with your image path
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;


doc.addImage('/cit.png', 'PNG', 10, 5, 20, 20); // Adjust position and size as needed
doc.setFont('Helvetica','bold');
doc.setFontSize(8); // Adjust font size as needed
doc.text("CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY", 35, 10);
doc.text("CENTER FOR ELEARNING AND TECHNOLOGY", 35, 15);
doc.setFontSize(6);
doc.setFont('Helvetica','bold');
doc.text("office email address | office local number", 35, 20);
doc.setFontSize(9);
doc.setFont('Helvetica','bold');
doc.setTextColor(170, 0, 0); // Set text color to dark red or adjust
doc.text("BALANCED SCORECARD (BSC)", 35, 25); 
doc.setTextColor(0, 0, 0); // Reset text color to black

startY = 40;

    const addSection = (reportTitle: string, reportData: any[]) => {
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'bold'); 
      doc.text(reportTitle, 15, startY + 10);
    
      startY += 15; 
      
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
          fontSize: 8,
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
          lineWidth: 0.1,  
          halign: 'center',       // Border thickness
        },
        columnStyles: {
          0: { cellWidth: 40 }, // "Office Target" (index 0)
          1: { cellWidth: 35 }, // KPI (index 1)
          2: { cellWidth: 30 }, // "In-charge" (index 2)
          3: { cellWidth: 20 }, // "Actual Performance" (index 3)
          4: { cellWidth: 20 }, // "Target Performance" (index 4)
          5: { cellWidth: 10 }, // "Year" (index 5)
          6: { cellWidth: 20 }, // "Link of Evidence" (index 6)
        },
      });
    };
    
    
    
    addSection("STAKEHOLDER PERSPECTIVE", transformedStakeholder);
    addSection("INTERNAL PERSPECTIVE", transformedInternal);
    addSection("LEARNING AND GROWTH PERSPECTIVE", transformedLearning);
    console.log("transformed :", transformedLearning);
    addSection("FINANCIAL PERSPECTIVE", transformedFinancial);
  
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
            <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
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
                  <div style={{ height: "300px", width: "800px" }}> 
                    {chartData && (
                      <Bar
                        data={chartData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: "top" as const,
                            },
                            title: {
                              display: false,
                              text: "Report Visualization",
                            },
                          },
                          elements: { 
                            bar: {
                              backgroundColor: [ 
                                "#b83216",
                                "rgba(253, 227, 167, 1)",
                                "#b83216",
                                "rgba(253, 227, 167, 1)"
                              ],
                              borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(249, 105, 14, 1)",
                                "rgba(249, 105, 14, 1)",
                                "rgba(249, 105, 14, 1)"
                              ],
                              borderWidth: 1,
                              borderRadius: 10,
                            }
                          }, 
                          datasets: {
                            bar: {
                              barPercentage: 1.3, // Make bars narrower
                              categoryPercentage: 0.6, // Increase space between categories 
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                lineWidth: 1,
                                color: 'white', 
                              }
                            },
                            y: {
                              grid: {
                                lineWidth: 1, 
                                color: 'rgba(0, 0, 0, 0.2)',
                              }
                            }
                          }
                        }}
                      />
                    )}
                  </div>

                </div>
              </div>
              <div className="flex mt-[0.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-200 bg-gray w-[48%] h-[auto] rounded-xl px-8 py-5">
                <div className="flex flex-col">
                  <div className="flex flex-row break-words">
                    <span className="font-bold text-2xl items-center mb-5">
                      APPROVAL SECTION
                    </span>
                    <div className="justify-end ml-[26rem]">
                      {!initialSavePerformed && (
                        <button onClick={handleSave} disabled={isReadOnly} className="bg-[#A43214] py-2 px-5 rounded-md transition-all  text-white font-medium">Save</button>
                      )}
                      {(initialSavePerformed || isReadOnly) && (
                        <button onClick={handleEditSave} className="bg-[#A43214] py-2 px-5 rounded-md transition-all  text-white font-medium">
                          {isEditing ? 'Save' : 'Edit'}
                        </button>
                      )}

                      

                      {/* Modal */}
                      <Modal open={showModal} onClose={() => setShowModal(false)}>
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
                            <button
                              onClick={handleCancelSave}
                              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
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
                            <p className="text-3xl font-bold mb-4">Notice!</p>
                            <p className="text-xl mb-4 mt-10">
                              {modalMessage}
                            </p>
                            <div className="flex justify-center gap-10 mt-12 mb-10">
                              <button
                                onClick={() => setShowModal(false)}
                                className="rounded-[0.6rem] text-[#ffffff] font-medium text-lg py-2 px-3 w-36 h-[fit-content]"
                                style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </Modal>
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
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[28rem]" 
                    />
                    <input 
                      type="text" 
                      placeholder="Enter role"
                      name="preparedByRole" 
                      value={preparedByRole}
                      onChange={(e) => setPreparedByRole(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
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
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[28rem]" 
                    />
                    <input 
                      type="text" 
                      placeholder="Enter role"
                      name="acknowledgedByRole" 
                      value={acknowledgedByRole}
                      onChange={(e) => setAcknowledgedByRole(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
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
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[28rem]" 
                    />
                    <input 
                      type="text" 
                      placeholder="Enter role"
                      name="reviewedByRole"
                      value={reviewedByRole}
                      onChange={(e) => setReviewedByRole(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
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
