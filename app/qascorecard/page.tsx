"use client";
import React, { useState, useEffect } from "react";
import QANavbar from "../components/QANavbar";
import QAPrimaryFinancial from "../components/QAPrimaryFinancial";
import QAPrimaryStakeholder from "../components/QAPrimaryStakeholder";
import QAPrimaryInternal from "../components/QAPrimaryInternal";
import QAPrimaryLearning from "../components/QAPrimaryLearning";
import { toast } from "react-toastify";
import Select from "react-select"; // Import react-select
import { useSession } from "next-auth/react";
import QAFinancial from "../components/QAFinancial";
import QAStakeholder from "../components/QAStakeholder";
import QAInternal from "../components/QAInternal";
import QALearning from "../components/QALearning";

interface Department {
  id: number;
  department_name: string;
}

const QAScorecard = () => {
  const { data: session, status, update } = useSession();
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [currentView, setCurrentView] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(1);

  // Store the selected view in local storage
  const changeView = (view: string) => {
    localStorage.setItem("lastView", view);
    setCurrentView(view);
  };

  useEffect(() => {
    const lastView = localStorage.getItem("lastView");

    if (lastView) {
      setCurrentView(lastView);
    }
  }, []);

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
        //setIsLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        //setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle the department selection change
  const handleDepartmentChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setSelectedDepartmentId(selectedOption ? selectedOption.value : 1);
  };

  // Map departments to react-select options
  const departmentOptions = departments.map((department) => ({
    value: department.id,
    label: department.department_name,
  }));
 
  return (
    <div className="flex flex-row w-full h-screen">
      <QANavbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <div className="flex flex-row">
          <div className="mb-5 mt-[0rem] inline-block break-words font-bold text-[3rem] text-[rgb(59,59,59)]">
            BALANCE SCORECARD
          </div>
          <div className="flex justify-center lg:ml-[46rem] md:ml-[40rem] mt-[0.5rem] border border-gray-200 bg-gray w-[18rem] h-[4rem] rounded-xl gap-2 px-1 py-1 text-md font-medium">
            <button
              onClick={() => changeView("primary")}
              className={`rounded-lg w-[15rem] ${
                currentView === "primary"
                  ? "bg-[#A43214] text-white"
                  : "border text-[#A43214]"
              } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
            >
              PRIMARY
            </button>
            <button
              onClick={() => changeView("secondary")}
              className={`rounded-lg w-[10rem] ${
                currentView === "secondary"
                  ? "bg-[#A43214] text-white"
                  : "border text-[#A43214]"
              } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
            >
              SECONDARY
            </button>
          </div>
        </div>

        <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10">
          Explore the Balanced Scorecard feature to gain a comprehensive view of
          your organization&apos;s performance across different dimensions. Use
          it to set clear objectives, track progress, and drive strategic
          initiatives for success.
        </div>

        {currentView === "primary" && (
          <div>
            <div className="flex mb-5 justify-end font-medium mr-[2rem]">
              <Select
                options={departmentOptions}
                onChange={handleDepartmentChange}
                placeholder="Select Department"
                value={
                  selectedDepartmentId
                    ? departmentOptions.find(
                        (option) => option.value === selectedDepartmentId
                      )
                    : null
                }
                className="w-[20rem] border border-gray-300 rounded-lg"
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#A43214" : "white", // Background color when focused
                    color: state.isFocused ? "white" : "black", // Text color when focused
                    cursor: "pointer",
                    "&:active": {
                      backgroundColor: "#A43214", // Background color when selected
                      color: "white", // Text color when selected
                    },
                  }),
                  control: (provided) => ({
                    ...provided,
                    borderColor: "gray", // Border color for the select control
                    boxShadow: "none", // Remove the default blue outline
                    "&:hover": {
                      borderColor: "#A43214", // Border color on hover
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999, // Ensure dropdown appears above other elements
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    padding: 0, // Remove padding for menu list
                  }),
                }}
              />
            </div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <QAPrimaryFinancial
                selectedDepartmentId={selectedDepartmentId}
                departments={departments}
              />
            </div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <QAPrimaryStakeholder
                selectedDepartmentId={selectedDepartmentId}
                departments={departments}
              />
            </div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <QAPrimaryInternal
                selectedDepartmentId={selectedDepartmentId}
                departments={departments}
              />
            </div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <QAPrimaryLearning
                selectedDepartmentId={selectedDepartmentId}
                departments={departments}
              />
            </div>
          </div>
        )}

        {currentView === "secondary" && (
          <div>
            {/* Department selection dropdown with react-select */}
            <div className="flex mb-5 justify-end font-medium mr-[2rem]">
              <Select
                options={departmentOptions}
                onChange={handleDepartmentChange}
                value={
                  selectedDepartmentId
                    ? departmentOptions.find(
                        (option) => option.value === selectedDepartmentId
                      )
                    : null
                }
                placeholder="Select Department"
                className="w-[20rem] border border-gray-300 rounded-lg"
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#A43214" : "white", // Background color when focused
                    color: state.isFocused ? "white" : "black", // Text color when focused
                    cursor: "pointer",
                    "&:active": {
                      backgroundColor: "#A43214", // Background color when selected
                      color: "white", // Text color when selected
                    },
                  }),
                  control: (provided) => ({
                    ...provided,
                    borderColor: "gray", // Border color for the select control
                    boxShadow: "none", // Remove the default blue outline
                    "&:hover": {
                      borderColor: "#A43214", // Border color on hover
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999, // Ensure dropdown appears above other elements
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    padding: 0, // Remove padding for menu list
                  }),
                }}
              />
            </div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <QAFinancial selectedDepartmentId={selectedDepartmentId} />
            </div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <QAStakeholder selectedDepartmentId={selectedDepartmentId} />
            </div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <QAInternal selectedDepartmentId={selectedDepartmentId} />
            </div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <QALearning selectedDepartmentId={selectedDepartmentId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QAScorecard;
