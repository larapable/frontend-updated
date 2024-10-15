import Navbar from "../Navbars/Navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../Misc/Spinner";
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Divider,
  Avatar,
  Select,
  MenuItem,
  Grid,
  Button,
  Autocomplete,
  FormHelperText,
  Card,
  responsiveFontSizes,
  Modal,
} from "@mui/material";
import axios from "axios";
import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { SelectChangeEvent } from "@mui/material/Select";
import SpinnerPages from "../Misc/SpinnerPages";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";

const drawerWidth = 310;

const StyledBox = styled(Box)({
  wordWrap: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
  height: "auto",
});

const MainFont = styled(Box)({
  fontSize: "0.9rem",
  mt: 2,
});

const Cards = styled(Box)({
  width: "100%",
  height: "auto",
  borderRadius: "20px",
  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
  borderColor: "#e9e8e8",
  borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
  borderWidth: "1px",
});

const Boxes = styled(Box)({
  height: "auto",
  width: "100%",
});

export default function UserProfile() {
  // DEPARTMENT PROFILE
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [image, setImage] = useState("");
  const [department, setDepartment] = useState("");
  const [headOfficer, setHeadOfficer] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("department");
  const [isMobile, setIsMobile] = useState(false);
  const [roles, setRoles] = useState("");
  const [roleCounts, setRoleCounts] = useState({
    headOfficer: 0,
    faculty: 0,
    qualityAssurance: 0,
  });

  const department_id = user?.department_id;
  const user_id = user?.id;
  console.log("User ID: ", user_id);
  console.log("Department: ", department_id);
  console.log("User Parsed: ", user);
  const username = user?.username;

  useEffect(() => {
    const fetchUserProfileData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/department/${department_id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data);
          setDepartment(data.department_name);
          setHeadOfficer(data.head_officer);
          setDepartmentLandline(data.department_landline);
          setLocation(data.location);
          setEmail(data.email);
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
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfileData();
  }, [department_id]);

  useEffect(() => {
    const fetchImageData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/image/getImage/${department_id}`
        );
        if (response.ok) {
          const { imageData, imageFormat } = await response.json();
          console.log(
            "Received image data:",
            imageData,
            "Image format:",
            imageFormat
          );

          if (!imageData || !imageFormat) {
            console.error(
              "Invalid image data or format:",
              imageData,
              imageFormat
            );
            return;
          }

          const image = `data:image/${imageFormat};base64,${imageData}`;
          setImage(image);
          console.log("Image URL:", image);
        } else {
          console.error("Error fetching image data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImageData();
  }, [department_id]);

  // USER PERSONAL PROFILE
  const [userImage, setUserImage] = useState("");
  const [firstname, setFirstname] = useState("");
  0;
  const [age, setAge] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUserPersonalProfileData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/user/${user_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data);
          setFirstname(data.firstname);
          setAge(data.age);
          if (data.birthdate) {
            const parsedBirthdate = new Date(data.birthdate);
            const formattedBirthdate = parsedBirthdate
              .toISOString()
              .split("T")[0];
            setBirthdate(formattedBirthdate);
          } else {
            setBirthdate("");
          }
          setLastname(data.lastname);
          setRole(data.role);
          setUserEmail(data.email);
        } else {
          console.error(
            "Error fetching user profile data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPersonalProfileData();
  }, [user_id]);

  useEffect(() => {
    const fetchUserImageData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/userImage/getImage/${user_id}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Full response data for user image:", data);

          const { image: userImageData, imageFormat: userImageFormat } = data;
          console.log(
            "Received user image data:",
            userImageData,
            "User Image format:",
            userImageFormat
          );

          if (!userImageData || !userImageFormat) {
            console.error(
              "Invalid user image data or format:",
              userImageData,
              userImageFormat
            );
            return;
          }

          const userImage = `data:image/${userImageFormat};base64,${userImageData}`;
          setUserImage(userImage);
          console.log("Image URL:", userImage);
        } else {
          console.error("Error fetching image data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserImageData();
  }, [user_id]);

  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/user/department/${department_id}/roleCounts`
        );
        if (response.ok) {
          const data = await response.json();
          setRoleCounts(data); // Update roleCounts state with fetched data
          console.log("Role Counts:", roleCounts); // Check if the data is correct
        } else {
          console.error("Error fetching role counts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching role counts:", error);
      }
    };

    if (department_id) {
      // Only fetch if department_id is available
      fetchRoleCounts();
    }
  }, [department_id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        color: "#4D4C4C",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : drawerWidth,
          flexShrink: 0,
          position: isMobile ? "static" : "fixed",
          height: isMobile ? "auto" : "100vh",
          overflowY: "auto",
        }}
      >
        <Navbar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          p: 3,
        }}
      >
        <StyledBox>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontSize: { xs: "2rem", sm: "3.5rem" },
                }}
              >
                PROFILE
              </Typography>
            </Grid>
            
            <Grid item>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="20rem"
              height="4rem"
              borderRadius={2}
              sx={{ gap: 1, p: 1, borderWidth: 0.5, mt:-2 }}
            >
              <Button
                onClick={() => setCurrentView("department")}
                variant={currentView === "department" ? "contained" : "outlined"}
                fullWidth
                sx={{
                  p:3,
                  fontSize: '18px',
                  background:
                    currentView === "department"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color: currentView === "department" ? "white" : "#AB3510",
                  flexGrow: 2, 
                  height: "100%",
                  border: "1px solid transparent",
                  transition: "background-color 0.3s, color 0.3s", 
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", 
                    color: "white", 
                    border:
                      currentView === "department" ? "none" : "0.5px solid #AB3510", 
                  },
                }}
              >
                Department
              </Button>
              <Button
                onClick={() => setCurrentView("user")}
                variant={currentView === "user" ? "contained" : "outlined"}
                fullWidth
                sx={{
                  p:3,
                  fontSize: '18px',
                  background:
                    currentView === "user"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color: currentView === "user" ? "white" : "#AB3510",
                  flexGrow: 2, // Ensure both buttons have equal size
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      currentView === "user"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                }}
              >
                USER
              </Button>
            </Box>
            </Grid>


            {/* enter description here */}
            <Typography variant="h5">
                The Profile feature allows you to view your department’s details, including department name, while also giving you access to your personal profile where you can update your contact information, and upload your profile picture.
              </Typography>
          </Grid>

          <Cards sx={{mt:5}}>
            <StyledBox sx={{ background: "white", borderRadius: 5 }}>
              {currentView === "department" ? (
                <>
                  <Grid item style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      href="/profile/edit"
                      sx={{ width: 'auto', color: "#AB3510" }}
                      style={{
                        background: "white",
                        borderRadius: "20px",
                        marginTop: -20,
                        border: "1px solid #d9d9d9",
                        padding: '10px 30px',
                      }}
                    >
                      {/* Edit Profile  */}
                      {<ModeEditRoundedIcon />}
                    </Button>
                  </Grid>
                  <Grid container alignItems="center" p={3}>
                    <Grid item xs={12} sm={8.5}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={4}>
                          {image ? (
                            <Box className="border border-solid border-gray-300 shadow-lg rounded-full w-64 h-64 ml-10 flex items-center justify-center overflow-hidden">
                              <img
                                src={image}
                                alt="Department Image"
                                className=" w-full h-full object-cover"
                              />
                            </Box>
                          ) : (
                            <Box className="border border-solid border-gray-300 shadow-lg rounded-full w-64 h-64 ml-10 my-4 flex items-center justify-center">
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
                            </Box>
                          )}
                        </Grid>

                        <Grid item xs={12} sm={8} sx={{ml:-2}}>
                          <Typography
                            variant="h4"
                            component="h2"
                            sx={{ fontWeight: "bold",mr:5 }}
                          >
                            {department}
                          </Typography>
                          <Typography variant="h6" color="textSecondary">
                            Department Name
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={3.5}>
                      <Box
                        sx={{
                          background: "#fff6d1",
                          p: 3,
                          borderRadius: 2,
                          textAlign: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "500", mb: 1 }}
                        >
                          DEPARTMENT PROFILE
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "400", mb: 1 }}
                        >
                          Access and view details about your department here.
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          background: "#ffdb6e",
                          p: 1,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        {/* contents of small box */}
                        <Grid item sx={{ p: 1 }} spacing={2}>
                          <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                          >
                            <Grid
                              item
                              sm={6}
                              sx={{
                                bgcolor:
                                  roles === "headOfficer"
                                    ? "#f8da90"
                                    : "transparent",
                                borderRadius: 2,
                                p: 1,
                                mt: 2,
                              }}
                            >
                              <Typography variant="h5" sx={{ fontWeight: "bolder" }}>
                                {roleCounts.headOfficer}
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "500" }}
                              >
                                HEAD
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "500" }}
                              >
                                Users
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              sm={6}
                              sx={{
                                bgcolor:
                                  roles === "faculty"
                                    ? "#f8da90"
                                    : "transparent",
                                borderRadius: 2,
                                p: 1,
                                mt: 2,
                              }}
                            >
                              <Typography variant="h5" sx={{ fontWeight: "bolder" }}>
                                {roleCounts.faculty}
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "500" }}
                              >
                                FACULTY
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "500" }}
                              >
                                Users
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ background: "#eeeeee" }} />

                  <Grid container alignItems="center" sx={{ p: 2 }}>
                    <Boxes
                      sx={{
                        background: "white",
                        borderRadius: 5,
                        borderColor: "gray",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: "bold", p: 3 }}>
                        Basic Information
                      </Typography>

                      {/* pa horizontal */}
                      <Grid item sx={{ p: 3 }} spacing={5}>
                        <Grid
                          container
                          alignItems="center"
                          sx={{ mt: -5 }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Grid item sm={4}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              Head Officer
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={headOfficer}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item sm={4}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              Email
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={email}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item sm={4}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              Landline
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={departmentLandline}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* pa horizontal */}
                      <Grid item sx={{ p: 3 }} spacing={5}>
                        <Grid
                          container
                          alignItems="center"
                          sx={{ mt: -5 }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Grid item sm={6}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              University
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={university}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item sm={6}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              Location
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={location}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* insert description here */}
                      <Boxes
                        sx={{
                          background: "white",
                          borderRadius: 5,
                          borderColor: "gray",
                        }}
                      >
                        <Typography variant="h5" sx={{ fontWeight: "bold", p: 3 }}>
                          About Department
                        </Typography>
                        <Grid item sx={{ p: 3, mt: -3 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            multiline
                            sx={{
                              "& .MuiInputBase-root": {
                                // Remove height property
                              },
                              "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                            }}
                            value={departmentDescription}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                      </Boxes>
                    </Boxes>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      href="/userprofile/edit"
                      sx={{ width: 'auto', color: "#AB3510" }}
                      style={{
                        background: "white",
                        borderRadius: "20px",
                        marginTop: -20,
                        border: "1px solid #d9d9d9",
                        padding: '10px 30px',
                      }}
                    >
                      {<ModeEditRoundedIcon />}
                    </Button>
                  </Grid>
                  <Grid container alignItems="center" p={3}>
                    <Grid item xs={12} sm={8.5}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={4}>
                          {userImage ? (
                            <Box className="border border-solid border-gray-300 shadow-lg rounded-full w-64 h-64 ml-10 flex items-center justify-center overflow-hidden">
                              <img
                                src={userImage}
                                alt="User Image"
                                className=" w-full h-full object-cover"
                              />
                            </Box>
                          ) : (
                            <Box className="border border-solid border-gray-300 shadow-lg rounded-full w-64 h-64 ml-10 my-4 flex items-center justify-center">
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
                            </Box>
                          )}
                        </Grid>

                        <Grid item xs={12} sm={8} sx={{ml:-2}}>
                          <Typography
                            variant="h4"
                            component="h2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {username}
                          </Typography>
                          <Typography variant="h6" color="textSecondary">
                            {role}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={3.5}>
                      <Box
                        sx={{
                          background: "#fff6d1",
                          p: 3,
                          borderRadius: 2,
                          textAlign: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "500", mb: 1 }}
                        >
                          User Profile
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "400", mb: 1 }}
                        >
                          Access and view your personal <br />
                          information here.
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          background: "#ffdb6e",
                          p: 1,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        {/* contents of small box */}
                        <Grid item sx={{ p: 1 }} spacing={2}>
                          <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                          >
                            <Grid
                              item
                              sm={6}
                              sx={{
                                bgcolor:
                                  role === "headOfficer"
                                    ? "#fff6d1"
                                    : "transparent",
                                borderRadius: 2,
                                p: 1,
                                mt: 2,
                              }}
                            >
                              <Typography variant="h5" sx={{ fontWeight: "bolder" }}>
                                {roleCounts.headOfficer}
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "500" }}
                              >
                                HEAD
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "500" }}
                              >
                                Users
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              sm={6}
                              sx={{
                                bgcolor:
                                  role === "faculty"
                                    ? "#fff6d1"
                                    : "transparent",
                                borderRadius: 2,
                                p: 1,
                                mt: 2,
                              }}
                            >
                              <Typography variant="h5" sx={{ fontWeight: "bolder" }}>
                                {roleCounts.faculty}
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{ fontWeight: "500" }}
                              >
                                FACULTY
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "500" }}
                              >
                                Users
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ background: "#eeeeee" }} />

                  <Grid container alignItems="center" sx={{ p: 2 }}>
                    <Boxes
                      sx={{
                        background: "white",
                        borderRadius: 5,
                        borderColor: "gray",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: "bold", p: 3 }}>
                        Basic Information
                      </Typography>

                      {/* pa horizontal */}
                      <Grid item sx={{ p: 3 }} spacing={5}>
                        <Grid
                          container
                          alignItems="center"
                          sx={{ mt: -5 }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Grid item sm={4}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              First Name
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={firstname}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item sm={4}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              Last Name
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={lastname}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item sm={4}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              Email
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={userEmail}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* pa horizontal */}
                      <Grid item sx={{ p: 3 }} spacing={5}>
                        <Grid
                          container
                          alignItems="center"
                          sx={{ mt: -5 }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Grid item sm={6}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              Birthdate
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={birthdate}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item sm={6}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "500", color: "#8d8d8d" }}
                            >
                              Age
                            </Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              sx={{
                                height: "50px",
                                "& .MuiInputBase-root": { height: "50px" },
                                "& .MuiOutlinedInput-input": { // Target the input element specifically
                                  fontSize: "18px", // Adjust the font size as needed 
                                }
                              }}
                              value={age}
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography variant="h6">
                          If you want to change password,{" "}
                          <a
                            href="/password"
                            className="text-[#AB3510] font-bold underline"
                          >
                            click here
                          </a>
                          .
                        </Typography>
                      </Box>
                    </Boxes>
                  </Grid>
                </>
              )}
            </StyledBox>
          </Cards>
        </StyledBox>
      </Box>
    </Box>
  );
}
