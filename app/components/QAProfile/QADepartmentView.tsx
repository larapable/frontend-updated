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
                DEPARTMENT PORTAL
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  marginBottom: 2,
                }}
              >
                Welcome to the Department Portal! This central hub provides
                access to information and resources related to both the academic
                and administrative functions of the department. Use the button
                below to navigate to specific areas of interest.
              </Typography>
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{
                flexGrow: 1,
                width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
                p: 3,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={12} md={6}>
                <div className="items-center align-middle mt-10 justify-center text-center">
                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-[100%] h-[35rem]">
                    <div className="flex flex-col mt-28">
                      <span className="font-bold text-[3rem] text-gray-400 text-center">
                        ADMIN & ACADEMIC SUPPORT
                      </span>
                      <span className="font-medium mt-5 text-[1.3rem] text-gray-400">
                        Institutional strategic framework
                      </span>
                      <Button
                        href="/qaadministrative"
                        variant="contained"
                        sx={{
                          mt: 7,
                          width: "30%",
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                          p: 1,
                          paddingY: 2,
                          fontSize: "18px",
                          alignSelf: "center",
                        }}
                      >
                        Admin
                      </Button>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="items-center align-middle mt-10 justify-center text-center">
                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-[100%] h-[35rem]">
                    <div className="flex flex-col mt-28">
                      <span className="font-bold text-[3rem] text-gray-400 text-center">
                        ACADEMIC <br />
                        DEPARTMENTS
                      </span>
                      <span className="font-medium mt-5 text-[1.3rem] text-gray-400">
                        Institutional strategic framework
                      </span>
                      <Button
                        href="/qaacademic"
                        variant="contained"
                        sx={{
                          mt: 7,
                          width: "30%",
                          background:
                            "linear-gradient(to left, #8a252c, #AB3510)",
                          p: 1,
                          paddingY: 2,
                          fontSize: "18px",
                          alignSelf: "center",
                        }}
                      >
                        Academic
                      </Button>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
}
