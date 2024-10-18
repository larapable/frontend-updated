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
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  ListItem,
  Typography,
} from "@mui/material";

// Define a type for the target years
type TargetYearsResponse = {
  target_year: string[]; 
};

const ScorecardPage = () => {
  const { data: session, status } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name);
  const departmentId = user?.department_id;

  const [selectedComponent, setSelectedComponent] = useState("primary");
  const [primarySelectedComponent, setPrimarySelectedComponent] =
    useState("primary");
  const [currentView, setCurrentView] = useState("");
  // To store the available years
  const [selectedYear, setSelectedYear] = useState("");
  const [targetYears, setTargetYears] = useState<string[]>([]);  



  useEffect(() => {
    const fetchTargetYears = async () => {
      if (departmentId) {
        try {
          const [
            financialResponse,
            internalResponse,
            learningResponse,
            stakeholderResponse,
          ] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getFinancialTargetYears/${departmentId}`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getInternalTargetYears/${departmentId}`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getLearningTargetYears/${departmentId}`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getStakeholderTargetYears/${departmentId}`),
          ]);
  
          const [financialData, internalData, learningData, stakeholderData] = await Promise.all([
            financialResponse.json(),
            internalResponse.json(),
            learningResponse.json(),
            stakeholderResponse.json(),
          ]);
  
          const allData = [
            ...financialData,
            ...internalData,
            ...learningData,
            ...stakeholderData,
          ];
  
          const uniqueYears = ["Select Year"]
            .concat([...new Set(allData.map((entity) => entity.targetYear))]);
          setTargetYears(uniqueYears);
          console.log("Years: ", uniqueYears);
          setSelectedYear("Select Year");
        } catch (error) {
          console.error("Error fetching target years:", error);
        }
      }
    };
  
    fetchTargetYears();
  }, [departmentId]);

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

// Set the selected year to the new value from the dropdown  
  const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value); 
  };

  return (
    <Grid
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        color: "#2e2c2c",
      }}
    >
      <Grid>
        <Navbar />
      </Grid>
      <Grid
        container
        direction="column"
        sx={{
          mt: 3, // Add some margin at the top
          px: 3, // Optional: Add some padding on the left and right
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
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              fontSize: { xs: "2rem", sm: "3.5rem" },
            }}
          >
            BALANCED SCORECARD
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
                p:3,
                fontSize: '18px',
                background:
                  currentView === "primary"
                    ? "linear-gradient(to left, #8a252c, #AB3510)"
                    : "transparent",
                color: currentView === "primary" ? "white" : "#AB3510",
                flexGrow: 2, // Ensure both buttons have equal size
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
                p:3,
                fontSize: '18px',
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
        <Typography variant="h5">
          Explore the Balanced Scorecard feature to gain a comprehensive view of
          your organization&apos;s performance across different dimensions. Use
          it to set clear objectives, track progress, and drive strategic
          initiatives for success.
        </Typography>

        {/* Year Dropdown */}
        <div className="mb-4 mt-10">
          <label htmlFor="year-select" className="mr-2 text-lg font-medium">
            Select Year:
          </label>
          <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          className="border border-gray-300 rounded-md p-2"
          key={selectedYear} // Add the key prop here 
        >
          {targetYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

        {currentView === "primary" && (
          <Grid container>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="4rem"
              borderRadius={2}
              sx={{ gap: 1, p: 0.5, borderWidth: 0.5, mt: 5}}
            >
              <Button
                onClick={() => changePrimaryComponent("Financial")}
                sx={{
                  p:3,
                  fontSize: '18px',
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
                  p:3,
                  fontSize: '18px',
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
                  p:3,
                  fontSize: '18px',
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
                  p:3,
                  fontSize: '18px',
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
                <PrimaryFinancial 
                selectedYear={selectedYear}  />
                )}
                  {primarySelectedComponent === "Stakeholder" && (
                    <PrimaryStakeholder 
                    selectedYear={selectedYear}/>
                  )}
                  {primarySelectedComponent === "Internal" && (
                  <PrimaryInternal 
                  selectedYear={selectedYear} />
                  )}
                  {primarySelectedComponent === "Learning" && (
                    <PrimaryLearning 
                    selectedYear={selectedYear}/>
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
              sx={{ gap: 1, p: 0.5, borderWidth: 0.5, mt: 5 }}
            >
              <Button
                onClick={() => changeComponent("Financial")}
                sx={{
                  p:3,
                  fontSize: '18px',
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
                  p:3,
                  fontSize: '18px',
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
                  p:3,
                  fontSize: '18px',
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
                  p:3,
                  fontSize: '18px',
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
              {selectedComponent === "Financial" && (
              <Financial 
              selectedYear={selectedYear}  />
              )}
              {selectedComponent === "Stakeholder" && (
              <Stakeholder 
              selectedYear={selectedYear}  />
              )}
              {selectedComponent === "Internal" && (
              <Internal 
              selectedYear={selectedYear}  />
              )}
              {selectedComponent === "Learning" && (
              <Learning 
              selectedYear={selectedYear}  />
              )}
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
