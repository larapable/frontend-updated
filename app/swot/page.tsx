"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbars/Navbar";
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

const drawerWidth = 220;

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
  borderRadius: "20px",
  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
  borderColor: "#e9e8e8",
  borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
  borderWidth: "1px",
});

const Boxes = styled(Box)({
  height: "auto",
  width: "100%",
});

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
  const [loading, setLoading] = useState(false);
  const [displaySwot, setDisplaySwot] = useState(true);
  const [soApiResponse, setSoApiResponse] = useState("");
  const [woApiResponse, setWoApiResponse] = useState("");
  const [stApiResponse, setStApiResponse] = useState("");
  const [wtApiResponse, setWtApiResponse] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState("swot");
  const [counter, setCounter] = useState(1);
  const delay = (ms: number | undefined) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  //new for strength
  const [strengthEditingId, setStrengthEditingId] = useState<string | null>(
    null
  );
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const [strengthToDelete, setStrengthToDelete] = useState<SwotItem | null>(
    null
  );
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
  const [weaknessEditingId, setWeaknessEditingId] = useState<string | null>(
    null
  );
  const [isWeaknessModalOpen, setIsWeaknessModalOpen] = useState(false);
  const [weaknessToDelete, setWeaknessToDelete] = useState<SwotItem | null>(
    null
  );
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
  const [opportunityEditingId, setOpportunityEditingId] = useState<
    string | null
  >(null);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] =
    useState<SwotItem | null>(null);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wtStrat/get/${department_id}`
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAseoTgESiDKU2-_qZuZ9u1fZz9q7LhWwE`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/wtStrat/insert`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wtStrat/delete/${id}`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stStrat/get/${department_id}`
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAseoTgESiDKU2-_qZuZ9u1fZz9q7LhWwE`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stStrat/insert`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stStrat/delete/${id}`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/soStrat/get/${department_id}`
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAseoTgESiDKU2-_qZuZ9u1fZz9q7LhWwE`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/soStrat/insert`,
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
  const deletesoStrategy = async (
    id: string,
    department_id: string
  ): Promise<Response> => {
    // Explicitly return Response
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/soStrat/delete/${id}`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/woStrat/get/${department_id}`
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAseoTgESiDKU2-_qZuZ9u1fZz9q7LhWwE`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/woStrat/insert`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/woStrat/delete/${id}`,
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
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/strengths/insert`,
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
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/weaknesses/insert`,
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
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/opportunities/insert`,
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
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/threats/insert`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/strengths/update/${department_id}`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/weaknesses/update/${department_id}`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/opportunities/update/${department_id}`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/threats/update/${department_id}`,
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

    const deleteItem = async (
      //new updated
      id: string,
      department_id: string,
      endpoint: string
    ) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}/delete/${id}`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}/get/${department_id}`
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
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/strengths/get/${department_id}`
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
      } finally {
        setLoading(false);
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
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/weaknesses/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weaknesses");
        }
        const data = await response.json();
        setFetchedWeaknesses(data);
        setLastFetchedDepartmentId(department_id);
      } catch (error: any) {
        console.error("Error fetching weaknesses:", error.message);
      } finally {
        setLoading(false);
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
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/opportunities/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const data = await response.json();
        setFetchedOpportunities(data);
        setLastFetchedDepartmentId(department_id);
      } catch (error: any) {
        console.error("Error fetching opportunities:", error.message);
      } finally {
        setLoading(false);
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
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/threats/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch threats");
        }
        const data = await response.json();
        setFetchedThreats(data);
        setLastFetchedDepartmentId(department_id);
      } catch (error: any) {
        console.error("Error fetching threats:", error.message);
      } finally {
        setLoading(false);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/strengths/get/${department_id}`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/weaknesses/get/${department_id}`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/opportunities/get/${department_id}`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/threats/get/${department_id}`
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
    setCurrentView("strategies");
  };

  const [isModalVisible, setModalVisible] = useState(false);

  // for restoring deleted items (STRENGTH)
  const [deletedStrengths, setDeletedStrengths] = useState<Strength[]>([]);
  const [isStrengthVisible, setIsStrengthVisible] = useState<boolean>(false);

  const [deletedWeaknesses, setDeletedWeaknesses] = useState<Strength[]>([]);
  const [isWeaknessesVisible, setIsWeaknessesVisible] =
    useState<boolean>(false);

  const [deletedOpportunities, setDeletedOpportunities] = useState<Strength[]>(
    []
  );
  const [isOpportunitiesVisible, setIsOpportunitiesVisible] =
    useState<boolean>(false);

  const [deletedThreats, setDeletedThreats] = useState<Strength[]>([]);
  const [isThreatsVisible, setIsThreatsVisible] = useState<boolean>(false);

  const fetchSwotItems = async (
    type: string,
    endpoint: string,
    setter: (data: any) => void
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${type}/${endpoint}/${department_id}`
      );
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
        toast.error(
          `Maximum limit of 5 ${type} items reached. Delete an item first.`
        );
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${type}/restore/${id}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to restore ${type}`);
      }
      fetchUpdatedItems();
      fetchDeletedItems();
      toast.success("Item restored successfully");
    } catch (error) {
      console.error(`Error restoring ${type}:`, error);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    fetchSwotItems("strengths", "deleted", setDeletedStrengths);
  }, []);

  useEffect(() => {
    fetchSwotItems("weaknesses", "deleted", setDeletedWeaknesses);
  }, []);

  useEffect(() => {
    fetchSwotItems("threats", "deleted", setDeletedThreats);
  }, []);

  useEffect(() => {
    fetchSwotItems("opportunities", "deleted", setDeletedOpportunities);
  }, []);

  const handleRestoreStrength = (id: number) => {
    handleRestoreItem(
      "strengths",
      id,
      fetchedStrengths,
      fetchUpdatedStrengths,
      () => fetchSwotItems("strengths", "deleted", setDeletedStrengths)
    );
  };

  const handleRestoreWeakness = (id: number) => {
    handleRestoreItem(
      "weaknesses",
      id,
      fetchedWeaknesses,
      fetchUpdatedWeaknesses,
      () => fetchSwotItems("weaknesses", "deleted", setDeletedWeaknesses)
    );
  };

  const handleRestoreOpportunity = (id: number) => {
    handleRestoreItem(
      "opportunities",
      id,
      fetchedOpportunities,
      fetchUpdatedOpportunities,
      () => fetchSwotItems("opportunities", "deleted", setDeletedOpportunities)
    );
  };

  const handleRestoreThreat = (id: number) => {
    handleRestoreItem("threats", id, fetchedThreats, fetchUpdatedThreats, () =>
      fetchSwotItems("threats", "deleted", setDeletedThreats)
    );
  };

  const toggleVisibility = (
    type: "strengths" | "weaknesses" | "threats" | "opportunities",
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
          case "SO":
            response = await deletesoStrategy(
              strategyToDelete.id,
              department_id
            );
            break;
          case "WO":
            response = await deletewoStrategy(
              strategyToDelete.id,
              department_id
            );
            break;
          case "ST":
            response = await deletestStrategy(
              strategyToDelete.id,
              department_id
            );
            break;
          case "WT":
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
                  fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' },
                }}
              >
                SWOT ANALYSIS
              </Typography>
            </Grid>

            <Grid item>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="15rem"
                height="3rem"
                borderRadius={2}
                sx={{ gap: 1, p: 1, borderWidth: 0.5, mt: {lg: '-2'}, mb: 1 }}
              >
                <Button
                  onClick={() => setCurrentView("swot")}
                  variant={currentView === "swot" ? "contained" : "outlined"}
                  fullWidth
                  sx={{
                    py: 2,
                    px: 3,
                    fontSize: "13px",
                    background:
                      currentView === "swot"
                        ? "linear-gradient(to left, #8a252c, #AB3510)"
                        : "transparent",
                    color: currentView === "swot" ? "white" : "#AB3510",
                    flexGrow: 2,
                    height: "100%",
                    border: "1px solid transparent",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      background: "linear-gradient(to left, #8a252c, #AB3510)",
                      color: "white",
                      border:
                        currentView === "swot" ? "none" : "0.5px solid #AB3510",
                    },
                  }}
                >
                  SWOT
                </Button>
                <Button
                  onClick={() => setCurrentView("strategies")}
                  variant={
                    currentView === "strategies" ? "contained" : "outlined"
                  }
                  fullWidth
                  sx={{
                    p: 2,
                    fontSize: "13px",
                    background:
                      currentView === "strategies"
                        ? "linear-gradient(to left, #8a252c, #AB3510)"
                        : "transparent",
                    color: currentView === "strategies" ? "white" : "#AB3510",
                    flexGrow: 2, // Ensure both buttons have equal size
                    height: "100%", // Match the height of the container
                    border: "1px solid transparent", // Keep border style consistent
                    transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                    "&:hover": {
                      background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                      color: "white", // Change text color on hover
                      border:
                        currentView === "strategies"
                          ? "none"
                          : "0.5px solid #AB3510", // Border on hover if not current
                    },
                  }}
                >
                  STRATEGIES
                </Button>
              </Box>
            </Grid>

            <Typography sx={{fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
              The SWOT Analysis feature allows you to input your Strengths,
              Weaknesses, Opportunities, and Threats. Based on your inputs, the
              AI will automatically generate strategic recommendations to help
              you achieve your goals
            </Typography>
          </Grid>

          {/* <StyledBox sx={{background: 'white', borderRadius: 5}}> */}
          {currentView === "swot" ? (
            <>
              {/* STRENGTH */}
              <Box sx={{ mt: 5 }}>
                <Button
                  variant="contained"
                  sx={{ p: 1 }}
                  style={{
                    background: "linear-gradient(to left, #8a252c, #AB3510)",
                    fontSize: "13px",
                  }}
                  onClick={() =>
                    toggleVisibility(
                      "strengths",
                      isStrengthVisible,
                      setIsStrengthVisible,
                      () =>
                        fetchSwotItems(
                          "strengths",
                          "deleted",
                          setDeletedStrengths
                        )
                    )
                  }
                >
                  {isStrengthVisible
                    ? "Hide Strength History"
                    : "Show Strength History"}
                </Button>

                {isStrengthVisible && (
                  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                      Deleted Strengths
                    </Typography>
                    {deletedStrengths.length === 0 ? (
                      <Typography sx={{pb:1 , fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                        No deleted strengths found.
                      </Typography>
                    ) : (
                      <ul className="space-y-1">
                        <Divider sx={{ my: 1 }} />
                        {deletedStrengths.map((strength, index) => (
                          <li
                            key={strength.id}
                            className={`flex items-center justify-between p-2 ${
                              index < deletedStrengths.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            <Typography
                              sx={{
                                fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' },
                                fontWeight: "400",
                                overflowWrap: "break-word", 
                                wordBreak: "break-word", 
                              }}
                            >
                              {strength.value}
                            </Typography>
                            <button
                              onClick={() => handleRestoreStrength(strength.id)}
                              className="text-[#A43214] hover:text-[#7A2812] transition-colors pr-5"
                              title="Restore strength"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </Box>

              <Cards>
                <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    sx={{
                      ml: 1,
                      height: "55px",
                      "& .MuiInputBase-root": { height: "55px" },
                    }}
                  >
                    <Grid item sm={11.3} container alignItems="center">
                      <Box>
                        <img src="/strength.png" alt="" className="h-[3.5rem]" />
                      </Box>
                      <Box sx={{ ml: 1 }}>
                       <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                          Strength
                        </Typography>
                        <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                          An internal advantage or resource.
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item sm={0.7} style={{ justifyContent: "flex-end" }}>
                      <Box
                        sx={{
                          p: 1,
                          background: "#ff7b00d3",
                          borderRadius: "50%",
                          width: "2.5rem",
                          height: "2.5rem",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                          onClick={strengths.handleAddClick}
                        >
                          <div className="flex flex-row">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
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

                  <Grid
                    container
                    alignItems="center"
                    py={-3}
                    px={2}
                    justifyContent="space-between"
                  >
                    <Grid item xs={12}>
                      {strengths.isAdding && (
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Type strength and press Enter"
                          value={strengths.newItem}
                          onChange={strengths.handleChange}
                          onKeyDown={strengths.addStrength}
                          sx={{
                            mt: 2,
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": {
                              fontSize: "15px", 
                            },
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    justifyContent="space-between"
                  >
                    <Grid item xs={12}>
                      {fetchedStrengths.map((strength, index: number) => (
                        <div
                          key={strength.id}
                          className={`flex justify-between items-center pl-2 pr-2 m-3 w-auto 
                            ${
                              index < fetchedStrengths.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                        >
                          <Box className="flex flex-row overflow-y-auto">
                            <Typography
                              sx={{ fontWeight: "bold", mr: 1, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                            >
                              {"S" + (index + 1)}:
                            </Typography>

                            {strengthEditingId === strength.id ? (
                              <input
                                value={strength.value}
                                className="bg-white border border-orange-400 absolute p-1 shadow-2xl font-semibold rounded-md mt-[-1rem] w-full"
                                style={{
                                  maxWidth: "70%", // Limit the maximum width to 70%
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
                              <Typography
                                sx={{ fontWeight: "400", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                                {strength.value.length > 110
                                  ? strength.value.slice(0, 110) + "..."
                                  : strength.value}
                              </Typography>
                            )}
                          </Box>

                          <div className="flex">
                            <div className="flex flex-row justify-center items-center">
                              <button
                                className="font-bold py-2 px-2 rounded text-orange-600"
                                onClick={() =>
                                  setStrengthEditingId(strength.id)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
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
                                onClick={() =>
                                  openStrengthDeleteModal(strength)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {isStrengthModalOpen && strengthToDelete && (
                            <Modal
                              open={isStrengthModalOpen}
                              onClose={() => setIsStrengthModalOpen(false)}
                              BackdropProps={{
                                style: {
                                  backgroundColor: "rgba(0, 0, 0, 0.2)", // Adjust the last value (alpha) to control darkness
                                },
                              }}
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
                                    padding: 4,
                                    borderRadius: 2,
                                    textAlign: "center",
                                    position: "relative",
                                    width: "25rem",
                                  }}
                                >
                                  <Typography
                                    sx={{ fontWeight: "bold", mb: 3, fontSize: { lg: '1.5rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                    >
                                    Confirm Deletion
                                  </Typography>
                                  <Typography sx={{ mb: 3, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
                                    Are you sure you want to delete this
                                    strength? <br />
                                    You can still restore it later if needed.
                                  </Typography>
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
                                      onClick={() =>
                                        setIsStrengthModalOpen(false)
                                      }
                                      sx={{
                                        width: "30%",
                                        color: "#AB3510",
                                        p: 1,
                                        fontSize: "15px",
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
                                      onClick={handleStrengthDeleteConfirm}
                                      sx={{
                                        width: "30%",
                                        background:
                                          "linear-gradient(to left, #8a252c, #AB3510)",
                                        p: 1,
                                        fontSize: "15px",
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Modal>
                          )}
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </StyledBox>
              </Cards>

              {/* WEAKNESS */}
              <Box sx={{ mt: 5 }}>
                <Button
                  variant="contained"
                  sx={{ p: 1 }}
                  style={{
                    background: "linear-gradient(to left, #8a252c, #AB3510)",
                    fontSize: "13px",
                  }}
                  onClick={() =>
                    toggleVisibility(
                      "weaknesses",
                      isWeaknessesVisible,
                      setIsWeaknessesVisible,
                      () =>
                        fetchSwotItems(
                          "weaknesses",
                          "deleted",
                          setDeletedWeaknesses
                        )
                    )
                  }
                >
                  {isWeaknessesVisible
                    ? "Hide Weakness History"
                    : "Show Weakness History"}
                </Button>
                {isWeaknessesVisible && (
                  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                      Deleted Weaknesses
                    </Typography>
                    {deletedWeaknesses.length === 0 ? (
                      <Typography sx={{pb:1 , fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                        No deleted weaknesses found.
                      </Typography>
                    ) : (
                      <ul className="space-y-1">
                        <Divider sx={{ my: 1 }} />
                        {deletedWeaknesses.map((weakness, index) => (
                          <li
                            key={weakness.id}
                            className={`flex items-center justify-between p-2 ${
                              index < deletedWeaknesses.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            <Typography
                              sx={{
                                fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' },
                                fontWeight: "400",
                                overflowWrap: "break-word", 
                                wordBreak: "break-word", 
                              }}
                            >
                              {weakness.value}
                            </Typography>
                            <button
                              onClick={() => handleRestoreWeakness(weakness.id)}
                              className="text-[#A43214] hover:text-[#7A2812] transition-colors pr-5"
                              title="Restore weakness"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </Box>

              <Cards>
                <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    sx={{
                      ml: 1,
                      height: "55px",
                      "& .MuiInputBase-root": { height: "55px" },
                    }}
                  >
                    <Grid item sm={11.3} container alignItems="center">
                      <Box>
                        <img src="/weakness.png" alt="" className="h-[3.5rem]" />
                      </Box>
                      <Box sx={{ ml: 1 }}>
                        <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                          Weakness
                        </Typography>
                        <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                          An internal limitation or deficiency.
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item sm={0.7} style={{ justifyContent: "flex-end" }}>
                      <Box
                        sx={{
                          p: 1,
                          background: "#ff7b00d3",
                          borderRadius: "50%",
                          width: "2.5rem",
                          height: "2.5rem",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                          onClick={weaknesses.handleAddClick}
                        >
                          <div className="flex flex-row">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
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

                  <Grid
                    container
                    alignItems="center"
                    py={-3}
                    px={2}
                    justifyContent="space-between"
                  >
                    <Grid item xs={12}>
                      {weaknesses.isAdding && (
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Type weakness and press Enter"
                          value={weaknesses.newItem}
                          onChange={weaknesses.handleChange}
                          onKeyDown={weaknesses.addWeakness}
                          sx={{
                            mt: 2,
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": {
                              fontSize: "15px", 
                            },
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    justifyContent="space-between"
                  >
                    <Grid item xs={12}>
                      {fetchedWeaknesses.map((weakness, index: number) => (
                        <div
                          key={weakness.id}
                          className={`flex justify-between items-center pl-2 pr-2 m-3 w-auto ${
                            index < fetchedWeaknesses.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <Box className="flex flex-row overflow-y-auto">
                            <Typography
                              sx={{ fontWeight: "bold", mr: 1, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                            >
                              {"W" + (index + 1)}:
                            </Typography>

                            {weaknessEditingId === weakness.id ? (
                              <input
                                value={weakness.value}
                                className="bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md mt-[-1rem] w-full"
                                style={{
                                  maxWidth: "70%", // Limit the maximum width to 70%
                                }}
                                onChange={(e) => {
                                  const updatedWeaknesses =
                                    fetchedWeaknesses.map((w) =>
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
                              <Typography
                                sx={{ fontWeight: "400", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                                {weakness.value.length > 110
                                  ? weakness.value.slice(0, 110) + "..."
                                  : weakness.value}
                              </Typography>
                            )}
                          </Box>

                          <div className="flex">
                            <div className="flex flex-row justify-center items-center">
                              <button
                                className="font-bold py-2 px-2 rounded text-orange-600"
                                onClick={() =>
                                  setWeaknessEditingId(weakness.id)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
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
                                onClick={() =>
                                  openWeaknessDeleteModal(weakness)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {isWeaknessModalOpen && weaknessToDelete && (
                            <Modal
                              open={isWeaknessModalOpen}
                              onClose={() => setIsWeaknessModalOpen(false)}
                              BackdropProps={{
                                style: {
                                  backgroundColor: "rgba(0, 0, 0, 0.2)", // Adjust the last value (alpha) to control darkness
                                },
                              }}
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
                                    padding: 4,
                                    borderRadius: 2,
                                    textAlign: "center",
                                    position: "relative",
                                    width: "25rem",
                                  }}
                                >
                                  <Typography
                                    sx={{ fontWeight: "bold", mb: 3, fontSize: { lg: '1.5rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                    >
                                    Confirm Deletion
                                  </Typography>
                                  <Typography sx={{ mb: 3, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
                                    Are you sure you want to delete this
                                    weakness? You can still restore it later if needed.
                                  </Typography>
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
                                      onClick={() =>
                                        setIsWeaknessModalOpen(false)
                                      }
                                      sx={{
                                        width: "30%",
                                        color: "#AB3510",
                                        p: 1,
                                        fontSize: "15px",
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
                                      onClick={handleWeaknessDeleteConfirm}
                                      sx={{
                                        width: "30%",
                                        background:
                                          "linear-gradient(to left, #8a252c, #AB3510)",
                                        p: 1,
                                        fontSize: "15px",
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Modal>
                          )}
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </StyledBox>
              </Cards>
              {/* OPPORTUNITIES */}
              <Box sx={{ mt: 5 }}>
                <Button
                  variant="contained"
                  sx={{ p: 1 }}
                  style={{
                    background: "linear-gradient(to left, #8a252c, #AB3510)",
                    fontSize: "13px",
                  }}
                  onClick={() =>
                    toggleVisibility(
                      "opportunities",
                      isOpportunitiesVisible,
                      setIsOpportunitiesVisible,
                      () =>
                        fetchSwotItems(
                          "opportunities",
                          "deleted",
                          setDeletedOpportunities
                        )
                    )
                  }
                >
                  {isOpportunitiesVisible
                    ? "Hide Opportunities History"
                    : "Show Opportunities History"}
                </Button>
                {isOpportunitiesVisible && (
                  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                      Deleted Opportunities
                    </Typography>
                    {deletedOpportunities.length === 0 ? (
                      <Typography sx={{pb:1 , fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                        No deleted opportunities found.
                      </Typography>
                    ) : (
                      <ul className="space-y-1">
                        <Divider sx={{ my: 1 }} />
                        {deletedOpportunities.map((opportunity, index) => (
                          <li
                            key={opportunity.id}
                            className={`flex items-center justify-between p-2 ${
                              index < deletedOpportunities.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            <Typography
                              sx={{
                                fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' },
                                fontWeight: "400",
                                overflowWrap: "break-word", 
                                wordBreak: "break-word", 
                              }}
                            >
                              {opportunity.value}
                            </Typography>
                            <button
                              onClick={() =>
                                handleRestoreOpportunity(opportunity.id)
                              }
                              className="text-[#A43214] hover:text-[#7A2812] transition-colors"
                              title="Restore opportunity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </Box>

              <Cards>
                <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    sx={{
                      ml: 1,
                      height: "55px",
                      "& .MuiInputBase-root": { height: "55px" },
                    }}
                  >
                    <Grid item sm={11.3} container alignItems="center">
                      <Box>
                        <img
                          src="/opportunity.png"
                          alt=""
                          className="h-[3.5rem]"
                        />
                      </Box>
                      <Box sx={{ ml: 1 }}>
                      <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                          Opportunity
                        </Typography>
                        <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                          An external chance for growth or improvement.
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item sm={0.7} style={{ justifyContent: "flex-end" }}>
                      <Box
                        sx={{
                          p: 1,
                          background: "#ff7b00d3",
                          borderRadius: "50%",
                          width: "2.5rem",
                          height: "2.5rem",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                          onClick={opportunities.handleAddClick}
                        >
                          <div className="flex flex-row">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
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

                  <Grid
                    container
                    alignItems="center"
                    py={-3}
                    px={2}
                    justifyContent="space-between"
                  >
                    <Grid item xs={12}>
                      {opportunities.isAdding && (
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Type opportunity and press Enter"
                          value={opportunities.newItem}
                          onChange={opportunities.handleChange}
                          onKeyDown={opportunities.addOpportunities}
                          sx={{
                            mt: 2,
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": {
                              fontSize: "15px", 
                            },
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    justifyContent="space-between"
                  >
                    <Grid item xs={12}>
                      {fetchedOpportunities.map(
                        (opportunity, index: number) => (
                          <div
                            key={opportunity.id}
                            className={`flex justify-between items-center pl-2 pr-2 m-3 w-auto ${
                              index < fetchedOpportunities.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            <Box className="flex flex-row overflow-y-auto">
                              <Typography
                                sx={{ fontWeight: "bold", mr: 1, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                                {"O" + (index + 1)}:
                              </Typography>

                              {opportunityEditingId === opportunity.id ? (
                                <input
                                  value={opportunity.value}
                                  className="bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md mt-[-1rem] w-full"
                                  style={{
                                    maxWidth: "70%", // Limit the maximum width to 70%
                                  }}
                                  onChange={(e) => {
                                    const updatedOpportunities =
                                      fetchedOpportunities.map((o) =>
                                        o.id === opportunity.id
                                          ? { ...o, value: e.target.value }
                                          : o
                                      );
                                    setFetchedOpportunities(
                                      updatedOpportunities
                                    );
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
                                <Typography
                                  sx={{ fontWeight: "400", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                >
                                  {opportunity.value.length > 110
                                    ? opportunity.value.slice(0, 110) + "..."
                                    : opportunity.value}
                                </Typography>
                              )}
                            </Box>

                            <div className="flex">
                              <div className="flex flex-row justify-center items-center">
                                <button
                                  className="font-bold py-2 px-2 rounded text-orange-600"
                                  onClick={() =>
                                    setOpportunityEditingId(opportunity.id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
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
                                  onClick={() =>
                                    openOpportunityDeleteModal(opportunity)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="size-5"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {isOpportunityModalOpen && opportunityToDelete && (
                              <Modal
                                open={isOpportunityModalOpen}
                                onClose={() => setIsOpportunityModalOpen(false)}
                                BackdropProps={{
                                  style: {
                                    backgroundColor: "rgba(0, 0, 0, 0.2)", // Adjust the last value (alpha) to control darkness
                                  },
                                }}
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
                                      padding: 4,
                                      borderRadius: 2,
                                      textAlign: "center",
                                      position: "relative",
                                      width: "25rem",
                                    }}
                                  >
                                    <Typography
                                    sx={{ fontWeight: "bold", mb: 3, fontSize: { lg: '1.5rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                    >
                                      Confirm Deletion
                                    </Typography>
                                    <Typography sx={{ mb: 3, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
                                      Are you sure you want to delete this
                                      opportunity? You can still restore it later if needed.
                                    </Typography>
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
                                        onClick={() =>
                                          setIsOpportunityModalOpen(false)
                                        }
                                        sx={{
                                          width: "30%",
                                          color: "#AB3510",
                                          p: 1,
                                          fontSize: "15px",
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
                                        onClick={handleOpportunityDeleteConfirm}
                                        sx={{
                                          width: "30%",
                                          background:
                                            "linear-gradient(to left, #8a252c, #AB3510)",
                                          p: 1,
                                          fontSize: "15px",
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </Box>
                                  </Box>
                                </Box>
                              </Modal>
                            )}
                          </div>
                        )
                      )}
                    </Grid>
                  </Grid>
                </StyledBox>
              </Cards>
              {/* THREATS */}
              <Box sx={{ mt: 5 }}>
                <Button
                  variant="contained"
                  sx={{ p: 1 }}
                  style={{
                    background: "linear-gradient(to left, #8a252c, #AB3510)",
                    fontSize: "15px",
                  }}
                  onClick={() =>
                    toggleVisibility(
                      "threats",
                      isThreatsVisible,
                      setIsThreatsVisible,
                      () =>
                        fetchSwotItems("threats", "deleted", setDeletedThreats)
                    )
                  }
                >
                  {isThreatsVisible
                    ? "Hide Threats History"
                    : "Show Threats History"}
                </Button>
                {isThreatsVisible && (
                  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                      Deleted Threats
                    </Typography>
                    {deletedThreats.length === 0 ? (
                      <Typography sx={{pb:1 , fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                        No deleted threats found.
                      </Typography>
                    ) : (
                      <ul className="space-y-1">
                        <Divider sx={{ my: 1 }} />
                        {deletedThreats.map((threat, index) => (
                          <li
                            key={threat.id}
                            className={`flex items-center justify-between p-2 ${
                              index < deletedThreats.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            <Typography
                              sx={{
                                fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' },
                                fontWeight: "400",
                                overflowWrap: "break-word", 
                                wordBreak: "break-word", 
                              }}
                            >
                              {threat.value}
                            </Typography>
                            <button
                              onClick={() => handleRestoreThreat(threat.id)}
                              className="text-[#A43214] hover:text-[#7A2812] transition-colors"
                              title="Restore threat"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </Box>

              <Cards>
                <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    sx={{
                      ml: 1,
                      height: "55px",
                      "& .MuiInputBase-root": { height: "55px" },
                    }}
                  >
                    <Grid item sm={11.3} container alignItems="center">
                      <Box>
                        <img src="/threats.png" alt="" className="h-[3.5rem]" />
                      </Box>
                      <Box sx={{ ml: 1 }}>
                      <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                          Threat
                        </Typography>
                        <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                          An external risk or challenge.
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item sm={0.7} style={{ justifyContent: "flex-end" }}>
                      <Box
                        sx={{
                          p: 1,
                          background: "#ff7b00d3",
                          borderRadius: "50%",
                          width: "2.5rem",
                          height: "2.5rem",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                          onClick={threats.handleAddClick}
                        >
                          <div className="flex flex-row">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
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

                  <Grid
                    container
                    alignItems="center"
                    py={-3}
                    px={2}
                    justifyContent="space-between"
                  >
                    <Grid item xs={12}>
                      {threats.isAdding && (
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Type threat and press Enter"
                          value={threats.newItem}
                          onChange={threats.handleChange}
                          onKeyDown={threats.addThreats}
                          sx={{
                            mt: 2,
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": {
                              fontSize: "15px", 
                            },
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    justifyContent="space-between"
                  >
                    <Grid item xs={12}>
                      {fetchedThreats.map((threat, index: number) => (
                        <div
                          key={threat.id}
                          className={`flex justify-between items-center pl-2 pr-2 m-3 w-auto ${
                            index < fetchedThreats.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <Box className="flex flex-row overflow-y-auto">
                            <Typography
                                sx={{ fontWeight: "bold", mr: 1, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                              {"T" + (index + 1)}:
                            </Typography>

                            {threatEditingId === threat.id ? (
                              <input
                                value={threat.value}
                                className="bg-white border border-orange-400 absolute p-4 shadow-2xl font-semibold rounded-md mt-[-1rem] w-full"
                                style={{
                                  maxWidth: "70%", // Limit the maximum width to 70%
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
                              <Typography
                                  sx={{ fontWeight: "400", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                >
                                {threat.value.length > 110
                                  ? threat.value.slice(0, 110) + "..."
                                  : threat.value}
                              </Typography>
                            )}
                          </Box>

                          <div className="flex">
                            <div className="flex flex-row justify-center items-center">
                              <button
                                className="font-bold py-2 px-2 rounded text-orange-600"
                                onClick={() => setThreatEditingId(threat.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
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
                                onClick={() => openThreatDeleteModal(threat)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {isThreatModalOpen && threatToDelete && (
                            <Modal
                              open={isThreatModalOpen}
                              onClose={() => setIsThreatModalOpen(false)}
                              BackdropProps={{
                                style: {
                                  backgroundColor: "rgba(0, 0, 0, 0.2)", // Adjust the last value (alpha) to control darkness
                                },
                              }}
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
                                    padding: 4,
                                    borderRadius: 2,
                                    textAlign: "center",
                                    position: "relative",
                                    width: "25rem",
                                  }}
                                >
                                  <Typography
                                    sx={{ fontWeight: "bold", mb: 3, fontSize: { lg: '1.5rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                    >
                                    Confirm Deletion
                                  </Typography>
                                  <Typography sx={{ mb: 3, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
                                    Are you sure you want to delete this threat?{" "}
                                    You can still restore it later if needed.
                                  </Typography>
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
                                      onClick={() =>
                                        setIsThreatModalOpen(false)
                                      }
                                      sx={{
                                        width: "30%",
                                        color: "#AB3510",
                                        p: 1,
                                        fontSize: "15px",
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
                                      onClick={handleThreatDeleteConfirm}
                                      sx={{
                                        width: "30%",
                                        background:
                                          "linear-gradient(to left, #8a252c, #AB3510)",
                                        p: 1,
                                        fontSize: "15px",
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Modal>
                          )}
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </StyledBox>
              </Cards>

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
                  onClick={generateStrategies}
                  sx={{
                    p: 2,
                    fontSize: "15px",
                  }}
                  style={{
                    background: "linear-gradient(to left, #8a252c, #AB3510)",
                    width: "20%",
                    borderRadius: "12px",
                  }}
                >
                  Generate Strategies
                </Button>
              </Box>

              {isModalVisible && (
                <Modal
                  open={isModalVisible}
                  BackdropProps={{
                    style: {
                      backgroundColor: "rgba(0, 0, 0, 0.3)", // Adjust the last value (alpha) to control darkness
                    },
                  }}
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
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                        textAlign: "center",
                        position: "relative",
                        width: "25rem",
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: "bold", mb: 3, fontSize: { lg: '1.5rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                        >
                        Strategies Successfully Generated
                      </Typography>
                      <Typography sx={{ mb: 3, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
                        The AI has analyzed the inputted SWOT <br />
                        data and created strategies.
                      </Typography>
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
                          onClick={closeModal}
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
              )}
            </>
          ) : (
            <>
              {/* insert strategies here */}
              {/* STRENGTH */}
              <Cards sx={{ mt: 5 }}>
                <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    sx={{
                      ml: 1,
                      height: "55px",
                      "& .MuiInputBase-root": { height: "55px" },
                    }}
                  >
                    <Grid item sm={11.3} container alignItems="center">
                      <Box>
                        <img src="/so.png" alt="" className="h-[3.5rem]" />
                      </Box>
                      <Box sx={{ ml: 1 }}>
                      <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                          S-O Strategies
                        </Typography>
                        <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                          Leveraging internal advantages to capitalize on
                          external chances.
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
                      {soApiresponse.map((strategy, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center pl-2 pr-2 m-3 w-auto ${
                            index < soApiresponse.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <Box className="flex flex-row overflow-y-auto">
                          <Typography
                                  sx={{ fontWeight: "400", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                >
                              {strategy["s_oResponses"]}
                            </Typography>
                          </Box>

                          <div className="flex">
                            <div className="flex flex-row justify-center items-center">
                              <button
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                onClick={() => openDeleteModal(strategy, "SO")}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </StyledBox>
              </Cards>

              {/* WEAKNESS */}

              <Cards sx={{ mt: 5 }}>
                <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    sx={{
                      ml: 1,
                      height: "55px",
                      "& .MuiInputBase-root": { height: "55px" },
                    }}
                  >
                    <Grid item sm={11.3} container alignItems="center">
                      <Box>
                        <img src="/wo.png" alt="" className="h-[3.5rem]" />
                      </Box>
                      <Box sx={{ ml: 1 }}>
                      <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                          W-O Strategies
                        </Typography>
                        <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                          Addressing internal deficiencies to seize external
                          opportunities.
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
                      {woApiresponse.map((strategy, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center pl-2 pr-2 m-3 w-auto ${
                            index < woApiresponse.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <Box className="flex flex-row overflow-y-auto">
                          <Typography
                                  sx={{ fontWeight: "400", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                >
                              {strategy["w_oResponses"]}
                            </Typography>
                          </Box>

                          <div className="flex">
                            <div className="flex flex-row justify-center items-center">
                              <button
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                onClick={() => openDeleteModal(strategy, "WO")}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </StyledBox>
              </Cards>
              {/* OPPORTUNITIES */}

              <Cards sx={{ mt: 5 }}>
                <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    sx={{
                      ml: 1,
                      height: "55px",
                      "& .MuiInputBase-root": { height: "55px" },
                    }}
                  >
                    <Grid item sm={11.3} container alignItems="center">
                      <Box>
                        <img src="/st.png" alt="" className="h-[3.5rem]" />
                      </Box>
                      <Box sx={{ ml: 1 }}>
                        <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                          S-T Strategies
                        </Typography>
                        <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                          Using internal strengths to mitigate external risks.
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
                      {stApiresponse.map((strategy, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center pl-2 pr-2 m-3 w-auto ${
                            index < stApiresponse.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <Box className="flex flex-row overflow-y-auto">
                            <Typography
                                  sx={{ fontWeight: "400", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                >
                              {strategy["s_tResponses"]}
                            </Typography>
                          </Box>

                          <div className="flex">
                            <div className="flex flex-row justify-center items-center">
                              <button
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                onClick={() => openDeleteModal(strategy, "ST")}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </StyledBox>
              </Cards>
              {/* THREATS */}

              <Cards sx={{ mt: 5 }}>
                <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                  <Grid
                    container
                    alignItems="center"
                    p={1}
                    sx={{
                      ml: 1,
                      height: "55px",
                      "& .MuiInputBase-root": { height: "55px" },
                    }}
                  >
                    <Grid item sm={11.3} container alignItems="center">
                      <Box>
                        <img src="/wt.png" alt="" className="h-[3.5rem]" />
                      </Box>
                      <Box sx={{ ml: 1 }}>
                      <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                          W-T Strategies
                        </Typography>
                        <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
                          Vulnerabilities that may be exploited by external
                          challenges.
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
                      {wtApiresponse.map((strategy, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center pl-2 pr-2 m-3 w-auto ${
                            index < wtApiresponse.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <Box className="flex flex-row overflow-y-auto">
                            <Typography
                                  sx={{ fontWeight: "400", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                                >
                              {strategy["w_tResponses"]}
                            </Typography>
                          </Box>

                          <div className="flex">
                            <div className="flex flex-row justify-center items-center">
                              <button
                                className="font-bold py-2 px-2 rounded text-[#AB3510]"
                                onClick={() => openDeleteModal(strategy, "WT")}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </StyledBox>
              </Cards>

              {isDeleteModalOpen && strategyToDelete && (
                <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
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
                      sx={{ fontWeight: "bold", mb: 3, fontSize: { lg: '1.5rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                      >
                      Confirm Deletion
                    </Typography>
                    <Typography sx={{ mb: 3, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
                      Are you sure you want to delete this strategy?
                    </Typography>
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
                        onClick={() => setIsDeleteModalOpen(false)}
                        sx={{
                          width: "30%",
                          color: "#AB3510",
                          p: 1,
                          fontSize: "15px",
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
                        onClick={handleDeleteConfirm}
                        sx={{
                          width: "30%",
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                          p: 1,
                          fontSize: "15px",
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          )}
        </StyledBox>
      </Box>
    </Box>
  );
};

export default Swot;