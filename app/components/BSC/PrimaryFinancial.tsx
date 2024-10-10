"use client";
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

import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

interface PrimaryFinancialScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}

export default function PrimaryFinancial() {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const department_id = user?.department_id;
  const userRole = user?.role;

  // open modal
  const [primaryModalOpen, setPrimaryModalOpen] = useState(false);

  // primary financial values
  const [primaryTargetCode, setPrimaryTargetCode] = useState("");
  const [primaryMetric, setPrimaryMetric] = useState("");
  const [primaryOfficeTarget, setPrimaryOfficeTarget] = useState("");
  const [primaryTargetYear, setPrimaryTargetYear] = useState(new Date());
  const [primaryStatus, setPrimaryStatus] = useState("");
  const [primaryKPI, setPrimaryKPI] = useState("");
  const [primaryTargetPerformance, setPrimaryTargetPerformance] = useState("");
  const [primaryActualPerformance, setPrimaryActualPerformance] = useState("");

  // primary financial scorecard
  const [primaryFinancialScorecard, setPrimaryFinancialScorecard] = useState<
    PrimaryFinancialScorecard[]
  >([]);

  // for edit
  const [primaryEditId, setPrimaryEditId] = useState(0);
  const [primaryEditMode, setPrimaryEditMode] =
    useState<PrimaryFinancialScorecard | null>(null);

  const handleCloseModal = () => {
    setPrimaryModalOpen(false);
    setPrimaryEditMode(null);
  };

  const calculateLevelOfAttainment = (
    actualFinancialPerformance: number,
    targetFinancialPerformance: number
  ): string => {
    const levelOfAttainmentFinancial =
      (actualFinancialPerformance / targetFinancialPerformance) * 100;
    return levelOfAttainmentFinancial.toFixed(2);
  };

  useEffect(() => {
    const fetchPrimaryFinancialScorecard = async () => {
      if (!department_id) {
        console.log("Department ID is not available");
        return;
      }
      console.log(
        "Fetching Primary Financial Scorecard for department ID: ",
        department_id
      );

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryFinancialBsc/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("An error occurred while fetching data");
        }
        const data = await response.json();
        console.log("Primary Financial Scorecard data: ", data);
        setPrimaryFinancialScorecard(data);
      } catch (error) {
        console.error("Error fetching financial scorecards:", error);
      }
    };

    fetchPrimaryFinancialScorecard();
  }, [department_id]);

  const handlePrimaryEditScorecard = (scorecard: PrimaryFinancialScorecard) => {
    setPrimaryTargetCode(scorecard.target_code);
    setPrimaryMetric(scorecard.metric);
    setPrimaryOfficeTarget(scorecard.office_target);
    setPrimaryStatus(scorecard.status);
    setPrimaryKPI(scorecard.key_performance_indicator);
    setPrimaryTargetPerformance(scorecard.target_performance);
    setPrimaryActualPerformance(scorecard.actual_performance);
    setPrimaryEditMode(scorecard);
    setPrimaryEditId(scorecard.id);
    setPrimaryModalOpen(true);
  };

  const handlePrimaryUpdateScorecard = async () => {
    if (!primaryEditMode) return;

    const updatedScorecard: PrimaryFinancialScorecard = {
      ...primaryEditMode,
      target_code: primaryTargetCode,
      metric: primaryMetric,
      office_target: primaryOfficeTarget,
      status: primaryStatus,
      key_performance_indicator: primaryKPI,
      target_performance: primaryTargetPerformance,
      actual_performance: primaryActualPerformance,
    };

    console.log("Priamry Edit Id", primaryEditId);
    try {
      const response = await fetch(
        `http://localhost:8080/bsc/primaryFinancialBsc/update/${primaryEditId}`,

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
      const updatedScorecards = primaryFinancialScorecard.map((scorecard) =>
        scorecard.id === primaryEditId ? updatedScorecard : scorecard
      );

      setPrimaryFinancialScorecard(updatedScorecards);
      toast.success("Primary Financial scorecard updated successfully");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating primary financial scorecard:", error);
      toast.error("Error updating primary financial scorecard");
    }
  };

  const handleYearDateChange = (date: Date | null) => {
    console.log("Selected Completion Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setPrimaryTargetYear(utcDate);
    } else {
      //@ts-ignore
      setPrimaryTargetYear(null);
    }
  };

  return (
    <Grid item>
      <Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
          }}
        >
          <img src="/financial.png" alt="" className=" h-[5rem] mr-2" />
          <Box sx={{ alignContent: "center", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>
              Financial Scorecard Overview
            </Typography>
            <Typography sx={{ fontSize: "1rem" }}>
              Measures financial performance and profitability.
            </Typography>
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
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {primaryFinancialScorecard &&
                primaryFinancialScorecard.length > 0 &&
                primaryFinancialScorecard.map((scorecard, index) => {
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
                          onClick={() => handlePrimaryEditScorecard(scorecard)}
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
                  value={primaryTargetCode}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setPrimaryTargetCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col ">
                <span className="mr-3 font-regular text-md text-[#000000]">
                  Target Year
                </span>
                <DatePicker
                  key={primaryTargetYear?.toString()}
                  selected={primaryTargetYear}
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
                  value={primaryMetric || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
                  onChange={(e) => setPrimaryMetric(e.target.value)}
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
                  value={primaryKPI}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setPrimaryKPI(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Status
                </span>
                <select
                  value={primaryStatus || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
                  onChange={(e) => setPrimaryStatus(e.target.value)}
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
                  value={primaryTargetPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg "
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
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {primaryMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
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
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Actual Performance
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="number"
                  value={primaryActualPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg"
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
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {primaryMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
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
            <Box>
              <div className="flex flex-col ">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Office Target
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={primaryOfficeTarget}
                  className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-lg h-[10rem]"
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
                onClick={handlePrimaryUpdateScorecard}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  padding: 1,
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
