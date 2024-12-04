"use client";
import React, { useState, useEffect } from "react";
import QANavbar from "../components/Navbars/QANavbar";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Link,
  Modal,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Spinner from "../components/Misc/Spinner";

const drawerWidth = 0;

interface ReviewData {
  target_code: string;
  target_performance: string;
  office_target: string;
  departmentData: DepartmentData[];
}

interface DepartmentData {
  target_performance: string;
  actual_performance: string;
  department_id: number;
  department_name: string;
}

const StyledBox = styled(Box)(() => ({
  wordWrap: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
}));

const QAPOView = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [departmentDataLoading, setDepartmentDataLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [learningResponse, stakeholderResponse, departmentsResponse] =
          await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryLearning/get/2`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryStakeholder/get/2`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartments`
            ), // Fetch departments
          ]);

        if (
          !learningResponse.ok ||
          !stakeholderResponse.ok ||
          !departmentsResponse.ok
        ) {
          throw new Error(
            `HTTP error! status: ${learningResponse.status} ${stakeholderResponse.status} ${departmentsResponse.status}`
          );
        }

        const learningData = await learningResponse.json();
        const stakeholderData = await stakeholderResponse.json();
        const departmentData = await departmentsResponse.json();

        const transformedData = [
          ...transformData(learningData),
          ...transformData(stakeholderData),
        ];

        setReviewData(transformedData);
        setDepartments(departmentData); // Set department data
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformData = (data: any[]): ReviewData[] => {
    return data.map((item: any) => ({
      target_code: item.target_code,
      target_performance: item.target_performance,
      office_target: item.office_target,
      departmentData: departmentData.map((dept) => ({
        ...dept,
        actual_performance: "0%",
        level_of_attainment: 0,
        score: 0,
      })),
    }));
  };

  const handleOpen = async (row: ReviewData) => {
    setSelectedRow(row);
    setDepartmentDataLoading(true); // Set loading state to true
    setDepartmentData([]); // Clear previous data
    setOpen(true); // Open the modal *before* fetching data

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/getByTargetCode/${row.target_code}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDepartmentData(transformBackendDataToDepartmentData(data));
    } catch (error) {
      console.error("Error fetching detailed data:", error);
      alert("Error fetching detailed data. Please try again later.");
    } finally {
      setDepartmentDataLoading(false); // Set loading state to false
    }
  };

  const transformBackendDataToDepartmentData = (
    data: any[]
  ): DepartmentData[] => {
    return data
      .filter((item) => item.department_name !== "QA Department") // Exclude QA Department
      .map((item: any) => {
        console.log("Item data:", item);
        return {
          department_id: item.department_id,
          department_name: item.department_name,
          target_performance: item.target_performance,
          actual_performance: item.actual_performance,
        };
      });
  };

  const handleClose = () => {
    setOpen(false);
    setDepartmentData([]); // Clear data when modal closes
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log("Department Data:", departmentData);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        color: "#2e2c2c",
      }}
    >
      <Grid>
        <QANavbar />
      </Grid>
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
            <Grid item>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: {
                    lg: "2rem",
                    sm: "2rem",
                    md: "2rem",
                    xs: "1.5rem",
                  },
                }}
              >
                PLANNING AND OBJECTIVES
              </Typography>
              <Typography
                sx={{
                  fontSize: {
                    lg: "1rem",
                    sm: "1rem",
                    md: "1rem",
                    xs: "0.8rem",
                  },
                }}
              >
                An integral part of the Management Review process. As such, a
                specific area or areas are targeted for process improvement.
                Input is solicited from appropriate departments and personnel.
                Formal objectives are established for key individuals and are
                tracked by Management.
              </Typography>
            </Grid>
          </Grid>

          {/* Review Table */}
          {reviewData.length > 0 && (
            <TableContainer component={Card} sx={{ marginTop: 3 }}>
              <div className="flex flex-row p-2">
                <img src="/reviewicon.png" alt="" className=" h-[4rem] mr-2" />
                <div className="flex flex-col mt-2">
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: {
                        lg: "1rem",
                        sm: "1rem",
                        md: "1rem",
                        xs: "0.8rem",
                      },
                    }}
                  >
                    Review Entered Data
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: {
                        lg: "0.9rem",
                        sm: "0.9rem",
                        md: "0.9rem",
                        xs: "0.8rem",
                      },
                    }}
                  >
                    Double-check the information provided to ensure everything
                    is correct.
                  </Typography>
                </div>
              </div>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#fff6d1" }}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "#2e2c2c",
                      }}
                    >
                      Target Code
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "#2e2c2c",
                      }}
                    >
                      Target Performance
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "#2e2c2c",
                      }}
                    >
                      Office Target
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: "13px" }}>
                        <Link
                          component="button"
                          onClick={() => handleOpen(row)}
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight: "500",
                          }}
                        >
                          {row.target_code}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px", fontWeight: "500" }}>
                        {row.target_performance}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          textAlign: "left",
                          fontWeight: "500",
                        }}
                      >
                        {row.office_target}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Modal for Detailed Table */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="detailed-table-modal"
            aria-describedby="detailed-table-content"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <Box
                sx={{
                  background: "white",
                  padding: 4,
                  borderRadius: 2,
                  boxShadow: 24,
                  position: "relative",
                  width: "80%",
                  height: "90%",
                  overflowX: "hidden",
                }}
              >
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: {
                      lg: "1rem",
                      sm: "1rem",
                      md: "1rem",
                      xs: "0.8rem",
                    },
                    mb: 1,
                  }}
                >
                  Details for Target Code:{" "}
                  <span className="text-red-600 font-extrabold">
                    {selectedRow ? selectedRow.target_code : "N/A"}
                  </span>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    mb: 2,
                  }}
                >
                  {departmentDataLoading ? (
                    <Spinner />
                  ) : (
                    <TableContainer
                      component={Card}
                      sx={{ maxHeight: "60vh", overflowY: "auto" }}
                    >
                      {departmentData.length === 0 ? (
                        <Typography variant="body1">
                          No data available for this target code.
                        </Typography>
                      ) : (
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#fff6d1" }}>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  color: "#2e2c2c",
                                  width: "200px",
                                }}
                              >
                                Department Name
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  color: "#2e2c2c",
                                }}
                              >
                                Target Performance
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  color: "#2e2c2c",
                                }}
                              >
                                Actual Performance
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  color: "#2e2c2c",
                                }}
                              >
                                Level of Attainment
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  color: "#2e2c2c",
                                }}
                              >
                                Score
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {departmentData.map((dept) => {
                              const actualPerformance =
                                parseFloat(dept.actual_performance) || 0;
                              const targetPerformance =
                                parseFloat(dept.target_performance) || 0;

                              const levelOfAttainment =
                                targetPerformance > 0
                                  ? Math.min(
                                      1,
                                      actualPerformance / targetPerformance
                                    )
                                  : 0; //Handle division by zero
                              const percentageLevelOfAttainment = Math.round(
                                levelOfAttainment * 100
                              );

                              const score = levelOfAttainment * 100;

                              return (
                                <TableRow key={dept.department_id}>
                                  <TableCell
                                    sx={{ fontSize: "13px", fontWeight: "500" }}
                                  >
                                    {dept.department_name}
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontSize: "13px", fontWeight: "500" }}
                                  >
                                    {dept.target_performance}
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontSize: "13px", fontWeight: "500" }}
                                  >
                                    {dept.actual_performance}
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontSize: "13px", fontWeight: "500" }}
                                  >
                                    {percentageLevelOfAttainment}%
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontSize: "13px", fontWeight: "500" }}
                                  >
                                    {score.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </TableContainer>
                  )}
                </Box>
              </Box>
            </Box>
          </Modal>
        </StyledBox>
      </Box>
    </Box>
  );
};

export default QAPOView;
