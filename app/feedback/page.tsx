"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import SpinnerPages from "../components/Misc/SpinnerPages";
import Navbar from "../components/Navbars/Navbar";
import UserProfile from "../components/Profile/UserProfile";
import { useRouter } from "next/navigation";
import Spinner from "../components/Misc/Spinner";
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
import styled from "@emotion/styled";
import Image from "next/image";

const drawerWidth = 310;

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

const FeelingButtonsContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  padding: "20px",
  marginTop: "10px",
  border: "1px solid #ccc", // Add border
  borderRadius: "8px", // Add border radius
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add shadow
});

const FeelingButton = styled(Button)({
  borderRadius: "50%",
  width: "80px",
  height: "80px",
  fontSize: "3rem",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#FFCC80",
  },
  margin: "0 10px",
});

type Feeling = "HAPPY" | "NEUTRAL" | "SAD" | "MAD";
type SatisfactionRating =
  | "VERY_SATISFIED"
  | "SATISFIED"
  | "NEUTRAL"
  | "UNSATISFIED"
  | "VERY_UNSATISFIED";
type SatisfactionAspect = "friendliness" | "knowledge" | "quickness";

interface SatisfactionState {
  friendliness: SatisfactionRating | "";
  knowledge: SatisfactionRating | "";
  quickness: SatisfactionRating | "";
}

