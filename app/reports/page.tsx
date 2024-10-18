"use client";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import html2canvas from "html2canvas";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbars/Navbar";
import ReportFinancial from "../components/Report/ReportFinancial";
import ReportFinancialView from "../components/Report/ReportFinancialView";
import ReportInternal from "../components/Report/ReportInternal";
import ReportInternalView from "../components/Report/ReportInternalView";
import ReportLearning from "../components/Report/ReportLearning";
import ReportLearningView from "../components/Report/ReportLearningView";
import ReportStakeholder from "../components/Report/ReportStakeholder";
import ReportStakeholderView from "../components/Report/ReportStakeholderView";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import the autoTable plugin

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Type declaration for jsPDF with autoTable
declare module "jspdf" {
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
  const [financialReports, setFinancialReports] = useState<
    ReportFinancialView[]
  >([]);

  //Report Stakeholder
  const [stakeholderReports, setStakeholderReports] = useState<
    ReportStakeholderView[]
  >([]);

  //Report Internal
  const [internalReports, setInternalReports] = useState<ReportInternalView[]>(
    []
  );

  //Report Learning
  const [learningReports, setLearningReports] = useState<ReportLearningView[]>(
    []
  );

  const [image, setImage] = useState("");
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/image/getImage/${department_id}`
        );
        if (response.ok) {
          const { imageData, imageFormat } = await response.json();
          console.log(
            "Received image data:",
            imageData,
            "Image format:",
            imageFormat
          );

          if (!imageData || !imageFormat) {
            console.error(
              "Invalid image data or format:",
              imageData,
              imageFormat
            );
            return;
          }

          const image = `data:image/${imageFormat};base64,${imageData}`;
          setImage(image);
          console.log("Image URL:", image);
        } else {
          console.error("Error fetching image data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image data:", error);
      } finally {
      }
    };
    fetchImageData();
  }, [department_id]);

  function makeCircularImage(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (typeof document === "undefined") return;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get 2D rendering context"));
          return;
        }

        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, size, size);

        const circularImageData = canvas.toDataURL("image/png");
        resolve(circularImageData);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image."));
      };
      img.src = imageUrl;
    });
  }

  const [university, setUniversity] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/${department_id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data);
          setDepartmentName(data.department_name);
          setDepartmentLandline(data.department_landline);
          setEmail(data.email);
          setUniversity(data.university);
        } else {
          console.error(
            "Error fetching user profile data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      } finally {
      }
    };
    fetchUserProfileData();
  }, [department_id]);

  const [preparedByName, setPreparedByName] = useState("");
  const [preparedByRole, setPreparedByRole] = useState("");
  const [acknowledgedByName, setAcknowledgedByName] = useState("");
  const [acknowledgedByRole, setAcknowledgedByRole] = useState("");
  const [reviewedByName, setReviewedByName] = useState("");
  const [reviewedByRole, setReviewedByRole] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialSavePerformed, setInitialSavePerformed] = useState(false);

  // To store the available years
  const [selectedYear, setSelectedYear] = useState("");
  const [targetYears, setTargetYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchTargetYears = async () => {
      if (department_id) {
        try {
          const [
            financialResponse,
            internalResponse,
            learningResponse,
            stakeholderResponse,
          ] = await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getFinancialTargetYears/${department_id}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getInternalTargetYears/${department_id}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getLearningTargetYears/${department_id}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getStakeholderTargetYears/${department_id}`
            ),
          ]);

          const [financialData, internalData, learningData, stakeholderData] =
            await Promise.all([
              financialResponse.json(),
              internalResponse.json(),
              learningResponse.json(),
              stakeholderResponse.json(),
            ]);

          const allData = [
            ...financialData,
            ...internalData,
            ...learningData,
            ...stakeholderData,
          ];

          const uniqueYears = ["Select Year"].concat([
            ...new Set(allData.map((entity) => entity.targetYear)),
          ]);
          setTargetYears(uniqueYears);
          console.log("Years: ", uniqueYears);
          setSelectedYear("Select Year");
        } catch (error) {
          console.error("Error fetching target years:", error);
        }
      }
    };

    fetchTargetYears();
  }, [department_id]);

  // Set the selected year to the new value from the dropdown
  const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const chartRef = useRef<HTMLDivElement | null>(null);

  const [chartData, setChartData] = useState({
    labels: ["Financial", "Stakeholder", "Internal", "Learning"],
    datasets: [
      {
        label: "Average Reports Each Perspectives",
        data: [0, 0, 0, 0],
        backgroundColor: [
          "#b83216",
          "rgba(253, 227, 167, 1)",
          "#b83216",
          "rgba(253, 227, 167, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(249, 105, 14, 1)",
          "rgba(249, 105, 14, 1)",
          "rgba(249, 105, 14, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchApproval = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/approval/get/${department_id}`
        );
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
      setModalMessage("Please fill in all required fields.");
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/approval/insert`, {
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

      setModalMessage("Approval details registered successfully!");
      setShowModal(true);
      setIsReadOnly(true); // Disable the fields after saving
      setInitialSavePerformed(true);
    } catch (error) {
      console.error("Error:", error);
      setModalMessage(
        "An error occurred while registering the approval details. Please try again later."
      );
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/approval/update/${department_id}`,
          {
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
          }
        );

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
    const lastView = localStorage.getItem("lastView");
    if (lastComponent) {
      setSelectedComponent(lastComponent);
    }
  }, []);

  useEffect(() => {
    const getReports = async (department_id: number) => {
      try {
        // Fetch financial reports
        const financialResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/financial/get/${department_id}`
        );
        if (!financialResponse.ok) {
          throw new Error("Failed to fetch financial reports");
        }
        const financialData = await financialResponse.json();

        // Fetch primary financial reports
        const primaryFinancialResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryFinancialBsc/get/${department_id}`
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
              report.evidence_link &&
              report.targetYear
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
              report.target_performance !== null &&
              report.evidence_link &&
              report.targetYear
            // report.ofi
          ),
        ];

        // Set the combined reports into a single state
        setFinancialReports(completeFinancialReports);

        const stakeholderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/stakeholder/get/${department_id}`
        );
        if (!stakeholderResponse.ok) {
          throw new Error("Failed to fetch stakeholder reports");
        }
        const stakeholderData = await stakeholderResponse.json();

        // Fetch primary stakeholder reports
        const primaryStakeholderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryStakeholderBsc/get/${department_id}`
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
              report.evidence_link &&
              report.targetYear
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
              report.evidence_link &&
              report.targetYear
            // report.ofi
          ),
        ];

        // Set the combined reports into a single state
        setStakeholderReports(completeStakeholderReports);

        //Fetch internal reports
        const internalResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/internal/get/${department_id}`
        );
        if (!internalResponse.ok) {
          throw new Error("Failed to fetch internal reports");
        }
        const internalData = await internalResponse.json();

        // Fetch primary stakeholder reports
        const primaryInternalResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryInternalBsc/get/${department_id}`
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
              report.evidence_link &&
              report.targetYear
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
              report.evidence_link &&
              report.targetYear
            // report.ofi
          ),
        ];
        console.log("CmpleteInternalReports: ", completeInternalReports);
        setInternalReports(completeInternalReports);

        //Fetch learning reports
        const learningResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/learning/get/${department_id}`
        );
        if (!learningResponse.ok) {
          throw new Error("Failed to fetch learning reports");
        }
        const learningData = await learningResponse.json();

        // Fetch primary stakeholder reports
        const primaryLearningResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryLearningBsc/get/${department_id}`
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
              report.evidence_link &&
              report.targetYear
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
              report.evidence_link &&
              report.targetYear
            // report.ofi
          ),
        ];
        setLearningReports(completeLearningReports);
        console.log(completeLearningReports);

        // Calculate individual percentages and average them for chart data
        const calculateAveragePercentage = (reports: any[]) => {
          if (reports.length === 0) return 0;

          const totalPercentage = reports.reduce((acc, report) => {
            const percentage =
              (report.actual_performance / report.target_performance) * 100;
            return acc + percentage;
          }, 0);

          return totalPercentage / reports.length;
        };

        // Use the new function to calculate percentages for each perspective
        const filteredFinancialReports = completeFinancialReports.filter(
          (report) => report.targetYear === selectedYear
        );
        const financialPercentage = calculateAveragePercentage(
          filteredFinancialReports
        );

        const filteredStakeholderReports = completeStakeholderReports.filter(
          (report) => report.targetYear === selectedYear
        );
        const stakeholderPercentage = calculateAveragePercentage(
          filteredStakeholderReports
        );

        const filteredInternalReports = completeInternalReports.filter(
          (report) => report.targetYear === selectedYear
        );
        const internalPercentage = calculateAveragePercentage(
          filteredInternalReports
        );

        const filteredLearningReports = completeLearningReports.filter(
          (report) => report.targetYear === selectedYear
        );
        const learningPercentage = calculateAveragePercentage(
          filteredLearningReports
        );
        setChartData({
          ...chartData,
          labels: [
            `Financial (${financialPercentage}%)`,
            `Stakeholder (${stakeholderPercentage}%)`,
            `Internal (${internalPercentage}%)`,
            `Learning (${learningPercentage}%)`,
          ],
          datasets: [
            {
              ...chartData.datasets[0],
              data: [
                financialPercentage,
                stakeholderPercentage,
                internalPercentage,
                learningPercentage,
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    getReports(department_id);
  }, [department_id, selectedYear, chartData]);

  const handleDownload = async () => {
    const headers = [
      ["Office Target"],
      ["KPI"],
      ["Actual Performance"], // Separate array for line break
      ["Target Performance"],
      ["Year"],
      ["Link of Evidence"],
    ];

    const filterDataByYear = (data: any[]) => {
      return data.filter((report) => report.targetYear === selectedYear);
    };

    const transformData = (data: any[]) => {
      return data.map((report) => ({
        // "Target Code": report.target_code,
        "Office Target": report.office_target,
        KPI: report.key_performance_indicator,
        // Actions: report.actions,
        // Budget: report.budget,
        // "In-charge": report.incharge,
        "Actual Performance": report.actual_performance,
        "Target Performance": report.target_performance,
        Year: report.targetYear,
        "Link of Evidence": report.evidence_link,
        // OFI: report.ofi,
      }));
    };

    const transformedFinancial = transformData(
      filterDataByYear(financialReports)
    ).map((report) => ({
      // "Target Code": report["Target Code"],
      "Office Target": report["Office Target"],
      KPI: report.KPI,
      // Actions: report.Actions,
      // Budget: report.Budget,
      // "In-charge": report["In-charge"],
      "Actual Performance": report["Actual Performance"],
      "Target Performance": report["Target Performance"],
      Year: report["Year"],
      "Link of Evidence": report["Link of Evidence"],

      // OFI: report.OFI,
    }));

    const transformedStakeholder = transformData(
      filterDataByYear(stakeholderReports)
    ).map((report) => ({
      // "Target Code": report["Target Code"],
      "Office Target": report["Office Target"],
      KPI: report.KPI,
      // Actions: report.Actions,
      // Budget: report.Budget,
      // "In-charge": report["In-charge"],
      "Actual Performance": report["Actual Performance"],
      "Target Performance": report["Target Performance"],
      Year: report["Year"],
      "Link of Evidence": report["Link of Evidence"],
      // OFI: report.OFI,
    }));

    const transformedInternal = transformData(
      filterDataByYear(internalReports)
    ).map((report) => ({
      // "Target Code": report["Target Code"],
      "Office Target": report["Office Target"],
      KPI: report.KPI,
      // Actions: report.Actions,
      // Budget: report.Budget,
      // "In-charge": report["In-charge"],
      "Actual Performance": report["Actual Performance"],
      "Target Performance": report["Target Performance"],
      Year: report["Year"],
      "Link of Evidence": report["Link of Evidence"],
      // OFI: report.OFI,
    }));

    const transformedLearning = transformData(
      filterDataByYear(learningReports)
    ).map((report) => ({
      // "Target Code": report["Target Code"],
      "Office Target": report["Office Target"],
      KPI: report.KPI,
      // Actions: report.Actions,
      // Budget: report.Budget,
      // "In-charge": report["In-charge"],
      "Actual Performance": report["Actual Performance"],
      "Target Performance": report["Target Performance"],
      Year: report["Year"],
      "Link of Evidence": report["Link of Evidence"],
      // OFI: report.OFI,
    }));

    const doc = new jsPDF();
    let startY = 5;

    if (image) {
      makeCircularImage(image)
        .then((circularImageData) => {
          const circularImage = new Image();
          circularImage.src = circularImageData;
          circularImage.onload = () => {
            doc.addImage(circularImage, "PNG", 10, 5, 20, 20);
          };
        })
        .catch((error) => {
          console.error("Error making circular image:", error);
        });
    } else {
      console.warn("No department image found.");
    }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8); // Adjust font size as needed
    doc.text(`${university.toUpperCase()}`, 35, 10);
    doc.text(`${departmentName.toUpperCase()}`, 35, 15);
    doc.setFontSize(6);
    doc.setFont("Helvetica", "bold");
    doc.text(`${email} | ${departmentLandline}`, 35, 20);
    doc.setFontSize(9);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(170, 0, 0); // Set text color to dark red or adjust
    doc.text("BALANCED SCORECARD (BSC)", 35, 25);
    doc.setTextColor(0, 0, 0); // Reset text color to black

    startY = 40;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10); // Adjust font size as needed
    doc.text("AVERAGE REPORT VISUALIZATION", 15, 35);
    if (chartRef.current) {
      // Check if current is not null
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");

      doc.addImage(imgData, "PNG", 10, startY, 140, 50);
      startY += 60;
    }

    doc.setFontSize(10); // Adjust font size as needed
    doc.text("FINAL REPORT OF EACH PERSPECTIVES", 15, 100);
    const addSection = (reportTitle: string, reportData: any[]) => {
      console.log(`Adding section: ${reportTitle}`, reportData);

      // Check if we need to add a new page
      const pageHeight = doc.internal.pageSize.height;
      if (startY > pageHeight - 30) {
        doc.addPage();
        startY = 10; // Reset startY for the new page
      }

      doc.setFontSize(9);
      doc.setFont("Helvetica", "bold");
      doc.text(reportTitle, 15, startY + 10);
      startY += 15;

      // Generate the table
      autoTable(doc, {
        head: [headers],
        body: reportData.map((row) => Object.values(row)),
        startY: startY,
        didDrawCell: (data: any) => {
          if (
            data.section === "body" &&
            data.row.index === reportData.length - 1
          ) {
            startY = data.cell.y + data.cell.height + 5;
          }
        },
        headStyles: {
          fontSize: 7,
          fontStyle: "bold",
          fillColor: "#A43214",
          textColor: [245, 245, 17],
          halign: "center",
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        bodyStyles: {
          fontSize: 7,
          fontStyle: "normal",
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 40 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 18 },
          5: { cellWidth: 25 },
        },
      });

      // Update startY after the table is drawn
      startY += 2; // Add some padding after the table
    };

    addSection("FINANCIAL PERSPECTIVE", transformedFinancial);
    addSection("STAKEHOLDER PERSPECTIVE", transformedStakeholder);
    addSection("INTERNAL PERSPECTIVE", transformedInternal);
    addSection("LEARNING AND GROWTH PERSPECTIVE", transformedLearning);

    // Check if we need a new page for the footer
    if (startY > 270) {
      doc.addPage();
      startY = 20;
    }

    startY += 20;
    console.log("Current startY before footer:", startY);

    doc.setFontSize(8);
    doc.setFont("Helvetica", "normal");
    doc.text(`Prepared By:`, 15, startY);
    doc.setFont("Helvetica", "bold");
    doc.text(`${preparedByName}`, 15, startY + 15);
    doc.setFont("Helvetica", "normal");
    doc.text(`${preparedByRole}`, 15, startY + 20);

    doc.setFont("Helvetica", "normal");
    doc.text(`Reviewed By:`, 80, startY);
    doc.setFont("Helvetica", "bold");
    doc.text(`${reviewedByName}`, 80, startY + 15);
    doc.setFont("Helvetica", "normal");
    doc.text(`${reviewedByRole}`, 80, startY + 20);

    doc.setFont("Helvetica", "normal");
    doc.text(`Acknowledged By:`, 145, startY);
    doc.setFont("Helvetica", "bold");
    doc.text(`${acknowledgedByName}`, 145, startY + 15);
    doc.setFont("Helvetica", "normal");
    doc.text(`${acknowledgedByRole}`, 145, startY + 20);
    console.log("Transformed Financial:", transformedFinancial);
    console.log("Transformed Stakeholder:", transformedStakeholder);
    console.log("Transformed Internal:", transformedInternal);
    console.log("Transformed Learning:", transformedLearning);

    doc.save("report.pdf");
  };

  return (
    <Grid
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        color: "#2e2c2c",
      }}
    >
      <Grid>
        <Navbar />
      </Grid>
      <Grid
        container
        direction="column"
        sx={{
          mt: 3, // Add some margin at the top
          px: 3, // Optional: Add some padding on the left and right
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              fontSize: { xs: "2rem", sm: "3.5rem" },
            }}
          >
            REPORT
          </Typography>

          {/* View Buttons */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="18rem"
            height="4rem"
            borderRadius={2}
            sx={{ gap: 1, p: 0.5, borderWidth: 0.5 }}
          >
            <Button
              onClick={() => setCurrentView("default")}
              variant={currentView === "default" ? "contained" : "outlined"}
              fullWidth
              sx={{
                p: 3,
                fontSize: "18px",
                background:
                  currentView === "default"
                    ? "linear-gradient(to left, #8a252c, #AB3510)"
                    : "transparent",
                color: currentView === "default" ? "white" : "#A43214",
                flexGrow: 2, // Ensure both buttons have equal size
                height: "100%", // Match the height of the container
                border: "1px solid transparent", // Keep border style consistent
                transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                "&:hover": {
                  background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                  color: "white", // Change text color on hover
                  border:
                    currentView === "default" ? "none" : "0.5px solid #AB3510", // Border on hover if not current
                },
              }}
            >
              DEFAULT
            </Button>
            <Button
              onClick={() => setCurrentView("printed")}
              variant={currentView === "printed" ? "contained" : "outlined"}
              fullWidth
              sx={{
                p: 3,
                fontSize: "18px",
                background:
                  currentView === "printed"
                    ? "linear-gradient(to left, #8a252c, #AB3510)"
                    : "transparent",
                color: currentView === "printed" ? "white" : "#A43214",
                flexGrow: 2, // Ensure both buttons have equal size
                height: "100%", // Match the height of the container
                border: "1px solid transparent", // Keep border style consistent
                transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                "&:hover": {
                  background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                  color: "white", // Change text color on hover
                  border:
                    currentView === "printed" ? "none" : "0.5px solid #AB3510", // Border on hover if not current
                },
              }}
            >
              REPORT
            </Button>
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: "1.4rem",
          }}
        >
          The Report feature in Atlas allows users to view a comprehensive
          summary of their progress over the past months. It provides a clear
          and concise overview of your accomplishments and areas for
          improvement, helping you stay on track and make informed decisions for
          future planning.
        </Typography>

        {/* Year Dropdown */}
        <div className="mb-4 mt-10">
          <label htmlFor="year-select" className="mr-2 text-lg font-medium">
            Select Year:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md p-2"
            key={selectedYear} // Add the key prop here
          >
            {targetYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {currentView === "default" && (
          <Grid container>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="4rem"
              borderRadius={2}
              sx={{ gap: 1, p: 0.5, borderWidth: 0.5, mt: 2, mb: 1 }}
            >
              <Button
                onClick={() => changeComponent("Financial")}
                sx={{
                  p: 3,
                  fontSize: "18px",
                  background:
                    selectedComponent === "Financial"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color:
                    selectedComponent === "Financial" ? "white" : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      selectedComponent === "Financial"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Financial
              </Button>
              <Button
                onClick={() => changeComponent("Stakeholder")}
                sx={{
                  p: 3,
                  fontSize: "18px",
                  background:
                    selectedComponent === "Stakeholder"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color:
                    selectedComponent === "Stakeholder" ? "white" : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      selectedComponent === "Stakeholder"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Stakeholder
              </Button>
              <Button
                onClick={() => changeComponent("Internal")}
                sx={{
                  p: 3,
                  fontSize: "18px",
                  background:
                    selectedComponent === "Internal"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color: selectedComponent === "Internal" ? "white" : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      selectedComponent === "Internal"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Internal
              </Button>
              <Button
                onClick={() => changeComponent("Learning")}
                sx={{
                  p: 3,
                  fontSize: "18px",
                  background:
                    selectedComponent === "Learning"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color: selectedComponent === "Learning" ? "white" : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      selectedComponent === "Learning"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Learning
              </Button>
            </Box>
            <Box width="100%">
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  {selectedComponent === "Financial" && (
                    <ReportFinancial selectedYear={selectedYear} />
                  )}
                  {selectedComponent === "Stakeholder" && (
                    <ReportStakeholder selectedYear={selectedYear} />
                  )}
                  {selectedComponent === "Internal" && (
                    <ReportInternal selectedYear={selectedYear} />
                  )}
                  {selectedComponent === "Learning" && (
                    <ReportLearning selectedYear={selectedYear} />
                  )}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )}
        {currentView === "printed" && (
          <Grid item>
            <Box
              sx={{
                display: "flex",
                mt: 2,
                mx: 2,
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 2,
                  borderRadius: 2,
                  width: "60%",
                }}
              >
                <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  REPORT VISUALIZATION
                </Typography>
                <Box ref={chartRef} sx={{ padding: 1, height: "100%" }}>
                  {!selectedYear ? (
                    <Typography sx={{ fontSize: "1rem", color: "gray" }}>
                      Please select a year to view the chart.
                    </Typography>
                  ) : (
                    chartData && (
                      <Bar
                        data={chartData}
                        options={{
                          responsive: true,
                          indexAxis: "y",
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
                                "rgba(253, 227, 167, 1)",
                              ],
                              borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(249, 105, 14, 1)",
                                "rgba(249, 105, 14, 1)",
                                "rgba(249, 105, 14, 1)",
                              ],
                              borderWidth: 1,
                              borderRadius: 10,
                            },
                          },
                          datasets: {
                            bar: {
                              barPercentage: 1.3, // Make bars narrower
                              categoryPercentage: 0.6, // Increase space between categories
                            },
                          },
                          scales: {
                            x: {
                              grid: {
                                lineWidth: 1,
                                color: "white",
                              },
                            },
                            y: {
                              grid: {
                                lineWidth: 1,
                                color: "rgba(0, 0, 0, 0.2)",
                              },
                            },
                          },
                        }}
                        height={100}
                      />
                    )
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 2,
                  borderRadius: 2,
                  width: "38%",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    APPROVAL SECTION
                  </Typography>
                  <Box>
                    {!initialSavePerformed && (
                      <Button
                        onClick={handleSave}
                        disabled={isReadOnly}
                        variant="contained"
                        sx={{
                          py: 1,
                          px: 5,
                          borderRadius: "8px",
                          fontWeight: "500",
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                        }}
                      >
                        Save
                      </Button>
                    )}
                    {(initialSavePerformed || isReadOnly) && (
                      <Button
                        onClick={handleEditSave}
                        variant="contained"
                        color="error"
                        sx={{
                          py: 1,
                          px: 3,
                          borderRadius: "8px",
                          fontWeight: "500",
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                        }}
                      >
                        {isEditing ? "Save" : "Edit"}
                      </Button>
                    )}

                    {/* Modal */}
                    <Modal open={showModal} onClose={() => setShowModal(false)}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100vh"
                      >
                        <Box
                          sx={{
                            background: "white",
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: 24,
                            textAlign: "center",
                            position: "relative",
                            maxWidth: "50vw",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "1.875rem", fontWeight: "bold" }}
                          >
                            Notice!
                          </Typography>
                          <Typography sx={{ fontSize: "1.25rem", mb: 2 }}>
                            {modalMessage}
                          </Typography>
                          <Button
                            onClick={() => setShowModal(false)}
                            variant="contained"
                            sx={{
                              background:
                                "linear-gradient(to left, #8a252c, #AB3510)",
                              color: "#ffffff",
                              borderRadius: "10px",
                              fontSize: "1rem",
                              width: 144,
                              py: 1,
                            }}
                          >
                            Close
                          </Button>
                        </Box>
                      </Box>
                    </Modal>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <span className="font-normal text-[1.1rem]">
                    Prepared By:
                  </span>
                  <div className="flex flex-row mt-1 gap-10">
                    <input
                      type="text"
                      placeholder="Enter name"
                      name="preparedByName"
                      value={preparedByName}
                      onChange={(e) => setPreparedByName(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Enter role"
                      name="preparedByRole"
                      value={preparedByRole}
                      onChange={(e) => setPreparedByRole(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                </Box>
                <div className="flex flex-col mt-8">
                  <span className="font-normal text-[1.1rem]">
                    Acknowledged By:
                  </span>
                  <div className="flex flex-row mt-1 gap-10">
                    <input
                      type="text"
                      placeholder="Enter name"
                      name="acknowledgedByName"
                      value={acknowledgedByName}
                      onChange={(e) => setAcknowledgedByName(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Enter role"
                      name="acknowledgedByRole"
                      value={acknowledgedByRole}
                      onChange={(e) => setAcknowledgedByRole(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-8">
                  <span className="font-normal text-[1.1rem]">
                    Reviewed By:
                  </span>
                  <div className="flex flex-row mt-1 gap-10">
                    <input
                      type="text"
                      placeholder="Enter name"
                      name="reviewedByName"
                      value={reviewedByName}
                      onChange={(e) => setReviewedByName(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full "
                    />
                    <input
                      type="text"
                      placeholder="Enter role"
                      name="reviewedByRole"
                      value={reviewedByRole}
                      onChange={(e) => setReviewedByRole(e.target.value)}
                      // readOnly={!isEditing}
                      readOnly={isReadOnly}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                </div>
              </Box>
            </Box>
            <Card
              sx={{
                boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                border: "1px solid #D1D5DB",
                bgcolor: "#FFFFFF",
                p: 0.5,
                borderRadius: 2,
                mt: 3,
              }}
            >
              <CardContent>
                {<ReportFinancialView selectedYear={selectedYear} />}
              </CardContent>
            </Card>
            <Card
              sx={{
                boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                border: "1px solid #D1D5DB",
                bgcolor: "#FFFFFF",
                p: 0.5,
                borderRadius: 2,
                mt: 3,
              }}
            >
              <CardContent>
                {<ReportStakeholderView selectedYear={selectedYear} />}
              </CardContent>
            </Card>
            <Card
              sx={{
                boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                border: "1px solid #D1D5DB",
                bgcolor: "#FFFFFF",
                p: 0.5,
                borderRadius: 2,
                mt: 3,
              }}
            >
              <CardContent>
                {<ReportInternalView selectedYear={selectedYear} />}
              </CardContent>
            </Card>
            <Card
              sx={{
                boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                border: "1px solid #D1D5DB",
                bgcolor: "#FFFFFF",
                p: 0.5,
                borderRadius: 2,
                mt: 3,
                mb: 3,
              }}
            >
              <CardContent>
                {<ReportLearningView selectedYear={selectedYear} />}
              </CardContent>
            </Card>
          </Grid>
        )}
        {currentView === "printed" && (
          <Box className="flex flex-row justify-end items-end mb-10 ">
            <Button
              onClick={handleDownload}
              variant="contained"
              sx={{
                py: 2,
                px: 3,
                borderRadius: "8px",
                fontWeight: "500",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
              }}
            >
              Download Report
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ReportsPage;
