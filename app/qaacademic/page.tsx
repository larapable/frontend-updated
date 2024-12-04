"use client";
import { getSession, useSession } from "next-auth/react";
import SpinnerPages from "../components/Misc/SpinnerPages";
import QANavbar from "../components/Navbars/QANavbar";
import UserProfile from "../components/Profile/UserProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Misc/Spinner";
import SearchIcon from "@mui/icons-material/Search";
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
import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";

const drawerWidth = 250;

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
  category: string;
}

export default function QAAcademic() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartments`
        );
        const data = await response.json();
        const academicDepartments = data.departments.filter(
          (department: Department) => department.category === "Academic"
        );
        setDepartments(academicDepartments);
        setFilteredDepartments(academicDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    const filtered = departments.filter((department) => {
      return (
        department.department_name
          .toLowerCase()
          .includes(newSearchTerm.toLowerCase()) ||
        department.head_officer
          .toLowerCase()
          .includes(newSearchTerm.toLowerCase())
      );
    });

    setFilteredDepartments(filtered);
  };

  if (status === "loading") {
    return <Spinner />;
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
                ACADEMIC
              </Typography>
            </Grid>

            <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                href="/qaadministrative"
                variant="contained"
                sx={{
                  borderRadius: 2,
                  width: "10rem",
                  height: "2.5rem",
                  fontSize: "13px",
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                  color: "white",
                  flexGrow: 2,
                  border: "0.5px solid #AB3510",
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                ADMINISTRATIVE
              </Button>
            </Grid>
            
            <Typography
              sx={{
                fontSize: { lg: "1rem", sm: "1rem", md: "1rem", xs: "0.8rem" },
              }}
            >
              This central hub provides access to information related to the
              academic functions of the department. Use the links to navigate to
              specific areas of interest.
            </Typography>
          </Grid>

          <Grid container alignItems="center" direction="column">
            <Grid
              item
              xs={12}
              md={3}
              sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}
            >
              <TextField
                label="Search Department or Head Officer"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "500px" }}
                InputProps={{
                  endAdornment: (
                    <SearchIcon
                      sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                  ),
                }}
              />
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
              <Grid item xs={12} md={12}>
                {/* insert the table here */}
                <Grid item xs={12} md={12}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      rounded: "18px",
                      borderColor: "#e9e8e8",
                      borderStyle: "solid",
                      borderWidth: "1px",
                    }}
                  >
                    <Table sx={{ minWidth: 650, tableLayout: "fixed" }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#fff6d1", fontSize: "18px" }}>
                          <TableCell
                            sx={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              width: "70%",
                            }}
                          >
                            Department Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              width: "15%",
                            }}
                          >
                            Head Officer
                          </TableCell>
                          {/* <TableCell
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                              align="right"
                            >
                              Action
                            </TableCell> */}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {filteredDepartments.map((department) => (
                          <TableRow
                            key={department.id}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell>
                              <Link
                                href={`/qascorecard/${department.id}`}
                                passHref
                              >
                                <span className="font-medium text-[13px] text-[#2e2c2c] underline cursor-pointer">
                                  {department.department_name}
                                </span>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-[13px] text-[#2e2c2c]">
                                {department.head_officer}
                              </span>
                            </TableCell>
                            {/* <TableCell align="right">
                                <Button
                                  variant="contained"
                                  sx={{
                                    minWidth: "5rem",
                                    background:
                                      "linear-gradient(to left, #8a252c, #AB3510)",
                                    p: 1,
                                    fontSize: "15px",
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
}
