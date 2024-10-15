"use client";
import { useState } from "react";
import AdminNavbar from "../Admin/AdminNavBar";
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

const drawerWidth = 310;

const StyledBox = styled(Box)({
  wordWrap: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
  height: "auto",
});


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
  const [isMobile, setIsMobile] = useState(false);

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
        <AdminNavbar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          p: 3,
        }}
      >
        <StyledBox sx={{ width: "100%", maxWidth: "800px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontSize: { xs: "2rem", sm: "3.5rem" },
                }}
              >
                REGISTER DEPARTMENT
              </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: "400",
                  marginBottom: 2,
                }}
              >
                Enter the details to get going
              </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
          </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <Box
              sx={{
                borderRadius:"10px",
                background: "white",
                fontSize: "20px",
                fontWeight: "600",
                p:5,
                width:"50%",
                height:"auto",
                borderColor:"#e9e8e8",
                borderStyle:"solid",
                borderWidth: "1px",
                boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
              }}
            >
              <Typography variant="h5" sx={{fontWeight:"600", mb:2}}>
                    Basic Information
                </Typography>

                <Typography variant="h6" sx={{fontWeight:"400"}}>
                    Department Name
                    <span className="text-[#DD1414]">*</span>
                </Typography>
                <Grid>
                  <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "18px", // Adjust the font size as needed 
                            },
                          }}
                          value={departmentName}
                          onChange={handleDepartmentNameChange}
                        />
                </Grid>

                <Grid container alignItems="center" sx={{mt:3}}>
                  <Grid item xs={5.5}>
                  <Typography variant="h6" sx={{fontWeight:"400"}}>
                      University
                      <span className="text-[#DD1414]">*</span>
                  </Typography>
                    <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "18px", // Adjust the font size as needed 
                            },
                          }}
                          value={university}
                          onChange={handleUniversityChange}
                        />
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={5.5}>
                  <Typography variant="h6" sx={{fontWeight:"400"}}>
                      Location
                      <span className="text-[#DD1414]">*</span>
                  </Typography>
                    <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "18px", // Adjust the font size as needed 
                            },
                          }}
                          value={location}
                          onChange={handleLocationChange}
                        />
                  </Grid>
                </Grid>
            </Box>
            </Box>

            <Box sx={{mt:5, display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <Box
              sx={{
                borderRadius:"10px",
                background: "white",
                fontSize: "20px",
                fontWeight: "600",
                p:5,
                width:"50%",
                height:"auto",
                borderColor:"#e9e8e8",
                borderStyle:"solid",
                borderWidth: "1px",
                boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
              }}
            >
              <Typography variant="h5" sx={{fontWeight:"600", mb:2}}>
                    Contact Information
                </Typography>

                <Typography variant="h6" sx={{fontWeight:"400"}}>
                    Head Officer
                    <span className="text-[#DD1414]">*</span>
                </Typography>
                <Grid>
                  <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "18px", // Adjust the font size as needed 
                            },
                          }}
                          value={headOfficer}
                          onChange={handleHeadOfficerChange}
                        />
                </Grid>

                <Grid container alignItems="center" sx={{mt:3}}>
                  <Grid item xs={5.5}>
                  <Typography variant="h6" sx={{fontWeight:"400"}}>
                      Department Landline
                      <span className="text-[#DD1414]">*</span>
                  </Typography>
                    <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "18px", // Adjust the font size as needed 
                            },
                          }}
                          value={departmentLandline}
                          onChange={handleDepartmentLandlineChange}
                        />
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={5.5}>
                  <Typography variant="h6" sx={{fontWeight:"400"}}>
                      Email
                      <span className="text-[#DD1414]">*</span>
                  </Typography>
                    <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiInputBase-root": { height: "40px" },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "18px", // Adjust the font size as needed 
                            },
                          }}
                          value={email}
                          onChange={handleEmailChange}
                        />
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Box sx={{mt:5, display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <Box
              sx={{
                borderRadius:"10px",
                background: "white",
                fontSize: "20px",
                fontWeight: "600",
                p:5,
                width:"50%",
                height:"auto",
                borderColor:"#e9e8e8",
                borderStyle:"solid",
                borderWidth: "1px",
                boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
              }}
            >
              <Typography variant="h5" sx={{fontWeight:"600", mb:2}}>
                    Details About Department
                </Typography>

                <Typography variant="h6" sx={{fontWeight:"400"}}>
                    Description
                    <span className="text-[#DD1414]">*</span>
                </Typography>
                <Grid>
                  <TextField
                          fullWidth
                          variant="outlined"
                          multiline
                          sx={{
                            "& .MuiInputBase-root": {  },
                            "& .MuiOutlinedInput-input": { // Target the input element specifically
                              fontSize: "18px", // Adjust the font size as needed 
                            },
                          }}
                          value={description}
                          onChange={handleDescriptionChange}
                        />
                </Grid>
              </Box>
            </Box>
            <Box sx={{mt:5, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
                className="rounded-lg text-white font-bold text-xl mt-5 px-32 py-5 border[0.1rem] border-white hover:text-[#f3deb0] mb-10"
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
                    padding: 6,
                    borderRadius: 2,
                    boxShadow: 24,
                    textAlign: "center",
                    position: "relative",
                    width: "30%", // Limit modal width to 80% of viewport width
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 3 }}
                  >
                    Notice!
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 5 }}>
                    {modalMessage}
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
                      onClick={() => setShowModal(false)}
                      sx={{
                        width: "40%",
                        background: "linear-gradient(to left, #8a252c, #AB3510)",
                        p:1,
                        fontSize: '18px',
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Modal>

        </StyledBox>

      </Box>
    </Box>
  );
}
