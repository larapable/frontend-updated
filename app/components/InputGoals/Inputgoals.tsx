import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSession, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Modal,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const drawerWidth = -210;

const StyledBox = styled(Box)(() => ({
  wordWrap: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
}));

const MainFont = styled(Box)({
  fontSize: "0.9rem",
  mt: 2,
});

const Cards = styled(Box)({
  width: "100%",
  height: "auto",
  borderRadius: "12px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
});

const GoalInput = styled(TextField)(({ theme }) => ({
  width: "100%",
  maxHeight: "150px",
  height: "auto",
  borderRadius: "12px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  padding: theme.spacing(1),
  backgroundColor: "#f3f4f6",
  overflow: "auto",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
}));

const AddButton = styled(Button)(() => ({
  marginTop: "16px",
  width: "auto",
}));

export default function Inputgoals() {
  const { data: session, status } = useSession();
  console.log("useSession Hook session object", session);

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name);

  interface Goal {
    mission: string;
    id: number;
    vision: string;
    proposition: string;
    goals: string[];
    targetYear: string;
    accomplished: boolean;
    department: { id: number };
  }

  const [isMobile, setIsMobile] = useState(false);
  const [currentGoals, setCurrentGoals] = useState<Goal[]>([]);
  const [currentTab, setCurrentTab] = useState<"current" | "accomplished">(
    "current"
  );
  const [goalId, setGoalId] = useState<number | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [accomplishedGoals, setAccomplishedGoals] = useState<Goal[]>([]);
  const [showSuccessMessageWithButtons, setShowSuccessMessageWithButtons] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [officeVision, setOfficeVision] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [mission, setMission] = useState("");
  const [strategicGoals, setStrategicGoals] = useState<string[]>([""]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [successModal, setSuccessModal] = useState(false);
  const [isNew, setIsNew] = useState(true); // New state to track if adding new goals
  const [isDone, setIsDone] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isshowGoalsModal, setShowGoalsModal] = useState(false);

  const [startYear, setStartYear] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);
  const [displayedYear, setDisplayedYear] = useState<string | null>(null); // To display the year range
  // const dateForDatePicker = startYear ? new Date(startYear, 0) : null;
  const [isSaved, setIsSaved] = useState(false);

  const department_id = user?.department_id;

  const [statuss, setStatus] = useState("Pending");
  const displayedGoals =
    currentTab === "current"
      ? goals.filter((goal) => !accomplishedGoals.includes(goal))
      : accomplishedGoals;

  const [initialOfficeVision, setInitialOfficeVision] = useState(officeVision);
  const [initialValueProposition, setInitialValueProposition] =
    useState(valueProposition);
  const [initialMission, setInitialMission] = useState(mission);
  const [initialStrategicGoals, setInitialStrategicGoals] =
    useState(strategicGoals);
  const [initialStartYear, setInitialStartYear] = useState(startYear);
  const [initialEndYear, setInitialEndYear] = useState(endYear);

  const handleAddGoal = () => {
    setStrategicGoals([...strategicGoals, ""]);
  };

  const handleYearChange = (date: Date | null) => {
    const currentYear = new Date().getFullYear();
    if (date && date.getFullYear() >= currentYear) {
      setStartYear(date.getFullYear());
      setEndYear(date.getFullYear() + 1);
      setDisplayedYear(`${date.getFullYear()}-${date.getFullYear() + 1}`);
    } else {
      setStartYear(null);
      setEndYear(null);
      setDisplayedYear("");
    }
  };

  const handleGoalChange = (index: number, value: string) => {
    const updatedGoals = [...strategicGoals];
    updatedGoals[index] = value;
    setStrategicGoals(updatedGoals);
  };
  const handleRemoveGoal = (index: number) => {
    const updatedGoals = strategicGoals.filter((_, i) => i !== index);
    setStrategicGoals(updatedGoals);
  };

  const fetchCurrentGoals = async (departmentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/goals/getCurrent/${departmentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch current goals");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleCurrentClick = async () => {
    setCurrentTab("current");
    if (department_id) {
      const goals = await fetchCurrentGoals(department_id);
      setCurrentGoals(goals);
    } else {
      console.error("Department ID is not defined");
    }
  };

  const fetchAccomplishedGoals = async (department_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/goals/getAccomplished/${department_id}`
      );
      if (!response.ok) throw new Error("Failed to fetch accomplished goals");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleAccomplishedClick = async () => {
    setCurrentTab("accomplished");
    if (department_id) {
      const goals = await fetchAccomplishedGoals(department_id);
      setAccomplishedGoals(goals);
    } else {
      console.error("Department ID is not defined");
    }
  };

  const handleDoneClick = async (goalId: number) => {
    const goalToUpdate = goals.find((goal) => goal.id === goalId);

    if (!goalToUpdate) {
      console.error(`Goal with id ${goalId} not found.`);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/goals/${goalId}/status?accomplished=true`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update goal");
      }

      const updatedGoals = goals.filter((goal) => goal.id !== goalId);

      setAccomplishedGoals([
        ...accomplishedGoals,
        { ...goalToUpdate, accomplished: true },
      ]);

      setGoals(updatedGoals);

      setShowSuccessMessageWithButtons(true);
    } catch (error) {
      console.error("Error updating goal:", error);
      alert("An error occurred while updating the goal");
    }
  };

  useEffect(() => {
    const fetchProfileGoals = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/goals/get/${department_id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data);
          setOfficeVision(data.vision);
          setValueProposition(data.proposition);
          setMission(data.mission);
          setStrategicGoals(data.goals);
        } else {
          console.error(
            "Error fetching user profile data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };
    fetchProfileGoals();
  }, [department_id]);

  const handleShowGoals = () => {
    setShowGoalsModal(true);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleCloseShowGoalsModal = () => {
    setShowGoalsModal(false);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal(false);
  };

  console.log("User Parsed: ", user);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/goals/getAll/${department_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch goals");
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchGoals();
  }, [department_id]);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/goals/latest/${department_id}`
        );
        if (response.ok) {
          const data = await response.json();
          const unaccomplishedGoals = data.goals.filter(
            (goal: any) => !goal.accomplished
          );
          setGoals(unaccomplishedGoals);

          setOfficeVision(data.vision || "");
          setValueProposition(data.proposition || "");
          setMission(data.mission || "");
          setStrategicGoals(unaccomplishedGoals);
          if (data.targetYear) {
            const [start, end] = data.targetYear.split("-");
            setStartYear(start);
            setEndYear(end);
          }

          setGoalId(data.id || null);
          setIsEditing(false);
          setIsNew(false);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLatestData();
  }, []);

  const handleSave = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (
      startYear === null ||
      !officeVision ||
      !valueProposition ||
      !strategicGoals
    ) {
      alert("Please fill out all required fields");
      return;
    }

    console.log("Saving goal with ID:", goalId);

    try {
      const url = isNew
        ? "http://localhost:8080/goals/insert"
        : `http://localhost:8080/goals/update/${goalId}`;
      const method = isNew ? "POST" : "PUT";

      const targetYear =
        startYear !== null && endYear !== null ? `${startYear}-${endYear}` : "";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: !isNew ? goalId : undefined,
          vision: officeVision,
          proposition: valueProposition,
          mission: mission,
          goals: strategicGoals,
          targetYear: targetYear,
          department: { id: department_id },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log("API response:", result);

      if (isNew) {
        setGoals((prevGoals) => [...prevGoals, result]);
        setGoalId(result.id);
      } else {
        setGoals((prevGoals) =>
          prevGoals.map((goal) => (goal.id === result.id ? result : goal))
        );
      }

      setOfficeVision(result.vision);
      setValueProposition(result.proposition);
      setMission(result.mission);
      setStrategicGoals(result.goals);
      setStartYear(parseInt(result.targetYear.split("-")[0], 10));
      setEndYear(parseInt(result.targetYear.split("-")[1], 10));

      setSuccessModal(true);
      setIsEditing(false);
      setIsNew(false);
      setIsSaved(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving goal setting:", error.message);
        alert(
          "An error occurred while saving the goal setting: " + error.message
        );
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/goals/getAll/${department_id}`
      );
      if (!response.ok) throw new Error("Failed to fetch goals");
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleAddNew = () => {
    setOfficeVision("");
    setValueProposition("");
    setMission("");
    setStrategicGoals([]);
    setStartYear(null);
    setEndYear(null);
    setSelectedYear(null);
    setIsEditing(true);
    setIsNew(true);
    setIsSaved(false);
    setDisplayedYear("");
  };

  const toggleEditing = async () => {
    if (isEditing) {
      setIsEditing(false);
      setIsNew(false);
      setIsSaved(true);

      try {
        const response = await fetch(
          `http://localhost:8080/goals/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data) {
          setOfficeVision(data.vision || "");
          setValueProposition(data.proposition || "");
          setMission(data.mission || "");
          setStrategicGoals(data.goals || []);
          if (data.targetYear) {
            const years = data.targetYear.split("-");
            setStartYear(years[0] || "");
            setEndYear(years[1] || "");
          }
          setSelectedYear(data.targetYear || null);

          setInitialOfficeVision(data.vision || "");
          setInitialValueProposition(data.proposition || "");
          setInitialMission(data.mission || "");
          setInitialStrategicGoals(data.goals || []);
          const years = data.targetYear ? data.targetYear.split("-") : [];
          setInitialStartYear(years[0] || "");
          setInitialEndYear(years[1] || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setIsEditing(true);
      setIsNew(false);
      setIsSaved(false);

      setInitialOfficeVision(officeVision);
      setInitialValueProposition(valueProposition);
      setInitialMission(mission);
      setInitialStrategicGoals(strategicGoals);
      setInitialStartYear(startYear);
      setInitialEndYear(endYear);
    }
  };

  const handleCancel = () => {
    setOfficeVision(initialOfficeVision);
    setValueProposition(initialValueProposition);
    setMission(initialMission);
    setStrategicGoals(initialStrategicGoals);
    setStartYear(initialStartYear);
    setEndYear(initialEndYear);

    if (initialStartYear) {
      setSelectedYear(initialStartYear);
    } else {
      setSelectedYear(null);
    }

    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        ml: isMobile ? 0 : `${drawerWidth}px`,
        width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
        p: 3,
      }}
    >
      <Grid container spacing={2} sx={{ paddingTop: 2 }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              marginTop: "-45px",
              fontWeight: "bold",
              fontSize: { xs: "1.8rem", sm: "2.125rem" },
            }}
          >
            GOAL SETTING
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MainFont sx={{ mb: 5 }}>
            Goal setting involves defining specific objectives, outlining
            actionable steps, and establishing a timeframe for achievement. It
            provides direction and motivation for personal or professional
            growth by creating clear targets to strive towards.
          </MainFont>
        </Grid>

        <Grid item xs={12}>
          <Cards
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "0.6rem",
              padding: 2,
              border: "1px solid #E6E6E6",
              marginTop: "-20px",
            }}
          >
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: -1,
                    height: "40px",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#AB3510",
                      color: "#FFFFFF",
                      border: "2px solid #AB3510",
                      borderRadius: "0.6rem",
                      padding: "0.8rem 2rem",
                      "&:hover": {
                        backgroundColor: "#AB3510",
                        border: "2px solid #AB3510",
                        opacity: 0.8,
                      },
                    }}
                    onClick={handleShowGoals}
                  >
                    View Goals
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-20px",
                  }}
                >
                  <img
                    src="/year.png"
                    alt="Year Icon"
                    style={{ height: "4.5rem", marginRight: "1rem" }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: "17px",
                      }}
                    >
                      Target Year
                    </Typography>
                    <Typography sx={{ fontSize: "15px", color: "#807C7C" }}>
                      The specific year by which a goal is intended to be
                      achieved.
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    border: "none",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    backgroundColor: "#f3f4f6",
                    width: "20%",
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    fontSize: "14px",
                  }}
                >
                  <DatePicker
                    selected={
                      startYear !== null ? new Date(startYear, 0, 1) : null
                    }
                    onChange={handleYearChange}
                    showYearPicker
                    disabled={!isEditing && !isNew}
                    minDate={new Date(new Date().getFullYear(), 0, 1)} // Set minimum date to January 1 of the current year
                    maxDate={new Date(new Date().getFullYear(), 11, 31)} // Set maximum date to December 31 of the current year
                    dateFormat="yyyy"
                    className="w-full bg-gray-100" // Tailwind CSS for background color
                  />
                </Box>

                {displayedYear && (
                  <Typography
                    sx={{
                      marginTop: 1,
                      color: "gray",
                      textAlign: "left", // Align text to the left
                      width: "100%", // Make it full width for proper alignment
                    }}
                  >
                    Academic Year: {displayedYear}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/proposition.png"
                    alt="Vision Icon"
                    style={{ height: "4.5rem", marginRight: "1rem" }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: "17px",
                      }}
                    >
                      Office Vision
                    </Typography>
                    <Typography sx={{ fontSize: "15px", color: "#807C7C" }}>
                      A brief statement articulating the company’s long-term
                      goals and values.
                    </Typography>
                  </Box>
                </Box>
                <GoalInput
                  multiline
                  value={officeVision}
                  onChange={(event) => setOfficeVision(event.target.value)}
                  disabled={!isEditing && !isNew}
                  InputProps={{
                    style: {
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/proposition.png"
                    alt="Proposition Icon"
                    style={{ height: "4.5rem", marginRight: "1rem" }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: "17px",
                      }}
                    >
                      Value Proposition
                    </Typography>
                    <Typography sx={{ fontSize: "15px", color: "#807C7C" }}>
                      A concise statement that communicates the unique benefits
                      and advantages of your service.
                    </Typography>
                  </Box>
                </Box>
                <GoalInput
                  multiline
                  value={valueProposition}
                  onChange={(event) => setValueProposition(event.target.value)}
                  disabled={!isEditing && !isNew}
                  InputProps={{
                    style: {
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/mission.png"
                    alt="Mission Icon"
                    style={{ height: "4.5rem", marginRight: "1rem" }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: "17px",
                      }}
                    >
                      Mission
                    </Typography>
                    <Typography sx={{ fontSize: "15px", color: "#807C7C" }}>
                      A statement defining the company’s purpose and commitment
                      to delivering value.
                    </Typography>
                  </Box>
                </Box>
                <GoalInput
                  multiline
                  value={mission}
                  onChange={(event) => setMission(event.target.value)}
                  disabled={!isEditing && !isNew}
                  InputProps={{
                    style: {
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/strategicgoals.png"
                    alt="Strategic Goals Icon"
                    style={{ height: "4.5rem", marginRight: "1rem" }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: "17px",
                      }}
                    >
                      Strategic Goals
                    </Typography>
                    <Typography sx={{ fontSize: "15px", color: "#807C7C" }}>
                      A guiding principle for decision-making, driving the
                      organization towards its desired future state.
                    </Typography>
                  </Box>
                </Box>

                {(isEditing || isNew) && !isSaved && (
                  <Box sx={{ position: "absolute", right: 10, top: 60 }}>
                    <IconButton
                      sx={{
                        backgroundColor: "#ff7b00d3",
                        color: "#ffffff",
                        "&:hover": { backgroundColor: "#ff7b00" },
                        borderRadius: "50%",
                        padding: "0",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={handleAddGoal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-8"
                        style={{ width: "30px", height: "20px" }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {strategicGoals.map((goal, index) => (
                <Grid item xs={12} key={index} className="relative">
                  <GoalInput
                    multiline
                    variant="outlined"
                    rows={4}
                    value={goal}
                    onChange={(event) =>
                      handleGoalChange(index, event.target.value)
                    }
                    disabled={!isEditing && !isNew}
                    InputProps={{
                      style: {
                        fontSize: "14px",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      },
                    }}
                  />

                  {(isEditing || isNew) && !isSaved && (
                    <>
                      <IconButton
                        className="absolute right-2 top-2 bg-red-500 text-white hover:bg-red-700"
                        onClick={() => handleRemoveGoal(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Grid>
              ))}
            </Grid>
          </Cards>
        </Grid>

        {isshowGoalsModal && (
          <Modal open={isshowGoalsModal} onClose={handleCloseShowGoalsModal}>
            <div className="flex justify-center items-center h-screen">
              <div className="p-4 bg-white rounded-lg shadow-md w-[80rem] max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Goals</h2>
                <div className="flex mb-4">
                  <Button
                    variant="text"
                    sx={{
                      color: currentTab === "current" ? "black" : "black",
                      fontWeight: currentTab === "current" ? "bold" : "normal",
                      "&:hover": {
                        color: "black",
                      },
                    }}
                    onClick={handleCurrentClick}
                  >
                    Current
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: currentTab === "accomplished" ? "black" : "black",
                      fontWeight:
                        currentTab === "accomplished" ? "bold" : "normal",
                      "&:hover": {
                        color: "black",
                      },
                    }}
                    onClick={handleAccomplishedClick}
                  >
                    Accomplished
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table className="w-full border-collapse border border-gray-400">
                    <TableHead>
                      <TableRow className="bg-[#fff6d1]">
                        <TableCell className="border border-gray-400">
                          Target Year
                        </TableCell>
                        <TableCell className="border border-gray-400">
                          Vision
                        </TableCell>
                        <TableCell className="border border-gray-400">
                          Value Proposition
                        </TableCell>
                        <TableCell className="border border-gray-400">
                          Mission
                        </TableCell>
                        <TableCell className="border border-gray-400 max-w-xs break-words">
                          Strategic Goals
                        </TableCell>
                        <TableCell className="border border-gray-400">
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedGoals
                        .filter((goal) =>
                          currentTab === "current"
                            ? !goal.accomplished
                            : goal.accomplished
                        )
                        .map((goal) => (
                          <TableRow key={goal.id}>
                            <TableCell className="border border-gray-400 whitespace-nowrap">
                              {goal.targetYear}
                            </TableCell>
                            <TableCell className="border border-gray-400 max-w-xs break-words">
                              {goal.vision}
                            </TableCell>
                            <TableCell className="border border-gray-400 max-w-xs break-words">
                              {goal.proposition}
                            </TableCell>
                            <TableCell className="border border-gray-400 max-w-xs break-words">
                              {goal.mission}
                            </TableCell>
                            <TableCell className="border border-gray-400 max-w-xs break-words">
                              <ul className="list-disc pl-5">
                                {goal.goals.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </TableCell>
                            <TableCell
                              className="px-4 py-2 flex justify-center items-center border border-gray-400"
                              style={{ height: "auto" }}
                            >
                              {currentTab === "current" ? (
                                <div className="flex flex-col items-center justify-center">
                                  <span>Pending</span>
                                  <Button
                                    variant="contained"
                                    sx={{
                                      height: "30px",
                                      marginTop: "0.5rem",
                                      backgroundColor:
                                        "rgba(255, 123, 0, 0.83)",
                                      color: "#FFFFFF",
                                      borderRadius: "0.6rem",
                                      padding: "0.8rem 2rem",
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(255, 123, 0, 0.60)",
                                      },
                                    }}
                                    onClick={() => handleDoneClick(goal.id)}
                                  >
                                    Done
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-center items-center w-full h-full">
                                  <span>Success</span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                {showSuccessMessageWithButtons && (
                  <Modal
                    open={showSuccessMessageWithButtons}
                    onClose={() => setShowSuccessMessageWithButtons(false)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "white",
                          padding: 4,
                          borderRadius: "0.5rem",
                          boxShadow: 3,
                          width: "35rem",
                          textAlign: "center",
                          position: "relative",
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: "bold", marginBottom: 1 }}
                        >
                          Success!
                        </Typography>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                          Goal has been accomplished.
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              background:
                                "linear-gradient(to left, #8a252c, #AB3510)",
                              fontWeight: "bold",
                              fontSize: "1rem",
                              marginTop: 2,
                              width: "15rem",
                              padding: "0.5rem 2.2rem",
                              borderRadius: "0.6rem",
                            }}
                            onClick={() => {
                              handleAddNew();
                              setShowSuccessMessageWithButtons(false);
                            }}
                          >
                            Add New Goals
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Modal>
                )}

                <div className="flex justify-center mt-5">
                  <Button
                    variant="contained"
                    style={{
                      background: "linear-gradient(to left, #8a252c, #AB3510)",
                      color: "#ffffff",
                    }}
                    className="font-semibold text-[1.2rem] w-[11rem] mt-10"
                    onClick={handleCloseShowGoalsModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          marginBottom={8}
          marginTop={3}
        >
          <Grid item xs={6} display="flex" justifyContent="center">
            <Button
              variant={isEditing ? "outlined" : "contained"}
              onClick={isEditing ? handleCancel : toggleEditing}
              sx={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                width: "11rem",
                borderRadius: "0.6rem",
                backgroundColor: isEditing ? "#ffffff" : "#ffffff",
                color: isEditing ? "#AB3510" : "#AB3510",
                border: `2px solid #AB3510`,
                "&:hover": {
                  backgroundColor: "#f2f2f2",
                  color: "#AB3510",
                },
              }}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </Grid>

          <Grid item xs={6} display="flex" justifyContent="center">
            <Modal
              open={successModal}
              onClose={handleCloseSuccessModal}
              aria-labelledby="success-modal-title"
              aria-describedby="success-modal-description"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  width: "100vw",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: "0.5rem",
                    boxShadow: 3,
                    height: "auto",
                    width: "35rem",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <Typography
                    id="success-modal-title"
                    variant="h3"
                    sx={{ fontWeight: "bold", marginBottom: 2 }}
                  >
                    Success!
                  </Typography>
                  <Typography
                    id="success-modal-description"
                    variant="h6"
                    sx={{ marginBottom: 2, marginTop: 2 }}
                  >
                    Goal Successfully Saved.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(to left, #8a252c, #AB3510)",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      marginTop: 2,
                      width: "11rem",
                      padding: "0.5rem 2.2rem",
                      borderRadius: "0.6rem",
                    }}
                    onClick={handleCloseSuccessModal}
                  >
                    OK
                  </Button>
                </Box>
              </Box>
            </Modal>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                width: "11rem",
                borderRadius: "0.6rem",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                color: "#ffffff",
                "&:hover": {
                  background: "linear-gradient(to left, #AB3510, #8a252c)",
                },
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
