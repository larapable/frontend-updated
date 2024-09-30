"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { TiLocationArrowOutline } from "react-icons/ti";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function QANavbar() {
  return (
    <div
      className="fixed top-0 left-0 flex flex-col h-screen w-[18rem] py-5 overflow-auto gap-1"
      style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
    >
      <div className="flex items-center justify-center">
        {/* ilisi nig atlasLogo  */}
        <img src="/logo.png" alt="" className=" h-[8rem] mt-3 mb-5 mr-5" />
      </div>
      <div className="w-[18rem] border-t border-white mb-5"></div>

      <Link href="/qaprofileview">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-8 h-8 "
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Profile
          </div>
        </div>
      </Link>
      <Link href="/qastratmapview">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <TiLocationArrowOutline className="w-8 h-8" />

          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Strat Mapping
          </div>
        </div>
      </Link>
      <Link href="/qascorecard">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            B Scorecard
          </div>
        </div>
      </Link>
      <Link href="/reports">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Report Analysis
          </div>
        </div>
      </Link>

      <div className="w-[18rem] border-t border-white mb-5"></div>

      <div
        className="flex flex-row text-white mx-3 hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300 items-center border-[0.1rem] border-solid border-transparent rounded-lg mb-3 px-3 h-14 "
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
        <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
          Logout
        </div>
      </div>
    </div>
  );
}
