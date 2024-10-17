"use client";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
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
import DatePicker from "react-datepicker";
import { TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
interface PrimaryInternalScorecard {
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
interface Department {
  id: number;
  department_name: string;
}
type QAPrimaryInternalProps = {
  selectedDepartmentId: number;
  selectedYear: string;
};
export default function QAPrimaryInternal({
  selectedDepartmentId,
  selectedYear,
}: QAPrimaryInternalProps) {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const userRole = user?.role;
  // open modal
  const [primaryModalOpen, setPrimaryModalOpen] = useState(false);

  // primary internal values
  const [primaryTargetCode, setPrimaryTargetCode] = useState("");
  const [primaryMetric, setPrimaryMetric] = useState("");
  const [primaryOfficeTarget, setPrimaryOfficeTarget] = useState("");
  const [primaryStatus, setPrimaryStatus] = useState("");
  const [primaryKPI, setPrimaryKPI] = useState("");
  const [primaryTargetPerformance, setPrimaryTargetPerformance] = useState("");
  const [primaryActualPerformance, setPrimaryActualPerformance] = useState("");

  // {added link and target year}
  const [primaryTargetYear, setPrimaryTargetYear] = useState("");
  const [primaryEvidenceLink, setPrimaryEvidenceLink] = useState("");

  // primary internal scorecard
  const [primaryInternalScorecard, setPrimaryInternalScorecard] = useState<
    PrimaryInternalScorecard[]
  >([]);

  // for edit
  const [primaryEditId, setPrimaryEditId] = useState(0);
  const [primaryEditMode, setPrimaryEditMode] =
    useState<PrimaryInternalScorecard | null>(null);

  const handleCloseModal = () => {
    setPrimaryModalOpen(false);
    setPrimaryEditMode(null);
  };

  const calculateLevelOfAttainment = (
    actualPerformance: number,
    targetPerformance: number
  ): string => {
    const levelOfAttainment = (actualPerformance / targetPerformance) * 100;
    return levelOfAttainment.toFixed(2);
  };

  useEffect(() => {
    const fetchPrimaryInternalScorecard = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available");
        return;
      }
      console.log(
        "Fetching Primary Internal Scorecard for department ID: ",
        selectedDepartmentId
      );

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryInternalBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("An error occurred while fetching data");
        }
        const data = await response.json();
        console.log("Primary Internal Scorecard data: ", data);
        setPrimaryInternalScorecard(data);
      } catch (error) {
        console.error("Error fetching internal scorecards:", error);
        setPrimaryInternalScorecard([]);
      }
    };

    fetchPrimaryInternalScorecard();
  }, [selectedDepartmentId]);

  const handlePrimaryEditScorecard = (scorecard: PrimaryInternalScorecard) => {
    setPrimaryTargetCode(scorecard.target_code);
    setPrimaryMetric(scorecard.metric);
    setPrimaryOfficeTarget(scorecard.office_target);
    setPrimaryStatus(scorecard.status);
    setPrimaryKPI(scorecard.key_performance_indicator);
    setPrimaryTargetPerformance(scorecard.target_performance);
    setPrimaryActualPerformance(scorecard.actual_performance);
    setPrimaryTargetYear(scorecard.targetYear);
    setPrimaryEvidenceLink(scorecard.evidence_link || "");
    setPrimaryEditMode(scorecard);
    setPrimaryEditId(scorecard.id);
    setPrimaryModalOpen(true);
  };

  const handlePrimaryUpdateScorecard = async () => {
    if (!primaryEditMode) return;

    const updatedScorecard: PrimaryInternalScorecard = {
      ...primaryEditMode,
      target_code: primaryTargetCode,
      metric: primaryMetric,
      office_target: primaryOfficeTarget,
      status: primaryStatus,
      key_performance_indicator: primaryKPI,
      target_performance: primaryTargetPerformance,
      actual_performance: primaryActualPerformance,
      targetYear: primaryTargetYear,
      evidence_link: primaryEvidenceLink,
    };
    console.log("Priamry Edit Id", primaryEditId);
    try {
      const response = await fetch(
        `http://localhost:8080/bsc/primaryInternalBsc/update/${primaryEditId}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedScorecard),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update internal scorecard");
      }
      // Update the state with the updated scorecard
      const updatedScorecards = primaryInternalScorecard.map((scorecard) =>
        scorecard.id === primaryEditId ? updatedScorecard : scorecard
      );

      setPrimaryInternalScorecard(updatedScorecards);
      toast.success("Primary Internal scorecard updated successfully");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating primary internal scorecard:", error);
      toast.error("Error updating primary internal scorecard");
    }
  };

  return (
    <Grid item sx={{ color: "#2e2c2c" }}>
      <Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            mt: -2,
            mb: 2,
          }}
        >
          <img src="/internal.png" alt="" className=" h-[6rem] mr-2" />
          <Box sx={{ alignContent: "center", justifyContent: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              Internal Process Scorecard Overview
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "500" }}>
              Assesses the efficiency and quality of internal operations.
            </Typography>
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
                  Internal Office Target
                </TableCell>
                {/* {added KPI} */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  KPI
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
                  Target
                </TableCell>
                {/* {added actual} */}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Actual
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
              {primaryInternalScorecard &&
                primaryInternalScorecard.length > 0 &&
                primaryInternalScorecard
                  .filter((scorecard) => {
                    if (!selectedYear) return true;
                    return scorecard.targetYear === selectedYear;
                  })
                  .map((scorecard, index) => {
                    if (!scorecard) return null;

                    // Calculate the attainment level
                    const levelOfAttainment = calculateLevelOfAttainment(
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
                            index < primaryInternalScorecard.length - 1
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
                        {/* {added KPI} */}
                        <TableCell>
                          <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                            {scorecard.key_performance_indicator &&
                            scorecard.key_performance_indicator.length > 20
                              ? `${scorecard.key_performance_indicator.substring(
                                  0,
                                  15
                                )}...`
                              : scorecard.key_performance_indicator || "N/A"}
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
                        {/* {added actual performance} */}
                        <TableCell align="center">
                          <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                            {scorecard.actual_performance || "N/A"}
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
                              handlePrimaryEditScorecard(scorecard)
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
      <Modal open={primaryModalOpen} onClose={() => setPrimaryModalOpen(false)}>
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
                mb: 2,
              }}
            >
              <div className="flex flex-col w-[26rem]">
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
              </div>
              <div className="flex flex-col w-[26rem]">
                <span className="mr-3 font-regular text-lg text-[#000000]">
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
                  value={primaryTargetYear}
                  disabled
                />
              </div>
              <div className="flex flex-col w-[26rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Metric / Unit of Measure
                  <span className="text-[#DD1414]">*</span>
                </span>
                <FormControl fullWidth>
                  <Select
                    value={primaryMetric || ""}
                    onChange={(e) => setPrimaryMetric(e.target.value)}
                    sx={{
                      height: "47px",
                      "& .MuiInputBase-root": { height: "47px" },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "18px",
                      },
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
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={primaryKPI}
                  onChange={(e) => setPrimaryKPI(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Status
                  <span className="text-[#DD1414]">*</span>
                </span>
                <FormControl fullWidth>
                  <Select
                    value={primaryStatus || ""}
                    onChange={(e) => setPrimaryStatus(e.target.value)}
                    disabled={userRole !== "qualityAssurance"}
                    sx={{
                      height: "47px",
                      "& .MuiInputBase-root": { height: "47px" },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "18px",
                      },
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
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  type="number"
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={primaryTargetPerformance}
                  onChange={(e) => {
                    const maxLimit =
                      primaryMetric === "Percentage"
                        ? 100
                        : primaryMetric === "Rating"
                        ? 10
                        : primaryMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      primaryMetric === "Rating" ||
                      primaryMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setPrimaryTargetPerformance(value.toString());
                  }}
                />

                {primaryMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {primaryMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {primaryMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 10, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {primaryMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 20, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {primaryMetric === "Succession Plan" && (
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
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  type="number"
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={primaryActualPerformance}
                  onChange={(e) => {
                    const maxLimit =
                      primaryMetric === "Percentage"
                        ? 100
                        : primaryMetric === "Rating"
                        ? 10
                        : primaryMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      primaryMetric === "Rating" ||
                      primaryMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setPrimaryActualPerformance(value.toString());
                  }}
                />

                {primaryMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {primaryMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {primaryMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 10, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {primaryMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 20, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {primaryMetric === "Succession Plan" && (
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
                  <span className="text-[#DD1414]">*</span>
                </span>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    height: "50px",
                    "& .MuiInputBase-root": { height: "50px" },
                  }}
                  value={primaryEvidenceLink}
                  onChange={(e) => setPrimaryEvidenceLink(e.target.value)}
                />
              </div>
            </Box>
            <Box>
              <div className="flex flex-col ">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Office Target
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={primaryOfficeTarget}
                  className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-md h-[10rem]"
                  onChange={(e) => setPrimaryOfficeTarget(e.target.value)}
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
                onClick={handleCloseModal}
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
                onClick={handlePrimaryUpdateScorecard}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  p: 1,
                  fontSize: "18px",
                }}
              >
                {primaryEditMode ? "Edit" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
}
