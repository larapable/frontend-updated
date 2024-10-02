"use client";
import Link from "next/link";
import { TiLocationArrowOutline } from "react-icons/ti";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react";

interface Department {
  id: number;
  department_name: string;
  head_officer: string;
};


export default function Navbar() {

  const { data: session, update } = useSession();
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  let department_id = user?.department_id;
  const head = user?.head;
  

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

//   const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   const selectedDeptId = parseInt(e.target.value, 10);
//   setSelectedDepartmentId(selectedDeptId);

//   update({department_id: selectedDeptId});
// };
// const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   const selectedDeptId = parseInt(e.target.value, 10);
//   if (selectedDeptId !== department_id) {
//     setSelectedDepartmentId(selectedDeptId);
//   }
// };

const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedDeptId = parseInt(e.target.value, 10);
  setSelectedDepartmentId(selectedDeptId);
console.log('newid'+selectedDeptId);
  const updateUser = {
    ...session,
    user: {
      ...session?.user,
      department_id: selectedDeptId,
    },
  };
console.log('testsetsetse');
  await update(updateUser);

  console.log('updatesesh'+JSON.stringify(session));

  // try {
  //   const response = await fetch('/api/updatesession', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ department_id: selectedDeptId }),
  //   });

  //   if (response.ok) {
  //     const updatedSession = await response.json();

  //     console.log('Session updated successfully', updatedSession);
  //   } else {
  //     console.error('Failed to update session', response.statusText);
  //   }
  // } catch (error) {
  //   console.error('Error updating session:', error);
  // }
};

  const [heads, setHeads] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch(
        "http://localhost:8080/department/getAllDepartments"
      );
      const data = await res.json();
      setDepartments(data.departments);
    };

    fetchDepartments();
  }, []);
  
  useEffect(() => {
    const fetchHeadDepartments = async () => {
      const res = await fetch(
        "http://localhost:8080/department/getAllDepartmentsHead"
      );
      const data = await res.json();
      setHeads(data.departmentsHead);
      // console.log(data);
    };

    fetchHeadDepartments();
  }, []);


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
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
  
      <Link href="/profile">
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
      <Link href="/inputgoals">
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
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>

          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Goal Settings
          </div>
        </div>
      </Link>
      <Link href="/swot">
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
              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            SWOT Matrix
          </div>
        </div>
      </Link>
      <Link href="/stratmap">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <TiLocationArrowOutline className="w-8 h-8" />

          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Strat Mapping
          </div>
        </div>
      </Link>
      <Link href="/scorecard">
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
      <Link href="/feedback">
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
              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" 
              />
        </svg>

          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Feedback
          </div>
        </div>
      </Link>
      <div className="w-[18rem] border-t border-white mb-5"></div>

      {/* {added component for multiple department} */}
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300"
          onClick={toggleDropdown}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
           
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Department
          </div>
          {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-[16rem] bg-white rounded-md shadow-lg z-10">
                      <select
              className="w-full p-2 border rounded-md"
              value={selectedDepartmentId || ""}
              onChange={handleDepartmentChange}
            >
               {selectedDepartmentId && departments.length > 0 && (
        <option value={selectedDepartmentId}>
          {
            departments.find(
              (department) => department.id === selectedDepartmentId
            )?.department_name
          }
        </option>
      )}
               {departments &&
                departments
                  .filter((department: Department) => department.head_officer === head)
                  .map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.department_name}
                    </option>
                  ))}
              </select>


          {/* Add more department options as needed */}
        </div>
      )}
        </div>

        
    

      <div className="flex flex-row text-white mx-3 hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300 items-center border-[0.1rem] border-solid border-transparent rounded-lg mb-3 px-3 h-14 "
        onClick={() => signOut({ callbackUrl: '/login' })}>
        
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
