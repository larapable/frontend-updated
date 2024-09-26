import React from 'react'
import { Button, Card } from "@mui/material";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import SpinnerPages from "./SpinnerPages"; 
import Link from "next/link";

interface Department {
    id: number;
    department_name: string;
    head_officer: string;
  }

export default function QADepartmentView() {

//temporary kay wala pamay table nga naa ang role sa qa
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/department/getAllDepartments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        setDepartments(data.departments);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setIsLoading(false); 
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <SpinnerPages />; 
  }

  return (
    <div>
        <div className="flex flex-col text-[rgb(59,59,59)]">
          <div className="mb-5 mt-[1.1rem] break-words font-bold text-[3rem] text-[rgb(59,59,59)]">
            DEPARTMENT LIST
          </div>
          <span className="break-words font font-normal text-[1.3rem] text-[#504C4C] mt-[-1rem] mb-5">
            This page provides an overview of all the departments managed by the Quality Assurance (QA) team. 
            Each department listed is actively involved in processes overseen by <br/> QA. Browse through the list 
            to view detailed profiles for each department, including key information about their role.
          </span>

          <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg mt-10  pb-5">
            <div className="flex flex-row break-words p-4 bg-[#AB3510] text-white ">
                <div className="text-[1.2rem] flex items-center font-bold w-[55%]">
                    Department Name
                </div>
                <div className="text-[1.2rem] flex items-center font-bold w-[36%]">
                    Head Officer
                </div>
                <div className="text-[1.2rem] flex items-center font-bold w-[5%]">
                    Action
                </div>
            </div>

            {departments.map((department, index) => (
                <div key={department.id} className={`flex flex-row p-4 ${index % 2 === 0 ? "bg-white" : "bg-[#fff6d1]"}`}>
                    <div className="text-[1.2rem] flex items-center w-[55%] font-medium text-gray-600">
                        {department.department_name}
                    </div>
                    <div className="text-[1.2rem] flex items-center w-[36%] font-medium text-gray-600">
                        {department.head_officer}
                    </div>

                    <Link href={`/qaprofileview/${department.id}`}> {/* Pass department ID in the URL */}
                        <button 
                            className="text-[#ffffff] font-semibold px-4 py-2 rounded-lg w-20"
                            style={{
                            background: "linear-gradient(to left, #8a252c, #AB3510)",
                            }}
                        >
                            View
                        </button>
                    </Link> 

                </div>
            ))}

          </div>
        </div>


    </div>
  )
}
