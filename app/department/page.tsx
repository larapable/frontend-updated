"use client";

import { useState } from "react";

export default function Department() {
  // State variables for each input field
  const [departmentName, setDepartmentName] = useState('');
  const [headOfficer, setHeadOfficer] = useState('');
  const [departmentLandline, setDepartmentLandline] = useState('');
  const [location, setLocation] = useState('');
  const [university, setUniversity] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  // Event handlers to update state on input change
  const handleDepartmentNameChange = (e: any) => setDepartmentName(e.target.value);
  const handleHeadOfficerChange = (e: any) => setHeadOfficer(e.target.value);
  const handleDepartmentLandlineChange = (e: any) => setDepartmentLandline(e.target.value);
  const handleLocationChange = (e: any) => setLocation(e.target.value);
  const handleUniversityChange = (e: any) => setUniversity(e.target.value);
  const handleDescriptionChange = (e: any) => setDescription(e.target.value);
  const handleEmailChange = (e: any) => setEmail(e.target.value);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Check if any required fields are empty
    if (!departmentName || !headOfficer || !departmentLandline || !location || !university || !description || !email) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        // Send a POST request to the API endpoint
        const response = await fetch("http://localhost:8080/department/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
        });

        if (!response.ok) {
            // Handle non-successful responses
            const errorMessage = await response.text(); // Get error message from response
            throw new Error(errorMessage || 'Failed to register department.'); // Throw an error with the error message or a generic message
        }

        // Request was successful, clear the input fields
        setDepartmentName('');
        setHeadOfficer('');
        setDepartmentLandline('');
        setLocation('');
        setUniversity('');
        setDescription('');
        setEmail('');

        alert('Department registered successfully!');
    } catch (error) {
        // Handle network errors and other exceptions
        console.error('Error:', error);
        alert('An error occurred while registering the department. Please try again later.');
    }
};

  return (
    <>
      <h1 className="text-3xl font-bold underline mb-4">Register Department</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="departmentName" className="mb-1">Department Name:</label>
          <input
            type="text"
            id="departmentName"
            value={departmentName}
            onChange={handleDepartmentNameChange}
            className="border p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="headOfficer" className="mb-1">Head Officer:</label>
          <input
            type="text"
            id="headOfficer"
            value={headOfficer}
            onChange={handleHeadOfficerChange}
            className="border p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="departmentLandline" className="mb-1">Department Landline:</label>
          <input
            type="text"
            id="departmentLandline"
            value={departmentLandline}
            onChange={handleDepartmentLandlineChange}
            className="border p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="mb-1">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={handleLocationChange}
            className="border p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="university" className="mb-1">University:</label>
          <input
            type="text"
            id="university"
            value={university}
            onChange={handleUniversityChange}
            className="border p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="border p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1">Email (Make sure to type an active email):</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="border p-2"
          />
        </div>
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Save
        </button>
      </form>
      <div className="mt-4">
        <p>Click to singup <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a></p>
      </div>
    </>
  );
}
