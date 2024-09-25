"use client";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const Page = () => {
  const { data: session } = useSession();
  const [selectedComponent, setSelectedComponent] = useState("");
  const [currentView, setCurrentView] = useState("primary");
  const [hasPrimaryStrats, setHasPrimaryStrats] = useState<string | null>(null);

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
    let isMounted = true;

    const postToPrimaryStrategies = async () => {
      const response = await fetch(`http://localhost:8080/user/getHasPrimaryStrats/${username}`);
      const data = await response.json();

      console.log("data:", data);

      if (data === 0 && isMounted) {
        try {
          // Define an array of primary strategy data
          const primaryStrategiesData = [
            {
              perspective: "financial", // Added perspective field
              office_target: "Excellence in Organizational Stewardship A8.4: 100% compliance to prescribed budget ceiling",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target: "Excellence in Service Quality A1.1: 90% average awareness rate of the services",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target: "Excellence in Service Quality A1.2: 90% of eligible employees availed of the services of the administrative and academic support offices",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target: "Excellence in Service Quality A1.3: At least 4.5 (out of 5.0) inter-office customer satisfaction",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target: "Excellence in Service Quality A2.1: Have at least 4-star (out of 5) customer service rating",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target: "Excellence in Service Quality A2.2: Have at least 9-star (out of 10) net promoter score",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target: "Excellence in Service Quality A2.3: 90% transanctions resolved or answered customer query within expected time",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target: "Excellence in Internal Service Systems A4.1: 100% of the office systems standardized and documented",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target: "Excellence in Internal Service Systems A4.2: 100% of process records meet its requirements",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target: "Excellence in Internal Service Systems A5.1: 100% awareness of the existence of the University Brand Bible and of its guidelines and templates",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target: "Excellence in Internal Service Systems A5.2: 100% compliance to the branding guidelines in their instructional, operational and communication materials",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target: "Excellence in Internal Service Systems A6.1: 100% awareness of the existence of the 5S+ Program",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target: "Excellence in Internal Service Systems A6.2: 100% participation in the orientation/re-orientation of 5S+ training",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target: "Excellence in Internal Service Systems A6.3: 100% compliance of the 5S+ standard",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target: "A7.1: At least 90% participation in CIT-sponsored events",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target: "A7.2: At least 90% participation in CIT-sponsored trainings, seminars, workshops, and conferences",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target: "A7.3: At least 90% participation in CIT-commissioned surveys, FGDs, etc.",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target: "Excellence in Organizational Stewardship A9.1: 100% of admin staff are evaluated on time",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target: "Excellence in Organizational Stewardship A9.2: 100% completed the Competence & Competency Matrix (CCM), training & development needs analysis (TDNA), and professional development plan",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target: "Excellence in Organizational Stewardship A9.3: 50% of admin staff are involved in research work",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target: "Excellence in Organizational Stewardship A9.4: 100% of staff are ranked",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target: "Excellence in Organizational Stewardship A9.5: 100% submission of succession plan",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target: "Excellence in Organizational Stewardship A9.6: 100% of staff have 1 community involvement activity per year",
              department: { id: department_id },
            }
          ];
      
          // Post each strategy individually
          const postPromises = primaryStrategiesData.map(async (strategyData) => {
            const endpoint = `http://localhost:8080/stratmap/primary${strategyData.perspective.charAt(0).toUpperCase() + strategyData.perspective.slice(1)}/insert`;
            console.log("Endpoint:", endpoint); // Log the endpoint for debugging
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(strategyData),
            });
      
            if (!response.ok) {
              console.error(`Error posting ${strategyData.perspective} strategy:`, response.status);
            }
          });
      
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
            }
            else {
              localStorage.setItem('hasPrimaryStrats', '1');
              setHasPrimaryStrats('1'); // Store in local storage
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

    setHasPrimaryStrats(localStorage.getItem('hasPrimaryStrats'));
    
    fetchProfileGoals();
    fetchExistingStrategies(department_id);

    type Perspective = "Financial" | "Stakeholder" | "Internal Process" | "Learning & Growth";

    const fetchFunctions: Record<Perspective, (department_id: number) => Promise<void>> = {
      "Financial": fetchPrimaryFinancialStrategies,
      "Stakeholder": fetchPrimaryStakeholderStrategies,
      "Internal Process": fetchPrimaryInternalProcessStrategies,
      "Learning & Growth": fetchPrimaryLearningGrowthStrategies,
    };
  
    // Fetch data only if in primary view and component is valid
    if (currentView === "primary" && (selectedComponent as Perspective) in fetchFunctions) {
      fetchFunctions[selectedComponent as Perspective](department_id);
    }


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
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [newStrategyValue, setNewStrategyValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [primaryFinancialStrategies, setPrimaryFinancialStrategies] = useState<GeneratedSentence[]>([]);
  const [primaryStakeholderStrategies, setPrimaryStakeholderStrategies] = useState<GeneratedSentence[]>([]);
  const [primaryInternalProcessStrategies, setPrimaryInternalProcessStrategies] = useState<GeneratedSentence[]>([]);
  const [primaryLearningGrowthStrategies, setPrimaryLearningGrowthStrategies] = useState<GeneratedSentence[]>([]);

  // @ts-ignore
  const handleEditClick = (strategy) => {
    setEditingStrategy(strategy);
    setNewStrategyValue(strategy.value);
  };

  const handleButtonClick = (department_id: number) => {
    setShowWarning(true);
  };

  const handleConfirmClear = async (department_id: number) => {
    setShowWarning(false); // Close the warning dialog
    setIsButtonDisabled(true);

    try {
      // Call the API endpoints to clear the tables
      await fetch("http://localhost:8080/stratmap/financial/clear", { method: "DELETE" });
      await fetch("http://localhost:8080/stratmap/stakeholder/clear", { method: "DELETE" });
      await fetch("http://localhost:8080/stratmap/learning/clear", { method: "DELETE" });
      await fetch("http://localhost:8080/stratmap/internal/clear", { method: "DELETE" });

      // Re-fetch the data and categorize after clearing the tables
      await fetchAllData(department_id);
    } catch (error) {
      console.error("Error clearing tables:", error);
      // Handle errors, e.g., show an error message to the user
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 60000);
    }
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
        console.error("Failed to update strategy");
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
  };

  const handleInternalProcessSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(`http://localhost:8080/stratmap/internal/edit/${fID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

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
  };

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

    const fetchProfileGoals = async () => {
      console.log("Fetching profile goals...");
      try {
        const response = await fetch(
          `http://localhost:8080/goals/get/department/${department_id}`
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
        user_generated: 1
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
        console.error("Error saving primary financial strategy:", response.status);
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
        console.error("Error saving primary stakeholder strategy:", response.status);
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
        console.error("Error saving primary learning strategy:", response.status);
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
        console.error("Error saving primary internal strategy:", response.status);
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
        user_generated: 1
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
        user_generated: 1
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
        user_generated: 1
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
    
          const categorizedSentences: GeneratedSentence[] = await Promise.all( // Use Promise.all to handle async operations within map
            generatedSentences.map(async (sentence) => {
              const match = sentence.match(/^(\d+)\.\s*(.*?)\s*([SW]\d+[TO]\d+|[WO]\d+[WT]\d+)?:\s*(.*)$/);
      
              if (match) {
                const [, idStr, strategicTheme, code, content] = match;
                const id = parseInt(idStr, 10);
                const fID = id;
      
                // POST target code to backend 
                if (id === 1) { // Assuming id 1 represents Financial perspective 
                  try {
                    const response = await fetch( // Make the fetch call asynchronous with await
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
            }
          ));
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
      setPrimaryFinancialStrategies( // Update the primaryFinancialStrategies state
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
      setPrimaryStakeholderStrategies( // Update the primaryFinancialStrategies state
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

  const fetchPrimaryInternalProcessStrategies = async (department_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/primaryInternal/get/${department_id}` // Assuming this is your API endpoint
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Update the strategies state with the fetched primary internal process strategies
      setPrimaryInternalProcessStrategies( // Update the primaryFinancialStrategies state
        data.map((item: any) => ({
          id: 1, 
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error("Error fetching primary internal process strategies:", error);
    }
  };

  const fetchPrimaryLearningGrowthStrategies = async (department_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/primaryLearning/get/${department_id}` // Assuming this is your API endpoint
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Update the strategies state with the fetched primary learning and growth strategies
      setPrimaryLearningGrowthStrategies( // Update the primaryFinancialStrategies state
        data.map((item: any) => ({
          id: 1, 
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error("Error fetching primary learning and growth strategies:", error);
    }
  };


  const fetchExistingStrategies = async (department_id: number) => {
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
    } catch (error) {
      console.error("Error fetching existing strategies:", error);
    }
  };

  const handleFinancialDelete = async (id: number) => {
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
  };

  const handleLGDelete = async (id: number) => {
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
  };

  const handleStakeholderDelete = async (id: number) => {
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
  };

  const handleInternalDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/stratmap/internal/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

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

  const [officeVision, setOfficeVision] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [mission, setMission] = useState("");

  return (
    <div className="flex flex-row w-full text-[rgb(59,59,59)]">
      <Navbar />
      <div className="flex-1 h-screen">
        <div className="flex-1 flex flex-col mt-8 ml-80">
          <div className="flex flex-row">
            <span className="break-words font-bold text-[3rem]">
              Strategy Mapping
            </span>
            <div className="flex justify-center lg:ml-[55rem] md:ml-[50rem] mt-[0.5rem] border border-gray-200 bg-gray w-[24rem] h-[4rem] rounded-xl gap-2 px-1 py-1 text-md font-medium">
              <button
                onClick={() => setCurrentView("primary")}
                className={`rounded-lg ${
                  currentView === "primary"
                    ? "bg-[#A43214] text-white"
                    : "border text-[#A43214]"
                } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}>
                  PRIMARY
              </button>
              <button
                onClick={() => setCurrentView("secondary")}
                className={`rounded-lg ${
                  currentView === "secondary"
                    ? "bg-[#A43214] text-white"
                    : "border text-[#A43214]"
                } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}>
                  SECONDARY
              </button>
              
              {role !== "FACULTY" && (
                  <button
                    onClick={() => handleButtonClick(department_id)}
                    disabled={isButtonDisabled}
                    className="bg-[#ffffff] text-[#A43214] hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white text-center items-center rounded-lg px-6 py-2"
                  >
                    SORT
                  </button>
                )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3">
            <div className="col-span-3">
              <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-[6rem] mt-[-1.1rem]">
                Strategy mapping empowers organizations to translate their
                vision into actionable strategies, align resources, and drive
                performance across all aspects of the business. Navigate
                complexity, capitalize on opportunities, and achieve sustainable
                growth in today&apos;s dynamic business landscape.
              </div>

              <div className="container mx-auto px-4 mb-16 sm:flex-col md:flex-col sm:mb-5 md:mb-24 lg:mb-20">
                <div className="mt-[-3rem] grid grid-cols-1 sm:w-[80%] lg:w-[109%] sm:items-start sm:flex-col sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 h-[auto] w-[102rem] ml-[-6rem]">
                  <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-2">Vision</h1>
                    <p className="text-gray-700 break-words overflow-auto">
                      {officeVision}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-2">Value</h1>
                    <p className="text-gray-700">
                      {valueProposition}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-2">Mission</h1>
                    <p className="text-gray-700">
                      {mission}
                    </p>
                  </div>
                </div>
              </div>


              {/* perspectives toggle */}
              <div className="flex justify-center mt-[0.5rem] border border-gray-200 bg-gray w-[44rem] h-[4rem] rounded-xl px-1 py-1">
                <div
                  className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                  onClick={() => changeComponent("Financial")}
                >
                  <div
                    className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                      selectedComponent === "Financial"
                        ? "bg-[#A43214] text-white"
                        : "border text-[#A43214]"
                    } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                  >
                    FINANCIAL
                  </div>
                </div>
                <div
                  className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                  onClick={() => changeComponent("Stakeholder")}
                >
                  <div
                    className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                      selectedComponent === "Stakeholder"
                        ? "bg-[#A43214] text-white"
                        : "border text-[#A43214]"
                    } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                  >
                    STAKEHOLDER
                  </div>
                </div>
                <div
                  className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                  onClick={() => changeComponent("Internal Process")}
                >
                  <div
                    className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                      selectedComponent === "Internal"
                        ? "bg-[#A43214] text-white"
                        : "border text-[#A43214]"
                    } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                  >
                    INTERNAL PROCESS
                  </div>
                </div>
                <div
                  className="flex flex-row box-sizing-border cursor-pointer"
                  onClick={() => changeComponent("Learning & Growth")}
                >
                  <div
                    className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                      selectedComponent === "Learning"
                        ? "bg-[#A43214] text-white"
                        : "border text-[#A43214]"
                    } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                  >
                    LEARNING & GROWTH
                  </div>
                </div>
            </div>
            {/* end of perspectives toggle */}


            {/* PRIMARY VIEW */}
            {currentView === "primary" && (
              <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF]  mr-10 flex flex-col pt-4 pr-5 pl-5 w-[96%] h-auto mb-10 rounded-lg">
                {selectedComponent === "Financial" && (
                <div className="flex flex-col align-middle items-center justify-center w-[100%]">
                  <div className="flex flex-row">
                  <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                    <img
                      src="/financial.png"
                      alt=""
                      className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        Primary: Financial Report Overview
                      </span>
                      <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        Measures financial performance and profitability.
                      </span>
                    </div>
                  </div>
                <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] pr-1 pt-1 pb-1 mt-2 ml-[68.4rem]">
                  <button onClick={openPrimaryFModal} className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"> 
                    
                    <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  </button>
                </div>
                </div>
                  {isPrimaryFModalOpen && ( 
                    <div className="fixed inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                      <div className="bg-white p-8 rounded-lg z-10 h-[auto] w-[70rem]">
                        <div className="flex flex-row">
                          <h2 className="text-2xl mb-5 font-semibold">
                            Financial Strategy
                          </h2>
                          <button
                            onClick={closePrimaryFModal} 
                            className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                            Target Code
                            <span className="text-[#DD1414]">*</span>
                          </span>
                        </div>
                        <input
                          type="text"
                          value={newPrimaryFTargetCode} 
                          onChange={(e) => setNewPrimaryFTargetCode(e.target.value)}  
                          className="border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <div className="flex flex-col">
                          
                          <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                            Strategy
                            <span className="text-[#DD1414]">*</span>
                          </span>

                          <span className="mb-3">Before inputting a strategy, please follow this format.</span>
                          <span>1. Choose one of the following <span className="font-bold">strategic themes</span>:</span>
                          <ul className="list-disc ml-10 mb-2">
                            <li className="font-bold">Excellence in Service Quality</li>
                            <li className="font-bold">Excellence in Internal Service Systems</li>
                            <li className="font-bold">Excellence in Organizational Stewardship</li>
                          </ul>
                          <span>2. After selecting the theme, leave a space and then input the <span className="font-bold">target code</span> followed by a colon <span className="font-bold">(:)</span></span>
                          <span className="mt-2">3. Finally, write the <span className="font-bold">strategy.</span></span>
                          <span className="mt-5">The correct fomat should be: <span className="font-bold">Strategic Theme Target Code: Strategy</span></span>
                          <span className="font-bold">Example: <span className="font-bold text-red-500">Excellence in Service Quality T001: Improve customer response time.</span></span>

                          <textarea
                            value={newPrimaryFStrategy} 
                            onChange={(e) => setNewPrimaryFStrategy(e.target.value)}  
                            className="border border-gray-300 pl-2 pr-2 mt-3 rounded-lg w-[66.4rem] h-[10rem]"
                          />
                        </div>
                        <div className="flex flex-row justify-center mt-2 gap-10">
                          <button
                            onClick={closePrimaryFModal}
                            className=" text-[#AB3510] font-semibold text-lg hover:bg-[#AB3510] border border-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => { 
                              await handlePrimaryFSave(); //change 
                              fetchPrimaryFinancialStrategies(department_id); //change 
                            }}
                            className="text-[#ffffff] text-lg font-semibold px-4 py-3 mt-4 rounded-lg w-40"
                            style={{
                              background: "linear-gradient(to left, #8a252c, #AB3510)",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-[#ffffff] mt-[-1rem] w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 overflow-y-auto overflow-x-hidden">
                    {primaryFinancialStrategies.map( // Map the fetched primary data directly
                      (strategy: GeneratedSentence, index: number) => (
                        <div
                          key={strategy.id}
                          className={`flex items-center flex-row pt-4 pr-5 pb-4 w-[100%] ${
                            index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
                          }`}
                        >
                            <div className="pr-3 pl-3 w-[100%] h-10 mt-2 font-medium">
                              {strategy.value}   
                              {/* change */}
                            </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedComponent === "Learning & Growth" && (
                <div className="flex flex-col align-middle items-center justify-center w-[100%]">
                  <div className="flex flex-row">
                  <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                    <img
                      src="/learning.png"
                      alt=""
                      className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        Primary: Culture & People Development Overview
                      </span>
                      <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        Enhances organizational culture and employee growth.
                      </span>
                    </div>
                  </div>
                <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] pr-1 pt-1 pb-1 mt-2 ml-[60.2rem]">
                  <button onClick={openPrimaryLGModal} className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"> 
                    
                    <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  </button>
                </div>
                </div>
                  {isPrimaryLGModalOpen && ( 
                    <div className="fixed inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                      <div className="bg-white p-8 rounded-lg z-10 h-[auto] w-[70rem]">
                        <div className="flex flex-row">
                          <h2 className="text-2xl mb-5 font-semibold">
                            Learning & Growth Strategy
                          </h2>
                          <button
                            onClick={closePrimaryLGModal} 
                            className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                            Target Code
                            <span className="text-[#DD1414]">*</span>
                          </span>
                        </div>
                        <input
                          type="text"
                          value={newPrimaryLGTargetCode} 
                          onChange={(e) => setNewPrimaryLGTargetCode(e.target.value)}  
                          className="border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <div className="flex flex-col">
                          
                          <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                            Strategy
                            <span className="text-[#DD1414]">*</span>
                          </span>

                          <span className="mb-3">Before inputting a strategy, please follow this format.</span>
                          <span>1. Choose one of the following <span className="font-bold">strategic themes</span>:</span>
                          <ul className="list-disc ml-10 mb-2">
                            <li className="font-bold">Excellence in Service Quality</li>
                            <li className="font-bold">Excellence in Internal Service Systems</li>
                            <li className="font-bold">Excellence in Organizational Stewardship</li>
                          </ul>
                          <span>2. After selecting the theme, leave a space and then input the <span className="font-bold">target code</span> followed by a colon <span className="font-bold">(:)</span></span>
                          <span className="mt-2">3. Finally, write the <span className="font-bold">strategy.</span></span>
                          <span className="mt-5">The correct fomat should be: <span className="font-bold">Strategic Theme Target Code: Strategy</span></span>
                          <span className="font-bold">Example: <span className="font-bold text-red-500">Excellence in Service Quality T001: Improve customer response time.</span></span>

                          <textarea
                            value={newPrimaryLGStrategy} 
                            onChange={(e) => setNewPrimaryLGStrategy(e.target.value)}  
                            className="border border-gray-300 pl-2 pr-2 mt-3 rounded-lg w-[66.4rem] h-[10rem]"
                          />
                        </div>
                        <div className="flex flex-row justify-center mt-2 gap-10">
                          <button
                            onClick={closePrimaryLGModal}
                            className=" text-[#AB3510] font-semibold text-lg hover:bg-[#AB3510] border border-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => { 
                              await handlePrimaryLGSave(); //change
                              fetchPrimaryLearningGrowthStrategies(department_id); //change 
                            }}
                            className="text-[#ffffff] text-lg font-semibold px-4 py-3 mt-4 rounded-lg w-40"
                            style={{
                              background: "linear-gradient(to left, #8a252c, #AB3510)",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-[#ffffff] mt-[-1rem] w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 overflow-y-auto overflow-x-hidden">
                    {primaryLearningGrowthStrategies.map( // Map the fetched primary data directly
                      (strategy: GeneratedSentence, index: number) => (
                        <div
                          key={strategy.id}
                          className={`flex items-center flex-row pt-4 pr-5 pb-4 w-[100%] ${
                            index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
                          }`}
                        >
                            <div className="pr-3 pl-3 w-[100%] h-10 mt-2 font-medium">
                              {strategy.value}   
                              {/* change */}
                            </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              {selectedComponent === "Internal Process" && (
                <div className="flex flex-col align-middle items-center justify-center w-[100%]">
                  <div className="flex flex-row">
                  <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                    <img
                      src="/internal.png"
                      alt=""
                      className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        Primary: Process & Technology Overview
                      </span>
                      <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        Optimizes and manages internal processes and technology.
                      </span>
                    </div>
                  </div>
                <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] pr-1 pt-1 pb-1 mt-2 ml-[63.2rem]">
                  <button onClick={openPrimaryIPModal} className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"> 
                     
                    <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  </button>
                </div>
                </div>
                  {isPrimaryIPModalOpen && (  
                    <div className="fixed inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                      <div className="bg-white p-8 rounded-lg z-10 h-[auto] w-[70rem]">
                        <div className="flex flex-row">
                          <h2 className="text-2xl mb-5 font-semibold">
                            Internal Process Strategy
                          </h2>
                          <button
                            onClick={closeIPModal} 
                            className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                            Target Code
                            <span className="text-[#DD1414]">*</span>
                          </span>
                        </div>
                        <input
                          type="text"
                          value={newPrimaryIPTargetCode} 
                          onChange={(e) => setNewPrimaryIPTargetCode(e.target.value)}  
                          className="border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <div className="flex flex-col">
                          
                          <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                            Strategy
                            <span className="text-[#DD1414]">*</span>
                          </span>

                          <span className="mb-3">Before inputting a strategy, please follow this format.</span>
                          <span>1. Choose one of the following <span className="font-bold">strategic themes</span>:</span>
                          <ul className="list-disc ml-10 mb-2">
                            <li className="font-bold">Excellence in Service Quality</li>
                            <li className="font-bold">Excellence in Internal Service Systems</li>
                            <li className="font-bold">Excellence in Organizational Stewardship</li>
                          </ul>
                          <span>2. After selecting the theme, leave a space and then input the <span className="font-bold">target code</span> followed by a colon <span className="font-bold">(:)</span></span>
                          <span className="mt-2">3. Finally, write the <span className="font-bold">strategy.</span></span>
                          <span className="mt-5">The correct fomat should be: <span className="font-bold">Strategic Theme Target Code: Strategy</span></span>
                          <span className="font-bold">Example: <span className="font-bold text-red-500">Excellence in Service Quality T001: Improve customer response time.</span></span>

                          <textarea
                            value={newPrimaryIPStrategy} 
                            onChange={(e) => setNewPrimaryIPStrategy(e.target.value)}  
                            className="border border-gray-300 pl-2 pr-2 mt-3 rounded-lg w-[66.4rem] h-[10rem]"
                          />
                        </div>
                        <div className="flex flex-row justify-center mt-2 gap-10">
                          <button
                            onClick={closeIPModal}
                            className=" text-[#AB3510] font-semibold text-lg hover:bg-[#AB3510] border border-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => { 
                              await handlePrimaryIPSave(); //change 
                              fetchExistingStrategies(department_id); //change 
                            }}
                            className="text-[#ffffff] text-lg font-semibold px-4 py-3 mt-4 rounded-lg w-40"
                            style={{
                              background: "linear-gradient(to left, #8a252c, #AB3510)",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-[#ffffff] mt-[-1rem] w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 overflow-y-auto overflow-x-hidden">
                    {primaryInternalProcessStrategies.map( // Map the fetched primary data directly
                        (strategy: GeneratedSentence, index: number) => (
                          <div
                            key={strategy.id}
                            className={`flex items-center flex-row pt-4 pr-5 pb-4 w-[100%] ${
                              index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
                            }`}
                          >
                            <div className="pr-3 pl-3 w-[100%] h-10 mt-2 font-medium">
                              {strategy.value}   
                              {/* change */}
                            </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              {selectedComponent === "Stakeholder" && (
                <div className="flex flex-col align-middle items-center justify-center w-[100%]">
                  <div className="flex flex-row">
                  <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                    <img
                      src="/stakeholder.png"
                      alt=""
                      className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        Primary: Client Relationship Overview
                      </span>
                      <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        Measures client engagement quality and value.
                      </span>
                    </div>
                  </div>
                <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] pr-1 pt-1 pb-1 mt-2 ml-[67.5rem]">
                  <button onClick={openPrimarySModal} className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"> 
                    
                    <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  </button>
                </div>
                </div>
                  {isPrimarySModalOpen && (  
                    <div className="fixed inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                      <div className="bg-white p-8 rounded-lg z-10 h-[auto] w-[70rem]">
                        <div className="flex flex-row">
                          <h2 className="text-2xl mb-5 font-semibold">
                            Stakeholder Strategy
                          </h2>
                          <button
                            onClick={closePrimarySModal} 
                            className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                            Target Code
                            <span className="text-[#DD1414]">*</span>
                          </span>
                        </div>
                        <input
                          type="text"
                          value={newPrimarySTargetCode} 
                          onChange={(e) => setNewPrimarySTargetCode(e.target.value)}  
                          className="border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <div className="flex flex-col">
                          
                          <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                            Strategy
                            <span className="text-[#DD1414]">*</span>
                          </span>

                          <span className="mb-3">Before inputting a strategy, please follow this format.</span>
                          <span>1. Choose one of the following <span className="font-bold">strategic themes</span>:</span>
                          <ul className="list-disc ml-10 mb-2">
                            <li className="font-bold">Excellence in Service Quality</li>
                            <li className="font-bold">Excellence in Internal Service Systems</li>
                            <li className="font-bold">Excellence in Organizational Stewardship</li>
                          </ul>
                          <span>2. After selecting the theme, leave a space and then input the <span className="font-bold">target code</span> followed by a colon <span className="font-bold">(:)</span></span>
                          <span className="mt-2">3. Finally, write the <span className="font-bold">strategy.</span></span>
                          <span className="mt-5">The correct fomat should be: <span className="font-bold">Strategic Theme Target Code: Strategy</span></span>
                          <span className="font-bold">Example: <span className="font-bold text-red-500">Excellence in Service Quality T001: Improve customer response time.</span></span>

                          <textarea
                            value={newPrimarySStrategy}  
                            onChange={(e) => setNewPrimarySStrategy(e.target.value)}  
                            className="border border-gray-300 pl-2 pr-2 mt-3 rounded-lg w-[66.4rem] h-[10rem]"
                          />
                        </div>
                        <div className="flex flex-row justify-center mt-2 gap-10">
                          <button
                            onClick={closeSModal}
                            className=" text-[#AB3510] font-semibold text-lg hover:bg-[#AB3510] border border-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => { 
                              await handlePrimarySSave(); //change 
                              fetchExistingStrategies(department_id); //change 
                            }}
                            className="text-[#ffffff] text-lg font-semibold px-4 py-3 mt-4 rounded-lg w-40"
                            style={{
                              background: "linear-gradient(to left, #8a252c, #AB3510)",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-[#ffffff] mt-[-1rem] w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 overflow-y-auto overflow-x-hidden">
                  {primaryStakeholderStrategies.map( // Map the correct array
                    (strategy: GeneratedSentence, index: number) => (
                      <div
                        key={strategy.id}
                        className={`flex items-center flex-row pt-4 pr-5 pb-4 w-[100%] ${
                          index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
                        }`}
                      >
                        <div className="pr-3 pl-3 w-[100%] h-10 mt-2 font-medium">
                          {strategy.value}   
                        </div>
                      </div>
                    )
                  )}
                  </div>
                </div>
              )}
              </div>
            )}

              {/* Warning Dialog */}
              <Dialog open={showWarning} onClose={handleCancelClear} className="rounded-xl">
                <DialogTitle className="text-2xl mb-4 justify-center font-semibold mt-5 text-center">Warning: Clear Tables</DialogTitle>
                <DialogContent>
                  <p className="text-xl mb-4 text-center justify-center font-regular">
                    Are you sure you want to sort? This will clear any existing data in the Financial, Stakeholder, Internal Process, and Learning & Growth tables. 
                  </p>
                </DialogContent>
                <div className="flex items-center justify-center">
                  <DialogActions className="mt-[-2rem] mb-5 ml-[-3rem]">
                    <button 
                      onClick={handleCancelClear} 
                      className="rounded-[0.6rem] text-[#AB3510] border border-[#AB3510] hover:text-white hover:bg-[#AB3510] break-words font-regular text-lg flex pt-2 pr-3 pl-5 pb-2 w-36 h-[fit-content] ml-14 mb-2 mt-8 justify-center"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleConfirmClear(department_id)} 
                      className="rounded-[0.6rem] text-[#ffffff] break-words font-regular text-lg flex pt-[0.60rem] pr-3 pl-5 pb-2 w-36 h-[fit-content] ml-14 mb-2 mt-8 items-center text-center align-middle justify-center"
                      style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                    >
                      Confirm
                    </button>
                  </DialogActions>
                </div>
              </Dialog>

              {/* SECONDARY VIEW */}
              {/* main container */}
              {currentView === "secondary" && (
                <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF]  mr-10 flex flex-col pt-4 pr-5 pl-5 w-[96%] h-auto mb-10 rounded-lg">
                {selectedComponent === "Financial" && (
                  <div className="flex flex-col align-middle items-center justify-center w-[100%]">
                    <div className="flex flex-row">
                    <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                      <img
                        src="/financial.png"
                        alt=""
                        className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Financial Report Overview
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Measures financial performance and profitability.
                        </span>
                      </div>
                    </div>
                    {/* add button here */}
                  <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] pr-1 pt-1 pb-1 mt-2 ml-[68rem]">
                    <button onClick={openFModal} className="text-[#ffffff] w-[3rem] h-6 cursor-pointer">
                      <div className="flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-8"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    </button>
                  </div>
                  </div>
                    {isFModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[auto] w-[70rem]">
                          <div className="flex flex-row">
                            <h2 className="text-2xl mb-5 font-semibold">
                              Financial Strategy
                            </h2>
                            <button
                              onClick={closeFModal}
                              className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                              Target Code
                              <span className="text-[#DD1414]">*</span>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={newFTargetCode}
                            onChange={(e) => setNewFTargetCode(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4"
                          />
                          <div className="flex flex-col">
                            
                            <span className="mr-3 mb-2 font-bold break-words font-regular text-lg">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>

                            <span className="mb-3">Before inputting a strategy, please follow this format.</span>
                            <span>1. Choose one of the following <span className="font-bold">strategic themes</span>:</span>
                            <ul className="list-disc ml-10 mb-2">
                              <li className="font-bold">Excellence in Service Quality</li>
                              <li className="font-bold">Excellence in Internal Service Systems</li>
                              <li className="font-bold">Excellence in Organizational Stewardship</li>
                            </ul>
                            <span>2. After selecting the theme, leave a space and then input the <span className="font-bold">target code</span> followed by a colon <span className="font-bold">(:)</span></span>
                            <span className="mt-2">3. Finally, write the <span className="font-bold">strategy.</span></span>
                            <span className="mt-5">The correct fomat should be: <span className="font-bold">Strategic Theme Target Code: Strategy</span></span>
                            <span className="font-bold">Example: <span className="font-bold text-red-500">Excellence in Service Quality T001: Improve customer response time.</span></span>

                            <textarea
                              value={newFStrategy}
                              onChange={(e) => setNewFStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 mt-3 rounded-lg w-[66.4rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeFModal}
                              className=" text-[#AB3510] font-semibold text-lg hover:bg-[#AB3510] border border-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => { 
                                await handleFSave();
                                fetchExistingStrategies(department_id); 
                              }}
                              className="text-[#ffffff] text-lg font-semibold px-4 py-3 mt-4 rounded-lg w-40"
                              style={{
                                background: "linear-gradient(to left, #8a252c, #AB3510)",
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffffff] mt-[-1rem] w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 overflow-y-auto overflow-x-hidden">
                      {strategies.financial.map(
                        (strategy: GeneratedSentence,  index: number) => (
                          <div
                            key={strategy.id}
                            className={`flex items-center flex-row pt-4 pr-5 pb-4 w-[100%] ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                          >
                            {/* edit div */}
                            {editingStrategy === strategy ? (
                              <div className="pr-3 pl-3 w-[100%] h-10 flex">
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
                              <div className="pr-3 pl-3 w-[100%] h-10 mt-2 font-medium">
                                {strategy.value}
                              </div>
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

                              <button
                                onClick={() =>handleFinancialDelete(strategy.fID)}
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {selectedComponent === "Learning" && (
                  // LEARNING & GROWTH
                  <div className="flex flex-col align-middle items-center justify-center  w-[100%]">
                    <div className="flex flex-row">
                    <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                      <img
                        src="/learning.png"
                        alt=""
                        className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Culture & People Development Overview
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Enhances organizational culture and employee growth.
                        </span>
                      </div>
                    </div>
                    {/* add button here */}
                  <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] pr-1 pt-1 pb-1 mt-2 ml-[65.5rem]">
                    <button onClick={openLGModal} className="text-[#ffffff] w-[3rem] h-6 cursor-pointer">
                      <div className="flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-8"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    </button>
                  </div>
                  </div>
                    {isLGModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[auto] w-[77rem]">
                          <div className="flex flex-row">
                            <h2 className="text-2xl mb-5 font-semibold">
                              Learning & Growth Strategy
                            </h2>
                            <button
                              onClick={closeLGModal}
                              className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-bold text-lg">
                              Target Code
                              <span className="text-[#DD1414]">*</span>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={newLGTargetCode}
                            onChange={(e) => setNewLGTargetCode(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4"
                          />
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-bold text-lg">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <span className="mb-3">Before inputting a strategy, please follow this format.</span>
                            <span>1. Choose one of the following <span className="font-bold">strategic themes</span>:</span>
                            <ul className="list-disc ml-10 mb-2">
                              <li className="font-bold">Excellence in Service Quality</li>
                              <li className="font-bold">Excellence in Internal Service Systems</li>
                              <li className="font-bold">Excellence in Organizational Stewardship</li>
                            </ul>
                            <span>2. After selecting the theme, leave a space and then input the <span className="font-bold">target code</span> followed by a colon <span className="font-bold">(:)</span></span>
                            <span className="mt-2">3. Finally, write the <span className="font-bold">strategy.</span></span>
                            <span className="mt-5">The correct fomat should be: <span className="font-bold">Strategic Theme Target Code: Strategy</span></span>
                            <span className="font-bold">Example: <span className="font-bold text-red-500">Excellence in Service Quality T001: Improve customer response time.</span></span>

                            <textarea
                              value={newLGStrategy}
                              onChange={(e) => setNewLGStrategy(e.target.value)}
                              className="border border-gray-300 mt-5 pl-2 pr-2 rounded-lg w-[73rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeLGModal}
                              className=" text-[#AB3510] font-semibold text-lg hover:bg-[#AB3510] border border-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => { 
                                await handleLGSave();
                                fetchExistingStrategies(department_id); 
                              }}
                              className="text-[#ffffff] text-lg font-semibold px-4 py-3 mt-4 rounded-lg w-40"
                              style={{
                                background: "linear-gradient(to left, #8a252c, #AB3510)",
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffffff] mt-[-1rem] w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 overflow-y-auto overflow-x-hidden">
                      {strategies.learningGrowth.map(
                        (strategy: GeneratedSentence,  index: number) => (
                          <div
                            key={strategy.id}
                            className={`flex items-center flex-row pt-4 pr-5 pb-4 w-[100%] ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                          >
                            {/* edit div */}
                            {editingStrategy === strategy ? (
                              <div className="pr-3 pl-3 w-[100%] h-10 flex">
                                <input
                                  type="text"
                                  value={newStrategyValue}
                                  onChange={(e) =>
                                    setNewStrategyValue(e.target.value)
                                  }
                                  className="w-full rounded-lg border border-orange-400 px-2"
                                />
                                <button
                                  onClick={() =>
                                    handleLearningGrowthSaveEdit(
                                      // @ts-ignore
                                      strategy.fID,
                                      newStrategyValue,
                                      department_id
                                    )
                                  }
                                  className="bg-[#AB3510] hover:bg-[#ee6c44] text-white font-bold py-2 px-4 rounded ml-2"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="pr-3 pl-3 w-[100%] h-10 mt-2 font-medium">
                                {strategy.value}
                              </div>
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

                              <button
                                onClick={() =>handleLGDelete(strategy.fID)}
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {selectedComponent === "Internal" && (
                  // INTERNAL PROCESS
                  <div className="flex flex-col align-middle items-center justify-center w-[100%]">
                    <div className="flex flex-row">
                    <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                      <img
                        src="/internal.png"
                        alt=""
                        className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Process & Technology Overview
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Optimizes and manages internal processes and technology.
                        </span>
                      </div>
                    </div>
                    {/* add button here */}
                  <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] pr-1 pt-1 pb-1 mt-2 ml-[63rem]">
                    <button onClick={openIPModal} className="text-[#ffffff] w-[3rem] h-6 cursor-pointer">
                      <div className="flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-8"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    </button>
                  </div>
                  </div>
                    {isIPModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[auto] w-[75rem]">
                          <div className="flex flex-row">
                            <h2 className="text-2xl mb-5 font-semibold">
                              Internal Process Strategy
                            </h2>
                            <button
                              onClick={closeIPModal}
                              className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-bold text-lg">
                              Target Code
                              <span className="text-[#DD1414]">*</span>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={newIPTargetCode}
                            onChange={(e) => setNewIPTargetCode(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4"
                          />
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-bold text-lg">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <span className="mb-3">Before inputting a strategy, please follow this format.</span>
                            <span>1. Choose one of the following <span className="font-bold">strategic themes</span>:</span>
                            <ul className="list-disc ml-10 mb-2">
                              <li className="font-bold">Excellence in Service Quality</li>
                              <li className="font-bold">Excellence in Internal Service Systems</li>
                              <li className="font-bold">Excellence in Organizational Stewardship</li>
                            </ul>
                            <span>2. After selecting the theme, leave a space and then input the <span className="font-bold">target code</span> followed by a colon <span className="font-bold">(:)</span></span>
                            <span className="mt-2">3. Finally, write the <span className="font-bold">strategy.</span></span>
                            <span className="mt-5">The correct fomat should be: <span className="font-bold">Strategic Theme Target Code: Strategy</span></span>
                            <span className="font-bold">Example: <span className="font-bold text-red-500">Excellence in Service Quality T001: Improve customer response time.</span></span>

                            <textarea
                              value={newIPStrategy}
                              onChange={(e) => setNewIPStrategy(e.target.value)}
                              className="border border-gray-300 mt-5 pl-2 pr-2 rounded-lg w-[71rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeIPModal}
                              className=" text-[#AB3510] font-semibold text-lg hover:bg-[#AB3510] border border-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => { 
                                await handleIPSave();
                                fetchExistingStrategies(department_id); 
                              }}
                              className="text-[#ffffff] text-lg font-semibold px-4 py-3 mt-4 rounded-lg w-40"
                              style={{
                                background: "linear-gradient(to left, #8a252c, #AB3510)",
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffffff] mt-[-1rem] w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 overflow-y-auto overflow-x-hidden">
                      {strategies.internalProcess.map(
                        (strategy: GeneratedSentence,  index: number) => (
                          <div
                            key={strategy.id}
                            className={`flex items-center flex-row pt-4 pr-5 pb-4 w-[100%] ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                          >
                            {/* edit div */}
                            {editingStrategy === strategy ? (
                              <div className="pr-3 pl-3 w-[100%] h-10 flex">
                                <input
                                  type="text"
                                  value={newStrategyValue}
                                  onChange={(e) =>
                                    setNewStrategyValue(e.target.value)
                                  }
                                  className="w-full rounded-lg border border-orange-400 px-2"
                                />
                                <button
                                  onClick={() =>
                                    handleInternalProcessSaveEdit(
                                      // @ts-ignore
                                      strategy.fID,
                                      newStrategyValue,
                                      department_id
                                    )
                                  }
                                  className="bg-[#AB3510] hover:bg-[#ee6c44] text-white font-bold py-2 px-4 rounded ml-2"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="pr-3 pl-3 w-[100%] h-10 mt-2 font-medium">
                                {strategy.value}
                              </div>
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

                              <button
                                onClick={() =>handleInternalDelete(strategy.fID)}
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {selectedComponent === "Stakeholder" && (
                  // STAKEHOLDER
                  <div className="flex flex-col align-middle items-center justify-center w-[100%]">
                    <div className="flex flex-row">
                    <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                      <img
                        src="/stakeholder.png"
                        alt=""
                        className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Client Relationship Overview
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Measures client engagement quality and value.
                        </span>
                      </div>
                    </div>
                    {/* add button here */}
                  <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] pr-1 pt-1 pb-1 mt-2 ml-[69rem]">
                    <button onClick={openSModal} className="text-[#ffffff] w-[3rem] h-6 cursor-pointer">
                      <div className="flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-8"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    </button>
                  </div>
                  </div>
                    {isSModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[auto] w-[71.9rem]">
                          <div className="flex flex-row">
                            <h2 className="text-2xl mb-5 font-semibold">
                              Stakeholder Strategy
                            </h2>
                            <button
                              onClick={closeSModal}
                              className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-bold text-lg">
                              Target Code
                              <span className="text-[#DD1414]">*</span>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={newSTargetCode}
                            onChange={(e) => setNewSTargetCode(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4"
                          />
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-bold text-lg ">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <span className="mb-3">Before inputting a strategy, please follow this format.</span>
                            <span>1. Choose one of the following <span className="font-bold">strategic themes</span>:</span>
                            <ul className="list-disc ml-10 mb-2">
                              <li className="font-bold">Excellence in Service Quality</li>
                              <li className="font-bold">Excellence in Internal Service Systems</li>
                              <li className="font-bold">Excellence in Organizational Stewardship</li>
                            </ul>
                            <span>2. After selecting the theme, leave a space and then input the <span className="font-bold">target code</span> followed by a colon <span className="font-bold">(:)</span></span>
                            <span className="mt-2">3. Finally, write the <span className="font-bold">strategy.</span></span>
                            <span className="mt-5">The correct fomat should be: <span className="font-bold">Strategic Theme Target Code: Strategy</span></span>
                            <span className="font-bold">Example: <span className="font-bold text-red-500">Excellence in Service Quality T001: Improve customer response time.</span></span>

                            <textarea
                              value={newSStrategy}
                              onChange={(e) => setNewSStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 mt-5 rounded-lg w-[68rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeSModal}
                              className=" text-[#AB3510] font-semibold text-lg border border-[#AB3510] hover:bg-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => { 
                                await handleSSave();
                                fetchExistingStrategies(department_id); 
                              }}
                              className="text-[#ffffff] text-lg font-semibold px-4 py-3 mt-4 rounded-lg w-40"
                              style={{
                                background: "linear-gradient(to left, #8a252c, #AB3510)",
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffffff] mt-[-1rem] w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 overflow-y-auto overflow-x-hidden">
                      {strategies.stakeholder.map(
                        (strategy: GeneratedSentence,  index: number) => (
                          <div
                            key={strategy.id}
                            className={`flex items-center flex-row pt-4 pr-5 pb-4 w-[100%] ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                          >
                            {/* edit div */}
                            {editingStrategy === strategy ? (
                              <div className="pr-3 pl-3 w-[100%] h-10 flex">
                                <input
                                  type="text"
                                  value={newStrategyValue}
                                  onChange={(e) =>
                                    setNewStrategyValue(e.target.value)
                                  }
                                  className="w-full rounded-lg border border-orange-400 px-2"
                                />
                                <button
                                  onClick={() =>
                                    handleStakeholderSaveEdit(
                                      // @ts-ignore
                                      strategy.fID,
                                      newStrategyValue,
                                      department_id
                                    )
                                  }
                                  className="bg-[#AB3510] hover:bg-[#ee6c44] text-white font-bold py-2 px-4 rounded ml-2"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="pr-3 pl-3 w-[100%] h-10 mt-2 font-medium">
                                {strategy.value}
                              </div>
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

                              <button
                                onClick={() =>handleStakeholderDelete(strategy.fID)}
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              )}
              {/* end of main container */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
