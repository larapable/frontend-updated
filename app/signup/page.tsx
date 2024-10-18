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
import Image from 'next/image';
import styled from "@emotion/styled";
import { signIn } from "next-auth/react";
import Spinner from "../components/Misc/Spinner";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import CloseIcon from "@mui/icons-material/Close";

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
<<<<<<< HEAD
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/userExists`,
=======
        "http://3.107.42.174:8080/user/userExists",
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
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
<<<<<<< HEAD
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/insert`,
        // role === "qualityAssurance"
        //   ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/qauser/insert`
        //   : `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/insert`,
=======
        "http://3.107.42.174:8080/user/insert",
        // role === "qualityAssurance"
        //   ? "http://3.107.42.174:8080/qauser/insert"
        //   : "http://3.107.42.174:8080/user/insert",
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
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
<<<<<<< HEAD
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartments`
=======
        "http://3.107.42.174:8080/department/getAllDepartments"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
      );
      const data = await res.json();
      setDepartments(data.departments);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchHeadDepartments = async () => {
      const res = await fetch(
<<<<<<< HEAD
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartmentsHead`
=======
        "http://3.107.42.174:8080/department/getAllDepartmentsHead"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
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
          <Grid item xs={12} md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center", 
              padding: "4rem", 
            }}
          >
            <Box sx={{
              border: '1px solid #ee552a',
              borderRadius: '2rem',
              width: '40rem',
              // height: '40rem',
              padding:5,
              textAlign: "center", 
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
              // overflowY: "auto"
            }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Sign Up
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Welcome to atlas! Please enter your details
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              mt={2}
              mb={1}
              py={1}
              px={2}
              gap={2}
            >
             <TextField
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              label="First Name"
              variant="outlined"
              className="w-[17rem]"
              InputLabelProps={{ className: "font-medium" }}
              InputProps={{ className: "placeholder-[#807979]" }}
            />
            <TextField
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              label="Last Name"
              variant="outlined"
              className="w-[17rem]"
              InputLabelProps={{ className: "font-medium" }}
              InputProps={{ className: "placeholder-[#807979]" }}
            />
            </Box>
            <FormControl variant="outlined" className="w-[33rem] mb-4">
              {" "}
              <InputLabel id="role-select-label">Select a role</InputLabel>
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
                <MenuItem value="qualityAssurance">QUALITY ASSURANCE</MenuItem>
              </Select>
            </FormControl>

            {role === "faculty" && (
              <FormControl variant="outlined" className="w-[33rem] mb-4">
                  {" "}
                  {/* Reduced width */}
                  <InputLabel id="head-officer-select-label">
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
              <FormControl variant="outlined" className="w-[33rem] mb-4">
                {" "}
                {/* Reduced width */}
                <InputLabel id="department-select-label">
                  Select a default department
                </InputLabel>
                <Select
                  labelId="department-select-label"
                  value={
                    selectedDepartment !== null ? selectedDepartment.toString() : ""
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

              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                variant="outlined"
                className="w-[33rem] mb-4"
                InputLabelProps={{ className: "font-medium" }}
                InputProps={{ className: "placeholder-[#807979]" }}
              />
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label="Username"
                variant="outlined"
                className="w-[33rem] mb-2"
                InputLabelProps={{ className: "font-medium" }}
                InputProps={{ className: "placeholder-[#807979]" }}
              />

            <Box
              display="flex"
              alignItems="center"
              mb={3}
              py={1}
              px={2}
              gap={2}
            >
              <div className="flex flex-row space-x-4">
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
                  className="w-[16rem] mb-1" // Add margin bottom for spacing
                  InputLabelProps={{ className: "font-medium" }}
                  InputProps={{ className: "placeholder-[#807979]" }}
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
                className="w-[16rem]"
                InputLabelProps={{ className: "font-medium" }}
                InputProps={{ className: "placeholder-[#807979]" }}
              />
            </div>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                width: "100%",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                px:10,
                fontSize: '18px',
                mb:2,
                py:2,
                mt:1
              }}
            >
              Sign Up
            </Button>
            <Typography variant="h6" mb={1}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-black"
                underline="hover"
              >
                Click here!
              </Link>
            </Typography>
            <Box display="flex" alignItems="center" width="100%">
              <Divider sx={{ flex: 1, bgcolor: "#807979" }} />
              <Typography sx={{ mx: 2 }}>or</Typography>
              <Divider sx={{ flex: 1, bgcolor: "#807979" }} />
            </Box>
            <Button
              href="/"
              sx={{
                color: "#AB3510",
                fontWeight: "bold",
                fontSize: "20px",
                textDecoration: "underline",
              }}
            >
              Back Home
            </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}
            sx={{
              backgroundImage: `url('/landingbg.png')`, 
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem",
              color: "white",
              position: "relative",
              borderRadius: "20px",
              textAlign: "center", 
              animation: "floatingBackground 10s ease-in-out infinite",
              "@keyframes floatingBackground": {
                "0%": { backgroundPosition: "center top" },
                "50%": { backgroundPosition: "center bottom" },
                "100%": { backgroundPosition: "center top" },
              }}}

          >
            <Image src="/logo.png" alt="Logo" width={150} height={150}/>
            <Typography variant="h4" fontWeight="bold" mt={3} mb={3}>
              Welcome to Atlas! <br/> Please login to your atlas account
            </Typography>
            <Typography color="textSecondary" textAlign="center" sx={{fontSize: '18px', color:'white', mb:5}}>
              Gain insights, track progress, and achieve your goals.
            </Typography>
            <Box
              sx={{
                borderRadius: "20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                overflow: "hidden", // This ensures the image is clipped to the rounded corners
              }}
            >
              <Image src="/loginimg.png" alt="Logo" width={800} height={400} />
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
              width: "40rem",
              textAlign: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleCancelSave}
              sx={{ position: "absolute", top: 8, right: 8 }}
            ></IconButton>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Attention!
            </Typography>
            <Typography id="error-modal-description" variant="h5" sx={{ mb: 5 }}>
              {errorMessage}
            </Typography>
            <Button
              variant="contained"
              sx={{
                width: "30%",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                p:1,
                fontSize: '18px',
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
              width: "40rem",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Typography
              id="success-modal-title"
              variant="h4"
              component="h2"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Success!
            </Typography>
            <Typography id="success-modal-description" variant="h5" sx={{ mb: 5 }}>
              Account successfully created.
            </Typography>
            <Button
              variant="contained"
              sx={{
                width: "30%",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                p:1,
                fontSize: '18px',
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