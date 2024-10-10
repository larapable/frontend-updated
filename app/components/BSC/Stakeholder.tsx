"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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

interface StakeholderScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}

export default function Stakeholder() {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const department_id = user?.department_id;
  const userRole = user?.role;

  // open modal
  const [stakeholderModalOpen, setStakeholderModalOpen] = useState(false);

  // stakeholder values
  const [stakeholderTargetCode, setStakeholderTargetCode] = useState("");
  const [stakeholderMetric, setStakeholderMetric] = useState("");
  const [stakeholderOfficeTarget, setStakeholderOfficeTarget] = useState("");
  const [stakeholderTargetYear, setStakeholderTargetYear] = useState(
    new Date()
  );
  const [stakeholderTargetPerformance, setStakeholderTargetPerformance] =
    useState("");
  const [stakeholderStatus, setStakeholderStatus] = useState("Not Achieved");
  const [stakeholderKPI, setStakeholderKPI] = useState("");
  const [stakeholderActualPerformance, setStakeholderActualPerformance] =
    useState("");
  const [stakeholderLevelOfAttainment, setStakeholderLevelOfAttainment] =
    useState("");

  //stakeholder scorecards
  const [stakeholderSavedScorecards, setStakeholderSavedScorecards] = useState<
    StakeholderScorecard[]
  >([]);

  //for edit
  const [stakeholderEditID, setStakeholderEditID] = useState(0);
  const [stakeholderEditMode, setStakeholderEditMode] =
    useState<StakeholderScorecard | null>(null); // Track edit mode

  const handleStakeholderCloseModal = () => {
    setStakeholderModalOpen(false);
    setStakeholderEditMode(null); // Reset edit mode
  };

  const handleStakeholderAddMoreScorecard = async () => {
    setStakeholderTargetCode("");
    setStakeholderMetric("");
    setStakeholderOfficeTarget("");
    setStakeholderTargetPerformance("");
    setStakeholderStatus("Not Achieved");
    setStakeholderKPI("");
    setStakeholderActualPerformance("");
    setStakeholderLevelOfAttainment("");
    setStakeholderEditMode(null);
    setStakeholderModalOpen(true);
  };

  // Determine which function to call when the save button is clicked
  const handleSaveButtonClick = () => {
    if (stakeholderEditMode) {
      handleStakeholderUpdateScorecard();
    } else {
      handleStakeholderSaveScorecard();
    }
  };

  const calculateStakeholderLevelOfAttainment = (
    actualStakeholderPerformance: number,
    targetStakeholderPerformance: number
  ): string => {
    const levelOfAttainmentStakeholder =
      (actualStakeholderPerformance / targetStakeholderPerformance) * 100;
    return levelOfAttainmentStakeholder.toFixed(2);
  };

  // Fetch the saved Stakeholder scorecards from the server
  useEffect(() => {
    const fetchStakeholderScorecards = async () => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/stakeholder/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stakeholder scorecards");
        }
        const data = await response.json();
        setStakeholderSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching stakeholder scorecards:", error);
      }
    };

    fetchStakeholderScorecards();
  }, [department_id]);

  const handleStakeholderEditScorecard = (scorecard: StakeholderScorecard) => {
    setStakeholderTargetCode(scorecard.target_code);
    setStakeholderMetric(scorecard.metric);
    setStakeholderOfficeTarget(scorecard.office_target);
    setStakeholderStatus(scorecard.status);
    setStakeholderKPI(scorecard.key_performance_indicator);
    setStakeholderTargetPerformance(scorecard.target_performance);
    setStakeholderActualPerformance(scorecard.actual_performance);
    setStakeholderEditMode(scorecard);
    setStakeholderEditID(scorecard.id);
    setStakeholderModalOpen(true);
  };

  const handleStakeholderSaveScorecard = async () => {
    // Check if all fields are filled
    if (
      !stakeholderTargetCode ||
      !stakeholderMetric ||
      !stakeholderOfficeTarget ||
      !stakeholderTargetPerformance ||
      !stakeholderStatus ||
      !stakeholderKPI ||
      !stakeholderActualPerformance
    ) {
      toast.error(
        "Please fill in all fields and ensure performance values do not exceed its limit."
      );
      return;
    }

    try {
      // Send the POST request to the server
      const response = await fetch(
        "http://localhost:8080/bsc/stakeholderBsc/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: { id: department_id },
            target_code: stakeholderTargetCode,
            metric: stakeholderMetric,
            office_target: stakeholderOfficeTarget,
            status: stakeholderStatus,
            key_performance_indicator: stakeholderKPI,
            target_performance: stakeholderTargetPerformance,
            actual_performance: stakeholderActualPerformance,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save stakeholder scorecard");
      }

      const savedScorecard = await response.json();
      setStakeholderSavedScorecards([
        ...stakeholderSavedScorecards,
        savedScorecard,
      ]);
      toast.success("Stakeholder scorecard saved successfully");
      handleStakeholderCloseModal();
    } catch (error) {
      console.error("Error saving stakeholder scorecard:", error);
      toast.error("Error saving stakeholder scorecard");
    }
  };

  const handleStakeholderUpdateScorecard = async () => {
    if (!stakeholderEditMode) return;

    const updatedScorecard: StakeholderScorecard = {
      ...stakeholderEditMode,
      target_code: stakeholderTargetCode,
      metric: stakeholderMetric,
      office_target: stakeholderOfficeTarget,
      status: stakeholderStatus,
      key_performance_indicator: stakeholderKPI,
      target_performance: stakeholderTargetPerformance,
      actual_performance: stakeholderActualPerformance,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/stakeholder/update/${stakeholderEditID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedScorecard),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update stakeholder scorecard");
      }

      // Update the state with the updated scorecard
      const updatedScorecards = stakeholderSavedScorecards.map((scorecard) =>
        scorecard.id === stakeholderEditID ? updatedScorecard : scorecard
      );

      setStakeholderSavedScorecards(updatedScorecards);
      toast.success("Stakeholder scorecard updated successfully");
      handleStakeholderCloseModal();
    } catch (error) {
      console.error("Error updating stakeholder scorecard:", error);
      toast.error("Error updating stakeholder scorecard");
    }
  };

  const handleYearDateChange = (date: Date | null) => {
    console.log("Selected Completion Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setStakeholderTargetYear(utcDate);
    } else {
      //@ts-ignore
      setStakeholderTargetYear(null);
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
          <img src="/stakeholder.png" alt="" className=" h-[5rem] mr-2" />
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
                Stakeholder Scorecard Overview
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                Evaluates value delivered to stakeholders, including customers.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                width: "2.5rem",
                height: "2.5rem",
                backgroundColor: "#ff7b00d3",
                marginTop: "0.5rem",
              }}
            >
              <button onClick={handleStakeholderAddMoreScorecard}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "#ffffff",
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
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
                  Stakeholder Office Target
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
                <TableCell >
                
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {stakeholderSavedScorecards &&
                stakeholderSavedScorecards.length > 0 &&
                stakeholderSavedScorecards.map((scorecard, index) => {
                  if (!scorecard) return null;

                  // Calculate the attainment level
                  const levelOfAttainment =
                    calculateStakeholderLevelOfAttainment(
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
                          onClick={() =>
                            handleStakeholderEditScorecard(scorecard)
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
        open={stakeholderModalOpen}
        onClose={() => setStakeholderModalOpen(false)}
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
              Stakeholder
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
                  value={stakeholderTargetCode}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setStakeholderTargetCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col ">
                <span className="mr-3 font-regular text-md text-[#000000]">
                  Target Year
                </span>
                <DatePicker
                  key={stakeholderTargetYear?.toString()}
                  selected={stakeholderTargetYear}
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
                  value={stakeholderMetric || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
                  onChange={(e) => setStakeholderMetric(e.target.value)}
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
                  value={stakeholderKPI}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setStakeholderKPI(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Status
                </span>
                <select
                  value={stakeholderStatus || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setStakeholderStatus(e.target.value)}
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
                  value={stakeholderTargetPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
                  onChange={(e) => {
                    const maxLimit =
                      stakeholderMetric === "Percentage"
                        ? 100
                        : stakeholderMetric === "Rating"
                        ? 10
                        : stakeholderMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      stakeholderMetric === "Rating" ||
                      stakeholderMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setStakeholderTargetPerformance(value.toString());
                  }}
                />
                {stakeholderMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {stakeholderMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {stakeholderMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {stakeholderMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {stakeholderMetric === "Succession Plan" && (
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
                  value={stakeholderActualPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => {
                    const maxLimit =
                      stakeholderMetric === "Percentage"
                        ? 100
                        : stakeholderMetric === "Rating"
                        ? 10
                        : stakeholderMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      stakeholderMetric === "Rating" ||
                      stakeholderMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setStakeholderActualPerformance(value.toString());
                  }}
                />
                {stakeholderMetric === "Percentage" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {stakeholderMetric === "Count" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {stakeholderMetric === "Rating" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {stakeholderMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {stakeholderMetric === "Succession Plan" && (
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
                  value={stakeholderOfficeTarget}
                  className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-lg h-[10rem]"
                  onChange={(e) => setStakeholderOfficeTarget(e.target.value)}
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
                onClick={handleStakeholderCloseModal}
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
                onClick={handleSaveButtonClick}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  padding: 1,
                }}
              >
                {stakeholderEditMode ? "Edit" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
}
