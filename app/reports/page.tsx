"use client";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import ReportFinancial from "../components/ReportFinancial";
import ReportLearning from "../components/ReportLearning";
import ReportStakeholder from "../components/ReportStakeholder";
import ReportInternal from "../components/ReportInternal";

const ReportsPage = () => {
  // State to manage the current view
  const [currentView, setCurrentView] = useState("default");

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

  return (
    <div className="flex flex-row w-full text-[rgb(59,59,59)]">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <div className="flex flex-row">
          <div className="mb-5 mt-[0rem] break-words font-bold text-[3rem]">
            REPORT
          </div>
          <div className="flex justify-center ml-[68rem] mt-[0.5rem] border border-gray-200 bg-gray w-[16rem] h-[4rem] rounded-xl gap-2 px-1 py-1 text-md font-medium">
            <button
              onClick={() => setCurrentView("default")}
              className={`rounded-lg ${
                currentView === "default"
                  ? "bg-[#A43214] text-white"
                  : "border text-[#A43214]"
              } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
            >
              DEFAULT
            </button>
            <button
              onClick={() => setCurrentView("printed")}
              className={`rounded-lg ${
                currentView === "printed"
                  ? "bg-[#A43214] text-white"
                  : "border text-[#A43214]"
              } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
            >
              REPORT
            </button>
          </div>
        </div>
        <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10">
          The Report feature in Atlas allows users to view a comprehensive
          summary of their progress over the past months. It provides a clear
          and concise overview of your accomplishments and areas for
          improvement, helping you stay on track and make informed decisions for
          future planning.
        </div>
        {/* perspectives toggle */}
        {currentView === "default" && (
          <div>
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
            <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              {selectedComponent === "Financial" && <ReportFinancial />}
              {selectedComponent === "Stakeholder" && <ReportStakeholder />}
              {selectedComponent === "Internal" && <ReportInternal />}
              {selectedComponent === "Learning" && <ReportLearning />}
            </div>
          </div>
        )}
        {currentView === "printed" && (
          <div className="flex flex-col gap-10">
            <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <div className="flex flex-row p-1 w-[75rem] h-auto">
                <img
                  src="/first.png"
                  alt=""
                  className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                />
                <div className="flex flex-col">
                  {/* insert here ang year nga giset sa input goals */}
                  <span className="font-bold text-2xl items-center mt-1 ml-[-0.5rem]">1ST SEMESTER S.Y </span> 
                  <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                    The 1st Semester Progress Report offers a detailed look into academic performance during the first half of the year.
                  </span>
                </div>
              </div>
              <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
                <div className="p-2 font-bold w-[10rem]">Semester</div>
                <div className="p-2 font-bold w-[10rem]">Target Code</div>
                <div className="p-2 font-bold w-[15rem]">Office Target</div>
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
                <div className="p-2 w-[5rem] font-bold">OFI</div>
              </div>
            </div>


            <div className="break-words shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              <div className="flex flex-row p-1 w-[75rem] h-auto">
                <img
                  src="/second.png"
                  alt=""
                  className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
                />
                <div className="flex flex-col">
                  {/* insert here ang year nga giset sa input goals */}
                  <span className="font-bold text-2xl items-center mt-1 ml-[-0.5rem]">2ND SEMESTER S.Y </span> 
                  <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                    The 2nd Semester Progress Report offers a detailed look into academic performance during the second half of the year.
                  </span>
                </div>
              </div>
              <div className="flex flex-row w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium text-center items-center">
                <div className="p-2 font-bold w-[10rem]">Semester</div>
                <div className="p-2 font-bold w-[10rem]">Target Code</div>
                <div className="p-2 font-bold w-[15rem]">Office Target</div>
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
                <div className="p-2 w-[5rem] font-bold">OFI</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
