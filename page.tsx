

"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import { toast } from "react-toastify";
import { getSession, useSession } from "next-auth/react";

interface SwotItem {
  id: string;
  value: string;
}

interface Strategy {
  id: string;
  'w-tResponses': string;
}

interface Strategy1 {
  id: string;
  's-tResponses': string;
}

interface Strategy2 {
  id: string;
  's-oResponses': string;
}

interface Strategy3 {
  id: string;
  'w-oResponses': string;
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

  const { data: session } = useSession();

  let user;
  if(session?.user?.name) 
    user = JSON.parse(session?.user?.name as string);
    const department_id = user?.department_id;
  
  const generateStrategies = async () => {
    callWTAPI();
    callSTAPI();
    callWOAPI();
    callSOAPI();
    setModalVisible(true);
  }
  const [wtApiresponse, setWtApiresponse] = useState<Strategy[]>([]);
  const [stApiresponse, setStApiresponse] = useState<Strategy1[]>([]);
  const [soApiresponse, setSoApiresponse] = useState<Strategy2[]>([]);
  const [woApiresponse, setWoApiresponse] = useState<Strategy3[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`api/wtStrategy/${department_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
      setWtApiresponse(data);
    } catch (error: any) {
      console.error('Error fetching the data:', error.message);
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
          (weakness, index) =>
            `${index + 1}. ${weakness.id}: ${weakness.value}`
        )
        .join("\n");
  
      const threatsInput = fetchedThreats
        .map(
          (threat, index) => `${index + 1}. ${threat.id}: ${threat.value}`
        )
        .join("\n");
  
      console.log('Weaknesses Input:', weaknessesInput);
      console.log('Threats Input:', threatsInput);
  
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
      const strategiesArray = apiResponse.split("\n").filter((str: string) => str.trim());
  
      // Save each strategy individually to the database
      for (const strategy of strategiesArray) {
        const databaseResponse = await fetch("/api/wtStrategy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ response: strategy, department_id: department_id}),
        });
  
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
      const response = await fetch(`/api/wtStrategy`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: id, department_id: department_id}),
      });

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

      // Remove the strategy from the state to update the UI
      fetchData();
    } catch (error:any) {
      console.error("Error deleting strategy:", error.message);
    }
  };
  
  const fetchstData = async () => {
    try {
      const response = await fetch(`api/stStrategy/${department_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
      setStApiresponse(data);
    } catch (error: any) {
      console.error('Error fetching the data:', error.message);
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
          (strength, index) =>
            `${index + 1}. ${strength.id}: ${strength.value}`
        )
        .join("\n");
  
      const threatsInput = fetchedThreats
        .map(
          (threat, index) =>
            `${index + 1}. ${threat.id}: ${threat.value}`
        )
        .join("\n");
  
      console.log('strengths Input:', strengthsInput);
      console.log('threats Input:', threatsInput);
  
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
    const strategiesArray = apiResponse.split("\n").filter((str: string) => str.trim());
  
     // Save each strategy individually to the database
     for (const strategy of strategiesArray) {
      const databaseResponse = await fetch("/api/stStrategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response: strategy, department_id: department_id}),
      });

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
      const response = await fetch(`/api/stStrategy`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: id, department_id: department_id}),
      });

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

      // Remove the strategy from the state to update the UI
      fetchstData();
    } catch (error:any) {
      console.error("Error deleting strategy:", error.message);
    }
  };

  const fetchsoData = async () => {
    try {
      const response = await fetch(`api/soStrategy/${department_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
      setSoApiresponse(data);
    } catch (error: any) {
      console.error('Error fetching the data:', error.message);
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
          (strength, index) =>
            `${index + 1}. ${strength.id}: ${strength.value}`
        )
        .join("\n");
  
      const OpportunitiesInput = fetchedOpportunities
        .map(
          (opportunity, index) =>
            `${index + 1}. ${opportunity.id}: ${opportunity.value}`
        )
        .join("\n");
  
      console.log('Strengths Input:', strengthsInput);
      console.log('Opportunities Input:', OpportunitiesInput);
  
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
    const strategiesArray = apiResponse.split("\n").filter((str: string) => str.trim());
  
      // Save each strategy individually to the database
     for (const strategy of strategiesArray) {
      const databaseResponse = await fetch("/api/soStrategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response: strategy, department_id: department_id}),
      });

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

  const deletesoStrategy = async (id: string, department_id: string) => {
    try {
      const response = await fetch(`/api/soStrategy`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: id, department_id: department_id}),
      });

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

      // Remove the strategy from the state to update the UI
      fetchsoData();
    } catch (error:any) {
      console.error("Error deleting strategy:", error.message);
    }
  };

  const fetchwoData = async () => {
    try {
      const response = await fetch(`api/woStrategy/${department_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
      setWoApiresponse(data);
    } catch (error: any) {
      console.error('Error fetching the data:', error.message);
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
          (weakness, index) =>
            `${index + 1}. ${weakness.id}: ${weakness.value}`
        )
        .join("\n");
  
      const OpportunitiesInput = fetchedOpportunities
        .map(
          (opportunity, index) =>
            `${index + 1}. ${opportunity.id}: ${opportunity.value}`
        )
        .join("\n");
  
      console.log('Weaknesses Input:', weaknessesInput);
      console.log('Opportunities Input:', OpportunitiesInput);
  
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
    const strategiesArray = apiResponse.split("\n").filter((str: string) => str.trim());
  
       // Save each strategy individually to the database
       for (const strategy of strategiesArray) {
        const databaseResponse = await fetch("/api/woStrategy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ response: strategy, department_id: department_id}),
        });
  
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
      const response = await fetch(`/api/woStrategy`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: id, department_id: department_id}),
      });

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

      // Remove the strategy from the state to update the UI
      fetchwoData();
    } catch (error:any) {
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
            const response = await fetch(`api/strengths`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ value: newItem.trim(), department_id: department_id }),
            });
    
            if (!response.ok) {
              throw new Error('Failed to add item. Please try again.');
            }
    
            const { message, newStrength } = await response.json();
    
            if (response.status === 201) {
              // Update fetchedStrengths state and wait for it to complete
              const updatedStrength = { ...newStrength, id: newStrength.data.id };
              setFetchedStrengths(prevStrengths => [...prevStrengths, updatedStrength]);
              setNewItem("");
              setIsAdding(false);
              toast.success(message);

              fetchUpdatedStrengths();
            } else {
              console.error('Error adding strength:', message);
              toast.error(message);
            }
    
          } catch (error: any) {
            console.error('Error adding item:', error.message);
            toast.error('An unexpected error occurred');
          }
        }
      }
    };

    const addWeakness  = async (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && newItem.trim()) {
        if (fetchedWeaknesses.length >= 5) {
          toast.error("Maximum limit of 5 items reached");
        } else {
          try {
            // Send data to backend
            const response = await fetch(`api/weaknesses`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ value: newItem.trim(), department_id: department_id }),
            });
    
            if (!response.ok) {
              throw new Error('Failed to add item. Please try again.');
            }
    
            const { message, newWeakness } = await response.json();

            if (response.status === 201) {
              const updatedWeakness = { ...newWeakness, id: newWeakness.data.id };
              setFetchedWeaknesses(prevWeaknesses => [...prevWeaknesses, updatedWeakness]);
              setNewItem("");
              setIsAdding(false);
              toast.success(message);
            

              fetchUpdatedWeaknesses();
            } else {
              console.error('Error adding strength:', message);
              toast.error(message);
            }
    
          } catch (error: any) {
            console.error('Error adding item:', error.message);
            toast.error('An unexpected error occurred');
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
            const response = await fetch(`api/opportunities`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ value: newItem.trim(), department_id: department_id }),
            });
    
            if (!response.ok) {
              throw new Error('Failed to add item. Please try again.');
            }
    
            const { message, newOpportunities } = await response.json();
    
            if (response.status === 201) {
              const updatedOpportunities = { ...newOpportunities, id: newOpportunities.data.id };
              setFetchedOpportunities(prevOpportunities => [...prevOpportunities, updatedOpportunities]);
              setNewItem("");
              setIsAdding(false);
              toast.success(message);
    
              fetchUpdatedOpportunities();
            } else {
              console.error('Error adding opportunity:', message);
              toast.error(message);
            }
          } catch (error: any) {
            console.error('Error adding item:', error.message);
            toast.error('An unexpected error occurred');
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
            const response = await fetch(`api/threats`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ value: newItem.trim(), department_id: department_id }),
            });
    
            if (!response.ok) {
              throw new Error('Failed to add item. Please try again.');
            }
    
            const { message, newThreats } = await response.json();
    
            if (response.status === 201) {
              const updatedThreats = { ...newThreats, id: newThreats.data.id };
              setFetchedThreats(prevThreats => [...prevThreats, updatedThreats]);
              setNewItem("");
              setIsAdding(false);
              toast.success(message);
    
              fetchUpdatedThreats();
            } else {
              console.error('Error adding threat:', message);
              toast.error(message);
            }
          } catch (error: any) {
            console.error('Error adding item:', error.message);
            toast.error('An unexpected error occurred');
          }
        }
      }
    };
    
    const EditStrength = async (id: string, newValue: string, department_id: string) => {
      try {
        const response = await fetch(`api/strengths`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, newValue: newValue, department_id: department_id }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to update item. Please try again.');
        }
    
        const {updatedstr }= await response.json();  
        setFetchedStrengths(prevStrengths =>
          prevStrengths.map(strength => {
            if (strength.id === updatedstr.updatedStrength.id) {
             
              return updatedstr.updatedStrength;
            } else {
             
              return strength;
            }
          })
        );
    
        console.log(`Strengths updated successfully`);
      } catch (error: any) {
        console.error('Error updating item:', error.message);
      }
    };
    
    const EditWeakness = async (id: string, newValue: string, department_id: string) => {
      try {
        const response = await fetch(`api/weaknesses`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, newValue: newValue, department_id: department_id }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to update item. Please try again.');
        }
    
        const {updatedwks }= await response.json();
  
        setFetchedWeaknesses(prevWeaknesses =>
          prevWeaknesses.map(weakness => {
         
            if (weakness.id === updatedwks.updatedWeakness.id) {
              
              return updatedwks.updatedWeakness;
            } else {
           
              return weakness;
            }
          })
        );
    
        console.log(`Weakness updated successfully`);
      } catch (error: any) {
        console.error('Error updating item:', error.message);
      }
    };

    const EditOpportunities = async (id: string, newValue: string, department_id: string) => {
      try {
        const response = await fetch(`api/opportunities`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, newValue: newValue, department_id: department_id }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to update item. Please try again.');
        }
    
        const {updatedOpp }= await response.json();

        setFetchedOpportunities(prevOpportunities =>
          prevOpportunities.map(opportunity => {
            if (opportunity.id === updatedOpp.updatedOpportunities.id) {
              return updatedOpp.updatedOpportunities;
            } else {
              return opportunity;
            }
          })
        );
    
        console.log(`Opportunites updated successfully`);
      } catch (error: any) {
        console.error('Error updating item:', error.message);
      }
    };

    const EditThreats = async (id: string, newValue: string, department_id: string) => {
      try {
        const response = await fetch(`api/threats`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, newValue: newValue, department_id: department_id }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to update item. Please try again.');
        }

        const {updatedthr }= await response.json();
        setFetchedThreats(prevThreats =>
          prevThreats.map(threat => {
            if (threat.id === updatedthr.updatedThreats.id) {
              return updatedthr.updatedThreats;
            } else {
              return threat;
            }
          })
        );
    
        console.log(`Threats updated successfully`);
      } catch (error: any) {
        console.error('Error updating item:', error.message);
      }
    };

    const deleteItem = async (id: string, department_id: string, endpoint: string) => {
      try {
        const response = await fetch(`api/${endpoint}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, department_id: department_id }),
        });
    
        if (response.ok) {
          // Delete successful, fetch updated items to update UI
          fetchUpdatedItems(endpoint);
          console.log(`Item with ID ${id} in ${endpoint} deleted successfully`);
        } else {
          console.error(`Error deleting item with ID ${id} in ${endpoint}`);
        }
      } catch (error:any) {
        console.error(`Error deleting item with ID ${id} in ${endpoint}:`, error.message);
      }
    };

    const fetchUpdatedItems = async (endpoint: string) => {
      try {
        const response = await fetch(`api/${endpoint}/${department_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch updated ${endpoint}`);
        }
        const data = await response.json();
        switch (endpoint) {
          case 'strengths':
            setFetchedStrengths(data);
            break;
          case 'weaknesses':
            setFetchedWeaknesses(data);
            break;
          case 'opportunities':
            setFetchedOpportunities(data);
            break;
          case 'threats':
            setFetchedThreats(data);
            break;
          default:
            console.error(`Invalid endpoint: ${endpoint}`);
        }
      } catch (error:any) {
        console.error(`Error fetching updated ${endpoint}:`, error.message);
      }
    };

    const deleteStrength = async (id: string, department_id: string) => {
  await deleteItem(id, department_id, 'strengths');
};

const deleteWeakness = async (id: string, department_id: string) => {
  await deleteItem(id, department_id, 'weaknesses');
};

const deleteOpportunities = async (id: string, department_id: string) => {
  await deleteItem(id, department_id, 'opportunities');
};

const deleteThreats = async (id: string, department_id: string) => {
  await deleteItem(id, department_id, 'threats');
};
    return { items, newItem, isAdding, handleAddClick,handleChange, addStrength, EditStrength, deleteStrength, addWeakness, EditWeakness, deleteWeakness, addOpportunities, EditOpportunities, deleteOpportunities, addThreats, EditThreats, deleteThreats};
  };

  const [fetchedStrengths, setFetchedStrengths] = useState<SwotItem[]>([]);
  const [fetchedWeaknesses, setFetchedWeaknesses] = useState<SwotItem[]>([]);
  const [fetchedOpportunities, setFetchedOpportunities] = useState<SwotItem[]>([]);
  const [fetchedThreats, setFetchedThreats] = useState<SwotItem[]>([]);
  const [lastFetchedDepartmentId, setLastFetchedDepartmentId] = useState<string | number | null>(null); 
  
  useEffect(() => {
    const fetchStrengths = async () => {
      try {
        const response = await fetch(`api/strengths/${department_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch strengths');
        }
        const data = await response.json();
        setFetchedStrengths(data); 
        setLastFetchedDepartmentId(department_id); 
      } catch (error: any) {
        console.error('Error fetching strengths:', error.message);
      }
    };
  
    // Fetch strengths if the department_id has changed or when fetchedStrengths is updated
    if (department_id !== lastFetchedDepartmentId || fetchedStrengths.length === 0) {
      fetchStrengths();
    }
  }, [department_id, lastFetchedDepartmentId, fetchedStrengths.length]);


  useEffect(() => {
    const FetchWeaknesses = async () => {
      try {
        const response = await fetch(`api/weaknesses/${department_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weaknesses');
        }
        const data = await response.json();
        setFetchedWeaknesses(data); 
        setLastFetchedDepartmentId(department_id); 
      } catch (error: any) {
        console.error('Error fetching weaknesses:', error.message);
      }
    };
  
    // Fetch strengths if the department_id has changed or when fetchedStrengths is updated
    if (department_id !== lastFetchedDepartmentId || fetchedWeaknesses.length === 0) {
      FetchWeaknesses();
    }
  }, [department_id, lastFetchedDepartmentId, fetchedWeaknesses.length]);

  useEffect(() => {
    const FetchOpportunites = async () => {
      try {
        const response = await fetch(`api/opportunities/${department_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        const data = await response.json();
        setFetchedOpportunities(data); 
        setLastFetchedDepartmentId(department_id); 
      } catch (error: any) {
        console.error('Error fetching opportunities:', error.message);
      }
    };
  
    if (department_id !== lastFetchedDepartmentId || fetchedOpportunities.length === 0) {
      FetchOpportunites();
    }
  }, [department_id, lastFetchedDepartmentId, fetchedOpportunities.length]);

  useEffect(() => {
    const FetchThreats = async () => {
      try {
        const response = await fetch(`api/threats/${department_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch threats');
        }
        const data = await response.json();
        setFetchedThreats(data); 
        setLastFetchedDepartmentId(department_id); 
      } catch (error: any) {
        console.error('Error fetching threats:', error.message);
      }
    };
  
    if (department_id !== lastFetchedDepartmentId || fetchedThreats.length === 0) {
      FetchThreats();
    }
  }, [department_id, lastFetchedDepartmentId, fetchedThreats.length]);

  const fetchUpdatedStrengths = async () => {
    try {
      const response = await fetch(`api/strengths/${department_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch updated strengths');
      }
      const data = await response.json();
      setFetchedStrengths(data); // Update fetched strengths with the new data
    } catch (error: any) {
      console.error('Error fetching updated strengths:', error.message);
    }
  };

  const fetchUpdatedWeaknesses = async () => {
    try {
      const response = await fetch(`api/weaknesses/${department_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch updated weaknesses');
      }
      const data = await response.json();
      setFetchedWeaknesses(data); // Update fetched strengths with the new data
    } catch (error: any) {
      console.error('Error fetching updated weaknesses:', error.message);
    }
  };
  
  const fetchUpdatedOpportunities = async () => {
    try {
      const response = await fetch(`api/opportunities/${department_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch updated opportunities');
      }
      const data = await response.json();
      setFetchedOpportunities(data); // Update fetched opportunities with the new data
    } catch (error: any) {
      console.error('Error fetching updated opportunities:', error.message);
    }
  };
  
  const fetchUpdatedThreats = async () => {
    try {
      const response = await fetch(`api/threats/${department_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch updated threats');
      }
      const data = await response.json();
      setFetchedThreats(data); // Update fetched threats with the new data
    } catch (error: any) {
      console.error('Error fetching updated threats:', error.message);
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
const [modalValue, setModalValue] = useState('');

const openModal = (defaultValue: string) => {
  setModalValue(defaultValue);
  setIsModalOpen(true);
}
const closeModal = () => {
  setModalVisible(false);
};

const [isModalVisible, setModalVisible] = useState(false);

  return (
    <div className="flex flex-row w-full h-screen bg-[#eeeeee]">
    <Navbar />
    <div className="flex-1">
      {/* <UserHeader /> */}
      <div className="flex-1 flex flex-col mt-8 ml-80 ">
        <div className="flex flex-col mb-16">
          <div className="mb-5 inline-block self-start break-words font-bold text-[3rem] text-[#000000]">
            SWOT ANALYSIS
          </div>
          <span className="break-words font font-normal text-[1.3rem] text-[#504C4C]">
            Assess your project&#39;s strengths, weaknesses, opportunities,
            and threats effortlessly. Our AI-powered tool generates insightful
            strategies tailored to your analysis, empowering you to make
            informed decisions and drive your project forward with confidence.
          </span>
        </div>

           {/* IF I HOVER OR ICLICK ANG SWOT OR STRATEGIES KAY NAAY UNDERLINE MAG STAY BELOW SA WORD, PWEDE KA MAG INSERT UG ICON BEFORE SA WORDS */}
           <div className=" flex flex-row self-start box-sizing-border mt-5 mb-5">
            <div
              className="flex flex-row box-sizing-border mr-10"
              onClick={() => setDisplaySwot(true)}
            >
              <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
                SWOT
              </div>
            </div>
            <div
              className="flex flex-row box-sizing-border"
              onClick={() => setDisplaySwot(false)}
            >
              <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
                STRATEGIES
              </div>
            </div>
          </div>

          {displaySwot ? (
            <div className="flex flex-col">
              {/* SWOT CONTAINER */}
              <div className="flex flex-row gap-4 ml-2">
                <Card className=" flex align-center shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-xl border  border-[0.1rem_solid_#807C7C] justify-between py-5 px-2 bg-white w-[23rem] h-[30rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row rounded-xl bg-[#962203] w-[21.8rem] h-10 items-center p-1 justify-between">
                      <span className="ml-2 font-semibold text-[1.3rem] text-[#FFFFFF]">
                        Strengths
                      </span>
                      <FaPlus
                        className="text-white w-6 h-6 cursor-pointer relative"
                        onClick={strengths.handleAddClick}
                      />
                    </div>

                    <div className="relative">
                      {strengths.isAdding && (
                        <input
                          placeholder="Type strength and press Enter"
                          value={strengths.newItem}
                          onChange={strengths.handleChange}
                          onKeyDown={strengths.addStrength}
                          className=" mt-4 bg-white absolute p-4 shadow-2xl font-semibold rounded-md"
                          style={{
                            width: "calc(100% - 1.5rem)",
                            marginLeft: "1.5rem",
                          }}
                        />
                      )}
                    </div>


                    <div className=" flex flex-col overflow-auto ">
                  
                    {fetchedStrengths.map((strength) => (
                        <div
                          key={strength.id}
                          className="flex justify-between items-center m-1 w-[21rem] "
                        >
                          <div className="flex flex-row text-[1.3rem] overflow-y-auto">
                            <div className="bg-[rgba(239,175,33,0.5)] pt-1 pb-1 pr-2 pl-2 font-semibold text-[#962203]">
                            {"S"+strength.id}:
                            </div>
                            <div className=" pt-1 pb-1 pr-2 pl-2 break-words overflow-y-auto">
                              {strength.value}
                            </div>
                          </div>

                          <div className="flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              onClick={() => toggleStrengthOptions(strength.id)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeWidth="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>

                            {showStrengthOptions === strength.id && (
                              <div className="flex flex-col">
                                <div className="absolute mt-2 w-20 bg-white rounded-md overflow-hidden shadow-lg">
                                <button
                                //kani modal
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                                  onClick={() => {
                                    const newValue = prompt("Enter new value:", strength.value);
                                    if (newValue !== null) {
                                      strengths.EditStrength(strength.id, newValue, department_id); 
                                    }
                                  }}
                                >
                                  Edit
                                </button>
                                <button 

                              //kani modal
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 w-full text-left" 
                                  onClick={() => strengths.deleteStrength(strength.id, department_id)} 
                                >
                                  Delete 
                                </button> 
                                </div>
                              </div>
                            )}

                        </div>
                        </div>
                      ))}
                    </div>
                  </div> 
                </Card>

                <Card className=" flex align-center shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-xl border  border-[0.1rem_solid_#807C7C] justify-between py-5 px-2 bg-white w-[23rem] h-[30rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row rounded-xl bg-[#962203] w-[21.8rem] h-10 items-center p-1 justify-between">
                      <span className="ml-2 font-semibold text-[1.3rem] text-[#FFFFFF]">
                        Weaknesses
                      </span>
                      <FaPlus
                        className="text-white w-6 h-6 cursor-pointer relative"
                        onClick={weaknesses.handleAddClick}
                      />
                    </div>

                    <div className="relative">
                      {weaknesses.isAdding && (
                        <input
                          placeholder="Type weakness and press Enter"
                          value={weaknesses.newItem}
                          onChange={weaknesses.handleChange}
                          onKeyDown={weaknesses.addWeakness}
                          className=" mt-4 bg-white absolute p-4 shadow-2xl font-semibold rounded-md"
                          style={{
                            width: "calc(100% - 1.5rem)",
                            marginLeft: "1.5rem",
                          }}
                        />
                      )}
                    </div>

                    <div className=" flex flex-col overflow-auto ">
                      {fetchedWeaknesses.map((weakness) => (
                        <div
                          key={weakness.id}
                          className="flex justify-between items-center m-1 w-[21rem] "
                        >
                          <div className="flex flex-row text-[1.3rem] overflow-y-auto">
                            <div className="bg-[rgba(239,175,33,0.5)] pt-1 pb-1 pr-2 pl-2 font-semibold text-[#962203]">
                              {"W"+weakness.id}:
                            </div>
                            <div className=" pt-1 pb-1 pr-2 pl-2 break-words overflow-y-auto">
                              {weakness.value}
                            </div>
                          </div>

                          <div className="flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              onClick={() => toggleWeaknessOptions(weakness.id)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeWidth="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                            {showWeaknessOptions  === weakness.id && (
                              <div className="flex flex-col">
                                <div className="absolute mt-2 w-20 bg-white rounded-md overflow-hidden shadow-lg">
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                                  onClick={() => {
                                    //kani modal
                                    const newValue = prompt("Enter new value:", weakness.value);
                                    if (newValue !== null) {
                                      weaknesses.EditWeakness(weakness.id, newValue, department_id); 
                                    }
                                  }}
                                >
                                  Edit
                                </button>
                                <button 
                                //kani modal
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 w-full text-left" 
                                  onClick={() => weaknesses.deleteWeakness(weakness.id,department_id )} 
                                >
                                  Delete 
                                </button> 
                                </div>
                              </div>
                            )}
                        </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card> 

                <Card className=" flex align-center shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-xl border  border-[0.1rem_solid_#807C7C] justify-between py-5 px-2 bg-white w-[23rem] h-[30rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row rounded-xl bg-[#962203] w-[21.8rem] h-10 items-center p-1 justify-between">
                      <span className="ml-2 font-semibold text-[1.3rem] text-[#FFFFFF]">
                        Opportunities
                      </span>
                      <FaPlus
                        className="text-white w-6 h-6 cursor-pointer relative"
                        onClick={opportunities.handleAddClick}
                      />
                    </div>
                    <div className="relative">
                      {opportunities.isAdding && (
                        <input
                          placeholder="Type strength and press Enter"
                          value={opportunities.newItem}
                          onChange={opportunities.handleChange}
                          onKeyDown={opportunities.addOpportunities}
                          className=" mt-4 bg-white absolute p-4 shadow-2xl font-semibold rounded-md"
                          style={{
                            width: "calc(100% - 1.5rem)",
                            marginLeft: "1.5rem",
                          }}
                        />
                      )}
                    </div>
                    <div className=" flex flex-col overflow-auto ">
                      {fetchedOpportunities.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="flex justify-between items-center m-1 w-[21rem] "
                        >
                          <div className="flex flex-row text-[1.3rem] overflow-y-auto">
                            <div className="bg-[rgba(239,175,33,0.5)] pt-1 pb-1 pr-2 pl-2 font-semibold text-[#962203]">
                              {"O"+opportunity.id}:
                            </div>
                            <div className=" pt-1 pb-1 pr-2 pl-2 break-words overflow-y-auto">
                              {opportunity.value}
                            </div>
                          </div>

                          <div className="flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              onClick={() => toggleOpportunityOptions(opportunity.id)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeWidth="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                            {showOpportunityOptions=== opportunity.id && (
                              <div className="flex flex-col">
                                <div className="absolute mt-2 w-20 bg-white rounded-md overflow-hidden shadow-lg">
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                                  onClick={() => {
                                    //kani MODAL
                                    const newValue = prompt("Enter new value:", opportunity.value);
                                    if (newValue !== null) {
                                      opportunities.EditOpportunities(opportunity.id, newValue, department_id); 
                                    }
                                  }}
                                >
                                  Edit
                                </button>
                                <button 
                                //KANI MODAL
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 w-full text-left" 
                                  onClick={() => opportunities.deleteOpportunities(opportunity.id, department_id)} 
                                >
                                  Delete 
                                </button> 
                                </div>
                              </div>
                            )}
                        </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card> 

                <Card className=" flex align-center shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-xl border  border-[0.1rem_solid_#807C7C] justify-between py-5 px-2 bg-white w-[23rem] h-[30rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row rounded-xl bg-[#962203] w-[21.8rem] h-10 items-center p-1 justify-between">
                      <span className="ml-2 font-semibold text-[1.3rem] text-[#FFFFFF]">
                        Threats
                      </span>
                      <FaPlus
                        className="text-white w-6 h-6 cursor-pointer relative"
                        onClick={threats.handleAddClick}
                      />
                    </div>

                    <div className="relative">
                      {threats.isAdding && (
                        <input
                          placeholder="Type strength and press Enter"
                          value={threats.newItem}
                          onChange={threats.handleChange}
                          onKeyDown={threats.addThreats}
                          className=" mt-4 bg-white absolute p-4 shadow-2xl font-semibold rounded-md"
                          style={{
                            width: "calc(100% - 1.5rem)",
                            marginLeft: "1.5rem",
                          }}
                        />
                      )}
                    </div>

                    <div className=" flex flex-col overflow-auto ">
                      {fetchedThreats.map((threat) => (
                        <div
                          key={threat.id}
                          className="flex justify-between items-center m-1 w-[21rem] "
                        >
                          <div className="flex flex-row text-[1.3rem] overflow-y-auto">
                            <div className="bg-[rgba(239,175,33,0.5)] pt-1 pb-1 pr-2 pl-2 font-semibold text-[#962203]">
                              {"T"+threat.id}:
                            </div>
                            <div className=" pt-1 pb-1 pr-2 pl-2 break-words overflow-y-auto">
                              {threat.value}
                            </div>
                          </div>



                          <div className="flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              onClick={() => toggleThreatOptions(threat.id)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeWidth="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                            {showThreatOptions=== threat.id && (
                              <div className="flex flex-col">
                                <div className="absolute mt-2 w-20 bg-white rounded-md overflow-hidden shadow-lg">
                                <button
                                //KANI MODAL
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                                  onClick={() => {
                                    const newValue = prompt("Enter new value:", threat.value);
                                    if (newValue !== null) {
                                      threats.EditThreats(threat.id, newValue,department_id); 
                                    }
                                  }}
                                >
                                  Edit
                                </button>
                                <button 
                                //KANI MODAL
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 w-full text-left" 
                                  onClick={() => threats.deleteThreats(threat.id,department_id)} 
                                >
                                  Delete 
                                </button> 
                                </div>
                              </div>
                            )}
                        </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card> 
              </div>

              {/* Generate Strategies Button */}
              <div className="flex justify-center ml-[-3rem]"> 
                <button 
                  onClick={generateStrategies}
                  className="lg:mb-0 mb-6 shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-[0.6rem] border-[0.1rem_solid_#EFAF21] bg-[#FAD655] mt-10 relative flex flex-row justify-center self-center pt-3 pb-4 pl-1 w-[24.1rem] box-sizing-border" 
                >
                  <span className="break-words font-semibold text-[1.3rem] text-[#962203]">
                    Generate Strategies 
                  </span>
                </button>

                {isModalVisible && (

                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-8 rounded-lg z-10 h-[15rem] w-[30rem]">
                    <p className="text-2xl mb-4 justify-center font-semibold mt-10">Strategies Successfully Generated</p>
                    <div className="justify-center align-middle items-center ml-20">
                    <button
                      onClick={closeModal}
                      className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-[0.6rem] bg-[#FAD655] text-[#8A252C] break-words font-semibold text-lg relative flex pt-2 pr-3 pl-6 pb-2 w-36 h-[fit-content] mx-10 mb-2 mt-16 hover:bg-[#8a252c] hover:text-[#ffffff] items-center justify-center align-middle"
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
            <div className="flex flex-col">
              <div className="flex flex-row gap-[5rem]">
                <Card className="flex align-center mb-6 shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-xl border  border-[0.1rem_solid_#807C7C] justify-between bg-white w-[45rem] h-[50rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row mt-4 mx-3 p-2 rounded-[0.6rem] bg-[#962203] w-[43.3rem] h-10 justify-between items-center">
                      <span className="ml-2 relative font-semibold text-[1.3rem] text-[#FFFFFF]">
                        S - O Strategies
                      </span>
                      <FaPlus className="text-white w-6 h-6 cursor-pointer relative" />
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md mx-3 mt-4 overflow-y-auto max-h-[50rem]">
                    {soApiresponse.map((strategy, index) => (
                        <div key={index} className="mb-4 border border-black p-2 rounded">
                            <div className="flex">
                                <FaTrashAlt className="text-red-500 mr-2 cursor-pointer" 
                                onClick={() => deletesoStrategy(strategy.id, department_id)}/>
                                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                                    {strategy['s-oResponses']}
                                </p>
                            </div>
                        </div>
                    ))}
                    </div>
                  </div>
                </Card>
                <Card className="flex align-center mb-6 shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-xl border  border-[0.1rem_solid_#807C7C] justify-between bg-white w-[45rem] h-[50rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row mt-4 mx-3 p-2 rounded-[0.6rem] bg-[#962203] w-[43.3rem] h-10 justify-between items-center">
                      <span className="ml-2 relative font-semibold text-[1.3rem] text-[#FFFFFF]">
                        W - O Strategies
                      </span>
                      <FaPlus className="text-white w-6 h-6 cursor-pointer relative" />
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-md mx-3 mt-4 overflow-y-auto max-h-[50rem]">
                      {woApiresponse.map((strategy, index) => (
                        <div key={index} className="mb-4 border border-black p-2 rounded">
                            <div className="flex">
                                <FaTrashAlt className="text-red-500 mr-2 cursor-pointer" 
                                onClick={() => deletewoStrategy(strategy.id, department_id)}/>
                                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                                    {strategy['w-oResponses']}
                                </p>
                            </div>
                        </div>
                    ))}

                        </div>
                  </div>
                </Card>
              </div>
              <div className="flex flex-row gap-[5rem]">
                <Card className="flex align-center mb-6 shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-xl border  border-[0.1rem_solid_#807C7C] justify-between bg-white w-[45rem] h-[50rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row mt-4 mx-3 p-2 rounded-[0.6rem] bg-[#962203] w-[43.3rem] h-10 justify-between items-center">
                      <span className="ml-2 relative font-semibold text-[1.3rem] text-[#FFFFFF]">
                        S - T Strategies
                      </span>
                      <FaPlus className="text-white w-6 h-6 cursor-pointer relative" />
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md mx-3 mt-4 overflow-y-auto max-h-[50rem]">
                    {stApiresponse.map((strategy, index) => (
                        <div key={index} className="mb-4 border border-black p-2 rounded">
                            <div className="flex">
                                <FaTrashAlt className="text-red-500 mr-2 cursor-pointer" 
                                onClick={() => deletestStrategy(strategy.id, department_id)}/>
                                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                                    {strategy['s-tResponses']}
                                </p>
                            </div>
                        </div>
                    ))}
                    </div>
                  </div>
                </Card>
                <Card className="flex align-center mb-6 shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-xl border  border-[0.1rem_solid_#807C7C] justify-between bg-white w-[45rem] h-[50rem]">
                  <div className="flex flex-col">
                    <div className="flex flex-row mt-4 mx-3 p-2 rounded-[0.6rem] bg-[#962203] w-[43.3rem] h-10 justify-between items-center">
                      <span className="ml-2 relative font-semibold text-[1.3rem] text-[#FFFFFF]">
                        W - T Strategies
                      </span>
                      <FaPlus className="text-white w-6 h-6 cursor-pointer relative" />
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md mx-3 mt-4 overflow-y-auto max-h-[50rem]">
                    {wtApiresponse.map((strategy, index) => (
                        <div key={index} className="mb-4 border border-black p-2 rounded">
                            <div className="flex">
                                <FaTrashAlt className="text-red-500 mr-2 cursor-pointer" 
                                onClick={() => deleteStrategy(strategy.id, department_id)}/>
                                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                                    {strategy['w-tResponses']}
                                </p>
                            </div>
                        </div>
                    ))}

                      </div>
                  </div>
                </Card>
              </div>
            </div> 
          )} 
        </div>
      </div> 
    </div>
  );
};

export default Swot;