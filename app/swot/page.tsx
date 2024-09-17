"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { FaPlus } from "react-icons/fa";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { getSession, useSession } from "next-auth/react";



interface SwotItem {
  id: string;
  value: string;
}

interface Strategy {
  id: string;
  w_tResponses: string;
}

interface Strategy1 {
  id: string;
  s_tResponses: string;
}

interface Strategy2 {
  id: string;
  s_oResponses: string;
}

interface Strategy3 {
  id: string;
  w_oResponses: string;
}
// new
interface Department {
  id: number;
}
interface Strength {
  id: number;
  value: string;
  department: Department;
  isDelete: boolean;
}
interface Weakness {
  id: number;
  value: string;
  department: Department;
  isDelete: boolean;
}
interface Opportunity {
  id: number;
  value: string;
  department: Department;
  isDelete: boolean;
}
interface Threat {
  id: number;
  value: string;
  department: Department;
  isDelete: boolean;
}



const Swot = () => {
  const [displaySwot, setDisplaySwot] = useState(true);
  const [soApiResponse, setSoApiResponse] = useState("");
  const [woApiResponse, setWoApiResponse] = useState("");
  const [stApiResponse, setStApiResponse] = useState("");
  const [wtApiResponse, setWtApiResponse] = useState("");
  const [counter, setCounter] = useState(1);
  const delay = (ms: number | undefined) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  //new for strength
  const [strengthEditingId, setStrengthEditingId] = useState<string | null>(null); 
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const [strengthToDelete, setStrengthToDelete] = useState<SwotItem | null>(null);
  const openStrengthDeleteModal = (strength: SwotItem) => {
    setStrengthToDelete(strength);
    setIsStrengthModalOpen(true);
  };
  const handleStrengthDeleteConfirm = () => {
    if (strengthToDelete) {
      strengths.deleteStrength(strengthToDelete.id, department_id);
    }
    setIsStrengthModalOpen(false);
    setStrengthToDelete(null);
  };
  // new for weakness
  const [weaknessEditingId, setWeaknessEditingId] = useState<string | null>(null); 
  const [isWeaknessModalOpen, setIsWeaknessModalOpen] = useState(false);
  const [weaknessToDelete, setWeaknessToDelete] = useState<SwotItem | null>(null);
  const openWeaknessDeleteModal = (weakness: SwotItem) => {
    setWeaknessToDelete(weakness);
    setIsWeaknessModalOpen(true);
  };
  const handleWeaknessDeleteConfirm = () => {
    if (weaknessToDelete) {
      weaknesses.deleteWeakness(weaknessToDelete.id, department_id);
    }
    setIsWeaknessModalOpen(false);
    setWeaknessToDelete(null);
  };
  // new for opportunity
  const [opportunityEditingId, setOpportunityEditingId] = useState<string | null>(null); 
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<SwotItem | null>(null);
  const openOpportunityDeleteModal = (opportunity: SwotItem) => {
    setOpportunityToDelete(opportunity);
    setIsOpportunityModalOpen(true);
  };
  const handleOpportunityDeleteConfirm = () => {
    if (opportunityToDelete) {
      opportunities.deleteOpportunities(opportunityToDelete.id, department_id);
    }
    setIsOpportunityModalOpen(false);
    setOpportunityToDelete(null);
  };
  // new for threats
  const [threatEditingId, setThreatEditingId] = useState<string | null>(null); 
  const [isThreatModalOpen, setIsThreatModalOpen] = useState(false);
  const [threatToDelete, setThreatToDelete] = useState<SwotItem | null>(null);
  const openThreatDeleteModal = (threat: SwotItem) => {
    setThreatToDelete(threat);
    setIsThreatModalOpen(true);
  };
  const handleThreatDeleteConfirm = () => {
    if (threatToDelete) {
      threats.deleteThreats(threatToDelete.id, department_id);
    }
    setIsThreatModalOpen(false);
    setThreatToDelete(null);
  };



  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const department_id = user?.department_id;

  const generateStrategies = async () => {
    callWTAPI();
    callSTAPI();
    callWOAPI();
    callSOAPI();
    setModalVisible(true);
  };
  const [wtApiresponse, setWtApiresponse] = useState<Strategy[]>([]);
  const [stApiresponse, setStApiresponse] = useState<Strategy1[]>([]);
  const [soApiresponse, setSoApiresponse] = useState<Strategy2[]>([]);
  const [woApiresponse, setWoApiresponse] = useState<Strategy3[]>([]);

  const fetchData = async () => {
 
    try {
      const response = await fetch(
        `http://localhost:8080/wtStrat/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setWtApiresponse(data);
    } catch (error: any) {
      console.error("Error fetching the data:", error.message);
    } 

  };

  useEffect(() => {
    fetchData();
  }, [department_id]);

  const callWTAPI = async () => {
    try {
      const systemPrompt =
        "You will provide specific actionable strategies that mitigate your weaknesses (W) to avoid threats (T). Keep each strategy within 1 sentence and do not include extra words. If the text is blank, output 'Field is blank.'. Do not output any markdown. You should output in this format: W1T1: sentence here. (new line here) \nW2T2: sentence here.Generate as many strategies as you can from the inputted SWOT. Separate each strategy with a new line.";

      const weaknessesInput = fetchedWeaknesses
        .map(
          (weakness, index) => `${index + 1}. ${weakness.id}: ${weakness.value}`
        )
        .join("\n");

      const threatsInput = fetchedThreats
        .map((threat, index) => `${index + 1}. ${threat.id}: ${threat.value}`)
        .join("\n");

      console.log("Weaknesses Input:", weaknessesInput);
      console.log("Threats Input:", threatsInput);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyATO5xndEGhEgXrHdeYLOiTbZqtUwYuZqE`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt} \n\nWeaknesses:\n${weaknessesInput}\n\nThreats:\n${threatsInput}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log(response);
      const apiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";

      // Split the API response by new line
      const strategiesArray = apiResponse
        .split("\n")
        .filter((str: string) => str.trim());

      // Save each strategy individually to the database
      for (const strategy of strategiesArray) {
        const databaseResponse = await fetch(
          "http://localhost:8080/wtStrat/insert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              w_tResponses: strategy,
              department: { id: department_id },
            }),
          }
        );

        if (!databaseResponse.ok) {
          console.error("Error saving response to database", databaseResponse);
        }
      }

      fetchData();
      // setWtApiResponse(apiResponse);
      // console.log("WT Strategies:", strategiesArray);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setWtApiResponse("An error occurred while calling the API");
    }
  };

  const deleteStrategy = async (id: string, department_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/wtStrat/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, department: { id: department_id } }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

      setWtApiresponse((prevStrategies) =>
        prevStrategies.filter((strategy) => strategy.id !== id)
      );
    } catch (error: any) {
      console.error("Error deleting strategy:", error.message);
    }
  };

  const fetchstData = async () => {
   
    try {
      const response = await fetch(
        `http://localhost:8080/stStrat/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setStApiresponse(data);
    } catch (error: any) {
      console.error("Error fetching the data:", error.message);
    } 

  };

  useEffect(() => {
    fetchstData();
  }, [department_id]);

  const callSTAPI = async () => {
    try {
      const systemPrompt =
        "You will provide specific actionable strategies that leverage your strengths (S) to avoid threats (T). Keep each strategy within 1 sentence and do not include extra words. If the text is blank, output 'Field is blank.'. Do not output any markdown. You should output in this format: S1T1: sentence here. (new line here) \nS2T2: sentence here.Generate as many strategies as you can from the inputted SWOT. Separate each strategy with a new line.";

      const strengthsInput = fetchedStrengths
        .map(
          (strength, index) => `${index + 1}. ${strength.id}: ${strength.value}`
        )
        .join("\n");

      const threatsInput = fetchedThreats
        .map((threat, index) => `${index + 1}. ${threat.id}: ${threat.value}`)
        .join("\n");

      console.log("strengths Input:", strengthsInput);
      console.log("threats Input:", threatsInput);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyATO5xndEGhEgXrHdeYLOiTbZqtUwYuZqE`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt} \n\nStrengths:\n${strengthsInput}\n\nThreats:\n${threatsInput}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("st api: ", response);
      const apiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";

      // Split the API response by new line
      const strategiesArray = apiResponse
        .split("\n")
        .filter((str: string) => str.trim());

      // Save each strategy individually to the database
      for (const strategy of strategiesArray) {
        const databaseResponse = await fetch(
          "http://localhost:8080/stStrat/insert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              s_tResponses: strategy,
              department: { id: department_id },
            }),
          }
        );

        if (!databaseResponse.ok) {
          console.error("Error saving response to database", databaseResponse);
        }
      }
      fetchstData();
      // setStApiResponse(apiResponse);
      // console.log(strategiesArray); // Log the array of responses
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setStApiResponse("An error occurred while calling the API");
    }
  };

  const deletestStrategy = async (id: string, department_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stStrat/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, department: { id: department_id } }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

      setStApiresponse((prevStrategies) =>
        prevStrategies.filter((strategy) => strategy.id !== id)
      );
      // fetchstData();
    } catch (error: any) {
      console.error("Error deleting strategy:", error.message);
    }
  };

  const fetchsoData = async () => {
 
    try {
      const response = await fetch(
        `http://localhost:8080/soStrat/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setSoApiresponse(data);
    } catch (error: any) {
      console.error("Error fetching the data:", error.message);
    } 

  };

  useEffect(() => {
    fetchsoData();
  }, [department_id]);

  const callSOAPI = async () => {
    try {
      const systemPrompt =
        "You will provide specific actionable strategies that leverage your strengths (S) to capitalize on opportunities (O). Keep each strategy within 1 sentence and do not include extra words. If the text is blank, output 'Field is blank.'. Do not output any markdown. You should output in this format: S1O1: sentence here. (new line here) \nS2O2: sentence here.Generate as many strategies as you can from the inputted SWOT. Separate each strategy with a new line.";

      const strengthsInput = fetchedStrengths
        .map(
          (strength, index) => `${index + 1}. ${strength.id}: ${strength.value}`
        )
        .join("\n");

      const OpportunitiesInput = fetchedOpportunities
        .map(
          (opportunity, index) =>
            `${index + 1}. ${opportunity.id}: ${opportunity.value}`
        )
        .join("\n");

      console.log("Strengths Input:", strengthsInput);
      console.log("Opportunities Input:", OpportunitiesInput);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCHBgtESP-yMWPw--FOhDCvHynp3syYpXk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt} \n\nStrengths:\n${strengthsInput}\n\Opportunities:\n${OpportunitiesInput}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("SO API Response:", data);
      const apiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";

      // Split the API response by new line
      const strategiesArray = apiResponse
        .split("\n")
        .filter((str: string) => str.trim());

      // Save each strategy individually to the database
      for (const strategy of strategiesArray) {
        const databaseResponse = await fetch(
          "http://localhost:8080/soStrat/insert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              s_oResponses: strategy,
              department: { id: department_id },
            }),
          }
        );

        if (!databaseResponse.ok) {
          console.error("Error saving response to database", databaseResponse);
        }
      }
      fetchsoData();
      // setSoApiResponse(apiResponse);

      console.log(strategiesArray); // Log the array of responses
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setSoApiResponse("An error occurred while calling the API");
    }
  };

  // Example: Modify all your deleteStrategy functions like this
  const deletesoStrategy = async (id: string, department_id: string): Promise<Response> => { // Explicitly return Response
    try {
      const response = await fetch(
        `http://localhost:8080/soStrat/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, department: { id: department_id } }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

          // Remove the strategy from the state to update the UI
          setSoApiresponse((prevStrategies) =>
            prevStrategies.filter((strategy) => strategy.id !== id)
  
          );
      return response; // Return the response object
    } catch (error: any) {
      console.error("Error deleting strategy:", error.message);
      throw error; // Re-throw the error for handleDeleteConfirm to catch
    }
  };

  useEffect(() => {
    fetchsoData();
  }, [department_id]);

  const fetchwoData = async () => {
  
    try {
      const response = await fetch(
        `http://localhost:8080/woStrat/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
        setWoApiresponse(data); // Otherwise, set the fetched data
      
    } catch (error: any) {
      console.error("Error fetching the data:", error.message);
    }

  };

  useEffect(() => {
    fetchwoData();
  }, [department_id]);

  const callWOAPI = async () => {
    try {
      const systemPrompt =
        "You will provide specific actionable strategies that mitigate your weaknesses (W) to capitalize on opportunities (O). Keep each strategy within 1 sentence and do not include extra words. If the text is blank, output 'Field is blank.'. Do not output any markdown. You should output in this format: W1O1: sentence here. (new line here) \nW2O2: sentence here.Generate as many strategies as you can from the inputted SWOT. Separate each strategy with a new line.";

      const weaknessesInput = fetchedWeaknesses
        .map(
          (weakness, index) => `${index + 1}. ${weakness.id}: ${weakness.value}`
        )
        .join("\n");

      const OpportunitiesInput = fetchedOpportunities
        .map(
          (opportunity, index) =>
            `${index + 1}. ${opportunity.id}: ${opportunity.value}`
        )
        .join("\n");

      console.log("Weaknesses Input:", weaknessesInput);
      console.log("Opportunities Input:", OpportunitiesInput);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCHBgtESP-yMWPw--FOhDCvHynp3syYpXk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt} \n\nWeaknesses:\n${weaknessesInput}\n\Opportunities:\n${OpportunitiesInput}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log(response);
      const apiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";

      // Split the API response by new line
      const strategiesArray = apiResponse
        .split("\n")
        .filter((str: string) => str.trim());

      // Save each strategy individually to the database
      for (const strategy of strategiesArray) {
        const databaseResponse = await fetch(
          "http://localhost:8080/woStrat/insert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              w_oResponses: strategy,
              department: { id: department_id },
            }),
          }
        );

        if (!databaseResponse.ok) {
          console.error("Error saving response to database", databaseResponse);
        }
      }
      fetchwoData();

      // setWoApiResponse(apiResponse);
      // console.log(strategiesArray);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setWoApiResponse("An error occurred while calling the API");
    }
  };
  const deletewoStrategy = async (id: string, department_id: string) => {
 
    try {
      const response = await fetch(
        `http://localhost:8080/woStrat/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, department: { id: department_id } }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

      setWoApiresponse((prevStrategies) =>
        prevStrategies.filter((strategy) => strategy.id !== id)
      );
      
    } catch (error: any) {
      console.error("Error deleting strategy:", error.message);
    }

  };

  // Reusable SWOT function
  const useSwot = (initialItems: SwotItem[] = []) => {
    const [items, setItems] = useState<SwotItem[]>(initialItems);
    const [newItem, setNewItem] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleAddClick = () => {
      setIsAdding(!isAdding);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewItem(event.target.value);
    };

    const addStrength = async (event: React.KeyboardEvent) => {
      
      if (event.key === "Enter" && newItem.trim()) {
        if (fetchedStrengths.length >= 5) {
          toast.error("Maximum limit of 5 items reached");
        } else {
          try {
            // Send data to backend
            const response = await fetch(
              `http://localhost:8080/strengths/insert`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  value: newItem.trim(),
                  department: { id: department_id },
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to add item. Please try again.");
            }

            const newStrength = await response.json();
            console.log("newStrength:", newStrength);

            if (response.status === 200) {
              const updatedStrength = { ...newStrength, id: newStrength.id };
              console.log("newStrengtharray:", newStrength.id);
              setFetchedStrengths((prevStrengths) => [
                ...prevStrengths,
                updatedStrength,
              ]);
              setNewItem("");
              setIsAdding(false);
              toast.success("Strength added successfully");
              fetchUpdatedStrengths();
            } else {
              toast.error("There is an error adding strength");
            }
          } catch (error: any) {
            console.error("Error adding item:", error.message);
            toast.error("An unexpected error occurred");
          }
        }
      }
    };

    const addWeakness = async (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && newItem.trim()) {
        if (fetchedWeaknesses.length >= 5) {
          toast.error("Maximum limit of 5 items reached");
        } else {
          try {
            // Send data to backend
            const response = await fetch(
              `http://localhost:8080/weaknesses/insert`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  value: newItem.trim(),
                  department: { id: department_id },
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to add item. Please try again.");
            }

            const newWeakness = await response.json();

            if (response.status === 200) {
              const updatedWeakness = { ...newWeakness, id: newWeakness.id };
              setFetchedWeaknesses((prevWeaknesses) => [
                ...prevWeaknesses,
                updatedWeakness,
              ]);
              setNewItem("");
              setIsAdding(false);
              toast.success("Weakness added successfully");

              fetchUpdatedWeaknesses();
            } else {
              toast.error("There is an error adding weakness");
            }
          } catch (error: any) {
            console.error("Error adding item:", error.message);
            toast.error("An unexpected error occurred");
          }
        }
      }
    };

    const addOpportunities = async (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && newItem.trim()) {
        if (fetchedOpportunities.length >= 5) {
          toast.error("Maximum limit of 5 items reached");
        } else {
          try {
            const response = await fetch(
              `http://localhost:8080/opportunities/insert`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  value: newItem.trim(),
                  department: { id: department_id },
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to add item. Please try again.");
            }

            const newOpportunities = await response.json();

            if (response.status === 200) {
              const updatedOpportunities = {
                ...newOpportunities,
                id: newOpportunities.id,
              };
              setFetchedOpportunities((prevOpportunities) => [
                ...prevOpportunities,
                updatedOpportunities,
              ]);
              setNewItem("");
              setIsAdding(false);
              toast.success("Opportunities added successfully");

              fetchUpdatedOpportunities();
            } else {
              toast.error("There is an error adding opportunities");
            }
          } catch (error: any) {
            console.error("Error adding item:", error.message);
            toast.error("An unexpected error occurred");
          }
        }
      }
    };

    const addThreats = async (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && newItem.trim()) {
        if (fetchedThreats.length >= 5) {
          toast.error("Maximum limit of 5 items reached");
        } else {
          try {
            const response = await fetch(
              `http://localhost:8080/threats/insert`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  value: newItem.trim(),
                  department: { id: department_id },
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to add item. Please try again.");
            }

            const newThreats = await response.json();

            if (response.status === 200) {
              const updatedThreats = { ...newThreats, id: newThreats.id };
              setFetchedThreats((prevThreats) => [
                ...prevThreats,
                updatedThreats,
              ]);
              setNewItem("");
              setIsAdding(false);
              toast.success("Threats added successfully");

              fetchUpdatedThreats();
            } else {
              toast.error("There is an error adding threats");
            }
          } catch (error: any) {
            console.error("Error adding item:", error.message);
            toast.error("An unexpected error occurred");
          }
        }
      }
    };

    const EditStrength = async (
      id: string,
      newValue: string,
      department_id: string
    ) => {
      try {
        const response = await fetch(
          `http://localhost:8080/strengths/update/${department_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              value: newValue,
              department: { id: department_id },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update item. Please try again.");
        }

        const updatedStrength = await response.json();
        console.log("Updated Strength:", updatedStrength);

        if (!updatedStrength || !updatedStrength.id) {
          throw new Error("Updated strength is not in the expected format.");
        }

        setFetchedStrengths((prevStrengths) =>
          prevStrengths.map((strength) => {
            if (strength.id === updatedStrength.id) {
              return updatedStrength;
            } else {
              return strength;
            }
          })
        );

        console.log("Strength updated successfully");
        toast.success("Strength updated successfully");
      } catch (error: any) {
        console.error("Error updating item:", error.message);
        toast.error("Failed to update strength");
      }
    };

    const EditWeakness = async (
      id: string,
      newValue: string,
      department_id: string
    ) => {
      try {
        const response = await fetch(
          `http://localhost:8080/weaknesses/update/${department_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              value: newValue,
              department: { id: department_id },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update item. Please try again.");
        }

        const updatedWeakness = await response.json();

        console.log("Updated Weakness: ", updatedWeakness);
        if (!updatedWeakness || !updatedWeakness.id) {
          throw new Error("Updated Weakness is not in the expected format");
        }

        setFetchedWeaknesses((prevWeaknesses) =>
          prevWeaknesses.map((weakness) => {
            if (weakness.id === updatedWeakness.id) {
              return updatedWeakness;
            } else {
              return weakness;
            }
          })
        );

        console.log(`Weakness updated successfully`);
        toast.success("Weakness updated successfully");
      } catch (error: any) {
        console.error("Error updating item:", error.message);
        toast.error("Failed to update strength");
      }
    };

    const EditOpportunities = async (
      id: string,
      newValue: string,
      department_id: string
    ) => {
      try {
        const response = await fetch(
          `http://localhost:8080/opportunities/update/${department_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              value: newValue,
              department: { id: department_id },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update item. Please try again.");
        }

        const updatedOpportunities = await response.json();

        if (!updatedOpportunities || !updatedOpportunities.id) {
          throw new Error(
            "Updated Opportunities is not in the expected format"
          );
        }

        setFetchedOpportunities((prevOpportunities) =>
          prevOpportunities.map((opportunity) => {
            if (opportunity.id === updatedOpportunities.id) {
              return updatedOpportunities;
            } else {
              return opportunity;
            }
          })
        );

        console.log(`Opportunites updated successfully`);
        toast.success("Opportunities updated successfully");
      } catch (error: any) {
        console.error("Error updating item:", error.message);
        toast.error("Failed to update opportunity");
      }
    };

    const EditThreats = async (
      id: string,
      newValue: string,
      department_id: string
    ) => {
      try {
        const response = await fetch(
          `http://localhost:8080/threats/update/${department_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              value: newValue,
              department: { id: department_id },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update item. Please try again.");
        }

        const updatedThreats = await response.json();
        if (!updatedThreats || !updatedThreats.id) {
          throw new Error("Updated threats is not in the expected format");
        }

        setFetchedThreats((prevThreats) =>
          prevThreats.map((threat) => {
            if (threat.id === updatedThreats.id) {
              return updatedThreats;
            } else {
              return threat;
            }
          })
        );

        console.log(`Threats updated successfully`);
        toast.success("Threats updated successfully");
      } catch (error: any) {
        console.error("Error updating item:", error.message);
        toast.error("Failed to update threat");
      }
    };

    const deleteItem = async ( //new updated
      id: string,
      department_id: string,
      endpoint: string
    ) => {
      try {
        const response = await fetch(
          `http://localhost:8080/${endpoint}/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          console.log(`Item with ID ${id} in ${endpoint} deleted successfully`);
          fetchUpdatedItems(endpoint, department_id);
        } else {
          console.error(`Error deleting item with ID ${id} in ${endpoint}`);
        }
      } catch (error: any) {
        console.error(
          `Error deleting item with ID ${id} in ${endpoint}:`,
          error.message
        );
      }
    };

    const fetchUpdatedItems = async (
      endpoint: string,
      department_id: string
    ) => {
      try {
        const response = await fetch(
          `http://localhost:8080/${endpoint}/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch updated ${endpoint}`);
        }
        const data = await response.json();
        switch (endpoint) {
          case "strengths":
            setFetchedStrengths(data);
            break;
          case "weaknesses":
            setFetchedWeaknesses(data);
            break;
          case "opportunities":
            setFetchedOpportunities(data);
            break;
          case "threats":
            setFetchedThreats(data);
            break;
          default:
            console.error(`Invalid endpoint: ${endpoint}`);
        }
      } catch (error: any) {
        console.error(`Error fetching updated ${endpoint}:`, error.message);
      }
    };

    const deleteStrength = async (id: string, department_id: string) => {
      await deleteItem(id, department_id, "strengths");
    };
    const deleteWeakness = async (id: string, department_id: string) => {
      await deleteItem(id, department_id, "weaknesses");
    };

    const deleteOpportunities = async (id: string, department_id: string) => {
      await deleteItem(id, department_id, "opportunities");
    };

    const deleteThreats = async (id: string, department_id: string) => {
      await deleteItem(id, department_id, "threats");
    };
    return {
      items,
      newItem,
      isAdding,
      handleAddClick,
      handleChange,
      addStrength,
      EditStrength,
      deleteStrength,
      addWeakness,
      EditWeakness,
      deleteWeakness,
      addOpportunities,
      EditOpportunities,
      deleteOpportunities,
      addThreats,
      EditThreats,
      deleteThreats,
    };
  };

  const [fetchedStrengths, setFetchedStrengths] = useState<SwotItem[]>([]);
  const [fetchedWeaknesses, setFetchedWeaknesses] = useState<SwotItem[]>([]);
  const [fetchedOpportunities, setFetchedOpportunities] = useState<SwotItem[]>(
    []
  );
  const [fetchedThreats, setFetchedThreats] = useState<SwotItem[]>([]);
  const [lastFetchedDepartmentId, setLastFetchedDepartmentId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    const fetchStrengths = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/strengths/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch strengths");
        }
        const data = await response.json();
        console.log("data: ", data);
        setFetchedStrengths(data);
        setLastFetchedDepartmentId(department_id);
      } catch (error: any) {
        console.error("Error fetching strengths:", error.message);
      }
    };

    // Fetch strengths if the department_id has changed or when fetchedStrengths is updated
    if (
      department_id !== lastFetchedDepartmentId ||
      fetchedStrengths.length === 0
    ) {
      fetchStrengths();
    }
  }, [department_id, lastFetchedDepartmentId, fetchedStrengths.length]);

  useEffect(() => {
    const FetchWeaknesses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/weaknesses/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weaknesses");
        }
        const data = await response.json();
        setFetchedWeaknesses(data);
        setLastFetchedDepartmentId(department_id);
      } catch (error: any) {
        console.error("Error fetching weaknesses:", error.message);
      }
    };

    // Fetch strengths if the department_id has changed or when fetchedStrengths is updated
    if (
      department_id !== lastFetchedDepartmentId ||
      fetchedWeaknesses.length === 0
    ) {
      FetchWeaknesses();
    }
  }, [department_id, lastFetchedDepartmentId, fetchedWeaknesses.length]);

  useEffect(() => {
    const FetchOpportunites = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/opportunities/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const data = await response.json();
        setFetchedOpportunities(data);
        setLastFetchedDepartmentId(department_id);
      } catch (error: any) {
        console.error("Error fetching opportunities:", error.message);
      }
    };

    if (
      department_id !== lastFetchedDepartmentId ||
      fetchedOpportunities.length === 0
    ) {
      FetchOpportunites();
    }
  }, [department_id, lastFetchedDepartmentId, fetchedOpportunities.length]);

  useEffect(() => {
    const FetchThreats = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/threats/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch threats");
        }
        const data = await response.json();
        setFetchedThreats(data);
        setLastFetchedDepartmentId(department_id);
      } catch (error: any) {
        console.error("Error fetching threats:", error.message);
      }
    };

    if (
      department_id !== lastFetchedDepartmentId ||
      fetchedThreats.length === 0
    ) {
      FetchThreats();
    }
  }, [department_id, lastFetchedDepartmentId, fetchedThreats.length]);

  const fetchUpdatedStrengths = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/strengths/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch updated strengths");
      }
      const data = await response.json();
      setFetchedStrengths(data); // Update fetched strengths with the new data
    } catch (error: any) {
      console.error("Error fetching updated strengths:", error.message);
    }
  };

  const fetchUpdatedWeaknesses = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/weaknesses/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch updated weaknesses");
      }
      const data = await response.json();
      setFetchedWeaknesses(data); // Update fetched strengths with the new data
    } catch (error: any) {
      console.error("Error fetching updated weaknesses:", error.message);
    }
  };

  const fetchUpdatedOpportunities = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/opportunities/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch updated opportunities");
      }
      const data = await response.json();
      setFetchedOpportunities(data); // Update fetched opportunities with the new data
    } catch (error: any) {
      console.error("Error fetching updated opportunities:", error.message);
    }
  };

  const fetchUpdatedThreats = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/threats/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch updated threats");
      }
      const data = await response.json();
      setFetchedThreats(data); // Update fetched threats with the new data
    } catch (error: any) {
      console.error("Error fetching updated threats:", error.message);
    }
  };

  const strengths = useSwot(fetchedStrengths);
  const weaknesses = useSwot(fetchedWeaknesses);
  const opportunities = useSwot(fetchedOpportunities);
  const threats = useSwot(fetchedThreats);

  const [showStrengthOptions, setShowStrengthOptions] = useState(null);
  const [showWeaknessOptions, setShowWeaknessOptions] = useState(null);
  const [showOpportunityOptions, setShowOpportunityOptions] = useState(null);
  const [showThreatOptions, setShowThreatOptions] = useState(null);

  const toggleStrengthOptions = (id: any) => {
    setShowStrengthOptions(showStrengthOptions === id ? null : id);
  };

  const toggleWeaknessOptions = (id: any) => {
    setShowWeaknessOptions(showWeaknessOptions === id ? null : id);
  };

  const toggleOpportunityOptions = (id: any) => {
    setShowOpportunityOptions(showOpportunityOptions === id ? null : id);
  };

  const toggleThreatOptions = (id: any) => {
    setShowThreatOptions(showThreatOptions === id ? null : id);
  };

  // added
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState("");

  const openModal = (defaultValue: string) => {
    setModalValue(defaultValue);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const [isModalVisible, setModalVisible] = useState(false);

  // for restoring deleted items (STRENGTH)
  const [deletedStrengths, setDeletedStrengths] = useState<Strength[]>([]);
  const [isStrengthVisible, setIsStrengthVisible] = useState<boolean>(false);

  const [deletedWeaknesses, setDeletedWeaknesses] = useState<Strength[]>([]);
  const [isWeaknessesVisible, setIsWeaknessesVisible] = useState<boolean>(false);

  const [deletedOpportunities, setDeletedOpportunities] = useState<Strength[]>([]);
  const [isOpportunitiesVisible, setIsOpportunitiesVisible] = useState<boolean>(false);

  
  const [deletedThreats, setDeletedThreats] = useState<Strength[]>([]);
  const [isThreatsVisible, setIsThreatsVisible] = useState<boolean>(false);

  const fetchSwotItems = async (type: string, endpoint: string, setter: (data: any) => void): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8080/${type}/${endpoint}/${department_id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`);
      }
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };
  
  const handleRestoreItem = async (
    type: string,
    id: number,
    currentItems: any[],
    fetchUpdatedItems: () => void,
    fetchDeletedItems: () => void
  ): Promise<void> => {
    try {
      if (currentItems.length >= 5) {
        toast.error(`Maximum limit of 5 ${type} items reached. Delete an item first.`);
        return;
      }
  
      const response = await fetch(`http://localhost:8080/${type}/restore/${id}`, {
        method: 'PUT',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to restore ${type}`);
      }
      fetchUpdatedItems();
      fetchDeletedItems(); 
      toast.success('Item restored successfully');
    } catch (error) {
      console.error(`Error restoring ${type}:`, error);
      toast.error('An unexpected error occurred');
    }
  };
  
  
  useEffect(() => {
    fetchSwotItems('strengths', 'deleted', setDeletedStrengths);
  }, []);
  
  useEffect(() => {
    fetchSwotItems('weaknesses', 'deleted', setDeletedWeaknesses);
  }, []);
  
  useEffect(() => {
    fetchSwotItems('threats', 'deleted', setDeletedThreats);
  }, []);
  
  useEffect(() => {
    fetchSwotItems('opportunities', 'deleted', setDeletedOpportunities);
  }, []);
  
  
  const handleRestoreStrength = (id: number) => {
    handleRestoreItem('strengths', id, fetchedStrengths, fetchUpdatedStrengths, () => fetchSwotItems('strengths', 'deleted', setDeletedStrengths));
  };
  
  const handleRestoreWeakness = (id: number) => {
    handleRestoreItem('weaknesses', id, fetchedWeaknesses, fetchUpdatedWeaknesses, () => fetchSwotItems('weaknesses', 'deleted', setDeletedWeaknesses));
  };
  
  
  const handleRestoreOpportunity = (id: number) => {
    handleRestoreItem('opportunities', id, fetchedOpportunities, fetchUpdatedOpportunities, () => fetchSwotItems('opportunities', 'deleted', setDeletedOpportunities));
  };
  
  const handleRestoreThreat = (id: number) => {
    handleRestoreItem('threats', id, fetchedThreats, fetchUpdatedThreats, () => fetchSwotItems('threats', 'deleted', setDeletedThreats));
  };
  
  
  const toggleVisibility = (
    type: 'strengths' | 'weaknesses' | 'threats' | 'opportunities', 
    isVisible: boolean, 
    setVisible: (visible: boolean) => void, 
    fetchItems: () => void
  ) => {
    setVisible(!isVisible);
    if (!isVisible) {
      fetchItems();
    }
  };
  
 
  // end
  
   // State for delete confirmation modals
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [strategyToDelete, setStrategyToDelete] = useState<any>(null); 
   const [deleteModalType, setDeleteModalType] = useState<string | null>(null); 
 
   // Open the delete confirmation modal
   const openDeleteModal = (strategy: any, type: string) => {
     setStrategyToDelete(strategy);
     setDeleteModalType(type);
     setIsDeleteModalOpen(true);
   };
 
   // Handle delete confirmation
   const handleDeleteConfirm = async () => {
     if (strategyToDelete && deleteModalType) {
       try {
         let response;
         switch (deleteModalType) {
           case 'SO':
             response = await deletesoStrategy(strategyToDelete.id, department_id);
             break;
           case 'WO':
             response = await deletewoStrategy(strategyToDelete.id, department_id);
             break;
           case 'ST':
             response = await deletestStrategy(strategyToDelete.id, department_id);
             break;
           case 'WT':
             response = await deleteStrategy(strategyToDelete.id, department_id);
             break;
           default:
             console.error("Invalid delete modal type");
             break;
         }
 
         toast.success("Strategy deleted successfully");
       } catch (error) {
         console.error("Error deleting strategy:", error);
         toast.error("An error occurred");
       }
     }
     setIsDeleteModalOpen(false);
     setStrategyToDelete(null);
     setDeleteModalType(null);
   };

  return (
    <div className="flex flex-row">
      <Navbar />
      {/* <div className="flex-1"> */}
        <div className="flex-1 flex flex-col mt-8 ml-80">
          <div className="flex flex-col mb-16">

            <div className="flex flex-row">
              <div className="mb-5 inline-block self-start break-words font-bold text-[3rem] text-[rgb(59,59,59)]">
                SWOT ANALYSIS
              </div>
              {/* IF I HOVER OR ICLICK ANG SWOT OR STRATEGIES KAY NAAY UNDERLINE MAG STAY BELOW SA WORD, PWEDE KA MAG INSERT UG ICON BEFORE SA WORDS */}
              <div className="flex justify-center ml-[63.5rem] mt-[0.5rem] border border-gray-200 bg-gray w-[14.7rem] h-[4rem] rounded-xl px-1 py-1">
              <div
                className="flex flex-row box-sizing-border cursor-pointer mr-2"
                onClick={() => setDisplaySwot(true)}
              >
                <div
                  className={`inline-block break-words font-semibold transition-all rounded-lg px-4 py-3 ${
                    displaySwot ? "bg-[#A43214] text-white" : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  SWOT
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border cursor-pointer"
                onClick={() => setDisplaySwot(false)}
              >
                <div
                  className={`inline-block break-words font-semibold transition-all rounded-lg px-4 py-3 ${
                    !displaySwot ? "bg-[#A43214] text-white" : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  STRATEGIES
                </div>
              </div>
            </div>
            </div>

            <span className="break-words font font-normal text-[1.3rem] text-[#504C4C]">
              Assess your project&#39;s strengths, weaknesses, opportunities,
              and threats effortlessly. Our AI-powered tool generates insightful
              strategies tailored to your analysis, empowering you to make
              informed decisions and drive your project forward with confidence.
            </span>
          </div>

          {displaySwot ? (
            <div className="flex flex-col">
              {/* SWOT CONTAINER */}
              <div className=" flex flex-col gap-10 ml-2 mt-[-1.3rem]">
                {/* FOR RESTORING DELETED STRENGTHS */}
                <div>
                    <div className="flex flex-row box-sizing-border mr-2 cursor-pointer">
                      <button 
                        className="bg-[#A43214] text-white hover:bg-red-500 border border-none hover:border-red-500 hover:text-white text-[1.2rem] font-bold text-center items-center rounded-lg px-2 py-2"
                        onClick={() => toggleVisibility('strengths', isStrengthVisible, setIsStrengthVisible, () => fetchSwotItems('strengths', 'deleted', setDeletedStrengths))}>
                        {isStrengthVisible ? 'Hide Strength History' : 'Show Strength History'}
                      </button>
                    </div>
                    {isStrengthVisible && (
                    <div className="bg-white shadow-md rounded-lg p-6 w-[103rem] border border-gray-200">
                      <h2 className="text-xl font-semibold mb-4">Deleted Strengths</h2>
                      {deletedStrengths.length === 0 ? (
                        <p className="text-gray-500">No deleted strengths found.</p>
                      ) : (
                        <ul className="space-y-3">
                          {deletedStrengths.map((strength,index) => (
                              <li 
                                key={strength.id} 
                                className={`flex items-center justify-between p-3 ${
                                  index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
                                }`}
                              >
                              <span className="text-gray-800 font-semibold">{strength.value}</span>
                              <button 
                                onClick={() => handleRestoreStrength(strength.id)}
                                className="text-[#A43214] hover:text-[#7A2812] transition-colors"
                                title="Restore strength"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
              </div>
              {/* END */}
                <Card className="flex align-center rounded-lg mt-[-3rem] border border-gray-200 justify-between py-5 px-2 bg-white h-[30rem] w-[103rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                    <div
                      className="flex flex-row p-1 w-[95rem] h-auto"
                    >
                      <img src="/strength.png" alt="" className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Strengths
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          An internal advantage or resource.
                        </span>
                      </div>
                    </div>
                      <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] ml-[3rem] pl-[0.25rem] pr-1 pt-1 pb-1">
                        <button
                          className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                          onClick={strengths.handleAddClick}
                        >
                          <div className="flex flex-row">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                          </svg>

                          </div>
                        </button>
                      </div>
                      </div>
                    <div className="relative ml-[-1.5rem]">
                      {strengths.isAdding && (
                        <input
                          placeholder="Type strength and press Enter"
                          value={strengths.newItem}
                          onChange={strengths.handleChange}
                          onKeyDown={strengths.addStrength}
                          className="bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md"
                          style={{
                            width: "calc(100% - 1.5rem)",
                            marginLeft: "1.5rem",
                          }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col overflow-auto mt-[-1rem]">
                      {fetchedStrengths.map((strength, index: number) => (
                        <div
                          key={strength.id}
                          className={`flex justify-between items-center pb-2 pt-3 pl-2 pr-2 m-1 w-auto ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                        >
                          <div className="flex flex-row text-[1.1rem] overflow-y-auto">
                            <div className="pt-1 pb-1 pr-2 pl-2 font-semibold">
                              {"S" + (index + 1)}:
                            </div>
                            <div className="pr-2 pl-2 break-words overflow-y-auto font-medium">
                            {strengthEditingId === strength.id ? ( //new added
                            <input
                              value={strength.value}
                              className="bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md mt-[-1rem]"
                              style={{
                                width: "calc(70% - 0.5rem)"
                              }}
                              onChange={(e) => {
                                const updatedStrengths = fetchedStrengths.map(
                                  (s) =>
                                    s.id === strength.id
                                      ? { ...s, value: e.target.value }
                                      : s
                                );
                                setFetchedStrengths(updatedStrengths);
                              }}
                              onBlur={() => {
                                setStrengthEditingId(null);
                                strengths.EditStrength(
                                  strength.id,
                                  strength.value,
                                  department_id
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setStrengthEditingId(null);
                                  strengths.EditStrength(
                                    strength.id,
                                    strength.value,
                                    department_id
                                  );
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <div>
                              {strength.value.length > 110
                                ? strength.value.slice(0, 110) + "..."
                                : strength.value}
                            </div>
                          )}
                          {/* end */}
                            </div>
                          </div>

                          <div className="flex">
                              <div className="flex flex-row justify-center items-center">
                                  <button
                                    className="font-bold py-2 px-2 rounded text-orange-600"
                                    onClick={() => setStrengthEditingId(strength.id)} //new added edit button
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
                                    className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                    onClick={() => openStrengthDeleteModal(strength)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                  </button>
                              </div>
                          </div>
                            {/* new added */}
                            {isStrengthModalOpen && strengthToDelete && (
                              <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                                <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
                                  <p className="text-3xl font-bold mb-4">Confirm Deletion</p>
                                  <p className="text-xl mb-4 mt-10">Are you sure you want to delete this strength? <br/>You can still restore it later if needed.</p>
                                  <div className="flex justify-center space-x-3 mt-10">
                                    <button
                                      className="break-words font-semibold text-[1.2rem] text-[#962203] rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#ffffff] cursor-pointer hover:bg-[#962203] hover:text-[#ffffff]"
                                      onClick={() => setIsStrengthModalOpen(false)}
                                    >
                                      No, Cancel
                                    </button>
                                    <button
                                      className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                                      style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                                      onClick={handleStrengthDeleteConfirm}
                                    >
                                      Yes, Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* end */}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Restore weaknesses start */}
                <div>
                    <div className="flex flex-row box-sizing-border mr-2 cursor-pointer">
                      <button 
                        className="bg-[#A43214] text-white hover:bg-red-500 border border-none hover:border-red-500 hover:text-white text-[1.2rem] font-bold text-center items-center rounded-lg px-2 py-2"
                        onClick={() => toggleVisibility('weaknesses', isWeaknessesVisible, setIsWeaknessesVisible, () => fetchSwotItems('weaknesses', 'deleted', setDeletedWeaknesses))}>
                        {isWeaknessesVisible ? 'Hide Weakness History' : 'Show Weakness History'}
                      </button>
                    </div>
                    {isWeaknessesVisible && (
                    <div className="bg-white shadow-md rounded-lg p-6 w-[103rem] border border-gray-200">
                      <h2 className="text-xl font-semibold mb-4">Deleted Weaknesses</h2>
                      {deletedWeaknesses.length === 0 ? (
                        <p className="text-gray-500">No deleted weaknesses found.</p>
                      ) : (
                        <ul className="space-y-">
                          {deletedWeaknesses.map((weakness,index) => (
                              <li 
                                key={weakness.id} 
                                className={`flex items-center justify-between p-3 ${
                                  index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
                                }`}
                              >
                              <span className="text-gray-800 font-semibold">{weakness.value}</span>
                              <button 
                                onClick={() => handleRestoreWeakness(weakness.id)}
                                className="text-[#A43214] hover:text-[#7A2812] transition-colors"
                                title="Restore weakness"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
              </div>
       
            {/* Restore weaknesses end */}
                <Card className="flex align-center rounded-lg mt-[-3rem] border border-gray-200 justify-between py-5 px-2 bg-white h-[30rem] w-[103rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                    <div
                      className="flex flex-row rounded-lg h-10 p-1 w-[95rem]"
                    >
                      <img src="/weakness.png" alt="" className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Weakness
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          An internal limitation or deficiency.
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] ml-[3rem] pl-[0.25rem] pr-1 pt-1 pb-1">
                        <button
                          className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                          onClick={weaknesses.handleAddClick}
                        >
                          <div className="flex flex-row">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                          </svg>

                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="relative ml-[-1.5rem]">
                      {weaknesses.isAdding && (
                        <input
                          placeholder="Type weakness and press Enter"
                          value={weaknesses.newItem}
                          onChange={weaknesses.handleChange}
                          onKeyDown={weaknesses.addWeakness}
                          className="mt-10 bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md"
                          style={{
                            width: "calc(100% - 1.5rem)",
                            marginLeft: "1.5rem",
                          }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col overflow-auto mt-12 w-[100%]">
                      {fetchedWeaknesses.map((weakness, index: number) => (
                        <div
                          key={weakness.id}
                          className={`flex justify-between items-center ml-1 pb-2 pt-3 pl-2 w-auto ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                        >
                          <div className="flex flex-row text-[1.1rem] overflow-y-auto">
                            <div className="pt-1 pb-1 pr-2 pl-2 font-semibold ">
                              {"W" + (index + 1)}:
                            </div>
                            <div className="pr-2 pt-[-0.10rem] pl-2 break-words overflow-y-auto font-medium">
                            {weaknessEditingId === weakness.id ? ( //new added
                            <input
                              value={weakness.value}
                              className="bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md mt-[-1rem]"
                              style={{
                                width: "calc(70% - 0.5rem)"
                              }}
                              onChange={(e) => {
                                const updatedWeaknesses = fetchedWeaknesses.map(
                                  (w) =>
                                    w.id === weakness.id
                                      ? { ...w, value: e.target.value }
                                      : w
                                );
                                setFetchedWeaknesses(updatedWeaknesses);
                              }}
                              onBlur={() => {
                                setWeaknessEditingId(null);
                                weaknesses.EditWeakness(
                                  weakness.id,
                                  weakness.value,
                                  department_id
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setWeaknessEditingId(null);
                                  weaknesses.EditWeakness(
                                    weakness.id,
                                    weakness.value,
                                    department_id
                                  );
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <div>
                              {weakness.value.length > 110
                                ? weakness.value.slice(0, 110) + "..."
                                : weakness.value}
                            </div>
                          )}
                          {/* end */}
                            </div>
                          </div>

                          <div className="flex">
                              <div className="flex flex-row justify-center items-center ml-5">
                                  <button
                                    className="font-bold py-2 px-2 rounded text-orange-600"
                                    onClick={() => setWeaknessEditingId(weakness.id)} //new added edit button
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
                                    className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                    onClick={() => openWeaknessDeleteModal(weakness)} //new added
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                  </button>
                              </div>
                          </div>
                          {/* new added */}
                          {isWeaknessModalOpen && weaknessToDelete && (
                              <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                                <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
                                  <p className="text-3xl font-bold mb-4">Confirm Deletion</p>
                                  <p className="text-xl mb-4 mt-10">Are you sure you want to delete this weakness? <br/>You can still restore it later if needed.</p>
                                  <div className="flex justify-center space-x-3 mt-10">
                                    <button
                                      className="break-words font-semibold text-[1.2rem] text-[#962203] rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#ffffff] cursor-pointer hover:bg-[#962203] hover:text-[#ffffff]"
                                      onClick={() => setIsWeaknessModalOpen(false)}
                                    >
                                      No, Cancel
                                    </button>
                                    <button
                                      className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                                      style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                                      onClick={handleWeaknessDeleteConfirm}
                                    >
                                      Yes, Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* end */}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Restore opportunities start */}
                
                <div>
                    <div className="flex flex-row box-sizing-border mr-2 cursor-pointer">
                      <button 
                        className="bg-[#A43214] text-white hover:bg-red-500 border border-none hover:border-red-500 hover:text-white text-[1.2rem] font-bold text-center items-center rounded-lg px-2 py-2"
                        onClick={() => toggleVisibility('opportunities', isOpportunitiesVisible, setIsOpportunitiesVisible, () => fetchSwotItems('opportunities', 'deleted', setDeletedOpportunities))}>
                        {isOpportunitiesVisible ? 'Hide Opportunities History' : 'Show Opportunities History'}
                      </button>
                    </div>
                    {isOpportunitiesVisible && (
                    <div className="bg-white shadow-md rounded-lg p-6 w-[103rem] border border-gray-200">
                      <h2 className="text-xl font-semibold mb-4">Deleted Opportunities</h2>
                      {deletedOpportunities.length === 0 ? (
                        <p className="text-gray-500">No deleted opportunities found.</p>
                      ) : (
                        <ul className="space-y-3">
                          {deletedOpportunities.map((opportunity,index) => (
                              <li 
                                key={opportunity.id} 
                                className={`flex items-center justify-between p-3 ${
                                  index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
                                }`}
                              >
                              <span className="text-gray-800 font-semibold">{opportunity.value}</span>
                              <button 
                                onClick={() => handleRestoreOpportunity(opportunity.id)}
                                className="text-[#A43214] hover:text-[#7A2812] transition-colors"
                                title="Restore opportunity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
              </div>

                {/* Restore opportunities end */}



                <Card className="flex align-center rounded-lg mt-[-3rem] border border-gray-200 justify-between py-5 px-2 bg-white h-[30rem] w-[103rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                    <div
                      className="flex flex-row rounded-lg h-10 p-1 w-[95rem]"
                    >
                      <img src="/opportunity.png" alt="" className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Opportunity
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          An external chance for growth or improvement.
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] ml-[3rem] pl-[0.25rem] pr-1 pt-1 pb-1">
                        <button
                          className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                          onClick={opportunities.handleAddClick}
                        >
                          <div className="flex flex-row">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                          </svg>

                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="relative ml-[-1.5rem]">
                      {opportunities.isAdding && (
                        <input
                          placeholder="Type strength and press Enter"
                          value={opportunities.newItem}
                          onChange={opportunities.handleChange}
                          onKeyDown={opportunities.addOpportunities}
                          className=" mt-10 border border-orange-400 bg-white absolute p-4 shadow-2xl font-semibold rounded-md"
                          style={{
                            width: "calc(100% - 1.5rem)",
                            marginLeft: "1.5rem",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col overflow-auto mt-12 w-[100%]">
                      {fetchedOpportunities.map((opportunity, index: number) => (
                        <div
                          key={opportunity.id}
                          className={`flex justify-between items-center ml-1 pb-2 pt-3 pl-2 w-auto ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                        >
                          <div className="flex flex-row text-[1.1rem] overflow-y-auto">
                            <div className="pt-1 pb-1 pr-2 pl-2 font-semibold ">
                              {"O" + (index + 1)}:
                            </div>
                            <div className="pr-2 pt-[-0.5rem] pl-2 break-words overflow-y-auto font-medium">
                            {opportunityEditingId === opportunity.id ? ( //new added
                            <input
                              value={opportunity.value}
                              className="bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md mt-[-1rem]"
                              style={{
                                width: "calc(70% - 0.5rem)"
                              }}
                              onChange={(e) => {
                                const updatedOpportunities = fetchedOpportunities.map(
                                  (o) =>
                                    o.id === opportunity.id
                                      ? { ...o, value: e.target.value }
                                      : o
                                );
                                setFetchedOpportunities(updatedOpportunities);
                              }}
                              onBlur={() => {
                                setOpportunityEditingId(null);
                                opportunities.EditOpportunities(
                                  opportunity.id,
                                  opportunity.value,
                                  department_id
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setOpportunityEditingId(null);
                                  opportunities.EditOpportunities(
                                    opportunity.id,
                                    opportunity.value,
                                    department_id
                                  );
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <div>
                              {opportunity.value.length > 110
                                ? opportunity.value.slice(0, 110) + "..."
                                : opportunity.value}
                            </div>
                          )}
                          {/* end */}
                            </div>
                          </div>

                          <div className="flex">
                              <div className="flex flex-row">
                                  <button
                                    className="font-bold py-2 px-2 rounded text-orange-600"
                                    onClick={() => setOpportunityEditingId(opportunity.id)} //new added edit button
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
                                    //KANI MODAL
                                    className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                    onClick={() => openOpportunityDeleteModal(opportunity)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                  </button>
                              </div>
                          </div>
                          {/* new added */}
                          {isOpportunityModalOpen && opportunityToDelete && (
                              <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                                <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
                                  <p className="text-3xl font-bold mb-4">Confirm Deletion</p>
                                  <p className="text-xl mb-4 mt-10">Are you sure you want to delete this opportunity? <br/>You can still restore it later if needed.</p>
                                  <div className="flex justify-center space-x-3 mt-10">
                                    <button
                                      className="break-words font-semibold text-[1.2rem] text-[#962203] rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#ffffff] cursor-pointer hover:bg-[#962203] hover:text-[#ffffff]"
                                      onClick={() => setIsOpportunityModalOpen(false)}
                                    >
                                      No, Cancel
                                    </button>
                                    <button
                                      className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                                      style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                                      onClick={handleOpportunityDeleteConfirm}
                                    >
                                      Yes, Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* end */}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                 {/* Restore threats start */}

                 <div>
                    <div className="flex flex-row box-sizing-border mr-2 cursor-pointer">
                      <button 
                        className="bg-[#A43214] text-white hover:bg-red-500 border border-none hover:border-red-500 hover:text-white text-[1.2rem] font-bold text-center items-center rounded-lg px-2 py-2"
                        onClick={() => toggleVisibility('threats', isThreatsVisible, setIsThreatsVisible, () => fetchSwotItems('threats', 'deleted', setDeletedThreats))}>
                        {isThreatsVisible ? 'Hide Threats History' : 'Show Threats History'}
                      </button>
                    </div>
                    {isThreatsVisible && (
                    <div className="bg-white shadow-md rounded-lg p-6 w-[103rem] border border-gray-200">
                      <h2 className="text-xl font-semibold mb-4">Deleted Threats</h2>
                      {deletedThreats.length === 0 ? (
                        <p className="text-gray-500">No deleted threats found.</p>
                      ) : (
                        <ul className="space-y-3">
                          {deletedThreats.map((threat,index) => (
                              <li 
                                key={threat.id} 
                                className={`flex items-center justify-between p-3 ${
                                  index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
                                }`}
                              >
                              <span className="text-gray-800 font-semibold">{threat.value}</span>
                              <button 
                                onClick={() => handleRestoreThreat(threat.id)}
                                className="text-[#A43214] hover:text-[#7A2812] transition-colors"
                                title="Restore threat"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
              </div>

                {/* Restore threat end */}



                <Card className="flex align-center rounded-lg border mt-[-3rem] border-gray-200 justify-between py-5 px-2 bg-white h-[30rem] w-[103rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                    <div
                      className="flex flex-row rounded-lg h-10 p-1 w-[95rem]"
                    >
                      <img src="/threats.png" alt="" className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Threat
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          An external risk or challenge.
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] ml-[3rem] pl-[0.25rem] pr-1 pt-1 pb-1">
                        <button
                          className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                          onClick={threats.handleAddClick}
                        >
                          <div className="flex flex-row">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                          </svg>

                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="relative ml-[-1.5rem]">
                      {threats.isAdding && (
                        <input
                          placeholder="Type strength and press Enter"
                          value={threats.newItem}
                          onChange={threats.handleChange}
                          onKeyDown={threats.addThreats}
                          className=" mt-10 border border-orange-400 bg-white absolute p-4 shadow-2xl font-semibold rounded-md"
                          style={{
                            width: "calc(100% - 1.5rem)",
                            marginLeft: "1.5rem",
                          }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col overflow-auto mt-12 w-[100%] ">
                      {fetchedThreats.map((threat, index: number) => (
                        <div
                          key={threat.id}
                          className={`flex justify-between items-center ml-1 pb-2 pt-3 pl-2 w-auto ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                        >
                          <div className="flex flex-row text-[1.1rem] overflow-y-auto">
                            <div className="pt-1 pb-1 pr-2 pl-2 font-semibold ">
                              {"T" + (index+1)}:
                            </div>
                            <div className="pr-2 pt-[0.2rem] pl-2 break-words overflow-y-auto font-medium">
                            {threatEditingId === threat.id ? ( //new added
                            <input
                              value={threat.value}
                              className="bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md mt-[-1rem]"
                              style={{
                                width: "calc(70% - 0.5rem)"
                              }}
                              onChange={(e) => {
                                const updatedThreats = fetchedThreats.map(
                                  (t) =>
                                    t.id === threat.id
                                      ? { ...t, value: e.target.value }
                                      : t
                                );
                                setFetchedThreats(updatedThreats);
                              }}
                              onBlur={() => {
                                setThreatEditingId(null);
                                threats.EditThreats(
                                  threat.id,
                                  threat.value,
                                  department_id
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setThreatEditingId(null);
                                  threats.EditThreats(
                                    threat.id,
                                    threat.value,
                                    department_id
                                  );
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <div>
                              {threat.value.length > 110
                                ? threat.value.slice(0, 110) + "..."
                                : threat.value}
                            </div>
                          )}
                          {/* end */}
                            </div>
                          </div>

                          <div className="flex">
                              <div className="flex flex-row">
                                  <button
                                    className="font-bold py-2 px-2 rounded text-orange-600"
                                    onClick={() => setThreatEditingId(threat.id)} //new added edit button
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
                                    //KANI MODAL
                                    className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                    onClick={() => openThreatDeleteModal(threat)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                  </button>
                              </div>
                          </div>
                          {/* new added */}
                          {isThreatModalOpen && threatToDelete && (
                              <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                                <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
                                  <p className="text-3xl font-bold mb-4">Confirm Deletion</p>
                                  <p className="text-xl mb-4 mt-10">Are you sure you want to delete this threat? <br/>You can still restore it later if needed.</p>
                                  <div className="flex justify-center space-x-3 mt-10">
                                    <button
                                      className="break-words font-semibold text-[1.2rem] text-[#962203] rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#ffffff] cursor-pointer hover:bg-[#962203] hover:text-[#ffffff]"
                                      onClick={() => setIsThreatModalOpen(false)}
                                    >
                                      No, Cancel
                                    </button>
                                    <button
                                      className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                                      style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                                      onClick={handleThreatDeleteConfirm}
                                    >
                                      Yes, Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* end */}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Generate Strategies Button */}
              <div className="flex justify-center ml-[-3rem] mb-10">
                <button
                  onClick={generateStrategies}
                  className="lg:mb-0 mb-6 rounded-[0.6rem] mt-10 relative flex flex-row justify-center self-center pt-3 pb-4 pl-1 w-[24.1rem] box-sizing-border"
                  style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                >
                  <span className="break-words font-semibold text-[1.3rem] text-[#ffffff]">
                    Generate Strategies
                  </span>
                </button>

                {isModalVisible && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg z-10 h-[18rem] w-[32rem]">
                      <p className="text-2xl mb-4 justify-center font-semibold mt-5 text-center">
                        Strategies Successfully Generated
                      </p>
                      <p className="text-xl mb-4 text-center justify-center font-regular mt-10">
                        The AI has analyzed the inputted SWOT data and created strategies.
                      </p>
                      <div className="justify-center align-middle items-center ml-20">
                        <button
                          onClick={closeModal}
                          className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-[0.6rem] text-[#ffffff] break-words font-semibold text-lg flex pt-2 pr-3 pl-5 pb-2 w-36 h-[fit-content] ml-14 mb-2 mt-8 items-center text-center align-middle justify-center"
                          style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // STRATEGIES CONTAINER (similar structure to SWOT CONTAINER)
            <div className="flex flex-col gap-10 ml-2 mb-10">
                <Card className="flex align-center rounded-lg border border-gray-200 justify-between py-5 px-2 bg-white h-[30rem] w-[103rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                    <div
                      className="flex flex-row rounded-lg h-10 p-1 w-[95rem]"
                    >
                      <img src="/so.png" alt="" className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          S-O Strategies
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Leveraging internal advantages to capitalize on external chances.
                        </span>
                      </div>
                    </div>
                    
                      <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] ml-[3rem] pl-[0.3rem] pr-1 pt-[0.3rem] pb-1">
                        <div className="rounded-full w-[1.8rem] h-[1.6rem] bg-[#ffffff] pl-[0.5rem] pr-1 pt-1 pb-1 align-middle items-center mt-1">
                          {/* <FaPlus className="text-orange-600 w-3 h-6 cursor-pointer mt-[-0.2rem] relative"/> */}
                        </div>
                      </div>

                    </div>
                    <div className="flex flex-col overflow-auto mt-12 w-[100%]">
                      {soApiresponse.map((strategy, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center ml-1 pb-2 pt-3 pl-2 w-auto ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                        >
                          <div className="flex break-words justify-between w-full">
                            <p className="pr-2 pt-[-0.10rem] text-[1.1rem] font-medium pl-2 break-words overflow-y-auto">
                              {strategy["s_oResponses"]}
                            </p>
                            <div className=" flex justify-end">
                              <button
                                //kani modal
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                onClick={() =>
                                openDeleteModal(strategy, 'SO')
                                }
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                            
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="flex align-center rounded-lg border border-gray-200 justify-between py-5 px-2 bg-white h-[30rem] w-[103rem]">
                  <div className="flex flex-col">
                  <div className="flex flex-row">
                  <div
                      className="flex flex-row rounded-lg h-10 p-1 w-[95rem]"
                    >
                      <img src="/wo.png" alt="" className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          W-O Strategies
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Addressing internal deficiencies to seize external opportunities.
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] ml-[3rem] pl-[0.3rem] pr-1 pt-[0.3rem] pb-1">
                        <div className="rounded-full w-[1.8rem] h-[1.6rem] bg-[#ffffff] pl-[0.5rem] pr-1 pt-1 pb-1 align-middle items-center mt-1">
                          {/* <FaPlus className="text-orange-600 w-3 h-6 cursor-pointer mt-[-0.2rem] relative"/> */}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col overflow-auto mt-12 w-[100%]">
                      {woApiresponse.map((strategy, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center ml-1 pb-2 pt-3 pl-2 w-auto ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                        >
                          <div className="flex break-words justify-between w-full">
                            <p className="pr-2 pt-[-0.10rem] text-[1.1rem] font-medium pl-2 break-words overflow-y-auto">
                              {strategy["w_oResponses"]}
                              
                              
                            </p>
                            <div className=" flex justify-end">
                              <button
                                //kani modal
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                onClick={() =>
                                  openDeleteModal(strategy, 'WO')
                                }
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="flex align-center rounded-lg border border-gray-200 justify-between py-5 px-2 bg-white h-[30rem] w-[103rem]">
                  <div className="flex flex-col">
                  <div className="flex flex-row">
                  <div
                      className="flex flex-row rounded-lg h-10 p-1 w-[95rem]"
                    >
                      <img src="/st.png" alt="" className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          S-T Strategies
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Using internal strengths to mitigate external risks.
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] ml-[3rem] pl-[0.3rem] pr-1 pt-[0.3rem] pb-1">
                        <div className="rounded-full w-[1.8rem] h-[1.6rem] bg-[#ffffff] pl-[0.5rem] pr-1 pt-1 pb-1 align-middle items-center mt-1">
                          {/* <FaPlus className="text-orange-600 w-3 h-6 cursor-pointer mt-[-0.2rem] relative"/> */}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col overflow-auto mt-12 w-[100%]">
                      {stApiresponse.map((strategy, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center ml-1 pb-2 pt-3 pl-2 w-auto ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                        >
                          <div className="flex break-words justify-between w-full">
                            <p className="pr-2 pt-[-0.10rem] text-[1.1rem] font-medium pl-2 break-words overflow-y-auto">
                              {strategy["s_tResponses"]}
                              
                            </p>
                            <div className=" flex justify-end">
                              <button
                                //kani modal
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                onClick={() =>
                                  openDeleteModal(strategy, 'ST')
                                }
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="flex align-center rounded-lg border border-gray-200 justify-between py-5 px-2 bg-white h-[30rem] w-[103rem]">
                  <div className="flex flex-col">
                  <div className="flex flex-row">
                  <div
                      className="flex flex-row rounded-lg h-10 p-1 w-[95rem]"
                    >
                      <img src="/wt.png" alt="" className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          W-T Strategies
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          Vulnerabilities that may be exploited by external challenges.
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] ml-[3rem] pl-[0.3rem] pr-1 pt-[0.3rem] pb-1">
                        <div className="rounded-full w-[1.8rem] h-[1.6rem] bg-[#ffffff] pl-[0.5rem] pr-1 pt-1 pb-1 align-middle items-center mt-1">
                          {/* <FaPlus className="text-orange-600 w-3 h-6 cursor-pointer mt-[-0.2rem] relative"/> */}
                        </div>
                      </div>
                    
                    </div>
                    <div className="flex flex-col overflow-auto mt-12 w-[100%]">
                      {wtApiresponse.map((strategy, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center ml-1 pb-2 pt-3 pl-2 w-auto ${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}
                        >
                          <div className="flex break-words justify-between w-full">
                            <p className="pr-2 pt-[-0.10rem] text-[1.1rem] font-medium pl-2 break-words overflow-y-auto">
                              {strategy["w_tResponses"]}
                              
                            </p>
                            <button
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                onClick={() =>
                                  openDeleteModal(strategy, 'WT') //added ni
                                }
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* added ni */}
                    {isDeleteModalOpen && strategyToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
                        <p className="text-3xl font-bold mb-4">Confirm Deletion</p>
                        <p className="text-xl mb-4 mt-10">Are you sure you want to delete this strategy?</p>
                        <div className="flex justify-center space-x-3 mt-10">
                          <button
                            className="break-words font-semibold border border-[#962203] w-[11rem] text-[1.2rem] text-[#962203] rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#ffffff] cursor-pointer hover:bg-[#962203] hover:text-[#ffffff]"
                            onClick={() => setIsDeleteModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                            style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                            onClick={handleDeleteConfirm}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </Card>
            </div>
          )}
        </div>
      {/* </div> */}
    </div>
  );
};

export default Swot;
