"use client";
import QANavbar from "@/app/components/Navbars/QANavbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Misc/Spinner";
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
import SpinnerPages from "@/app/components/Misc/SpinnerPages";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import { useParams } from "next/navigation";

const drawerWidth = 280;

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
  borderColor: "gray",
});

const Boxes = styled(Box)({
  height: "auto",
  width: "100%",
});

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
  const [isMobile, setIsMobile] = useState(false);
  const [roles, setRoles] = useState("");
  const [roleCounts, setRoleCounts] = useState({
    headOfficer: 0,
    faculty: 0,
    qualityAssurance: 0,
  });

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

  if (isLoading) {
    return <SpinnerPages />;
  }

  if (!department) {
    return <div>Department not found</div>;
  }

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
        <QANavbar />
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
                  fontSize: { xs: "1.8rem", sm: "2.125rem" },
                }}
              >
                PROFILE
              </Typography>
            </Grid>
          </Grid>

          <Cards>
            <StyledBox sx={{ background: "white", borderRadius: 5 }}>
              <Grid container alignItems="center" p={3}>
                <Grid item xs={12} sm={8.5}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4}>
                      {department.image ? (
                        <Box className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 flex items-center justify-center overflow-hidden">
                          <img
                            src={department.image}
                            alt="Department Image"
                            className=" w-full h-full object-cover"
                          />
                        </Box>
                      ) : (
                        <Box className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 flex items-center justify-center">
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

                    <Grid item xs={12} sm={8}>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {department.department_name}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Department Name
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={3.5}>
                  <Box
                    sx={{
                      background: "#fff6d1",
                      p: 1,
                      borderRadius: 2,
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "500", mb: 1 }}>
                      Department Profile
                    </Typography>
                    <Typography
                      variant="body2"
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
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500" }}
                          >
                            HEAD
                          </Typography>
                          <Typography sx={{ fontWeight: "bolder" }}>
                            {roleCounts.headOfficer}
                          </Typography>
                          <Typography
                            variant="body2"
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
                              roles === "faculty" ? "#f8da90" : "transparent",
                            borderRadius: 2,
                            p: 1,
                            mt: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500" }}
                          >
                            FACULTIES
                          </Typography>
                          <Typography sx={{ fontWeight: "bolder" }}>
                            {roleCounts.faculty}
                          </Typography>
                          <Typography
                            variant="body2"
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
                  <Typography sx={{ fontWeight: "bold", p: 3 }}>
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
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8d8d8d" }}
                        >
                          Head Officer
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={department.head_officer}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8d8d8d" }}
                        >
                          Email
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={department.email}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8d8d8d" }}
                        >
                          Landline
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={department.department_landline}
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
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8d8d8d" }}
                        >
                          University
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={department.university}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item sm={6}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8d8d8d" }}
                        >
                          Location
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={department.location}
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
                    <Typography sx={{ fontWeight: "bold", p: 3 }}>
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
                        }}
                        value={department.description}
                        inputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Boxes>
                </Boxes>
              </Grid>
            </StyledBox>
          </Cards>
        </StyledBox>
      </Box>
    </Box>
  );
}
