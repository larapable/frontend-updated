import { getSession, useSession } from "next-auth/react";
import Navbar from "../Navbars/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { SelectChangeEvent } from "@mui/material/Select";

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

export default function EditProfileUsers() {
  const { data: session, status, update } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [userImage, setUserImage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [age, setAge] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [roles, setRoles] = useState("");
  const [roleCounts, setRoleCounts] = useState({
    headOfficer: 0,
    faculty: 0,
    qualityAssurance: 0,
  });

  const department_id = user?.department_id;
  const user_id = user?.id;
  console.log("User ID Edit User Profile: ", user_id);
  console.log("Department Edit User Profile: ", department_id);
  console.log("User Parsed Edit User Profile: ", user);
  const username = user?.username;

  useEffect(() => {
    const fetchUserPersonalProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user/${user_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data);
          setFirstname(data.firstname);
          setLastname(data.lastname);
          setRole(data.role);
          setAge(data.age);
          setBirthdate(data.birthdate);
          setEmail(data.email);
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
    fetchUserPersonalProfileData();
  }, [user_id]);

  useEffect(() => {
    const fetchUserImageData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/userImage/getImage/${user_id}`
        );
        if (response.ok) {
          const data = await response.json();

          const { image: userImageData, imageFormat: userImageFormat } = data;
          console.log(
            "Received image data:",
            userImageData,
            "Image format:",
            userImageFormat
          );

          if (!userImageData || !userImageFormat) {
            console.error(
              "Invalid image data or format:",
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
      }
    };
    fetchUserImageData();
  }, [user_id]);

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/user/update/profile/${user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            role: role,
            email: email,
            age: age,
            birthdate: birthdate,
            userId: user_id,
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

  const handleUserImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      const imageFormat = file.type.split("/")[1];
      if (!user_id) {
        console.error("user_id is undefined or not set.");
        return;
      }

      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("image", file, file.name);
      formData.append("image_format", imageFormat);

      try {
        const response = await fetch(
          "http://localhost:8080/userImage/insertUserImage",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.message === "User image saved successfully.") {
            console.log("Image saved successfully.");
          } else {
            console.error("Failed to save image:", result.message);
          }
        } else {
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Network error occurred", error);
      }
    }
  };

  const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const calculatedAge = calculateAge(selectedDate);

    if (calculatedAge < 18) {
      alert("You must be at least 18 years old.");
      setBirthdate("");
      setAge("");
    } else {
      setBirthdate(selectedDate);
      setAge(calculatedAge.toString());
    }
  };

  // const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setRole(e.target.value);
  // };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setRole(event.target.value);
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
                      {userImage ? (
                        <Box className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 flex items-center justify-center overflow-hidden">
                          <img
                            src={userImage}
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

                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {username}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        <Select
                          value={role}
                          onChange={handleRoleChange}
                          fullWidth
                          variant="outlined"
                          inputProps={{ readOnly: true }}
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Role
                          </MenuItem>
                          <MenuItem value="headOfficer">HEAD OFFICER</MenuItem>
                          <MenuItem value="faculty">FACULTY</MenuItem>
                        </Select>
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
                          onChange={handleUserImageChange}
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
                      User Profile
                    </Typography>
                    <Typography
                      variant="body2"
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
                              role === "faculty" ? "#fff6d1" : "transparent",
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
                          First Name
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          placeholder="Enter first name"
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8d8d8d" }}
                        >
                          Last Name
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          placeholder="Enter lastname"
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
                          Birthdate
                        </Typography>
                        <TextField
                          type="date"
                          fullWidth
                          variant="outlined"
                          onChange={handleBirthdateChange}
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={birthdate}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item sm={6}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#8d8d8d" }}
                        >
                          Age
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            height: "35px",
                            "& .MuiInputBase-root": { height: "35px" },
                          }}
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          inputProps={{ readOnly: true }}
                          placeholder="Enter age"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
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
