"use client";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import Financial from "../components/Financial";
import Learning from "../components/Learning";
import Stakeholder from "../components/Stakeholder";
import Internal from "../components/Internal";
import PrimaryFinancial from "../components/PrimaryFinancial";
import PrimaryStakeholder from "../components/PrimaryStakeholder";
import PrimaryInternal from "../components/PrimaryInternal";
import PrimaryLearning from "../components/PrimaryLearning";

const ScorecardPage = () => {
  const [selectedComponent, setSelectedComponent] = useState("");
  const [primarySelectedComponent, setPrimarySelectedComponent] = useState("");
  const [currentView, setCurrentView] = useState("");

  // Store the selected component in local storage
  const changeComponent = (componentName: string) => {
    localStorage.setItem("lastComponent", componentName);
    setSelectedComponent(componentName);
  };

  const changePrimaryComponent = (componentName: string) => {
    localStorage.setItem("lastPrimaryComponent", componentName);
    setPrimarySelectedComponent(componentName);
  };

  // Store the selected view in local storage
  const changeView = (view: string) => {
    localStorage.setItem("lastView", view);
    setCurrentView(view);
  };

  useEffect(() => {
    const lastComponent = localStorage.getItem("lastComponent");
    const lastView = localStorage.getItem("lastView");
    const lastPrimaryComponent = localStorage.getItem("lastPrimaryComponent");

    if (lastComponent) {
      setSelectedComponent(lastComponent);
    }

    if (lastPrimaryComponent) {
      setPrimarySelectedComponent(lastPrimaryComponent);
    }

    if (lastView) {
      setCurrentView(lastView);
    }
  }, []);

  return (
    <div className="flex flex-row w-full h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <div className="flex flex-row">
          <div className="mb-5 mt-[0rem] inline-block break-words font-bold text-[3rem] text-[rgb(59,59,59)]">
            BALANCE SCORECARD
          </div>
          <div className="flex justify-center lg:ml-[46rem] md:ml-[40rem] mt-[0.5rem] border border-gray-200 bg-gray w-[18rem] h-[4rem] rounded-xl gap-2 px-1 py-1 text-md font-medium">
            <button
              onClick={() => changeView("primary")}
              className={`rounded-lg ${
                currentView === "primary"
                  ? "bg-[#A43214] text-white"
                  : "border text-[#A43214]"
              } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
            >
              PRIMARY
            </button>
            <button
              onClick={() => changeView("secondary")}
              className={`rounded-lg ${
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
            {/* perspectives toggle */}
            <div className="flex justify-center mt-[0.5rem] border border-gray-200 bg-gray w-[44rem] h-[4rem] rounded-xl px-1 py-1">
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changePrimaryComponent("Financial")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    primarySelectedComponent === "Financial"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  FINANCIAL
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changePrimaryComponent("Stakeholder")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    primarySelectedComponent === "Stakeholder"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  STAKEHOLDER
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border mr-2 cursor-pointer"
                onClick={() => changePrimaryComponent("Internal")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    primarySelectedComponent === "Internal"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  INTERNAL PROCESS
                </div>
              </div>
              <div
                className="flex flex-row box-sizing-border cursor-pointer"
                onClick={() => changePrimaryComponent("Learning")}
              >
                <div
                  className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                    primarySelectedComponent === "Learning"
                      ? "bg-[#A43214] text-white"
                      : "border text-[#A43214]"
                  } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
                >
                  LEARNING & GROWTH
                </div>
              </div>
            </div>
            {/* end of perspectives toggle */}
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              {/* place the components of primary here */}
              {primarySelectedComponent === "Financial" && <PrimaryFinancial />}
              {primarySelectedComponent === "Stakeholder" && <PrimaryStakeholder />}
              {primarySelectedComponent === "Internal" && <PrimaryInternal />}
              {primarySelectedComponent === "Learning" && <PrimaryLearning />}
            </div>
          </div>
        )}

        {currentView === "secondary" && (
          <div>
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
            <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
              {selectedComponent === "Financial" && <Financial />}
              {selectedComponent === "Stakeholder" && <Stakeholder />}
              {selectedComponent === "Internal" && <Internal />}
              {selectedComponent === "Learning" && <Learning />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScorecardPage;
