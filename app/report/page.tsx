"use client";
import Navbar from "../components/Navbar";
import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useEffect,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import Chart from "chart.js/auto";
import { LinearScale } from "chart.js";
import { useSession } from "next-auth/react";
import FinancialReport from "../components/FinancialReport";
import InternalReport from "../components/InternalReport";
import StakeholderReport from "../components/StakeholderReport";
import LearningReport from "../components/LearningReport";

// Register linear scale with Chart.js
Chart.register(LinearScale);

interface PerspectiveReport {
  title: string;
  date: Date | null;
  description: string;
  objectives: string[];
}

const ReportPage = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  const username = user?.username;

  const [displayBSFinancial, setDisplayBSFinancial] = useState(true);
  const [displayBSStakeholder, setDisplayBSStakeholder] = useState(true);
  const [displayBSInternal, setDisplayBSInternal] = useState(true);
  const [displayBSLearning, setDisplayBSLearning] = useState(true);

  return (
    <div className="flex flex-row w-full">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <div className="mb-5 mt-[0rem] inline-block break-words font-bold text-[3rem] text-[#000000]">
          REPORT
        </div>
        <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10">
          The Report feature empowers you to create comprehensive visualizations
          for every aspect of your business. Gain deeper insights, track
          progress, and make informed decisions with our dynamic reporting
          capabilities. Unleash the power of data visualization to drive your
          business forward.
        </div>
        {/* perspectives toggle */}
        <div className=" flex flex-row self-start box-sizing-border mt-5 mb-5">
          <div
            className="flex flex-row box-sizing-border mr-10"
            onClick={() => setDisplayBSFinancial(true)}
          >
            <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
              FINANCIAL
            </div>
          </div>
          <div
            className="flex flex-row box-sizing-border mr-10"
            onClick={() => {
              setDisplayBSFinancial(false);
              setDisplayBSStakeholder(true);
              setDisplayBSInternal(false);
              setDisplayBSLearning(false);
            }}
          >
            <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
              STAKEHOLDER
            </div>
          </div>
          <div
            className="flex flex-row box-sizing-border mr-10"
            onClick={() => {
              setDisplayBSFinancial(false);
              setDisplayBSStakeholder(false);
              setDisplayBSInternal(true);
              setDisplayBSLearning(false);
            }}
          >
            <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
              INTERNAL PROCESS
            </div>
          </div>
          <div
            className="flex flex-row box-sizing-border"
            onClick={() => {
              setDisplayBSFinancial(false);
              setDisplayBSStakeholder(false);
              setDisplayBSInternal(false);
              setDisplayBSLearning(true);
            }}
          >
            <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
              LEARNING & GROWTH
            </div>
          </div>
        </div>
        {/* end of perspectives toggle */}

        <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-3 pl-3 pb-5 w-[98%] h-[100%] mb-10 rounded-lg">
          {displayBSFinancial ? (
            <FinancialReport />
          ) : !displayBSFinancial &&
            !displayBSStakeholder &&
            !displayBSInternal ? (
            <LearningReport />
          ) : !displayBSFinancial &&
            !displayBSStakeholder &&
            displayBSInternal ? (
            <InternalReport />
          ) : (
            <StakeholderReport />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
