"use client";
import { useSession } from "next-auth/react";
import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
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
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

interface LearningScorecard {
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
interface LearningProps {
  selectedYear: string; 
}

const Learning: React.FC<LearningProps> = ({ selectedYear }) => {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const department_id = user?.department_id;
  const userRole = user?.role;

  //set current year
  const currentYear = new Date().getFullYear();
  const yearAsString = currentYear.toString(); 
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // Open modal
  const [learningModalOpen, setLearningModalOpen] = useState(false);

  // Learning state variables
  const [learningTargetCode, setLearningTargetCode] = useState("");
  const [learningMetric, setLearningMetric] = useState("");
  const [learningOfficeTarget, setLearningOfficeTarget] = useState("");
  const [learningTargetPerformance, setLearningTargetPerformance] =
    useState("");
  const [learningStatus, setLearningStatus] = useState("Not Achieved");
  const [learningKPI, setLearningKPI] = useState("");
  const [learningActualPerformance, setLearningActualPerformance] =
    useState("");
  const [learningLevelOfAttainment, setLearningLevelOfAttainment] =
    useState("");

    // {added link and target year}
  const [learningTargetYear, setLearningTargetYear] = useState(yearAsString);
  const [learningEvidenceLink, setLearningEvidenceLink] = useState(""); 

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

  const handleLearningAddMoreScorecard = async () => {
    setLearningTargetCode("");
    setLearningMetric("");

    setLearningOfficeTarget("");
    setLearningStatus("Not Achieved");
    setLearningKPI("");
    setLearningTargetPerformance("");
    setLearningActualPerformance("");
    setLearningTargetYear(yearAsString);
    setLearningEvidenceLink("");
    setLearningEditMode(null);
    setLearningModalOpen(true);
  };

  // Determine which function to call when the save button is clicked
  const handleSaveButtonClick = () => {
    if (learningEditMode) {
      handleLearningUpdateScorecard();
    } else {
      handleLearningSaveScorecard();
    }
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
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://3.107.42.174:8080/bsc/learning/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch learning scorecards");
        }
        const data = await response.json();
        setLearningSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching learning scorecards:", error);
      }
    };

    fetchLearningScorecards();
  }, [department_id]);

  const handleLearningEditScorecard = (scorecard: LearningScorecard) => {
    setLearningTargetCode(scorecard.target_code);
    setLearningMetric(scorecard.metric);
    setLearningOfficeTarget(scorecard.office_target);
    setLearningStatus(scorecard.status);
    setLearningKPI(scorecard.key_performance_indicator);
    setLearningTargetPerformance(scorecard.target_performance);
    setLearningActualPerformance(scorecard.actual_performance);
    setLearningTargetYear(scorecard.targetYear);
    setLearningEvidenceLink(scorecard.evidence_link || "");
    setLearningEditMode(scorecard);
    setLearningEditID(scorecard.id);
    setLearningModalOpen(true);
  };

  const handleLearningSaveScorecard = async () => {
    // Check if all fields are filled
    if (
      !learningTargetCode ||
      !learningMetric ||
      !learningOfficeTarget ||
      !learningTargetPerformance ||
      !learningStatus ||
      !learningKPI ||
      !learningActualPerformance ||
      !learningEvidenceLink
    ) {
      toast.error(
        "Please fill in all fields and ensure performance values do not exceed 100."
      );
      return;
    }

    try {
      // Send the POST request to the server
      const response = await fetch(
        "http://3.107.42.174:8080/bsc/learningBsc/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: { id: department_id }, // Ensure you have this variable defined or passed in
            target_code: learningTargetCode,
            office_target: learningOfficeTarget,
            metric: learningMetric,
            status: learningStatus,
            key_performance_indicator: learningKPI,
            target_performance: learningTargetPerformance,
            actual_performance: learningActualPerformance,
            targetYear: learningTargetYear,
            evidence_link: learningEvidenceLink,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save learning scorecard");
      }

      const savedScorecard = await response.json();
      setLearningSavedScorecards([...learningSavedScorecards, savedScorecard]);
      toast.success("Learning scorecard saved successfully");
      handleLearningCloseModal();
    } catch (error) {
      console.error("Error saving learning scorecard:", error);
      toast.error("Error saving learning scorecard");
    }
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
      targetYear: learningTargetYear,
      evidence_link: learningEvidenceLink,
    };

    try {
      const response = await fetch(
        `http://3.107.42.174:8080/bsc/learning/update/${learningEditID}`,
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

  // const handleYearDateChange = (date: Date | null) => {
  //   console.log("Selected Completion Date", date);
  //   if (date) {
  //     // Convert the selected date to UTC before saving it
  //     const utcDate = new Date(
  //       Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  //     );
  //     setLearningTargetYear(utcDate);
  //   } else {
  //     //@ts-ignore
  //     setLearningTargetYear(null);
  //   }
  // };

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
          <img src="/financial.png" alt="" className="  h-[6rem] mr-2" />
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
                Learning & Growth Scorecard Overview
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "500" }}>
                Focuses on innovation, improvement, and development.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                width: "3rem",
                height: "3rem",
                backgroundColor: "#ff7b00d3",
                marginTop: "0.5rem",
              }}
            >
              <button onClick={handleLearningAddMoreScorecard}>
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
                  Learning Office Target
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
              {learningSavedScorecards &&
                learningSavedScorecards.length > 0 &&
                learningSavedScorecards
                .filter((scorecard) => {
                  if (!selectedYear) return true; 
                  return scorecard.targetYear === selectedYear;
                })
                .map((scorecard, index) => {
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
                        borderBottom: `1px solid ${
                          index < learningSavedScorecards.length - 1
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
                            {scorecard.key_performance_indicator && scorecard.key_performance_indicator.length > 20
                              ? `${scorecard.key_performance_indicator.substring(0, 15)}...`
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
                          ? `${scorecard.evidence_link.substring(0, 15)}...`
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
                  value={learningTargetCode}
                  onChange={(e) => setLearningTargetCode(e.target.value)}
                />
              </div>
                {/* {target year added} */}
                {/* <div className="flex flex-col w-[26rem]">
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
                  value={learningTargetYear}
                  disabled
                />
              </div> */}
              <div className="flex flex-col w-[26rem]">
                  <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                    Target Year
                    <span className="text-[#DD1414]">*</span>
                  </span>
                  <FormControl fullWidth>
                    <Select
                      value={learningTargetYear}
                      onChange={(e) => setLearningTargetYear(e.target.value)}
                      sx={{
                        height: "47px",
                        "& .MuiInputBase-root": { height: "47px" },
                        "& .MuiOutlinedInput-input": {
                          fontSize: "18px",
                        },
                      }}
                    >
                      {yearOptions.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              

              <div className="flex flex-col w-[26rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Metric / Unit of Measure
                  <span className="text-[#DD1414]">*</span>
                </span>
                <FormControl fullWidth>
                  <Select
                    value={learningMetric || ""}
                    onChange={(e) => setLearningMetric(e.target.value)}
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
                  value={learningKPI}
                  onChange={(e) => setLearningKPI(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Status
                </span>
                <FormControl fullWidth>
                  <Select
                    value={learningStatus || ""}
                    onChange={(e) => setLearningStatus(e.target.value)}
                    disabled={userRole !== "qualityAssurance"}
                    sx={{
                      height: "47px",
                      "& .MuiInputBase-root": { height: "47px" },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "18px",
                      },
                      background: "#f2f2f2",
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
                  value={learningTargetPerformance}
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
                    Please enter a number from 1 to 10, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {learningMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 20, allowing one decimal
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
                  value={learningActualPerformance}
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
                    Please enter a number from 1 to 10, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {learningMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 20, allowing one decimal
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
                  value={learningEvidenceLink}
                  onChange={(e) => setLearningEvidenceLink(e.target.value)}
                />
              </div>
            </Box>
            <Box>
              <div className="flex flex-col mt-5">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Office Target
                  <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                  value={learningOfficeTarget}
                  className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-md h-[10rem]"
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
                onClick={handleSaveButtonClick}
                sx={{
                  minWidth: "10rem",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  p: 1,
                  fontSize: "18px",
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

export default Learning;