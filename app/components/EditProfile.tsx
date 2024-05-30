import { Button, Card, Modal } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";

export default function UserEditProfile() {
  const { data: session, status, update } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [image, setImage] = useState("");
  const [department, setDepartment] = useState("");
  const [headOfficer, setHeadOfficer] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [officeVision, setOfficeVision] = useState("-------- ");
  const [valueProposition, setValueProposition] = useState("--------");
  const [strategicGoals, setStrategicGoals] = useState("--------");
  const [strategicGoals2, setStrategicGoals2] = useState("--------");
  const [strategicGoals3, setStrategicGoals3] = useState("--------");

  const department_id = user?.department_id;
  console.log("Department: ", department_id);

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

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/department/update/${department_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          head_officer: headOfficer,
          department_landline: departmentLandline,
          location: location,
          university: university,
          description: departmentDescription,
          department_id: department_id,
        }),
      });

      if (res.ok) {
        console.log("Edit successful");
        // Route back to /profile
        window.location.href = "/profile";
      } else {
        console.log("User profile failed.");
      }
    } catch (error) {
      console.log("Error during saving user Profile", error);
    }
  };

  const handleConfirmSave = () => {
    setShowModal(true);
  };
  const handleCancelSave = () => {
    setShowModal(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Extract the image format from the file type
      const imageFormat = file.type.split("/")[1];

      const formData = new FormData();
      formData.append("department_id", department_id);
      formData.append("image", file, file.name);
      formData.append("image_format", imageFormat); // Append the image format to the form data

      try {
        // Upload the image to the server
        const response = await fetch("http://localhost:8080/image/insertImage", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Image uploaded successfully
          const result = await response.json();
          if (result.message === "Department image saved successfully.") {
            console.log("Image saved successfully.");
          } else {
            console.error("Failed to save image:", result.message);
          }
        } else {
          // Handle error response
          console.error("Failed to upload image");
        }
      } catch (error) {
        // Handle network error
        console.error("Network error occurred", error);
      }
    }
  };

  return (
    <div className="flex flex-row">
      <Card className="w-[25rem] h-[56.5rem] flex flex-col items-center justify-center rounded-xl bg-white shadow-xl">
        {" "}
        {/* Conditionally render the image or the profile icon */}
        {image ? (
          <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 flex items-center justify-center mt-[-2rem] overflow-hidden">
            <img
              src={image}
              alt="Department Image"
              className="w-full h-full object-cover"
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
        <label htmlFor="imageUpload" className="mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <span className="text-lg font-normal mb-4">Department</span>
        <div className="text-4xl font-bold text-center mb-4">{department}</div>
        <div className="flex flex-col w-[21rem] h-80 mb-10 mr-10">
          <div className=" flex flex-row items-center justify-center w-fit mx-8">
            <div className="flex items-center justify-center w-fit mb-4 ml-[-0.8rem]">
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-normal">Username</span>
              <input
                type="text"
                className=" text-md w-72 font-bold mx-2 border border-gray-300 rounded px-3 py-2 bg-gray-300"
                readOnly
              />
            </div>
          </div>

          <div className=" flex flex-row items-center justify-center w-fit mx-8">
            <div className="flex items-center justify-center w-fit mb-4 ml-[-0.8rem]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-gray-500 mr-2 mb-6"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
            </div>
            <div className="flex flex-col ">
              <span className="text-xs font-normal">Email</span>
              <input
                type="text"
                className=" text-md w-72 font-bold mx-2 border border-gray-300 rounded px-3 py-2 bg-gray-300"
                readOnly
              />
            </div>
          </div>

          <div className=" flex flex-row items-center justify-center w-fit mx-8 mt-3 mb-4">
            <div className="flex items-center justify-center w-fit mb-4 ml-[-0.8rem]">
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-normal">Head Officer</span>
              <input
                type="text"
                value={headOfficer}
                className=" text-md w-72 font-bold mx-2 border border-gray-300 rounded px-3 py-2"
                onChange={(e) => setHeadOfficer(e.target.value)}
              />
            </div>
          </div>

          <div className=" flex flex-row items-center justify-center w-fit mx-8 mb-4">
            <div className="flex items-center justify-center w-fit mb-4 ml-[-0.8rem]">
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
            </div>
            <div className="flex flex-col ">
              <span className="text-xs font-normal">Department Landline</span>

              <input
                type="text"
                value={departmentLandline}
                className=" text-md w-72 font-bold mx-2 border border-gray-300 rounded px-3 py-2"
                onChange={(e) => setDepartmentLandline(e.target.value)}
              />
            </div>
          </div>

          <div className=" flex flex-row items-center justify-center w-fit mx-8 mb-4">
            <div className="flex items-center justify-center w-fit mb-4 ml-[-0.8rem]">
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
            </div>
            <div className="flex flex-col ">
              <span className="text-xs font-normal">Location</span>
              <input
                type="text"
                value={location}
                className=" text-md w-72 font-bold mx-2 border border-gray-300 rounded px-3 py-2"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className=" flex flex-row items-center justify-center w-fit mx-8">
            <div className="flex items-center justify-center w-fit mb-4 ml-[-0.8rem]">
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
            </div>
            <div className="flex flex-col ">
              <span className="text-xs font-normal">University</span>
              <input
                type="text"
                value={university}
                className=" text-md w-72 font-bold mx-2 border border-gray-300 rounded px-3 py-2"
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] rounded-[0.6rem] bg-[#FAD655] text-[#8A252C] font-semibold text-lg relative flex py-2 px-3 w-36 h-[fit-content] mx-10 mb-2 mt-24 hover:bg-[#8a252c] hover:text-[#ffffff] text-center items-center justify-center"
          onClick={handleConfirmSave}
        >
          Save
        </button>
      </Card>
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
            <p className="text-3xl font-bold mb-4">Save Changes?</p>
            <p className="text-xl mb-4 mt-10">
              {confirmationMessage
                ? confirmationMessage
                : "Looks like you've made changes. Do you want to save these changes?"}
            </p>
            <div className="flex justify-center gap-10 mt-12 mb-10">
              <Button
                onClick={handleCancelSave}
                className="px-4 py-2 bg-[#8A252C] text-[#ffffff] rounded-xl hover:bg-[#a8444b] font-medium hover:text-[#ffffff] focus:outline-none h-12 text-xl"
              >
                No, Cancel
              </Button>
              <Button
                href="/profile"
                onClick={handleSave}
                className="px-4 py-2 bg-[#eec160] text-[#8A252C] font-semibold rounded-xl hover:bg-[#f8d384] hover:text-[#8A252C] focus:outline-none h-12 text-xl"
              >
                Yes, Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col gap-6">
        {/* Department Description */}
        <Card className="w-[69rem] h-64 flex flex-col rounded-xl ml-10">
          <div className="flex flex-row self-start gap-[45rem]">
            <div className="text-2xl font-bold text-center self-start mx-10 mt-10 mb-5">
              About Department
            </div>
          </div>
          <div className="bg-[#CBC3C3] left-[0rem] top-[2.3rem] right-[0rem] h-[0.1rem]"></div>
          <textarea
            value={departmentDescription}
            className=" font-normal text-lg w-[66rem] ml-6 mx-12 h-32 p-5 border border-gray-300 rounded px-3 py-2 mt-5 overflow-auto"
            onChange={(e) => setDepartmentDescription(e.target.value)}
          />
        </Card>
        {/* Office Vision */}
        <Card className="w-[69rem] h-40 flex flex-col rounded-xl ml-10 pb-3 shadow-xl">
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
        <Card className="w-[69rem] h-40 flex flex-col rounded-xl ml-10 pb-3 shadow-xl">
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
