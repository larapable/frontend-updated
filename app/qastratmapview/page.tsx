"use client";
import QANavbar from "../components/Navbars/QANavbar";
import QADepartmentView from "../components/QAProfile/QADepartmentView";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Misc/Spinner";
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Divider,
  Avatar,
  Select,
  MenuItem,
  Grid,
  Button,
  Autocomplete,
  FormHelperText,
  Card,
  responsiveFontSizes,
  Modal,
} from "@mui/material";
import axios from "axios";
import styled from "@emotion/styled";
import Image from "next/image";
import { SelectChangeEvent } from "@mui/material/Select";
import SpinnerPages from "../components/Misc/SpinnerPages";
import "@/app/page.css";

interface Department {
  id: number;
  department_name: string;
}

const drawerWidth = 280;

const StyledBox = styled(Box)({
  wordWrap: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
  height: "auto",
});

const MainFont = styled(Box)({
  fontSize: "0.9rem",
  mt: 2,
});

const Cards = styled(Box)({
  width: "100%",
  height: "auto",
  borderRadius: "10px",
  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
  borderColor: "#e9e8e8",
  borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
  borderWidth: "1px",
});

const Boxes = styled(Box)({
  height: "auto",
  width: "100%",
});

export default function QAStratmapView() {
  //   stratmap original code
  const { data: session } = useSession();
  const [selectedComponent, setSelectedComponent] = useState("");
  const [currentView, setCurrentView] = useState("primary");
  const [hasPrimaryStrats, setHasPrimaryStrats] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  const role = user?.role;
  const username = user?.username;

  useEffect(() => {
    let isMounted = true;

    const postToPrimaryStrategies = async () => {
      const response = await fetch(
        `http://localhost:8080/user/getHasPrimaryStrats/${username}`
      );
      const data = await response.json();

      console.log("data:", data);

      if (data === 0 && isMounted) {
        try {
          // Define an array of primary strategy data
          const primaryStrategiesData = [
            {
              perspective: "financial", // Added perspective field
              office_target:
                "Excellence in Organizational Stewardship A8.4: 100% compliance to prescribed budget ceiling",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.1: 90% average awareness rate of the services",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.2: 90% of eligible employees availed of the services of the administrative and academic support offices",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.3: At least 4.5 (out of 5.0) inter-office customer satisfaction",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.1: Have at least 4-star (out of 5) customer service rating",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.2: Have at least 9-star (out of 10) net promoter score",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.3: 90% transanctions resolved or answered customer query within expected time",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A4.1: 100% of the office systems standardized and documented",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A4.2: 100% of process records meet its requirements",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A5.1: 100% awareness of the existence of the University Brand Bible and of its guidelines and templates",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A5.2: 100% compliance to the branding guidelines in their instructional, operational and communication materials",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.1: 100% awareness of the existence of the 5S+ Program",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.2: 100% participation in the orientation/re-orientation of 5S+ training",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.3: 100% compliance of the 5S+ standard",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.1: At least 90% participation in CIT-sponsored events",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.2: At least 90% participation in CIT-sponsored trainings, seminars, workshops, and conferences",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.3: At least 90% participation in CIT-commissioned surveys, FGDs, etc.",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.1: 100% of admin staff are evaluated on time",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.2: 100% completed the Competence & Competency Matrix (CCM), training & development needs analysis (TDNA), and professional development plan",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.3: 50% of admin staff are involved in research work",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.4: 100% of staff are ranked",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.5: 100% submission of succession plan",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.6: 100% of staff have 1 community involvement activity per year",
              department: { id: department_id },
            },
          ];

          // Post each strategy individually
          const postPromises = primaryStrategiesData.map(
            async (strategyData) => {
              const endpoint = `http://localhost:8080/stratmap/primary${
                strategyData.perspective.charAt(0).toUpperCase() +
                strategyData.perspective.slice(1)
              }/insert`;
              console.log("Endpoint:", endpoint); // Log the endpoint for debugging
              const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(strategyData),
              });

              if (!response.ok) {
                console.error(
                  `Error posting ${strategyData.perspective} strategy:`,
                  response.status
                );
              }
            }
          );

          await Promise.all(postPromises);

          // Update hasPrimaryStrats in the user entity
          if (username) {
            const response = await fetch(
              `http://localhost:8080/user/update/primaryStrats/${username}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hasPrimaryStrats: 1 }),
              }
            );

            if (!response.ok) {
              console.error(
                "Error updating hasPrimaryStrats in user session:",
                response.status
              );
              // Handle the error appropriately (e.g., show an error message)
            } else {
              localStorage.setItem("hasPrimaryStrats", "1");
              setHasPrimaryStrats("1"); // Store in local storage
            }
          } else {
            console.error("Username not found in session data.");
          }

          // Re-fetch primary strategies to update the UI
          fetchPrimaryFinancialStrategies(department_id);
          fetchPrimaryStakeholderStrategies(department_id);
          fetchPrimaryInternalProcessStrategies(department_id);
          fetchPrimaryLearningGrowthStrategies(department_id);
        } catch (error) {
          console.error("Error posting to primary strategies:", error);
          // Handle errors, e.g., display an error message to the user
        }
      }
    };

    postToPrimaryStrategies();

    return () => {
      isMounted = false; // Cleanup: set isMounted to false on unmount
    };
  }, []);

  useEffect(() => {
    setHasPrimaryStrats(localStorage.getItem("hasPrimaryStrats"));

    fetchExistingStrategies(department_id);

    const fetchPrimaryStrategies = async () => {
      if (currentView === "primary" && department_id) {
        setIsLoading(true);
        try {
          const [financial, stakeholder, internal, learning] =
            await Promise.all([
              fetch(
                `http://localhost:8080/stratmap/primaryFinancial/get/${department_id}`
              ).then((res) => res.json()),
              fetch(
                `http://localhost:8080/stratmap/primaryStakeholder/get/${department_id}`
              ).then((res) => res.json()),
              fetch(
                `http://localhost:8080/stratmap/primaryInternal/get/${department_id}`
              ).then((res) => res.json()),
              fetch(
                `http://localhost:8080/stratmap/primaryLearning/get/${department_id}`
              ).then((res) => res.json()),
            ]);

          setPrimaryFinancialStrategies(
            financial.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            }))
          );
          setPrimaryStakeholderStrategies(
            stakeholder.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            }))
          );
          setPrimaryInternalProcessStrategies(
            internal.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            }))
          );
          setPrimaryLearningGrowthStrategies(
            learning.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            }))
          );
        } catch (error) {
          console.error("Error fetching primary strategies:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPrimaryStrategies();
  }, [session, currentView, selectedComponent, hasPrimaryStrats]);

  interface GeneratedSentence {
    id: number;
    fID: number;
    value: string;
  }

  interface StrategyCategories {
    financial: GeneratedSentence[];
    stakeholder: GeneratedSentence[];
    internalProcess: GeneratedSentence[];
    learningGrowth: GeneratedSentence[];
  }

  // for vision values mission
  const [editingStrategy, setEditingStrategy] =
    useState<GeneratedSentence | null>(null);
  const [newStrategyValue, setNewStrategyValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [primaryFinancialStrategies, setPrimaryFinancialStrategies] = useState<
    GeneratedSentence[]
  >([]);
  const [primaryStakeholderStrategies, setPrimaryStakeholderStrategies] =
    useState<GeneratedSentence[]>([]);
  const [
    primaryInternalProcessStrategies,
    setPrimaryInternalProcessStrategies,
  ] = useState<GeneratedSentence[]>([]);
  const [primaryLearningGrowthStrategies, setPrimaryLearningGrowthStrategies] =
    useState<GeneratedSentence[]>([]);

  // @ts-ignore
  const handleEditClick = (strategy: GeneratedSentence) => {
    setEditingStrategy(strategy);
    setNewStrategyValue(strategy.value);
  };

  const handleButtonClick = (department_id: number) => {
    setShowWarning(true);
  };

  const [strategies, setStrategies] = useState<StrategyCategories>({
    financial: [],
    stakeholder: [],
    internalProcess: [],
    learningGrowth: [],
  });

  const handleFinancialSaveEdit = useCallback(
    async (fID: number, office_target: string, department_id: number) => {
      try {
        const details = {
          id: fID,
          office_target: office_target,
          department: { id: department_id }, // Include the department ID in the payload
        };
        const response = await fetch(
          `http://localhost:8080/stratmap/financial/edit/${fID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
          }
        );

        if (!response.ok) {
          console.error("Failed to update strategy", response.status);
          return;
        }

        const result = await response.json();
        const updatedStrategy = result.updatedFinancial;

        setStrategies((prevStrategies) => {
          const newStrategies = { ...prevStrategies };
          const financial = newStrategies.financial || [];
          console.log(`updatedStrategy for fID ${fID}:`, updatedStrategy);

          if (updatedStrategy) {
            const strategyIndex = financial.findIndex(
              (strategy) => strategy.id === fID
            );
            if (strategyIndex !== -1) {
              financial[strategyIndex] = updatedStrategy;
              newStrategies.financial = financial;
            } else {
              console.error(`Strategy with id ${fID} not found`);
            }
          } else {
            console.error(`updatedStrategy for fID ${fID} is undefined`);
          }

          return newStrategies;
        });

        fetchExistingStrategies(department_id);
      } catch (error) {
        console.error("An error occurred while updating the strategy:", error);
      }
    },
    []
  );

  const handleLearningGrowthSaveEdit = useCallback(
    async (fID: number, office_target: string, department_id: number) => {
      try {
        const details = {
          id: fID,
          office_target: office_target,
          department: { id: department_id }, // Include the department ID in the payload
        };
        const response = await fetch(
          `http://localhost:8080/stratmap/learning/edit/${fID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
          }
        );

        if (!response.ok) {
          console.error("Failed to update strategy");
          return;
        }

        const result = await response.json();
        const updatedStrategy = result.updatedLG;

        setStrategies((prevStrategies) => {
          const newStrategies = { ...prevStrategies };
          const learningGrowth = newStrategies.learningGrowth || [];
          console.log(`updatedStrategy for fID ${fID}:`, updatedStrategy);

          if (updatedStrategy) {
            const strategyIndex = learningGrowth.findIndex(
              (strategy) => strategy.id === fID
            );
            if (strategyIndex !== -1) {
              learningGrowth[strategyIndex] = updatedStrategy;
              newStrategies.learningGrowth = learningGrowth;
            } else {
              console.error(`Strategy with id ${fID} not found`);
            }
          } else {
            console.error(`updatedStrategy for fID ${fID} is undefined`);
          }

          return newStrategies;
        });

        fetchExistingStrategies(department_id);
      } catch (error) {
        console.error("An error occurred while updating the strategy:", error);
      }
    },
    []
  );

  const handleStakeholderSaveEdit = useCallback(
    async (fID: number, office_target: string, department_id: number) => {
      try {
        const details = {
          office_target: office_target,
          department: { id: department_id }, // Include the department ID in the payload
        };
        const response = await fetch(
          `http://localhost:8080/stratmap/stakeholder/edit/${fID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
          }
        );

        if (!response.ok) {
          console.error("Failed to update strategy");
          return;
        }

        const result = await response.json();
        const updatedStrategy = result.stakeholderUpdated;

        setStrategies((prevStrategies) => {
          const newStrategies = { ...prevStrategies };
          const stakeholder = newStrategies.stakeholder || [];
          console.log(`updatedStrategy for fID ${fID}:`, updatedStrategy);

          if (updatedStrategy) {
            const strategyIndex = stakeholder.findIndex(
              (strategy) => strategy.id === fID
            );
            if (strategyIndex !== -1) {
              stakeholder[strategyIndex] = updatedStrategy;
              newStrategies.stakeholder = stakeholder;
            } else {
              console.error(`Strategy with id ${fID} not found`);
            }
          } else {
            console.error(`updatedStrategy for fID ${fID} is undefined`);
          }

          return newStrategies;
        });

        fetchExistingStrategies(department_id);
      } catch (error) {
        console.error("An error occurred while updating the strategy:", error);
      }
    },
    []
  );

  const handleInternalProcessSaveEdit = useCallback(
    async (fID: number, office_target: string, department_id: number) => {
      try {
        const details = {
          office_target: office_target,
          department: { id: department_id }, // Include the department ID in the payload
        };
        const response = await fetch(
          `http://localhost:8080/stratmap/internal/edit/${fID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
          }
        );

        if (!response.ok) {
          console.error("Failed to update strategy");
          return;
        }

        const result = await response.json();
        const updatedStrategy = result.updatedIP;

        setStrategies((prevStrategies) => {
          const newStrategies = { ...prevStrategies };
          const internalProcess = newStrategies.internalProcess || [];
          console.log(`updatedStrategy for fID ${fID}:`, updatedStrategy);

          if (updatedStrategy) {
            const strategyIndex = internalProcess.findIndex(
              (strategy) => strategy.id === fID
            );
            if (strategyIndex !== -1) {
              internalProcess[strategyIndex] = updatedStrategy;
              newStrategies.internalProcess = internalProcess;
            } else {
              console.error(`Strategy with id ${fID} not found`);
            }
          } else {
            console.error(`updatedStrategy for fID ${fID} is undefined`);
          }

          return newStrategies;
        });

        fetchExistingStrategies(department_id);
      } catch (error) {
        console.error("An error occurred while updating the strategy:", error);
      }
    },
    []
  );

  const API_ENDPOINTS = [
    `http://localhost:8080/stStrat/get/${department_id}`,
    `http://localhost:8080/soStrat/get/${department_id}`,
    `http://localhost:8080/wtStrat/get/${department_id}`,
    `http://localhost:8080/woStrat/get/${department_id}`,
  ];

  const SYSTEM_PROMPT = `Categorize the following responses into the following categories:
      1. Financial: Stewardship
      2. Stakeholder: Client Relationship
      3. Internal Process: Process Development & Technology Management
      4. Learning & Growth: Culture & People Development
      
    Remove any existing numbering in the responses namely the returned number from the database but do not remove the target code (S1O1, W2T3, etc).
    Sort the responses by which category you think fits them while also taking into account the OFFICE VISION, VALUE PROPOSITION (only choose from 1-4).
    When sorting, take into account the these three strategic themes: Excellence in Service Quality, Excellence in Internal Service Systems and Excellence in Organizational Stewardship. Append it to the modified response.
    DO NOT MODIFY THE ORIGINAL STRATEGY RESPONSE TEXT. If the response is blank, write "Field is blank" for that response. 
    Sort the responses by strategic theme.
    These are example outputs you should format you output in: (
    Sample 1: 3. Excellence in Internal Service Systems S6T2: Test new products and marketing strategies to stay ahead of competitors.
    Sample 2: 1. Excellence in Service Quality S1O1: Implement contingency plans to ensure continuity during economic downturns.
    Sample 3: 4. Excellence in Organizational Stewardship W2T1: Implement contingency plans to ensure continuity during economic downturns.
    Sample 4: 2. Excellence in Internal Service Systems S6T2: Test new products and marketing strategies to stay ahead of competitors. )
    "category number 1-4. (whichever strategic theme you think fits the response, DO NOT ADD THE CATEGORY NAMES OR ANY PRETEXT ASIDE FROM THE STRATEGIC THEME HERE.) (strategy here)" DO NOT ADD ANY MARKUP.
    "Make sure not to output any double strategies with the same target code"
    `;

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-exp-0827:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`;

  // financial
  const [isFModalOpen, setIsFModalOpen] = useState(false);
  const [newFStrategy, setNewFStrategy] = useState("");
  const [newFTargetCode, setNewFTargetCode] = useState("");
  const [savedFStrategies, setSavedFStrategies] = useState<string[]>([]);

  const openFModal = () => {
    setIsFModalOpen(true);
    setNewFTargetCode("");
    setNewFStrategy("");
  };

  const closeFModal = () => {
    setNewFTargetCode("");
    setIsFModalOpen(false);
  };

  const handleFSave = async () => {
    const strategyFWithCode = `${newFTargetCode}: ${newFStrategy}`;

    try {
      const data = {
        office_target: newFStrategy,
        department: { id: department_id },
        user_generated: 1,
      };
      const response = await fetch(
        "http://localhost:8080/stratmap/financial/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closeFModal();
      } else {
        console.error("Error saving financial strategy");
        // Handle error
      }
    } catch (error) {
      console.error("Error saving financial strategy:", error);
      // Handle error
    }
    setSavedFStrategies([...savedFStrategies, strategyFWithCode]);
  };

  const handlePrimaryFSave = async () => {
    try {
      const data = {
        office_target: `${newPrimaryFTargetCode}: ${newPrimaryFStrategy}`, // Combine target code and strategy
        department: { id: department_id },
      };

      console.log("Data to be sent:", data); // Log the data for debugging

      const response = await fetch(
        "http://localhost:8080/stratmap/primaryFinancial/insert", // Use the correct endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closePrimaryFModal();
        fetchPrimaryFinancialStrategies(department_id); // Refresh the list after saving
      } else {
        console.error(
          "Error saving primary financial strategy:",
          response.status
        );
        // Handle error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error("Error saving primary financial strategy:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handlePrimarySSave = async () => {
    try {
      const data = {
        office_target: `${newPrimarySTargetCode}: ${newPrimarySStrategy}`, // Combine target code and strategy
        department: { id: department_id },
      };

      console.log("Data to be sent:", data); // Log the data for debugging

      const response = await fetch(
        "http://localhost:8080/stratmap/primaryStakeholder/insert", // Use the correct endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closePrimarySModal();
        fetchPrimaryStakeholderStrategies(department_id); // Refresh the list after saving
      } else {
        console.error(
          "Error saving primary stakeholder strategy:",
          response.status
        );
        // Handle error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error("Error saving primary stakeholder strategy:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handlePrimaryLGSave = async () => {
    try {
      const data = {
        office_target: `${newPrimaryLGTargetCode}: ${newPrimaryLGStrategy}`, // Combine target code and strategy
        department: { id: department_id },
      };

      console.log("Data to be sent:", data); // Log the data for debugging

      const response = await fetch(
        "http://localhost:8080/stratmap/primaryLearning/insert", // Use the correct endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closePrimaryLGModal();
        fetchPrimaryLearningGrowthStrategies(department_id); // Refresh the list after saving
      } else {
        console.error(
          "Error saving primary learning strategy:",
          response.status
        );
        // Handle error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error("Error saving primary learning strategy:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handlePrimaryIPSave = async () => {
    try {
      const data = {
        office_target: `${newPrimaryIPTargetCode}: ${newPrimaryIPStrategy}`, // Combine target code and strategy
        department: { id: department_id },
      };

      console.log("Data to be sent:", data); // Log the data for debugging

      const response = await fetch(
        "http://localhost:8080/stratmap/primaryInternal/insert", // Use the correct endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closePrimaryIPModal();
        fetchPrimaryInternalProcessStrategies(department_id); // Refresh the list after saving
      } else {
        console.error(
          "Error saving primary internal strategy:",
          response.status
        );
        // Handle error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error("Error saving primary internal strategy:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  // Primary financial
  const [isPrimaryFModalOpen, setIsPrimaryFModalOpen] = useState(false);
  const [newPrimaryFStrategy, setNewPrimaryFStrategy] = useState("");
  const [newPrimaryFTargetCode, setNewPrimaryFTargetCode] = useState("");

  const openPrimaryFModal = () => {
    setIsPrimaryFModalOpen(true);
    setNewPrimaryFTargetCode("");
    setNewPrimaryFStrategy("");
  };

  const closePrimaryFModal = () => {
    setNewPrimaryFTargetCode("");
    setIsPrimaryFModalOpen(false);
  };

  // Primary stakeholder
  const [isPrimarySModalOpen, setIsPrimarySModalOpen] = useState(false);
  const [newPrimarySStrategy, setNewPrimarySStrategy] = useState("");
  const [newPrimarySTargetCode, setNewPrimarySTargetCode] = useState("");

  const openPrimarySModal = () => {
    setIsPrimarySModalOpen(true);
    setNewPrimarySTargetCode("");
    setNewPrimarySStrategy("");
  };

  const closePrimarySModal = () => {
    setNewPrimarySTargetCode("");
    setIsPrimarySModalOpen(false);
  };

  // stakeholder
  const [isSModalOpen, setIsSModalOpen] = useState(false);
  const [newSStrategy, setNewSStrategy] = useState("");
  const [newSTargetCode, setNewSTargetCode] = useState("");
  const [savedSStrategies, setSavedSStrategies] = useState<string[]>([]);

  const openSModal = () => {
    setIsSModalOpen(true);
    setNewSTargetCode("");
    setNewSStrategy("");
  };

  const closeSModal = () => {
    setNewSTargetCode("");
    setIsSModalOpen(false);
  };

  const handleSSave = async () => {
    const strategySWithCode = `${newSTargetCode}: ${newSStrategy}`;

    try {
      const data = {
        office_target: newSStrategy,
        department: { id: department_id },
        user_generated: 1,
      };
      const response = await fetch(
        "http://localhost:8080/stratmap/stakeholder/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closeSModal();
      } else {
        console.error("Error saving stakeholder strategy");
        // Handle error
      }
    } catch (error) {
      console.error("Error saving stakeholder strategy:", error);
      // Handle error
    }
    setSavedSStrategies([...savedSStrategies, strategySWithCode]);
  };

  // internal process
  const [isPrimaryIPModalOpen, setIsPrimaryIPModalOpen] = useState(false);
  const [newPrimaryIPStrategy, setNewPrimaryIPStrategy] = useState("");
  const [newPrimaryIPTargetCode, setNewPrimaryIPTargetCode] = useState("");

  const openPrimaryIPModal = () => {
    setIsPrimaryIPModalOpen(true);
    setNewPrimaryIPTargetCode("");
    setNewPrimaryIPStrategy("");
  };

  const closePrimaryIPModal = () => {
    setNewPrimaryIPTargetCode("");
    setIsPrimaryIPModalOpen(false);
  };

  // internal process
  const [isIPModalOpen, setIsIPModalOpen] = useState(false);
  const [newIPStrategy, setNewIPStrategy] = useState("");
  const [newIPTargetCode, setNewIPTargetCode] = useState("");
  const [savedIPStrategies, setSavedIPStrategies] = useState<string[]>([]);

  const openIPModal = () => {
    setIsIPModalOpen(true);
    setNewIPTargetCode("");
    setNewIPStrategy("");
  };

  const closeIPModal = () => {
    setNewIPTargetCode("");
    setIsIPModalOpen(false);
  };

  const handleIPSave = async () => {
    const strategyIPWithCode = `${newIPTargetCode}: ${newIPStrategy}`;

    try {
      const data = {
        office_target: newIPStrategy,
        department: { id: department_id },
        user_generated: 1,
      };
      const response = await fetch(
        "http://localhost:8080/stratmap/internal/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closeIPModal();
      } else {
        console.error("Error saving internal process strategy");
        // Handle error
      }
    } catch (error) {
      console.error("Error saving internal process strategy:", error);
      // Handle error
    }
    setSavedSStrategies([...savedIPStrategies, strategyIPWithCode]);
  };

  // Primary learning&growth
  const [isPrimaryLGModalOpen, setIsPrimaryLGModalOpen] = useState(false);
  const [newPrimaryLGStrategy, setNewPrimaryLGStrategy] = useState("");
  const [newPrimaryLGTargetCode, setNewPrimaryLGTargetCode] = useState("");

  const openPrimaryLGModal = () => {
    setIsPrimaryLGModalOpen(true);
    setNewPrimaryLGTargetCode("");
    setNewPrimaryLGStrategy("");
  };

  const closePrimaryLGModal = () => {
    setNewPrimaryLGTargetCode("");
    setIsPrimaryLGModalOpen(false);
  };

  // learning&growth
  const [isLGModalOpen, setIsLGModalOpen] = useState(false);
  const [newLGStrategy, setNewLGStrategy] = useState("");
  const [newLGTargetCode, setNewLGTargetCode] = useState("");
  const [savedLGStrategies, setSavedLGStrategies] = useState<string[]>([]);

  const openLGModal = () => {
    setIsLGModalOpen(true);
    setNewLGTargetCode("");
    setNewLGStrategy("");
  };

  const closeLGModal = () => {
    setNewLGTargetCode("");
    setIsLGModalOpen(false);
  };

  const handleLGSave = async () => {
    const strategyLGWithCode = `${newLGTargetCode}: ${newLGStrategy}`;

    try {
      const data = {
        office_target: newLGStrategy,
        department: { id: department_id },
        user_generated: 1,
      };
      const response = await fetch(
        "http://localhost:8080/stratmap/learning/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closeLGModal();
      } else {
        console.error("Error saving learning growth strategy");
        // Handle error
      }
    } catch (error) {
      console.error("Error saving learning growth strategy:", error);
      // Handle error
    }
    setSavedFStrategies([...savedLGStrategies, strategyLGWithCode]);
  };

  const fetchDataAndCategorize = async (apiEndpoint: string) => {
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      console.log("swot data: ", data);

      const inputText = data
        .map((row: any) => {
          if (row["s_oResponses"]) return row["s_oResponses"];
          else if (row["s_tResponses"]) return row["s_tResponses"];
          else if (row["w_oResponses"]) return row["w_oResponses"];
          else if (row["w_tResponses"]) return row["w_tResponses"];
          else return "";
        })
        .join("\n");

      console.log("inputText: ", inputText);

      const geminiResponse = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${SYSTEM_PROMPT}\n${inputText}` }],
            },
          ],
        }),
      });
      const geminiData = await geminiResponse.json();
      const apiResponse =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";
      console.log("api response: ", apiResponse);

      const generatedSentences: string[] = apiResponse
        .split("\n")
        .filter((sentence: string) => sentence.trim() !== "");

      const categorizedSentences: GeneratedSentence[] = await Promise.all(
        // Use Promise.all to handle async operations within map
        generatedSentences.map(async (sentence) => {
          const match = sentence.match(
            /^(\d+)\.\s*(.*?)\s*([SW]\d+[TO]\d+|[WO]\d+[WT]\d+)?:\s*(.*)$/
          );

          if (match) {
            const [, idStr, strategicTheme, code, content] = match;
            const id = parseInt(idStr, 10);
            const fID = id;

            // POST target code to backend
            if (id === 1) {
              // Assuming id 1 represents Financial perspective
              try {
                const response = await fetch(
                  // Make the fetch call asynchronous with await
                  "http://localhost:8080/bsc/financialBsc/insert",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      target_code: code, // Send the extracted target code
                      office_target: `${strategicTheme} ${code}: ${content}`, // Send the full strategy text as well
                      department: { id: department_id }, // Assuming department_id is available
                    }),
                  }
                );

                if (!response.ok) {
                  console.error("Error POSTing target code:", response.status);
                }
              } catch (error) {
                console.error("Error POSTing target code:", error);
              }
            }

            return { id, fID, value: `${strategicTheme} ${code}: ${content}` };
          } else {
            console.warn("Invalid sentence format:", sentence);
            return { id: -1, fID: -1, value: sentence };
          }
        })
      );
      return categorizedSentences;
    } catch (error) {
      console.error(
        `Error fetching data or processing Gemini response for ${apiEndpoint}:`,
        error
      );
      return [];
    }
  };

  const fetchAllData = async (department_id: number) => {
    const promises = API_ENDPOINTS.map((apiEndpoint) =>
      fetchDataAndCategorize(apiEndpoint)
    );
    const categorizedSentencesArrays = await Promise.all(promises);

    const strategies = {
      financial: [] as GeneratedSentence[],
      stakeholder: [] as GeneratedSentence[],
      internalProcess: [] as GeneratedSentence[],
      learningGrowth: [] as GeneratedSentence[],
    };

    for (const categorizedSentences of categorizedSentencesArrays) {
      for (const sentence of categorizedSentences) {
        switch (sentence.id) {
          case 1:
            strategies.financial.push(sentence);
            break;
          case 2:
            strategies.stakeholder.push(sentence);
            break;
          case 3:
            strategies.internalProcess.push(sentence);
            break;
          case 4:
            strategies.learningGrowth.push(sentence);
            break;
        }
      }
    }
    setStrategies(strategies);

    const saveToDatabase = async (
      strategies: {
        financial: GeneratedSentence[];
        stakeholder: GeneratedSentence[];
        internalProcess: GeneratedSentence[];
        learningGrowth: GeneratedSentence[];
      },
      department_id: number
    ) => {
      try {
        // Financial entity
        const financialPromises = strategies.financial.map((sentence) => {
          const data = {
            office_target: sentence.value,
            department: { id: department_id },
          };
          console.log("financial data: ", data);
          return fetch("http://localhost:8080/stratmap/financial/insert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        });
        await Promise.all(financialPromises);

        // Stakeholder entity
        const stakeholderPromises = strategies.stakeholder.map((sentence) => {
          const data = {
            office_target: sentence.value,
            department: { id: department_id },
          };
          return fetch("http://localhost:8080/stratmap/stakeholder/insert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        });
        await Promise.all(stakeholderPromises);

        // Internal process entity
        const internalProcessPromises = strategies.internalProcess.map(
          (sentence) => {
            const data = {
              office_target: sentence.value,
              department: { id: department_id },
            };
            return fetch("http://localhost:8080/stratmap/internal/insert", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
          }
        );
        await Promise.all(internalProcessPromises);

        // Learning and growth entity
        const learningGrowthPromises = strategies.learningGrowth.map(
          (sentence) => {
            const data = {
              office_target: sentence.value,
              department: { id: department_id },
            };
            return fetch("http://localhost:8080/stratmap/learning/insert", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
          }
        );
        await Promise.all(learningGrowthPromises);

        console.log("Data saved to database");
      } catch (error) {
        console.error("Error saving data to database:", error);
      }
    };

    if (department_id) {
      await saveToDatabase(strategies, department_id);
    } else {
      console.error("Department ID not found in user data. Cannot save data.");
    }
  };

  const fetchPrimaryFinancialStrategies = async (department_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/primaryFinancial/get/${department_id}` // Assuming this is your API endpoint
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("primary financial data: ", data);

      // Update the strategies state with the fetched primary financial strategies
      setPrimaryFinancialStrategies(
        // Update the primaryFinancialStrategies state
        data.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error("Error fetching primary financial strategies:", error);
    }
  };

  const fetchPrimaryStakeholderStrategies = async (department_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/primaryStakeholder/get/${department_id}` // Assuming this is your API endpoint
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Update the strategies state with the fetched primary stakeholder strategies
      setPrimaryStakeholderStrategies(
        // Update the primaryFinancialStrategies state
        data.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error("Error fetching primary stakeholder strategies:", error);
    }
  };

  const fetchPrimaryInternalProcessStrategies = async (
    department_id: number
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/primaryInternal/get/${department_id}` // Assuming this is your API endpoint
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Update the strategies state with the fetched primary internal process strategies
      setPrimaryInternalProcessStrategies(
        // Update the primaryFinancialStrategies state
        data.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error(
        "Error fetching primary internal process strategies:",
        error
      );
    }
  };

  const fetchPrimaryLearningGrowthStrategies = async (
    department_id: number
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/primaryLearning/get/${department_id}` // Assuming this is your API endpoint
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Update the strategies state with the fetched primary learning and growth strategies
      setPrimaryLearningGrowthStrategies(
        // Update the primaryFinancialStrategies state
        data.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error(
        "Error fetching primary learning and growth strategies:",
        error
      );
    }
  };

  const fetchExistingStrategies = async (department_id: number) => {
    if (department_id) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/byDepartment/${department_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("existing data: ", data);

      const strategies = {
        financial: data.financial.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        })),
        stakeholder: data.stakeholder.map((item: any) => ({
          id: 2,
          fID: item.id,
          value: item.office_target,
        })),
        internalProcess: data.internalProcess.map((item: any) => ({
          id: 3,
          fID: item.id,
          value: item.office_target,
        })),
        learningGrowth: data.learningGrowth.map((item: any) => ({
          id: 4,
          fID: item.id,
          value: item.office_target,
        })),
      };

      setStrategies(strategies);
      console.log(strategies);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching existing strategies:", error);
    }
  };

  const handleFinancialDelete = useCallback(async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/financial/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedStrategies = strategies.financial.filter(
          (strategy) => strategy.id !== id
        );
        setStrategies({ ...strategies, financial: updatedStrategies });
        fetchExistingStrategies(department_id);
      } else {
        console.error("Failed to delete financial strategy");
      }
    } catch (error) {
      console.error("Error deleting financial strategy:", error);
    }
  }, []);

  const handleLGDelete = useCallback(async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/learning/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedStrategies = strategies.learningGrowth.filter(
          (strategy) => strategy.id !== id
        );
        setStrategies({ ...strategies, learningGrowth: updatedStrategies });
        fetchExistingStrategies(department_id);
      } else {
        console.error("Failed to delete financial strategy");
      }
    } catch (error) {
      console.error("Error deleting financial strategy:", error);
    }
  }, []);

  const handleStakeholderDelete = useCallback(async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/stakeholder/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedStrategies = strategies.stakeholder.filter(
          (strategy) => strategy.id !== id
        );
        setStrategies({ ...strategies, stakeholder: updatedStrategies });
        fetchExistingStrategies(department_id);
      } else {
        console.error("Failed to delete financial strategy");
      }
    } catch (error) {
      console.error("Error deleting financial strategy:", error);
    }
  }, []);

  const handleInternalDelete = useCallback(async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/internal/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedStrategies = strategies.internalProcess.filter(
          (strategy) => strategy.id !== id
        );
        setStrategies({ ...strategies, internalProcess: updatedStrategies });
        fetchExistingStrategies(department_id);
      } else {
        console.error("Failed to delete financial strategy");
      }
    } catch (error) {
      console.error("Error deleting financial strategy:", error);
    }
  }, []);

  const checkGeneratedAiStrats = async (username: string) => {
    console.log("checking generatedAiStrats");

    try {
      const response = await fetch(
        `http://localhost:8080/user/get/${username}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userData = await response.json();
      console.log("userData: ", userData.generatedAiStrats);

      if (userData.generatedAiStrats === 1) {
        await fetchExistingStrategies(department_id);
      } else if (
        userData.generatedAiStrats === 0 ||
        userData.generatedAiStrats === null
      ) {
        await updateGeneratedAiStrats(username);
        await fetchAllData(department_id);
      }
    } catch (error) {
      console.error("Error checking generatedAiStrats:", error);
    }
  };

  const updateGeneratedAiStrats = async (username: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/get/${username}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userData = await response.json();

      if (userData.generatedAiStrats === 0) {
        // Update generatedAiStrats to 1
        const updateResponse = await fetch(
          `http://localhost:8080/user/update/${username}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ generatedAiStrats: 1 }),
          }
        );

        if (!updateResponse.ok) {
          throw new Error(`HTTP error! Status: ${updateResponse.status}`);
        }
      }
    } catch (error) {
      console.error("Error updating generatedAiStrats:", error);
    }
  };

  const changeComponent = (componentName: string) => {
    localStorage.setItem("lastComponent", componentName);
    setSelectedComponent(componentName);
  };

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDepartmentId = parseInt(event.target.value, 10);
    const selected = departments.find(
      (department) => department.id === selectedDepartmentId
    );

    setStrategies({
      financial: [],
      stakeholder: [],
      internalProcess: [],
      learningGrowth: [],
    });

    setSelectedDepartment(selected || null);
    if (selected) {
      localStorage.setItem("selectedDepartmentId", selected.id.toString()); // Store in local storage
      fetchStrategiesForDepartment(selected.id);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/department/getAllDepartments",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDepartments(data.departments);

        // Fetch strategies for the first department initially if available
        if (data.departments.length > 0) {
          setSelectedDepartment(data.departments[0]);
          fetchStrategiesForDepartment(data.departments[0].id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchStrategiesForDepartment = async (departmentId: number) => {
    try {
      const perspectives = ["financial", "internal", "learning", "stakeholder"];
      const promises = perspectives.map((perspective) =>
        fetch(
          `http://localhost:8080/stratmap/${perspective}/get/${departmentId}`
        )
          .then((res) => res.json())
          .then((data) => ({ perspective, data }))
      );

      const results = await Promise.all(promises);

      const newStrategies: StrategyCategories = {
        financial: [],
        stakeholder: [],
        internalProcess: [],
        learningGrowth: [],
      };

      results.forEach(({ perspective, data }) => {
        switch (perspective) {
          case "financial":
            newStrategies.financial = data.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            })); // Map data to correct format
            break;
          case "stakeholder":
            newStrategies.stakeholder = data.map((item: any) => ({
              id: 2,
              fID: item.id,
              value: item.office_target,
            })); // Map data to correct format
            break;
          case "internal":
            newStrategies.internalProcess = data.map((item: any) => ({
              id: 3,
              fID: item.id,
              value: item.office_target,
            })); // Map data to correct format
            break;
          case "learning":
            newStrategies.learningGrowth = data.map((item: any) => ({
              id: 4,
              fID: item.id,
              value: item.office_target,
            })); // Map data to correct format
            break;
        }
      });

      setStrategies(newStrategies);
    } catch (error) {
      console.error("Error fetching strategies for department:", error);
      setStrategies({
        financial: [],
        stakeholder: [],
        internalProcess: [],
        learningGrowth: [],
      });
    }
  };

  if (isLoading) {
    return <SpinnerPages />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        color: "#4D4C4C",
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
        <QANavbar />
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
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontSize: { xs: "1.8rem", sm: "2.125rem" },
                }}
              >
                STRATEGY MAPPING
              </Typography>
            </Grid>

            {/* TOGGLE BUTTON HERE */}
            <Grid item>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                border={1}
                borderColor="#e9e8e8"
                width="auto"
                height="auto"
                borderRadius={2}
                fontSize={12}
                sx={{ gap: 1, p: 0.5, borderWidth: 0.5 }}
              >
                <button
                  onClick={() => setCurrentView("primary")}
                  className={`rounded-lg transition-all ${
                    currentView === "primary"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white p-3`}
                >
                  PRIMARY
                </button>
                <button
                  onClick={() => setCurrentView("secondary")}
                  className={`rounded-lg transition-all ${
                    currentView === "secondary"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white p-3`}
                >
                  SECONDARY
                </button>
              </Box>
            </Grid>
          </Grid>

          <Grid container sx={{ mt: 5 }}>
            <Box width="100%" sx={{ mt: -1 }}>
              {currentView === "primary" && (
                <>
                  {/* FINANCIAL PRIMARY */}
                  <Cards>
                    <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        sx={{
                          ml: 1,
                          height: "85px",
                          "& .MuiInputBase-root": { height: "85px" },
                        }}
                      >
                        <Grid item sm={11.3} container alignItems="center">
                          <Box>
                            <img
                              src="/financial.png"
                              alt=""
                              className="h-[5rem]"
                            />
                          </Box>
                          <Box sx={{ ml: 1 }}>
                            <Typography sx={{ fontWeight: "bolder" }}>
                              <span className="text-[#ff7b00d3]">
                                Financial:
                              </span>{" "}
                              Stewardship Overview
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "500" }}
                            >
                              Measures financial performance and profitability.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sm={0.7}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              background: "#ff7b00d3",
                              borderRadius: "50%",
                              width: "3rem",
                              height: "3rem",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                              onClick={openPrimaryFModal}
                            >
                              <div className="flex flex-row">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-8"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* add modal here */}
                      {isPrimaryFModalOpen && (
                        <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                          <Box
                            className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                            sx={{
                              width: "60%",
                              height: "85%",
                              maxWidth: "95vw",
                              maxHeight: "95vh",
                              // maxHeight: '100vh',
                            }}
                          >
                            <p className="text-xl font-bold mb-4">
                              Financial Strategy
                            </p>
                            <div className="flex flex-col mb-1">
                              <Typography sx={{ fontWeight: 800 }}>
                                Target Code
                                <span className="text-[#DD1414]">*</span>
                              </Typography>
                            </div>
                            <TextField
                              variant="outlined"
                              value={newPrimaryFTargetCode}
                              onChange={(e) =>
                                setNewPrimaryFTargetCode(e.target.value)
                              }
                              sx={{
                                height: "35px",
                                "& .MuiInputBase-root": { height: "35px" },
                              }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 800, mt: 2 }}>
                                Strategy
                                <span className="text-[#DD1414]">*</span>
                              </Typography>
                              <span className="mb-3">
                                Before inputting a strategy, please follow this
                                format.
                              </span>
                              <span>
                                <br />
                                1. Choose one of the following{" "}
                                <span className="font-bold">
                                  strategic themes
                                </span>
                                :
                              </span>
                              <ul className="list-disc ml-10 mb-2">
                                <li className="font-bold">
                                  Excellence in Service Quality
                                </li>
                                <li className="font-bold">
                                  Excellence in Internal Service Systems
                                </li>
                                <li className="font-bold">
                                  Excellence in Organizational Stewardship
                                </li>
                              </ul>
                              <span>
                                2. After selecting the theme, leave a space and
                                then input the{" "}
                                <span className="font-bold">target code</span>{" "}
                                followed by a colon{" "}
                                <span className="font-bold">(:)</span>
                              </span>
                              <span>
                                <br />
                                3. Finally, write the{" "}
                                <span className="font-bold">strategy.</span>
                              </span>
                              <br />
                              <span>
                                <br />
                                The correct format should be:{" "}
                                <span className="font-bold">
                                  Strategic Theme Target Code: Strategy
                                </span>
                              </span>
                              <span className="font-bold">
                                <br />
                                Example:{" "}
                                <span className="font-bold text-red-500">
                                  Excellence in Service Quality T001: Improve
                                  customer response time.
                                </span>
                              </span>

                              <Grid item sx={{ mt: 2 }}>
                                <TextField
                                  value={newPrimaryFStrategy}
                                  onChange={(e) =>
                                    setNewPrimaryFStrategy(e.target.value)
                                  }
                                  multiline
                                  rows={3}
                                  sx={{
                                    width: "100%",
                                    overflowY: "auto",
                                    "& .MuiInputBase-root": {},
                                  }}
                                />
                              </Grid>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap", // Allow buttons to wrap
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={closePrimaryFModal}
                                sx={{ width: 150, color: "#AB3510" }}
                                style={{
                                  background: "white",
                                  border: "1px solid #AB3510",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={async () => {
                                  await handlePrimaryFSave(); //change
                                  fetchPrimaryFinancialStrategies(
                                    department_id
                                  ); //change
                                }}
                                style={{
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  width: 150,
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12}>
                          {primaryFinancialStrategies.map(
                            // Map the fetched primary data directly
                            (strategy: GeneratedSentence, index: number) => (
                              <div
                                key={strategy.id}
                                className={`flex justify-between items-center p-7 m-5 w-auto ${
                                  index % 2 === 0 ? "bg-[#fff6d1]" : "bg-white"
                                }`}
                              >
                                <Typography>{strategy.value}</Typography>
                              </div>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </StyledBox>
                  </Cards>
                  {/* LEARNING PRIMARY */}
                  <Cards sx={{ borderColor: "black", borderWidth: 1, mt: 5 }}>
                    <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        sx={{
                          ml: 1,
                          height: "85px",
                          "& .MuiInputBase-root": { height: "85px" },
                        }}
                      >
                        <Grid item sm={11.3} container alignItems="center">
                          <Box>
                            <img
                              src="/learning.png"
                              alt=""
                              className="h-[5rem]"
                            />
                          </Box>
                          <Box sx={{ ml: 1 }}>
                            <Typography sx={{ fontWeight: "bolder" }}>
                              <span className="text-[#ff7b00d3]">
                                Learning & Growth:
                              </span>{" "}
                              Culture & People Development Overview
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "500" }}
                            >
                              Enhances organizational culture and employee
                              growth.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sm={0.7}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              background: "#ff7b00d3",
                              borderRadius: "50%",
                              width: "3rem",
                              height: "3rem",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                              onClick={openPrimaryLGModal}
                            >
                              <div className="flex flex-row">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-8"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* add modal here */}
                      {isPrimaryLGModalOpen && (
                        <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                          <Box
                            className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                            sx={{
                              width: "60%",
                              height: "85%",
                              maxWidth: "95vw",
                              maxHeight: "95vh",
                              // maxHeight: '100vh',
                            }}
                          >
                            <p className="text-xl font-bold mb-4">
                              Learning & Growth Strategy
                            </p>
                            <div className="flex flex-col mb-1">
                              <Typography sx={{ fontWeight: 800 }}>
                                Target Code
                                <span className="text-[#DD1414]">*</span>
                              </Typography>
                            </div>
                            <TextField
                              variant="outlined"
                              value={newPrimaryLGTargetCode}
                              onChange={(e) =>
                                setNewPrimaryLGTargetCode(e.target.value)
                              }
                              sx={{
                                height: "35px",
                                "& .MuiInputBase-root": { height: "35px" },
                              }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 800, mt: 2 }}>
                                Strategy
                                <span className="text-[#DD1414]">*</span>
                              </Typography>
                              <span className="mb-3">
                                Before inputting a strategy, please follow this
                                format.
                              </span>
                              <span>
                                <br />
                                1. Choose one of the following{" "}
                                <span className="font-bold">
                                  strategic themes
                                </span>
                                :
                              </span>
                              <ul className="list-disc ml-10 mb-2">
                                <li className="font-bold">
                                  Excellence in Service Quality
                                </li>
                                <li className="font-bold">
                                  Excellence in Internal Service Systems
                                </li>
                                <li className="font-bold">
                                  Excellence in Organizational Stewardship
                                </li>
                              </ul>
                              <span>
                                2. After selecting the theme, leave a space and
                                then input the{" "}
                                <span className="font-bold">target code</span>{" "}
                                followed by a colon{" "}
                                <span className="font-bold">(:)</span>
                              </span>
                              <span>
                                <br />
                                3. Finally, write the{" "}
                                <span className="font-bold">strategy.</span>
                              </span>
                              <br />
                              <span>
                                <br />
                                The correct format should be:{" "}
                                <span className="font-bold">
                                  Strategic Theme Target Code: Strategy
                                </span>
                              </span>
                              <span className="font-bold">
                                <br />
                                Example:{" "}
                                <span className="font-bold text-red-500">
                                  Excellence in Service Quality T001: Improve
                                  customer response time.
                                </span>
                              </span>

                              <Grid item sx={{ mt: 2 }}>
                                <TextField
                                  value={newPrimaryLGStrategy}
                                  onChange={(e) =>
                                    setNewPrimaryLGStrategy(e.target.value)
                                  }
                                  multiline
                                  rows={3}
                                  sx={{
                                    width: "100%",
                                    overflowY: "auto",
                                    "& .MuiInputBase-root": {},
                                  }}
                                />
                              </Grid>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={closePrimaryLGModal}
                                sx={{ width: 150, color: "#AB3510" }}
                                style={{
                                  background: "white",
                                  border: "1px solid #AB3510",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={async () => {
                                  await handlePrimaryLGSave(); //change
                                  fetchPrimaryLearningGrowthStrategies(
                                    department_id
                                  ); //change
                                }}
                                style={{
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  width: 150,
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12}>
                          {primaryLearningGrowthStrategies.map(
                            // Map the fetched primary data directly
                            (strategy: GeneratedSentence, index: number) => (
                              <div
                                key={strategy.id}
                                className={`flex justify-between items-center p-7 m-5 w-auto ${
                                  index % 2 === 0 ? "bg-[#fff6d1]" : "bg-white"
                                }`}
                              >
                                <Typography>{strategy.value}</Typography>
                              </div>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </StyledBox>
                  </Cards>

                  {/* INTERNAL PRIMARY */}
                  <Cards sx={{ borderColor: "black", borderWidth: 1, mt: 5 }}>
                    <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        sx={{
                          ml: 1,
                          height: "85px",
                          "& .MuiInputBase-root": { height: "85px" },
                        }}
                      >
                        <Grid item sm={11.3} container alignItems="center">
                          <Box>
                            <img
                              src="/internal.png"
                              alt=""
                              className="h-[5rem]"
                            />
                          </Box>
                          <Box sx={{ ml: 1 }}>
                            <Typography sx={{ fontWeight: "bolder" }}>
                              <span className="text-[#ff7b00d3]">
                                Internal Process:
                              </span>{" "}
                              Process & Technology Overview
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "500" }}
                            >
                              Optimizes and manages internal processes and
                              technology.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sm={0.7}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              background: "#ff7b00d3",
                              borderRadius: "50%",
                              width: "3rem",
                              height: "3rem",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                              onClick={openPrimaryIPModal}
                            >
                              <div className="flex flex-row">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-8"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* add modal here */}
                      {isPrimaryIPModalOpen && (
                        <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                          <Box
                            className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                            sx={{
                              width: "60%",
                              height: "85%",
                              maxWidth: "95vw",
                              maxHeight: "95vh",
                              // maxHeight: '100vh',
                            }}
                          >
                            <p className="text-xl font-bold mb-4">
                              Internal Process Strategy
                            </p>
                            <div className="flex flex-col mb-1">
                              <Typography sx={{ fontWeight: 800 }}>
                                Target Code
                                <span className="text-[#DD1414]">*</span>
                              </Typography>
                            </div>
                            <TextField
                              variant="outlined"
                              value={newPrimaryIPTargetCode}
                              onChange={(e) =>
                                setNewPrimaryIPTargetCode(e.target.value)
                              }
                              sx={{
                                height: "35px",
                                "& .MuiInputBase-root": { height: "35px" },
                              }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 800, mt: 2 }}>
                                Strategy
                                <span className="text-[#DD1414]">*</span>
                              </Typography>
                              <span className="mb-3">
                                Before inputting a strategy, please follow this
                                format.
                              </span>
                              <span>
                                <br />
                                1. Choose one of the following{" "}
                                <span className="font-bold">
                                  strategic themes
                                </span>
                                :
                              </span>
                              <ul className="list-disc ml-10 mb-2">
                                <li className="font-bold">
                                  Excellence in Service Quality
                                </li>
                                <li className="font-bold">
                                  Excellence in Internal Service Systems
                                </li>
                                <li className="font-bold">
                                  Excellence in Organizational Stewardship
                                </li>
                              </ul>
                              <span>
                                2. After selecting the theme, leave a space and
                                then input the{" "}
                                <span className="font-bold">target code</span>{" "}
                                followed by a colon{" "}
                                <span className="font-bold">(:)</span>
                              </span>
                              <span>
                                <br />
                                3. Finally, write the{" "}
                                <span className="font-bold">strategy.</span>
                              </span>
                              <br />
                              <span>
                                <br />
                                The correct format should be:{" "}
                                <span className="font-bold">
                                  Strategic Theme Target Code: Strategy
                                </span>
                              </span>
                              <span className="font-bold">
                                <br />
                                Example:{" "}
                                <span className="font-bold text-red-500">
                                  Excellence in Service Quality T001: Improve
                                  customer response time.
                                </span>
                              </span>

                              <Grid item sx={{ mt: 2 }}>
                                <TextField
                                  value={newPrimaryIPStrategy}
                                  onChange={(e) =>
                                    setNewPrimaryIPStrategy(e.target.value)
                                  }
                                  multiline
                                  rows={3}
                                  sx={{
                                    width: "100%",
                                    overflowY: "auto",
                                    "& .MuiInputBase-root": {},
                                  }}
                                />
                              </Grid>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={closePrimaryIPModal}
                                sx={{ width: 150, color: "#AB3510" }}
                                style={{
                                  background: "white",
                                  border: "1px solid #AB3510",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={async () => {
                                  await handlePrimaryIPSave(); //change
                                  fetchExistingStrategies(department_id); //change
                                }}
                                style={{
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  width: 150,
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12}>
                          {primaryInternalProcessStrategies.map(
                            // Map the fetched primary data directly
                            (strategy: GeneratedSentence, index: number) => (
                              <div
                                key={strategy.id}
                                className={`flex justify-between items-center p-7 m-5 w-auto ${
                                  index % 2 === 0 ? "bg-[#fff6d1]" : "bg-white"
                                }`}
                              >
                                <Typography>{strategy.value}</Typography>
                              </div>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </StyledBox>
                  </Cards>

                  {/* STAKEHOLDER PRIMARY */}
                  <Cards sx={{ borderColor: "black", borderWidth: 1, mt: 5 }}>
                    <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        sx={{
                          ml: 1,
                          height: "85px",
                          "& .MuiInputBase-root": { height: "85px" },
                        }}
                      >
                        <Grid item sm={11.3} container alignItems="center">
                          <Box>
                            <img
                              src="/stakeholder.png"
                              alt=""
                              className="h-[5rem]"
                            />
                          </Box>
                          <Box sx={{ ml: 1 }}>
                            <Typography sx={{ fontWeight: "bolder" }}>
                              <span className="text-[#ff7b00d3]">
                                Stakeholder:
                              </span>{" "}
                              Client Relationship Overview
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "500" }}
                            >
                              Measures client engagement quality and value.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sm={0.7}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              background: "#ff7b00d3",
                              borderRadius: "50%",
                              width: "3rem",
                              height: "3rem",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                              onClick={openPrimarySModal}
                            >
                              <div className="flex flex-row">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-8"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* add modal here */}
                      {isPrimarySModalOpen && (
                        <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                          <Box
                            className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                            sx={{
                              width: "60%",
                              height: "85%",
                              maxWidth: "95vw",
                              maxHeight: "95vh",
                              // maxHeight: '100vh',
                            }}
                          >
                            <p className="text-xl font-bold mb-4">
                              Stakeholder Strategy
                            </p>
                            <div className="flex flex-col mb-1">
                              <Typography sx={{ fontWeight: 800 }}>
                                Target Code
                                <span className="text-[#DD1414]">*</span>
                              </Typography>
                            </div>
                            <TextField
                              variant="outlined"
                              value={newPrimarySTargetCode}
                              onChange={(e) =>
                                setNewPrimarySTargetCode(e.target.value)
                              }
                              sx={{
                                height: "35px",
                                "& .MuiInputBase-root": { height: "35px" },
                              }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 800, mt: 2 }}>
                                Strategy
                                <span className="text-[#DD1414]">*</span>
                              </Typography>
                              <span className="mb-3">
                                Before inputting a strategy, please follow this
                                format.
                              </span>
                              <span>
                                <br />
                                1. Choose one of the following{" "}
                                <span className="font-bold">
                                  strategic themes
                                </span>
                                :
                              </span>
                              <ul className="list-disc ml-10 mb-2">
                                <li className="font-bold">
                                  Excellence in Service Quality
                                </li>
                                <li className="font-bold">
                                  Excellence in Internal Service Systems
                                </li>
                                <li className="font-bold">
                                  Excellence in Organizational Stewardship
                                </li>
                              </ul>
                              <span>
                                2. After selecting the theme, leave a space and
                                then input the{" "}
                                <span className="font-bold">target code</span>{" "}
                                followed by a colon{" "}
                                <span className="font-bold">(:)</span>
                              </span>
                              <span>
                                <br />
                                3. Finally, write the{" "}
                                <span className="font-bold">strategy.</span>
                              </span>
                              <br />
                              <span>
                                <br />
                                The correct format should be:{" "}
                                <span className="font-bold">
                                  Strategic Theme Target Code: Strategy
                                </span>
                              </span>
                              <span className="font-bold">
                                <br />
                                Example:{" "}
                                <span className="font-bold text-red-500">
                                  Excellence in Service Quality T001: Improve
                                  customer response time.
                                </span>
                              </span>

                              <Grid item sx={{ mt: 2 }}>
                                <TextField
                                  value={newPrimarySStrategy}
                                  onChange={(e) =>
                                    setNewPrimarySStrategy(e.target.value)
                                  }
                                  multiline
                                  rows={3}
                                  sx={{
                                    width: "100%",
                                    overflowY: "auto",
                                    "& .MuiInputBase-root": {},
                                  }}
                                />
                              </Grid>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={closePrimarySModal}
                                sx={{ width: 150, color: "#AB3510" }}
                                style={{
                                  background: "white",
                                  border: "1px solid #AB3510",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={async () => {
                                  await handlePrimarySSave(); //change
                                  fetchExistingStrategies(department_id); //change
                                }}
                                style={{
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  width: 150,
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12}>
                          {primaryStakeholderStrategies.map(
                            // Map the fetched primary data directly
                            (strategy: GeneratedSentence, index: number) => (
                              <div
                                key={strategy.id}
                                className={`flex justify-between items-center p-7 m-5 w-auto ${
                                  index % 2 === 0 ? "bg-[#fff6d1]" : "bg-white"
                                }`}
                              >
                                <Typography>{strategy.value}</Typography>
                              </div>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </StyledBox>
                  </Cards>
                </>
              )}
              {currentView === "secondary" && (
                <>
                  {/* ADD DROPDOWN HERE */}
                  <Box sx={{ display: "flex", alignItems: "center", mt: -2 }}>
                    <select
                      id="departmentSelect"
                      className="border border-gray-200 shadow-sm rounded-xl mb-8 px-3 py-2 w-full md:w-[full] h-[4rem]"
                      onChange={handleDepartmentChange}
                    >
                      <option value="">Select a department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.department_name}
                        </option>
                      ))}
                    </select>
                  </Box>
                  {/* ADD !SELECTED DEP HERE */}
                  {!selectedDepartment && (
                    <div className="items-center align-middle mt-10 justify-center text-center">
                      <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[97%] h-auto md:h-[30rem]">
                        <div className="flex flex-col mt-28">
                          <span className="font-bold text-2xl md:text-[3rem] text-gray-300 text-center">
                            Please Select a Department
                          </span>
                          <span className="font-medium mt-5 text-base md:text-[1.3rem] text-gray-300">
                            Please select a department from the dropdown menu
                            <br /> to view the mapped strategies.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedDepartment && (
                    <>
                      <Cards>
                        <StyledBox
                          sx={{ background: "white", borderRadius: 2 }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            sx={{
                              ml: 1,
                              height: "85px",
                              "& .MuiInputBase-root": { height: "85px" },
                            }}
                          >
                            <Grid item sm={11.3} container alignItems="center">
                              <Box>
                                <img
                                  src="/financial.png"
                                  alt=""
                                  className="h-[5rem]"
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
                                <Typography sx={{ fontWeight: "bolder" }}>
                                  <span className="text-[#ff7b00d3]">
                                    Financial:
                                  </span>{" "}
                                  Stewardship Overview
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "500" }}
                                >
                                  Measures financial performance and
                                  profitability.
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            justifyContent="space-between"
                          >
                            <Grid item xs={12}>
                              {strategies.financial.length > 0 ? (
                                <>
                                  {strategies.financial.map(
                                    (
                                      strategy: GeneratedSentence,
                                      index: number
                                    ) => (
                                      <div
                                        key={strategy.id}
                                        className={`flex justify-between items-center p-5 m-5 w-auto ${
                                          index % 2 === 0
                                            ? "bg-[#fff6d1]"
                                            : "bg-white"
                                        }`}
                                      >
                                        <Typography>
                                          {strategy.value}
                                        </Typography>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="items-center align-middle justify-center text-center">
                                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[100%] h-auto md:h-[30rem]">
                                    <div className="flex flex-col mt-28">
                                      <span className="font-bold text-2xl md:text-[3rem] text-gray-300 text-center">
                                        No strategies exist for this
                                        perspective... yet.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </StyledBox>
                      </Cards>

                      <Cards sx={{ mt: 5 }}>
                        <StyledBox
                          sx={{ background: "white", borderRadius: 2 }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            sx={{
                              ml: 1,
                              height: "85px",
                              "& .MuiInputBase-root": { height: "85px" },
                            }}
                          >
                            <Grid item sm={11.3} container alignItems="center">
                              <Box>
                                <img
                                  src="/learning.png"
                                  alt=""
                                  className="h-[5rem]"
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
                                <Typography sx={{ fontWeight: "bolder" }}>
                                  <span className="text-[#ff7b00d3]">
                                    Learning & Growth:
                                  </span>{" "}
                                  Culture & People Development Overview
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "500" }}
                                >
                                  Enhances organizational culture and employee
                                  growth.
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            justifyContent="space-between"
                          >
                            <Grid item xs={12}>
                              {strategies.learningGrowth.length > 0 ? (
                                <>
                                  {strategies.learningGrowth.map(
                                    (
                                      strategy: GeneratedSentence,
                                      index: number
                                    ) => (
                                      <div
                                        key={strategy.id}
                                        className={`flex justify-between items-center p-5 m-5 w-auto ${
                                          index % 2 === 0
                                            ? "bg-[#fff6d1]"
                                            : "bg-white"
                                        }`}
                                      >
                                        <Typography>
                                          {strategy.value}
                                        </Typography>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="items-center align-middle justify-center text-center">
                                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[100%] h-auto md:h-[30rem]">
                                    <div className="flex flex-col mt-28">
                                      <span className="font-bold text-2xl md:text-[3rem] text-gray-300 text-center">
                                        No strategies exist for this
                                        perspective... yet.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </StyledBox>
                      </Cards>

                      <Cards sx={{ mt: 5 }}>
                        <StyledBox
                          sx={{ background: "white", borderRadius: 2 }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            sx={{
                              ml: 1,
                              height: "85px",
                              "& .MuiInputBase-root": { height: "85px" },
                            }}
                          >
                            <Grid item sm={11.3} container alignItems="center">
                              <Box>
                                <img
                                  src="/internal.png"
                                  alt=""
                                  className="h-[5rem]"
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
                                <Typography sx={{ fontWeight: "bolder" }}>
                                  <span className="text-[#ff7b00d3]">
                                    Internal Process:
                                  </span>{" "}
                                  Process & Technology Overview
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "500" }}
                                >
                                  Optimizes and manages internal processes and
                                  technology.
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            justifyContent="space-between"
                          >
                            <Grid item xs={12}>
                              {strategies.internalProcess.length > 0 ? (
                                <>
                                  {strategies.internalProcess.map(
                                    (
                                      strategy: GeneratedSentence,
                                      index: number
                                    ) => (
                                      <div
                                        key={strategy.id}
                                        className={`flex justify-between items-center p-5 m-5 w-auto ${
                                          index % 2 === 0
                                            ? "bg-[#fff6d1]"
                                            : "bg-white"
                                        }`}
                                      >
                                        <Typography>
                                          {strategy.value}
                                        </Typography>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="items-center align-middle justify-center text-center">
                                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[100%] h-auto md:h-[30rem]">
                                    <div className="flex flex-col mt-28">
                                      <span className="font-bold text-2xl md:text-[3rem] text-gray-300 text-center">
                                        No strategies exist for this
                                        perspective... yet.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </StyledBox>
                      </Cards>

                      <Cards sx={{ mt: 5 }}>
                        <StyledBox
                          sx={{ background: "white", borderRadius: 2 }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            sx={{
                              ml: 1,
                              height: "85px",
                              "& .MuiInputBase-root": { height: "85px" },
                            }}
                          >
                            <Grid item sm={11.3} container alignItems="center">
                              <Box>
                                <img
                                  src="/stakeholder.png"
                                  alt=""
                                  className="h-[5rem]"
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
                                <Typography sx={{ fontWeight: "bolder" }}>
                                  <span className="text-[#ff7b00d3]">
                                    Stakeholder:
                                  </span>{" "}
                                  Client Relationship Overview
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "500" }}
                                >
                                  Measures client engagement quality and value.
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            justifyContent="space-between"
                          >
                            <Grid item xs={12}>
                              {strategies.stakeholder.length > 0 ? (
                                <>
                                  {strategies.stakeholder.map(
                                    (
                                      strategy: GeneratedSentence,
                                      index: number
                                    ) => (
                                      <div
                                        key={strategy.id}
                                        className={`flex justify-between items-center p-5 m-5 w-auto ${
                                          index % 2 === 0
                                            ? "bg-[#fff6d1]"
                                            : "bg-white"
                                        }`}
                                      >
                                        <Typography>
                                          {strategy.value}
                                        </Typography>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="items-center align-middle justify-center text-center">
                                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[100%] h-auto md:h-[30rem]">
                                    <div className="flex flex-col mt-28">
                                      <span className="font-bold text-2xl md:text-[3rem] text-gray-300 text-center">
                                        No strategies exist for this
                                        perspective... yet.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </StyledBox>
                      </Cards>

                      {/* end here */}
                    </>
                  )}
                </>
              )}
            </Box>
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
}
