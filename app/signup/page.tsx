"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
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
import { useRouter } from "next/navigation";
import Spinner from "../components/Misc/Spinner";

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
        "http://localhost:8080/user/userExists",
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
        "http://localhost:8080/user/insert",
        // role === "qualityAssurance"
        //   ? "http://localhost:8080/qauser/insert"
        //   : "http://localhost:8080/user/insert",
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
        "http://localhost:8080/department/getAllDepartments"
      );
      const data = await res.json();
      setDepartments(data.departments);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchHeadDepartments = async () => {
      const res = await fetch(
        "http://localhost:8080/department/getAllDepartmentsHead"
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
      justifyContent="center"
      height="auto"
      display="flex"
      flexDirection={{ lg: "row", md: "column" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        // mt={{ lg: 20, md: 10 }}
        // ml={{ lg: 15, md: 3 }}
        mx="auto" // Center the Box horizontally
      >
        <Typography variant="h4" fontWeight="bold" mb={5}>
          {" "}
          {/* Changed h2 to h4 for smaller size */}
          Sign Up
        </Typography>

        <div className="flex flex-row space-x-4 mt-[-1rem]">
          {" "}
          {/* Reduced space between fields */}
          <TextField
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            label="First Name"
            variant="outlined"
            className="w-[14.5rem] mb-4"
            InputLabelProps={{ className: "font-medium" }}
            InputProps={{ className: "placeholder-[#807979]" }}
          />
          <TextField
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            label="Last Name"
            variant="outlined"
            className="w-[14.5rem] mb-4"
            InputLabelProps={{ className: "font-medium" }}
            InputProps={{ className: "placeholder-[#807979]" }}
          />
        </div>

        <FormControl variant="outlined" className="w-[30rem] mb-4">
          {" "}
          {/* Reduced width */}
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
          <FormControl variant="outlined" className="w-[30rem] mb-4">
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
          <FormControl variant="outlined" className="w-[30rem] mb-4">
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
          className="w-[30rem] mb-4"
          InputLabelProps={{ className: "font-medium" }}
          InputProps={{ className: "placeholder-[#807979]" }}
        />

        <TextField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
          variant="outlined"
          className="w-[30rem] mb-4"
          InputLabelProps={{ className: "font-medium" }}
          InputProps={{ className: "placeholder-[#807979]" }}
        />

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
              className="w-[14.5rem] mb-1" // Add margin bottom for spacing
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
            className="w-[14.5rem]"
            InputLabelProps={{ className: "font-medium" }}
            InputProps={{ className: "placeholder-[#807979]" }}
          />
        </div>

        <Button
          variant="contained"
          style={{
            background: "linear-gradient(to left, #8a252c, #AB3510)",
            fontWeight: "bold",
            marginTop: "1rem",
            marginBottom: "1rem",
            width: "29.5rem",
          }}
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(to left, #8a252c, #AB3510)",
            borderRadius: "8px",
            padding: "12px 24px",
            width: "14rem",
            height: "2.5rem",
            "&:hover": {
              backgroundColor: "#eec160",
            },
          }}
        >
          Sign Up
        </Button>

        <Box textAlign="center" mb={2}>
          <Typography variant="body1" className="font-light">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-black"
              underline="hover"
            >
              Log in
            </Link>
          </Typography>

          <Box display="flex" alignItems="center" mt={2}>
            <Divider
              sx={{
                flex: 1,
                bgcolor: "#807979",
                height: "2px",
                width: "12rem",
              }}
            />
            <Typography variant="body1" className="mx-4 font-bold">
              or
            </Typography>
            <Divider
              sx={{
                flex: 1,
                bgcolor: "#807979",
                height: "2px",
                width: "12rem",
              }}
            />
          </Box>
        </Box>

        <a
          href="/"
          className="text-xl text-[#8a252c] font-bold lg:mt-4 md:mb-16 hover:underline"
        >
          Back Home
        </a>
      </Box>

      <Box
        sx={{
          background: "linear-gradient(to left, #8a252c, #AB3510)",
          display: "flex",
          flexDirection: "column",
          alignItems: "justify",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <img
          src="wc-screen-scorecard.png"
          alt="Scorecard"
          style={{ width: 100, height: 100, marginLeft: 50 }}
        />
        <Typography
          variant="h6"
          color="white"
          sx={{
            px: 4,
            mb: 4,
            textAlign: "justify",
            fontWeight: "bold",
            mt: 4,
            mr: 4,
            ml: 4,
          }}
        >
          <span style={{ color: "#fad655" }}>Track key metrics</span>, analyze
          trends, and make informed decisions to drive success.
        </Typography>
        <img
          src="wc-screen-swot.png"
          alt="SWOT"
          style={{ width: 100, height: 100, marginLeft: 50 }}
        />
        <Typography
          variant="h6"
          color="white"
          sx={{
            px: 4,
            mb: 4,
            textAlign: "justify",
            fontWeight: "bold",
            mt: 4,
            mr: 4,
            ml: 4,
          }}
        >
          <span style={{ color: "#fad655" }}>
            Identify strength, weaknesses, opportunities, and threats
          </span>{" "}
          to your business.
        </Typography>
        <img
          src="wc-screen-stratmap.png"
          alt="Strategy"
          style={{ width: 100, height: 100, marginLeft: 50 }}
        />
        <Typography
          variant="h6"
          color="white"
          sx={{
            px: 4,
            mb: 4,
            textAlign: "justify",
            fontWeight: "bold",
            mt: 4,
            mr: 4,
            ml: 4,
          }}
        >
          <span style={{ color: "#fad655" }}>Define objectives</span>, outline
          initiatives, and map out your path to success.
        </Typography>
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
              id="error-modal-title"
              variant="h4"
              fontWeight="bold"
              mb={2}
            >
              Attention!
            </Typography>
            <Typography id="error-modal-description" variant="body1" mb={2}>
              {errorMessage}
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                borderRadius: "8px",
                padding: "12px 24px",
                width: "14rem",
                height: "2.5rem",
                color: "white",
                mt: 2,
                "&:hover": {
                  backgroundColor: "#eec160",
                },
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
              fontWeight="bold"
              mb={2}
            >
              Success!
            </Typography>
            <Typography
              id="success-modal-description"
              variant="h6"
              mb={4}
              mt={2}
            >
              Account successfully created.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                borderRadius: "8px",
                padding: "12px 24px",
                width: "14rem",
                height: "2.5rem",
                color: "white",
                mt: 2,
                "&:hover": {
                  backgroundColor: "#eec160",
                },
              }}
              onClick={handleCloseSuccessModal}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
