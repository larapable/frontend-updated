"use client";
import { MenuItem, Select, TextField } from "@mui/material";
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

interface ReportLearning {
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

interface PrimaryReportLearning {
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

interface ReportLearningProps {
  selectedYear: string;
}

const ReportLearning: React.FC<ReportLearningProps> = ({ selectedYear }) => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  const username = user?.username;

  // Values for the report
  const [learningPerspective, setLearningPerspective] = useState("learning");
  const [learningActions, setLearningActions] = useState("");
  const [learningBudget, setLearningBudget] = useState<number>(0);
  const [learningIncharge, setLearningIncharge] = useState("");
  const [learningOFI, setLearningOFI] = useState("");

  const [learningTargetCode, setLearningTargetCode] = useState("");
  const [learningOfficeTarget, setLearningOfficeTarget] = useState("");
  const [learningKPI, setLearningKPI] = useState("");
  const [learningTargetPerformance, setLearningTargetPerformance] =
    useState("");
  const [learningActualPerformance, setLearningActualPerformance] =
    useState("");

  const [learningEvidenceLink, setLearningEvidenceLink] = useState(""); //link
  const [learningTargetYear, setLearningTargetYear] = useState("");

  // Array to store the report
  const [learningReport, setLearningReport] = useState<ReportLearning[]>([]);

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

  const [primaryLearningReports, setPrimaryLearningReports] = useState<
    PrimaryReportLearning[]
  >([]);

  const allLearningReports = [...primaryLearningReports, ...learningReport];
  const [isPrimaryReport, setIsPrimaryReport] = useState(false);

  // Modal and edit id
  const [openModal, setOpenModal] = useState(false);
  const [reportEditId, setReportEditId] = useState(0);

  const [primaryOpenModal, setPrimaryOpenModal] = useState(false);
  const [primaryReportEditId, setPrimaryReportEditId] = useState(0);

  useEffect(() => {
    const getAllLearning = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/learning/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch learning reports");
        }
        const data = await response.json();
        console.log("response data:", data);
        setLearningReport(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching learning reports:", error);
      }
    };

    getAllLearning(department_id);
  }, [department_id]);

  useEffect(() => {
    const getPrimaryLearning = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not found.");
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryLearningBsc/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary learning report.");
        }
        const res = await response.json();
        console.log("response data:", res);
        setPrimaryLearningReports(res);
        console.log(res);
      } catch (error) {
        console.error("Error fetching learning reports:", error);
      }
    };
    getPrimaryLearning(department_id);
  }, [department_id]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // const handleEditReport = (report: ReportLearning) => {
  //   const isPrimary = primaryLearningReports.some((p) => p.id === report.id);
  //   setIsPrimaryReport(isPrimary);
  //   if (isPrimary) {
  //     handleEditPrimaryReport(report);
  //   } else {
  //     handleEditLearningReport(report);
  //   }
  // };

  const handleEditLearningReport = (report: ReportLearning) => {
    setLearningTargetCode(report.target_code);
    setLearningOfficeTarget(report.office_target);
    setLearningKPI(report.key_performance_indicator);
    setLearningActualPerformance(report.actual_performance || "0");
    setLearningTargetPerformance(report.target_performance || "0");
    setReportEditId(report.id);
    setLearningPerspective(report.perspective);
    setLearningActions(report.actions);
    setLearningBudget(report.budget);
    setLearningIncharge(report.incharge);
    setLearningOFI(report.ofi);
    setLearningTargetYear(report.targetYear);
    setLearningEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit: ", report.id);
  };

  const handleEditPrimaryReport = (report: PrimaryReportLearning) => {
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
    const updatedReport: ReportLearning = {
      id: reportEditId,
      actions: learningActions,
      perspective: learningPerspective,
      budget: learningBudget,
      incharge: learningIncharge,
      ofi: learningOFI,
      target_code: learningTargetCode,
      office_target: learningOfficeTarget,
      key_performance_indicator: learningKPI,
      target_performance: learningTargetPerformance,
      actual_performance: learningActualPerformance,
      targetYear: learningTargetYear,
      evidence_link: learningEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/learning/update/${reportEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReport),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update learning report");
      }
      // Update the Learning Reports state directly
      setLearningReport((prevReports) =>
        prevReports.map((report) =>
          report.id === reportEditId ? updatedReport : report
        )
      );

      toast.success("Report updated successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating learning report:", error);
      toast.error("Failed to update report.");
    }
  };

  const handleSavePrimaryReport = async () => {
    const updatedPrimaryReport: ReportLearning = {
      id: primaryReportEditId,
      actions: primaryActions,
      perspective: learningPerspective,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryLearningBsc/update/${reportEditId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPrimaryReport),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update primary learning report.");
      }
      setPrimaryLearningReports((prevReports) =>
        prevReports.map((report) =>
          report.id === primaryReportEditId ? updatedPrimaryReport : report
        )
      );

      toast.success("Primary learning report updated successfully!");
      setPrimaryOpenModal(false);
    } catch (error) {
      console.error("Error updating primary learning report:", error);
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
          <img src="/learning.png" alt="" className=" h-[4rem] mr-2" />
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
                Learning & Growth Scorecard Overview
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
              {primaryLearningReports
                .filter((scorecard) => {
                  if (!selectedYear) return true;
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < primaryLearningReports.length - 1
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

              {learningReport
                .filter((scorecard) => {
                  if (!selectedYear) return true;
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < learningReport.length - 1
                          ? "gray-200"
                          : "transparent"
                      }`,
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell>
                      <span className="font-medium text-[#2e2c2c] text-[13px]">
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
                      <button onClick={() => handleEditLearningReport(report)}>
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
              Learning & Growth
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
                  value={learningTargetCode}
                  onChange={(e) => setLearningTargetCode(e.target.value)}
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
                  value={learningBudget}
                  onChange={(e) =>
                    setLearningBudget(parseFloat(e.target.value) || 0)
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
                  value={learningKPI}
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
                  value={learningIncharge}
                  onChange={(e) => setLearningIncharge(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-[23rem] h-10">
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
                  value={learningEvidenceLink}
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
                    learningActualPerformance +
                    " | " +
                    learningTargetPerformance
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
                  value={learningOfficeTarget}
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
                  value={learningActions}
                  className="text-[13px] font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setLearningActions(e.target.value)}
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
                  value={learningOFI}
                  className="text-[13px] font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setLearningOFI(e.target.value)}
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
              Learning & Growth
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
                  className="text-[13px] font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
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
                  className="text-[13px] font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
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

export default ReportLearning;