"use client";
import { Button, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QANavbar from "../../components/QANavbar";
import SpinnerPages from "../../components/SpinnerPages";
import { getSession, useSession } from "next-auth/react";

interface Department {
  id: number;
  department_name: string;
  head_officer: string;
  university: string;
  email: string;
  location: string;
  department_landline: string;
  description: string;
  image: string;
}

export default function DepartmentProfile() {
  const params = useParams(); // Get the parameters from the URL
  const department_id = params.id; // Get the dynamic id from the params
  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/department/${department_id}`,
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
        console.log("Response data:", data);
        setDepartment(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching department:", error);
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [department_id]);

  if (isLoading) {
    return <SpinnerPages />;
  }

  if (!department) {
    return <div>Department not found</div>;
  }

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex">
        <QANavbar />
      </div>
      <div className="flex-1">
        <div className="flex-1 flex flex-col mt-3 ml-80">
        <div className="flex flex-col gap-5">
            <div className="flex flex-row">
                <div className="flex flex-col">
                <div className="mb-5 mt-[1.1rem] break-words font-bold text-[3rem] text-[rgb(59,59,59)]">
                    PROFILE
                </div>
                </div>
            </div>
            <span className="break-words font font-normal text-[1.3rem] text-[#504C4C] mt-[-1rem] mb-5">
                The Profile section enables users to access comprehensive information
                about their department as well as their personal data. This centralized
                hub ensures easy retrieval of essential details, enhancing user
                experience and organizational transparency within the Atlas system.
            </span>

                <Card className="h-[auto] w-[98%] flex flex-col items-center rounded-xl bg-white shadow-xl border border-gray-150 mb-10 mr-6">
                <div className="w-[100%]">
                    <img
                    src="/coverbg.png"
                    alt=""
                    className=" h-[12rem] w-[100%] bg-white object-cover"
                    />
                </div>
                <div className="mt-[-8rem] text-center justify-center items-center bg-center snap-center self-center">
                    {department.image ? (
                    <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 flex items-center justify-center overflow-hidden">
                        <img
                        src={department.image}
                        alt="Department Image"
                        className=" w-full h-full object-cover"
                        />
                    </div>
                    ) : (
                    <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 py-4 flex items-center justify-center">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-24 h-24 text-gray-500"
                        >
                        <path
                            fillRule="evenodd"
                            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                            clipRule="evenodd"
                        />
                        </svg>
                    </div>
                    )}
                    </div>
                    <div className="mt-1 mb-2 items-center justify-center text-center">
                    <div className="text-4xl font-bold mt-5 mb-2 text-[rgb(59,59,59)]">{department.department_name}</div>
                    <span className="text-lg font-normal text-[rgb(158,157,157)]">
                        Department Name
                    </span>
                    </div>
               
                <div className="w-[80rem] h-[100%] shadow-lg border border-gray-200 px-10 py-10 mt-8 rounded-xl mb-10">
                    <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[rgb(77,76,76)] mb-5">
                        Basic Information
                    </span>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                        <div className="flex flex-col">
                            <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                            Head Officer
                            </span>
                            <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                            {department.head_officer}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                            University
                            </span>
                            <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                            {department.university}
                            </div>
                        </div>
                        </div>
                        <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                        <div className="flex flex-col">
                            <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                            Email
                            </span>
                            <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                            {department.email}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                            Location
                            </span>
                            <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                            {department.location}
                            </div>
                        </div>
                        </div>
                        <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                        <div className="flex flex-col">
                            <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                            Landline
                            </span>
                            <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                            {department.department_landline}
                            </div>
                        </div>
                        </div>
                    </div>

                    <span className="text-2xl font-bold text-[rgb(77,76,76)] mt-10 mb-5">
                        About Department
                    </span>
                    <div className="border border-gray-200 bg-gray-100 w-auto h-36 rounded-md">
                        <div className="text-xl h-32 font-medium py-1 px-2 overflow-y-auto break-words">
                        {department.description}
                        </div>
                    </div>
                    </div>
                </div>
                </Card>
                
            </div>
        </div>
      </div>
    </div>
  );
}
