"use client";
import QANavbar from "../components/QANavbar";
// import QADepartmentReportView from "@/app/components/QADepartmentReportView";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";
import Select from "react-select"; // Import react-select

interface Department {
  id: number;
  department_name: string;
}

interface FinancialScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  actions: string;
  budget: string;
  incharge: string;
  ofi: string;
  evidence_link: string;
}

interface StakeholderScorecard {
  id: number;
  target_code: string;
  metric: string; 
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  actions: string;
  budget: string;
  incharge: string;
  ofi: string;
  evidence_link: string;
}

interface InternalScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  actions: string;
  budget: string;
  incharge: string;
  ofi: string;
  evidence_link: string;
}

interface LearningScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  actions: string;
  budget: string;
  incharge: string;
  ofi: string;
  evidence_link: string;
}

export default  function QAReportView() {

  const [currentView, setCurrentView] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null>(null);

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
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchData();
  }, []);

  // Handle the department selection change
  const handleDepartmentChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setSelectedDepartmentId(selectedOption ? selectedOption.value : null);

    // Clear the scorecard states when the department changes
    setFinancialSavedScorecards([]);
    setPrimaryFinancialSavedScorecards([]);
    setStakeholderSavedScorecards([]);
    setPrimaryStakeholderSavedScorecards([]);
    setInternalSavedScorecards([]);
    setPrimaryInternalSavedScorecards([]);
    setLearningSavedScorecards([]);
    setPrimaryLearningSavedScorecards([]);
  };

  // Map departments to react-select options
  const departmentOptions = departments.map((department) => ({
    value: department.id,
    label: department.department_name,
  }));

  // FINANCIAL
  // financial scorecards
  const [financialSavedScorecards, setFinancialSavedScorecards] = useState<
    FinancialScorecard[]
  >([]);

  const [primaryFinancialSavedScorecards, setPrimaryFinancialSavedScorecards] = useState<
    FinancialScorecard[]
  >([]);

  const allFinancialSavedScorecards = [
    ...primaryFinancialSavedScorecards,
    ...financialSavedScorecards,
  ];


  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchFinancialScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching financial scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial scorecards");
        }
        const data = await response.json();
        console.log("Financial scorecards data:", data);
        setFinancialSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching financial scorecards:", error);
      }
    };

    fetchFinancialScorecards();
  }, [selectedDepartmentId]);

  //fetched the primary financial
  useEffect(() => {
    const fetchPrimaryFinancialScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching primary financial scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryFinancialBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary financial scorecards");
        }
        const data = await response.json();
        console.log("Primary financial scorecards data:", data);
        setPrimaryFinancialSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching primary financial scorecards:", error);
      }
    };

    fetchPrimaryFinancialScorecards();
  }, [selectedDepartmentId]);

  // STAKEHOLDER
  // stakeholder scorecards
  const [stakeholderSavedScorecards, setStakeholderSavedScorecards] = useState<
    StakeholderScorecard[]
  >([]);

  const [primaryStakeholderSavedScorecards, setPrimaryStakeholderSavedScorecards] = useState<
    StakeholderScorecard[]
  >([]);

  const allStakeholderSavedScorecards = [
    ...primaryStakeholderSavedScorecards,
    ...stakeholderSavedScorecards,
  ];

  // Fetch the saved stakeholder scorecards from the server
  useEffect(() => {
    const fetchStakeholderScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching stakeholder scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/stakeholder/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stakeholder scorecards");
        }
        const data = await response.json();
        console.log("Stakeholder scorecards data:", data);
        setStakeholderSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching stakeholder scorecards:", error);
      }
    };

    fetchStakeholderScorecards();
  }, [selectedDepartmentId]);

  //fetch the primary stakeholder
  useEffect(() => {
    const fetchPrimaryStakeholderScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching primary stakeholder scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryStakeholderBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary stakeholder scorecards");
        }
        const data = await response.json();
        console.log("Primary stakeholder scorecards data:", data);
        setPrimaryStakeholderSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching primary stakeholder scorecards:", error);
      }
    };

    fetchPrimaryStakeholderScorecards();
  }, [selectedDepartmentId]);



  // INTERNAL
  // internal scorecards
  const [internalSavedScorecards, setInternalSavedScorecards] = useState<
    InternalScorecard[]
  >([]);

  const [primaryInternalSavedScorecards, setPrimaryInternalSavedScorecards] = useState<
    InternalScorecard[]
  >([]);

  const allInternalSavedScorecards = [
    ...primaryInternalSavedScorecards,
    ...internalSavedScorecards,
  ];


  // Fetch the saved internal scorecards from the server
  useEffect(() => {
    const fetchInternalScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching internal scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/internal/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch internal scorecards");
        }
        const data = await response.json();
        console.log("Internal scorecards data:", data);
        setInternalSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching internal scorecards:", error);
      }
    };

    fetchInternalScorecards();
  }, [selectedDepartmentId]);

  //fetch the primary internal
  useEffect(() => {
    const fetchPrimaryInternalScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching primary internal process scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryInternalBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary internal scorecards");
        }
        const data = await response.json();
        console.log("Primary internal scorecards data:", data);
        setPrimaryInternalSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching primary internal scorecards:", error);
      }
    };

    fetchPrimaryInternalScorecards();
  }, [selectedDepartmentId]);

  // LEARNING
  // learning scorecards
  const [learningSavedScorecards, setLearningSavedScorecards] = useState<
    LearningScorecard[]
  >([]);

  const [primaryLearningSavedScorecards, setPrimaryLearningSavedScorecards] = useState<
    InternalScorecard[]
  >([]);

  const allLearningSavedScorecards = [
    ...primaryLearningSavedScorecards,
    ...learningSavedScorecards,
  ];

  // Fetch the saved learning scorecards from the server
  useEffect(() => {
    const fetchLearningScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching learning scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/learning/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch learning scorecards");
        }
        const data = await response.json();
        console.log("Learning scorecards data:", data);
        setLearningSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching learning scorecards:", error);
      }
    };

    fetchLearningScorecards();
  }, [selectedDepartmentId]);

  //fetch the primary learning
  useEffect(() => {
    const fetchPrimaryLearningScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching primary learning and growth scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryLearningBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary learning scorecards");
        }
        const data = await response.json();
        console.log("Primary learning scorecards data:", data);
        setPrimaryLearningSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching primary learning scorecards:", error);
      }
    };

    fetchPrimaryLearningScorecards();
  }, [selectedDepartmentId]);


  function truncateString(str: string | null | undefined, num: number): string {
    if (!str) {
      return "";
    }
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  
    
    return (
      <div className="flex flex-row w-full h-screen">
        <div className="flex">
          <QANavbar />
        </div>
        <div className="flex-1">
          <div className="flex-1 flex flex-col mt-8 ml-80 text-[rgb(59,59,59)]">
            <div className="flex flex-row">
              <span className="break-words font-bold text-[3rem]">
                  REPORT
              </span>
              <div className="flex mb-5 mt-3 justify-end font-medium ml-[70rem]">
              <Select
                options={departmentOptions}
                onChange={handleDepartmentChange}
                placeholder="Select Department"
                className="w-[20rem] border border-gray-300 rounded-lg"
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#A43214" : "white", // Background color for focused option
                    color: state.isFocused ? "white" : "black", // Text color for focused option
                    cursor: "pointer",
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
                }}
              />
              </div>
            </div>
            <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10">
                        The Report feature in Atlas allows users to view a comprehensive
                        summary of their progress over the past months. It provides a clear
                        and concise overview of your accomplishments and areas for
                        improvement, helping you stay on track and make informed decisions for
                        future planning.
            </div>
            {selectedDepartmentId ? (
            <div>
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[97%] h-auto mb-10 rounded-lg pb-5">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <div className="flex flex-row p-1 w-[85rem] h-auto">
                      <img
                        src="/financial.png"
                        alt=""
                        className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          FINANCIAL OVERVIEW
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        The Annual Progress Report offers a detailed look into
                        academic performance during the whole year.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
                  <div className="p-2 font-bold w-[10rem]">Target Code</div>
                  <div className="p-2 font-bold w-[20rem]">Office Target</div>
                  <div className="p-2 font-bold w-[8rem]">KPI</div>
                  <div className="p-2 font-bold w-[10rem]">Actions</div>
                  <div className="p-2 font-bold w-[10rem]">Budget</div>
                  <div className="p-2 font-bold w-[10rem]">In-charge</div>
                  <div className="p-2 font-bold w-[10rem]">
                    Performance <br />
                    <div className="font-medium ">
                      <span>Actual</span>
                      <span className="font-bold">|</span>
                      <span>Target</span>
                    </div>
                  </div>
                  <div className="p-2 w-[10rem] font-bold">OFI</div>
                  <div className="p-2 w-[13rem] font-bold">Link of Evidence</div>
                  </div>
                </div>
                <div className="bg-[#ffffff] w-[100%] h-[auto] flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg overflow-y-auto overflow-x-hidden">
                  {allFinancialSavedScorecards &&
                    allFinancialSavedScorecards.length > 0 &&
                    allFinancialSavedScorecards.map((scorecard, index) => {
                      if (!scorecard) return null; 

                      return (
                        <div className="flex flex-col w-auto h-auto text-[rgb(43,43,43)]">
                          <div
                            key={index}
                            className={`flex items-center text-center ${
                              index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
                            }`}
                          >
                            <div className="p-2 w-[10rem]">{scorecard.target_code || "N/A"}:</div>
                            <div className="p-2 w-[20rem]" title={scorecard.office_target || "N/A"}>{truncateString(scorecard.office_target || "N/A", 35)}</div>
                            <div className="p-2 w-[8rem]" title={scorecard.key_performance_indicator || "N/A"}>{truncateString(scorecard.key_performance_indicator || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]" title={scorecard.actions || "N/A"}>{truncateString(scorecard.actions || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]">{scorecard.budget || "N/A"}</div>
                            <div className="p-2 w-[10rem]">{scorecard.incharge || "N/A"}</div>
                            <div className="p-2 w-[10rem] text-center">
                              <span className="text-start mr-2">
                                {scorecard.target_performance || "N/A"}
                              </span>
                              <span className="text-center">|</span>
                              <span className="text-end ml-2">
                                {scorecard.actual_performance || "N/A"}
                              </span>
                            </div>
                            <div className="p-2 w-[10rem]" title={scorecard.ofi || "N/A"}>{truncateString(scorecard.ofi || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]">
                                  {scorecard.evidence_link ? (
                                    <a href={scorecard.evidence_link} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">
                                      {scorecard.evidence_link.length > 10
                                        ? `${scorecard.evidence_link.substring(0, 10)}...`
                                        : scorecard.evidence_link}
                                    </a>
                                  ) : (
                                    "..."
                                  )}
                            </div>
                            </div>
                          </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/* INSERT STAKEHOLDER HERE */}
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[97%] h-auto mb-10 rounded-lg pb-5">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <div className="flex flex-row p-1 w-[85rem] h-auto">
                      <img
                        src="/stakeholder.png"
                        alt=""
                        className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          STAKEHOLDER OVERVIEW
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        The Annual Progress Report offers a detailed look into
                        academic performance during the whole year.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
                  <div className="p-2 font-bold w-[10rem]">Target Code</div>
                  <div className="p-2 font-bold w-[20rem]">Office Target</div>
                  <div className="p-2 font-bold w-[8rem]">KPI</div>
                  <div className="p-2 font-bold w-[10rem]">Actions</div>
                  <div className="p-2 font-bold w-[10rem]">Budget</div>
                  <div className="p-2 font-bold w-[10rem]">In-charge</div>
                  <div className="p-2 font-bold w-[10rem]">
                    Performance <br />
                    <div className="font-medium ">
                      <span>Actual</span>
                      <span className="font-bold">|</span>
                      <span>Target</span>
                    </div>
                  </div>
                  <div className="p-2 w-[10rem] font-bold">OFI</div>
                  <div className="p-2 w-[13rem] font-bold">Link of Evidence</div>
                  </div>
                </div>
                <div className="bg-[#ffffff] w-[100%] h-[auto] flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg overflow-y-auto overflow-x-hidden">
                  {allStakeholderSavedScorecards &&
                    allStakeholderSavedScorecards.length > 0 &&
                    allStakeholderSavedScorecards.map((scorecard, index) => {
                      if (!scorecard) return null; 

                      return (
                        <div className="flex flex-col w-auto h-auto text-[rgb(43,43,43)]">
                          <div
                            key={index}
                            className={`flex items-center text-center ${
                              index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
                            }`}
                          >
                            <div className="p-2 w-[10rem]">{scorecard.target_code || "N/A"}:</div>
                            <div className="p-2 w-[20rem]" title={scorecard.office_target || "N/A"}>{truncateString(scorecard.office_target || "N/A", 35)}</div>
                            <div className="p-2 w-[8rem]" title={scorecard.key_performance_indicator || "N/A"}>{truncateString(scorecard.key_performance_indicator || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]" title={scorecard.actions || "N/A"}>{truncateString(scorecard.actions || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]">{scorecard.budget || "N/A"}</div>
                            <div className="p-2 w-[10rem]">{scorecard.incharge || "N/A"}</div>
                            <div className="p-2 w-[10rem] text-center">
                              <span className="text-start mr-2">
                                {scorecard.target_performance || "N/A"}
                              </span>
                              <span className="text-center">|</span>
                              <span className="text-end ml-2">
                                {scorecard.actual_performance || "N/A"}
                              </span>
                            </div>
                            <div className="p-2 w-[10rem]" title={scorecard.ofi || "N/A"}>{truncateString(scorecard.ofi || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]">
                                  {scorecard.evidence_link ? (
                                    <a href={scorecard.evidence_link} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">
                                      {scorecard.evidence_link.length > 10
                                        ? `${scorecard.evidence_link.substring(0, 10)}...`
                                        : scorecard.evidence_link}
                                    </a>
                                  ) : (
                                    "..."
                                  )}
                            </div>
                            </div>
                          </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/* INSERT INTERNAL HERE */}
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[97%] h-auto mb-10 rounded-lg pb-5">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <div className="flex flex-row p-1 w-[85rem] h-auto">
                      <img
                        src="/internal.png"
                        alt=""
                        className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          INTERNAL PROCESS OVERVIEW
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        The Annual Progress Report offers a detailed look into
                        academic performance during the whole year.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
                  <div className="p-2 font-bold w-[10rem]">Target Code</div>
                  <div className="p-2 font-bold w-[20rem]">Office Target</div>
                  <div className="p-2 font-bold w-[8rem]">KPI</div>
                  <div className="p-2 font-bold w-[10rem]">Actions</div>
                  <div className="p-2 font-bold w-[10rem]">Budget</div>
                  <div className="p-2 font-bold w-[10rem]">In-charge</div>
                  <div className="p-2 font-bold w-[10rem]">
                    Performance <br />
                    <div className="font-medium ">
                      <span>Actual</span>
                      <span className="font-bold">|</span>
                      <span>Target</span>
                    </div>
                  </div>
                  <div className="p-2 w-[10rem] font-bold">OFI</div>
                  <div className="p-2 w-[13rem] font-bold">Link of Evidence</div>
                  </div>
                </div>
                <div className="bg-[#ffffff] w-[100%] h-[auto] flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg overflow-y-auto overflow-x-hidden">
                  {allInternalSavedScorecards &&
                    allInternalSavedScorecards.length > 0 &&
                    allInternalSavedScorecards.map((scorecard, index) => {
                      if (!scorecard) return null; 

                      return (
                        <div className="flex flex-col w-auto h-auto text-[rgb(43,43,43)]">
                          <div
                            key={index}
                            className={`flex items-center text-center ${
                              index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
                            }`}
                          >
                            <div className="p-2 w-[10rem]">{scorecard.target_code || "N/A"}:</div>
                            <div className="p-2 w-[20rem]" title={scorecard.office_target || "N/A"}>{truncateString(scorecard.office_target || "N/A", 35)}</div>
                            <div className="p-2 w-[8rem]" title={scorecard.key_performance_indicator || "N/A"}>{truncateString(scorecard.key_performance_indicator || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]" title={scorecard.actions || "N/A"}>{truncateString(scorecard.actions || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]">{scorecard.budget || "N/A"}</div>
                            <div className="p-2 w-[10rem]">{scorecard.incharge || "N/A"}</div>
                            <div className="p-2 w-[10rem] text-center">
                              <span className="text-start mr-2">
                                {scorecard.target_performance || "N/A"}
                              </span>
                              <span className="text-center">|</span>
                              <span className="text-end ml-2">
                                {scorecard.actual_performance || "N/A"}
                              </span>
                            </div>
                            <div className="p-2 w-[10rem]" title={scorecard.ofi || "N/A"}>{truncateString(scorecard.ofi || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]">
                                  {scorecard.evidence_link ? (
                                    <a href={scorecard.evidence_link} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">
                                      {scorecard.evidence_link.length > 10
                                        ? `${scorecard.evidence_link.substring(0, 10)}...`
                                        : scorecard.evidence_link}
                                    </a>
                                  ) : (
                                    "..."
                                  )}
                            </div>
                            </div>
                          </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/* INSERT LEARNING HERE */}
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[97%] h-auto mb-10 rounded-lg pb-5">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <div className="flex flex-row p-1 w-[85rem] h-auto">
                      <img
                        src="/learning.png"
                        alt=""
                        className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                          LEARNING & GROWTH OVERVIEW
                        </span>
                        <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                        The Annual Progress Report offers a detailed look into
                        academic performance during the whole year.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
                  <div className="p-2 font-bold w-[10rem]">Target Code</div>
                  <div className="p-2 font-bold w-[20rem]">Office Target</div>
                  <div className="p-2 font-bold w-[8rem]">KPI</div>
                  <div className="p-2 font-bold w-[10rem]">Actions</div>
                  <div className="p-2 font-bold w-[10rem]">Budget</div>
                  <div className="p-2 font-bold w-[10rem]">In-charge</div>
                  <div className="p-2 font-bold w-[10rem]">
                    Performance <br />
                    <div className="font-medium ">
                      <span>Actual</span>
                      <span className="font-bold">|</span>
                      <span>Target</span>
                    </div>
                  </div>
                  <div className="p-2 w-[10rem] font-bold">OFI</div>
                  <div className="p-2 w-[13rem] font-bold">Link of Evidence</div>
                  </div>
                </div>
                <div className="bg-[#ffffff] w-[100%] h-[auto] flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg overflow-y-auto overflow-x-hidden">
                  {allLearningSavedScorecards &&
                    allLearningSavedScorecards.length > 0 &&
                    allLearningSavedScorecards.map((scorecard, index) => {
                      if (!scorecard) return null; 

                      return (
                        <div className="flex flex-col w-auto h-auto text-[rgb(43,43,43)]">
                          <div
                            key={index}
                            className={`flex items-center text-center ${
                              index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"
                            }`}
                          >
                            <div className="p-2 w-[10rem]">{scorecard.target_code || "N/A"}:</div>
                            <div className="p-2 w-[20rem]" title={scorecard.office_target || "N/A"}>{truncateString(scorecard.office_target || "N/A", 35)}</div>
                            <div className="p-2 w-[8rem]" title={scorecard.key_performance_indicator || "N/A"}>{truncateString(scorecard.key_performance_indicator || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]" title={scorecard.actions || "N/A"}>{truncateString(scorecard.actions || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]">{scorecard.budget || "N/A"}</div>
                            <div className="p-2 w-[10rem]">{scorecard.incharge || "N/A"}</div>
                            <div className="p-2 w-[10rem] text-center">
                              <span className="text-start mr-2">
                                {scorecard.target_performance || "N/A"}
                              </span>
                              <span className="text-center">|</span>
                              <span className="text-end ml-2">
                                {scorecard.actual_performance || "N/A"}
                              </span>
                            </div>
                            <div className="p-2 w-[10rem]" title={scorecard.key_performance_indicator || "N/A"}>{truncateString(scorecard.ofi || "N/A", 8)}</div>
                            <div className="p-2 w-[10rem]">
                                  {scorecard.evidence_link ? (
                                    <a href={scorecard.evidence_link} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">
                                      {scorecard.evidence_link.length > 10
                                        ? `${scorecard.evidence_link.substring(0, 10)}...`
                                        : scorecard.evidence_link}
                                    </a>
                                  ) : (
                                    "..."
                                  )}
                            </div>
                            </div>
                          </div>
                      );
                    })}
                </div>
              </div>
            </div>
            </div>
            ) : (
              <div className="items-center align-middle mt-10 justify-center text-center">
                        <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-[97%] h-[35rem]"> 
                            <div className="flex flex-col mt-28">
                                <span className="font-bold text-[3rem] text-gray-300 text-center">
                                    Please Select a Department
                                </span>
                                <span className="font-medium mt-5 text-[1.3rem] text-gray-300">
                                    Please select a department from the dropdown menu<br/> to view the reports.
                                </span>
                            </div>
                        </div>
                      </div>
            )}

          
          </div>
        </div>
      </div>
    );
  }