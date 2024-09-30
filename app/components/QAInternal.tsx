"use client";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface InternalScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}
type QAInternalrProps = {
  selectedDepartmentId: number;
};

export default function QAInternal({ selectedDepartmentId }: QAInternalrProps) {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const userRole = user?.role;

  // open modal
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  // internal values
  const [internalTargetCode, setInternalTargetCode] = useState("");
  const [internalMetric, setInternalMetric] = useState("");
  const [internalOfficeTarget, setInternalOfficeTarget] = useState("");
  const [internalTargetPerformance, setInternalTargetPerformance] =
    useState("");
  const [internalStatus, setInternalStatus] = useState("");
  const [internalKPI, setInternalKPI] = useState("");
  const [internalActualPerformance, setInternalActualPerformance] =
    useState("");
  const [internalLevelOfAttainment, setInternalLevelOfAttainment] =
    useState("");

  // internal scorecard
  const [internalSavedScorecards, setInternalSavedScorecards] = useState<
    InternalScorecard[]
  >([]);

  // for edit
  const [internalEditID, setInternalEditID] = useState(0);
  const [internalEditMode, setInternalEditMode] =
    useState<InternalScorecard | null>(null);

  const handleInternalCloseModal = () => {
    setInternalModalOpen(false);
    setInternalEditMode(null); // Reset the edit mode
  };

  const calculateInternalLevelOfAttainment = (
    actualInternalPerformance: number,
    targetInternalPerformance: number
  ): string => {
    const levelOfAttainmentInternal =
      (actualInternalPerformance / targetInternalPerformance) * 100;
    return levelOfAttainmentInternal.toFixed(2);
  };

  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchInternalScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/internal/get/${selectedDepartmentId}`
        );
        if (response.ok) {
          const data = await response.json();
          setInternalSavedScorecards(data);
        } else {
          console.warn(`Warning: Received status ${response.status}`);
          setInternalSavedScorecards([]); // Optionally clear scorecards if there’s an error
        }
      } catch (error) {
        console.error("Error fetching internal scorecards:", error);
        setInternalSavedScorecards([]); //Clears scorecards on error
      }
    };

    fetchInternalScorecards();
  }, [selectedDepartmentId]);

  const handleInternalEditScorecard = (scorecard: InternalScorecard) => {
    setInternalTargetCode(scorecard.target_code);
    setInternalMetric(scorecard.metric);
    setInternalOfficeTarget(scorecard.office_target);
    setInternalStatus(scorecard.status);
    setInternalKPI(scorecard.key_performance_indicator);
    setInternalTargetPerformance(scorecard.target_performance);
    setInternalActualPerformance(scorecard.actual_performance);
    setInternalEditMode(scorecard);
    setInternalEditID(scorecard.id);
    setInternalModalOpen(true);
  };

  const handleInternalUpdateScorecard = async () => {
    if (!internalEditMode) return;

    const updatedScorecard: InternalScorecard = {
      ...internalEditMode,
      target_code: internalTargetCode,
      metric: internalMetric,
      office_target: internalOfficeTarget,
      status: internalStatus,
      key_performance_indicator: internalKPI,
      target_performance: internalTargetPerformance,
      actual_performance: internalActualPerformance,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/internal/update/${internalEditID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedScorecard),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update internal scorecard");
      }

      // Update the state with the updated scorecard
      const updatedScorecards = internalSavedScorecards.map((scorecard) =>
        scorecard.id === internalEditID ? updatedScorecard : scorecard
      );
      setInternalSavedScorecards(updatedScorecards);
      toast.success("Internal scorecard updated successfully");
      handleInternalCloseModal();
    } catch (error) {
      console.error("Error updating internal scorecard:", error);
      toast.error("Error updating internal scorecard");
    }
  };
  return (
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
                Internal Process Scorecard Overview
              </span>
              <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                Assesses the efficiency and quality of internal operations.
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row p-4 bg-[#fff6d1] text-[rgb(43,43,43)] ">
          <div className="w-[10rem] flex items-center font-bold">
            Target Code
          </div>
          <div className="w-[25rem] flex items-center font-bold mr-10">
            Internal Office Target
          </div>
          <div className="w-[10rem] flex items-center font-bold">Metric</div>
          <div className="w-[18rem] flex items-center font-bold">
            Target Performance
          </div>
          <div className="w-[13rem] flex items-center font-bold">
            Attainment
          </div>
          <div className="w-[10rem] flex items-center font-bold">Status</div>
        </div>
      </div>
      <div className="bg-[#ffffff] gap-2 w-[100%] h-[auto] flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg overflow-y-auto overflow-x-hidden">
        {internalSavedScorecards &&
          internalSavedScorecards.length > 0 &&
          internalSavedScorecards.map((scorecard, index) => {
            if (!scorecard) return null;
            const levelOfAttainment = calculateInternalLevelOfAttainment(
              parseFloat(scorecard.actual_performance),
              parseFloat(scorecard.target_performance)
            );

            // Validate the level of attainment to be between 1 and 100
            const validatedLevelOfAttainment = Math.min(
              Math.max(parseFloat(levelOfAttainment), 1),
              100
            );

            return (
              <div className="flex flex-col w-auto h-auto text-[rgb(43,43,43)]">
                <div
                  key={index}
                  className={`flex flex-row p-4 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#fff6d1]"
                  }`}
                >
                  <div className="flex flex-row w-full">
                    <div className="w-[10rem] flex items-center">
                      <span className="font-semibold text-gray-500">
                        {scorecard.target_code || "N/A"}:
                      </span>
                    </div>

                    <div className="w-[25.5rem] mr-10 flex items-center ">
                      <span className="font-semibold">
                        {scorecard.office_target || "N/A"}
                      </span>
                    </div>

                    <div className="w-[13rem] flex items-center ">
                      <span className="font-semibold ">
                        {scorecard.metric || "N/A"}
                      </span>
                    </div>

                    <div className="w-[16rem] flex items-center">
                      <div className={"font-semibold"}>
                        {scorecard.metric === "Percentage"
                          ? `${scorecard.target_performance}%`
                          : scorecard.target_performance || "N/A"}
                      </div>
                    </div>

                    <div className="w-[10rem] flex items-center ">
                      <span className="font-semibold">
                        {validatedLevelOfAttainment || "N/A"}%
                      </span>
                    </div>

                    <div className="w-[8rem] flex items-center text-center">
                      <div className="font-semibold border rounded-lg bg-yellow-200 border-yellow-500 p-2 w-[10rem]">
                        {scorecard.status || "N/A"}
                      </div>
                    </div>

                    <div className="w-[5rem] flex items-center justify-end text-orange-700">
                      <button
                        onClick={() => handleInternalEditScorecard(scorecard)}
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {internalModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-10 h-[50rem] w-[96rem]">
            <div className="flex flex-row">
              <h2 className="text-2xl mb-10 font-semibold">Internal</h2>
              <button
                onClick={handleInternalCloseModal}
                className="ml-[86rem] mt-[-5rem] text-gray-500 hover:text-gray-700"
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
            <div className="flex flex-row gap-32 mb-10">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Code
                </span>
                <input
                  type="text"
                  value={internalTargetCode}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[25rem]"
                  onChange={(e) => setInternalTargetCode(e.target.value)}
                  disabled={userRole === "qualityAssurance"}
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Metric / Unit of Measure
                </span>
                <select
                  value={internalMetric || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[25rem]"
                  onChange={(e) => setInternalMetric(e.target.value)}
                  disabled={userRole === "qualityAssurance"}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Count">Count</option>
                  <option value="Rating">Rating</option>
                  <option value="Score">Score</option>
                  <option value="Succession Plan">Succession Plan</option>
                </select>
              </div>
            </div>
            <span className="mr-3 break-words font-regular text-md text-[#000000] mt-10">
              Office Target
            </span>
            <textarea
              value={internalOfficeTarget}
              className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-lg w-[91rem] h-[10rem]"
              onChange={(e) => setInternalOfficeTarget(e.target.value)}
              disabled={userRole === "qualityAssurance"}
            />
            <div className=" mt-10 flex flex-row gap-36">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Status
                </span>
                {userRole === "qualityAssurance" && (
                  <>
                    <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                      Note: This is the only field you are allowed to edit.
                    </span>
                  </>
                )}
                <select
                  value={internalStatus || ""}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  onChange={(e) => setInternalStatus(e.target.value)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Not Achieved">Not Achieved</option>
                  <option value="Achieved">Achieved</option>
                </select>
              </div>
              {/* add KPI here */}
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Key Performance Indicator
                </span>
                <input
                  type="text"
                  value={internalKPI}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  onChange={(e) => setInternalKPI(e.target.value)}
                  disabled={userRole === "qualityAssurance"}
                />
              </div>
            </div>
            <div className=" mt-10 flex flex-row gap-36">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Performance
                </span>
                {internalMetric === "Percentage" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {internalMetric === "Count" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {internalMetric === "Rating" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {internalMetric === "Score" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {internalMetric === "Succession Plan" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter a numeric value to represent the status of the
                    succession plan. Ensure the value accurately reflects
                    readiness or progress.
                  </span>
                )}
                <input
                  type="number"
                  value={internalTargetPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  onChange={(e) => {
                    const maxLimit =
                      internalMetric === "Percentage"
                        ? 100
                        : internalMetric === "Rating"
                        ? 10
                        : internalMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      internalMetric === "Rating" ||
                      internalMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setInternalTargetPerformance(value.toString());
                  }}
                  disabled={userRole === "qualityAssurance"}
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Actual Performance
                </span>
                {internalMetric === "Percentage" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter the actual performance as a percentage without
                    including the &apos;%&apos; symbol.
                  </span>
                )}
                {internalMetric === "Count" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter a whole number (e.g., 10).
                  </span>
                )}
                {internalMetric === "Rating" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter a number from 1 to 5, allowing one decimal
                    point (e.g., 3.5).
                  </span>
                )}
                {internalMetric === "Score" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter a score from 1 to 10, allowing one decimal
                    point (e.g., 7.5).
                  </span>
                )}
                {internalMetric === "Succession Plan" && (
                  <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                    Please enter a numeric value to represent the status of the
                    succession plan. Ensure the value accurately reflects
                    readiness or progress.
                  </span>
                )}
                <input
                  type="number"
                  value={internalActualPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  onChange={(e) => {
                    const maxLimit =
                      internalMetric === "Percentage"
                        ? 100
                        : internalMetric === "Rating"
                        ? 10
                        : internalMetric === "Score"
                        ? 20
                        : 1000;

                    let value = parseFloat(e.target.value);

                    // Apply min/max limits for all metrics
                    value = Math.min(value, maxLimit);

                    if (
                      internalMetric === "Rating" ||
                      internalMetric === "Score"
                    ) {
                      value = Math.min(value, maxLimit);
                      value = Math.ceil(value * 10) / 10; // Rounds up to the nearest tenth
                    }

                    setInternalActualPerformance(value.toString());
                  }}
                  disabled={userRole === "qualityAssurance"}
                />
              </div>
            </div>
            <div className="flex flex-row justify-center mt-10 gap-10">
              <button
                onClick={handleInternalCloseModal}
                className="bg-[#ffffff] text-[#962203] font-semibold hover:bg-[#AB3510] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
              >
                Cancel
              </button>
              <button
                onClick={handleInternalUpdateScorecard}
                className="text-[#ffffff] font-semibold px-4 py-2 mt-4 rounded-lg w-40"
                style={{
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                }}
              >
                {internalEditMode ? "Edit" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
