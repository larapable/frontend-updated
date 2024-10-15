"use client";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

interface FinancialScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  targetYear: string;
  evidence_link: string;
}

type QAFinancialProps = {
  selectedDepartmentId: number;
  selectedYear: string;
};

export default function QAFinancial({
  selectedDepartmentId,
  selectedYear,
}: QAFinancialProps) {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const userRole = user?.role;
  
  //set current year
  const currentYear = new Date().getFullYear();

  // open modal
  const [financialModalOpen, setFinancialModalOpen] = useState(false);
  // financial values
  const [financialTargetCode, setFinancialTargetCode] = useState("");
  const [financialMetric, setFinancialMetric] = useState("");
  const [financialOfficeTarget, setFinancialOfficeTarget] = useState("");
  const [financialStatus, setFinancialStatus] = useState("");
  const [financialKPI, setFinancialKPI] = useState("");
  const [financialTargetPerformance, setFinancialTargetPerformance] =
    useState("");
  const [financialActualPerformance, setFinancialActualPerformance] =
    useState("");
  const [financialLevelOfAttainment, setFinancialLevelOfAttainment] =
    useState("");

  // {added link and target year}
  const [financialTargetYear, setFinancialTargetYear] = useState("");
  const [financialEvidenceLink, setFinancialEvidenceLink] = useState("");

  // financial scorecards
  const [financialSavedScorecards, setFinancialSavedScorecards] = useState<
    FinancialScorecard[]
  >([]);

  //for edit
  const [financialEditID, setFinancialEditID] = useState(0); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  const [financialEditMode, setFinancialEditMode] =
    useState<FinancialScorecard | null>(null);

  const handleFinancialCloseModal = () => {
    setFinancialModalOpen(false);
    setFinancialEditMode(null); // Reset edit mode
  };

  // to get the level of attainment kay you need to divide actual performance to target performance and need sad siya percentage
  const calculateFinancialLevelOfAttainment = (
    actualFinancialPerformance: number,
    targetFinancialPerformance: number
  ): string => {
    const levelOfAttainmentFinancial =
      (actualFinancialPerformance / targetFinancialPerformance) * 100;
    return levelOfAttainmentFinancial.toFixed(2);
  };

  useEffect(() => {
    const fetchFinancialScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching financial scorecards for department ID:",
        selectedDepartmentId
      );

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${selectedDepartmentId}`
        );

        // No need to throw an error if the response is not ok,
        // just handle it gracefully by checking the response status
        if (response.ok) {
          const data = await response.json();
          console.log("Financial scorecards data:", data);
          setFinancialSavedScorecards(data);
        } else {
          // If the status code is anything other than 2xx, we can log it without throwing an error
          console.warn(`Warning: Received status ${response.status}`);
          setFinancialSavedScorecards([]); // Optionally clear scorecards if there’s an error
        }
      } catch (error) {
        console.error("Error fetching financial scorecards:", error);
        // Optionally handle the error by setting an empty state
        setFinancialSavedScorecards([]); // Clears scorecards on error
      }
    };
    fetchFinancialScorecards();
  }, [selectedDepartmentId]);

  const handleFinancialEditScorecard = (scorecard: FinancialScorecard) => {
    setFinancialTargetCode(scorecard.target_code);
    setFinancialMetric(scorecard.metric);
    setFinancialOfficeTarget(scorecard.office_target);
    setFinancialStatus(scorecard.status);
    setFinancialKPI(scorecard.key_performance_indicator);
    setFinancialTargetPerformance(scorecard.target_performance);
    setFinancialActualPerformance(scorecard.actual_performance);
    setFinancialTargetYear(scorecard.targetYear);
    setFinancialEvidenceLink(scorecard.evidence_link || "");
    setFinancialEditMode(scorecard);
    setFinancialEditID(scorecard.id);
    setFinancialModalOpen(true);
  };

  const handleFinancialUpdateScorecard = async () => {
    if (!financialEditMode) return;

    const updatedScorecard: FinancialScorecard = {
      ...financialEditMode,
      target_code: financialTargetCode,
      metric: financialMetric,
      office_target: financialOfficeTarget,
      status: financialStatus,
      key_performance_indicator: financialKPI,
      target_performance: financialTargetPerformance,
      actual_performance: financialActualPerformance,
      targetYear: financialTargetYear,
      evidence_link: financialEvidenceLink,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/financial/update/${financialEditID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedScorecard),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update financial scorecard");
      }

      // Update the state with the updated scorecard
      const updatedScorecards = financialSavedScorecards.map((scorecard) =>
        scorecard.id === financialEditID ? updatedScorecard : scorecard
      );

      setFinancialSavedScorecards(updatedScorecards);
      toast.success("Financial scorecard updated successfully");
      handleFinancialCloseModal();
    } catch (error) {
      console.error("Error updating financial scorecard:", error);
      toast.error("Error updating financial scorecard");
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
            mt: -2,
            mb: 2,
          }}
        >
          <img src="/financial.png" alt="" className=" h-[6rem] mr-2" />
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
                Financial Scorecard Overview
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "500" }}>
                Measures financial performance and profitability.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Box>
        <TableContainer component={Paper}>
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
                  Target Code
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Financial Office Target
                </TableCell>
                {/* {added target Year} */}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Target Year
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Metric
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Target Performance
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Attainment
                </TableCell>
                {/* {added evidence link} */}
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
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Status
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {financialSavedScorecards &&
                financialSavedScorecards.length > 0 &&
                financialSavedScorecards
                  .filter((scorecard) => {
                    if (!selectedYear) return true;
                    return scorecard.targetYear === selectedYear;
                  })
                  .map((scorecard, index) => {
                    if (!scorecard) return null;

                    // Calculate the attainment level
                    const levelOfAttainment =
                      calculateFinancialLevelOfAttainment(
                        parseFloat(scorecard.actual_performance),
                        parseFloat(scorecard.target_performance)
                      );
                    const validatedLevelOfAttainment = Math.min(
                      Math.max(parseFloat(levelOfAttainment), 1),
                      100
                    );

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          borderBottom: `1px solid ${
                            index < financialSavedScorecards.length - 1
                              ? "gray-200"
                              : "transparent"
                          }`,
                        }}
                      >
                        {/* Table Cells */}
                        <TableCell>
                          <span className="font-medium text-[#2e2c2c] text-[1.1rem]">
                            {scorecard.target_code || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell sx={{ maxWidth: "35rem" }}>
                          <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                            {scorecard.office_target || "N/A"}
                          </span>
                        </TableCell>
                        {/* {added target year} */}
                        <TableCell align="center">
                          <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                            {scorecard.targetYear || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                            {scorecard.metric || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                            {scorecard.target_performance || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                            {validatedLevelOfAttainment || "N/A"}%
                          </span>
                        </TableCell>
                        {/* {added Link of evidence} */}
                        <TableCell align="center">
                          {scorecard.evidence_link ? (
                            <a
                              href={scorecard.evidence_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 underline"
                            >
                              {scorecard.evidence_link.length > 20
                                ? `${scorecard.evidence_link.substring(
                                    0,
                                    15
                                  )}...`
                                : scorecard.evidence_link}
                            </a>
                          ) : (
                            "..."
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <div className="font-medium border rounded-lg bg-yellow-200 border-yellow-500 px-1 py-3 text-[1.1rem] text-[#2e2c2c]">
                            {scorecard.status || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell align="center" sx={{ color: "#c2410c" }}>
                          <button
                            onClick={() =>
                              handleFinancialEditScorecard(scorecard)
                            }
                          >
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
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Modal */}
      <Modal
        open={financialModalOpen}
        onClose={() => setFinancialModalOpen(false)}
      >
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
              Financial
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                mb: 2,
              }}
            >
              <div className="flex flex-col w-[26rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Target Code
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    backgroundColor:
                      userRole === "qualityAssurance" ? "#f2f2f2" : "white",
                  }}
                  value={financialTargetCode}
                  onChange={(e) => setFinancialTargetCode(e.target.value)}
                  disabled={userRole === "qualityAssurance"}
                />
              </div>
              <div className="flex flex-col w-[26rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Target Year
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    background: "#f2f2f2",
                  }}
                  value={financialTargetYear}
                  disabled
                />
              </div>
              <div className="flex flex-col w-[26rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Metric / Unit of Measure
                </span>
                <FormControl fullWidth>
                  <Select
                    value={financialMetric || ""}
                    onChange={(e) => setFinancialMetric(e.target.value)}
                    disabled={userRole === "qualityAssurance"}
                    sx={{
                      height: "47px",
                      "& .MuiInputBase-root": { height: "47px" },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "18px",
                      },
                      backgroundColor:
                        userRole === "qualityAssurance" ? "#f2f2f2" : "white",
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    <MenuItem value="Percentage">Percentage (%)</MenuItem>
                    <MenuItem value="Count">Count</MenuItem>
                    <MenuItem value="Rating">Rating</MenuItem>
                    <MenuItem value="Score">Score</MenuItem>
                    <MenuItem value="Succession Plan">Succession Plan</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 4,
                mb: 2,
              }}
            >
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Key Performance Indicator
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    backgroundColor:
                      userRole === "qualityAssurance" ? "#f2f2f2" : "white",
                  }}
                  value={financialKPI}
                  onChange={(e) => setFinancialKPI(e.target.value)}
                  disabled={userRole === "qualityAssurance"}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Status
                  <span className="text-[#DD1414]">*</span>
                </span>
                <FormControl fullWidth>
                  <Select
                    value={financialStatus || ""}
                    onChange={(e) => setFinancialStatus(e.target.value)}
                    disabled={userRole !== "qualityAssurance"}
                    sx={{
                      height: "47px",
                      "& .MuiInputBase-root": { height: "47px" },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "18px",
                      },
                      backgroundColor:
                        userRole === "qualityAssurance" ? "white" : "#f2f2f2",
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    <MenuItem value="Not Achieved">Not Achieved</MenuItem>
                    <MenuItem value="Achieved">Achieved</MenuItem>
                  </Select>
                </FormControl>
                {userRole !== "qualityAssurance" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    You cannot edit the status unless you are in a QA role.
                  </span>
                )}
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Target Performance
                </span>
                <TextField
                  type="number"
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    backgroundColor:
                      userRole === "qualityAssurance" ? "#f2f2f2" : "white",
                  }}
                  value={financialTargetPerformance}
                  onChange={(e) => {
                    const maxLimit =
                      financialMetric === "Percentage"
                        ? 100
                        : financialMetric === "Rating"
                        ? 10
                        : financialMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      financialMetric === "Rating" ||
                      financialMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setFinancialTargetPerformance(value.toString());
                  }}
                  disabled={userRole === "qualityAssurance"}
                />

                {financialMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {financialMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {financialMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 10, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {financialMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 20, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {financialMetric === "Succession Plan" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a numeric value to represent the status of the
                    succession plan. Ensure the value accurately reflects
                    readiness or progress.
                  </span>
                )}
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Actual Performance
                </span>
                <TextField
                  type="number"
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    backgroundColor:
                      userRole === "qualityAssurance" ? "#f2f2f2" : "white",
                  }}
                  value={financialActualPerformance}
                  onChange={(e) => {
                    const maxLimit =
                      financialMetric === "Percentage"
                        ? 100
                        : financialMetric === "Rating"
                        ? 10
                        : financialMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      financialMetric === "Rating" ||
                      financialMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setFinancialActualPerformance(value.toString());
                  }}
                  disabled={userRole === "qualityAssurance"}
                />

                {financialMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {financialMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {financialMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 10, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {financialMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 20, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {financialMetric === "Succession Plan" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a numeric value to represent the status of the
                    succession plan. Ensure the value accurately reflects
                    readiness or progress.
                  </span>
                )}
              </div>
            </Box>
            {/* {added link of evidence} */}
            <Box>
              <div className="flex flex-col mt-5">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Link of Evidence
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                    backgroundColor:
                      userRole === "qualityAssurance" ? "#f2f2f2" : "white",
                  }}
                  value={financialEvidenceLink}
                  onChange={(e) => setFinancialEvidenceLink(e.target.value)}
                  disabled={userRole === "qualityAssurance"}
                />
              </div>
            </Box>
            <Box>
              <div className="flex flex-col ">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Office Target
                </span>
                <textarea
                  value={financialOfficeTarget}
                  className={`border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-md h-[10rem] ${
                    userRole === "qualityAssurance"
                      ? "bg-[#f2f2f2]"
                      : "bg-white"
                  }`}
                  onChange={(e) => setFinancialOfficeTarget(e.target.value)}
                  disabled={userRole === "qualityAssurance"}
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
                onClick={handleFinancialCloseModal}
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
                onClick={handleFinancialUpdateScorecard}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  p: 1,
                  fontSize: "18px",
                }}
              >
                {financialEditMode ? "Edit" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
}
