"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  InputLabel,
  FormControl,
  ListItemText,
  List,
  ListItem,
  styled,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay } from "date-fns";
import "@/app/page.css";
import AdminNavbar from "../Admin/AdminNavBar";
//import RecentLogin from '@/models/recentlogin';

const drawerWidth = 310;

const StyledBox = styled(Box)({
  wordWrap: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
  height: "auto",
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

interface DepartmentUserCount {
  name: string;
  userCount: number;
}

interface User {
  username: string;
  department: Department;
}

interface Department {
  department_name: string;
}

interface Strength {
  id: number;
  value: String;
}

interface Weakness {
  id: number;
  value: String;
}

interface Opportunity {
  id: number;
  value: String;
}

interface Threat {
  id: number;
  value: String;
}

interface Role {
  roleName: string;
  userCount: number;
}

interface SemesterCounts {
  firstSemester: number;
  secondSemester: number;
}

const COLORS = ["#b83216", "#ff7a00", "#ffc619", "#a4a4ff"];

const AdminPage = () => {
  const [totalFinancial, setTotalFinancial] = useState(0);
  const [totalStakeholders, setTotalStakeholders] = useState(0);
  const [totalInternalProcess, setTotalInternalProcess] = useState(0);
  const [totalLearningAndGrowth, setTotalLearningAndGrowth] = useState(0);
  const [departmentUserCounts, setDepartmentUserCounts] = useState<
    DepartmentUserCount[]
  >([]);
  const [userCountData, setUserCountData] = useState([]);
  const [strengths, setStrengths] = useState<Strength[]>([]);
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedOption, setSelectedOption] = useState<
    "strength" | "weakness" | "opportunity" | "threat"
  >("strength");
  const [universityCount, setUniversityCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Fetch university count
        const universityResponse = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/universityCount`
=======
          "http://3.107.42.174:8080/department/universityCount"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        if (universityResponse.ok) {
          const universityData = await universityResponse.json();
          setUniversityCount(universityData.universityCount);
        } else {
          console.error(
            "Failed to fetch university count:",
            universityResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }

    fetchCounts();
  }, []);

  useEffect(() => {
    async function fetchRoleData() {
      try {
<<<<<<< HEAD
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/roles`);
=======
        const response = await fetch("http://3.107.42.174:8080/user/roles");
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (Array.isArray(data)) {
          // Ensure data is an array
          setRoles(data);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    }

    fetchRoleData();
  }, []);

  useEffect(() => {
    async function fetchSWOTData() {
      try {
        const responses = await Promise.all([
<<<<<<< HEAD
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/strengths/getAll`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/weaknesses/getAll`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/opportunities/getAll`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/threats/getAll`),
=======
          fetch("http://3.107.42.174:8080/strengths/getAll"),
          fetch("http://3.107.42.174:8080/weaknesses/getAll"),
          fetch("http://3.107.42.174:8080/opportunities/getAll"),
          fetch("http://3.107.42.174:8080/threats/getAll"),
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
          // Add other fetch calls here
        ]);

        if (!responses[0].ok) throw new Error("Network response was not ok");

        const data = await Promise.all(
          responses.map((response) => response.json())
        );

        setStrengths(data[0]); // Ensure this is the correct index for strengths
        // Set other data here
        setWeaknesses(data[1]);
        setOpportunities(data[2]);
        setThreats(data[3]);
      } catch (error) {
        console.error("Error fetching SWOT data:", error);
      }
    }

    fetchSWOTData();
  }, []);

  const handleOptionChange = (
    event: SelectChangeEvent<"strength" | "weakness" | "opportunity" | "threat">
  ) => {
    setSelectedOption(
      event.target.value as "strength" | "weakness" | "opportunity" | "threat"
    );
  };

  const renderSelectedData = () => {
    let data: Array<Strength | Weakness | Opportunity | Threat>;
    let title: string;

    switch (selectedOption) {
      case "strength":
        data = strengths;
        title = "List of Strengths";
        break;
      case "weakness":
        data = weaknesses;
        title = "List of Weaknesses";
        break;
      case "opportunity":
        data = opportunities;
        title = "List of Opportunities";
        break;
      case "threat":
        data = threats;
        title = "List of Threats";
        break;
      default:
        data = [];
        title = "";
    }

    return (
      <Box
        sx={{
          height: "27rem",
          mt: -3,
          p: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, mt: -6, fontWeight: "bold" }}>
          {title}
        </Typography>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {data.length > 0 ? (
            <List>
              {data.map((item, index) => (
                <ListItem
                  key={item.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fff6d1" : "white", // Alternating background colors
                    mb: "4px", // Margin between items
                    display: "flex", // Ensures the text aligns properly
                    justifyContent: "flex-start", // Aligns items to the start
                    padding: "8px", // Padding inside the ListItem
                  }}
                >
                  <ListItemText
                    primary={`${item.id} : ${item.value}`}
                    sx={{
                      overflowWrap: "break-word", // Allow breaking of long words
                      whiteSpace: "normal", // Allow text to wrap to the next line
                      wordBreak: "break-word", // Ensures long words break
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No {selectedOption}s available</Typography>
          )}
        </Box>
      </Box>
    );
  };

  const mappingData = [
    { name: "Financial", value: totalFinancial },
    { name: "Stakeholders", value: totalStakeholders },
    { name: "Internal Process", value: totalInternalProcess },
    { name: "Learning & Growth", value: totalLearningAndGrowth },
  ];

  useEffect(() => {
    async function fetchDepartmentUserCounts() {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/departmentUserCounts`
=======
          "http://3.107.42.174:8080/department/departmentUserCounts"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        const data: Record<string, number> = await response.json();
        const formattedData = Object.keys(data).map((department) => ({
          name: department,
          userCount: data[department],
        }));
        setDepartmentUserCounts(formattedData);
      } catch (error) {
        console.error("Error fetching department user counts:", error);
      }
    }

    fetchDepartmentUserCounts();
  }, []);

  useEffect(() => {
    async function fetchUserCountData() {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/userCountByDepartment`
=======
          "http://3.107.42.174:8080/department/userCountByDepartment"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        const data = await response.json();

        setUserCountData(data);
      } catch (error) {
        console.error("Error fetching user count data:", error);
      }
    }

    fetchUserCountData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const responses = await Promise.all([
<<<<<<< HEAD
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/financialBscCount`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/stakeholderBscCount`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/internalBscCount`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/learningBscCount`),
=======
          fetch("http://3.107.42.174:8080/bsc/financialBscCount"),
          fetch("http://3.107.42.174:8080/bsc/stakeholderBscCount"),
          fetch("http://3.107.42.174:8080/bsc/internalBscCount"),
          fetch("http://3.107.42.174:8080/bsc/learningBscCount"),
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        ]);
        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        setTotalFinancial(data[0].count);
        setTotalStakeholders(data[1].count);
        setTotalInternalProcess(data[2].count);
        setTotalLearningAndGrowth(data[3].count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const chartData = [
    { name: "Financial", value: totalFinancial },
    { name: "Stakeholders", value: totalStakeholders },
    { name: "Internal Process", value: totalInternalProcess },
    { name: "Learning & Growth", value: totalLearningAndGrowth },
  ];

  // useEffect(() => {
  //   async function fetchReportData() {
  //     try {
  //       const response = await fetch("/api/reportCounts");
  //       if (response.ok) {
  //         const data = await response.json();
  //         setReportData([
  //           { name: "Financial", totalReports: data.financialReports },
  //           { name: "Stakeholders", totalReports: data.stakeholderReports },
  //           {
  //             name: "Internal Process",
  //             totalReports: data.internalProcessReports,
  //           },
  //           {
  //             name: "Learning & Growth",
  //             totalReports: data.learningAndGrowthReports,
  //           },
  //         ]);
  //       } else {
  //         console.error("Failed to fetch report data:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching report data:", error);
  //     }
  //   }

  //   fetchReportData();
  // }, []);

  const [users, setUsers] = useState<User[]>([]); // Specify the type as User[]
  const [usersCount, setUsersCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  useEffect(() => {
<<<<<<< HEAD
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getAllUsers`)
=======
    fetch("http://3.107.42.174:8080/user/getAllUsers")
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Fetch department count
        const departmentResponse = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getDepartmentCount`
=======
          "http://3.107.42.174:8080/department/getDepartmentCount"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        if (departmentResponse.ok) {
          const departmentData = await departmentResponse.json();
          setDepartmentCount(departmentData.departmentCount);
        } else {
          console.error(
            "Failed to fetch department count:",
            departmentResponse.statusText
          );
        }

        // Fetch user count
        const userResponse = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/userCount`
=======
          "http://3.107.42.174:8080/user/userCount"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUsersCount(userData.userCount);
        } else {
          console.error("Failed to fetch user count:", userResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }

    fetchCounts();
  }, []);
  const [reportData, setReportData] = useState([
    { name: "Financial", totalReports: 0 },
    { name: "Stakeholders", totalReports: 0 },
    { name: "Internal Process", totalReports: 0 },
    { name: "Learning & Growth", totalReports: 0 },
  ]);

  // calendar
  const today = new Date();
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (isSameDay(date, today)) {
      return (
        <Box
          sx={{
            backgroundColor: "orange",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {format(date, "d")}
        </Box>
      );
    }
    return null;
  };

  const [financialSemesterCounts, setFinancialSemesterCounts] =
    useState<SemesterCounts>({ firstSemester: 0, secondSemester: 0 });
  const [stakeholderSemesterCounts, setStakeholderSemesterCounts] =
    useState<SemesterCounts>({ firstSemester: 0, secondSemester: 0 });
  const [internalSemesterCounts, setInternalSemesterCounts] =
    useState<SemesterCounts>({ firstSemester: 0, secondSemester: 0 });
  const [learningSemesterCounts, setLearningSemesterCounts] =
    useState<SemesterCounts>({ firstSemester: 0, secondSemester: 0 });

  useEffect(() => {
    async function fetchSemesterCounts() {
      try {
        const responses = await Promise.all([
<<<<<<< HEAD
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/financialSemesterCounts`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/stakeholderSemesterCounts`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/internalSemesterCounts`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/learningSemesterCounts`),
=======
          fetch("http://3.107.42.174:8080/bsc/financialSemesterCounts"),
          fetch("http://3.107.42.174:8080/bsc/stakeholderSemesterCounts"),
          fetch("http://3.107.42.174:8080/bsc/internalSemesterCounts"),
          fetch("http://3.107.42.174:8080/bsc/learningSemesterCounts"),
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        ]);

        const data = await Promise.all(
          responses.map((response) => response.json())
        );

        setFinancialSemesterCounts(data[0]);
        setStakeholderSemesterCounts(data[1]);
        setInternalSemesterCounts(data[2]);
        setLearningSemesterCounts(data[3]);
      } catch (error) {
        console.error("Error fetching semester counts:", error);
      }
    }

    fetchSemesterCounts();
  }, []);

  const [selectedPerspective, setSelectedPerspective] = useState("financial");

  const perspectiveData: Record<string, SemesterCounts> = {
    financial: {
      firstSemester: financialSemesterCounts.firstSemester,
      secondSemester: financialSemesterCounts.secondSemester,
    },
    stakeholder: {
      firstSemester: stakeholderSemesterCounts.firstSemester,
      secondSemester: stakeholderSemesterCounts.secondSemester,
    },
    internal: {
      firstSemester: internalSemesterCounts.firstSemester,
      secondSemester: internalSemesterCounts.secondSemester,
    },
    learning: {
      firstSemester: learningSemesterCounts.firstSemester,
      secondSemester: learningSemesterCounts.secondSemester,
    },
  };

  const handlePerspectiveChange = (event: SelectChangeEvent<string>) => {
    setSelectedPerspective(event.target.value);
  };

  const renderPieChart = (data: SemesterCounts) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={[
            { name: "First Semester", value: data.firstSemester },
            { name: "Second Semester", value: data.secondSemester },
          ]}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={() => null}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          <Cell fill="#b83216" />
          <Cell fill="#ff7a00" />
        </Pie>
        <RechartsTooltip
          formatter={(value, name, props) => [`${value}`, name]}
        />
        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          iconSize={10}
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const [strengthCounts, setStrengthCounts] = useState<Map<string, number>>(
    new Map()
  );
  const [weaknessCounts, setWeaknessCounts] = useState<Map<string, number>>(
    new Map()
  );
  const [opportunityCounts, setOpportunityCounts] = useState(new Map());
  const [threatCounts, setThreatCounts] = useState(new Map());

  useEffect(() => {
    async function fetchStrengthCounts() {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/strengthCountByDepartment`
=======
          "http://3.107.42.174:8080/department/strengthCountByDepartment"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setStrengthCounts(new Map(Object.entries(data)));
      } catch (error) {
        console.error("Error fetching strength counts:", error);
      }
    }

    fetchStrengthCounts();
  }, []);

  useEffect(() => {
    async function fetchWeaknessCounts() {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/weaknessCountByDepartment`
=======
          "http://3.107.42.174:8080/department/weaknessCountByDepartment"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setWeaknessCounts(new Map(Object.entries(data)));
      } catch (error) {
        console.error("Error fetching weakness counts:", error);
      }
    }

    fetchWeaknessCounts();
  }, []);

  useEffect(() => {
    async function fetchOpportunityCounts() {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/opportunityCountByDepartment`
=======
          "http://3.107.42.174:8080/department/opportunityCountByDepartment"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setOpportunityCounts(new Map(Object.entries(data)));
      } catch (error) {
        console.error("Error fetching opportunity counts:", error);
      }
    }

    fetchOpportunityCounts();
  }, []);

  useEffect(() => {
    async function fetchThreatCounts() {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/threatCountByDepartment`
=======
          "http://3.107.42.174:8080/department/threatCountByDepartment"
>>>>>>> 1333e1eb49a1885902719b9a5a82afa115043793
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setThreatCounts(new Map(Object.entries(data)));
      } catch (error) {
        console.error("Error fetching threat counts:", error);
      }
    }

    fetchThreatCounts();
  }, []);

  const renderSwotCounts = () => {
    const departments = Array.from(
      new Set([
        ...strengthCounts.keys(),
        ...weaknessCounts.keys(),
        ...opportunityCounts.keys(),
        ...threatCounts.keys(),
      ])
    );

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        py={3}
        overflow="auto"
        mt={-2}
      >
        {departments.map((departmentName) => (
          <Card
            key={departmentName}
            sx={{
              p: 3,
              width: "100vh",
              maxWidth: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              border: "1px solid #d1d5db",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{ fontSize: "18px", textAlign: "center" }}
            >
              {departmentName}
            </Typography>

            <Box
              display="flex"
              gap={2}
              mt={1}
              flexWrap="wrap"
              justifyContent="center"
            >
              {" "}
              {/* Center the S W O T */}
              {["Strength", "Weakness", "Opportunity", "Threat"].map(
                (label, index) => (
                  <Box display="flex" alignItems="center" gap={0.5} key={label}>
                    <Box>{label}</Box>
                    <Typography fontWeight="bold" sx={{ fontSize: "18px" }}>
                      :{" "}
                      {[
                        strengthCounts.get(departmentName),
                        weaknessCounts.get(departmentName),
                        opportunityCounts.get(departmentName),
                        threatCounts.get(departmentName),
                      ][index] || 0}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

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
        <AdminNavbar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          p: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {/* Welcome Message */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    width: "100%",
                    borderRadius: "20px",
                    boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                    borderColor: "#e9e8e8",
                    borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                    borderWidth: "1px",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <Box flex={1}>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: "#2e2c2c" }}
                      >
                        Welcome, Admin!
                      </Typography>
                      <Typography variant="h5" mt={3} sx={{ color: "#2e2c2c" }}>
                        Use the Atlas Balance Scorecard system to effortlessly
                        track and navigate your business success. Manage
                        metrics, analyze performance, and achieve your strategic
                        goals efficiently.
                      </Typography>
                    </Box>
                    <Box>
                      <img
                        src="/welcomeadmin.png"
                        alt="Welcome Admin"
                        style={{
                          height: "13rem",
                          width: "18rem",
                          marginLeft: "1rem",
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        p: 3,
                        width: "100%",
                        borderRadius: "20px",
                        boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                        borderColor: "#e9e8e8",
                        borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                        borderWidth: "1px",
                        height: "100%",
                      }}
                    >
                      <Typography
                        fontWeight="bold"
                        sx={{ color: "#2e2c2c", fontSize: "20px" }}
                      >
                        Summary of User Distribution
                      </Typography>
                      <TableContainer
                        component={Paper}
                        sx={{ mt: 2, maxHeight: "300px", overflowY: "auto" }} // Set a max height and enable vertical scroll
                      >
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  backgroundColor: "#b83216",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                }}
                              >
                                Name
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#b83216",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                }}
                              >
                                Department
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {users.map((user, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  backgroundColor:
                                    index % 2 === 0 ? "#fff6d1" : "white",
                                }}
                              >
                                <TableCell sx={{ fontSize: "18px" }}>
                                  {user.username}
                                </TableCell>
                                <TableCell sx={{ fontSize: "18px" }}>
                                  {user.department?.department_name ||
                                    "No Department (QA)"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        p: 3,
                        width: "100%",
                        borderRadius: "20px",
                        boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                        borderColor: "#e9e8e8",
                        borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                        borderWidth: "1px",
                      }}
                    >
                      <Typography
                        fontWeight="bold"
                        sx={{ color: "#2e2c2c", fontSize: "20px" }}
                      >
                        Faculty and Executive Staff
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center", // Center horizontally
                          alignItems: "center", // Center vertically
                          height: "305px", // Set a fixed height for the Box
                          width: "100%", // Ensure the Box takes full width
                          padding: "20px 0", // Add padding instead of negative margin
                          marginTop: "10px",
                        }}
                      >
                        <ResponsiveContainer width="100%" height="130%">
                          <LineChart
                            data={roles}
                            margin={{
                              top: 20,
                              right: 10,
                              left: -20,
                              bottom: -30,
                            }}
                          >
                            {" "}
                            {/* Set bottom margin to 0 */}
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="roleName" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="userCount"
                              stroke="#b83216"
                              strokeWidth={3}
                              dot={{
                                stroke: "#b83216",
                                strokeWidth: 2,
                                fill: "#fff",
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Card
                  sx={{
                    p: 3,
                    width: "100%",
                    borderRadius: "20px",
                    boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                    borderColor: "#e9e8e8",
                    borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                    borderWidth: "1px",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                      User Distribution Across Departments
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={departmentUserCounts}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3" />
                        <XAxis dataKey="name" tick={{ fill: "#4A4A4A" }} />
                        <YAxis tick={{ fill: "#4A4A4A" }} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#f0f0f0",
                            borderColor: "#ccc",
                          }}
                          cursor={{ fill: "rgba(200, 200, 200, 0.3)" }}
                        />
                        <Legend
                          wrapperStyle={{ color: "#4A4A4A" }}
                          iconSize={25}
                          iconType="circle"
                        />
                        <Bar
                          dataKey="userCount"
                          fill="#b83216"
                          barSize={200}
                          radius={[10, 10, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Card
                  sx={{
                    p: 3,
                    width: "100%",
                    borderRadius: "20px",
                    boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                    borderColor: "#e9e8e8",
                    borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                    borderWidth: "1px",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mr: 5 }}
                  >
                    <Select
                      value={selectedOption}
                      onChange={handleOptionChange}
                      variant="outlined"
                      sx={{
                        marginTop: "1px",
                        width: "150px",
                        height: "40px",
                        fontSize: "14px",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "red", // Keeps the border red when hovered
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "red", // Keeps the border red when focused
                        },
                      }}
                    >
                      <MenuItem value="strength">Strength</MenuItem>
                      <MenuItem value="weakness">Weakness</MenuItem>
                      <MenuItem value="opportunity">Opportunity</MenuItem>
                      <MenuItem value="threat">Threat</MenuItem>
                    </Select>
                  </Box>
                  {renderSelectedData()}
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                height: "auto",
                borderRadius: "20px",
                boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                borderColor: "#e9e8e8",
                borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                borderWidth: "1px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Calendar />
              </Box>
              <Typography fontWeight="bold" sx={{ mb: 2, fontSize: "20px" }}>
                {" "}
                {/* Adjust font size */}
                Overview Statistics
              </Typography>
              <Card
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                  borderColor: "#e9e8e8",
                  borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                  borderWidth: "1px",
                }}
              >
                <img
                  src="/user-admin.png"
                  alt="Users"
                  style={{ height: "4rem", width: "4rem" }}
                />
                <Box ml={1}>
                  <Typography variant="h6" sx={{ color: "#2e2c2c" }}>
                    Total Users
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "#2e2c2c" }}
                  >
                    {usersCount}
                  </Typography>
                </Box>
              </Card>
              <Card
                sx={{
                  p: 2,
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                  borderColor: "#e9e8e8",
                  borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                  borderWidth: "1px",
                }}
              >
                <img
                  src="/department-admin.png"
                  alt="Departments"
                  style={{ height: "4rem", width: "4rem" }}
                />
                <Box ml={1}>
                  <Typography variant="h6" sx={{ color: "#2e2c2c" }}>
                    Total Departments
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "#2e2c2c" }}
                  >
                    {departmentCount}
                  </Typography>
                </Box>
              </Card>
              <Card
                sx={{
                  p: 2,
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                  borderColor: "#e9e8e8",
                  borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
                  borderWidth: "1px",
                }}
              >
                <img
                  src="/university-admin.png"
                  alt="Universities"
                  style={{ height: "4rem", width: "4rem" }}
                />
                <Box ml={1}>
                  <Typography variant="h6" sx={{ color: "#2e2c2c" }}>
                    Total Universities
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "#2e2c2c" }}
                  >
                    {universityCount}
                  </Typography>
                </Box>
              </Card>

              <Typography
                fontWeight="bold"
                sx={{ mb: 2, fontSize: "20px", mt: 5 }}
              >
                {" "}
                {/* Adjust font size */}
                Perspective Overview
              </Typography>
              <Card
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
                  borderColor: "#e9e8e8",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mappingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mappingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value, name, props) => [`${value}`, name]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={10}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Box>
                <img
                  src="/adminquote.png"
                  alt="Welcome Admin"
                  style={{ height: "18rem", width: "23rem", marginTop: "3rem" }}
                />
              </Box>
              <Typography
                mt={2}
                sx={{
                  fontSize: "18px",
                  fontWeight: "500",
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                "The backbone of any successful organization is a great admin
                team."
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminPage;
