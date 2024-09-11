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
import Navbar from "../components/Navbar";
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
  const [departmentUserCounts, setDepartmentUserCounts] = useState<DepartmentUserCount[]>([]);
  const [userCountData, setUserCountData] = useState([]);
  const [strengths, setStrengths] = useState<Strength[]>([]);
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedOption, setSelectedOption] = useState<'strength' | 'weakness' | 'opportunity' | 'threat'>('strength');
  const [universityCount, setUniversityCount] = useState(0);
  
  useEffect(() => {
    async function fetchCounts() {
      try {
        // Fetch university count
        const universityResponse = await fetch(
          "http://localhost:8080/department/universityCount" 
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

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as 'strength' | 'weakness' | 'opportunity' | 'threat');
  };

  const renderSelectedData = () => {
    let data: Array<Strength | Weakness | Opportunity | Threat>;
    let title: string;

    switch (selectedOption) {
      case 'strength':
        data = strengths;
        title = 'List of Strengths';
        break;
      case 'weakness':
        data = weaknesses;
        title = 'List of Weaknesses';
        break;
      case 'opportunity':
        data = opportunities;
        title = 'List of Opportunities';
        break;
      case 'threat':
        data = threats;
        title = 'List of Threats';
        break;
      default:
        data = [];
        title = '';
    }
    return (
      <div className="h-[27rem] mt-[-3rem] w-[78rem] p-5 flex flex-col">
      <p className="font-bold text-[1.3rem] mb-5">{title}</p>
      <div className="flex-1 overflow-auto">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-row rounded-lg p-3 mr-5 ${
                index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'
              }`}
            >
              <h4 className="font-semibold mr">{item.id} : </h4>
              <p className="ml-1">{item.value}</p>
            </div>
          ))
        ) : (
          <p>No {selectedOption}s available</p>
        )}
      </div>
    </div>
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

  const [financialSemesterCounts, setFinancialSemesterCounts] = useState<SemesterCounts>({ firstSemester: 0, secondSemester: 0 });
  const [stakeholderSemesterCounts, setStakeholderSemesterCounts] = useState<SemesterCounts>({ firstSemester: 0, secondSemester: 0 });
  const [internalSemesterCounts, setInternalSemesterCounts] = useState<SemesterCounts>({ firstSemester: 0, secondSemester: 0 });
  const [learningSemesterCounts, setLearningSemesterCounts] = useState<SemesterCounts>({ firstSemester: 0, secondSemester: 0 });

  useEffect(() => {
    async function fetchSemesterCounts() {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8080/bsc/financialSemesterCounts"),
          fetch("http://localhost:8080/bsc/stakeholderSemesterCounts"),
          fetch("http://localhost:8080/bsc/internalSemesterCounts"),
          fetch("http://localhost:8080/bsc/learningSemesterCounts"),
        ]);
  
        const data = await Promise.all(responses.map(response => response.json()));
  
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

  const [selectedPerspective, setSelectedPerspective] = useState('financial');

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

  const handlePerspectiveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPerspective(event.target.value);
  };

  const renderPieChart = (data: SemesterCounts) => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={[
            { name: "First Semester", value: data.firstSemester },
            { name: "Second Semester", value: data.secondSemester },
          ]}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          <Cell fill="#b83216" />
          <Cell fill="#ff7a00" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  const [strengthCounts, setStrengthCounts] = useState<Map<string, number>>(new Map());
  const [weaknessCounts, setWeaknessCounts] = useState<Map<string, number>>(new Map());
  const [opportunityCounts, setOpportunityCounts] = useState(new Map());
  const [threatCounts, setThreatCounts] = useState(new Map());

  useEffect(() => {
    async function fetchStrengthCounts() {
      try {
        const response = await fetch("http://localhost:8080/department/strengthCountByDepartment");
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
        const response = await fetch("http://localhost:8080/department/weaknessCountByDepartment");
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
        const response = await fetch("http://localhost:8080/department/opportunityCountByDepartment");
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
        const response = await fetch("http://localhost:8080/department/threatCountByDepartment");
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
      <div className="flex flex-col gap-5 py-5 items-center justify-center flex-wrap overflow-y-auto">
        {departments.map((departmentName) => (
          <div key={departmentName} className="bg-white h-[auto] w-[23rem] border border-gray-300 shadow-md rounded-lg p-5"> 
            <p className="font-bold text-lg mb-3 break-words flex-wrap">{departmentName}</p>
            <div className="flex flex-row gap-10 break-words">
              <div className="flex flex-col gap-1 break-words">
                <div className="flex flex-row flex-wrap overflow-y-auto gap-16">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row">
                      <div className="rounded-full bg-[#b83216] px-3 py-1 font-bold text-lg text-white">S</div>
                      <p className="font-bold ml-1 mr-2 text-lg mt-1">: {strengthCounts.get(departmentName) || 0}</p>
                    </div>
                    <div className="flex flex-row">
                      <div className="rounded-full bg-[#ff7a00] px-2 py-1 font-bold text-lg text-white">W</div>
                      <p className="font-bold ml-1 mr-2 text-lg mt-1">: {weaknessCounts.get(departmentName) || 0}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row">
                      <div className="rounded-full bg-[#ff7a00] px-3 py-1 font-bold text-lg text-white">O</div>
                      <p className="font-bold ml-1 mr-2 text-lg mt-1">: {opportunityCounts.get(departmentName) || 0}</p>
                    </div>
                    <div className="flex flex-row">
                      <div className="rounded-full bg-[#b83216] px-3 py-1 font-bold text-lg text-white">T</div>
                      <p className="font-bold ml-1 mr-2 text-lg mt-1">: {threatCounts.get(departmentName) || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="text-[rgb(59,59,59)]">
      <div className="flex flex-row gap-5">
      <div className="flex flex-col gap-5">
        <div className="bg-white h-[13rem] w-[77rem] border border-gray-300 shadow-md rounded-lg">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <p className="font-bold text-[2rem] mt-5 ml-5">Welcome, Admin!</p>
              <p className="text-[1.3rem] ml-5 mt-5 break-words">
                  Use the Atlas Balance Scorecard system to effortlessly track and
                  navigate your business success. Manage metrics, analyze
                  performance, and achieve your strategic goals efficiently.
                </p>
            </div>
            <img
                src="/welcomeadmin.png"
                alt=""
                className=" h-[13rem] w-[18rem] ml-7"
              />
          </div>
        </div>

      <div className="flex flex-row gap-8">
        <div className="flex flex-col ">
            <div className=" bg-white h-[28rem] w-[37rem] border border-gray-300 shadow-md rounded-lg">
              <p className="font-bold text-[1.3rem] mt-5 ml-5">Summary of User Distribution</p>
              <div
                className="mt-5 ml-5 mr-5 overflow-y-auto"
                style={{ maxHeight: "21rem", overflowX: "hidden" }}
              >
                <table className="w-[50rem] ml-3">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-[#b83216] text-left text-lg font-semibold text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-[#b83216] text-left text-lg font-semibold text-white uppercase tracking-wider">
                        Department
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-white">
                    {users.map((user, index) => (
                      <tr key={index}
                        className={`${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'}`}>
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
          {/* faculty and head */}
          <div className="flex flex-col ">
            <div className="bg-white h-[28rem] w-[38rem] border border-gray-300 shadow-md rounded-lg py-5">
            <span className="font-bold text-[1.3rem] ml-5">Faculty and Executive Staff</span>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '2rem', marginLeft: '-1rem' }}>
                <ResponsiveContainer width="100%" height={350}>
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
                      stroke="#b83216"
                      strokeWidth={3}
                      dot={{ stroke: '#b83216', strokeWidth: 2, fill: '#fff' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              </div>
          </div>
          </div>

        {/* user per department */}
      <div className="bg-white h-[28rem] w-[77rem] border border-gray-300 shadow-md rounded-lg py-6">
        <span className="font-bold text-[1.3rem] ml-5">User Distribution Across Departments</span>
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
                    fill="#b83216"
                    barSize={200}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
          </ResponsiveContainer>
      </div>

      {/* swot */}
      <div className="bg-white h-[28rem] w-[77rem] border border-gray-300 shadow-md rounded-lg py-6">
          <div className="right-0 ml-[65rem] relative">
              <select 
                value={selectedOption} 
                onChange={handleOptionChange}
                className="block w-[10rem] p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="strength">Strength</option>
                <option value="weakness">Weakness</option>
                <option value="opportunity">Opportunity</option>
                <option value="threat">Threat</option>
              </select>
          </div>
            {renderSelectedData()}
      </div>

      {/* total mapped strategies */}
      <div className="flex flex-row gap-7 mb-10">
        <div className=" bg-white h-[28rem] w-[37rem] border border-gray-300 shadow-md rounded-lg py-5">
          <span className="font-bold text-[1.3rem] mt-5 ml-5">Perspective Overview</span>
          <div className="ml-[-5rem]">
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
          </div>
        </div>
        <div className=" bg-white h-[28rem] w-[38rem] border border-gray-300 shadow-md rounded-lg py-5">
          <div className="flex flex-row gap-[4rem]">
          <span className="font-bold text-[1.3rem] ml-5">Semester-Based Report Summary</span>
          <div className="">
            <select 
              value={selectedPerspective} 
              onChange={handlePerspectiveChange}
              className="block w-[10rem] p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="financial">Financial</option>
                <option value="stakeholder">Stakeholder</option>
                <option value="internal">Internal Process</option>
                <option value="learning">Learning & Growth</option>
            </select>
          </div>
          </div>


        {/* Conditional rendering based on selectedPerspective */}
        {selectedPerspective === 'financial' && (
          <div>
            {renderPieChart(perspectiveData.financial)}
          </div>
        )}

        {selectedPerspective === 'stakeholder' && (
          <div>
            {renderPieChart(perspectiveData.stakeholder)}
          </div>
        )}

        {selectedPerspective === 'internal' && (
          <div>
            {renderPieChart(perspectiveData.internal)}
          </div>
        )}

        {selectedPerspective === 'learning' && (
          <div>
            {renderPieChart(perspectiveData.learning)}
          </div>
        )}
        </div>
      </div>
      </div>
      
      <div className="bg-white h-[130rem] w-[26rem] mb-10 mr-8 border border-gray-300 shadow-md rounded-lg">
          <div className="bg-white h-[auto] w-[auto] rounded-2xl mb-8">
            <Calendar className="react-calendar" />
          </div>
          <span className="font-bold text-[1.3rem] mt-5 ml-5">Overview Statistics</span>
          <div className="bg-white h-[auto] w-[auto] ml-4 mr-4 border border-gray-300 shadow-lg rounded-2xl mb-5 mt-5 py-5 px-5">
            <div className="bg-[#ff7a00] h-[6rem] w-[0.8rem] absolute mt-[-1.1rem] rounded-3xl ml-[-1.25rem]"></div>
            <div className="flex flex-row">
              <img
                src="/user-admin.png"
                alt=""
                className="h-[3.7rem] w-[4rem] ml-5"
              />
              <div className="flex flex-col ml-5">
                <span className="mt-[-0.5rem]">Total Number of Users</span>
                <span className="font-bold text-3xl">{usersCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white h-[auto] w-[auto] ml-4 mr-4 border border-gray-300 shadow-lg rounded-2xl mb-5 mt-5 py-5 px-5">
            <div className="bg-[#b83216] h-[6rem] w-[0.8rem] absolute mt-[-1.1rem] rounded-3xl ml-[-1.25rem]"></div>
            <div className="flex flex-row">
              <img
                src="/department-admin.png"
                alt=""
                className="h-[3.7rem] w-[4rem] ml-5"
              />
              <div className="flex flex-col ml-5">
                <span className="mt-[-0.5rem]">Total Number of Departments</span>
                <span className="font-bold text-3xl">{departmentCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white h-[auto] w-[auto] ml-4 mr-4 border border-gray-300 shadow-lg rounded-2xl mb-5 mt-5 py-5 px-5">
            <div className="bg-[#ffc619] h-[6rem] w-[0.8rem] absolute mt-[-1.1rem] rounded-3xl ml-[-1.25rem]"></div>
            <div className="flex flex-row">
              <img
                src="/university-admin.png"
                alt=""
                className="h-[3.7rem] w-[4rem] ml-5"
              />
              <div className="flex flex-col ml-5">
                <span className="mt-[-0.5rem]">Total Number of Universities</span>
                <span className="font-bold text-3xl">{universityCount}</span>
              </div>
            </div>
          </div>

          {/* add here */}
          <div className="mt-10">
            <span className="font-bold text-[1.3rem] mt-5 ml-5">Departmental SWOT Overview</span>
            <div className="flex-wrap overflow-y-auto h-[71rem]">
                {renderSwotCounts()}
            </div>
          </div>

        </div>
        </div>
      
    </div>
  );
};

export default AdminPage;
