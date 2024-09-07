"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay } from "date-fns";
import "@/app/page.css";
//import RecentLogin from '@/models/recentlogin';

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
  value: String
}

interface Weakness {
  id: number;
  value: String
}

interface Opportunity {
  id: number;
  value: String
}

interface Threat {
  id: number;
  value: String
}

interface Role {
  roleName: string;
  userCount: number;
}

const COLORS = ["orange", "#dc2f02", "#8884d8", "#4B6FDD"]; // Define colors for the pie chart

const AdminPage = () => {
  const [totalFinancial, setTotalFinancial] = useState(0);
  const [totalStakeholders, setTotalStakeholders] = useState(0);
  const [totalInternalProcess, setTotalInternalProcess] = useState(0);
  const [totalLearningAndGrowth, setTotalLearningAndGrowth] = useState(0);
  const [departmentUserCounts, setDepartmentUserCounts] = useState<DepartmentUserCount[]>([]);
  const [userCountData, setUserCountData] = useState([]);
  const [strengths, setStrengths] = useState<Strength[]>([]);
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    async function fetchRoleData() {
      try {
        const response = await fetch("http://localhost:8080/user/roles");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (Array.isArray(data)) { // Ensure data is an array
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
          fetch("http://localhost:8080/strengths/getAll"),
          fetch("http://localhost:8080/weaknesses/getAll"),
          fetch("http://localhost:8080/opportunities/getAll"),
          fetch("http://localhost:8080/threats/getAll")
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



  const mappingData = [
    { name: "Financial", value: totalFinancial },
    { name: "Stakeholders", value: totalStakeholders },
    { name: "Internal Process", value: totalInternalProcess },
    { name: "Learning & Growth", value: totalLearningAndGrowth },
  ];


  useEffect(() => {
    async function fetchDepartmentUserCounts() {
      try {
        const response = await fetch("http://localhost:8080/department/departmentUserCounts");
        const data: Record<string, number> = await response.json();
        const formattedData = Object.keys(data).map(department => ({
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
        const response = await fetch("http://localhost:8080/department/userCountByDepartment");
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
          fetch("http://localhost:8080/bsc/financialBscCount"),
          fetch("http://localhost:8080/bsc/stakeholderBscCount"),
          fetch("http://localhost:8080/bsc/internalBscCount"),
          fetch("http://localhost:8080/bsc/learningBscCount"),
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

  useEffect(() => {
    async function fetchReportData() {
      try {
        const response = await fetch("/api/reportCounts");
        if (response.ok) {
          const data = await response.json();
          setReportData([
            { name: "Financial", totalReports: data.financialReports },
            { name: "Stakeholders", totalReports: data.stakeholderReports },
            {
              name: "Internal Process",
              totalReports: data.internalProcessReports,
            },
            {
              name: "Learning & Growth",
              totalReports: data.learningAndGrowthReports,
            },
          ]);
        } else {
          console.error("Failed to fetch report data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }

    fetchReportData();
  }, []);

  const [users, setUsers] = useState<User[]>([]); // Specify the type as User[]
  const [usersCount, setUsersCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/user/getAllUsers")
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Fetch department count
        const departmentResponse = await fetch(
          "http://localhost:8080/department/getDepartmentCount"
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
          "http://localhost:8080/user/userCount"
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
  // reports created for each perspectives
  // dummy values
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
        <div
          style={{
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
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-row ml-[4rem]">
      <div className="flex-1 flex flex-col mt-[-0.5rem] ml-[6.5rem] gap-20 mb-10">
        <div className="flex flex-row gap-5">
          <div className="bg-white h-[13rem] w-[63rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
            <p className="font-bold text-[2rem] mt-5 ml-5">Welcome, Admin</p>
            <div className="flex flex-row">
              <p className="text-[1.3rem] ml-5 mt-5 break-words">
                Use the Atlas Balance Scorecard system to effortlessly track and
                navigate your business success. Manage metrics, analyze
                performance, and achieve your strategic goals efficiently.
              </p>
              <img
                src="/welcomeadmin.png"
                alt=""
                className=" h-[13rem] w-[18rem] mt-[-4rem] ml-7"
              />
            </div>
          </div>
          <div className="bg-white h-[13rem] w-[16rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
            <div className="flex flex-col justify-center align-middle items-center">
              <img
                src="/departmenticon.png"
                alt=""
                className=" h-[3rem] w-[3.5rem] mt-8"
              />
              <p className="font-bold text-[2.5rem] mt-2 mb-[-0.5rem]">
                {departmentCount}
              </p>
              Departments
            </div>
          </div>
          <div className="bg-white h-[13rem] w-[16rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
            <div className="flex flex-col justify-center align-middle items-center">
              <img
                src="/usersicon.png"
                alt=""
                className=" h-[3rem] w-[3.5rem] mt-8"
              />
              <p className="font-bold text-[2.5rem] mt-2 mb-[-0.5rem]">
                {usersCount}
              </p>
              Users
            </div>
          </div>
        </div>

        <div className="mt-[-3rem] flex flex-row gap-5">
          <div className="flex flex-col ">
            <div className=" bg-white h-[27rem] w-[50rem] ml-[3rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
              <p className="font-bold text-[1.3rem] mt-5 ml-5">All Users</p>
              <div
                className="mt-5 ml-5 mr-5 overflow-y-auto"
                style={{ maxHeight: "21rem", overflowX: "hidden" }}
              >
                <table className="w-[50rem] ml-3">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-[#ED8316] text-left text-lg font-semibold text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-[#ED8316] text-left text-lg font-semibold text-white uppercase tracking-wider">
                        Department
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.department.department_name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white h-[27rem] w-[40rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
            <Calendar className="react-calendar" />
          </div>
        </div>

        <div className="bg-white h-[27rem] mt-[-3rem] w-[97.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg p-5 flex flex-col">
          <p className="font-bold text-[1.3rem] mb-5">List of Strengths</p>
          <div className="flex-1 overflow-auto">
            {strengths.length > 0 ? (
              strengths.map((strength) => (
                <div
                  key={strength.id}
                  className="border rounded-lg p-4 bg-gray-100 shadow-md mb-2"
                >
                  <h3 className="text-xl font-semibold">{strength.id}</h3>
                  <p>{strength.value}</p>
                </div>
              ))
            ) : (
              <p>No strengths available</p>
            )}
          </div>
        </div>

        <div className="bg-white h-[27rem] mt-[-3rem] w-[97.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg p-5 flex flex-col">
          <p className="font-bold text-[1.3rem] mb-5">List of Weaknesses</p>
          <div className="flex-1 overflow-auto">
            {weaknesses.length > 0 ? (
              weaknesses.map((weaknesses) => (
                <div
                  key={weaknesses.id}
                  className="border rounded-lg p-4 bg-gray-100 shadow-md mb-2"
                >
                  <h3 className="text-xl font-semibold">{weaknesses.id}</h3>
                  <p>{weaknesses.value}</p>
                </div>
              ))
            ) : (
              <p>No weaknesses available</p>
            )}
          </div>
        </div>

        <div className="bg-white h-[27rem] mt-[-3rem] w-[97.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg p-5 flex flex-col">
          <p className="font-bold text-[1.3rem] mb-5">List of Opportunities</p>
          <div className="flex-1 overflow-auto">
            {opportunities.length > 0 ? (
              opportunities.map((opportunities) => (
                <div
                  key={opportunities.id}
                  className="border rounded-lg p-4 bg-gray-100 shadow-md mb-2"
                >
                  <h3 className="text-xl font-semibold">{opportunities.id}</h3>
                  <p>{opportunities.value}</p>
                </div>
              ))
            ) : (
              <p>No opportunities available</p>
            )}
          </div>
        </div>

        <div className="bg-white h-[27rem] mt-[-3rem] w-[97.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg p-5 flex flex-col">
          <p className="font-bold text-[1.3rem] mb-5">List of Threats</p>
          <div className="flex-1 overflow-auto">
            {threats.length > 0 ? (
              threats.map((threat) => (
                <div
                  key={threat.id}
                  className="border rounded-lg p-4 bg-gray-100 shadow-md mb-2"
                >
                  <h3 className="text-xl font-semibold">{threat.id}</h3>
                  <p>{threat.value}</p>
                </div>
              ))
            ) : (
              <p>No threats available</p>
            )}
          </div>
        </div>

        <div className="bg-white mt-[-3rem] h-[30rem] w-[97.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
          <p className="font-bold text-[1.3rem] mt-5 ml-5 mb-5">
            Mapping Strategies: Perspective Overview
          </p>
          <div className="ml-[-2rem]">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={mappingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={150}
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
              </PieChart>
            </ResponsiveContainer>

            <div className="ml-[2rem] mt-10 mb-10 bg-white h-[24rem] w-[97.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={departmentUserCounts}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3" />
                  <XAxis dataKey="name" tick={{ fill: '#4A4A4A' }} />
                  <YAxis tick={{ fill: '#4A4A4A' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f0f0f0', borderColor: '#ccc' }}
                    cursor={{ fill: 'rgba(200, 200, 200, 0.3)' }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#4A4A4A' }}
                    iconSize={25}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="userCount"
                    fill="#821131"
                    barSize={200}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="ml-[-0.1rem] mt-7 mb-10 bg-white h-[25rem] w-[97.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={roles}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="roleName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="userCount"
                      stroke="#FABC3F"
                      strokeWidth={3}
                      dot={{ stroke: '#FABC3F', strokeWidth: 2, fill: '#fff' }} // Style for dots if needed
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
