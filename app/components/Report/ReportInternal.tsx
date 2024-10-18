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
  targetYear: string;
}
interface PrimaryReportInternal {
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
  targetYear: string;
}

interface ReportInternalProps {
  selectedYear: string;
}

const ReportInternal: React.FC<ReportInternalProps> = ({ selectedYear }) => {
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
  const [internalTargetYear, setInternalTargetYear] = useState("");

  // Value for report
  const [internalReport, setInternalReport] = useState<ReportInternal[]>([]);

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

  const [primaryInternalReports, setPrimaryInternalReports] = useState<
    PrimaryReportInternal[]
  >([]);
  const allInternalReports = [...primaryInternalReports, ...internalReport];
  const [isPrimaryReport, setIsPrimaryReport] = useState(false);

  // Modal and edit id
  const [openModal, setOpenModal] = useState(false);
  const [reportEditId, setReportEditId] = useState(0);

  const [primaryOpenModal, setPrimaryOpenModal] = useState(false);
  const [primaryReportEditId, setPrimaryReportEditId] = useState(0);

  useEffect(() => {
    const getAllInternal = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/internal/get/${department_id}`
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
      if (!department_id) {
        console.log("Department ID is not found.");
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryInternalBsc/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary internal report.");
        }
        const res = await response.json();
        console.log("response data:", res);
        setPrimaryInternalReports(res);
        console.log(res);
      } catch (error) {
        console.error("Error fetching internal reports:", error);
      }
    };
    getPrimaryInternal(department_id);
  }, [department_id]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // const handleEditReport = (report: ReportInternal) => {
  //   const isPrimary = primaryInternalReports.some((p) => p.id === report.id);
  //   setIsPrimaryReport(isPrimary);
  //   if (isPrimary) {
  //     handleEditPrimaryReport(report);
  //   } else {
  //     handleEditInternalReport(report);
  //   }
  // };

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
    setInternalTargetYear(report.targetYear);
    setInternalEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit: ", report.id);
  };

  const handleEditPrimaryReport = (report: PrimaryReportInternal) => {
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
      targetYear: internalTargetYear,
      evidence_link: internalEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/internal/update/${reportEditId}`,
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
      // Update the Internal Reports state directly
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
    const updatedPrimaryReport: PrimaryReportInternal = {
      id: primaryReportEditId,
      actions: primaryActions,
      perspective: InternalPerspective,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryInternalBsc/update/${reportEditId}`,
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
          report.id === primaryReportEditId ? updatedPrimaryReport : report
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
    <Grid item sx={{ color: "#2e2c2c" }}>
      <Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            mt: -2,
            mb: 2,
          }}
        >
          <img src="/internal.png" alt="" className=" h-[6rem] mr-2" />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginRight: "1rem",
            }}
          >
            <Box sx={{ alignContent: "center", justifyContent: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "600" }}>
                Internal Scorecard Overview
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "500" }}>
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
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Office Target
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  KPI
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Actions
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Budget
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  In-charge
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Performance <br />
                  <div className="font-medium ">
                    <span>Actual </span>
                    <span className="font-bold">|</span>
                    <span> Target</span>
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  OFI
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
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
              {primaryInternalReports
                .filter((scorecard) => {
                  if (!selectedYear) return true;
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < primaryInternalReports.length - 1
                          ? "gray-200"
                          : "transparent"
                      }`,
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell>
                      <span className="font-medium text-[#2e2c2c] text-[1.1rem]">
                        {truncateString(report.office_target, 45)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report.key_performance_indicator, 20)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report?.actions || "...", 8)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {report?.budget || "..."}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report?.incharge || "...", 8)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c] mr-2">
                        {report.actual_performance}
                      </span>
                      <span className="text-center">|</span>
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c] ml-2">
                        {report.target_performance}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report?.ofi || "...", 4)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {report.evidence_link ? (
                        <a
                          href={report.evidence_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 underline font-medium text-[1.1rem]"
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
                          className="w-6 h-6"
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

              {internalReport
                .filter((scorecard) => {
                  if (!selectedYear) return true;
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < internalReport.length - 1
                          ? "gray-200"
                          : "transparent"
                      }`,
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell>
                      <span className="font-medium text-[#2e2c2c] text-[1.1rem]">
                        {truncateString(report.office_target, 45)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report.key_performance_indicator, 20)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report?.actions || "...", 8)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {report?.budget || "..."}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report?.incharge || "...", 8)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c] mr-2">
                        {report.actual_performance}
                      </span>
                      <span className="text-center">|</span>
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c] ml-2">
                        {report.target_performance}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report?.ofi || "...", 4)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {report.evidence_link ? (
                        <a
                          href={report.evidence_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 underline font-medium text-[1.1rem]"
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
                      <button onClick={() => handleEditInternalReport(report)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
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
              padding: 6,
              borderRadius: 2,
              boxShadow: 24,
              position: "relative",
              maxWidth: "80vw",
              overflowX: "hidden",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: "bold", mb: 2, color: "#2e2c2c" }}
            >
              Internal
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
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Target Code
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={internalTargetCode}
                  onChange={(e) => setInternalTargetCode(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Budget
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={internalBudget}
                  onChange={(e) =>
                    setInternalBudget(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  KPI
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    background: "#f2f2f2",
                  }}
                  value={internalKPI}
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
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  In Charge
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={internalIncharge}
                  onChange={(e) => setInternalIncharge(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Link of Evidence
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    background: "#f2f2f2",
                  }}
                  value={internalEvidenceLink}
                  disabled
                />
              </div>
              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Performance (Actual | Target)
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    background: "#f2f2f2",
                  }}
                  value={
                    internalActualPerformance +
                    " | " +
                    internalTargetPerformance
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
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Office Target
                </span>
                <textarea
                  value={internalOfficeTarget}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
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
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Actions
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={internalActions}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setInternalActions(e.target.value)}
                />
              </div>
            </Box>
            <Box
              sx={{
                mb: 2,
              }}
            >
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  OFI
                  <span className="text-[#DD1414]">*</span>
                </span>

                <textarea
                  value={internalOFI}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setInternalOFI(e.target.value)}
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
                  fontSize: "18px",
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
                  fontSize: "18px",
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
              padding: 6,
              borderRadius: 2,
              boxShadow: 24,
              position: "relative",
              maxWidth: "80vw",
              overflowX: "hidden",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: "bold", mb: 2, color: "#2e2c2c" }}
            >
              Internal
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 4, mb: 6 }}>
              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Target Code
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
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
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={primaryBudget}
                  onChange={(e) =>
                    setPrimaryBudget(parseFloat(e.target.value) || 0)
                  }
                />
              </Box>

              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  KPI
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    background: "#f2f2f2",
                  }}
                  value={primaryKPI}
                  disabled
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 4, mb: 6 }}>
              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  In Charge
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={primaryIncharge}
                  onChange={(e) => setPrimaryIncharge(e.target.value)}
                />
              </Box>

              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Link of Evidence
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    background: "#f2f2f2",
                  }}
                  value={primaryEvidenceLink}
                  disabled
                />
              </Box>

              <Box className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Performance (Actual | Target)
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
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
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Office Target
                </span>
                <textarea
                  value={primaryOfficeTarget}
                  className="text-lg font-regular border border-gray-300 bg-[#f2f2f2] h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  disabled
                />
              </div>
            </Box>

            <Box sx={{ mb: 2 }}>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Actions
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={primaryActions}
                  className="text-lg font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setPrimaryActions(e.target.value)}
                />
              </div>
            </Box>

            <Box sx={{ mb: 2 }}>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  OFI
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={primaryOfi}
                  className="text-lg font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
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
                  fontSize: "18px",
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
                  fontSize: "18px",
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

export default ReportInternal;
