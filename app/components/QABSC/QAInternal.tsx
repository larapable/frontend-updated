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

interface InternalScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}
type QAInternalrProps = {
  selectedDepartmentId: number;
};

export default function QAInternal({ selectedDepartmentId }: QAInternalrProps) {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const userRole = user?.role;

  // open modal
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  // internal values
  const [internalTargetCode, setInternalTargetCode] = useState("");
  const [internalMetric, setInternalMetric] = useState("");
  const [internalOfficeTarget, setInternalOfficeTarget] = useState("");
  const [internalTargetYear, setInternalTargetYear] = useState(new Date());
  const [internalTargetPerformance, setInternalTargetPerformance] =
    useState("");
  const [internalStatus, setInternalStatus] = useState("");
  const [internalKPI, setInternalKPI] = useState("");
  const [internalActualPerformance, setInternalActualPerformance] =
    useState("");
  const [internalLevelOfAttainment, setInternalLevelOfAttainment] =
    useState("");

  // internal scorecard
  const [internalSavedScorecards, setInternalSavedScorecards] = useState<
    InternalScorecard[]
  >([]);

  // for edit
  const [internalEditID, setInternalEditID] = useState(0);
  const [internalEditMode, setInternalEditMode] =
    useState<InternalScorecard | null>(null);

  const handleInternalCloseModal = () => {
    setInternalModalOpen(false);
    setInternalEditMode(null); // Reset the edit mode
  };

  const calculateInternalLevelOfAttainment = (
    actualInternalPerformance: number,
    targetInternalPerformance: number
  ): string => {
    const levelOfAttainmentInternal =
      (actualInternalPerformance / targetInternalPerformance) * 100;
    return levelOfAttainmentInternal.toFixed(2);
  };

  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchInternalScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/internal/get/${selectedDepartmentId}`
        );
        if (response.ok) {
          const data = await response.json();
          setInternalSavedScorecards(data);
        } else {
          console.warn(`Warning: Received status ${response.status}`);
          setInternalSavedScorecards([]); // Optionally clear scorecards if there’s an error
        }
      } catch (error) {
        console.error("Error fetching internal scorecards:", error);
        setInternalSavedScorecards([]); //Clears scorecards on error
      }
    };

    fetchInternalScorecards();
  }, [selectedDepartmentId]);

  const handleInternalEditScorecard = (scorecard: InternalScorecard) => {
    setInternalTargetCode(scorecard.target_code);
    setInternalMetric(scorecard.metric);
    setInternalOfficeTarget(scorecard.office_target);
    setInternalStatus(scorecard.status);
    setInternalKPI(scorecard.key_performance_indicator);
    setInternalTargetPerformance(scorecard.target_performance);
    setInternalActualPerformance(scorecard.actual_performance);
    setInternalEditMode(scorecard);
    setInternalEditID(scorecard.id);
    setInternalModalOpen(true);
  };

  const handleInternalUpdateScorecard = async () => {
    if (!internalEditMode) return;

    const updatedScorecard: InternalScorecard = {
      ...internalEditMode,
      target_code: internalTargetCode,
      metric: internalMetric,
      office_target: internalOfficeTarget,
      status: internalStatus,
      key_performance_indicator: internalKPI,
      target_performance: internalTargetPerformance,
      actual_performance: internalActualPerformance,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/internal/update/${internalEditID}`,
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
      const updatedScorecards = internalSavedScorecards.map((scorecard) =>
        scorecard.id === internalEditID ? updatedScorecard : scorecard
      );
      setInternalSavedScorecards(updatedScorecards);
      toast.success("Internal scorecard updated successfully");
      handleInternalCloseModal();
    } catch (error) {
      console.error("Error updating internal scorecard:", error);
      toast.error("Error updating internal scorecard");
    }
  };

  const handleYearDateChange = (date: Date | null) => {
    console.log("Selected Completion Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setInternalTargetYear(utcDate);
    } else {
      //@ts-ignore
      setInternalTargetYear(null);
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
          <img src="/internal.png" alt="" className=" h-[5rem] mr-2" />
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
                Internal Process Scorecard Overview
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                Assesses the efficiency and quality of internal operations.
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
                  Internal Office Target
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
              {internalSavedScorecards &&
                internalSavedScorecards.length > 0 &&
                internalSavedScorecards.map((scorecard, index) => {
                  if (!scorecard) return null;

                  // Calculate the attainment level
                  const levelOfAttainment = calculateInternalLevelOfAttainment(
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
                          onClick={() => handleInternalEditScorecard(scorecard)}
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
        open={internalModalOpen}
        onClose={() => setInternalModalOpen(false)}
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
              Internal Process
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
                  value={internalTargetCode}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setInternalTargetCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col ">
                <span className="mr-3 font-regular text-md text-[#000000]">
                  Target Year
                </span>
                <DatePicker
                  key={internalTargetYear?.toString()}
                  selected={internalTargetYear}
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
                  value={internalMetric || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
                  onChange={(e) => setInternalMetric(e.target.value)}
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
                  value={internalKPI}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setInternalKPI(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Status
                </span>
                <select
                  value={internalStatus || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setInternalStatus(e.target.value)}
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
                  value={internalTargetPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
                  onChange={(e) => {
                    const maxLimit =
                      internalMetric === "Percentage"
                        ? 100
                        : internalMetric === "Rating"
                        ? 10
                        : internalMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      internalMetric === "Rating" ||
                      internalMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setInternalTargetPerformance(value.toString());
                  }}
                />
                {internalMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {internalMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {internalMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {internalMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {internalMetric === "Succession Plan" && (
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
                  value={internalActualPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => {
                    const maxLimit =
                      internalMetric === "Percentage"
                        ? 100
                        : internalMetric === "Rating"
                        ? 10
                        : internalMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      internalMetric === "Rating" ||
                      internalMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setInternalActualPerformance(value.toString());
                  }}
                />
                {internalMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {internalMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {internalMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {internalMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {internalMetric === "Succession Plan" && (
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
                  value={internalOfficeTarget}
                  className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-lg h-[10rem]"
                  onChange={(e) => setInternalOfficeTarget(e.target.value)}
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
                onClick={handleInternalCloseModal}
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
                onClick={handleInternalUpdateScorecard}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  padding: 1,
                }}
              >
                {internalEditMode ? "Edit" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
}
