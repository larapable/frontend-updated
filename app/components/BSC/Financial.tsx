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

interface FinancialScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}

export default function Financial() {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const department_id = user?.department_id;
  const userRole = user?.role;

  // open modal
  const [financialModalOpen, setFinancialModalOpen] = useState(false);
  // financial values
  const [financialTargetCode, setFinancialTargetCode] = useState("");
  const [financialMetric, setFinancialMetric] = useState("");
  const [financialOfficeTarget, setFinancialOfficeTarget] = useState("");
  const [financialTargetYear, setFinancialTargetYear] = useState(new Date());
  const [financialStatus, setFinancialStatus] = useState("Not Achieved");
  const [financialKPI, setFinancialKPI] = useState("");
  const [financialTargetPerformance, setFinancialTargetPerformance] =
    useState("");
  const [financialActualPerformance, setFinancialActualPerformance] =
    useState("");
  const [financialLevelOfAttainment, setFinancialLevelOfAttainment] =
    useState("");

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

  // mo add ug scorecard : open modal
  const handleFinancialAddMoreScorecard = async () => {
    setFinancialTargetCode("");
    setFinancialMetric("");
    //setFinancialTargetCompletionDate(null);
    setFinancialOfficeTarget("");
    setFinancialStatus("Not Achieved");
    setFinancialKPI("");
    setFinancialTargetPerformance("");
    setFinancialActualPerformance("");
    setFinancialEditMode(null);
    setFinancialModalOpen(true);
  };

  // Determine which function to call when the save button is clicked
  const handleSaveButtonClick = () => {
    if (financialEditMode) {
      // If we're in edit mode, update the existing scorecard
      handleFinancialUpdateScorecard();
    } else {
      // If we're not in edit mode, save as a new scorecard
      handleFinancialSaveScorecard();
    }
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

  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchFinancialScorecards = async () => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching financial scorecards for department ID:",
        department_id
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial scorecards");
        }
        const data = await response.json();
        console.log("Financial scorecards data:", data);
        setFinancialSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching financial scorecards:", error);
      }
    };

    fetchFinancialScorecards();
  }, [department_id]);

  const handleFinancialEditScorecard = (scorecard: FinancialScorecard) => {
    setFinancialTargetCode(scorecard.target_code);
    setFinancialMetric(scorecard.metric);
    setFinancialOfficeTarget(scorecard.office_target);
    setFinancialStatus(scorecard.status);
    setFinancialKPI(scorecard.key_performance_indicator);
    setFinancialTargetPerformance(scorecard.target_performance);
    setFinancialActualPerformance(scorecard.actual_performance);
    setFinancialEditMode(scorecard);
    setFinancialEditID(scorecard.id);
    setFinancialModalOpen(true);
  };

  const handleFinancialSaveScorecard = async () => {
    // Check if all fields are filled
    if (
      !financialTargetCode ||
      !financialMetric ||
      !financialOfficeTarget ||
      !financialTargetPerformance ||
      !financialStatus ||
      !financialKPI ||
      !financialActualPerformance
    ) {
      toast.error(
        "Please fill in all fields and ensure performance values do not exceed 100."
      );
      return;
    }

    try {
      // Send the POST request to the server
      const response = await fetch(
        "http://localhost:8080/bsc/financialBsc/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: { id: department_id }, // Ensure you have this variable defined or passed in
            target_code: financialTargetCode,
            office_target: financialOfficeTarget,
            metric: financialMetric,
            status: financialStatus,
            key_performance_indicator: financialKPI,
            target_performance: financialTargetPerformance,
            actual_performance: financialActualPerformance,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save financial scorecard");
      }

      const savedScorecard = await response.json();
      setFinancialSavedScorecards([
        ...financialSavedScorecards,
        savedScorecard,
      ]);
      toast.success("Financial scorecard saved successfully");
      handleFinancialCloseModal();
    } catch (error) {
      console.error("Error saving financial scorecard:", error);
      toast.error("Error saving financial scorecard");
    }
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

  const handleYearDateChange = (date: Date | null) => {
    console.log("Selected Completion Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setFinancialTargetYear(utcDate);
    } else {
      //@ts-ignore
      setFinancialTargetYear(null);
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
                Financial Scorecard Overview
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                Measures financial performance and profitability.
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
              <button onClick={handleFinancialAddMoreScorecard}>
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
                  Financial Office Target
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
                <TableCell>
                
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {financialSavedScorecards &&
                financialSavedScorecards.length > 0 &&
                financialSavedScorecards.map((scorecard, index) => {
                  if (!scorecard) return null;

                  // Calculate the attainment level
                  const levelOfAttainment = calculateFinancialLevelOfAttainment(
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Code
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={financialTargetCode}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setFinancialTargetCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col ">
                <span className="mr-3 font-regular text-md text-[#000000]">
                  Target Year
                </span>
                <DatePicker
                  key={financialTargetYear?.toString()}
                  selected={financialTargetYear}
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
                  value={financialMetric || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
                  onChange={(e) => setFinancialMetric(e.target.value)}
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
                  value={financialKPI}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setFinancialKPI(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Status
                </span>
                <select
                  value={financialStatus || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setFinancialStatus(e.target.value)}
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
                  value={financialTargetPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
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
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {financialMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Actual Performance
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="number"
                  value={financialActualPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
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
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {financialMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
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
            <Box>
              <div className="flex flex-col ">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Office Target
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={financialOfficeTarget}
                  className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-lg h-[10rem]"
                  onChange={(e) => setFinancialOfficeTarget(e.target.value)}
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
                {financialEditMode ? "Edit" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
}
