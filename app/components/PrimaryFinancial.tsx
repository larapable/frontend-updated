"use client";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";

interface PrimaryFinancialScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}

export default function PrimaryFinancial() {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const department_id = user?.department_id;
  // open modal
  const [primaryModalOpen, setPrimaryModalOpen] = useState(false);

  // primary financial values
  const [primaryTargetCode, setPrimaryTargetCode] = useState("");
  const [primaryMetric, setPrimaryMetric] = useState("");
  const [primaryOfficeTarget, setPrimaryOfficeTarget] = useState("");
  const [primaryStatus, setPrimaryStatus] = useState("");
  const [primaryKPI, setPrimaryKPI] = useState("");
  const [primaryTargetPerformance, setPrimaryTargetPerformance] = useState("");
  const [primaryActualPerformance, setPrimaryActualPerformance] = useState("");

  // primary financial scorecard
  const [primaryFinancialScorecard, setPrimaryFinancialScorecard] = useState<
    PrimaryFinancialScorecard[]
  >([]);

  // for edit
  const [primaryEditId, setPrimaryEditId] = useState(0);
  const [primaryEditMode, setPrimaryEditMode] =
    useState<PrimaryFinancialScorecard | null>(null);

  const handleCloseModal = () => {
    setPrimaryModalOpen(false);
    setPrimaryEditMode(null);
  };

  const calculateLevelOfAttainment = (
    actualFinancialPerformance: number,
    targetFinancialPerformance: number
  ): string => {
    const levelOfAttainmentFinancial =
      (actualFinancialPerformance / targetFinancialPerformance) * 100;
    return levelOfAttainmentFinancial.toFixed(2);
  };

  useEffect(() => {
    const fetchPrimaryFinancialScorecard = async () => {
      if (!department_id) {
        console.log("Department ID is not available");
        return;
      }
      console.log(
        "Fetching Primary Financial Scorecard for department ID: ",
        department_id
      );

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryFinancialBsc/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("An error occurred while fetching data");
        }
        const data = await response.json();
        console.log("Primary Financial Scorecard data: ", data);
        setPrimaryFinancialScorecard(data);
      } catch (error) {
        console.error("Error fetching financial scorecards:", error);
      }
    };

    fetchPrimaryFinancialScorecard();
  }, [department_id]);

  return (
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
                Financial Scorecard Overview
              </span>
              <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
                Measures financial performance and profitability.
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row p-4 bg-[#fff6d1] text-[rgb(43,43,43)] ">
          <div className="w-[10rem] flex items-center font-bold">
            Target Code
          </div>
          <div className="w-[25rem] flex items-center font-bold mr-10">
            Financial Office Target
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

      {/* Mapping of Primary Data*/}
      <div className="bg-[#ffffff] gap-2 w-[100%] h-[auto] flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg overflow-y-auto overflow-x-hidden">
        {primaryFinancialScorecard &&
          primaryFinancialScorecard.length > 0 &&
          primaryFinancialScorecard.map((scorecard, index) => {
            if (!scorecard) return null;
            const levelOfAttainment = calculateLevelOfAttainment(
              parseFloat(scorecard.actual_performance),
              parseFloat(scorecard.target_performance)
            );

            const validatedLevelOfAttainment = Math.min(
              Math.max(parseFloat(levelOfAttainment), 1),
              100
            );

            return (
              <div className="relative flex flex-col w-auto h-auto text-[rgb(43,43,43)]">
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
                        {scorecard.target_performance || "N/A"}
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
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
