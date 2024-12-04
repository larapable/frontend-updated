"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
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
  targetYear: string;
}
interface PrimaryReportFinancial {
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

interface ReportFinancialProps {
  selectedYear: string;
}

const ReportFinancial: React.FC<ReportFinancialProps> = ({ selectedYear }) => {
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
  const [financialTargetYear, setFinancialTargetYear] = useState("");

  //Report and Scorecard
  const [financialReports, setFinancialReports] = useState<ReportFinancial[]>(
    []
  );

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

  const [primaryFinancialReports, setPrimaryFinancialReports] = useState<
    PrimaryReportFinancial[]
  >([]);

  const allFinancialReports = [...primaryFinancialReports, ...financialReports];
  const [isPrimaryReport, setIsPrimaryReport] = useState(false);

  // Modal and edit mode
  const [openModal, setOpenModal] = useState(false); // State to control the modal
  const [reportEditId, setReportEditId] = useState(0); // State to store the report edit ID

  const [primaryOpenModal, setPrimaryOpenModal] = useState(false); // State to control the modal
  const [primaryReportEditId, setPrimaryReportEditId] = useState(0);

  useEffect(() => {
    const getAllFinancial = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/financial/get/${department_id}`
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryFinancialBsc/get/${department_id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch primary financial report.");
        }
        const result = await res.json();
        console.log("response data:", result);
        setPrimaryFinancialReports(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching financial reports:", error);
      }
    };
    getPrimaryFinancial(department_id);
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

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // const handleEditReport = (report: ReportFinancial) => {
  //   const isPrimary = primaryFinancialReports.some((p) => p.id === report.id);
  //   console.log(
  //     `Editing report ID: ${
  //       report.id
  //     }, Primary IDs: ${primaryFinancialReports.map(
  //       (p) => p.id
  //     )}, Is Primary: ${isPrimary}`
  //   );

  //   setIsPrimaryReport(isPrimary);

  //   if (isPrimary) {
  //     // Only call this if it's indeed a primary report
  //     handleEditPrimaryReport(report);
  //   } else {
  //     handleEditFinancialReport(report);
  //   }
  // };

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
    setFinancialTargetYear(report.targetYear);
    setFinancialEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit:", report.id);
  };

  const handleEditPrimaryReport = (report: PrimaryReportFinancial) => {
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
      targetYear: financialTargetYear,
      evidence_link: financialEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/financial/update/${reportEditId}`,
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
    const updatedPrimaryReport: PrimaryReportFinancial = {
      id: primaryReportEditId,
      actions: primaryActions,
      perspective: financialPerspective,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryFinancialBsc/update/${primaryReportEditId}`,
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
          report.id === primaryReportEditId ? updatedPrimaryReport : report
        )
      );

      toast.success("Primary financial report updated successfully!");
      setPrimaryOpenModal(false);
    } catch (error) {
      console.error("Error updating primary financial report:", error);
      toast.error("Failed to update report.");
    }
  };

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
          <img src="/financial.png" alt="" className=" h-[4rem] mr-2" />
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
                Financial Scorecard Overview
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
              {/* Render Primary Financial Reports */}
              {primaryFinancialReports
                .filter((scorecard) => {
                  if (!selectedYear) return true;
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < primaryFinancialReports.length - 1
                          ? "gray-200"
                          : "transparent"
                      }`,
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell>
                      <span className="font-medium text-[13px]">
                        {truncateString(report.office_target, 40)}
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

              {financialReports
                .filter((scorecard) => {
                  if (!selectedYear) return true;
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < financialReports.length - 1
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
                      <button onClick={() => handleEditFinancialReport(report)}>
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
              Financial
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
                  value={financialTargetCode}
                  onChange={(e) => setFinancialTargetCode(e.target.value)}
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
                  value={financialBudget}
                  onChange={(e) =>
                    setFinancialBudget(parseFloat(e.target.value) || 0)
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
                  value={financialKPI}
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
                  value={financialIncharge}
                  onChange={(e) => setFinancialIncharge(e.target.value)}
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
                  value={financialEvidenceLink}
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
                    financialActualPerformance +
                    " | " +
                    financialTargetPerformance
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
                  value={financialOfficeTarget}
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
                  value={financialActions}
                  className="text-[13px] font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setFinancialActions(e.target.value)}
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
                  value={financialOfi}
                  className="text-[13px] font-regular border border-gray-300 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setFinancialOfi(e.target.value)}
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
              Financial
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

export default ReportFinancial;