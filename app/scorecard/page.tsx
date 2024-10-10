"use client";
import Navbar from "../components/Navbars/Navbar";
import React, { useState, useEffect } from "react";
import Financial from "../components/BSC/Financial";
import Learning from "../components/BSC/Learning";
import Stakeholder from "../components/BSC/Stakeholder";
import Internal from "../components/BSC/Internal";
import PrimaryFinancial from "../components/BSC/PrimaryFinancial";
import PrimaryStakeholder from "../components/BSC/PrimaryStakeholder";
import PrimaryInternal from "../components/BSC/PrimaryInternal";
import PrimaryLearning from "../components/BSC/PrimaryLearning";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  ListItem,
  Typography,
} from "@mui/material";

const ScorecardPage = () => {
  const [selectedComponent, setSelectedComponent] = useState("primary");
  const [primarySelectedComponent, setPrimarySelectedComponent] =
    useState("primary");
  const [currentView, setCurrentView] = useState("");

  // Store the selected component in local storage
  const changeComponent = (componentName: string) => {
    localStorage.setItem("lastComponent", componentName);
    setSelectedComponent(componentName);
  };

  const changePrimaryComponent = (componentName: string) => {
    localStorage.setItem("lastPrimaryComponent", componentName);
    setPrimarySelectedComponent(componentName);
  };

  // Store the selected view in local storage
  const changeView = (view: string) => {
    localStorage.setItem("lastView", view);
    setCurrentView(view);
  };

  useEffect(() => {
    const lastComponent = localStorage.getItem("lastComponent");
    const lastView = localStorage.getItem("lastView");
    const lastPrimaryComponent = localStorage.getItem("lastPrimaryComponent");

    if (lastComponent) {
      setSelectedComponent(lastComponent);
    }

    if (lastPrimaryComponent) {
      setPrimarySelectedComponent(lastPrimaryComponent);
    }

    if (lastView) {
      setCurrentView(lastView);
    }
  }, []);

  return (
    <Grid
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Grid>
        <Navbar />
      </Grid>
      <Grid
        container
        direction="column"
        sx={{
          mt: 2, // Add some margin at the top
          px: 2, // Optional: Add some padding on the left and right
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: "4rem",
              fontWeight: "bold",
              color: "#3B3B3B",
            }}
          >
            Balanced Scorecard
          </Typography>

          {/* View Buttons */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="18rem"
            height="4rem"
            borderRadius={2}
            sx={{ gap: 1, p: 0.5, borderWidth: 0.5 }}
          >
            <Button
              onClick={() => changeView("primary")}
              variant={currentView === "primary" ? "contained" : "outlined"}
              fullWidth
              sx={{
                background:
                  currentView === "primary"
                    ? "linear-gradient(to left, #8a252c, #AB3510)"
                    : "transparent",
                color: currentView === "primary" ? "white" : "#AB3510",
                flexGrow: 1, // Ensure both buttons have equal size
                height: "100%", // Match the height of the container
                border: "1px solid transparent", // Keep border style consistent
                transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                "&:hover": {
                  background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                  color: "white", // Change text color on hover
                  border:
                    currentView === "primary" ? "none" : "0.5px solid #AB3510", // Border on hover if not current
                },
              }}
            >
              PRIMARY
            </Button>
            <Button
              onClick={() => changeView("secondary")}
              variant={currentView === "secondary" ? "contained" : "outlined"}
              fullWidth
              sx={{
                background:
                  currentView === "secondary"
                    ? "linear-gradient(to left, #8a252c, #AB3510)"
                    : "transparent",
                color: currentView === "secondary" ? "white" : "#AB3510",
                flexGrow: 1, // Ensure both buttons have equal size
                height: "100%", // Match the height of the container
                border: "1px solid transparent", // Keep border style consistent
                transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                "&:hover": {
                  background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                  color: "white", // Change text color on hover
                  border:
                    currentView === "secondary"
                      ? "none"
                      : "0.5px solid #AB3510", // Border on hover if not current
                },
              }}
            >
              SECONDARY
            </Button>
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: "1.4rem",
          }}
        >
          Explore the Balanced Scorecard feature to gain a comprehensive view of
          your organization&apos;s performance across different dimensions. Use
          it to set clear objectives, track progress, and drive strategic
          initiatives for success.
        </Typography>

        {currentView === "primary" && (
          <Grid container>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="4rem"
              borderRadius={2}
              sx={{ gap: 1, p: 0.5, borderWidth: 0.5, mt: 2, mb: 1 }}
            >
              <Button
                onClick={() => changePrimaryComponent("Financial")}
                sx={{
                  background:
                    primarySelectedComponent === "Financial"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color:
                    primarySelectedComponent === "Financial"
                      ? "white"
                      : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      primarySelectedComponent === "Financial"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Financial
              </Button>
              <Button
                onClick={() => changePrimaryComponent("Stakeholder")}
                sx={{
                  background:
                    primarySelectedComponent === "Stakeholder"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color:
                    primarySelectedComponent === "Stakeholder"
                      ? "white"
                      : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      primarySelectedComponent === "Stakeholder"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Stakeholder
              </Button>
              <Button
                onClick={() => changePrimaryComponent("Internal")}
                sx={{
                  background:
                    primarySelectedComponent === "Internal"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color:
                    primarySelectedComponent === "Internal"
                      ? "white"
                      : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      primarySelectedComponent === "Internal"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Internal
              </Button>
              <Button
                onClick={() => changePrimaryComponent("Learning")}
                sx={{
                  background:
                    primarySelectedComponent === "Learning"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color:
                    primarySelectedComponent === "Learning"
                      ? "white"
                      : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      primarySelectedComponent === "Learning"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Learning
              </Button>
            </Box>
            <Box width="100%">
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  {primarySelectedComponent === "Financial" && (
                    <PrimaryFinancial />
                  )}
                  {primarySelectedComponent === "Stakeholder" && (
                    <PrimaryStakeholder />
                  )}
                  {primarySelectedComponent === "Internal" && (
                    <PrimaryInternal />
                  )}
                  {primarySelectedComponent === "Learning" && (
                    <PrimaryLearning />
                  )}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )}
        {currentView === "secondary" && (
          <Grid container>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="4rem"
              borderRadius={2}
              sx={{ gap: 1, p: 0.5, borderWidth: 0.5, mt: 2, mb: 1 }}
            >
              <Button
                onClick={() => changeComponent("Financial")}
                sx={{
                  background:
                    selectedComponent === "Financial"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color:
                    selectedComponent === "Financial" ? "white" : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      selectedComponent === "Financial"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Financial
              </Button>
              <Button
                onClick={() => changeComponent("Stakeholder")}
                sx={{
                  background:
                    selectedComponent === "Stakeholder"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color:
                    selectedComponent === "Stakeholder" ? "white" : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      selectedComponent === "Stakeholder"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Stakeholder
              </Button>
              <Button
                onClick={() => changeComponent("Internal")}
                sx={{
                  background:
                    selectedComponent === "Internal"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color: selectedComponent === "Internal" ? "white" : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      selectedComponent === "Internal"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Internal
              </Button>
              <Button
                onClick={() => changeComponent("Learning")}
                sx={{
                  background:
                    selectedComponent === "Learning"
                      ? "linear-gradient(to left, #8a252c, #AB3510)"
                      : "transparent",
                  color: selectedComponent === "Learning" ? "white" : "#AB3510",
                  fontWeight: "bold",
                  height: "100%", // Match the height of the container
                  border: "1px solid transparent", // Keep border style consistent
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                  "&:hover": {
                    background: "linear-gradient(to left, #8a252c, #AB3510)", // Change background on hover
                    color: "white", // Change text color on hover
                    border:
                      selectedComponent === "Learning"
                        ? "none"
                        : "0.5px solid #AB3510", // Border on hover if not current
                  },
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: 2,
                }}
              >
                Learning
              </Button>
            </Box>
            <Box width="100%">
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  {selectedComponent === "Financial" && <Financial />}
                  {selectedComponent === "Stakeholder" && <Stakeholder />}
                  {selectedComponent === "Internal" && <Internal />}
                  {selectedComponent === "Learning" && <Learning />}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default ScorecardPage;
