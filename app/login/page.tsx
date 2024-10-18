"use client";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
  Grid
} from "@mui/material";
import Image from 'next/image';
import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

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
              padding:5,
              textAlign: "center", 
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
            }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Login
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Welcome back! Please enter your details
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              mt={5}
              mb={3}
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
              mb={5}
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
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                width: "100%",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
                px:10,
                fontSize: '18px',
                mb:5,
                py:2
              }}
            >
              Login
            </Button>
            <Typography variant="h6" mb={2}>
              Don't have an account?{" "}
              <Typography
                component="a"
                href="/signup"
                fontWeight="bold"
                variant="h6"
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
      
    </Box>
  );
}