const FeedbackForm: React.FC = () => {
  const [feeling, setFeeling] = useState<Feeling | "">("");
  const [satisfaction, setSatisfaction] = useState<SatisfactionState>({
    friendliness: "",
    knowledge: "",
    quickness: "",
  });
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const handleCancelSave = () => {
    setShowModal(false);
  };

  const { data: session } = useSession();
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name);
  const department_id = user?.department_id;

  const formatRating = (rating: SatisfactionRating): string => {
    return rating
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleSatisfactionChange = (
    aspect: SatisfactionAspect,
    value: SatisfactionRating
  ) => {
    setSatisfaction((prev) => ({ ...prev, [aspect]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!feeling) {
      setModalMessage("Please do not forget to select how you are feeling.");
      setShowErrorModal(true);
      return;
    }
    if (
      !satisfaction.friendliness ||
      !satisfaction.knowledge ||
      !satisfaction.quickness
    ) {
      setModalMessage(
        "Please do not forget to rate all aspects of satisfaction."
      );
      setShowErrorModal(true);
      return;
    }
    if (!feedback.trim()) {
      setModalMessage("Please do not forget to provide your overall feedback.");
      setShowErrorModal(true);
      return;
    }

    const feedbackData = {
      feeling: feeling.toUpperCase(),
      friendliness: satisfaction.friendliness,
      knowledge: satisfaction.knowledge,
      quickness: satisfaction.quickness,
      overallFeedback: feedback,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/feedback?departmentId=${department_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackData),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const result = await response.json();
      console.log("Feedback submitted successfully:", result);

      // Reset form fields and state
      setFeeling("");
      setSatisfaction({
        friendliness: "",
        knowledge: "",
        quickness: "",
      });
      setFeedback("");
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // alert('Failed to submit feedback. Please try again.');
      setModalMessage("Failed to submit feedback. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
                  fontSize: { xs: "2rem", sm: "3.5rem" },
                }}
              >
                FEEDBACK FORM
              </Typography>
              <Typography 
                variant="h5"
                sx={{
                  marginBottom: 2,
                }}
              >
                We value your input! Let us know how you feel about using the
                app, rate different aspects of our service, and provide any
                additional comments. Your feedback is crucial in helping us
                improve and ensure that we meet your needs effectively.{" "}
                <span className="font-bold">
                  Thank you for taking the time to help us enhance your
                  experience!
                </span>
              </Typography>
            </Grid>

            <Grid
              item
              sx={{
                flexGrow: 1,
                width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    textAlign: "center",
                    background: "#A43214",
                    borderRadius: 2,
                    p: 2,
                    mb: -2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 500, color: "white" }}
                  >
                    How are you feeling?
                  </Typography>
                </Box>
                <FeelingButtonsContainer
                  sx={{ background: "#ffffff", borderRadius: 2, width: "100%" }}
                >
                  {[
                    {
                      emoji: "😊",
                      feeling: "HAPPY" as Feeling,
                      color: "#f8da90",
                    },
                    {
                      emoji: "😐",
                      feeling: "NEUTRAL" as Feeling,
                      color: "#f8da90",
                    },
                    {
                      emoji: "😢",
                      feeling: "SAD" as Feeling,
                      color: "#f8da90",
                    },
                    {
                      emoji: "😡",
                      feeling: "MAD" as Feeling,
                      color: "#f8da90",
                    },
                  ].map(({ emoji, feeling: feelingValue, color }) => (
                    <FeelingButton
                      key={feelingValue}
                      variant="outlined"
                      style={{
                        borderColor:
                          feeling === feelingValue ? "orange" : color,
                      }}
                      onClick={() => setFeeling(feelingValue)}
                      sx={{
                        backgroundColor:
                          feeling === feelingValue ? color : "transparent",
                        color: feeling === feelingValue ? "white" : color,
                        borderColor: color,
                      }}
                    >
                      {emoji}
                    </FeelingButton>
                  ))}
                </FeelingButtonsContainer>

                <Box
                  sx={{
                    textAlign: "center",
                    background: "#A43214",
                    borderRadius: 2,
                    p: 2,
                    mb: -2,
                    mt: 5,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 500, color: "white" }}
                  >
                    Overall Satisfaction of Service
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    overflowX: "auto",
                    mt: 1,
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    <table className="border-collapse w-full align-center rounded-md shadow-md border-[#ccc]">
                      <thead>
                        <tr>
                          <th className="border p-2">Aspect</th>
                          <th className="border p-2">Very Satisfied</th>
                          <th className="border p-2">Satisfied</th>
                          <th className="border p-2">Neutral</th>
                          <th className="border p-2">Unsatisfied</th>
                          <th className="border p-2">Very Unsatisfied</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          ["Friendliness", "Knowledge", "Quickness"] as const
                        ).map((aspect) => (
                          <tr key={aspect}>
                            <td className="border p-2 text-center">{aspect}</td>
                            {(
                              [
                                "VERY_SATISFIED",
                                "SATISFIED",
                                "NEUTRAL",
                                "UNSATISFIED",
                                "VERY_UNSATISFIED",
                              ] as const
                            ).map((rating) => (
                              <td
                                key={rating}
                                className="border p-2 text-center"
                              >
                                <input
                                  type="radio"
                                  name={aspect}
                                  value={rating}
                                  onChange={() =>
                                    handleSatisfactionChange(
                                      aspect.toLowerCase() as SatisfactionAspect,
                                      rating
                                    )
                                  }
                                  checked={
                                    satisfaction[
                                      aspect.toLowerCase() as SatisfactionAspect
                                    ] === rating
                                  }
                                  style={{
                                    opacity: 100,
                                    width: "1.5rem",
                                    height: "1.5rem",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    textAlign: "center",
                    background: "#A43214",
                    borderRadius: "8px",
                    p: 2,
                    mb: -2,
                    mt: 5,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 500, color: "white" }}
                  >
                    Overall Feedback
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    overflowX: "auto",
                    mt: 1,
                    background: "white",
                  }}
                >
                  <Typography variant="h6" sx={{fontWeight: '500'}}>
                    <textarea
                      className="w-full p-2 border rounded-md shadow-md border-[#ccc]"
                      rows={4}
                      value={feedback}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setFeedback(e.target.value)
                      }
                      placeholder="Please provide your feedback here..."
                    ></textarea>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 5,
                  }}
                >
                  <Button
                    type="submit"
                    sx={{ py:2, px:5, fontSize: "18px" }}
                    style={{
                      background: "linear-gradient(to left, #8a252c, #AB3510)",
                      color: "white",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Now"}
                  </Button>
                </Box>
              </form>

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
                      Success!
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      Your feedback has been submitted successfully.
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
                          width: "auto",
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                        }}
                      >
                        Close
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Modal>

              <Modal
                open={showErrorModal}
                onClose={() => setShowErrorModal(false)}
              >
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
                      maxWidth: "100vw", // Limit modal width to 80% of viewport width
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
                        onClick={() => setShowErrorModal(false)}
                        sx={{
                          width: "30%",
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
            </Grid>
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
};

export default FeedbackForm;
