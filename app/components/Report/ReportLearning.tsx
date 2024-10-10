"use client";
import { MenuItem, Select } from "@mui/material";
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
}

const ReportLearning = () => {
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

  // Array to store the report
  const [learningReport, setLearningReport] = useState<ReportLearning[]>([]);
  const [primaryLearningReports, setPrimaryLearningReports] = useState<
    ReportLearning[]
  >([]);
  const allLearningReports = [...primaryLearningReports, ...learningReport];
  const [isPrimaryReport, setIsPrimaryReport] = useState(false);

  // Modal and edit id
  const [openModal, setOpenModal] = useState(false);
  const [reportEditId, setReportEditId] = useState(0);

  useEffect(() => {
    const getAllLearning = async (department_id: number) => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/learning/get/${department_id}`
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
          `http://localhost:8080/bsc/primaryLearningBsc/get/${department_id}`
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

  const handleEditReport = (report: ReportLearning) => {
    const isPrimary = primaryLearningReports.some((p) => p.id === report.id);
    setIsPrimaryReport(isPrimary);
    if (isPrimary) {
      handleEditPrimaryReport(report);
    } else {
      handleEditLearningReport(report);
    }
  };

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
    setLearningEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit: ", report);
  };

  const handleEditPrimaryReport = (report: ReportLearning) => {
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
    setLearningEvidenceLink(report.evidence_link || ""); //link
    setOpenModal(true);
    console.log("Report ID to edit: ", report);
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
      evidence_link: learningEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/learning/update/${reportEditId}`,
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
      // Update the financialReports state directly
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
      evidence_link: learningEvidenceLink, //link
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/primaryLearningBsc/update/${reportEditId}`,
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
          report.id === reportEditId ? updatedPrimaryReport : report
        )
      );

      toast.success("Primary learning report updated successfully!");
      setOpenModal(false);
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
    <Grid item>
      <Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src="/learning.png" alt="" className=" h-[5rem] mr-2" />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginRight: "1rem",
            }}
          >
            <Box sx={{ alignContent: "center", justifyContent: "center" }}>
              <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                Learning Scorecard Overview
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
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
                <TableCell sx={{ fontWeight: "bold" }}>Office Target</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  KPI
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Budget
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  In-charge
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Performance <br />
                  <div className="font-medium ">
                    <span>Actual </span>
                    <span className="font-bold">|</span>
                    <span> Target</span>
                  </div>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  OFI
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Link of Evidence
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {allLearningReports.map((report, index) => (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: index % 2 === 0 ? "white" : "#fff6d1",
                  }}
                >
                  {/* Table Cells */}
                  <TableCell>
                    <span className="font-semibold text-gray-500">
                      {truncateString(report.office_target, 45)}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <span className="font-semibold text-gray-500">
                      {truncateString(report.key_performance_indicator, 20)}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {truncateString(report?.actions || "...", 8)}
                  </TableCell>
                  <TableCell align="center">
                    {report?.budget || "..."}
                  </TableCell>
                  <TableCell align="center">
                    {truncateString(report?.incharge || "...", 8)}
                  </TableCell>
                  <TableCell align="center">
                    <span className="text-start mr-2">
                      {report.actual_performance}
                    </span>
                    <span className="text-center">|</span>
                    <span className="text-end ml-2">
                      {report.target_performance}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {truncateString(report?.ofi || "...", 4)}
                  </TableCell>
                  <TableCell align="center">
                    {report.evidence_link ? (
                      <a
                        href={report.evidence_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 underline"
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
                    <button onClick={() => handleEditReport(report)}>
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
              padding: 4,
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
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Learning
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Year
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={learningTargetCode}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                />
              </div>

              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Budget
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={learningBudget}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) =>
                    setLearningBudget(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  KPI
                </span>
                <input
                  disabled
                  type="text"
                  value={learningKPI}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  In Charge
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={learningIncharge}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setLearningIncharge(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Link of Evidence
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={learningEvidenceLink}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  onChange={(e) => setLearningEvidenceLink(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[23rem] h-10">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Performance (Actual | Target)
                </span>
                <input
                  disabled
                  type="text"
                  value={
                    learningActualPerformance +
                    " | " +
                    learningTargetPerformance
                  }
                  className="text-lg font-regular border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                />
              </div>
            </Box>
            <Box
              sx={{
                mb: 2,
              }}
            >
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Office Target
                </span>
                <textarea
                  value={learningOfficeTarget}
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Actions
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={learningActions}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  OFI
                  <span className="text-[#DD1414]">*</span>
                </span>

                <textarea
                  value={learningOFI}
                  className="text-lg font-regular border border-gray-300 bg-gray-50 h-[5rem] rounded-md px-3 py-2 text-[rgb(59,59,59)]"
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
                  paddingX: 2,
                }}
                style={{
                  background: "white",
                  border: "1px solid #AB3510",
                }}
              >
                Cancel
              </Button>
              {isPrimaryReport ? (
                <Button
                  variant="contained"
                  onClick={handleSavePrimaryReport}
                  sx={{
                    minWidth: "10rem",
                    background: "linear-gradient(to left, #8a252c, #AB3510)",
                    padding: 1,
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSaveReport}
                  sx={{
                    minWidth: "10rem",
                    background: "linear-gradient(to left, #8a252c, #AB3510)",
                    padding: 1,
                  }}
                >
                  Save
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default ReportLearning;
