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
import { TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

interface StakeholderScorecard {
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

interface StakeholderProps {
  selectedYear: string;
}

const Stakeholder: React.FC<StakeholderProps> = ({ selectedYear }) => {
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

  // open modal
  const [stakeholderModalOpen, setStakeholderModalOpen] = useState(false);

  // stakeholder values
  const [stakeholderTargetCode, setStakeholderTargetCode] = useState("");
  const [stakeholderMetric, setStakeholderMetric] = useState("");
  const [stakeholderOfficeTarget, setStakeholderOfficeTarget] = useState("");
  const [stakeholderTargetPerformance, setStakeholderTargetPerformance] =
    useState("");
  const [stakeholderStatus, setStakeholderStatus] = useState("Not Achieved");
  const [stakeholderKPI, setStakeholderKPI] = useState("");
  const [stakeholderActualPerformance, setStakeholderActualPerformance] =
    useState("");
  const [stakeholderLevelOfAttainment, setStakeholderLevelOfAttainment] =
    useState("");

  // {added link and target year}
  const [stakeholderTargetYear, setStakeholderTargetYear] =
    useState(yearAsString);
  const [stakeholderEvidenceLink, setStakeholderEvidenceLink] = useState("");

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
    setStakeholderTargetYear(yearAsString);
    setStakeholderEvidenceLink("");
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
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/stakeholder/get/${department_id}`
=======
          `http://3.107.42.174:8080/bsc/stakeholder/get/${department_id}`
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
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
    setStakeholderTargetYear(scorecard.targetYear);
    setStakeholderEvidenceLink(scorecard.evidence_link || "");
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
      !stakeholderActualPerformance ||
      !stakeholderEvidenceLink
    ) {
      toast.error(
        "Please fill in all fields and ensure performance values do not exceed its limit."
      );
      return;
    }

    try {
      // Send the POST request to the server
      const response = await fetch(
        "http://3.107.42.174:8080/bsc/stakeholderBsc/insert",
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
            targetYear: stakeholderTargetYear,
            evidence_link: stakeholderEvidenceLink,
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
      targetYear: stakeholderTargetYear,
      evidence_link: stakeholderEvidenceLink,
    };

    try {
      const response = await fetch(
<<<<<<< HEAD
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/stakeholder/update/${stakeholderEditID}`,
=======
        `http://3.107.42.174:8080/bsc/stakeholder/update/${stakeholderEditID}`,
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
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

  // const handleYearDateChange = (date: Date | null) => {
  //   console.log("Selected Completion Date", date);
  //   if (date) {
  //     // Convert the selected date to UTC before saving it
  //     const utcDate = new Date(
  //       Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  //     );
  //     setStakeholderTargetYear(utcDate);
  //   } else {
  //     //@ts-ignore
  //     setStakeholderTargetYear(null);
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
          <img src="/stakeholder.png" alt="" className=" h-[6rem] mr-2" />
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
                Stakeholder Scorecard Overview
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "500" }}>
                Evaluates value delivered to stakeholders, including customers.
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
                  Stakeholder Office Target
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
              {stakeholderSavedScorecards &&
                stakeholderSavedScorecards.length > 0 &&
                stakeholderSavedScorecards
                  .filter((scorecard) => {
                    if (!selectedYear) return true;
                    return scorecard.targetYear === selectedYear;
                  })
                  .map((scorecard, index) => {
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
                          borderBottom: `1px solid ${
                            index < stakeholderSavedScorecards.length - 1
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
                          <span className="font-medium text-[#2e2c2c] text-[1.1rem]">
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
                          <span className="font-medium text-[#2e2c2c] text-[1.1rem]">
                            {scorecard.metric || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <span className="font-medium text-[#2e2c2c] text-[1.1rem]">
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
                          <span className="font-medium text-[#2e2c2c] text-[1.1rem]">
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
                  value={stakeholderTargetCode}
                  onChange={(e) => setStakeholderTargetCode(e.target.value)}
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
                  value={stakeholderTargetYear}
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
                    value={stakeholderTargetYear}
                    onChange={(e) => setStakeholderTargetYear(e.target.value)}
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
                    value={stakeholderMetric || ""}
                    onChange={(e) => setStakeholderMetric(e.target.value)}
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
                  value={stakeholderKPI}
                  onChange={(e) => setStakeholderKPI(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-[40rem]">
                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                  Status
                </span>
                <FormControl fullWidth>
                  <Select
                    value={stakeholderStatus || ""}
                    onChange={(e) => setStakeholderStatus(e.target.value)}
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
                  value={stakeholderTargetPerformance}
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
                    Please enter a number from 1 to 10, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {stakeholderMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 20, allowing one decimal
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
                  value={stakeholderActualPerformance}
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
                    Please enter a number from 1 to 10, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {stakeholderMetric === "Score" && (
                  <span className="break-words font-regular italic text-xs text-[#2c2c2c]">
                    Please enter a score from 1 to 20, allowing one decimal
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
                  value={stakeholderEvidenceLink}
                  onChange={(e) => setStakeholderEvidenceLink(e.target.value)}
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
                  value={stakeholderOfficeTarget}
                  className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-md h-[10rem]"
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
                {stakeholderEditMode ? "Edit" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Stakeholder;