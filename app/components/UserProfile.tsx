import { Button, Card } from "@mui/material";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import EditProfile from "../profile/edit/page";
import Email from "next-auth/providers/email";
import Link from "next/link";

export default function UserProfile() {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [image, setImage] = useState("");

  const [department, setDepartment] = useState("");
  const [headOfficer, setHeadOfficer] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const [departmentDescription, setDepartmentDescription] =
    useState("---Description---");
  const [officeVision, setOfficeVision] = useState("---Set Office Vision---");
  const [valueProposition, setValueProposition] = useState(
    "---Set Value Proposition---"
  );
  const [strategicGoals, setStrategicGoals] = useState(
    "---Set Strategic Goals1---"
  );
  const [strategicGoals2, setStrategicGoals2] = useState(
    "---Set Strategic Goals2---"
  );
  const [strategicGoals3, setStrategicGoals3] = useState(
    "---Set Strategic Goals3---"
  );

  const department_id = user?.department_id;
  console.log("User Parsed: ", user);
  const username = user?.username;
  const email = user?.email;

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/department/${department_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data); // Add this line to log the received data
          setDepartment(data.department_name);
          setHeadOfficer(data.head_officer);
          setDepartmentLandline(data.department_landline);
          setLocation(data.location);
          setUniversity(data.university);
          setDepartmentDescription(data.description);
        } else {
          console.error(
            "Error fetching user profile data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };
    fetchUserProfileData();
  }, [department_id]);

  useEffect(() => {
    const fetchProfileGoals = async () => {
      try {
        const response = await fetch(`http://localhost:8080/goals/get/${department_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data); // Add this line to log the received data
          setOfficeVision(data.vision);
          setValueProposition(data.proposition);
          setStrategicGoals(data.goals);
          setStrategicGoals2(data.goals2);
          setStrategicGoals3(data.goals3);
        } else {
          console.error(
            "Error fetching user profile data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };
    fetchProfileGoals();
  }, [department_id]);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/image/getImage/${department_id}`);
        if (response.ok) {
          const { imageData, imageFormat } = await response.json();
          console.log(
            "Received image data:",
            imageData,
            "Image format:",
            imageFormat
          );

          // Check that imageData and imageFormat are correct
          if (!imageData || !imageFormat) {
            console.error(
              "Invalid image data or format:",
              imageData,
              imageFormat
            );
            return;
          }

          // Create a data URL for the image
          const image = `data:image/${imageFormat};base64,${imageData}`;

          // Set the image URL
          setImage(image);

          // Log the image URL
          console.log("Image URL:", image);
        } else {
          console.error("Error fetching image data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image data:", error);
      }
    };
    fetchImageData();
  }, [department_id]);

  return (
    <div className="flex flex-row">
      <Card className="w-[25rem] h-[56.5rem] flex flex-col items-center justify-center rounded-xl bg-white shadow-xl">
        {/* Conditionally render the image or the profile icon */}
        {image ? (
          <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 flex items-center justify-center mt-[-2rem] overflow-hidden">
            <img
              src={image}
              alt="Department Image"
              className=" w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 py-4 flex items-center justify-center mt-[-2rem]">
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
        <span className="text-lg font-normal mb-4">Department</span>
        <div className="text-4xl font-bold text-center mb-4">{department}</div>
        <div className="flex flex-col w-[21rem] h-80 bg-white rounded-md p-4">
          {/* Render department details */}
          {/* Username */}
          <div className="flex items-center justify-center w-fit mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-gray-500 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs font-normal">Username</span>
              <span className="text-lg font-bold">{username}</span>
            </div>
          </div>
          {/* Email */}
          <div className="flex items-center justify-center w-fit mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-gray-500 mr-2 "
            >
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs font-normal">Email</span>
              <span className="text-lg font-bold">{email}</span>
            </div>
          </div>
          {/* Head Officer */}
          <div className="flex items-center justify-center w-fit mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-gray-500 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs font-normal">Head Officer</span>
              <span className="text-lg font-bold">{headOfficer}</span>
            </div>
          </div>
          {/* Department Landline */}
          <div className="flex items-center justify-center w-fit mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-gray-500 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs font-normal">Department Landline</span>
              <span className="text-lg font-bold">{departmentLandline}</span>
            </div>
          </div>
          {/* Location */}
          <div className="flex items-center justify-center w-fit mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-gray-500 mr-2"
            >
              <path
                fillRule="evenodd"
                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs font-normal">Location</span>
              <span className="text-lg font-bold">{location}</span>
            </div>
          </div>
          {/* University */}
          <div className="flex items-center justify-center w-fit mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-gray-500 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs font-normal">University</span>
              <span className="text-lg font-bold">{university}</span>
            </div>
          </div>
        </div>
        {/* Edit Button */}
        <Button
          href="/profile/edit"
          className="rounded-[0.6rem] bg-[#FAD655] text-[#8A252C] font-semibold text-lg py-2 px-3 w-36 h-[fit-content] mt-28 hover:bg-[#8a252c] hover:text-[#ffffff]"
        >
          Edit
        </Button>
      </Card>

      {/* ABOUT DEPARTMENT */}
      <div className="flex flex-col gap-6">
        {/* Department Description */}
        <Card className="w-[69rem] h-64 flex flex-col rounded-xl ml-10 pb-3 shadow-xl">
          <div className="flex flex-row self-start gap-[45rem]">
            <div className="text-2xl font-bold text-center self-start mx-10 mt-10 mb-5 text-[#5c5b5b]">
              About Department
            </div>
          </div>
          <div className="bg-[#CBC3C3] left-[0rem] top-[2.3rem] right-[0rem] h-[0.1rem]"></div>
          <div className="text-xl mx-12 h-32 mt-5 font-semibold overflow-y-auto">
            {departmentDescription}
          </div>
        </Card>
        {/* Office Vision */}
        <Card className="w-[69rem] h-40 flex flex-col rounded-xl ml-10  pb-3 shadow-xl">
          <span className="text-2xl font-bold mx-10 mt-3 mb-3 text-[#5c5b5b]">
            Office Vision
          </span>
          <div className="bg-[#CBC3C3] left-[0rem] top-[2.3rem] right-[0rem] h-[0.1rem]"></div>
          <div className="mx-10 overflow-auto">
            <div className="text-lg font-normal mx-5 mb-2 flex flex-row">
              <div className="whitespace-normal break-words pt-3 font-medium">
                {officeVision}
              </div>
            </div>
          </div>
        </Card>
        {/* Value Proposition */}
        <Card className="w-[69rem] h-40 flex flex-col rounded-xl ml-10  pb-3 shadow-xl">
          <span className="text-2xl font-bold mx-10 mt-3 mb-3 text-[#5c5b5b]">
            Value Proposition
          </span>
          <div className="bg-[#CBC3C3] left-[0rem] top-[2.3rem] right-[0rem] h-[0.1rem]"></div>
          <div className="mx-10 overflow-auto">
            <div className="text-lg font-normal mx-5 mb-2 flex flex-row">
              <div className="whitespace-normal break-words pt-3 font-medium">
                {valueProposition}
              </div>
            </div>
          </div>
        </Card>

        {/* Strategic Goals */}
        <Card className="w-[69rem] h-[16rem] flex flex-col rounded-xl ml-10 pb-3 shadow-xl">
          <span className="text-2xl font-bold mx-10 mt-3 mb-3 text-[#5c5b5b]">
            Strategic Goals
          </span>
          <div className="bg-[#CBC3C3] left-[0rem] top-[2.3rem] right-[0rem] h-[0.1rem]"></div>
          <div className="mx-10 overflow-auto">
            {/* Individual strategic goals */}
            <div className="mx-5 mb-2 flex flex-col">
              <div className="flex items-center bg-[#f5f5f5] rounded-lg shadow-md p-3 mb-2 mt-2">
                <span className="rounded-full bg-yellow-400 text-white font-bold px-2 py-1 mr-2">
                  1
                </span>
                <div className="whitespace-normal break-words font-medium">
                  {strategicGoals}
                </div>
              </div>

              <div className="flex items-center bg-[#f5f5f5] rounded-lg shadow-md p-3 mb-2">
                <span className="rounded-full bg-red-500 text-white font-bold px-2 py-1 mr-2">
                  2
                </span>
                <div className="whitespace-normal break-words font-medium">
                  {strategicGoals2}
                </div>
              </div>
              <div className="flex items-center bg-[#f5f5f5] rounded-lg shadow-md p-3 mb-2">
                <span className="rounded-full bg-orange-500 text-white font-bold px-2 py-1 mr-2">
                  3
                </span>
                <div className="whitespace-normal break-words font-medium">
                  {strategicGoals3}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
