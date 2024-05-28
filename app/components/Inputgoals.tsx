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

  const [isEditing, setIsEditing] = useState(false);
  const [officeVision, setOfficeVision] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [strategicGoals, setStrategicGoals] = useState("");
  const [strategicGoals2, setStrategicGoals2] = useState("");
  const [strategicGoals3, setStrategicGoals3] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [successModal, setSuccessModal] = useState(false);
  const [isNew, setIsNew] = useState(true); // New state to track if adding new goals

  const handleCloseSuccessModal = () => {
    setSuccessModal(false);
  };

  const department_id = user?.department_id;
  console.log("User Parsed: ", user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/goals/get/${department_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.vision) {
          setOfficeVision(data.vision);
          setValueProposition(data.proposition);
          setStrategicGoals(data.goals);
          setStrategicGoals2(data.goals2);
          setStrategicGoals3(data.goals3);
          setSelectedDate(new Date(data.startDate));
          setSelectedEndDate(new Date(data.endDate));
          setIsEditing(false);
          setIsNew(false); // Set to false if existing data is fetched
        } else {
          console.error("Error fetching input goals data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error, show error message to the user, etc.
      }
    };
    fetchData();
  }, [department_id]);

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (!officeVision || !valueProposition || !strategicGoals) {
      alert("Please fill out all fields");
      return;
    }

    try {
      // Determine if we should POST or PUT
      const checkResponse = await fetch(`http://localhost:8080/goals/get/${department_id}`);
      const isExisting = checkResponse.ok && (await checkResponse.json()).vision;

      const url = isExisting ? `http://localhost:8080/goals/update/${department_id}` : "http://localhost:8080/goals/insert";
      const method = isExisting ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vision: officeVision,
          proposition: valueProposition,
          goals: strategicGoals,
          goals2: strategicGoals2,
          goals3: strategicGoals3,
          startDate: selectedDate,
          endDate:selectedEndDate,
          department: {
            id: department_id, 
          },
        }),
      });

      if (response.ok) {
        setSuccessModal(true);
        setIsEditing(false);
        setIsNew(false); // Set to false after saving
      } else {
        alert("Failed to save goal setting");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddNew = () => {
    setOfficeVision("");
    setValueProposition("");
    setStrategicGoals("");
    setStrategicGoals2("");
    setStrategicGoals3("");
    setSelectedDate(new Date());
    setSelectedEndDate(null);
    setIsEditing(true);
    setIsNew(true); // Set to true when adding new goals
  };

  const toggleEditing = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`http://localhost:8080/goals/get/${department_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.vision) {
          setOfficeVision(data.vision);
          setValueProposition(data.proposition);
          setStrategicGoals(data.goals);
          setStrategicGoals2(data.goals2);
          setStrategicGoals3(data.goals3);
          setSelectedDate(new Date(data.startDate));
          setSelectedEndDate(new Date(data.endDate));
          setIsEditing(false);
          setIsNew(false); // Set to false if existing data is fetched
        } else {
          console.error("Error fetching input goals data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setIsEditing((prevIsEditing) => !prevIsEditing);
    }
  };
  return (
    <div className="flex flex-col items-center ml-28">
      <div className="ml-[-78rem] mb-5 mt-[0rem] inline-block break-words font-bold text-[3rem] text-[#000000]">
        GOAL SETTING
      </div>
      <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10 mr-5">
        <span>
          Goal setting involves defining specific objectives, outlining actionable steps, and establishing a timeframe for achievement. It provides direction and motivation for personal or professional growth by creating clear targets to strive towards.
        </span>
      </div>
      <div>
        <div className="ml-[-1rem] mb-10">
          <div className="flex flex-col ml-[-3rem]">
            <div className="flex flex-row justify-between w-[38rem] mb-3">
              <span className="m-[0_0.8rem_0_0] ml-[-12rem] w-[31.4rem] break-words font-semibold text-[1.3rem] text-[#000000]">
                Start Date
              </span>
              <span className="break-words font-semibold text-[1.3rem] text-[#000000]">
                Target Completion Date
              </span>
            </div>
            <div className="flex flex-row justify-between  w-[52rem]">
              <div className="rounded-[0.6rem] ml-[-12rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.10)] border-[0.1rem_solid_#807C7C] bg-[#FFFFFF] relative p-[0.9rem_1.1rem_0.8rem_1.1rem] w-[28.8rem] box-sizing-border">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    let today = new Date();
                    let startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    if (date && date < startOfDay) {
                      toast.error("Please select a future or today's date.");
                    } else {
                      setSelectedDate(date);
                      if (selectedEndDate && date && selectedEndDate < date) {
                        setSelectedEndDate(null);
                      }
                    }
                  }}
                  minDate={new Date()}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="YYYY/MM/DD"
                  className={`break-words font-normal text-[0.9rem] text-[#807C7C] cursor-pointer w-[26.5rem] focus:outline-none ${!isEditing && !isNew ? "pointer-events-none opacity-50" : ""}`}
                  disabled={!isEditing && !isNew}
                />
              </div>
              <div className="rounded-[0.6rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.10)] border-[0.1rem_solid_#807C7C] bg-[#FFFFFF] relative p-[0.9rem_1.1rem_0.8rem_1.1rem] w-[28.8rem] box-sizing-border">
                <DatePicker
                  selected={selectedEndDate}
                  onChange={(date: Date | null) => {
                    if (date && selectedDate && date < selectedDate) {
                      toast.error("End date cannot be before start date.");
                    } else {
                      setSelectedEndDate(date);
                    }
                  }}
                  minDate={selectedDate || new Date()}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="YYYY/MM/DD"
                  className={`break-words font-normal text-[0.9rem] text-[#807C7C] cursor-pointer w-[26.5rem] focus:outline-none ${!isEditing && !isNew ? "pointer-events-none opacity-50" : ""}`}
                  disabled={!isEditing && !isNew}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[65rem] mb-10">
          <div className="flex flex-col ml-[-16rem]">
            <div className="m-[0_41.8rem_0.4rem_0] flex flex-row w-[fit-content] box-sizing-border">
              <span className="m-[0_0.3rem_0_0] break-words font-semibold text-[1.3rem] text-[#000000]">
                Office Vision
              </span>
              <div className="m-[0.2rem_0_0.2rem_0] inline-block break-words font-semibold text-[0.9rem] text-[#DD1414]">
                *
              </div>
            </div>
            <div className="relative m-[0_23.7rem_0.7rem_0] inline-block break-words font-normal text-[1rem] text-[#807C7C]">
              A brief statement articulating the company&apos;s long-term goals and values.
            </div>
          </div>
 
          <textarea
            className={`rounded-[0.9rem] ml-[-16rem] w-[95rem] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-300" : ""
              } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.10)] border-[0.1rem_solid_#807C7C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[0.9rem] text-[#504C4C]`}
            value={officeVision}
            onChange={(event) => setOfficeVision(event.target.value)}
            disabled={!isEditing && !isNew}
          ></textarea>
 
          <div className="flex flex-col ml-[-16rem]">
            <div className="m-[0_38.8rem_0.4rem_0] flex flex-row w-[fit-content] box-sizing-border">
              <span className="m-[0_0.5rem_0_0] break-words font-semibold text-[1.3rem] text-[#000000]">
                Value Proposition
              </span>
              <div className="m-[0.1rem_0_0.3rem_0] inline-block break-words font-semibold text-[0.9rem] text-[#DD1414]">
                *
              </div>
            </div>
            <div className="m-[0_14.8rem_0.8rem_0] inline-block break-words font-normal text-[1rem] text-[#807C7C]">
              A concise statement that communicates the unique benefits and advantages of your service.
            </div>
          </div>
 
          <textarea
            className={`rounded-[0.9rem] ml-[-16rem] w-[95rem] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-300" : ""
              } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.10)] border-[0.1rem_solid_#807C4C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[0.9rem] text-[#504C4C]`}
            value={valueProposition}
            onChange={(event) => setValueProposition(event.target.value)}
            disabled={!isEditing && !isNew}
          ></textarea>
 
          <div className="flex flex-col ml-[-16rem]">
            <div className="m-[0_41.1rem_0.5rem_0] inline-block break-words font-semibold text-[1.3rem] text-[#000000]">
              Strategic Goals
            </div>
            <div className="m-[0_12.7rem_0.6rem_0] inline-block break-words font-normal text-[1rem] text-[#807C7C]">
              A guiding principles for decision-making, driving the organization towards its desired future state.
            </div>
          </div>
 
          <textarea
            className={`rounded-[0.9rem] ml-[-16rem] mb-5 w-[95rem] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-300" : ""
              } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.10)] border-[0.1rem_solid_#807C4C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[0.9rem] text-[#504C4C]`}
            value={strategicGoals}
            onChange={(event) => setStrategicGoals(event.target.value)}
            disabled={!isEditing && !isNew}
          ></textarea>
 
          <textarea
            className={`rounded-[0.9rem] ml-[-16rem] mb-5 w-[95rem] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-300" : ""
              } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.10)] border-[0.1rem_solid_#807C4C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[0.9rem] text-[#504C4C]`}
            value={strategicGoals2}
            onChange={(event) => setStrategicGoals2(event.target.value)}
            disabled={!isEditing && !isNew}
          ></textarea>
 
          <textarea
            className={`rounded-[0.9rem] ml-[-16rem] mb-5 w-[95rem] h-[8.3rem] ${!isEditing && !isNew ? "bg-gray-300" : ""
              } relative pt-[0.7rem] pr-[4.2rem] pb-[2.1rem] pl-[1.1rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.10)] border-[0.1rem_solid_#807C4C] resize-none overflow-hidden box-sizing-border break-words font-normal text-[0.9rem] text-[#504C4C]`}
            value={strategicGoals3}
            onChange={(event) => setStrategicGoals3(event.target.value)}
            disabled={!isEditing && !isNew}
          ></textarea>
          {/* Remaining textarea elements */}
        </div>
      </div>
 
      <div className="flex flex-row justify-center w-[70rem] mb-20">
        <div className="flex space-x-10 ">
          <button
            className="break-words font-semibold text-[1.2rem] text-[#962203] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#FAD655] cursor-pointer"
            onClick={toggleEditing}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            className="break-words font-semibold text-[1.2rem] text-[#962203] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#FAD655] cursor-pointer"
            onClick={handleAddNew}
          >
            Add New Goals
          </button>
          <button
            className="break-words font-semibold text-[1.2rem] text-[#962203] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#FAD655] cursor-pointer"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
 
 
 
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
              className="rounded-xl bg-[#8a252c] text-white text-xl w-40 px-4 py-2 border[0.1rem] border-white hover:bg-[#a8444b] font-medium hover:text-[#fffff] focus:outline-none h-12 mt-5"
              onClick={handleCloseSuccessModal}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}