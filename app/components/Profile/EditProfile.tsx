import { getSession, useSession } from "next-auth/react";
import Navbar from "../Navbars/Navbar";
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
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const drawerWidth = 250;

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

export default function UserEditProfile() {
  const { data: session, status, update } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [image, setImage] = useState("");
  const [department, setDepartment] = useState("");
  const [headOfficer, setHeadOfficer] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [roles, setRoles] = useState("");
  const [roleCounts, setRoleCounts] = useState({
    headOfficer: 0,
    faculty: 0,
    qualityAssurance: 0,
  });

  const department_id = user?.department_id;
  console.log("Department: ", department_id);
  console.log("User Parsed: ", user);
  const username = user?.username;

  useEffect(() => {
    const fetchUserProfileData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/${department_id}`
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/image/getImage/${department_id}`
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

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/update/${department_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            head_officer: headOfficer,
            department_landline: departmentLandline,
            location: location,
            email: email,
            university: university,
            description: departmentDescription,
            department_id: department_id,
          }),
        }
      );

      if (res.ok) {
        console.log("Edit successful");
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
      const imageFormat = file.type.split("/")[1];

      const formData = new FormData();
      formData.append("department_id", department_id);
      formData.append("image", file, file.name);
      formData.append("image_format", imageFormat);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/image/insertImage`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.message === "Department image saved successfully.") {
            console.log("Image saved successfully.");
          } else {
            console.error("Failed to save image:", result.message);
          }
        } else {
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Network error occurred", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/department/${department_id}/roleCounts`
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
        color: "#2e2c2c",
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
                sx={{
                  fontWeight: "bold",
                  fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' },
                }}
              >
                EDIT PROFILE
              </Typography>
            </Grid>
              <Typography sx={{fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                The Profile feature allows you to view your department’s details, including department name, while also giving you access to your personal profile where you can update your contact information, and upload your profile picture.
              </Typography>
          </Grid>

          <Cards sx={{mt:5}}>
            <StyledBox sx={{ background: "white", borderRadius: 5 }}>
              <Grid item style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleConfirmSave}
                  sx={{ width: 'auto', color: "#AB3510" }}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    marginTop: -20,
                    border: "1px solid #d9d9d9",
                    padding: '10px 30px',
                  }}
                >
                  {<CheckRoundedIcon />}
                </Button>
              </Grid>
              <Grid container alignItems="center" p={3}>
                <Grid item xs={12} sm={8.5}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4}>
                      {image ? (
                        <Box 
                        sx={{width: {lg:'12rem', sm:'8rem', xs:'8rem', md:'8rem'}, height: {lg: '12rem', xs: '8rem', sm: '8rem', md: '8rem'}}}
                        className="border border-solid border-gray-300 shadow-lg rounded-full ml-4 flex items-center justify-center overflow-hidden">
                          <img
                            src={image}
                            alt="User Image"
                            className=" w-full h-full object-cover"
                          />
                        </Box>
                      ) : (
                        <Box 
                        sx={{width: {lg:'12rem', sm:'8rem', xs:'8rem', md:'8rem'}, height: {lg: '12rem', xs: '8rem', sm: '8rem', md: '8rem'}}}
                        className="border border-solid border-gray-300 shadow-lg rounded-full ml-4 flex items-center justify-center">
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

                    <Grid item xs={12} sm={8} sx={{ ml: {lg: -2} }}>
                        <Typography
                            sx={{ fontWeight: "600", mr: {lg: 5}, fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' }, }}
                          >
                          {department}
                        </Typography>
                        <Typography color="textSecondary" sx={{fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                            Department Name
                        </Typography>

                      <Button
                        variant="contained"
                        component="label"
                        sx={{p:1, fontSize: '15px'}}
                        style={{
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                          marginTop: 2,
                        }}
                      >
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleImageChange}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={3.5}>
                  <Box
                    sx={{
                      background: "#fff6d1",
                      p: 2,
                      borderRadius: 2,
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                          sx={{ fontWeight: "500", mb: 1, fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' }  }}
                        >
                          DEPARTMENT PROFILE
                        </Typography>
                        <Typography
                          sx={{ fontWeight: "400", mb: 1, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
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
                    <Grid item spacing={2}>
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
                          }}
                        >
                          <Typography
                                sx={{ fontWeight: "bolder", fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                            {roleCounts.headOfficer}
                          </Typography>
                          <Typography
                                sx={{ fontWeight: "500", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                            HEAD
                          </Typography>
                            <Typography
                                sx={{ fontWeight: "500", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                            Officer
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          sm={6}
                          sx={{
                            bgcolor:
                              roles === "faculty" ? "#f8da90" : "transparent",
                            borderRadius: 2,
                            p: 1,
                          }}
                        >
                          <Typography
                                sx={{ fontWeight: "bolder", fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                            {roleCounts.faculty}
                          </Typography>
                            <Typography
                                sx={{ fontWeight: "500", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                              >
                            FACULTY
                          </Typography>
                          <Typography
                                sx={{ fontWeight: "500", fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
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

              <Grid container alignItems="center" sx={{ p: 1 }}>
                <Boxes
                  sx={{
                    background: "white",
                    borderRadius: 5,
                    borderColor: "gray",
                  }}
                >
                  <Typography
                        sx={{ fontWeight: "600", p: 3, fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                      >
                        Basic Information
                      </Typography>

                  {/* pa horizontal */}
                  <Grid item sx={{ p: 3 }} spacing={5}>
                    <Grid
                      container
                      alignItems="center"
                      sx={{ mt: -7 }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Grid item sm={4}>
                        <Typography
                            color="textSecondary" sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.7rem' }}}
                            >
                              Head Officer
                            </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { 
                              fontSize: "15px", 
                            },
                            background: "#e9e8e8",
                          }}
                          value={headOfficer}
                          // onChange={(e) => setHeadOfficer(e.target.value)}
                          inputProps={{ readOnly: true }}
                          placeholder="Enter head officer"
                        />
                      </Grid>
                      <Grid item sm={4}>
                      <Typography
                            color="textSecondary" sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.7rem' }}}
                            >
                          Email
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "15px", // Adjust the font size as needed 
                            },
                          }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email"
                        />
                      </Grid>
                      <Grid item sm={4}>
                      <Typography
                            color="textSecondary" sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.7rem' }}}
                            >
                          Landline
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "15px", // Adjust the font size as needed 
                            },
                          }}
                          value={departmentLandline}
                          onChange={(e) =>
                            setDepartmentLandline(e.target.value)
                          }
                          placeholder="Enter landline"
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
                            color="textSecondary" sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.7rem' }}}
                            >
                          University
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          onChange={(e) => setUniversity(e.target.value)}
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { 
                              fontSize: "15px", 
                            },
                          }}
                          value={university}
                          placeholder="Enter university"
                        />
                      </Grid>
                      <Grid item sm={6}>
                        <Typography
                            color="textSecondary" sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.7rem' }}}
                            >
                          Location
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { 
                              fontSize: "15px", 
                            },
                          }}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter location"
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
                    <Typography
                        sx={{ fontWeight: "600", p: 3, fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
                        >
                          About Department
                        </Typography>
                    <Grid item sx={{ p: 3, mt: -5 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        multiline
                        sx={{
                          "& .MuiInputBase-root": {
                            // Remove height property
                          },
                          "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "15px", // Adjust the font size as needed 
                            },
                        }}
                        value={departmentDescription}
                        onChange={(e) =>
                          setDepartmentDescription(e.target.value)
                        }
                      />
                    </Grid>
                  </Boxes>
                </Boxes>
              </Grid>
            </StyledBox>
          </Cards>
        </StyledBox>
      </Box>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh", // Occupy full viewport height
          }}
        >
          <Box
            sx={{
              background: "white",
              padding: 4,
              borderRadius: 2,
              boxShadow: 24,
              textAlign: "center",
              position: "relative",
              width: "25rem",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", mb: 3, fontSize: { lg: '1.5rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}
              >
              Confirm Updates
            </Typography>
            <Typography sx={{ mb: 3, fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
              {confirmationMessage
                ? confirmationMessage
                : "Do you want to save these updates and proceed?"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 3,
                flexWrap: "wrap", // Allow buttons to wrap on smaller screens
              }}
            >
              <Button
                variant="contained"
                onClick={handleCancelSave}
                sx={{
                  width: "30%",
                  color: "#AB3510",
                  p:1,
                  fontSize: '15px',
                }}
                style={{
                  background: "white",
                  border: "1px solid #AB3510",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                href="/profile"
                onClick={handleSave}
                sx={{
                  width: "30%",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  p:1,
                  fontSize: '15px',
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}