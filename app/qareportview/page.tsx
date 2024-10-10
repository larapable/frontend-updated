"use client";
import Select from "react-select"; // Import react-select
import QANavbar from "../components/Navbars/QANavbar";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Divider,
  Avatar,
  MenuItem,
  Grid,
  Button,
  Autocomplete,
  FormHelperText,
  Card,
  responsiveFontSizes,
  Modal,
} from "@mui/material";
import styled from "@emotion/styled";
import Image from "next/image";
import "@/app/page.css";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Department {
  id: number;
  department_name: string;
}

const drawerWidth = 280;

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
  borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
  borderWidth: "1px",
});

const Boxes = styled(Box)({
  height: "auto",
  width: "100%",
});

interface FinancialScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  actions: string;
  budget: string;
  incharge: string;
  ofi: string;
  evidence_link: string;
}

interface StakeholderScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  actions: string;
  budget: string;
  incharge: string;
  ofi: string;
  evidence_link: string;
}

interface InternalScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  actions: string;
  budget: string;
  incharge: string;
  ofi: string;
  evidence_link: string;
}

interface LearningScorecard {
  id: number;
  target_code: string;
  metric: string;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  actions: string;
  budget: string;
  incharge: string;
  ofi: string;
  evidence_link: string;
}

