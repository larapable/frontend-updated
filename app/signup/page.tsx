"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import styled from "@emotion/styled";
import { signIn } from "next-auth/react";
import Spinner from "../components/Misc/Spinner";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import CloseIcon from "@mui/icons-material/Close";
import "@/app/page.css";

const drawerWidth = 0;

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
  borderStyle: "solid",
  borderWidth: "1px",
});

const Boxes = styled(Box)({
  height: "auto",
  width: "100%",
});

type Department = {
  id: number;
  department_name: string;
  head_officer: string;
};

interface PasswordRequirements {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
  show: boolean;
}

export default function SignupPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  //
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [heads, setHeads] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [selectedHead, setSelectedHead] = useState<string | null>(null);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [isMobile, setIsMobile] = useState(false);

  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    show: false,
  });

  const handlePasswordFocus = () => {
    setPasswordRequirementsMet((prev) => ({
      ...prev,
      show: true, // Show requirements when the field is focused
    }));
  };

  const handlePasswordBlur = () => {
    setPasswordRequirementsMet((prev) => ({
      ...prev,
      show: false, // Hide requirements on blur
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Update the password requirements
    setPasswordRequirementsMet((prev) => ({
      ...prev,
      minLength: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      specialChar: /[@$!%*?&.]/.test(newPassword),
      show: true, // Show requirements when typing
    }));
  };

  const handleCancelSave = () => {
    setErrorModalOpen(false);
  };

  const router = useRouter();

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal(false);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (
      !firstname ||
      !lastname ||
      !role ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      (role === "headOfficer" && !selectedHead) ||
      (role !== "qualityAssurance" && !selectedDepartment) // department is required only for non-QA roles
    ) {
      setErrorMessage(
        "You have left a field empty. Please take a moment to complete all the necessary information."
      );
      setErrorModalOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      setErrorModalOpen(true);
      return;
    }

    // Check if password meets requirements
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be a minimum of 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character (including period)."
      );
      setErrorModalOpen(true);
      return;
    }

    try {
      setLoading(true); // Show spinner
      const resUserExists = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/userExists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username }),
        }
      );

      const { userEmail, userName } = await resUserExists.json(); // Assuming the server responds with both user and userName

      if (userEmail || userName) {
        setErrorMessage("Username or email already exists.");
        setErrorModalOpen(true);
        setLoading(false); // Hide spinner
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/insert`,
        // role === "qualityAssurance"
        //   ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/qauser/insert`
        //   : `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            role,
            username,
            email,
            password,
            // ...(role !== "qualityAssurance" && {
            //   department: { id: selectedDepartment },
            // }),
            // department: {
            //   id: selectedDepartment, // Pass selectedDepartment as a nested object
            // },
            head: selectedHead,
            department:
              role === "qualityAssurance"
                ? { id: 1 }
                : { id: selectedDepartment }, // Set department to null for QA role
          }),
        }
      );
      const data = await res.json();
      console.log("data:", data);
      if (res.ok) {
        console.log("Signup successful");
        // Clear input fields after successful signup
        setFirstname("");
        setLastname("");
        setRole("");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSelectedHead("");
        setSelectedDepartment(0);
        setSuccessModal(true);

        setTimeout(() => {
          setSuccessModal(false);
          router.push("/login");
        }, 2000);
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartments`
      );
      const data = await res.json();
      setDepartments(data.departments);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchHeadDepartments = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartmentsHead`
      );
      const data = await res.json();
      setHeads(data.departmentsHead);
      // console.log(data);
    };

    fetchHeadDepartments();
  }, []);

  useEffect(() => {
    if (role === "headOfficer") {
      setSelectedHead(`${firstname} ${lastname}`); // Update selectedHead when role changes
    } else {
      setSelectedHead(""); // Clear selectedHead for other roles
    }
  }, [role, firstname, lastname]);

  if (loading) {
    return <Spinner />; // Show spinner while loading
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        color: "#2e2c2c",
        height: "100vh",
        alignItems: "center",
      }}
    >
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
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
              }}
            >
              <Box
                sx={{
                  border: "1px solid #ee552a",
                  borderRadius: "2rem",
                  width: "100%",
                  padding: 2,
                  textAlign: "center",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                }}
              >
                <Typography
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontSize: {
                      lg: "2rem",
                      sm: "2rem",
                      md: "2rem",
                      xs: "1.5rem",
                    },
                  }}
                >
                  Sign Up
                </Typography>
                <Typography
                  color="textSecondary"
                  sx={{
                    fontSize: {
                      lg: "1rem",
                      sm: "1rem",
                      md: "1rem",
                      xs: "0.8rem",
                    },
                  }}
                >
                  Welcome to atlas! Please enter your details
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  mb={1}
                  mt={2}
                  py={1}
                  px={2}
                  gap={2}
                >
                  <TextField
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    label="First Name"
                    variant="outlined"
                    sx={{
                      width: {
                        lg: "16rem",
                        md: "15rem",
                        sm: "15rem",
                        xs: "15rem",
                      },
                      height: "40px",
                      "& .MuiInputBase-root": { height: "40px" },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      classes: {
                        root: "centered-placeholder",
                      },
                    }}
                  />
                  <TextField
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    label="Last Name"
                    variant="outlined"
                    sx={{
                      width: {
                        lg: "16rem",
                        md: "15rem",
                        sm: "15rem",
                        xs: "15rem",
                      },
                      height: "40px",
                      "& .MuiInputBase-root": { height: "40px" },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      classes: {
                        root: "centered-placeholder",
                      },
                    }}
                  />
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    variant="outlined"
                    sx={{
                      width: {
                        lg: "16rem",
                        md: "15rem",
                        sm: "15rem",
                        xs: "15rem",
                      },
                      height: "40px",
                      "& .MuiInputBase-root": { height: "40px" },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      classes: {
                        root: "centered-placeholder",
                      },
                    }}
                  />
                </Box>
                <TextField
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  label="Username"
                  className="w-[95.6%] mb-4"
                  sx={{
                    width: {
                      lg: "16rem",
                      md: "15rem",
                      sm: "15rem",
                      xs: "15rem",
                    },
                    height: "40px",
                    "& .MuiInputBase-root": {
                      height: "40px",
                      "& input::placeholder": {
                        textAlign: "center",
                        lineHeight: "40px",
                        marginBottom: "1rem",
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    classes: {
                      root: "centered-placeholder",
                    },
                  }}
                />

                <FormControl
                  variant="outlined"
                  className="w-[95.6%] mb-4"
                  sx={{
                    width: {
                      lg: "16rem",
                      md: "15rem",
                      sm: "15rem",
                      xs: "15rem",
                    },
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                    "& .MuiInputLabel-outlined": {
                      transform: "translate(14px, 16px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                        backgroundColor: "white",
                        padding: "0 4px",
                      },
                    },
                  }}
                >
                  {" "}
                  <InputLabel
                    id="role-select-label"
                    shrink
                    classes={{ root: "centered-placeholder" }}
                  >
                    Select a role
                  </InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    label="Select a role"
                  >
                    <MenuItem value="">
                      <strong>Select a role</strong>
                    </MenuItem>
                    <MenuItem value="headOfficer">HEAD OFFICER</MenuItem>
                    {/* <MenuItem value="faculty">FACULTY</MenuItem> */}
                    <MenuItem value="qualityAssurance">
                      QUALITY ASSURANCE
                    </MenuItem>
                  </Select>
                </FormControl>

                {role === "faculty" && (
                  <FormControl
                    variant="outlined"
                    className="w-[95.6%]"
                    sx={{
                      width: {
                        lg: "16rem",
                        md: "15rem",
                        sm: "15rem",
                        xs: "15rem",
                      },
                      height: "40px",
                      "& .MuiInputBase-root": { height: "40px" },
                      "& .MuiInputLabel-outlined": {
                        transform: "translate(14px, 16px) scale(1)",
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -6px) scale(0.75)",
                          backgroundColor: "white",
                          padding: "0 4px",
                        },
                      },
                    }}
                  >
                    {" "}
                    {/* Reduced width */}
                    <InputLabel
                      id="head-officer-select-label"
                      shrink
                      classes={{ root: "centered-placeholder" }}
                    >
                      Select Head Officer
                    </InputLabel>
                    <Select
                      labelId="head-officer-select-label"
                      value={selectedHead || ""}
                      onChange={(e) => setSelectedHead(e.target.value)}
                      label="Select Head Officer"
                    >
                      <MenuItem value="">
                        <strong>Select Head Officer</strong>
                      </MenuItem>
                      {Array.isArray(heads) &&
                        Array.from(new Set(heads.filter(Boolean))).map(
                          (headName, index) => (
                            <MenuItem key={index} value={headName}>
                              {headName}
                            </MenuItem>
                          )
                        )}
                    </Select>
                  </FormControl>
                )}

                {role !== "qualityAssurance" && (
                  <FormControl
                    variant="outlined"
                    className="w-[95.6%] mb-2"
                    sx={{
                      width: {
                        lg: "16rem",
                        md: "15rem",
                        sm: "15rem",
                        xs: "15rem",
                      },
                      height: "40px",
                      "& .MuiInputBase-root": { height: "40px" },
                      "& .MuiInputLabel-outlined": {
                        transform: "translate(14px, 16px) scale(1)",
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -6px) scale(0.75)",
                          backgroundColor: "white", // This ensures the label has a solid background
                          padding: "0 4px", // Add some padding around the label
                        },
                      },
                    }}
                  >
                    {" "}
                    {/* Reduced width */}
                    <InputLabel
                      id="department-select-label"
                      shrink
                      classes={{ root: "centered-placeholder" }}
                    >
                      Select a default department
                    </InputLabel>
                    <Select
                      labelId="department-select-label"
                      value={
                        selectedDepartment !== null
                          ? selectedDepartment.toString()
                          : ""
                      }
                      onChange={(e: SelectChangeEvent<string>) => {
                        const value = e.target.value;
                        const departmentId = value ? parseInt(value) : null; // Handle parsing
                        setSelectedDepartment(departmentId); // Set the state
                      }}
                      label="Select a default department"
                    >
                      <MenuItem value="">
                        <strong>Select a default department</strong>
                      </MenuItem>
                      {departments &&
                        departments
                          .filter(
                            (department: Department) =>
                              department.head_officer === selectedHead
                          )
                          .map((department) => (
                            <MenuItem key={department.id} value={department.id}>
                              {department.department_name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                )}

                <Box display="flex" alignItems="center" py={1} px={2} gap={2}>
                  <div className="flex flex-row w-[100%] gap-4">
                    {" "}
                    {/* Keep the row layout for the text fields */}
                    <div className="flex flex-col">
                      {" "}
                      {/* Wrap the password field and requirements in a column */}
                      <TextField
                        value={password}
                        onChange={handlePasswordChange}
                        onFocus={handlePasswordFocus} // Show requirements when focused
                        onBlur={handlePasswordBlur} // Hide requirements on blur
                        label="Password"
                        type="password"
                        variant="outlined"
                        sx={{
                          width: {
                            lg: "100%",
                            md: "14rem",
                            sm: "17rem",
                            xs: "10rem",
                          },
                          height: "40px",
                          "& .MuiInputBase-root": { height: "40px" },
                          mb: 1,
                        }}
                        InputLabelProps={{
                          shrink: true,
                          classes: {
                            root: "centered-placeholder",
                          },
                        }}
                      />
                      {/* Display password requirements */}
                      <div
                        className={`bg-white border border-gray-300 rounded-md p-2 shadow-lg ${
                          passwordRequirementsMet.show ? "" : "hidden"
                        }`}
                        style={{ zIndex: 1000, fontSize: "0.8rem" }} // Add z-index for overlay
                      >
                        <ul className="list-disc list-inside space-y-1">
                          <li
                            className={`${
                              passwordRequirementsMet.minLength
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            Minimum 8 characters
                          </li>
                          <li
                            className={`${
                              passwordRequirementsMet.uppercase
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            At least one uppercase letter
                          </li>
                          <li
                            className={`${
                              passwordRequirementsMet.lowercase
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            At least one lowercase letter
                          </li>
                          <li
                            className={`${
                              passwordRequirementsMet.number
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            At least one number
                          </li>
                          <li
                            className={`${
                              passwordRequirementsMet.specialChar
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            At least one special character
                          </li>
                        </ul>
                      </div>
                    </div>
                    <TextField
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      sx={{
                        width: {
                          lg: "71.6%",
                          md: "12.5rem",
                          sm: "15rem",
                          xs: "13rem",
                        },
                        height: "40px",
                        "& .MuiInputBase-root": { height: "40px" },
                        mb: 1,
                      }}
                      InputLabelProps={{
                        shrink: true,
                        classes: {
                          root: "centered-placeholder",
                        },
                      }}
                    />
                  </div>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    width: { lg: "95%", md: "95%", sm: "95%", xs: "95%" },
                    background: "linear-gradient(to left, #8a252c, #AB3510)",
                    fontSize: "18px",
                    mb: 2,
                  }}
                >
                  Sign Up
                </Button>
                <Typography
                  mb={1}
                  sx={{
                    fontSize: {
                      lg: "1rem",
                      sm: "1rem",
                      md: "1rem",
                      xs: "0.8rem",
                    },
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-black"
                    underline="hover"
                  >
                    Click here!
                  </Link>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: "100%",
                  height: "35rem",
                  display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
                  backgroundImage: `url('/landingbg.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4rem",
                  color: "white",
                  // position: "relative",
                  borderRadius: "20px",
                  textAlign: "center",
                  animation: "floatingBackground 10s ease-in-out infinite",
                  "@keyframes floatingBackground": {
                    "0%": { backgroundPosition: "center top" },
                    "50%": { backgroundPosition: "center bottom" },
                    "100%": { backgroundPosition: "center top" },
                  },
                }}
              >
                <Image src="/logo.png" alt="Logo" width={100} height={100} />
                <Typography
                  fontWeight="bold"
                  mb={2}
                  sx={{
                    fontSize: {
                      lg: "2rem",
                      sm: "2rem",
                      md: "2rem",
                      xs: "1.5rem",
                    },
                  }}
                >
                  Welcome to Atlas! <br /> Please login to your atlas account
                </Typography>
                <Typography
                  color="textSecondary"
                  textAlign="center"
                  sx={{
                    color: "white",
                    mb: 3,
                    fontSize: {
                      lg: "1rem",
                      sm: "1rem",
                      md: "1rem",
                      xs: "0.8rem",
                    },
                  }}
                >
                  Gain insights, track progress, and achieve your goals.
                </Typography>
                <Box
                  sx={{
                    borderRadius: "20px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                    overflow: "hidden", // This ensures the image is clipped to the rounded corners
                  }}
                >
                  <Image
                    src="/loginimg.png"
                    alt="Logo"
                    width={400}
                    height={400}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </StyledBox>
      </Box>

      <Modal
        open={errorModalOpen}
        onClose={handleCloseErrorModal}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Box
            sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              width: "25rem",
              textAlign: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleCancelSave}
              sx={{ position: "absolute", top: 8, right: 8 }}
            ></IconButton>
            <Typography
              sx={{
                fontWeight: "bold",
                mb: 3,
                fontSize: {
                  lg: "1.5rem",
                  sm: "1rem",
                  md: "1rem",
                  xs: "0.8rem",
                },
              }}
            >
              Attention!
            </Typography>
            <Typography
              id="error-modal-description"
              sx={{
                mb: 3,
                fontSize: { lg: "1rem", sm: "1rem", md: "1rem", xs: "0.8rem" },
              }}
            >
              {errorMessage}
            </Typography>
            <Button
              variant="contained"
              sx={{
                width: "50%",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                p: 1,
                fontSize: "13px",
              }}
              onClick={handleCloseErrorModal}
            >
              Enter again
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={successModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Box
            sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              width: "25rem",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Typography
              id="success-modal-title"
              sx={{
                fontWeight: "bold",
                mb: 3,
                fontSize: {
                  lg: "1.5rem",
                  sm: "1rem",
                  md: "1rem",
                  xs: "0.8rem",
                },
              }}
            >
              Success!
            </Typography>
            <Typography
              id="success-modal-description"
              sx={{
                mb: 3,
                fontSize: { lg: "1rem", sm: "1rem", md: "1rem", xs: "0.8rem" },
              }}
            >
              Account successfully created.
            </Typography>
            <Button
              variant="contained"
              sx={{
                width: "50%",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                p: 1,
                fontSize: "13px",
              }}
              onClick={handleCloseSuccessModal}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
