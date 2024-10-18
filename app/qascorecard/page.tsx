"use client";
import React, { useState, useEffect } from "react";
import QANavbar from "../components/Navbars/QANavbar";
import QAPrimaryFinancial from "../components/QABSC/QAPrimaryFinancial";
import QAPrimaryStakeholder from "../components/QABSC/QAPrimaryStakeholder";
import QAPrimaryInternal from "../components/QABSC/QAPrimaryInternal";
import QAPrimaryLearning from "../components/QABSC/QAPrimaryLearning";
import { toast } from "react-toastify";
import Select from "react-select"; // Import react-select
import { useSession } from "next-auth/react";
import QAFinancial from "../components/QABSC/QAFinancial";
import QAStakeholder from "../components/QABSC/QAStakeholder";
import QAInternal from "../components/QABSC/QAInternal";
import QALearning from "../components/QABSC/QALearning";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  ListItem,
  Typography,
} from "@mui/material";

interface Department {
  id: number;
  department_name: string;
}

// Define a type for the target years
type TargetYearsResponse = {
  target_year: string[];
};

const QAScorecard = () => {
  const { data: session, status, update } = useSession();
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [currentView, setCurrentView] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(1);
  // To store the available years
  const [selectedYear, setSelectedYear] = useState("");
  const [targetYears, setTargetYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchTargetYears = async () => {
      if (selectedDepartmentId) {
        try {
          const [
            financialResponse,
            internalResponse,
            learningResponse,
            stakeholderResponse,
          ] = await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getFinancialTargetYears/${selectedDepartmentId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getInternalTargetYears/${selectedDepartmentId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getLearningTargetYears/${selectedDepartmentId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/getStakeholderTargetYears/${selectedDepartmentId}`
            ),
          ]);

          const [financialData, internalData, learningData, stakeholderData] =
            await Promise.all([
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

          const uniqueYears = ["Select Year"].concat([
            ...new Set(allData.map((entity) => entity.targetYear)),
          ]);
          setTargetYears(uniqueYears);
          console.log("Years: ", uniqueYears);
          setSelectedYear("Select Year");
        } catch (error) {
          console.error("Error fetching target years:", error);
        }
      }
    };

    fetchTargetYears();
  }, [selectedDepartmentId]);

  // Set the selected year to the new value from the dropdown
  const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  // Store the selected view in local storage
  const changeView = (view: string) => {
    localStorage.setItem("lastView", view);
    setCurrentView(view);
  };

  useEffect(() => {
    const lastView = localStorage.getItem("lastView");

    if (lastView) {
      setCurrentView(lastView);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDepartments(data.departments);
        //setIsLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        //setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle the department selection change
  const handleDepartmentChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setSelectedDepartmentId(selectedOption ? selectedOption.value : 1);
  };

  // Map departments to react-select options
  const departmentOptions = departments.map((department) => ({
    value: department.id,
    label: department.department_name,
  }));

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
        <QANavbar />
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
                p: 3,
                fontSize: "18px",
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
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
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
                p: 3,
                fontSize: "18px",
                background:
                  currentView === "secondary"
                    ? "linear-gradient(to left, #8a252c, #AB3510)"
                    : "transparent",
                color: currentView === "secondary" ? "white" : "#AB3510",
                flexGrow: 2, // Ensure both buttons have equal size
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

        <Box sx={{ display: "flex", justifyContent: "space-between", my: 4 }}>
          {/* Year Dropdown */}

          <div>
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
          <Box>
            <Select
              options={departmentOptions}
              onChange={handleDepartmentChange}
              placeholder="Select Department"
              value={
                selectedDepartmentId
                  ? departmentOptions.find(
                      (option) => option.value === selectedDepartmentId
                    )
                  : null
              }
              className="w-80 border border-gray-300 rounded-lg"
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? "#A43214" : "white", // Background color when focused
                  color: state.isFocused ? "white" : "black", // Text color when focused
                  cursor: "pointer",
                  "&:active": {
                    backgroundColor: "#A43214", // Background color when selected
                    color: "white", // Text color when selected
                  },
                }),
                control: (provided) => ({
                  ...provided,
                  borderColor: "gray", // Border color for the select control
                  boxShadow: "none", // Remove the default blue outline
                  "&:hover": {
                    borderColor: "#A43214", // Border color on hover
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999, // Ensure dropdown appears above other elements
                }),
                menuList: (provided) => ({
                  ...provided,
                  padding: 0, // Remove padding for menu list
                }),
              }}
            />
          </Box>
        </Box>

        {currentView === "primary" && (
          <Grid container>
            <Box width="100%">
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent>
                  <QAPrimaryFinancial
                    selectedDepartmentId={selectedDepartmentId}
                    selectedYear={selectedYear}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent>
                  <QAPrimaryStakeholder
                    selectedDepartmentId={selectedDepartmentId}
                    selectedYear={selectedYear}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent>
                  <QAPrimaryInternal
                    selectedDepartmentId={selectedDepartmentId}
                    selectedYear={selectedYear}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent>
                  <QAPrimaryLearning
                    selectedDepartmentId={selectedDepartmentId}
                    selectedYear={selectedYear}
                  />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )}
        {currentView === "secondary" && (
          <Grid container>
            <Box width="100%">
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent>
                  <QAFinancial
                    selectedDepartmentId={selectedDepartmentId}
                    selectedYear={selectedYear}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent>
                  <QAStakeholder
                    selectedDepartmentId={selectedDepartmentId}
                    selectedYear={selectedYear}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent>
                  <QAInternal
                    selectedDepartmentId={selectedDepartmentId}
                    selectedYear={selectedYear}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  boxShadow: "0 0.3rem 0.3rem 0 rgba(0,0,0,0.25)",
                  border: "1px solid #D1D5DB",
                  bgcolor: "#FFFFFF",
                  p: 0.5,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent>
                  <QALearning
                    selectedDepartmentId={selectedDepartmentId}
                    selectedYear={selectedYear}
                  />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default QAScorecard;
