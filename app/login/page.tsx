"use client";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import Spinner from "../components/Misc/Spinner";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import CloseIcon from "@mui/icons-material/Close";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const reCaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleCaptchaVerify = (response: string) => {
    setCaptchaVerified(true);
    console.log("reCAPTCHA verified:", response); // Optional: for debugging
  };

  const handleCaptchaExpired = () => {
    setCaptchaVerified(false);
    console.log("reCAPTCHA expired"); // Optional: for debugging
  };

  const handleCancelSave = () => {
    setErrorModalOpen(false);
  };

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage(
        "You have left a field empty. Please take a moment to complete all the necessary information."
      );
      setErrorModalOpen(true);
      return;
    }

    // if (!captchaVerified) {
    //   setErrorMessage("Please verify the reCAPTCHA.");
    //   setErrorModalOpen(true);
    //   return;
    // }

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res && res.error) {
        setErrorMessage(
          "We're sorry, but the credentials you entered are incorrect. Please double-check your username and password and try again."
        );
        setErrorModalOpen(true);
        setLoading(false);
        // Reset reCAPTCHA after failed login
        // if (reCaptchaRef.current) {
        //   // Use the reset method from the grecaptcha object
        //   window.grecaptcha.reset(reCaptchaRef.current.getValue());
        //   setCaptchaVerified(false);
        // }
        return;
      } else {
        const user = JSON.parse(session?.user?.name as string);
        if (user?.role === "admin") {
          router.replace("/admindashboard");
        } else if (user?.role === "qualityAssurance") {
          router.replace("/qaprofileview");
        } else {
          router.replace("/profile");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(
        "An unexpected error occurred during login. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (status === "authenticated") {
    const user = JSON.parse(session?.user?.name as string);
    if (user?.role === "admin") {
      router.replace("/admindashboard");
    } else if (user?.role === "qualityAssurance") {
      router.replace("/qaprofileview");
    } else {
      router.replace("/profile");
    }
    return null;
  }

  return (
    <Box
      justifyContent="center"
      height="100vh"
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
        <Typography variant="h3" fontWeight="bold" mb={4}>
          Login
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          py={1}
          px={2}
          width="35rem"
          border="1px solid rgba(0, 0, 0, 0.6)"
          borderRadius="8px"
        >
          <img
            src="/usernamelogo.png"
            alt="Username"
            width={28}
            height={28}
            style={{ marginRight: 16 }}
          />
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            fullWidth
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          py={1}
          px={2}
          width="35rem"
          border="1px solid rgba(0, 0, 0, 0.6)"
          borderRadius="8px"
        >
          <img
            src="/passwordlogo.png"
            alt="Password"
            width={28}
            height={28}
            style={{ marginRight: 16 }}
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            fullWidth
          />
        </Box>
        <Box display="flex" gap={3} mb={2}>
          {/* <ReCAPTCHA
            ref={reCaptchaRef}
            sitekey="6LdT5T0qAAAAADX-EG0m12My_ZFX1PlPYZzLLwZf"
            onChange={(token) => {
              setCaptchaVerified(!!token);
              console.log("reCAPTCHA verified:", token);
            }}
            onExpired={handleCaptchaExpired}
          /> */}
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(to left, #8a252c, #AB3510)",
              fontWeight: "bold",
            }}
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(to left, #8a252c, #AB3510)",
              borderRadius: "8px",
              padding: "12px 24px",
              width: "14rem",
              height: "3rem",
              "&:hover": {
                backgroundColor: "#eec160",
              },
            }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body1" mb={2}>
          Don't have an account?{" "}
          <Typography
            component="a"
            href="/signup"
            fontWeight="bold"
            sx={{ textDecoration: "underline", color: "black" }}
          >
            Click here!
          </Typography>
        </Typography>
        <Box display="flex" alignItems="center" width="100%">
          <Divider sx={{ flex: 1, bgcolor: "#807979" }} />
          <Typography sx={{ mx: 2 }}>or</Typography>
          <Divider sx={{ flex: 1, bgcolor: "#807979" }} />
        </Box>
        <Button
          href="/"
          sx={{
            mt: 2,
            color: "#8a252c",
            fontWeight: "bold",
            fontSize: "20px",
            textDecoration: "underline",
          }}
        >
          Back Home
        </Button>
      </Box>
      <Box
        sx={{
          background: "linear-gradient(to left, #8a252c, #AB3510)",
          display: "flex",
          flexDirection: "column",
          alignItems: "justify",
          justifyContent: "center",
          height: "auto",
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
    </Box>
  );
}
