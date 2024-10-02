import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSession, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";

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
    targetYear: number;
    accomplished: boolean;
    department: { id: number };
  }

  const [currentGoals, setCurrentGoals] = useState<Goal[]>([]);
  const [currentTab, setCurrentTab] = useState<'current' | 'accomplished'>('current');
  const [goalId, setGoalId] = useState<number | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [accomplishedGoals, setAccomplishedGoals] = useState<Goal[]>([]);
  const [showSuccessMessageWithButtons, setShowSuccessMessageWithButtons] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [officeVision, setOfficeVision] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [mission, setMission] = useState("");
  const [strategicGoals, setStrategicGoals] = useState<string[]>(['']);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [successModal, setSuccessModal] = useState(false);
  const [isNew, setIsNew] = useState(true); // New state to track if adding new goals
  const [isDone, setIsDone] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isshowGoalsModal, setShowGoalsModal] = useState(false);
  const dateForDatePicker = selectedYear ? new Date(selectedYear, 0) : null;
  const [isSaved, setIsSaved] = useState(false);

  const department_id = user?.department_id;

  const [statuss, setStatus] = useState('Pending');
  const displayedGoals = currentTab === 'current' ? goals.filter(goal => !accomplishedGoals.includes(goal)) : accomplishedGoals;

  // Handler to add a new strategic goal
  const handleAddGoal = () => {
    setStrategicGoals([...strategicGoals, '']);
  };

  // Handler to update a specific goal based on index
  const handleGoalChange = (index: number, value: string) => {
    const updatedGoals = [...strategicGoals];
    updatedGoals[index] = value;
    setStrategicGoals(updatedGoals);
  };
  // Optional: Handler to remove a specific goal
  const handleRemoveGoal = (index: number) => {
    const updatedGoals = strategicGoals.filter((_, i) => i !== index);
    setStrategicGoals(updatedGoals);
  };

  const fetchCurrentGoals = async (departmentId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/goals/getCurrent/${departmentId}`);
      if (!response.ok) throw new Error('Failed to fetch current goals');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleCurrentClick = async () => {
    setCurrentTab('current');
    if (department_id) { // Ensure department_id is defined and not null
      const goals = await fetchCurrentGoals(department_id);
      setCurrentGoals(goals); // Update the state with fetched goals
    } else {
      console.error('Department ID is not defined');
    }
  };

  const fetchAccomplishedGoals = async (department_id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/goals/getAccomplished/${department_id}`);
      if (!response.ok) throw new Error('Failed to fetch accomplished goals');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleAccomplishedClick = async () => {
    setCurrentTab('accomplished');
    if (department_id) { // Ensure department_id is defined and not null
      const goals = await fetchAccomplishedGoals(department_id);
      setAccomplishedGoals(goals); // Update the state with fetched goals
    } else {
      console.error('Department ID is not defined');
    }
  };

  const handleDoneClick = async (goalId: number) => {
    const goalToUpdate = goals.find((goal) => goal.id === goalId);

    if (!goalToUpdate) {
      console.error(`Goal with id ${goalId} not found.`);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/goals/${goalId}/status?accomplished=true`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      // Remove the goal from the current goals
      const updatedGoals = goals.filter((goal) => goal.id !== goalId);

      // Add the goal to the accomplished goals
      setAccomplishedGoals([...accomplishedGoals, { ...goalToUpdate, accomplished: true }]);

      // Update the goals state
      setGoals(updatedGoals);

      // Show success message with buttons
      setShowSuccessMessageWithButtons(true);
    } catch (error) {
      console.error('Error updating goal:', error);
      alert('An error occurred while updating the goal');
    }
  };


  useEffect(() => {
    const fetchProfileGoals = async () => {
      try {
        const response = await fetch(`http://localhost:8080/goals/get/${department_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data); // Add this line to log the received data
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
        const response = await fetch(`http://localhost:8080/goals/getAll/${department_id}`);
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
        const response = await fetch(`http://localhost:8080/goals/latest/${department_id}`);
        if (response.ok) {
          const data = await response.json();
          setOfficeVision(data.vision || '');
          setValueProposition(data.proposition || '');
          setMission(data.mission || '');
          setStrategicGoals(data.goals || '');
          setSelectedYear(data.targetYear || null);
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



  const handleSave = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    // Check for required fields
    if (selectedYear === null || !officeVision || !valueProposition || !strategicGoals) {
      alert("Please fill out all required fields");
      return;
    }

    console.log("Saving goal with ID:", goalId); // Log the goalId here

    try {
      // Determine URL and HTTP method based on whether it's a new goal or an update
      const url = isNew
        ? "http://localhost:8080/goals/insert"
        : `http://localhost:8080/goals/update/${goalId}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Include ID only for updates
          id: !isNew ? goalId : undefined,
          vision: officeVision,
          proposition: valueProposition,
          mission: mission,
          goals: strategicGoals,
          targetYear: selectedYear,
          department: { id: department_id }, // Ensure department_id is correctly used
        }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText); // Log the error response
        throw new Error(errorText);
      }

      // Parse the response JSON
      const result = await response.json();
      console.log("API response:", result);

      // Update the state based on whether it's a new or existing goal
      if (isNew) {
        // Add the new goal to the goals state
        setGoals((prevGoals) => [...prevGoals, result]);
        setGoalId(result.id); // Set the new goal ID
      } else {
        // Update the existing goal in the goals state
        setGoals((prevGoals) =>
          prevGoals.map((goal) => (goal.id === result.id ? result : goal))
        );
      }

      // Update the form fields to display the latest goal details
      setOfficeVision(result.vision);
      setValueProposition(result.proposition);
      setMission(result.mission);
      setStrategicGoals(result.goals);
      setSelectedYear(result.targetYear);

      // Show success modal and reset editing states
      setSuccessModal(true);
      setIsEditing(false);
      setIsNew(false);
      setIsSaved(true);

    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving goal setting:", error.message);
        alert("An error occurred while saving the goal setting: " + error.message);
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
      const response = await fetch(`http://localhost:8080/goals/getAll/${department_id}`);
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
    setSelectedYear(null);
    setIsEditing(true);
    setIsNew(true);
  };

  const toggleEditing = async () => {
    if (isEditing) {
      // When in editing mode and the button is clicked, revert to non-editing mode
      setIsEditing(false);
      setIsNew(false); // Ensure new mode is disable
      // Fetch the latest data to reset the form to its original state
      try {
        // Make sure to pass the correct department_id or goal_id based on your requirement
        const response = await fetch(`http://localhost:8080/goals/get/${department_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data) {
          setOfficeVision(data.vision || '');
          setValueProposition(data.proposition || '');
          setMission(data.mission || '');
          setStrategicGoals(data.goals || []); // Ensure it's an array
          setSelectedYear(data.targetYear || null);
          setIsEditing(false);
          setIsNew(false);
        } else {
          console.error("Error fetching input goals data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      // When not in editing mode and the button is clicked, switch to editing mode
      setIsEditing(true);
      setIsNew(false); // Ensure new mode is disabled
    }
  };



  return (
    <div className="flex flex-col items-center ml-[6rem]">
      <div className="flex flex-row justify-between">
        <div className="mb-5 ml-[-4rem] inline-block self-start break-words font-bold text-[3rem] text-[rgb(59,59,59)]">
          GOAL SETTING
        </div>
        <div className="flex space-x-4 items-center mt-[-1rem] ml-[70rem]">
          <button
            className="break-words font-semibold text-[1.0rem] text-[#FFFFFF] border-[#AB3510] border-2 rounded-[0.6rem] pt-[0.8rem] pb-[0.8rem] pr-[2rem] pl-[2rem] bg-[#AB3510] cursor-pointer"
            onClick={handleShowGoals}
          >
            View Goals
          </button>
        </div>
      </div>
      <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10 ml-[-6rem]">
        <span>
          Goal setting involves defining specific objectives, outlining actionable steps, and establishing a timeframe for achievement. It provides direction and motivation for <br /> personal or professional growth by creating clear targets to strive towards.
        </span>
      </div>


      <div className="mb-[3rem] rounded-[0.6rem] ml-[-2rem] border border-gray-200 bg-[#FFFFFF] relative p-[0.9rem_1.1rem_0.8rem_1.1rem] w-[103rem] h-[auto] box-sizing-border">
        <div className="ml-[16rem] mt-[-1rem] mb-10">
          <div className="flex flex-col ml-[-3rem]">
            <div className="flex flex-row p-1 h-auto">
              <img
                src="/year.png"
                alt=""
                className=" h-[4.5rem] mb-5 mt-5 ml-[-13rem]"
              />
              <div className="flex flex-col w-[38rem] mt-10">
                <span className="ml-3 w-[31.4rem] mt-[-0.5rem] break-words font-semibold text-[1.3rem] text-[#000000]">
                  Target Year
                </span>
                <div className="inline-block ml-3 font-normal text-[1rem] text-[#807C7C]">
                  The specific year by which a goal is intended to be achieved.
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between w-[52rem]">
              <div className="rounded-[0.6rem] ml-[-12rem] mt-[-1rem] border-[#eee9e7] shadow-md border-solid border-[0.1rem] bg-[#FFFFFF] relative p-[0.9rem_1.1rem_0.8rem_1.1rem] w-[28.8rem] box-sizing-border">
                <DatePicker
                  selected={dateForDatePicker}
                  onChange={(date: Date | null) => setSelectedYear(date ? date.getFullYear() : null)}
                  disabled={!isEditing && !isNew}
                  dateFormat="yyyy"
                  showYearPicker
                  placeholderText="Select year"
                  className="bg-white text-black"
                  minDate={new Date()} // Prevents selecting a year earlier than the current year
                />
              </div>

            </div>
          </div>
        </div>
        <div className="w-[65rem] mb-10 ml-[17rem]">
          <div className="flex flex-row p-1 h-auto">
            <img
              src="/vision.png"
              alt=""
              className=" h-[4.5rem] mb-5 ml-[-17rem]"
            />
            <div className="flex flex-col ml-[-16rem]">
              <div className="flex flex-row w-[fit-content] box-sizing-border">
                <span className="ml-[17rem] w-[31.4rem] mt-2 break-words font-semibold text-[1.3rem] text-[#000000]">
                  Office Vision
                </span>
              </div>
              <div className="inline-block ml-[17rem] font-normal text-[1rem] text-[#807C7C]">
                A brief statement articulating the company&apos;s long-term goals and values.
              </div>
            </div>
          </div>
          <textarea
            className={`rounded-[0.9rem] ml-[-16rem] mt-[-1rem] w-[98rem] border-[#eee9e7] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-100" : ""
              } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-md border-solid border-[0.1rem] border-[#807C4C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[1rem] text-[#504C4C]`}
            value={officeVision}
            onChange={(event) => setOfficeVision(event.target.value)}
            disabled={!isEditing && !isNew}
          ></textarea>


          <div className="flex flex-row p-1 h-auto mt-10">
            <img
              src="/proposition.png"
              alt=""
              className=" h-[4.5rem] mb-5 ml-[-17rem]"
            />
            <div className="flex flex-col ml-[-16rem]">
              <div className="flex flex-row w-[fit-content] box-sizing-border">
                <span className="ml-[17rem] w-[31.4rem] mt-2 break-words font-semibold text-[1.3rem] text-[#000000]">
                  Value Proposition
                </span>
              </div>
              <div className="inline-block ml-[17rem] font-normal text-[1rem] text-[#807C7C]">
                A concise statement that communicates the unique benefits and advantages of your service.
              </div>
            </div>
          </div>

          <textarea
            className={`rounded-[0.9rem] ml-[-16rem] mt-[-1rem] w-[98rem] border-[#eee9e7] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-100" : ""
              } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-md border-solid border-[0.1rem] border-[#807C4C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[1rem] text-[#504C4C]`}
            value={valueProposition}
            onChange={(event) => setValueProposition(event.target.value)}
            disabled={!isEditing && !isNew}
          ></textarea>

          <div className="flex flex-row p-1 h-auto mt-10">
            <img
              src="/mission.png"
              alt=""
              className=" h-[4.5rem] mb-5 ml-[-17rem]"
            />
            <div className="flex flex-col ml-[-16rem]">
              <div className="flex flex-row w-[fit-content] box-sizing-border">
                <span className="ml-[17rem] w-[31.4rem] mt-2 break-words font-semibold text-[1.3rem] text-[#000000]">
                  Mission
                </span>
              </div>
              <div className="inline-block ml-[17rem] font-normal text-[1rem] text-[#807C7C]">
                A statement defining the company’s purpose and commitment to delivering value.
              </div>
            </div>
          </div>

          <textarea
            className={`rounded-[0.9rem] ml-[-16rem] mt-[-1rem] w-[98rem] border-[#eee9e7] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-100" : ""
              } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-md border-solid border-[0.1rem] border-[#807C4C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[1rem] text-[#504C4C]`}
            value={mission}
            onChange={(event) => setMission(event.target.value)}
            disabled={!isEditing && !isNew}
          ></textarea>


          <div className="flex flex-row p-1 h-auto mt-10">
            <img
              src="/strategicgoals.png"
              alt=""
              className=" h-[4.5rem] mb-5 ml-[-17rem]"
            />
            <div className="flex flex-row">
              <div className="flex flex-col ml-[-16rem]">
                <div className="flex flex-row w-[fit-content] box-sizing-border">
                  <span className="ml-[17rem] w-[31.4rem] mt-2 break-words font-semibold text-[1.3rem] text-[#000000]">
                    Strategic Goals
                  </span>
                </div>
                <div className="inline-block ml-[17rem] font-normal text-[1rem] text-[#807C7C]">
                  A guiding principles for decision-making, driving the organization towards its desired future state.
                </div>
              </div>
              {/* Add Goal Button */}
              <div className="absolute right-8 flex-row gap-5 rounded-full w-[2.5rem] h-[2.5rem] bg-[#ff7b00d3] pl-[0.25rem] mt-5 pr-1 pt-1 pb-1">
                <button
                  className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                  onClick={handleAddGoal}
                >
                  <div className="flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {strategicGoals.map((goal, index) => (
            <div key={index}>
              <textarea
                className={`rounded-[0.9rem] ml-[-16rem] w-[95rem] border-[#eee9e7] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-300" : ""
                  } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.10)] border-solid border-[0.1rem] border-[#807C4C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[1rem] text-[#504C4C]`}
                value={goal}
                onChange={(event) => handleGoalChange(index, event.target.value)}
                disabled={!isEditing && !isNew}
              ></textarea>

              {/* Remove button (conditionally visible) */}
              {(isEditing || isNew) && !isSaved && (
                <button
                  className="absolute bg-[#d35129] rounded-full top-[63.3rem] right-[5.5rem] text-white text-xs px-[0.30rem] py-1 "
                  onClick={() => handleRemoveGoal(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clip-rule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}

        </div>

        <>
          {isshowGoalsModal && (
            <Modal open={isshowGoalsModal} onClose={handleCloseShowGoalsModal}>
              <div className="flex justify-center items-center h-screen">
                <div className="p-4 bg-white rounded-lg shadow-md w-[100rem] max-h-[80vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-4">Goals</h2>
                  <div className="flex mb-4">
                    <button
                      className={`mr-4 ${currentTab === 'current' ? 'font-bold' : ''}`}
                      onClick={handleCurrentClick}
                    >
                      Current
                    </button>
                    <button
                      className={`${currentTab === 'accomplished' ? 'font-bold' : ''}`}
                      onClick={handleAccomplishedClick}
                    >
                      Accomplished
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-400">
                      <thead>
                        <tr className="bg-[#fff6d1] border border-white">
                          <th className="border border-gray-400 px-4 py-2">Target Year</th>
                          <th className="border border-gray-400 px-4 py-2">Vision</th>
                          <th className="border border-gray-400 px-4 py-2">Value Proposition</th>
                          <th className="border border-gray-400 px-4 py-2">Mission</th>
                          <th className="border border-gray-400 px-4 py-2">Strategic Goals</th>
                          <th className="border border-gray-400 px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedGoals
                          .filter(goal =>
                            currentTab === 'current' ? !goal.accomplished : goal.accomplished
                          )
                          .map((goal) => (
                            <tr key={goal.id}>
                              <td className="border border-gray-400 px-4 py-2">{goal.targetYear}</td>
                              <td className="border border-gray-400 px-4 py-2">{goal.vision}</td>
                              <td className="border border-gray-400 px-4 py-2">{goal.proposition}</td>
                              <td className="border border-gray-400 px-4 py-2">{goal.mission}</td>
                              <td className="border border-gray-400 px-4 py-2">
                                {goal.goals.join(', ')} {/* Adjusted to handle multiple goals */}
                              </td>
                              <td className="px-4 py-2 flex justify-center items-center border border-gray-400">
                                {currentTab === 'current' ? (
                                  <div className="flex flex-col items-center">
                                    <span>Pending</span>
                                    <button
                                      className="mt-2 p-2 bg-[#ff7b00d3] text-white rounded"
                                      onClick={() => handleDoneClick(goal.id)}
                                    >
                                      Done
                                    </button>
                                  </div>
                                ) : (
                                  <span>Success</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                  </div>
                  <div className="flex justify-center">
                    <button
                      className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] mt-10 border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                      style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                      onClick={handleCloseShowGoalsModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          )}

        </>

        {showSuccessMessageWithButtons && (
          <Modal
            open={showSuccessMessageWithButtons}
            onClose={() => setShowSuccessMessageWithButtons(false)}
          >
            <div className="flex justify-center items-center h-screen">
              <div className="bg-white p-8 rounded-lg shadow-md w-[35rem] text-center relative">
                <p className="text-3xl font-bold mb-4">Success!</p>
                <p className="text-xl mb-4">Goal has been accomplished.</p>
                <div className="flex justify-center gap-4">
                  <button
                    className="break-words font-semibold text-[1.2rem] mt-5 text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                    style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                    onClick={() => {
                      handleAddNew();
                      setShowSuccessMessageWithButtons(false);
                    }}
                  >
                    Add New Goals
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}


        <Modal
          open={successModal}
          onClose={handleCloseSuccessModal}
          aria-labelledby="success-modal-title"
          aria-describedby="success-modal-description"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className=" bg-white p-8 rounded-lg shadow-md h-70 w-[35rem] text-center relative">
              <button
                onClick={handleCloseSuccessModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
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
              <p id="success-modal-title" className="text-3xl font-bold mb-4">
                Success!
              </p>
              <p id="success-modal-description" className=" text-xl mb-4 mt-8">
                Goal Successfully Saved.
              </p>
              <button
                className="break-words font-semibold mt-5 text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                onClick={handleCloseSuccessModal}
              >
                OK
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <div className="flex flex-row justify-center w-[70rem] mb-20 mt-10">
        <div className="flex space-x-10">
          <button
            className="break-words font-semibold text-[1.2rem] text-[#AB3510] w-[11rem] rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#ffffff] border border-[#AB3510] cursor-pointer hover:bg-[#AB3510] hover:text-[#ffffff]"
            onClick={toggleEditing}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          <button
            className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
            style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
