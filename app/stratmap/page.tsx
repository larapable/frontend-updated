"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbars/Navbar";
import { useSession } from "next-auth/react";

import {
  Box,
  Typography,
  TextField,
  Divider,
  Grid,
  Button,
  Modal,
} from "@mui/material";
import styled from "@emotion/styled";
import Image from "next/image";
import { SelectChangeEvent } from "@mui/material/Select";
import SpinnerPages from "../components/Misc/SpinnerPages";
import "@/app/page.css";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";

const drawerWidth = 310;

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
  height: "100%",
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

const Page = () => {
  const { data: session } = useSession();
  const [selectedComponent, setSelectedComponent] = useState("");
  const [currentView, setCurrentView] = useState("primary");
  const [hasPrimaryStrats, setHasPrimaryStrats] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const currentYear = new Date().getFullYear();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  const role = user?.role;
  const username = user?.username;

  useEffect(() => {
    const lastComponent = localStorage.getItem("lastComponent");
    if (lastComponent) {
      setSelectedComponent(lastComponent);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/byDepartment/${department_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Update the strategies state
        setStrategies({
          financial: data.financial.map((item: any) => ({
            id: 1,
            fID: item.id, // fID should be present in the response or calculated
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
        });
      } catch (error) {
        console.error("Error fetching existing strategies:", error);
      }
    };

    fetchData();
  }, [department_id, selectedComponent]);

  useEffect(() => {
    let isMounted = true;

    const postToPrimaryStrategies = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getHasPrimaryStrats/${department_id}`
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
              targetYear: currentYear,
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.1: 90% average awareness rate of the services",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.2: 90% of eligible employees availed of the services of the administrative and academic support offices",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.3: At least 4.5 (out of 5.0) inter-office customer satisfaction",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.1: Have at least 4-star (out of 5) customer service rating",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.2: Have at least 9-star (out of 10) net promoter score",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.3: 90% transanctions resolved or answered customer query within expected time",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A4.1: 100% of the office systems standardized and documented",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A4.2: 100% of process records meet its requirements",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A5.1: 100% awareness of the existence of the University Brand Bible and of its guidelines and templates",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A5.2: 100% compliance to the branding guidelines in their instructional, operational and communication materials",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.1: 100% awareness of the existence of the 5S+ Program",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.2: 100% participation in the orientation/re-orientation of 5S+ training",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.3: 100% compliance of the 5S+ standard",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.1: At least 90% participation in CIT-sponsored events",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.2: At least 90% participation in CIT-sponsored trainings, seminars, workshops, and conferences",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.3: At least 90% participation in CIT-commissioned surveys, FGDs, etc.",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.1: 100% of admin staff are evaluated on time",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.2: 100% completed the Competence & Competency Matrix (CCM), training & development needs analysis (TDNA), and professional development plan",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.3: 50% of admin staff are involved in research work",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.4: 100% of staff are ranked",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.5: 100% submission of succession plan",
              department: { id: department_id },
              targetYear: currentYear,
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.6: 100% of staff have 1 community involvement activity per year",
              department: { id: department_id },
              targetYear: currentYear,
            },
          ];

          // Post each strategy individually
          const postPromises = primaryStrategiesData.map(
            async (strategyData) => {
              const endpoint = `${
                process.env.NEXT_PUBLIC_BACKEND_URL
              }/stratmap/primary${
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
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/update/primaryStrats/${department_id}`,
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

    fetchProfileGoals();
    fetchExistingStrategies(department_id);

    type Perspective = "Financial" | "Stakeholder" | "Internal" | "Learning";

    const fetchFunctions: Record<
      Perspective,
      (department_id: number) => Promise<void>
    > = {
      Financial: fetchPrimaryFinancialStrategies,
      Stakeholder: fetchPrimaryStakeholderStrategies,
      Internal: fetchPrimaryInternalProcessStrategies,
      Learning: fetchPrimaryLearningGrowthStrategies,
    };

    // Fetch data only if in primary view and component is valid
    if (
      currentView === "primary" &&
      (selectedComponent as Perspective) in fetchFunctions
    ) {
      fetchFunctions[selectedComponent as Perspective](department_id);
    }
  }, [session, currentView, selectedComponent, hasPrimaryStrats]);

  interface GeneratedSentence {
    id: number;
    fID: number;
    value: string;
    code?: string | number;
  }

  interface StrategyCategories {
    financial: GeneratedSentence[];
    stakeholder: GeneratedSentence[];
    internalProcess: GeneratedSentence[];
    learningGrowth: GeneratedSentence[];
  }

  // for vision values mission
  const [editingStrategy, setEditingStrategy] = useState(null);
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
  const [strategyToDelete, setStrategyToDelete] =
    useState<GeneratedSentence | null>(null);

  const handleDeleteClick = (strategy: GeneratedSentence) => {
    setStrategyToDelete(strategy);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setStrategyToDelete(null); // Close the dialog without deleting
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (strategyToDelete) {
      switch (strategyToDelete.id) {
        case 1:
          await handleFinancialDelete(strategyToDelete.fID);
          break;
        case 2:
          await handleStakeholderDelete(strategyToDelete.fID);
          break;
        case 3:
          await handleInternalDelete(strategyToDelete.fID);
          break;
        case 4:
          await handleLGDelete(strategyToDelete.fID);
          break;
      }
      setStrategyToDelete(null); // Close the dialog after deleting
    }
  };

  // @ts-ignore
  const handleEditClick = (strategy) => {
    setEditingStrategy(strategy);
    setNewStrategyValue(strategy.value);
  };

  const handleButtonClick = (department_id: number) => {
    setShowWarning(true);
  };

  const handleConfirmSort = async (department_id: number) => {
    setShowWarning(false); // Close the warning dialog
    setIsButtonDisabled(true);

    fetchAllData(department_id);
  };

  const handleCancelClear = () => {
    setShowWarning(false); // Close the warning dialog without clearing tables
  };

  const [strategies, setStrategies] = useState<StrategyCategories>({
    financial: [],
    stakeholder: [],
    internalProcess: [],
    learningGrowth: [],
  });

  const handleFinancialSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number
  ) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/financial/edit/${fID}`,
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
      const updatedStrategy = result;

      setStrategies((prevStrategies) => {
        const newStrategies = { ...prevStrategies };

        const updatedFinancial = newStrategies.financial.map((strategy) => {
          if (strategy.fID === fID) {
            return { ...strategy, value: updatedStrategy.office_target };
          }
          return strategy;
        });

        return {
          ...newStrategies,
          financial: updatedFinancial,
        };
      });

      fetchExistingStrategies(department_id);
    } catch (error) {
      console.error("An error occurred while updating the strategy:", error);
    }
  };

  const handleLearningGrowthSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number
  ) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/learning/edit/${fID}`,
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
      const updatedStrategy = result;

      setStrategies((prevStrategies) => {
        const newStrategies = { ...prevStrategies };

        const updatedlearningGrowth = newStrategies.learningGrowth.map(
          (strategy) => {
            if (strategy.fID === fID) {
              return { ...strategy, value: updatedStrategy.office_target };
            }
            return strategy;
          }
        );

        return {
          ...newStrategies,
          learningGrowth: updatedlearningGrowth,
        };
      });

      fetchExistingStrategies(department_id);
    } catch (error) {
      console.error("An error occurred while updating the strategy:", error);
    }
  };

  const handleStakeholderSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number
  ) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/stakeholder/edit/${fID}`,
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
      const updatedStrategy = result;
      setStrategies((prevStrategies) => {
        const newStrategies = { ...prevStrategies };

        const updatedStakeholder = newStrategies.stakeholder.map((strategy) => {
          if (strategy.fID === fID) {
            return { ...strategy, value: updatedStrategy.office_target };
          }
          return strategy;
        });

        return {
          ...newStrategies,
          stakeholder: updatedStakeholder,
        };
      });

      fetchExistingStrategies(department_id);
    } catch (error) {
      console.error("An error occurred while updating the strategy:", error);
    }
  };

  const handleInternalProcessSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number
  ) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/internal/edit/${fID}`,
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
      const updatedStrategy = result;

      setStrategies((prevStrategies) => {
        const newStrategies = { ...prevStrategies };

        const updatedInternalProcess = newStrategies.internalProcess.map(
          (strategy) => {
            if (strategy.fID === fID) {
              return { ...strategy, value: updatedStrategy.office_target };
            }
            return strategy;
          }
        );

        return {
          ...newStrategies,
          internalProcess: updatedInternalProcess,
        };
      });

      fetchExistingStrategies(department_id);
    } catch (error) {
      console.error("An error occurred while updating the strategy:", error);
    }
  };

  const API_ENDPOINTS = [
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/stStrat/getNonSorted/${department_id}`,
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/soStrat/getNonSorted/${department_id}`,
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/wtStrat/getNonSorted/${department_id}`,
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/woStrat/getNonSorted/${department_id}`,
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

  const fetchProfileGoals = async () => {
    console.log("Fetching profile goals...");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/goals/get/department/${department_id}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Received data:", data);

        // Update all states related to profile goals
        setOfficeVision(data.vision);
        setValueProposition(data.proposition);
        setMission(data.mission);

        // Update the system prompt with fetched data
        const fetchedData = `
            Office Vision: ${data.vision}
            Value Proposition: ${data.proposition}
          `;
        const updatedSystemPrompt = `${SYSTEM_PROMPT}\n${fetchedData}`;
        console.log("Updated System Prompt:", updatedSystemPrompt);
      } else {
        console.error("Error fetching user profile data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY_2}`;

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
        targetYear: currentYear,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/financial/insert`,
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

  // Primary financial
  const [isPrimaryFModalOpen, setIsPrimaryFModalOpen] = useState(false);
  const [newPrimaryFStrategy, setNewPrimaryFStrategy] = useState("");
  const [newPrimaryFTargetCode, setNewPrimaryFTargetCode] = useState("");

  // Primary stakeholder
  const [isPrimarySModalOpen, setIsPrimarySModalOpen] = useState(false);
  const [newPrimarySStrategy, setNewPrimarySStrategy] = useState("");
  const [newPrimarySTargetCode, setNewPrimarySTargetCode] = useState("");

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
        targetYear: currentYear,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/stakeholder/insert`,
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
        targetYear: currentYear,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/internal/insert`,
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
        targetYear: currentYear,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/learning/insert`,
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

  const fetchDataAndCategorize = async (
    apiEndpoint: string,
    department_id: number
  ) => {
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        if (response.status === 404) {
          // If all apiEndpoints 404, throw an error to be caught later
          throw new Error("No data found at API endpoint.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
        generatedSentences.map(async (sentence) => {
          const match = sentence.match(
            /^(\d+)\.\s*(.*?)\s*([SW]\d+[TO]\d+|[WO]\d+[WT]\d+)?:\s*(.*)$/
          );

          if (match) {
            const [, idStr, strategicTheme, code, content] = match;
            const id = parseInt(idStr, 10);
            const fID = id;

            return {
              code,
              id,
              fID, // No longer using fID
              value: `${strategicTheme} ${code}: ${content}`,
            };
          } else {
            console.warn("Invalid sentence format:", sentence);
            return { id: -1, fID: -1, value: sentence };
          }
        })
      );

      //@ts-ignore
      const dataWithTypes = data.map((row) => {
        if (row.s_tResponses) {
          return { ...row, type: "st" };
        } else if (row.s_oResponses) {
          return { ...row, type: "so" };
        } else if (row.w_tResponses) {
          return { ...row, type: "wt" };
        } else if (row.w_oResponses) {
          return { ...row, type: "wo" };
        } else {
          console.warn("Unable to determine row type:", row);
          return row;
        }
      });

      for (const row of dataWithTypes) {
        const rowId = row.id;
        const updateEndpoint = getUpdateEndpoint(row);

        if (updateEndpoint && row.sorted == 0) {
          // Only send PUT if an endpoint was generated
          try {
            const updateResponse = await fetch(updateEndpoint, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sorted: 1 }),
            });

            if (!updateResponse.ok) {
              console.error(
                `Error updating row with id ${rowId} at ${updateEndpoint}:`,
                updateResponse.statusText
              );
            } else {
              console.log(
                `Successfully updated row with id ${rowId} at ${updateEndpoint}`
              );
            }
          } catch (error) {
            console.error(
              `Error updating row with id ${rowId} at ${updateEndpoint}:`,
              error
            );
          }
        }
      }

      return categorizedSentences;
    } catch (error) {
      console.error(
        `Error fetching data or processing Gemini response for ${apiEndpoint}:`,
        error
      );
      return [];
    }
  };

  const getUpdateEndpoint = (row: any): string => {
    if (row.type === "st") {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/stStrat/updateSorted/${row.id}`;
    } else if (row.type === "so") {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/soStrat/updateSorted/${row.id}`;
    } else if (row.type === "wt") {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/wtStrat/updateSorted/${row.id}`;
    } else if (row.type === "wo") {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/woStrat/updateSorted/${row.id}`;
    } else {
      console.warn("Unknown row type:", row);
      return "";
    }
  };

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
      // Financial entity (with frontend check)
      const processedFinancial = new Set();
      const financialPromises = strategies.financial.map((sentence) => {
        if (processedFinancial.has(sentence.value)) {
          return Promise.resolve();
        }
        processedFinancial.add(sentence.value);

        const data = {
          office_target: sentence.value,
          department: { id: department_id },
          targetYear: currentYear,
          //@ts-ignore
          target_code: sentence.code,
        };
        console.log("financial data: ", data);
        return fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/financial/insert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      });
      await Promise.all(financialPromises);

      // Stakeholder entity (with frontend check)
      const processedStakeholder = new Set();
      const stakeholderPromises = strategies.stakeholder.map((sentence) => {
        if (processedStakeholder.has(sentence.value)) {
          return Promise.resolve();
        }
        processedStakeholder.add(sentence.value);

        const data = {
          office_target: sentence.value,
          department: { id: department_id },
          targetYear: currentYear,
          //@ts-ignore
          target_code: sentence.code,
        };
        return fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/stakeholder/insert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      });
      await Promise.all(stakeholderPromises);

      // Internal process entity (with frontend check)
      const processedInternalProcess = new Set();
      const internalProcessPromises = strategies.internalProcess.map(
        (sentence) => {
          if (processedInternalProcess.has(sentence.value)) {
            return Promise.resolve();
          }
          processedInternalProcess.add(sentence.value);

          const data = {
            office_target: sentence.value,
            department: { id: department_id },
            targetYear: currentYear,
            //@ts-ignore
            target_code: sentence.code,
          };
          return fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/internal/insert`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
        }
      );
      await Promise.all(internalProcessPromises);

      // Learning and growth entity (with frontend check)
      const processedLearningGrowth = new Set();
      const learningGrowthPromises = strategies.learningGrowth.map(
        (sentence) => {
          if (processedLearningGrowth.has(sentence.value)) {
            return Promise.resolve();
          }
          processedLearningGrowth.add(sentence.value);

          const data = {
            office_target: sentence.value,
            department: { id: department_id },
            targetYear: currentYear,
            //@ts-ignore
            target_code: sentence.code,
          };
          return fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/learning/insert`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
        }
      );
      await Promise.all(learningGrowthPromises);

      console.log("Data saved to database");
    } catch (error) {
      console.error("Error saving data to database:", error);
    } finally {
      try {
        await fetchExistingStrategies(department_id);
        setIsButtonDisabled(false);
      } catch (error) {
        console.error("Error in sorting or saving:", error);
        setIsButtonDisabled(false);
      }
    }
  };

  const fetchAllData = async (department_id: number) => {
    const newStrategies = {
      financial: [] as GeneratedSentence[],
      stakeholder: [] as GeneratedSentence[],
      internalProcess: [] as GeneratedSentence[],
      learningGrowth: [] as GeneratedSentence[],
    };

    for (const apiEndpoint of API_ENDPOINTS) {
      const categorizedSentences = await fetchDataAndCategorize(
        apiEndpoint,
        department_id
      );

      // Process the categorizedSentences for each API endpoint (e.g., organize them into strategies)
      for (const sentence of categorizedSentences) {
        switch (sentence.id) {
          case 1:
            newStrategies.financial.push(sentence);
            break;
          case 2:
            newStrategies.stakeholder.push(sentence);
            break;
          case 3:
            newStrategies.internalProcess.push(sentence);
            break;
          case 4:
            newStrategies.learningGrowth.push(sentence);
            break;
        }
      }
    }

    setStrategies(newStrategies);
    await saveToDatabase(newStrategies, department_id);
  };

  const fetchPrimaryFinancialStrategies = async (department_id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryFinancial/get/${department_id}` // Assuming this is your API endpoint
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryStakeholder/get/${department_id}` // Assuming this is your API endpoint
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryInternal/get/${department_id}` // Assuming this is your API endpoint
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryLearning/get/${department_id}` // Assuming this is your API endpoint
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

  const fetchExistingStrategies = async (
    department_id: number
  ): Promise<{
    financial: GeneratedSentence[];
    stakeholder: GeneratedSentence[];
    internalProcess: GeneratedSentence[];
    learningGrowth: GeneratedSentence[];
  }> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/byDepartment/${department_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("datahhhhhhh: ", data);

      const currentYear = new Date().getFullYear().toString();

      const strategies = {
        financial: data.financial
          .filter((item: any) => item.targetYear === currentYear)
          .map((item: any) => ({
            id: 1,
            fID: item.id,
            value: item.office_target,
          })),

        stakeholder: data.stakeholder
          .filter((item: any) => item.targetYear === currentYear)
          .map((item: any) => ({
            id: 2,
            fID: item.id,
            value: item.office_target,
          })),
        internalProcess: data.internalProcess
          .filter((item: any) => item.targetYear === currentYear)
          .map((item: any) => ({
            id: 3,
            fID: item.id,
            value: item.office_target,
          })),
        learningGrowth: data.learningGrowth
          .filter((item: any) => item.targetYear === currentYear)
          .map((item: any) => ({
            id: 4,
            fID: item.id,
            value: item.office_target,
          })),
      };

      console.log("Existing strategies:", strategies);
      return strategies;
    } catch (error) {
      console.error("Error fetching existing strategies:", error);
      return {
        financial: [],
        stakeholder: [],
        internalProcess: [],
        learningGrowth: [],
      }; // Return empty object on error
    }
  };

  const handleFinancialDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/financial/delete/${id}`,
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
  };

  const handleLGDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/learning/delete/${id}`,
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
  };

  const handleStakeholderDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/stakeholder/delete/${id}`,
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
  };

  const handleInternalDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/internal/delete/${id}`,
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
  };

  const changeComponent = (componentName: string) => {
    localStorage.setItem("lastComponent", componentName);
    setSelectedComponent(componentName);
  };

  const [officeVision, setOfficeVision] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [mission, setMission] = useState("");

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
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontSize: { xs: "2rem", sm: "3.5rem" },
                }}
              >
                STRATEGY MAPPING
              </Typography>
            </Grid>
            {/* SORT BUTTON HERE */}

            {/* TOGGLE BUTTON HERE */}
            <Grid item>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="auto"
                height="4rem"
                borderRadius={2}
                sx={{ gap: 1, p: 1, borderWidth: 0.5, mt: -2 }}
              >
                <Button
                  onClick={() => setCurrentView("primary")}
                  variant={currentView === "primary" ? "contained" : "outlined"}
                  fullWidth
                  sx={{
                    p: 3,
                    fontSize: "18px",
                    background:
                      currentView === "primary"
                        ? "linear-gradient(to left, #8a252c, #AB3510)"
                        : "transparent",
                    color: currentView === "primary" ? "white" : "#AB3510",
                    flexGrow: 2,
                    height: "100%",
                    border: "1px solid transparent",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      background: "linear-gradient(to left, #8a252c, #AB3510)",
                      color: "white",
                      border:
                        currentView === "primary"
                          ? "none"
                          : "0.5px solid #AB3510",
                    },
                  }}
                >
                  PRIMARY
                </Button>
                <Button
                  onClick={() => setCurrentView("secondary")}
                  variant={
                    currentView === "secondary" ? "contained" : "outlined"
                  }
                  fullWidth
                  sx={{
                    p: 3,
                    fontSize: "18px",
                    background:
                      currentView === "secondary"
                        ? "linear-gradient(to left, #8a252c, #AB3510)"
                        : "transparent",
                    color: currentView === "secondary" ? "white" : "#AB3510",
                    flexGrow: 2, // Ensure both buttons have equal size
                    height: "100%", // Match the height of the container
                    border: "1px solid transparent", // Keep border style consistent
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                    "&:hover": {
                      background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                      color: "white", // Change text color on hover
                      border:
                        currentView === "secondary"
                          ? "none"
                          : "0.5px solid #AB3510", // Border on hover if not current
                    },
                  }}
                >
                  SECONDARY
                </Button>
              </Box>
            </Grid>

            <Typography variant="h5">
              The Strategy Mapping feature uses AI to automatically generate
              strategies based on your inputs from four key perspectives:
              Financial, Stakeholder, Internal Processes, and Learning & Growth.
              This ensures a well-rounded approach to achieving your goals.
            </Typography>
          </Grid>

          <StyledBox
            sx={{ flex: 1, background: "white", borderRadius: 2, mt: 5 }}
          >
            <div className="flex gap-5">
              <div
                className="w-1/3 p-4 bg-white rounded-lg shadow-md overflow-y-auto"
                style={{
                  maxHeight: "200px",
                  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                  borderColor: "#e9e8e8",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", padding: 3 }}
                >
                  <div
                    style={{
                      top: 0,
                      left: 0, // Move to the left edge
                      height: "60px", // Adjust height to match "Vision" text height
                      width: "8px",
                      backgroundColor: "#A43214",
                      marginRight: 10,
                      borderRadius: 5,
                      marginBottom: 5,
                    }}
                  ></div>
                  <div className="flex flex-col">
                    <Typography variant="h5" sx={{ fontWeight: "600" }}>
                      Vision
                    </Typography>
                    <Typography variant="h6">
                      Define what you hope to achieve.
                    </Typography>
                  </div>
                </div>
                <Divider />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {officeVision}
                </Typography>
              </div>
              <div
                className="w-1/3 p-4 bg-white rounded-lg shadow-md overflow-y-auto"
                style={{
                  maxHeight: "200px",
                  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                  borderColor: "#e9e8e8",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      top: 0,
                      left: 0, // Move to the left edge
                      height: "60px", // Adjust height to match "Vision" text height
                      width: "8px",
                      backgroundColor: "#A43214",
                      marginRight: 10,
                      borderRadius: 5,
                      marginBottom: 5,
                    }}
                  ></div>
                  <div className="flex flex-col">
                    <Typography variant="h5" sx={{ fontWeight: "600" }}>
                      Value
                    </Typography>
                    <Typography variant="h6">
                      Define what makes you unique.
                    </Typography>
                  </div>
                </div>
                <Divider />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {valueProposition}
                </Typography>
              </div>
              <div
                className="w-1/3 p-4 bg-white rounded-lg shadow-md overflow-y-auto"
                style={{
                  maxHeight: "200px",
                  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                  borderColor: "#e9e8e8",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      top: 0,
                      left: 0, // Move to the left edge
                      height: "60px", // Adjust height to match "Vision" text height
                      width: "8px",
                      backgroundColor: "#A43214",
                      marginRight: 10,
                      borderRadius: 5,
                      marginBottom: 5,
                    }}
                  ></div>
                  <div className="flex flex-col">
                    <Typography variant="h5" sx={{ fontWeight: "600" }}>
                      Mission
                    </Typography>
                    <Typography variant="h6">Define your purpose.</Typography>
                  </div>
                </div>
                <Divider />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {mission}
                </Typography>
              </div>
            </div>
          </StyledBox>

          <Grid container sx={{ mt: 5 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="4rem"
              borderRadius={2}
              sx={{ gap: 1, p: 0.5, borderWidth: 0.5, mt: 2, mb: 1 }}
            >
              <Grid item xs={12} sx={{ height: "15px", mt: -5, gap: 1 }}>
                <Button
                  onClick={() => changeComponent("Financial")}
                  sx={{
                    mr: 1,
                    p: 3,
                    fontSize: "18px",
                    bgcolor:
                      selectedComponent === "Financial"
                        ? "#A43214"
                        : "transparent",
                    color:
                      selectedComponent === "Financial" ? "white" : "#A43214",
                    fontWeight: "bold",
                    height: "100%", // Match the height of the container
                    border: "1px solid transparent", // Keep border style consistent
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                    "&:hover": {
                      bgcolor: "#A43214", // Change background on hover
                      color: "white", // Change text color on hover
                      border:
                        selectedComponent === "Financial"
                          ? "none"
                          : "0.5px solid #A43214", // Border on hover if not current
                    },
                    paddingX: 4,
                    paddingY: 3,
                    borderRadius: 2,
                  }}
                >
                  Financial
                </Button>
                <Button
                  onClick={() => changeComponent("Stakeholder")}
                  sx={{
                    mr: 1,
                    p: 3,
                    fontSize: "18px",
                    bgcolor:
                      selectedComponent === "Stakeholder"
                        ? "#A43214"
                        : "transparent",
                    color:
                      selectedComponent === "Stakeholder" ? "white" : "#A43214",
                    fontWeight: "bold",
                    height: "100%", // Match the height of the container
                    border: "1px solid transparent", // Keep border style consistent
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                    "&:hover": {
                      bgcolor: "#A43214", // Change background on hover
                      color: "white", // Change text color on hover
                      border:
                        selectedComponent === "Stakeholder"
                          ? "none"
                          : "0.5px solid #A43214", // Border on hover if not current
                    },
                    paddingX: 4,
                    paddingY: 3,
                    borderRadius: 2,
                  }}
                >
                  Stakeholder
                </Button>
                <Button
                  onClick={() => changeComponent("Internal")}
                  sx={{
                    mr: 1,
                    p: 3,
                    fontSize: "18px",
                    bgcolor:
                      selectedComponent === "Internal"
                        ? "#A43214"
                        : "transparent",
                    color:
                      selectedComponent === "Internal" ? "white" : "#A43214",
                    fontWeight: "bold",
                    height: "100%", // Match the height of the container
                    border: "1px solid transparent", // Keep border style consistent
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                    "&:hover": {
                      bgcolor: "#A43214", // Change background on hover
                      color: "white", // Change text color on hover
                      border:
                        selectedComponent === "Internal"
                          ? "none"
                          : "0.5px solid #A43214", // Border on hover if not current
                    },
                    paddingX: 4,
                    paddingY: 3,
                    borderRadius: 2,
                  }}
                >
                  Internal
                </Button>
                <Button
                  onClick={() => changeComponent("Learning")}
                  sx={{
                    p: 3,
                    fontSize: "18px",
                    bgcolor:
                      selectedComponent === "Learning"
                        ? "#A43214"
                        : "transparent",
                    color:
                      selectedComponent === "Learning" ? "white" : "#A43214",
                    fontWeight: "bold",
                    height: "100%", // Match the height of the container
                    border: "1px solid transparent", // Keep border style consistent
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                    "&:hover": {
                      bgcolor: "#A43214", // Change background on hover
                      color: "white", // Change text color on hover
                      border:
                        selectedComponent === "Learning"
                          ? "none"
                          : "0.5px solid #A43214", // Border on hover if not current
                    },
                    paddingX: 4,
                    paddingY: 3,
                    borderRadius: 2,
                  }}
                >
                  Learning
                </Button>
              </Grid>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                mt: -9,
              }}
            >
              {currentView === "secondary" && role !== "FACULTY" && (
                <button
                  onClick={() => handleButtonClick(department_id)}
                  disabled={isButtonDisabled}
                  className="bg-[#fff6d1] text-[#A43214] hover:bg-[#ff7b00d3] border border-orange-200 hover:text-white text-center items-center rounded-lg px-8 py-5 font-bold text-[18px]"
                >
                  MAP STRATEGIES
                </button>
              )}
            </Box>

            <Box width="100%" sx={{ mt: -1 }}>
              {currentView === "primary" && (
                <>
                  {selectedComponent === "Financial" && ( //remove the border
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
                                className="h-[6rem]"
                              />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "600" }}
                              >
                                <span className="text-[#ff7b00d3]">
                                  Financial:
                                </span>{" "}
                                Stewardship Overview
                              </Typography>
                              <Typography
                                variant="h6"
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
                            {primaryFinancialStrategies.map(
                              // Map the fetched primary data directly
                              (strategy: GeneratedSentence, index: number) => (
                                <div
                                  key={strategy.id}
                                  className={`flex justify-between items-center p-5 m-5 w-auto ${
                                    index <
                                    primaryFinancialStrategies.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "400" }}
                                  >
                                    {strategy.value}
                                  </Typography>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </StyledBox>
                    </Cards>
                  )}
                  {selectedComponent === "Learning" && ( //remove the border
                    <Cards sx={{ borderColor: "black", borderWidth: 1 }}>
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
                                className="h-[6rem]"
                              />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "600" }}
                              >
                                <span className="text-[#ff7b00d3]">
                                  Learning & Growth:
                                </span>{" "}
                                Culture & People Development Overview
                              </Typography>
                              <Typography
                                variant="h6"
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
                            {primaryLearningGrowthStrategies.map(
                              // Map the fetched primary data directly
                              (strategy: GeneratedSentence, index: number) => (
                                <div
                                  key={strategy.id}
                                  className={`flex justify-between items-center p-5 m-5 w-auto ${
                                    index <
                                    primaryLearningGrowthStrategies.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "400" }}
                                  >
                                    {strategy.value}
                                  </Typography>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </StyledBox>
                    </Cards>
                  )}
                  {selectedComponent === "Internal" && ( //remove the border
                    <Cards sx={{ borderColor: "black", borderWidth: 1 }}>
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
                                className="h-[6rem]"
                              />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "600" }}
                              >
                                <span className="text-[#ff7b00d3]">
                                  Internal Process:
                                </span>{" "}
                                Process & Technology Overview
                              </Typography>
                              <Typography
                                variant="h6"
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
                            {primaryInternalProcessStrategies.map(
                              // Map the fetched primary data directly
                              (strategy: GeneratedSentence, index: number) => (
                                <div
                                  key={strategy.id}
                                  className={`flex justify-between items-center p-5 m-5 w-auto ${
                                    index <
                                    primaryInternalProcessStrategies.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "400" }}
                                  >
                                    {strategy.value}
                                  </Typography>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </StyledBox>
                    </Cards>
                  )}
                  {selectedComponent === "Stakeholder" && ( //remove the border
                    <Cards sx={{ borderColor: "black", borderWidth: 1 }}>
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
                                className="h-[6rem]"
                              />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "600" }}
                              >
                                <span className="text-[#ff7b00d3]">
                                  Stakeholder:
                                </span>{" "}
                                Client Relationship Overview
                              </Typography>
                              <Typography
                                variant="h6"
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
                            {primaryStakeholderStrategies.map(
                              // Map the fetched primary data directly
                              (strategy: GeneratedSentence, index: number) => (
                                <div
                                  key={strategy.id}
                                  className={`flex justify-between items-center p-5 m-5 w-auto ${
                                    index <
                                    primaryStakeholderStrategies.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "400" }}
                                  >
                                    {strategy.value}
                                  </Typography>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </StyledBox>
                    </Cards>
                  )}
                </>
              )}

              <Modal open={showWarning} onClose={handleCancelClear}>
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
                      padding: 6,
                      borderRadius: 2,
                      boxShadow: 24,
                      textAlign: "center",
                      position: "relative",
                      maxWidth: "30vw", // Limit modal width to 80% of viewport width
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{ fontWeight: "bold", mb: 3 }}
                    >
                      Map new strategies?
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 5 }}>
                      Are you sure you want to map strategies? This will take
                      unmapped strategies and map them into the correct
                      categories.
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
                        onClick={handleCancelClear}
                        sx={{
                          width: "30%",
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
                        onClick={() => handleConfirmSort(department_id)}
                        sx={{
                          width: "30%",
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                          p: 1,
                          fontSize: "18px",
                        }}
                      >
                        Confirm
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Modal>

              {currentView === "secondary" && (
                <>
                  {selectedComponent === "Financial" && ( //remove the border
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
                                className="h-[6rem]"
                              />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "600" }}
                              >
                                <span className="text-[#ff7b00d3]">
                                  Financial:
                                </span>{" "}
                                Stewardship Overview
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "500" }}
                              >
                                Measures financial performance and
                                profitability.
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
                                onClick={openFModal}
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
                        {isFModalOpen && (
                          <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                            <Box
                              className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                              sx={{
                                width: "60%",
                                height: "80%",
                                maxWidth: "95vw",
                                maxHeight: "95vh",
                                // maxHeight: '100vh',
                              }}
                            >
                              <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                  fontWeight: "bold",
                                  mb: 2,
                                  color: "#2e2c2c",
                                }}
                              >
                                Financial Strategy
                              </Typography>
                              <div className="flex flex-col mb-1">
                                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                                  Target Code
                                  <span className="text-[#DD1414]">*</span>
                                </span>
                              </div>
                              <TextField
                                variant="outlined"
                                value={newFTargetCode}
                                onChange={(e) =>
                                  setNewFTargetCode(e.target.value)
                                }
                                sx={{
                                  height: "50px",
                                  "& .MuiInputBase-root": { height: "50px" },
                                }}
                              />
                              <Box sx={{ mt: 3 }}>
                                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                                  Strategy
                                  <span className="text-[#DD1414]">*</span>
                                </span>
                                <span className="mb-3 text-[1.1rem]">
                                  <br />
                                  Before inputting a strategy, please follow
                                  this format.
                                </span>
                                <span className="text-[1.1rem]">
                                  <br />
                                  1. Choose one of the following{" "}
                                  <span className="font-bold">
                                    strategic themes
                                  </span>
                                  :
                                </span>
                                <ul className="list-disc ml-10 mb-2 text-[1.1rem]">
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
                                <span className="text-[1.1rem]">
                                  2. After selecting the theme, leave a space
                                  and then input the{" "}
                                  <span className="font-bold">target code</span>{" "}
                                  followed by a colon{" "}
                                  <span className="font-bold">(:)</span>
                                </span>
                                <span className="text-[1.1rem]">
                                  <br />
                                  3. Finally, write the{" "}
                                  <span className="font-bold">strategy.</span>
                                </span>
                                <br />
                                <span className="text-[1.1rem]">
                                  <br />
                                  The correct format should be:{" "}
                                  <span className="font-bold">
                                    Strategic Theme Target Code: Strategy
                                  </span>
                                </span>
                                <span className="font-bold text-[1.1rem]">
                                  <br />
                                  Example:{" "}
                                  <span className="font-bold text-red-500">
                                    Excellence in Service Quality T001: Improve
                                    customer response time.
                                  </span>
                                </span>

                                <Grid item sx={{ mt: 2 }}>
                                  <TextField
                                    value={newFStrategy}
                                    onChange={(e) =>
                                      setNewFStrategy(e.target.value)
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
                                  onClick={closeFModal}
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
                                  onClick={async () => {
                                    await handleFSave();
                                    fetchExistingStrategies(department_id);
                                  }}
                                  sx={{
                                    minWidth: "10rem",
                                    background:
                                      "linear-gradient(to left, #8a252c, #AB3510)",
                                    p: 1,
                                    fontSize: "18px",
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
                            {strategies.financial.map(
                              (strategy: GeneratedSentence, index: number) => (
                                <div
                                  key={strategy.id}
                                  className={`flex justify-between items-center p-5 m-5 w-auto ${
                                    index < strategies.financial.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  {/* edit div */}
                                  {editingStrategy === strategy ? (
                                    <div className="pr-3 pl-3 w-[100%] flex">
                                      <input
                                        type="text"
                                        value={newStrategyValue}
                                        onChange={(e) =>
                                          setNewStrategyValue(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-orange-400 px-2"
                                      />
                                      <button
                                        onClick={() => {
                                          handleFinancialSaveEdit(
                                            // @ts-ignore
                                            strategy.fID,
                                            newStrategyValue,
                                            department_id
                                          );
                                        }}
                                        className="bg-[#AB3510] hover:bg-[#ee6c44] text-white font-bold py-2 px-4 rounded ml-2"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: "400" }}
                                    >
                                      {strategy.value}
                                    </Typography>
                                  )}
                                  <div className="flex">
                                    <button
                                      onClick={() => handleEditClick(strategy)}
                                      className="font-bold py-2 px-2 rounded text-orange-600"
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

                                    {strategyToDelete?.fID === strategy.fID ? (
                                      <>
                                        <button
                                          onClick={handleConfirmDelete}
                                          className="bg-[#ff7b00d3] hover:bg-orange-700 text-white font-bold py-1 px-2 rounded mr-2"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M4.5 12.75l6 6 9-13.5"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={handleCancelDelete}
                                          className="bg-[#AB3510] hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M6 18L18 6M6 6l12 12"
                                            />
                                          </svg>
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleDeleteClick(strategy)
                                        }
                                        className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          className="size-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </StyledBox>
                    </Cards>
                  )}
                  {selectedComponent === "Learning" && ( //remove the border
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
                                src="/learning.png"
                                alt=""
                                className="h-[6rem]"
                              />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "600" }}
                              >
                                <span className="text-[#ff7b00d3]">
                                  Learning & Growth:
                                </span>{" "}
                                Culture & People Development Overview
                              </Typography>
                              <Typography
                                variant="h6"
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
                                onClick={openLGModal}
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
                        {isLGModalOpen && (
                          <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                            <Box
                              className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                              sx={{
                                width: "60%",
                                height: "80%",
                                maxWidth: "95vw",
                                maxHeight: "95vh",
                                // maxHeight: '100vh',
                              }}
                            >
                              <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                  fontWeight: "bold",
                                  mb: 2,
                                  color: "#2e2c2c",
                                }}
                              >
                                Learning & Growth Strategy
                              </Typography>
                              <div className="flex flex-col mb-1">
                                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                                  Target Code
                                  <span className="text-[#DD1414]">*</span>
                                </span>
                              </div>
                              <TextField
                                variant="outlined"
                                value={newLGTargetCode}
                                onChange={(e) =>
                                  setNewLGTargetCode(e.target.value)
                                }
                                sx={{
                                  height: "50px",
                                  "& .MuiInputBase-root": { height: "50px" },
                                }}
                              />
                              <Box sx={{ mt: 3 }}>
                                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                                  Strategy
                                  <span className="text-[#DD1414]">*</span>
                                </span>
                                <span className="mb-3 text-[1.1rem]">
                                  <br />
                                  Before inputting a strategy, please follow
                                  this format.
                                </span>
                                <span className="text-[1.1rem]">
                                  <br />
                                  1. Choose one of the following{" "}
                                  <span className="font-bold">
                                    strategic themes
                                  </span>
                                  :
                                </span>
                                <ul className="list-disc ml-10 mb-2 text-[1.1rem]">
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
                                <span className="text-[1.1rem]">
                                  2. After selecting the theme, leave a space
                                  and then input the{" "}
                                  <span className="font-bold">target code</span>{" "}
                                  followed by a colon{" "}
                                  <span className="font-bold">(:)</span>
                                </span>
                                <span className="text-[1.1rem]">
                                  <br />
                                  3. Finally, write the{" "}
                                  <span className="font-bold">strategy.</span>
                                </span>
                                <br />
                                <span className="text-[1.1rem]">
                                  <br />
                                  The correct format should be:{" "}
                                  <span className="font-bold">
                                    Strategic Theme Target Code: Strategy
                                  </span>
                                </span>
                                <span className="font-bold text-[1.1rem]">
                                  <br />
                                  Example:{" "}
                                  <span className="font-bold text-red-500">
                                    Excellence in Service Quality T001: Improve
                                    customer response time.
                                  </span>
                                </span>

                                <Grid item sx={{ mt: 2 }}>
                                  <TextField
                                    value={newLGStrategy}
                                    onChange={(e) =>
                                      setNewLGStrategy(e.target.value)
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
                                  onClick={closeLGModal}
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
                                  onClick={async () => {
                                    await handleLGSave();
                                    fetchExistingStrategies(department_id);
                                  }}
                                  sx={{
                                    minWidth: "10rem",
                                    background:
                                      "linear-gradient(to left, #8a252c, #AB3510)",
                                    p: 1,
                                    fontSize: "18px",
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
                            {strategies.learningGrowth.map(
                              (strategy: GeneratedSentence, index: number) => (
                                <div
                                  key={strategy.id}
                                  className={`flex justify-between items-center p-5 m-5 w-auto ${
                                    index < strategies.learningGrowth.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  {/* edit div */}
                                  {editingStrategy === strategy ? (
                                    <div className="pr-3 pl-3 w-[100%] flex">
                                      <input
                                        type="text"
                                        value={newStrategyValue}
                                        onChange={(e) =>
                                          setNewStrategyValue(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-orange-400 px-2"
                                      />
                                      <button
                                        onClick={() => {
                                          handleLearningGrowthSaveEdit(
                                            // @ts-ignore
                                            strategy.fID,
                                            newStrategyValue,
                                            department_id
                                          );
                                        }}
                                        className="bg-[#AB3510] hover:bg-[#ee6c44] text-white font-bold py-2 px-4 rounded ml-2"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: "400" }}
                                    >
                                      {strategy.value}
                                    </Typography>
                                  )}
                                  <div className="flex">
                                    <button
                                      onClick={() => handleEditClick(strategy)}
                                      className="font-bold py-2 px-2 rounded text-orange-600"
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

                                    {strategyToDelete?.fID === strategy.fID ? (
                                      <>
                                        <button
                                          onClick={handleConfirmDelete}
                                          className="bg-[#ff7b00d3] hover:bg-orange-700 text-white font-bold py-1 px-2 rounded mr-2"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M4.5 12.75l6 6 9-13.5"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={handleCancelDelete}
                                          className="bg-[#AB3510] hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M6 18L18 6M6 6l12 12"
                                            />
                                          </svg>
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleDeleteClick(strategy)
                                        }
                                        className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          className="size-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </StyledBox>
                    </Cards>
                  )}
                  {selectedComponent === "Internal" && ( //remove the border
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
                                src="/internal.png"
                                alt=""
                                className="h-[6rem]"
                              />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "600" }}
                              >
                                <span className="text-[#ff7b00d3]">
                                  Internal Process:
                                </span>{" "}
                                Process & Technology Overview
                              </Typography>
                              <Typography
                                variant="h6"
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
                                onClick={openIPModal}
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
                        {isIPModalOpen && (
                          <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                            <Box
                              className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                              sx={{
                                width: "60%",
                                height: "80%",
                                maxWidth: "95vw",
                                maxHeight: "95vh",
                                // maxHeight: '100vh',
                              }}
                            >
                              <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                  fontWeight: "bold",
                                  mb: 2,
                                  color: "#2e2c2c",
                                }}
                              >
                                Internal Process Strategy
                              </Typography>
                              <div className="flex flex-col mb-1">
                                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                                  Target Code
                                  <span className="text-[#DD1414]">*</span>
                                </span>
                              </div>
                              <TextField
                                variant="outlined"
                                value={newIPTargetCode}
                                onChange={(e) =>
                                  setNewIPTargetCode(e.target.value)
                                }
                                sx={{
                                  height: "50px",
                                  "& .MuiInputBase-root": { height: "50px" },
                                }}
                              />
                              <Box sx={{ mt: 3 }}>
                                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                                  Strategy
                                  <span className="text-[#DD1414]">*</span>
                                </span>
                                <span className="mb-3 text-[1.1rem]">
                                  <br />
                                  Before inputting a strategy, please follow
                                  this format.
                                </span>
                                <span className="text-[1.1rem]">
                                  <br />
                                  1. Choose one of the following{" "}
                                  <span className="font-bold">
                                    strategic themes
                                  </span>
                                  :
                                </span>
                                <ul className="list-disc ml-10 mb-2 text-[1.1rem]">
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
                                <span className="text-[1.1rem]">
                                  2. After selecting the theme, leave a space
                                  and then input the{" "}
                                  <span className="font-bold">target code</span>{" "}
                                  followed by a colon{" "}
                                  <span className="font-bold">(:)</span>
                                </span>
                                <span className="text-[1.1rem]">
                                  <br />
                                  3. Finally, write the{" "}
                                  <span className="font-bold">strategy.</span>
                                </span>
                                <br />
                                <span className="text-[1.1rem]">
                                  <br />
                                  The correct format should be:{" "}
                                  <span className="font-bold">
                                    Strategic Theme Target Code: Strategy
                                  </span>
                                </span>
                                <span className="font-bold text-[1.1rem]">
                                  <br />
                                  Example:{" "}
                                  <span className="font-bold text-red-500">
                                    Excellence in Service Quality T001: Improve
                                    customer response time.
                                  </span>
                                </span>

                                <Grid item sx={{ mt: 2 }}>
                                  <TextField
                                    value={newIPStrategy}
                                    onChange={(e) =>
                                      setNewIPStrategy(e.target.value)
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
                                  onClick={closeIPModal}
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
                                  onClick={async () => {
                                    await handleIPSave();
                                    fetchExistingStrategies(department_id);
                                  }}
                                  sx={{
                                    minWidth: "10rem",
                                    background:
                                      "linear-gradient(to left, #8a252c, #AB3510)",
                                    p: 1,
                                    fontSize: "18px",
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
                            {strategies.internalProcess.map(
                              (strategy: GeneratedSentence, index: number) => (
                                <div
                                  key={strategy.id}
                                  className={`flex justify-between items-center p-5 m-5 w-auto ${
                                    index <
                                    strategies.internalProcess.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  {/* edit div */}
                                  {editingStrategy === strategy ? (
                                    <div className="pr-3 pl-3 w-[100%] flex">
                                      <input
                                        type="text"
                                        value={newStrategyValue}
                                        onChange={(e) =>
                                          setNewStrategyValue(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-orange-400 px-2"
                                      />
                                      <button
                                        onClick={() => {
                                          handleInternalProcessSaveEdit(
                                            // @ts-ignore
                                            strategy.fID,
                                            newStrategyValue,
                                            department_id
                                          );
                                        }}
                                        className="bg-[#AB3510] hover:bg-[#ee6c44] text-white font-bold py-2 px-4 rounded ml-2"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: "400" }}
                                    >
                                      {strategy.value}
                                    </Typography>
                                  )}
                                  <div className="flex">
                                    <button
                                      onClick={() => handleEditClick(strategy)}
                                      className="font-bold py-2 px-2 rounded text-orange-600"
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

                                    {strategyToDelete?.fID === strategy.fID ? (
                                      <>
                                        <button
                                          onClick={handleConfirmDelete}
                                          className="bg-[#ff7b00d3] hover:bg-orange-700 text-white font-bold py-1 px-2 rounded mr-2"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M4.5 12.75l6 6 9-13.5"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={handleCancelDelete}
                                          className="bg-[#AB3510] hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M6 18L18 6M6 6l12 12"
                                            />
                                          </svg>
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleDeleteClick(strategy)
                                        }
                                        className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          className="size-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </StyledBox>
                    </Cards>
                  )}
                  {selectedComponent === "Stakeholder" && ( //remove the border
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
                                src="/stakeholder.png"
                                alt=""
                                className="h-[6rem]"
                              />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "600" }}
                              >
                                <span className="text-[#ff7b00d3]">
                                  Stakeholder:
                                </span>{" "}
                                Client Relationship Overview
                              </Typography>
                              <Typography
                                variant="h6"
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
                                onClick={openSModal}
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
                        {isSModalOpen && (
                          <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                            <Box
                              className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                              sx={{
                                width: "60%",
                                height: "80%",
                                maxWidth: "95vw",
                                maxHeight: "95vh",
                                // maxHeight: '100vh',
                              }}
                            >
                              <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                  fontWeight: "bold",
                                  mb: 2,
                                  color: "#2e2c2c",
                                }}
                              >
                                Stakeholder Strategy
                              </Typography>
                              <div className="flex flex-col mb-1">
                                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                                  Target Code
                                  <span className="text-[#DD1414]">*</span>
                                </span>
                              </div>
                              <TextField
                                variant="outlined"
                                value={newSTargetCode}
                                onChange={(e) =>
                                  setNewSTargetCode(e.target.value)
                                }
                                sx={{
                                  height: "50px",
                                  "& .MuiInputBase-root": { height: "50px" },
                                }}
                              />
                              <Box sx={{ mt: 3 }}>
                                <span className="mr-3 break-words font-regular text-lg text-[#000000]">
                                  Strategy
                                  <span className="text-[#DD1414]">*</span>
                                </span>
                                <span className="mb-3 text-[1.1rem]">
                                  <br />
                                  Before inputting a strategy, please follow
                                  this format.
                                </span>
                                <span className="text-[1.1rem]">
                                  <br />
                                  1. Choose one of the following{" "}
                                  <span className="font-bold">
                                    strategic themes
                                  </span>
                                  :
                                </span>
                                <ul className="list-disc ml-10 mb-2 text-[1.1rem]">
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
                                <span className="text-[1.1rem]">
                                  2. After selecting the theme, leave a space
                                  and then input the{" "}
                                  <span className="font-bold">target code</span>{" "}
                                  followed by a colon{" "}
                                  <span className="font-bold">(:)</span>
                                </span>
                                <span className="text-[1.1rem]">
                                  <br />
                                  3. Finally, write the{" "}
                                  <span className="font-bold">strategy.</span>
                                </span>
                                <br />
                                <span className="text-[1.1rem]">
                                  <br />
                                  The correct format should be:{" "}
                                  <span className="font-bold">
                                    Strategic Theme Target Code: Strategy
                                  </span>
                                </span>
                                <span className="font-bold text-[1.1rem]">
                                  <br />
                                  Example:{" "}
                                  <span className="font-bold text-red-500">
                                    Excellence in Service Quality T001: Improve
                                    customer response time.
                                  </span>
                                </span>

                                <Grid item sx={{ mt: 2 }}>
                                  <TextField
                                    value={newSStrategy}
                                    onChange={(e) =>
                                      setNewSStrategy(e.target.value)
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
                                  onClick={closeSModal}
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
                                  onClick={async () => {
                                    await handleSSave();
                                    fetchExistingStrategies(department_id);
                                  }}
                                  sx={{
                                    minWidth: "10rem",
                                    background:
                                      "linear-gradient(to left, #8a252c, #AB3510)",
                                    p: 1,
                                    fontSize: "18px",
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
                            {strategies.stakeholder.map(
                              (strategy: GeneratedSentence, index: number) => (
                                <div
                                  key={strategy.id}
                                  className={`flex justify-between items-center p-5 m-5 w-auto ${
                                    index < strategies.stakeholder.length - 1
                                      ? "border-b border-gray-200"
                                      : ""
                                  }`}
                                >
                                  {/* edit div */}
                                  {editingStrategy === strategy ? (
                                    <div className="pr-3 pl-3 w-[100%] flex">
                                      <input
                                        type="text"
                                        value={newStrategyValue}
                                        onChange={(e) =>
                                          setNewStrategyValue(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-orange-400 px-2"
                                      />
                                      <button
                                        onClick={() => {
                                          handleStakeholderSaveEdit(
                                            // @ts-ignore
                                            strategy.fID,
                                            newStrategyValue,
                                            department_id
                                          );
                                        }}
                                        className="bg-[#AB3510] hover:bg-[#ee6c44] text-white font-bold py-2 px-4 rounded ml-2"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: "400" }}
                                    >
                                      {strategy.value}
                                    </Typography>
                                  )}
                                  <div className="flex">
                                    <button
                                      onClick={() => handleEditClick(strategy)}
                                      className="font-bold py-2 px-2 rounded text-orange-600"
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

                                    {strategyToDelete?.fID === strategy.fID ? (
                                      <>
                                        <button
                                          onClick={handleConfirmDelete}
                                          className="bg-[#ff7b00d3] hover:bg-orange-700 text-white font-bold py-1 px-2 rounded mr-2"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M4.5 12.75l6 6 9-13.5"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={handleCancelDelete}
                                          className="bg-[#AB3510] hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M6 18L18 6M6 6l12 12"
                                            />
                                          </svg>
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleDeleteClick(strategy)
                                        }
                                        className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          className="size-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </StyledBox>
                    </Cards>
                  )}
                </>
              )}
            </Box>
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
};
export default Page;
