"use client";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  ListItem,
  Typography,
} from "@mui/material";
import QANavbar from "@/app/components/Navbars/QANavbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import QAPrimaryFinancial from "@/app/components/QABSC/QAPrimaryFinancial";
import QAPrimaryStakeholder from "@/app/components/QABSC/QAPrimaryStakeholder";
import QAPrimaryInternal from "@/app/components/QABSC/QAPrimaryInternal";
import QAPrimaryLearning from "@/app/components/QABSC/QAPrimaryLearning";
import QAFinancial from "@/app/components/QABSC/QAFinancial";
import QAStakeholder from "@/app/components/QABSC/QAStakeholder";
import QAInternal from "@/app/components/QABSC/QAInternal";
import QALearning from "@/app/components/QABSC/QALearning";
import Link from "next/link";
import Spinner from "@/app/components/Misc/Spinner";

const QAScorecard = () => {
  const { id } = useParams(); // Access the department ID here
  const { data: session, status, update } = useSession();
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [currentView, setCurrentView] = useState("primary");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(
    parseInt(id as string, 10)
  );

  console.log("Selected Department ID: ", selectedDepartmentId);

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

          // Check if the responses are OK
          if (
            !financialResponse.ok ||
            !internalResponse.ok ||
            !learningResponse.ok ||
            !stakeholderResponse.ok
          ) {
            throw new Error("Failed to fetch target years");
          }

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

  if (status === "loading") {
    return <Spinner />;
  }

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
          mt: 3.5, 
          px: 3,
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
              fontWeight: "bold",
              fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' },
            }}
          >
            BALANCED SCORECARD
          </Typography>

          {/* View Buttons */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="auto"
            height="3rem"
            borderRadius={2}
            sx={{ gap: 1, p: 0.5, borderWidth: 0.5, mt: {lg: '-2'}, mb: 0.5 }}
          >
            <Button
              onClick={() => changeView("primary")}
              variant={currentView === "primary" ? "contained" : "outlined"}
              fullWidth
              sx={{
                py: 2,
                px: 3,
                fontSize: '13px',
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
                py:2,
                fontSize: '13px',
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
        <Typography sx={{fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
          Explore the Balanced Scorecard feature to gain a comprehensive view of
          your organization&apos;s performance across different dimensions. Use
          it to set clear objectives, track progress, and drive strategic
          initiatives for success.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", my: 4 }}>
          {/* Year Dropdown */}

          <div>
            <label htmlFor="year-select" className="mr-2 text-[18px] font-bold">
              SELECT A YEAR:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 rounded-md p-2 text-[13px]"
              key={selectedYear} // Add the key prop here
            >
              {targetYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
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
        <Box className="flex flex-row justify-end items-end mb-10 ">
          <Link href={`/qareportview/${selectedDepartmentId}`} passHref>
            <Button
              variant="contained"
              sx={{
                py: 1,
                px: 3,
                borderRadius: "8px",
                fontWeight: "500",
                background: "linear-gradient(to left, #8a252c, #AB3510)",
              }}
            >
              View Report
            </Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

export default QAScorecard;