"use client";
import { getSession, useSession } from "next-auth/react";
import SpinnerPages from "../Misc/SpinnerPages";
import QANavbar from "../Navbars/QANavbar";
import UserProfile from "../Profile/UserProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../Misc/Spinner";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

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

interface Department {
  id: number;
  department_name: string;
  head_officer: string;
}

export default function QADepartmentView() {
  //temporary kay wala pamay table nga naa ang role sa qa
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <SpinnerPages />;
  }

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
        <QANavbar />
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
                DEPARTMENT LIST
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  marginBottom: 2,
                }}
              >
                This page provides an overview of all the departments managed by
                the Quality Assurance (QA) team. Each department listed is
                actively involved in processes overseen by QA. Browse through
                the list to view detailed profiles for each department,
                including key information about their role.
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
              {/* add table here */}
              <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="department table">
                  <TableHead sx={{ backgroundColor: "#AB3510" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        Department Name
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        Head Officer
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          textAlign: "right",
                          pr: 4,
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments.map((department, index) => (
                      <TableRow
                        key={department.id}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "white" : "#fff6d1",
                        }}
                      >
                        <TableCell
                          sx={{ fontWeight: "500", color: "#2e2c2c", fontSize: "1.2rem" }}
                        >
                          {department.department_name}
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "500", color: "#2e2c2c", fontSize: "1.2rem"  }}
                        >
                          {department.head_officer}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right", p: 3 }}>
                          <Link href={`/qaprofileview/${department.id}`}>
                            <Button
                              variant="contained"
                              sx={{
                                background:
                                  "linear-gradient(to left, #8a252c, #AB3510)",
                                color: "white",
                                fontWeight: "semibold",
                                borderRadius: "8px",
                                padding: "8px 16px",
                                textTransform: "none",
                                fontSize: "1.2rem"
                              }}
                            >
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
}
