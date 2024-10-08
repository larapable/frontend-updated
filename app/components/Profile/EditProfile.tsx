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

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/department/update/${department_id}`,
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
          "http://localhost:8080/image/insertImage",
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
                  fontSize: { xs: "1.8rem", sm: "2.125rem" },
                }}
              >
                EDIT PROFILE
              </Typography>
            </Grid>
          </Grid>

          <Cards>
            <StyledBox sx={{ background: "white", borderRadius: 5 }}>
              <Grid item style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleConfirmSave}
                  sx={{ width: 10, color: "#AB3510" }}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    marginTop: -20,
                    border: "1px solid #d9d9d9",
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
                        <Box className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 flex items-center justify-center overflow-hidden">
                          <img
                            src={image}
                            alt="User Image"
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
                        {department}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Department Name
                      </Typography>

                      <Button
                        variant="contained"
                        component="label"
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
                    <Grid item sx={{ p: 1 }} spacing={5}>
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email"
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
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8d8d8d" }}
                        >
                          University
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          onChange={(e) => setUniversity(e.target.value)}
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={university}
                          placeholder="Enter university"
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
              maxWidth: "50vw", // Limit modal width to 80% of viewport width
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Save Changes?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
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
                  width: "auto",
                  color: "#AB3510",
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
                  width: "auto",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
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
