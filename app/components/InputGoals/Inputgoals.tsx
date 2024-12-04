import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
import Navbar from "../Navbars/Navbar";
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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const drawerWidth = 250;

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
  const [hasPrimaryStrats, setHasPrimaryStrats] = useState<string | null>(null);

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
  //Modals
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/getCurrent/${departmentId}`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/getAccomplished/${department_id}`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/${goalId}/status?accomplished=true`,
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
      setModalMessage("An error occurred while updating the goal");
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    const fetchProfileGoals = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/get/${department_id}`
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/getAll/${department_id}`
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/latest/${department_id}`
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

  // const targetYear =
  //   startYear !== null && endYear !== null ? `${startYear}-${endYear}` : "";

  const targetYear = startYear !== null ? `${startYear}` : "";

  const primaryStrategiesData = [
    {
      perspective: "financial", // Added perspective field
      office_target:
        "Excellence in Organizational Stewardship A8.4: 100% compliance to prescribed budget ceiling",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A8.4",
    },
    {
      perspective: "stakeholder", // Added perspective field
      office_target:
        "Excellence in Service Quality A1.1: 90% average awareness rate of the services",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A1.1",
    },
    {
      perspective: "stakeholder", // Added perspective field
      office_target:
        "Excellence in Service Quality A1.2: 90% of eligible employees availed of the services of the administrative and academic support offices",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A1.2",
    },
    {
      perspective: "stakeholder", // Added perspective field
      office_target:
        "Excellence in Service Quality A1.3: At least 4.5 (out of 5.0) inter-office customer satisfaction",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A1.3",
    },
    {
      perspective: "stakeholder", // Added perspective field
      office_target:
        "Excellence in Service Quality A2.1: Have at least 4-star (out of 5) customer service rating",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A2.1",
    },
    {
      perspective: "stakeholder", // Added perspective field
      office_target:
        "Excellence in Service Quality A2.2: Have at least 9-star (out of 10) net promoter score",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A2.2",
    },
    {
      perspective: "stakeholder", // Added perspective field
      office_target:
        "Excellence in Service Quality A2.3: 90% transanctions resolved or answered customer query within expected time",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A2.3",
    },
    {
      perspective: "internal", // Added perspective field
      office_target:
        "Excellence in Internal Service Systems A4.1: 100% of the office systems standardized and documented",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A4.1",
    },
    {
      perspective: "internal", // Added perspective field
      office_target:
        "Excellence in Internal Service Systems A4.2: 100% of process records meet its requirements",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A4.2",
    },
    {
      perspective: "internal", // Added perspective field
      office_target:
        "Excellence in Internal Service Systems A5.1: 100% awareness of the existence of the University Brand Bible and of its guidelines and templates",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A5.1",
    },
    {
      perspective: "internal", // Added perspective field
      office_target:
        "Excellence in Internal Service Systems A5.2: 100% compliance to the branding guidelines in their instructional, operational and communication materials",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A5.2",
    },
    {
      perspective: "internal", // Added perspective field
      office_target:
        "Excellence in Internal Service Systems A6.1: 100% awareness of the existence of the 5S+ Program",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A6.1",
    },
    {
      perspective: "internal", // Added perspective field
      office_target:
        "Excellence in Internal Service Systems A6.2: 100% participation in the orientation/re-orientation of 5S+ training",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A6.2",
    },
    {
      perspective: "internal", // Added perspective field
      office_target:
        "Excellence in Internal Service Systems A6.3: 100% compliance of the 5S+ standard",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A6.3",
    },
    {
      perspective: "learning", // Added perspective field
      office_target: "A7.1: At least 90% participation in CIT-sponsored events",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A7.1",
    },
    {
      perspective: "learning", // Added perspective field
      office_target:
        "A7.2: At least 90% participation in CIT-sponsored trainings, seminars, workshops, and conferences",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A7.2",
    },
    {
      perspective: "learning", // Added perspective field
      office_target:
        "A7.3: At least 90% participation in CIT-commissioned surveys, FGDs, etc.",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A7.3",
    },
    {
      perspective: "learning",
      office_target:
        "Excellence in Organizational Stewardship A9.1: 100% of admin staff are evaluated on time",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A9.1",
    },
    {
      perspective: "learning",
      office_target:
        "Excellence in Organizational Stewardship A9.2: 100% completed the Competence & Competency Matrix (CCM), training & development needs analysis (TDNA), and professional development plan",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A9.2",
    },
    {
      perspective: "learning",
      office_target:
        "Excellence in Organizational Stewardship A9.3: 50% of admin staff are involved in research work",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A9.3",
    },
    {
      perspective: "learning",
      office_target:
        "Excellence in Organizational Stewardship A9.4: 100% of staff are ranked",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A9.4",
    },
    {
      perspective: "learning",
      office_target:
        "Excellence in Organizational Stewardship A9.5: 100% submission of succession plan",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A9.5",
    },
    {
      perspective: "learning",
      office_target:
        "Excellence in Organizational Stewardship A9.6: 100% of staff have 1 community involvement activity per year",
      department: { id: department_id },
      targetYear: targetYear,
      target_code: "A9.6",
    },
  ];

  const savePrimaryStrategies = async (
    strategiesData: {
      perspective: string;
      office_target: string;
      department: { id: number };
      targetYear: string;
    }[],
    department_id: number
  ) => {
    const validStrategies = strategiesData.filter(
      (strategyData) =>
        strategyData.perspective === "financial" ||
        strategyData.perspective === "stakeholder" ||
        strategyData.perspective === "internal" ||
        strategyData.perspective === "learning"
    );

    if (validStrategies.length !== strategiesData.length) {
      console.warn(
        "Some strategies have invalid 'perspective' values and were skipped."
      );
    }

    const postPromises = strategiesData.map(async (strategyData) => {
      const endpoint = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/stratmap/primary${
        strategyData.perspective.charAt(0).toUpperCase() +
        strategyData.perspective.slice(1)
      }/insert`;
      console.log("Endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...strategyData,
          targetYear: strategyData.targetYear,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error posting ${strategyData.perspective} strategy:`,
          errorText
        );
        throw new Error(
          `Failed to save ${strategyData.perspective} strategy: ${errorText}`
        ); // Crucial: Reject the promise!
      }
      return response.json(); // Return the successful result if needed
    });

    try {
      const results = await Promise.all(postPromises);

      if (department_id) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/update/primaryStrats/${department_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hasPrimaryStrats: 1 }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error updating hasPrimaryStrats:", errorText);
          throw new Error(errorText);
        } else {
          localStorage.setItem("hasPrimaryStrats", "1");
          setHasPrimaryStrats("1");
        }
      } else {
        console.error("department_id not found");
        throw new Error("department_id is required"); // Handle missing department_id
      }

      return results;
    } catch (error) {
      console.error("Error in savePrimaryStrategies:", error); // Log the error
      throw error; // Re-throw to be caught by the caller
    }
  };

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
      setModalMessage("Please fill out all required fields");
      setShowErrorModal(true);
      return;
    }

    // Check character limits (assuming the fields are limited to 255 chars)
    if (officeVision.length > 255) {
      setModalMessage("Office Vision Field reached its character limit.");
      setShowErrorModal(true);
      return;
    }
    if (valueProposition.length > 255) {
      setModalMessage("Value Proposition Field reached its character limit.");
      setShowErrorModal(true);
      return;
    }
    if (mission.length > 255) {
      setModalMessage("Mission Field reached its character limit.");
      setShowErrorModal(true);
      return;
    }
    if (strategicGoals.length > 255) {
      setModalMessage("Strategic Goals Field reached its character limit.");
      setShowErrorModal(true);
      return;
    }

    try {
      // Use the current year as the target year
      // const targetYear =
      // startYear !== null && endYear !== null ? `${startYear}-${endYear}` : "";

      const targetYear = startYear !== null ? `${startYear}` : "";

      const currentYear = new Date().getFullYear();
      //const targetYearToCheck = `${currentYear}-${currentYear + 1}`;
      const targetYearToCheck = `${currentYear}`; // Check only the current year

      const yearcheck = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryFinancial/get/${department_id}`
      );

      let yearExists = false;

      if (yearcheck.ok) {
        // Only check for existing year if the request was successful
        const existingStrategies = await yearcheck.json();
        console.log("Existing strategies:", existingStrategies);
        yearExists = existingStrategies.some(
          (strategy: any) => strategy.targetYear === targetYearToCheck
        );
      } else if (yearcheck.status === 404) {
        // If 404, it means no existing strategies, so we can save
        console.warn("No existing strategies found for this department.");
      } else {
        const error = await yearcheck.text();
        console.error("Error fetching primary strategies", error);
        throw new Error("Failed to fetch primary strategies");
      }

      if (!yearExists) {
        await savePrimaryStrategies(primaryStrategiesData, department_id);
      }

      const url = isNew
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/insert`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/update/${goalId}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: !isNew ? goalId : undefined,
          vision: officeVision,
          proposition: valueProposition,
          mission: mission,
          goals: strategicGoals,
          targetYear: targetYear, // Set the current year as the target year
          department: { id: department_id },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error saving goal:", errorText);
        throw new Error("Failed to save goal: " + errorText);
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
      //setStartYear(parseInt(result.targetYear.split("-")[0], 10));
      //setEndYear(parseInt(result.targetYear.split("-")[1], 10));
      setStartYear(parseInt(result.targetYear, 10)); // Adjusted for single year
      setEndYear(null); // No longer needed for single year

      setSuccessModal(true);
      setIsEditing(false);
      setIsNew(false);
      setIsSaved(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in handleSave:", error.message);
        setModalMessage("An error occurred while saving: " + error.message);
        setShowErrorModal(true);
      } else {
        console.error("Unexpected error:", error);
        setModalMessage("An unexpected error occurred.");
        setShowErrorModal(true);
      }
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/getAll/${department_id}`
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/get/${department_id}`
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
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        color: "#2e2c2c",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : drawerWidth,
          flexShrink: 0,
          position: isMobile ? "static" : "fixed",
          height: isMobile ? "auto" : "100vh",
          overflowY: "auto",
        }}
      >
        <Navbar />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          p: 3,
        }}
      >
        <StyledBox>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: {
                    lg: "2rem",
                    sm: "2rem",
                    md: "2rem",
                    xs: "1.5rem",
                  },
                  mt: { lg: 0.5 },
                }}
              >
                INPUT GOALS
              </Typography>
              <Typography
                sx={{
                  fontSize: {
                    lg: "1rem",
                    sm: "1rem",
                    md: "1rem",
                    xs: "0.8rem",
                  },
                }}
              >
                Goal setting involves defining specific objectives, outlining
                actionable steps, and establishing a timeframe for achievement.
                It provides direction and motivation for personal or
                professional growth by creating clear targets to strive towards.
              </Typography>
            </Grid>

            <Grid container sx={{ mt: 5 }}>
              <Box width="100%" sx={{ mt: -1 }}>
                <Cards
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.6rem",
                    padding: 2,
                    border: "1px solid #E6E6E6",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: -1,
                          height: "40px",
                          width: "100%",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(to left, #8a252c, #AB3510)",
                            color: "#FFFFFF",
                            border: "1px solid transparent",
                            height: "2.5rem",
                            padding: "0.8rem 2rem",
                            fontSize: "15px",
                            transition: "background-color 0.3s, color 0.3s",
                            "&:hover": {
                              background:
                                "linear-gradient(to left, #8a252c, #AB3510)",
                              color: "white",
                              border: "0.5px solid #AB3510",
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
                          marginTop: { lg: "-25px" },
                        }}
                      >
                        <img
                          src="/year.png"
                          alt="Year Icon"
                          style={{ height: "3.5rem", marginRight: "0.5rem" }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              fontSize: {
                                lg: "1rem",
                                sm: "1rem",
                                md: "1rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            Target Year
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: {
                                lg: "0.9rem",
                                sm: "0.9rem",
                                md: "0.9rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            The specific year by which a goal is intended to be
                            achieved.
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          mt: 2,
                          border: "1px solid #ccc", // Add a border similar to the TextField
                          borderRadius: "5px", // Match the TextField's border radius
                          padding: "16px", // Keep consistent padding
                          backgroundColor: "#ffffff", // Match the TextField background color
                          width: "20%", // Adjust width as needed to match the TextField
                          height: "20%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow to match the TextField's style
                          fontSize: "15px", // Adjust font size to match TextField
                        }}
                      >
                        <DatePicker
                          selected={
                            startYear !== null
                              ? new Date(startYear, 0, 1)
                              : null
                          }
                          onChange={handleYearChange}
                          showYearPicker
                          disabled={!isEditing && !isNew}
                          minDate={new Date(new Date().getFullYear(), 0, 1)}
                          maxDate={new Date(new Date().getFullYear(), 11, 31)}
                          dateFormat="yyyy"
                          className="w-full bg-white-100" // Tailwind CSS for background color
                        />
                      </Box>

                      {displayedYear && (
                        <Typography
                          sx={{
                            fontSize: {
                              lg: "1rem",
                              sm: "1rem",
                              md: "1rem",
                              xs: "0.8rem",
                            },
                            mt: 1,
                          }}
                        >
                          Academic Year: {displayedYear}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "-15px",
                        }}
                      >
                        <img
                          src="/proposition.png"
                          alt="Vision Icon"
                          style={{ height: "3.5rem", marginRight: "0.5rem" }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              fontSize: {
                                lg: "1rem",
                                sm: "1rem",
                                md: "1rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            Office Vision
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: {
                                lg: "0.9rem",
                                sm: "0.9rem",
                                md: "0.9rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            A brief statement articulating the company’s
                            long-term goals and values.
                          </Typography>
                        </Box>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        rows={3} // Adjust number of rows for multiline behavior
                        value={officeVision}
                        onChange={(event) =>
                          setOfficeVision(event.target.value)
                        }
                        disabled={!isEditing && !isNew}
                        sx={{
                          mt: 2,
                          "& .MuiInputBase-root": {
                            height: "90px", // Adjust this value as needed to set the height
                          },
                          "& .MuiOutlinedInput-input": {
                            fontSize: "15px", // Adjust the font size as needed
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src="/proposition.png"
                          alt="Proposition Icon"
                          style={{ height: "3.5rem", marginRight: "0.5rem" }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              fontSize: {
                                lg: "1rem",
                                sm: "1rem",
                                md: "1rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            Value Proposition
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: {
                                lg: "0.9rem",
                                sm: "0.9rem",
                                md: "0.9rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            A concise statement that communicates the unique
                            benefits and advantages of your service.
                          </Typography>
                        </Box>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        rows={3} // Adjust number of rows for the desired base height
                        value={valueProposition}
                        onChange={(event) =>
                          setValueProposition(event.target.value)
                        }
                        disabled={!isEditing && !isNew}
                        sx={{
                          mt: 2,
                          "& .MuiInputBase-root": {
                            height: "90px", // Adjust this value to control the height
                          },
                          "& .MuiOutlinedInput-input": {
                            fontSize: "15px", // Adjust the font size as needed
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src="/mission.png"
                          alt="Mission Icon"
                          style={{ height: "3.5rem", marginRight: "0.5rem" }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              fontSize: {
                                lg: "1rem",
                                sm: "1rem",
                                md: "1rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            Mission
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: {
                                lg: "0.9rem",
                                sm: "0.9rem",
                                md: "0.9rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            A statement defining the company’s purpose and
                            commitment to delivering value.
                          </Typography>
                        </Box>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        rows={3} // Adjust the number of rows for the desired base height
                        value={mission}
                        onChange={(event) => setMission(event.target.value)}
                        disabled={!isEditing && !isNew}
                        sx={{
                          mt: 2,
                          "& .MuiInputBase-root": {
                            height: "90px",
                          },
                          "& .MuiOutlinedInput-input": {
                            fontSize: "15px",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ position: "relative" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src="/strategicgoals.png"
                          alt="Strategic Goals Icon"
                          style={{ height: "3.5rem", marginRight: "0.5rem" }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: "600",
                              fontSize: {
                                lg: "1rem",
                                sm: "1rem",
                                md: "1rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            Strategic Goals
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: {
                                lg: "0.9rem",
                                sm: "0.9rem",
                                md: "0.9rem",
                                xs: "0.8rem",
                              },
                            }}
                          >
                            A guiding principle for decision-making, driving the
                            organization towards its desired future state.
                          </Typography>
                        </Box>
                      </Box>

                      {(isEditing || isNew) && !isSaved && (
                        <Box sx={{ position: "absolute", right: 3, top: 45 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "50%",
                              width: "2rem",
                              height: "2rem",
                              backgroundColor: "#ff7b00d3",
                              marginTop: "0.5rem",
                            }}
                            onClick={handleAddGoal}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                color: "#ffffff",
                              }}
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Box>
                        </Box>
                      )}
                    </Grid>

                    {strategicGoals.map((goal, index) => (
                      <Grid item xs={12} key={index} className="relative">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            fullWidth
                            multiline
                            variant="outlined"
                            rows={3} // Adjust the number of rows for the desired base height
                            value={goal}
                            onChange={(event) =>
                              handleGoalChange(index, event.target.value)
                            }
                            disabled={!isEditing && !isNew}
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "90px", // Adjust this value to control the height
                              },
                              "& .MuiOutlinedInput-input": {
                                fontSize: "15px",
                              },
                            }}
                          />

                          {(isEditing || isNew) && !isSaved && (
                            <>
                              <IconButton
                                onClick={() => handleRemoveGoal(index)}
                                // className="absolute right-2 top-2"
                                sx={{
                                  marginTop: "-1rem",
                                  color: "#AB3510",
                                  "&:hover": {
                                    color: "red", // Change the icon color to red on hover
                                  },
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  style={{
                                    width: "24px", // Adjust width to match your icon size
                                    height: "24px", // Adjust height to match your icon size
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Cards>
              </Box>
            </Grid>

            {isshowGoalsModal && (
              <Modal
                open={isshowGoalsModal}
                onClose={handleCloseShowGoalsModal}
              >
                <div className="flex justify-center items-center h-screen">
                  <div className="p-5 bg-white rounded-lg shadow-md w-[60rem] max-h-[80vh] overflow-y-auto">
                    <Typography
                      sx={{ fontWeight: "bold", fontSize: { lg: "1.5rem" } }}
                    >
                      Goals
                    </Typography>
                    <div className="flex mt-1">
                      <Button
                        variant="text"
                        sx={{
                          fontSize: "15px",
                          color: currentTab === "current" ? "black" : "black",
                          fontWeight:
                            currentTab === "current" ? "bold" : "normal",
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
                          fontSize: "15px",
                          color:
                            currentTab === "accomplished" ? "black" : "black",
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
                            <TableCell
                              className="border border-gray-400 font-bold"
                              sx={{ textAlign: "center", fontSize: "15px" }} // Increased font size
                            >
                              Target Year
                            </TableCell>
                            <TableCell
                              className="border border-gray-400 font-bold"
                              sx={{ textAlign: "center", fontSize: "15px" }} // Increased font size
                            >
                              Vision
                            </TableCell>
                            <TableCell
                              className="border border-gray-400 font-bold"
                              sx={{ textAlign: "center", fontSize: "15px" }} // Increased font size
                            >
                              Value Proposition
                            </TableCell>
                            <TableCell
                              className="border border-gray-400 font-bold"
                              sx={{ textAlign: "center", fontSize: "15px" }} // Increased font size
                            >
                              Mission
                            </TableCell>
                            <TableCell
                              className="border border-gray-400 max-w-xs break-words font-bold"
                              sx={{ textAlign: "center", fontSize: "15px" }} // Increased font size
                            >
                              Strategic Goals
                            </TableCell>
                            <TableCell
                              className="border border-gray-400 font-bold"
                              sx={{ textAlign: "center", fontSize: "15px" }} // Increased font size
                            >
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
                                <TableCell
                                  className="border border-gray-400 whitespace-nowrap"
                                  style={{ fontSize: "15px" }}
                                >
                                  {" "}
                                  {/* Font size for body text */}
                                  {goal.targetYear}
                                </TableCell>
                                <TableCell
                                  className="border border-gray-400 max-w-xs break-words"
                                  style={{ fontSize: "15px" }}
                                >
                                  {" "}
                                  {/* Font size for body text */}
                                  {goal.vision}
                                </TableCell>
                                <TableCell
                                  className="border border-gray-400 max-w-xs break-words"
                                  style={{ fontSize: "15px" }}
                                >
                                  {" "}
                                  {/* Font size for body text */}
                                  {goal.proposition}
                                </TableCell>
                                <TableCell
                                  className="border border-gray-400 max-w-xs break-words"
                                  style={{ fontSize: "15px" }}
                                >
                                  {" "}
                                  {/* Font size for body text */}
                                  {goal.mission}
                                </TableCell>
                                <TableCell
                                  className="border border-gray-400 max-w-xs break-words"
                                  style={{ fontSize: "15px" }}
                                >
                                  {" "}
                                  {/* Font size for body text */}
                                  <ul className="list-disc pl-5">
                                    {goal.goals.map((item, index) => (
                                      <li
                                        key={index}
                                        style={{ fontSize: "15px" }}
                                      >
                                        {" "}
                                        {/* Font size for list items */}
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </TableCell>
                                <TableCell
                                  className="px-4 py-2 flex justify-center items-center border border-gray-400"
                                  style={{ height: "auto", fontSize: "15px" }} // Font size for body text
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
                              background: "white",
                              padding: 4,
                              borderRadius: 2,
                              boxShadow: 24,
                              textAlign: "center",
                              position: "relative",
                              width: "25rem",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                mb: 3,
                                fontSize: {
                                  lg: "1.5rem",
                                  sm: "1rem",
                                  md: "1rem",
                                  xs: "0.8rem",
                                },
                              }}
                            >
                              Success!
                            </Typography>
                            <Typography
                              sx={{
                                mb: 3,
                                fontSize: {
                                  lg: "1rem",
                                  sm: "1rem",
                                  md: "1rem",
                                  xs: "0.8rem",
                                },
                              }}
                            >
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
                                  width: "50%",
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  p: 1,
                                  fontSize: "15px",
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

                    <div className="flex justify-center mt-10">
                      <Button
                        variant="contained"
                        style={{
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                          color: "#ffffff",
                          fontSize: "15px",
                        }}
                        className="font-semibold text-[15px] w-[8rem]"
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
              marginBottom={1}
              marginTop={1}
            >
              <Grid
                container
                justifyContent="center"
                alignItems="flex-end"
                sx={{ padding: 2 }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display="flex"
                  justifyContent="center"
                >
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <Button
                        variant={isEditing ? "outlined" : "contained"}
                        onClick={isEditing ? handleCancel : toggleEditing}
                        sx={{
                          background: "white",
                          color: "#AB3510",
                          fontSize: "15px", // Consistent font size
                          height: "2.5rem", // Consistent height
                          width: "8rem", // Consistent width
                          border: "2px solid #AB3510",
                          padding: "0.8rem 2rem",
                          transition: "background-color 0.3s, color 0.3s",
                          "&:hover": {
                            background:
                              "linear-gradient(to left, #8a252c, #AB3510)",
                            color: "white",
                            border: "0.5px solid #AB3510",
                            opacity: 0.8,
                          },
                          "&:focus": {
                            outline: "none", // Remove outline on focus
                            boxShadow: "none", // Remove box shadow on focus
                          },
                        }}
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                          color: "#FFFFFF",
                          fontSize: "15px", // Consistent font size
                          height: "2.5rem", // Consistent height
                          width: "8rem", // Consistent width
                          padding: "0.8rem 2rem",
                          border: "1px solid transparent",
                          transition: "background-color 0.3s, color 0.3s",
                          "&:hover": {
                            background:
                              "linear-gradient(to left, #8a252c, #AB3510)",
                            color: "white",
                            border: "0.5px solid #AB3510",
                            opacity: 0.8,
                          },
                        }}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
                      width: "25rem",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: "bold", mb: 3, fontSize: "1.5rem" }}
                    >
                      Success!
                    </Typography>
                    <Typography sx={{ mb: 3, fontSize: "1rem" }}>
                      Goal Successfully Saved.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(to left, #8a252c, #AB3510)",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginTop: 2,
                        width: "8rem",
                        padding: "0.5rem 2.2rem",
                        borderRadius: "0.6rem",
                      }}
                      onClick={handleCloseSuccessModal}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Grid>

            <Modal
              open={showErrorModal}
              onClose={() => setShowErrorModal(false)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh", // Occupy full viewport height
                }}
              >
                <Box
                  sx={{
                    background: "white",
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    textAlign: "center",
                    position: "relative",
                    width: "25rem",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "bold", mb: 3, fontSize: "1.5rem" }}
                  >
                    Notice!
                  </Typography>
                  <Typography sx={{ mb: 3, fontSize: "1rem" }}>
                    {modalMessage}
                  </Typography>
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
                      onClick={() => setShowErrorModal(false)}
                      sx={{
                        width: "30%",
                        background:
                          "linear-gradient(to left, #8a252c, #AB3510)",
                        p: 1,
                        fontSize: "15px",
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Modal>
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
}
