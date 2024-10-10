import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";

const TeamsPage = () => {
  return (
    <div className="flex flex-col items-center bg-[#8a252c] lg:w-full lg:ml-[10%] md:w-full hidden lg:flex">
      <img
        className="m-[15rem_1.2rem_2.7rem_-18rem] w-[7rem] h-[5rem]"
        src="team-icon.png"
        alt="Team Icon"
      />
      <div className="m-[-7rem_0.5rem_1rem_15rem] inline-block self-start break-words font-bold text-[2.2rem] text-[#FAD655]">
        Our Team
      </div>
      <div className="m-[2rem_0_2.1rem_0.3rem] inline-block break-words font-medium text-[1.3rem] text-[#FFFFFF]">
        Meet the faces behind ATLAS.
        <br />
        Together, we strive to deliver excellence
        <br />
        and make a positive impact in every <br />
        project we undertake. Get to know us
      </div>
      <Button className="rounded-lg bg-[#FAD655] text-white font-bold text-xl w-[28rem] px-12 py-5 border[0.1rem] border-white mb-4 hover:bg-[#ffffff] hover:text-[#8a252c] mt-5">
        <Link href="/contact">View Contact</Link>
      </Button>

      <div className="flex flex-row items-center">
        <div className="flex-1 bg-[#ffffff] h-0.5 w-[12.3rem]"></div>
        <div className="mx-4 text-bold text-white">or</div>
        <div className="flex-1 bg-[#ffffff] h-0.5 w-[12.3rem]"></div>
      </div>
      <a
        href="/"
        className="text-2xl text-[#ffffff] font-bold lg:mt-4 md:mb-16 hover:underline"
      >
        Back Home
      </a>
    </div>
  );
};

export default TeamsPage;
