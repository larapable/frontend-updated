"use client";
import { useState } from "react";
import { Button, Card, Modal } from "@mui/material";

export default function RegisterDepartment() {
  const [departmentName, setDepartmentName] = useState("");
  const [headOfficer, setHeadOfficer] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleDepartmentNameChange = (e: any) =>
    setDepartmentName(e.target.value);
  const handleHeadOfficerChange = (e: any) => setHeadOfficer(e.target.value);
  const handleDepartmentLandlineChange = (e: any) =>
    setDepartmentLandline(e.target.value);
  const handleLocationChange = (e: any) => setLocation(e.target.value);
  const handleUniversityChange = (e: any) => setUniversity(e.target.value);
  const handleDescriptionChange = (e: any) => setDescription(e.target.value);
  const handleEmailChange = (e: any) => setEmail(e.target.value);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !departmentName ||
      !headOfficer ||
      !departmentLandline ||
      !location ||
      !university ||
      !description ||
      !email
    ) {
      // alert("Please fill in all required fields.");
      setModalMessage('Please fill in all required fields.');
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/department/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department_name: departmentName,
            head_officer: headOfficer,
            department_landline: departmentLandline,
            location: location,
            university: university,
            description: description,
            email: email,
          }),
        }
      );

      if (!response.ok) {
        // Handle non-successful responses
        const errorMessage = await response.text(); 
        throw new Error(errorMessage || "Failed to register department."); 
      }
      setDepartmentName("");
      setHeadOfficer("");
      setDepartmentLandline("");
      setLocation("");
      setUniversity("");
      setDescription("");
      setEmail("");

      // alert("Department registered successfully!");
      setModalMessage('Department registered successfully!');
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
      // alert(
      //   "An error occurred while registering the department. Please try again later."
      // );
      setModalMessage('An error occurred while registering the department. Please try again later.');
      setShowModal(true);
    }
  };

  const handleCancelSave = () => {
    setShowModal(false);
  };

  return (
    <div className="text-[rgb(59,59,59)]">
        <div className="flex flex-col justify-center items-center text-center">
            <span className="mt-5 inline-block break-words font-bold text-[3rem]">Register Department</span>
            <span className="text-[1.3rem]">Enter the details to get going</span>

            {/* indicator */}
            <div className="w-full max-w-3xl mx-auto px-4 py-6 mt-5 mb-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#c7360a] rounded-full flex items-center justify-center">
                      <span className="font-semibold text-white">1</span>
                    </div>
                    <span className="mt-2 text-sm font-medium">Information</span>
                  </div>
                  <div className="w-[15rem] h-2 bg-[#c7360a] mt-[-1rem] ml-[-0.6rem]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#c7360a] rounded-full flex items-center justify-center ml-[-1rem]">
                        <span className="font-semibold text-white">2</span>
                    </div>
                    <span className="mt-2 text-sm font-medium">Contact</span>
                  </div>
                  <div className="w-[15rem] h-2 bg-[#c7360a] mt-[-1rem] ml-[-0.6rem]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#c7360a] rounded-full flex items-center justify-center ml-[-1rem]">
                        <span className="font-semibold text-white">3</span>
                    </div>
                    <span className="mt-2 text-sm font-medium">Details</span>
                  </div>
                </div>
              </div>
            {/* end */}

            <div className="ml-[-40rem] bg-[#A43214] text-white border border-none text-[1.2rem] font-semibold text-center items-center rounded-lg px-5 py-2">
                Information
            </div>
        
            <Card className="flex align-center rounded-lg border border-gray-200 justify-between py-14 px-10 bg-white h-[auto] w-[50rem] mt-[-0.5rem]">
            <div className="flex flex-col">
            <div className="flex flex-col mt-[-1rem]">
                <span className="self-start mb-2 break-words font-regular text-md">
                    Department Name
                    <span className="text-[#DD1414]">*</span>
                </span>
                <input
                    type="text"
                    id="departmentName"
                    value={departmentName}
                    onChange={handleDepartmentNameChange}
                    className="border-[0.1rem] self-start border-solid border-gray-400 border-opacity-60 rounded-lg w-[44rem] flex items-center mb-6 py-2 px-2"
                />
            </div>
            <div className="flex flex-row gap-16">
            <div className="flex flex-col">
                <span className="self-start mb-2 break-words font-regular text-md">
                    University
                    <span className="text-[#DD1414]">*</span>
                </span>
                <input
                    type="text"
                    id="university"
                    value={university}
                    onChange={handleUniversityChange}
                    className="border-[0.1rem] self-start border-solid border-gray-400 border-opacity-60 rounded-lg w-[20rem] flex items-center py-2 px-2"
                />
            </div>
            <div className="flex flex-col">
                <span className="self-start mb-2 break-words font-regular text-md">
                    Location
                    <span className="text-[#DD1414]">*</span>
                </span>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={handleLocationChange}
                    className="border-[0.1rem] self-start border-solid border-gray-400 border-opacity-60 rounded-lg w-[20rem] flex items-center py-2 px-2"
                />
            </div>
            </div>
            </div>
            </Card>

            <div className="ml-[-42rem] bg-[#A43214] text-white border border-none text-[1.2rem] mt-5 font-semibold text-center items-center rounded-lg px-5 py-2">
                Contact
            </div>
        
            <Card className="flex align-center rounded-lg border border-gray-200 justify-between py-14 px-10 bg-white h-[auto] w-[50rem] mt-[-0.5rem]">
            <div className="flex flex-col">
            <div className="flex flex-col mt-[-1rem]">
                <span className="self-start mb-2 break-words font-regular text-md">
                    Head Officer
                    <span className="text-[#DD1414]">*</span>
                </span>
                <input
                    type="text"
                    id="headOfficer"
                    value={headOfficer}
                    onChange={handleHeadOfficerChange}
                    className="border-[0.1rem] self-start border-solid border-gray-400 border-opacity-60 rounded-lg w-[44rem] flex items-center mb-6 py-2 px-2"
                />
            </div>
            <div className="flex flex-row gap-16">
            <div className="flex flex-col">
                <span className="self-start mb-2 break-words font-regular text-md">
                    Department Landline
                    <span className="text-[#DD1414]">*</span>
                </span>
                <input
                    type="text"
                    id="departmentLandline"
                    value={departmentLandline}
                    onChange={handleDepartmentLandlineChange}
                    className="border-[0.1rem] self-start border-solid border-gray-400 border-opacity-60 rounded-lg w-[20rem] flex items-center py-2 px-2"
                />
            </div>
            <div className="flex flex-col">
                <span className="self-start mb-2 break-words font-regular text-md">
                    Email
                    <span className="text-[#DD1414]">*</span>
                </span>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="border-[0.1rem] self-start border-solid border-gray-400 border-opacity-60 rounded-lg w-[20rem] flex items-center py-2 px-2"
                />
            </div>
            </div>
            </div>
            </Card>

            <div className="ml-[-42.5rem] bg-[#A43214] text-white border border-none text-[1.2rem] mt-5 font-semibold text-center items-center rounded-lg px-5 py-2">
                Details
            </div>
        
            <Card className="flex align-center rounded-lg border border-gray-200 justify-between py-14 px-10 bg-white h-[auto] w-[50rem] mt-[-0.5rem] mb-10">
            <div className="flex flex-col">
            <div className="flex flex-col mt-[-1rem]">
                <span className="self-start mb-2 break-words font-regular text-md">
                    Description
                    <span className="text-[#DD1414]">*</span>
                </span>
                <textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="border-[0.1rem] self-start border-solid border-gray-400 border-opacity-60 rounded-lg w-[44rem] h-[7rem] flex items-center py-2 px-2"
                />
            </div>
            </div>
            </Card>

            <button
                className="rounded-lg text-white font-bold text-xl w-[38rem] px-12 py-5 border[0.1rem] border-white hover:text-[#f3deb0] mb-10"
                style={{
                    backgroundImage: `url('bgimagemaroon.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
                onClick={handleSubmit}
                >
                Register
            </button>

            {/* Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
              <button
                onClick={handleCancelSave}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
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
              <p className="text-3xl font-bold mb-4">Notice!</p>
              <p className="text-xl mb-4 mt-10">
                {modalMessage}
              </p>
              <div className="flex justify-center gap-10 mt-12 mb-10">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-[0.6rem] text-[#ffffff] font-medium text-lg py-2 px-3 w-36 h-[fit-content]"
                  style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>


        </div>
    </div>
  );
}