export default function QAReportView() {
  const [currentView, setCurrentView] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);

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
          "http://localhost:8080/department/getAllDepartments",
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
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchData();
  }, []);

  // Handle the department selection change
  const handleDepartmentChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setSelectedDepartmentId(selectedOption ? selectedOption.value : null);

    // Clear the scorecard states when the department changes
    setFinancialSavedScorecards([]);
    setPrimaryFinancialSavedScorecards([]);
    setStakeholderSavedScorecards([]);
    setPrimaryStakeholderSavedScorecards([]);
    setInternalSavedScorecards([]);
    setPrimaryInternalSavedScorecards([]);
    setLearningSavedScorecards([]);
    setPrimaryLearningSavedScorecards([]);
  };

  // Map departments to react-select options
  const departmentOptions = departments.map((department) => ({
    value: department.id,
    label: department.department_name,
  }));

  // FINANCIAL
  // financial scorecards
  const [financialSavedScorecards, setFinancialSavedScorecards] = useState<
    FinancialScorecard[]
  >([]);

  const [primaryFinancialSavedScorecards, setPrimaryFinancialSavedScorecards] =
    useState<FinancialScorecard[]>([]);

  const allFinancialSavedScorecards = [
    ...primaryFinancialSavedScorecards,
    ...financialSavedScorecards,
  ];

  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchFinancialScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching financial scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial scorecards");
        }
        const data = await response.json();
        console.log("Financial scorecards data:", data);
        setFinancialSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching financial scorecards:", error);
      }
    };

    fetchFinancialScorecards();
  }, [selectedDepartmentId]);

  //fetched the primary financial
  useEffect(() => {
    const fetchPrimaryFinancialScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching primary financial scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryFinancialBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary financial scorecards");
        }
        const data = await response.json();
        console.log("Primary financial scorecards data:", data);
        setPrimaryFinancialSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching primary financial scorecards:", error);
      }
    };

    fetchPrimaryFinancialScorecards();
  }, [selectedDepartmentId]);

  // STAKEHOLDER
  // stakeholder scorecards
  const [stakeholderSavedScorecards, setStakeholderSavedScorecards] = useState<
    StakeholderScorecard[]
  >([]);

  const [
    primaryStakeholderSavedScorecards,
    setPrimaryStakeholderSavedScorecards,
  ] = useState<StakeholderScorecard[]>([]);

  const allStakeholderSavedScorecards = [
    ...primaryStakeholderSavedScorecards,
    ...stakeholderSavedScorecards,
  ];

  // Fetch the saved stakeholder scorecards from the server
  useEffect(() => {
    const fetchStakeholderScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching stakeholder scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/stakeholder/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stakeholder scorecards");
        }
        const data = await response.json();
        console.log("Stakeholder scorecards data:", data);
        setStakeholderSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching stakeholder scorecards:", error);
      }
    };

    fetchStakeholderScorecards();
  }, [selectedDepartmentId]);

  //fetch the primary stakeholder
  useEffect(() => {
    const fetchPrimaryStakeholderScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching primary stakeholder scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryStakeholderBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary stakeholder scorecards");
        }
        const data = await response.json();
        console.log("Primary stakeholder scorecards data:", data);
        setPrimaryStakeholderSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching primary stakeholder scorecards:", error);
      }
    };

    fetchPrimaryStakeholderScorecards();
  }, [selectedDepartmentId]);

  // INTERNAL
  // internal scorecards
  const [internalSavedScorecards, setInternalSavedScorecards] = useState<
    InternalScorecard[]
  >([]);

  const [primaryInternalSavedScorecards, setPrimaryInternalSavedScorecards] =
    useState<InternalScorecard[]>([]);

  const allInternalSavedScorecards = [
    ...primaryInternalSavedScorecards,
    ...internalSavedScorecards,
  ];

  // Fetch the saved internal scorecards from the server
  useEffect(() => {
    const fetchInternalScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching internal scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/internal/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch internal scorecards");
        }
        const data = await response.json();
        console.log("Internal scorecards data:", data);
        setInternalSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching internal scorecards:", error);
      }
    };

    fetchInternalScorecards();
  }, [selectedDepartmentId]);

  //fetch the primary internal
  useEffect(() => {
    const fetchPrimaryInternalScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching primary internal process scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryInternalBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary internal scorecards");
        }
        const data = await response.json();
        console.log("Primary internal scorecards data:", data);
        setPrimaryInternalSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching primary internal scorecards:", error);
      }
    };

    fetchPrimaryInternalScorecards();
  }, [selectedDepartmentId]);

  // LEARNING
  // learning scorecards
  const [learningSavedScorecards, setLearningSavedScorecards] = useState<
    LearningScorecard[]
  >([]);

  const [primaryLearningSavedScorecards, setPrimaryLearningSavedScorecards] =
    useState<InternalScorecard[]>([]);

  const allLearningSavedScorecards = [
    ...primaryLearningSavedScorecards,
    ...learningSavedScorecards,
  ];

  // Fetch the saved learning scorecards from the server
  useEffect(() => {
    const fetchLearningScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching learning scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/learning/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch learning scorecards");
        }
        const data = await response.json();
        console.log("Learning scorecards data:", data);
        setLearningSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching learning scorecards:", error);
      }
    };

    fetchLearningScorecards();
  }, [selectedDepartmentId]);

  //fetch the primary learning
  useEffect(() => {
    const fetchPrimaryLearningScorecards = async () => {
      if (!selectedDepartmentId) {
        console.log("Department ID is not available yet.");
        return;
      }
      console.log(
        "Fetching primary learning and growth scorecards for department ID:",
        selectedDepartmentId
      );
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryLearningBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary learning scorecards");
        }
        const data = await response.json();
        console.log("Primary learning scorecards data:", data);
        setPrimaryLearningSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching primary learning scorecards:", error);
      }
    };

    fetchPrimaryLearningScorecards();
  }, [selectedDepartmentId]);

  function truncateString(str: string | null | undefined, num: number): string {
    if (!str) {
      return "";
    }
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        color: "#4D4C4C",
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
        <QANavbar />
      </Box>
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
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontSize: { xs: "1.8rem", sm: "2.125rem" },
                }}
              >
                REPORT
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Select
              options={departmentOptions}
              onChange={handleDepartmentChange}
              placeholder="Select Department"
              className="w-full md:w-[100%] border border-gray-300 rounded-lg"
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? "#A43214" : "white", // Background color for focused option
                  color: state.isFocused ? "white" : "black", // Text color for focused option
                  cursor: "pointer",
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
              }}
            />
          </Grid>

          {selectedDepartmentId ? (
            <>
              {/* FINANCIAL HERE */}
              <Cards>
                <StyledBox sx={{ background: "white", borderRadius: 5 }}>
                  <Box>
                    <Grid
                      container
                      alignItems="center"
                      p={1}
                      sx={{
                        ml: 1,
                        height: "85px",
                        "& .MuiInputBase-root": { height: "85px" },
                      }}
                    >
                      <Grid item sm={11.3} container alignItems="center">
                        <Box>
                          <img
                            src="/financial.png"
                            alt=""
                            className="h-[5rem]"
                          />
                        </Box>
                        <Box sx={{ ml: 1 }}>
                          <Typography sx={{ fontWeight: "bolder" }}>
                            <span className="text-[#ff7b00d3]">Financial:</span>{" "}
                            Stewardship Overview
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500" }}
                          >
                            Measures financial performance and profitability.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <TableContainer
                      component={Paper}
                      sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}
                    >
                      <Table>
                        {/* Table Header */}
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#fff6d1" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Office Target
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              KPI
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Actions
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Budget
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              In-charge
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Performance <br />
                              <div className="font-medium ">
                                <span>Actual </span>
                                <span className="font-bold">|</span>
                                <span> Target</span>
                              </div>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              OFI
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Link of Evidence
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                          {allFinancialSavedScorecards &&
                            allFinancialSavedScorecards.length > 0 &&
                            allFinancialSavedScorecards.map(
                              (scorecard, index) => {
                                if (!scorecard) return null;
                                return (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      bgcolor:
                                        index % 2 === 0 ? "white" : "#fff6d1",
                                    }}
                                  >
                                    {/* Table Cells */}
                                    <TableCell>
                                      <span className="font-semibold">
                                        {truncateString(
                                          scorecard.office_target,
                                          45
                                        )}
                                      </span>
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.key_performance_indicator,
                                        20
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.actions || "...",
                                        8
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {scorecard.budget || "..."}
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.incharge || "...",
                                        8
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      <span className="text-start mr-2">
                                        {scorecard.actual_performance}
                                      </span>
                                      <span className="text-center">|</span>
                                      <span className="text-end ml-2">
                                        {scorecard.target_performance}
                                      </span>
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.ofi || "...",
                                        4
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {scorecard.evidence_link ? (
                                        <a
                                          href={scorecard.evidence_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-orange-500 underline"
                                        >
                                          {scorecard.evidence_link.length > 20
                                            ? `${scorecard.evidence_link.substring(
                                                0,
                                                15
                                              )}...`
                                            : scorecard.evidence_link}
                                        </a>
                                      ) : (
                                        "..."
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </StyledBox>
              </Cards>
              {/* LEARNING HERE */}
              <Cards sx={{ mt: 5 }}>
                <StyledBox sx={{ background: "white", borderRadius: 5 }}>
                  <Box>
                    <Grid
                      container
                      alignItems="center"
                      p={1}
                      sx={{
                        ml: 1,
                        height: "85px",
                        "& .MuiInputBase-root": { height: "85px" },
                      }}
                    >
                      <Grid item sm={11.3} container alignItems="center">
                        <Box>
                          <img
                            src="/learning.png"
                            alt=""
                            className="h-[5rem]"
                          />
                        </Box>
                        <Box sx={{ ml: 1 }}>
                          <Typography sx={{ fontWeight: "bolder" }}>
                            <span className="text-[#ff7b00d3]">
                              Learning & Growth:
                            </span>{" "}
                            Culture & People Development Overview
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500" }}
                          >
                            Enhances organizational culture and employee growth.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <TableContainer
                      component={Paper}
                      sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}
                    >
                      <Table>
                        {/* Table Header */}
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#fff6d1" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Office Target
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              KPI
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Actions
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Budget
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              In-charge
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Performance <br />
                              <div className="font-medium ">
                                <span>Actual </span>
                                <span className="font-bold">|</span>
                                <span> Target</span>
                              </div>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              OFI
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Link of Evidence
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                          {allLearningSavedScorecards &&
                            allLearningSavedScorecards.length > 0 &&
                            allLearningSavedScorecards.map(
                              (scorecard, index) => {
                                if (!scorecard) return null;
                                return (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      bgcolor:
                                        index % 2 === 0 ? "white" : "#fff6d1",
                                    }}
                                  >
                                    {/* Table Cells */}
                                    <TableCell>
                                      <span className="font-semibold">
                                        {truncateString(
                                          scorecard.office_target,
                                          45
                                        )}
                                      </span>
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.key_performance_indicator,
                                        20
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.actions || "...",
                                        8
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {scorecard.budget || "..."}
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.incharge || "...",
                                        8
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      <span className="text-start mr-2">
                                        {scorecard.actual_performance}
                                      </span>
                                      <span className="text-center">|</span>
                                      <span className="text-end ml-2">
                                        {scorecard.target_performance}
                                      </span>
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.ofi || "...",
                                        4
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {scorecard.evidence_link ? (
                                        <a
                                          href={scorecard.evidence_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-orange-500 underline"
                                        >
                                          {scorecard.evidence_link.length > 20
                                            ? `${scorecard.evidence_link.substring(
                                                0,
                                                15
                                              )}...`
                                            : scorecard.evidence_link}
                                        </a>
                                      ) : (
                                        "..."
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </StyledBox>
              </Cards>
              {/* INTERNAL HERE */}
              <Cards sx={{ mt: 5 }}>
                <StyledBox sx={{ background: "white", borderRadius: 5 }}>
                  <Box>
                    <Grid
                      container
                      alignItems="center"
                      p={1}
                      sx={{
                        ml: 1,
                        height: "85px",
                        "& .MuiInputBase-root": { height: "85px" },
                      }}
                    >
                      <Grid item sm={11.3} container alignItems="center">
                        <Box>
                          <img
                            src="/internal.png"
                            alt=""
                            className="h-[5rem]"
                          />
                        </Box>
                        <Box sx={{ ml: 1 }}>
                          <Typography sx={{ fontWeight: "bolder" }}>
                            <span className="text-[#ff7b00d3]">
                              Internal Process:
                            </span>{" "}
                            Process & Technology Overview
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500" }}
                          >
                            Optimizes and manages internal processes and
                            technology.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <TableContainer
                      component={Paper}
                      sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}
                    >
                      <Table>
                        {/* Table Header */}
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#fff6d1" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Office Target
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              KPI
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Actions
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Budget
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              In-charge
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Performance <br />
                              <div className="font-medium ">
                                <span>Actual </span>
                                <span className="font-bold">|</span>
                                <span> Target</span>
                              </div>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              OFI
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Link of Evidence
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                          {allInternalSavedScorecards &&
                            allInternalSavedScorecards.length > 0 &&
                            allInternalSavedScorecards.map(
                              (scorecard, index) => {
                                if (!scorecard) return null;
                                return (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      bgcolor:
                                        index % 2 === 0 ? "white" : "#fff6d1",
                                    }}
                                  >
                                    {/* Table Cells */}
                                    <TableCell>
                                      <span className="font-semibold">
                                        {truncateString(
                                          scorecard.office_target,
                                          45
                                        )}
                                      </span>
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.key_performance_indicator,
                                        20
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.actions || "...",
                                        8
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {scorecard.budget || "..."}
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.incharge || "...",
                                        8
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      <span className="text-start mr-2">
                                        {scorecard.actual_performance}
                                      </span>
                                      <span className="text-center">|</span>
                                      <span className="text-end ml-2">
                                        {scorecard.target_performance}
                                      </span>
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.ofi || "...",
                                        4
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {scorecard.evidence_link ? (
                                        <a
                                          href={scorecard.evidence_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-orange-500 underline"
                                        >
                                          {scorecard.evidence_link.length > 20
                                            ? `${scorecard.evidence_link.substring(
                                                0,
                                                15
                                              )}...`
                                            : scorecard.evidence_link}
                                        </a>
                                      ) : (
                                        "..."
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </StyledBox>
              </Cards>
              {/* STAKEHOLDER HERE */}
              <Cards sx={{ mt: 5 }}>
                <StyledBox sx={{ background: "white", borderRadius: 5 }}>
                  <Box>
                    <Grid
                      container
                      alignItems="center"
                      p={1}
                      sx={{
                        ml: 1,
                        height: "85px",
                        "& .MuiInputBase-root": { height: "85px" },
                      }}
                    >
                      <Grid item sm={11.3} container alignItems="center">
                        <Box>
                          <img
                            src="/stakeholder.png"
                            alt=""
                            className="h-[5rem]"
                          />
                        </Box>
                        <Box sx={{ ml: 1 }}>
                          <Typography sx={{ fontWeight: "bolder" }}>
                            <span className="text-[#ff7b00d3]">
                              Stakeholder:
                            </span>{" "}
                            Client Relationship Overview
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500" }}
                          >
                            Measures client engagement quality and value.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <TableContainer
                      component={Paper}
                      sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}
                    >
                      <Table>
                        {/* Table Header */}
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#fff6d1" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Office Target
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              KPI
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Actions
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Budget
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              In-charge
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Performance <br />
                              <div className="font-medium ">
                                <span>Actual </span>
                                <span className="font-bold">|</span>
                                <span> Target</span>
                              </div>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              OFI
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Link of Evidence
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                          {allStakeholderSavedScorecards &&
                            allStakeholderSavedScorecards.length > 0 &&
                            allStakeholderSavedScorecards.map(
                              (scorecard, index) => {
                                if (!scorecard) return null;
                                return (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      bgcolor:
                                        index % 2 === 0 ? "white" : "#fff6d1",
                                    }}
                                  >
                                    {/* Table Cells */}
                                    <TableCell>
                                      <span className="font-semibold">
                                        {truncateString(
                                          scorecard.office_target,
                                          45
                                        )}
                                      </span>
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.key_performance_indicator,
                                        20
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.actions || "...",
                                        8
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {scorecard.budget || "..."}
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.incharge || "...",
                                        8
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      <span className="text-start mr-2">
                                        {scorecard.actual_performance}
                                      </span>
                                      <span className="text-center">|</span>
                                      <span className="text-end ml-2">
                                        {scorecard.target_performance}
                                      </span>
                                    </TableCell>
                                    <TableCell align="center">
                                      {truncateString(
                                        scorecard.ofi || "...",
                                        4
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {scorecard.evidence_link ? (
                                        <a
                                          href={scorecard.evidence_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-orange-500 underline"
                                        >
                                          {scorecard.evidence_link.length > 20
                                            ? `${scorecard.evidence_link.substring(
                                                0,
                                                15
                                              )}...`
                                            : scorecard.evidence_link}
                                        </a>
                                      ) : (
                                        "..."
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </StyledBox>
              </Cards>
            </>
          ) : (
            <div className="items-center align-middle mt-10 justify-center text-center">
              <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-[100%] h-[35rem]">
                <div className="flex flex-col mt-28">
                  <span className="font-bold text-[3rem] text-gray-300 text-center">
                    Please Select a Department
                  </span>
                  <span className="font-medium mt-5 text-[1.3rem] text-gray-300">
                    Please select a department from the dropdown menu
                    <br /> to view the reports.
                  </span>
                </div>
              </div>
            </div>
          )}
        </StyledBox>
      </Box>
    </Box>
  );
}
