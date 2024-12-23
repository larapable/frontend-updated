"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
interface ReportStakeholder {
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
  evidence_link: string; //link
  targetYear: string;
}
interface PrimaryReportStakeholder {
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
  evidence_link: string; //link
  targetYear: string;
}

interface ReportStakeholderProps {
  selectedYear: string;
}

const ReportStakeholder: React.FC<ReportStakeholderProps> = ({
  selectedYear,
}) => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  const username = user?.username;

  // Values for the report
  const [stakeholderPerspective, setStakeholderPerspective] =
    useState("stakeholder");
  const [stakeholderActions, setStakeholderActions] = useState("");
  const [stakeholderBudget, setStakeholderBudget] = useState<number>(0);
  const [stakeholderIncharge, setStakeholderIncharge] = useState("");
  const [stakeholderOFI, setStakeholderOFI] = useState("");

  const [stakeholderTargetCode, setStakeholderTargetCode] = useState("");
  const [stakeholderOfficeTarget, setStakeholderOfficeTarget] = useState("");
  const [stakeholderKPI, setStakeholderKPI] = useState("");
  const [stakeholderTargetPerformance, setStakeholderTargetPerformance] =
    useState("");
  const [stakeholderActualPerformance, setStakeholderActualPerformance] =
    useState("");
  const [stakeholderEvidenceLink, setStakeholderEvidenceLink] = useState(""); //link
  const [stakeholderTargetYear, setStakeholderTargetYear] = useState("");

  // Array to store the report
  const [stakeholderReport, setStakeholderReport] = useState<
    ReportStakeholder[]
  >([]);

  const [primaryActions, setPrimaryActions] = useState("");
  const [primaryBudget, setPrimaryBudget] = useState<number>(0);
  const [primaryIncharge, setPrimaryIncharge] = useState("");
  const [primaryOfi, setPrimaryOfi] = useState("");

  const [primaryTargetCode, setPrimaryTargetCode] = useState("");
  const [primaryOfficeTarget, setPrimaryOfficeTarget] = useState("");
  const [primaryKPI, setPrimaryKPI] = useState("");
  const [primaryActualPerformance, setPrimaryActualPerformance] = useState("");
  const [primaryTargetPerformance, setPrimaryTargetPerformance] = useState("");

  const [primaryEvidenceLink, setPrimaryEvidenceLink] = useState(""); // link
  const [primaryTargetYear, setPrimaryTargetYear] = useState("");

  const [primaryStakeholderReports, setPrimaryStakeholderReports] = useState<
    PrimaryReportStakeholder[]
  >([]);
  const allStakeholderReports = [
    ...primaryStakeholderReports,
    ...stakeholderReport,
  ];
  const [isPrimaryReport, setIsPrimaryReport] = useState(false);

  // Modal and edit id
  const [openModal, setOpenModal] = useState(false);
  const [reportEditId, setReportEditId] = useState(0);

  const [primaryOpenModal, setPrimaryOpenModal] = useState(false); // State to control the modal
  const [primaryReportEditId, setPrimaryReportEditId] = useState(0);

  useEffect(() => {
    const getAllStakeholder = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/stakeholder/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stakeholder reports");
        }
        const data = await response.json();
        console.log("response data:", data);
        setStakeholderReport(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching stakeholder reports:", error);
      }
    };
    getAllStakeholder(department_id);
  }, [department_id]);

  useEffect(() => {
    const getPrimaryStakeholder = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not found.");
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryStakeholderBsc/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary stakeholder report.");
        }
        const res = await response.json();
        console.log("response data:", res);
        setPrimaryStakeholderReports(res);
        console.log(res);
      } catch (error) {
        console.error("Error fetching stakeholder reports:", error);
      }
    };
    getPrimaryStakeholder(department_id);
  }, [department_id]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // const handleEditReport = (report: ReportStakeholder) => {
  //   const isPrimary = primaryStakeholderReports.some((p) => p.id === report.id);
  //   setIsPrimaryReport(isPrimary);
  //   if (isPrimary) {
  //     handleEditPrimaryReport(report);
  //   } else {
  //     handleEditStakeholderReport(report);
  //   }
  // };

  const handleEditStakeholderReport = (report: ReportStakeholder) => {
    setStakeholderTargetCode(report.target_code);
    setStakeholderOfficeTarget(report.office_target);
    setStakeholderKPI(report.key_performance_indicator);
    setStakeholderActualPerformance(report.actual_performance || "0");
    setStakeholderTargetPerformance(report.target_performance || "0");
    setReportEditId(report.id);
    setStakeholderPerspective(report.perspective);
    setStakeholderActions(report.actions);
    setStakeholderBudget(report.budget);
    setStakeholderIncharge(report.incharge);
    setStakeholderOFI(report.ofi);
    setStakeholderTargetYear(report.targetYear);
    setStakeholderEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit:", report.id);
  };

  const handleEditPrimaryReport = (report: PrimaryReportStakeholder) => {
    setPrimaryTargetCode(report.target_code);
    setPrimaryOfficeTarget(report.office_target);
    setPrimaryKPI(report.key_performance_indicator);
    setPrimaryActualPerformance(report.actual_performance || "0");
    setPrimaryTargetPerformance(report.target_performance || "0");
    setPrimaryReportEditId(report.id);
    setPrimaryActions(report.actions);
    setPrimaryBudget(report.budget);
    setPrimaryIncharge(report.incharge);
    setPrimaryTargetYear(report.targetYear);
    setPrimaryEvidenceLink(report.evidence_link || ""); // link
    setPrimaryOfi(report.ofi);
    setPrimaryOpenModal(true);
    console.log("Primary Report ID to edit:", report.id);
  };

  const handleSaveReport = async () => {
    const updatedReport: ReportStakeholder = {
      id: reportEditId,
      actions: stakeholderActions,
      perspective: stakeholderPerspective,
      budget: stakeholderBudget,
      incharge: stakeholderIncharge,
      ofi: stakeholderOFI,
      target_code: stakeholderTargetCode,
      office_target: stakeholderOfficeTarget,
      key_performance_indicator: stakeholderKPI,
      target_performance: stakeholderTargetPerformance,
      actual_performance: stakeholderActualPerformance,
      targetYear: stakeholderTargetYear,
      evidence_link: stakeholderEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/stakeholder/update/${reportEditId}`,
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
      // Update the Stakeholder Reports state directly
      setStakeholderReport((prevReports) =>
        prevReports.map((report) =>
          report.id === reportEditId ? updatedReport : report
        )
      );

      toast.success("Report updated successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating stakeholder report:", error);
      toast.error("Failed to update report.");
    }
  };

  const handleSavePrimaryReport = async () => {
    const updatedPrimaryReport: PrimaryReportStakeholder = {
      id: primaryReportEditId,
      actions: primaryActions,
      perspective: stakeholderPerspective,
      budget: primaryBudget,
      incharge: primaryIncharge,
      ofi: primaryOfi,
      target_code: primaryTargetCode,
      office_target: primaryOfficeTarget,
      key_performance_indicator: primaryKPI,
      target_performance: primaryTargetPerformance,
      actual_performance: primaryActualPerformance,
      targetYear: primaryTargetYear,
      evidence_link: primaryEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryStakeholderBsc/update/${reportEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPrimaryReport),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update primary stakeholder report.");
      }
      setPrimaryStakeholderReports((prevReports) =>
        prevReports.map((report) =>
          report.id === primaryReportEditId ? updatedPrimaryReport : report
        )
      );

      toast.success("Primary stakeholder report updated successfully!");
      setPrimaryOpenModal(false);
    } catch (error) {
      console.error("Error updating primary stakeholder report:", error);
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
    <Grid item sx={{ color: "#2e2c2c" }}>
      <Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            mt: -1,
            mb: 2,
          }}
        >
          <img src="/stakeholder.png" alt="" className=" h-[4rem] mr-2" />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginRight: "1rem",
            }}
          >
            <Box sx={{ alignContent: "center", justifyContent: "center" }}>
            <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                Stakeholder Scorecard Overview
              </Typography>
              <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                Each objective is categorized annually. Users must input the{" "}
                <span className="font-bold">
                  actions taken, budget, person in charge,{" "}
                </span>
                and{" "}
                <span className="font-bold">
                  opportunities for improvement (OFI).
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Box>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}
        >
          <Table>
            {/* Table Header */}
            <TableHead>
              <TableRow sx={{ bgcolor: "#fff6d1" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Office Target
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  KPI
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Actions
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Budget
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  In-charge
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Performance <br />
                  <div className="font-medium text-[11px]">
                    <span>Actual </span>
                    <span className="font-bold">|</span>
                    <span> Target</span>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  OFI
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Link of Evidence
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {/* Render Primary Stakeholder Reports */}
              {primaryStakeholderReports
                .filter((scorecard) => {
                  if (!selectedYear) return true;
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < primaryStakeholderReports.length - 1
                          ? "gray-200"
                          : "transparent"
                      }`,
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell>
                      <span className="font-medium text-[13px]">
                        {truncateString(report.office_target, 45)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report.key_performance_indicator, 20)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report?.actions || "...", 8)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {report?.budget || "..."}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report?.incharge || "...", 8)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px] mr-2">
                        {report.actual_performance}
                      </span>
                      <span className="text-center">|</span>
                      <span className="font-medium text-[13px] ml-2">
                        {report.target_performance}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report?.ofi || "...", 4)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {report.evidence_link ? (
                        <a
                          href={report.evidence_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 underline font-medium text-[13px]"
                        >
                          {report.evidence_link.length > 20
                            ? `${report.evidence_link.substring(0, 15)}...`
                            : report.evidence_link}
                        </a>
                      ) : (
                        "..."
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#c2410c" }}>
                      <button onClick={() => handleEditPrimaryReport(report)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

              {/* Render Stakeholder Reports */}
              {stakeholderReport
                .filter((scorecard) => {
                  if (!selectedYear) return true;
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < stakeholderReport.length - 1
                          ? "gray-200"
                          : "transparent"
                      }`,
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell>
                      <span className="font-medium text-[13px]">
                        {truncateString(report.office_target, 45)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report.key_performance_indicator, 20)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report?.actions || "...", 8)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {report?.budget || "..."}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report?.incharge || "...", 8)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px] mr-2">
                        {report.actual_performance}
                      </span>
                      <span className="text-center">|</span>
                      <span className="font-medium text-[13px] ml-2">
                        {report.target_performance}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report?.ofi || "...", 4)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {report.evidence_link ? (
                        <a
                          href={report.evidence_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 underline font-medium text-[13px]"
                        >
                          {report.evidence_link.length > 20
                            ? `${report.evidence_link.substring(0, 15)}...`
                            : report.evidence_link}
                        </a>
                      ) : (
                        "..."
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#c2410c" }}>
                      <button
                        onClick={() => handleEditStakeholderReport(report)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              background: "white",
              padding: 4,
              borderRadius: 2,
              boxShadow: 24,
              position: "relative",
              width: "60%",
              height: "70%",
              overflowX: "hidden",
            }}
          >
            <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }, mb:1}}>
              Stakeholder
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                mb: 6,
              }}
            >
              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Target Code
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                  }}
                  value={stakeholderTargetCode}
                  onChange={(e) => setStakeholderTargetCode(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Budget
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                  }}
                  value={stakeholderBudget}
                  onChange={(e) =>
                    setStakeholderBudget(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  KPI
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                     background: "#f2f2f2",
                  }}
                  value={stakeholderKPI}
                  disabled
                />
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                mb: 6,
              }}
            >
              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  In Charge
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                  }}
                  value={stakeholderIncharge}
                  onChange={(e) => setStakeholderIncharge(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Link of Evidence
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                     background: "#f2f2f2",
                  }}
                  value={stakeholderEvidenceLink}
                  disabled
                />
              </div>
              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Performance (Actual | Target)
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                     background: "#f2f2f2",
                  }}
                  value={
                    stakeholderActualPerformance +
                    " | " +
                    stakeholderTargetPerformance
                  }
                  disabled
                />
              </div>
            </Box>
            <Box
              sx={{
                mb: 2,
              }}
            >
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Office Target
                </span>
                <textarea
                  value={stakeholderOfficeTarget}
                  className="text-[13px] font-regular border border-gray-300 bg-[#f2f2f2] h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  disabled
                />
              </div>
            </Box>
            <Box
              sx={{
                mb: 2,
              }}
            >
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Actions
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={stakeholderActions}
                  className="text-[13px] font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setStakeholderActions(e.target.value)}
                />
              </div>
            </Box>
            <Box
              sx={{
                mb: 2,
              }}
            >
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-[13px]">
                  OFI
                  <span className="text-[#DD1414]">*</span>
                </span>

                <textarea
                  value={stakeholderOFI}
                  className="text-[13px] font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setStakeholderOFI(e.target.value)}
                />
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 3,
                flexWrap: "wrap", // Allow buttons to wrap on smaller screens
              }}
            >
              <Button
                variant="contained"
                onClick={() => setOpenModal(false)}
                sx={{
                  minWidth: "10rem",
                  color: "#AB3510",
                  p: 1,
                  fontSize: "13px",
                }}
                style={{
                  background: "white",
                  border: "1px solid #AB3510",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveReport}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  p: 1,
                  fontSize: "13px",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal open={primaryOpenModal} onClose={() => setPrimaryOpenModal(false)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              background: "white",
              padding: 4,
              borderRadius: 2,
              boxShadow: 24,
              position: "relative",
              width: "60%",
              height: "70%",
              overflowX: "hidden",
            }}
          >
            <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }, mb:1}}>
              Stakeholder
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 4, mb: 6 }}>
              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Target Code
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                  }}
                  value={primaryTargetCode}
                  onChange={(e) => setPrimaryTargetCode(e.target.value)}
                />
              </Box>

              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Budget
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                  }}
                  value={primaryBudget}
                  onChange={(e) =>
                    setPrimaryBudget(parseFloat(e.target.value) || 0)
                  }
                />
              </Box>

              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  KPI
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                     background: "#f2f2f2",
                  }}
                  value={primaryKPI}
                  disabled
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 4, mb: 6 }}>
              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  In Charge
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                  }}
                  value={primaryIncharge}
                  onChange={(e) => setPrimaryIncharge(e.target.value)}
                />
              </Box>

              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Link of Evidence
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                     background: "#f2f2f2",
                  }}
                  value={primaryEvidenceLink}
                  disabled
                />
              </Box>

              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Performance (Actual | Target)
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiOutlinedInput-input": {
                      fontSize: "15px", 
                    },
                     background: "#f2f2f2",
                  }}
                  value={
                    primaryActualPerformance + " | " + primaryTargetPerformance
                  }
                  disabled
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Office Target
                </span>
                <textarea
                  value={primaryOfficeTarget}
                  className="text-[13px] font-regular border border-gray-300 bg-[#f2f2f2] h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  disabled
                />
              </div>
            </Box>

            <Box sx={{ mb: 2 }}>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-[13px]">
                  Actions
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={primaryActions}
                  className="text-[13px] font-regular border border-gray-300  h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setPrimaryActions(e.target.value)}
                />
              </div>
            </Box>

            <Box sx={{ mb: 2 }}>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-[13px]">
                  OFI
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={primaryOfi}
                  className="text-[13px] font-regular border border-gray-300  h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setPrimaryOfi(e.target.value)}
                />
              </div>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                onClick={() => setPrimaryOpenModal(false)}
                sx={{
                  minWidth: "10rem",
                  color: "#AB3510",
                  p: 1,
                  fontSize: "13px",
                }}
                style={{
                  background: "white",
                  border: "1px solid #AB3510",
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSavePrimaryReport}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  p: 1,
                  fontSize: "13px",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default ReportStakeholder;