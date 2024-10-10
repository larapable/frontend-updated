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

interface LearningScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}

type QALearningProps = {
  selectedDepartmentId: number;
};

export default function QALearning({ selectedDepartmentId }: QALearningProps) {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const userRole = user?.role;

  // Open modal
  const [learningModalOpen, setLearningModalOpen] = useState(false);

  // Learning state variables
  const [learningTargetCode, setLearningTargetCode] = useState("");
  const [learningMetric, setLearningMetric] = useState("");
  const [learningOfficeTarget, setLearningOfficeTarget] = useState("");
  const [learningTargetYear, setLearningTargetYear] = useState(new Date());
  const [learningTargetPerformance, setLearningTargetPerformance] =
    useState("");
  const [learningStatus, setLearningStatus] = useState("");
  const [learningKPI, setLearningKPI] = useState("");
  const [learningActualPerformance, setLearningActualPerformance] =
    useState("");
  const [learningLevelOfAttainment, setLearningLevelOfAttainment] =
    useState("");
  const [learningSavedScorecards, setLearningSavedScorecards] = useState<
    LearningScorecard[]
  >([]);

  // Track edit mode
  const [learningEditID, setLearningEditID] = useState(0);
  const [learningEditMode, setLearningEditMode] =
    useState<LearningScorecard | null>(null);

  const handleLearningCloseModal = () => {
    setLearningModalOpen(false);
    setLearningEditMode(null);
  };

  const calculateLearningLevelOfAttainment = (
    actualLearningPerformance: number,
    targetLearningPerformance: number
  ): string => {
    const levelOfAttainmentLearning =
      (actualLearningPerformance / targetLearningPerformance) * 100;
    return levelOfAttainmentLearning.toFixed(2) + "%";
  };

  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchLearningScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/learning/get/${selectedDepartmentId}`
        );
        if (response.ok) {
          const data = await response.json();
          setLearningSavedScorecards(data);
        } else {
          // If the status code is anything other than 2xx, we can log it without throwing an error
          console.warn(`Warning: Received status ${response.status}`);
          setLearningSavedScorecards([]); // Optionally clear scorecards if there’s an error
        }
      } catch (error) {
        console.error("Error fetching learning scorecards:", error);
        setLearningSavedScorecards([]);
      }
    };

    fetchLearningScorecards();
  }, [selectedDepartmentId]);

  const handleLearningEditScorecard = (scorecard: LearningScorecard) => {
    setLearningTargetCode(scorecard.target_code);
    setLearningMetric(scorecard.metric);
    setLearningOfficeTarget(scorecard.office_target);
    setLearningStatus(scorecard.status);
    setLearningKPI(scorecard.key_performance_indicator);
    setLearningTargetPerformance(scorecard.target_performance);
    setLearningActualPerformance(scorecard.actual_performance);
    setLearningEditMode(scorecard);
    setLearningEditID(scorecard.id);
    setLearningModalOpen(true);
  };

  const handleLearningUpdateScorecard = async () => {
    if (!learningEditMode) return;

    const updatedScorecard: LearningScorecard = {
      ...learningEditMode,
      target_code: learningTargetCode,
      metric: learningMetric,
      office_target: learningOfficeTarget,
      status: learningStatus,
      key_performance_indicator: learningKPI,
      target_performance: learningTargetPerformance,
      actual_performance: learningActualPerformance,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/learning/update/${learningEditID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedScorecard),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update learning scorecard");
      }

      // Update the saved scorecards with the updated scorecard
      const updatedScorecards = learningSavedScorecards.map((scorecard) =>
        scorecard.id === learningEditID ? updatedScorecard : scorecard
      );
      setLearningSavedScorecards(updatedScorecards);
      toast.success("Learning scorecard updated successfully");
      handleLearningCloseModal();
    } catch (error) {
      console.error("Error updating learning scorecard:", error);
      toast.error("Error updating learning scorecard");
    }
  };
  const handleYearDateChange = (date: Date | null) => {
    console.log("Selected Completion Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setLearningTargetYear(utcDate);
    } else {
      //@ts-ignore
      setLearningTargetYear(null);
    }
  };

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
          <img src="/financial.png" alt="" className=" h-[5rem] mr-2" />
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
                Learning & Growth Scorecard Overview
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                Focuses on innovation, improvement, and development.
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
                <TableCell sx={{ fontWeight: "bold" }}>Target Code</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Learning Office Target
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Metric
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Target Performance
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Attainment
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {learningSavedScorecards &&
                learningSavedScorecards.length > 0 &&
                learningSavedScorecards.map((scorecard, index) => {
                  if (!scorecard) return null;

                  // Calculate the attainment level
                  const levelOfAttainment = calculateLearningLevelOfAttainment(
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
                        bgcolor: index % 2 === 0 ? "white" : "#fff6d1",
                      }}
                    >
                      {/* Table Cells */}
                      <TableCell>
                        <span className="font-semibold text-gray-500">
                          {scorecard.target_code || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell sx={{ maxWidth: "35rem" }}>
                        <span className="font-semibold">
                          {scorecard.office_target || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span className="font-semibold">
                          {scorecard.metric || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span className="font-semibold">
                          {scorecard.target_performance || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span className="font-semibold">
                          {validatedLevelOfAttainment || "N/A"}%
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <div className="font-semibold border rounded-lg bg-yellow-200 border-yellow-500 px-1 py-3 ">
                          {scorecard.status || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#c2410c" }}>
                        <button
                          onClick={() => handleLearningEditScorecard(scorecard)}
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
        open={learningModalOpen}
        onClose={() => setLearningModalOpen(false)}
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
              Learning & Growth
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Code
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={learningTargetCode}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setLearningTargetCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col ">
                <span className="mr-3 font-regular text-md text-[#000000]">
                  Target Year
                </span>
                <DatePicker
                  key={learningTargetYear?.toString()}
                  selected={learningTargetYear}
                  onChange={handleYearDateChange}
                  minDate={new Date()}
                  placeholderText="YYYY"
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[26rem]"
                />
              </div>
              <div className="flex flex-col w-[26rem]">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Metric / Unit of Measure
                  <span className="text-[#DD1414]">*</span>
                </span>
                <select
                  value={learningMetric || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
                  onChange={(e) => setLearningMetric(e.target.value)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Count">Count</option>
                  <option value="Rating">Rating</option>
                  <option value="Score">Score</option>
                  <option value="Succession Plan">Succession Plan</option>
                </select>
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Key Performance Indicator
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={learningKPI}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setLearningKPI(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Status
                </span>
                <select
                  value={learningStatus || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setLearningStatus(e.target.value)}
                  disabled={userRole !== "qualityAssurance"} // Disable if not QA
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Not Achieved">Not Achieved</option>
                  <option value="Achieved">Achieved</option>
                </select>
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Performance
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="number"
                  value={learningTargetPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
                  onChange={(e) => {
                    const maxLimit =
                      learningMetric === "Percentage"
                        ? 100
                        : learningMetric === "Rating"
                        ? 10
                        : learningMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      learningMetric === "Rating" ||
                      learningMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setLearningTargetPerformance(value.toString());
                  }}
                />
                {learningMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {learningMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {learningMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {learningMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {learningMetric === "Succession Plan" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a numeric value to represent the status of the
                    succession plan. Ensure the value accurately reflects
                    readiness or progress.
                  </span>
                )}
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Actual Performance
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="number"
                  value={learningActualPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => {
                    const maxLimit =
                      learningMetric === "Percentage"
                        ? 100
                        : learningMetric === "Rating"
                        ? 10
                        : learningMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      learningMetric === "Rating" ||
                      learningMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setLearningActualPerformance(value.toString());
                  }}
                />
                {learningMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {learningMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {learningMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {learningMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {learningMetric === "Succession Plan" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a numeric value to represent the status of the
                    succession plan. Ensure the value accurately reflects
                    readiness or progress.
                  </span>
                )}
              </div>
            </Box>
            <Box>
              <div className="flex flex-col ">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Office Target
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={learningOfficeTarget}
                  className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-lg h-[10rem]"
                  onChange={(e) => setLearningOfficeTarget(e.target.value)}
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
                onClick={handleLearningCloseModal}
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
              <Button
                variant="contained"
                onClick={handleLearningUpdateScorecard}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  padding: 1,
                }}
              >
                {learningEditMode ? "Edit" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
}
