"use client";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Page = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  const username = user?.username;

  useEffect(() => {

    fetchProfileGoals();

    if (username) {
      checkGeneratedAiStrats(username);
    }
  }, [session]);

  interface ResponseRow {
    "s_oResponses": string;
    "s_tResponses": string;
    "w_oResponses": string;
    "w_tResponses": string;
  }

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
  const [showVisionCard, setShowVisionCard] = useState(false);
  const [showValuesCard, setShowValuesCard] = useState(false);
  const [showMissionCard, setShowMissionCard] = useState(false);
  const [visionSaved, setVisionSaved] = useState(false);
  const [valuesSaved, setValuesSaved] = useState(false);
  const [missionSaved, setMissionSaved] = useState(false);
  const [visionInput, setVisionInput] = useState("");
  const [valuesInput, setValuesInput] = useState("");
  const [missionInput, setMissionInput] = useState("");
  const [showVisionDropdown, setShowVisionDropdown] = useState(false);
  const [showValuesDropdown, setShowValuesDropdown] = useState(false);
  const [showMissionDropdown, setShowMissionDropdown] = useState(false);
  const [buttonVisionLabel, setVisionButtonLabel] = useState("Add");
  const [buttonValuesLabel, setValuesButtonLabel] = useState("Add");
  const [buttonMissionLabel, setMissionButtonLabel] = useState("Add");
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [newStrategyValue, setNewStrategyValue] = useState("");


  // @ts-ignore
  const handleEditClick = (strategy) => {
    setEditingStrategy(strategy);
    setNewStrategyValue(strategy.value);
  };

  const [strategies, setStrategies] = useState<StrategyCategories>({
    financial: [],
    stakeholder: [],
    internalProcess: [],
    learningGrowth: [],
  });

  const [selectedPerspective, setSelectedPerspective] = useState("financial");

  const handleTextareaChange = (
    setStateFunction: React.Dispatch<React.SetStateAction<string>>,
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setStateFunction(event.target.value);
  };

  const toggleDropdown = (section: string) => {
    switch (section) {
      case "vision":
        setShowVisionDropdown(!showVisionDropdown);
        break;
      case "values":
        setShowValuesDropdown(!showValuesDropdown);
        break;
      case "mission":
        setShowMissionDropdown(!showMissionDropdown);
        break;
      default:
        break;
    }
  };

  const handleMoreClick = (section: string) => {
    toggleDropdown(section);
  };

  const handleAddClick = (
    section: string,
    setButtonLabel: React.Dispatch<React.SetStateAction<string>>,
    setTextareaDisabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    toggleDropdown(section);
    switch (section) {
      case "vision":
        setShowVisionCard(true);
        setVisionSaved(false);
        setVisionButtonLabel("Save");
        setTextareaDisabled(false);
        break;
      case "values":
        setShowValuesCard(true);
        setValuesSaved(false);
        setValuesButtonLabel("Save");
        setTextareaDisabled(false);
        break;
      case "mission":
        setShowMissionCard(true);
        setMissionSaved(false);
        setMissionButtonLabel("Save");
        setTextareaDisabled(false);
        break;
      default:
        break;
    }
  };

  const handleVisionSaveClick = (
    setStateFunction: React.Dispatch<React.SetStateAction<boolean>>,
    setButtonLabel: React.Dispatch<React.SetStateAction<string>>,
    setTextareaDisabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setStateFunction(true);
    setVisionButtonLabel("Edit");
    setTextareaDisabled(true);
  };

  const handleValuesSaveClick = (
    setStateFunction: React.Dispatch<React.SetStateAction<boolean>>,
    setButtonLabel: React.Dispatch<React.SetStateAction<string>>,
    setTextareaDisabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setStateFunction(true);
    setValuesButtonLabel("Edit");
    setTextareaDisabled(true);
  };

  const handleMissionSaveClick = (
    setStateFunction: React.Dispatch<React.SetStateAction<boolean>>,
    setButtonLabel: React.Dispatch<React.SetStateAction<string>>,
    setTextareaDisabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setStateFunction(true);
    setMissionButtonLabel("Edit");
    setTextareaDisabled(true);
  };

  const handleVisionDeleteClick = (section: string) => {
    toggleDropdown(section);
  };

  const handleValuesDeleteClick = (section: string) => {
    toggleDropdown(section);
  };

  const handleMissionDeleteClick = (section: string) => {
    toggleDropdown(section);
  };

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
    This should be your sample output: "(category number 1-4). (whichever strategic theme you think fits the response) W2T1: Implement contingency plans to ensure continuity during economic downturns." DO NOT ADD ANY MARKUP.
    `;

  const fetchProfileGoals = async () => {

    console.log("fetching profile goals");

    try {
      const response = await fetch(`http://localhost:8080/goals/get/department/${department_id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Received data:", data); // Log the received data

        const fetchedData = `
        Office Vision: ${data.vision}
        Value Proposition: ${data.proposition}
      `;

        const updatedSystemPrompt = `${SYSTEM_PROMPT}
      ${fetchedData}`;

        console.log("Updated System Prompt:", updatedSystemPrompt); // Log the updated system prompt

      } else {
        console.error("Error fetching user profile data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=AIzaSyATO5xndEGhEgXrHdeYLOiTbZqtUwYuZqE`;

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
      const categorizedSentences: GeneratedSentence[] =
        generatedSentences.reduce((acc, sentence) => {
          const parts = sentence.split(". ");
          if (parts.length === 2) {
            const prefix = parts[0];
            const content = parts[1];
            const id = parseInt(prefix);
            if (!isNaN(id) && id >= 1 && id <= 4) {
              // @ts-ignore
              acc.push({ id, value: content });
            } else {
              console.warn("Unexpected prefix:", prefix);
            }
          } else {
            console.warn("Invalid sentence format:", sentence);
          }
          return acc;
        }, []);
      return categorizedSentences;
    } catch (error) {
      console.error(
        `Error fetching data or processing Gemini response for ${apiEndpoint}:`,
        error
      );
      return []; // Return an empty array on error
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

  const handleDeleteClick = {};

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

  const [selectedComponent, setSelectedComponent] = useState("");

  const changeComponent = (componentName: string) => {
    localStorage.setItem("lastComponent", componentName);
    setSelectedComponent(componentName);
  };

  useEffect(() => {
    const lastComponent = localStorage.getItem("lastComponent");
    if (lastComponent) {
      setSelectedComponent(lastComponent);
    }
  }, []);

  const [officeVision, setOfficeVision] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [mission, setMission] = useState("");

  useEffect(() => {
    const fetchProfileGoals = async () => {
      try {
        const response = await fetch(`http://localhost:8080/goals/get/department/${department_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data); // Add this line to log the received data
          setOfficeVision(data.vision);
          setValueProposition(data.proposition);
          setMission(data.mission)
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


  return (
    <div className="flex flex-row w-full text-[rgb(59,59,59)]">
      <Navbar />
      <div className="flex-1 h-screen">
        <div className="flex-1 flex flex-col mt-8 ml-80">
          <div className="flex flex-row">
            <span className="break-words font-bold text-[3rem]">
              Strategy Mapping
            </span>
            {/* perspectives toggle */}
            <div className="flex justify-center ml-[35rem] mt-[0.5rem] border border-gray-200 bg-gray w-[44rem] h-[4rem] rounded-xl px-1 py-1">
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
                  onClick={() => changeComponent("Internal")}
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
                  onClick={() => changeComponent("Learning")}
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

              <div className="container mx-auto px-4 mb-16">
                <div className="mt-[-3rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-[10rem] w-[102rem] ml-[-6rem]">
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

              

              {/* main container */}
              <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[96%] h-auto mb-10 rounded-lg">
                {selectedComponent === "Financial" && (
                  <div className="flex flex-col align-middle items-center justify-center relative w-[100%]">
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
                          fill-rule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    </button>
                  </div>
                  </div>
                    {isFModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[29rem] w-[70rem]">
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
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
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
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <textarea
                              value={newFStrategy}
                              onChange={(e) => setNewFStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 rounded-lg w-[66.4rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeFModal}
                              className=" text-[#8a252c] font-semibold text-lg hover:bg-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
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
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
                  <div className="flex flex-col align-middle items-center justify-center relative w-[100%]">
                    <div className="flex flex-row">
                    <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                      <img
                        src="/financial.png"
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
                          fill-rule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    </button>
                  </div>
                  </div>
                    {isLGModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[29rem] w-[77rem]">
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
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
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
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <textarea
                              value={newLGStrategy}
                              onChange={(e) => setNewLGStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 rounded-lg w-[73rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeLGModal}
                              className=" text-[#8a252c] font-semibold text-lg hover:bg-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
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
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
                  <div className="flex flex-col align-middle items-center justify-center relative w-[100%]">
                    <div className="flex flex-row">
                    <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                      <img
                        src="/financial.png"
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
                          fill-rule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    </button>
                  </div>
                  </div>
                    {isIPModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[29rem] w-[75rem]">
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
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
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
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <textarea
                              value={newIPStrategy}
                              onChange={(e) => setNewIPStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 rounded-lg w-[71rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeIPModal}
                              className=" text-[#8a252c] font-semibold text-lg hover:bg-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
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
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
                  <div className="flex flex-col align-middle items-center justify-center relative w-[100%]">
                    <div className="flex flex-row">
                    <div className="flex flex-row p-1 h-auto ml-[-1rem]">
                      <img
                        src="/financial.png"
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
                          fill-rule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    </button>
                  </div>
                  </div>
                    {isSModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[29rem] w-[71.9rem]">
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
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
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
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <textarea
                              value={newSStrategy}
                              onChange={(e) => setNewSStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 rounded-lg w-[68rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeSModal}
                              className=" text-[#8a252c] font-semibold text-lg hover:bg-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
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
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
              {/* end of main container */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
