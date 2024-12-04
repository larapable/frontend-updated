"use client";
import QANavbar from "../components/Navbars/QANavbar";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getSession, useSession } from "next-auth/react";

import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import styled from "@emotion/styled";
import SpinnerPages from "../components/Misc/SpinnerPages";
import "@/app/page.css";
import CheckIcon from "@mui/icons-material/Check";

interface Department {
  id: number;
  department_name: string;
}

const drawerWidth = 250;

const StyledBox = styled(Box)({
  wordWrap: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
  height: "auto",
});

const Cards = styled(Box)({
  width: "100%",
  height: "auto",
  borderRadius: "10px",
  boxShadow: "0px 4px 8px rgba(0.2, 0.2, 0.2, 0.2)",
  borderColor: "#e9e8e8",
  borderStyle: "solid", // Add border style (e.g., solid, dashed, dotted)
  borderWidth: "1px",
});

export default function QAStratmapView() {
  //   stratmap original code
  const { data: session, status } = useSession();
  const [selectedComponent, setSelectedComponent] = useState("");
  const [currentView, setCurrentView] = useState("primary");
  const [hasPrimaryStrats, setHasPrimaryStrats] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const currentYear = new Date().getFullYear();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = 1;
  const username = user?.username;

  useEffect(() => {
    let isMounted = true;

    const postToPrimaryStrategies = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getHasPrimaryStrats/1`
      );
      const data = await response.json();

      console.log("data:", data);

      if (data === 0 && isMounted) {
        try {
          // Define an array of primary strategy data
          const primaryStrategiesData = [
            {
              perspective: "financial", // Added perspective field
              office_target:
                "Excellence in Organizational Stewardship A8.4: 100% compliance to prescribed budget ceiling",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.1: 90% average awareness rate of the services",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.2: 90% of eligible employees availed of the services of the administrative and academic support offices",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A1.3: At least 4.5 (out of 5.0) inter-office customer satisfaction",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.1: Have at least 4-star (out of 5) customer service rating",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.2: Have at least 9-star (out of 10) net promoter score",
              department: { id: department_id },
            },
            {
              perspective: "stakeholder", // Added perspective field
              office_target:
                "Excellence in Service Quality A2.3: 90% transanctions resolved or answered customer query within expected time",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A4.1: 100% of the office systems standardized and documented",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A4.2: 100% of process records meet its requirements",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A5.1: 100% awareness of the existence of the University Brand Bible and of its guidelines and templates",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A5.2: 100% compliance to the branding guidelines in their instructional, operational and communication materials",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.1: 100% awareness of the existence of the 5S+ Program",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.2: 100% participation in the orientation/re-orientation of 5S+ training",
              department: { id: department_id },
            },
            {
              perspective: "internal", // Added perspective field
              office_target:
                "Excellence in Internal Service Systems A6.3: 100% compliance of the 5S+ standard",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.1: At least 90% participation in CIT-sponsored events",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.2: At least 90% participation in CIT-sponsored trainings, seminars, workshops, and conferences",
              department: { id: department_id },
            },
            {
              perspective: "learning", // Added perspective field
              office_target:
                "A7.3: At least 90% participation in CIT-commissioned surveys, FGDs, etc.",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.1: 100% of admin staff are evaluated on time",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.2: 100% completed the Competence & Competency Matrix (CCM), training & development needs analysis (TDNA), and professional development plan",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.3: 50% of admin staff are involved in research work",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.4: 100% of staff are ranked",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.5: 100% submission of succession plan",
              department: { id: department_id },
            },
            {
              perspective: "learning",
              office_target:
                "Excellence in Organizational Stewardship A9.6: 100% of staff have 1 community involvement activity per year",
              department: { id: department_id },
            },
          ];

          // Post each strategy individually
          const postPromises = primaryStrategiesData.map(
            async (strategyData) => {
              const endpoint = `${
                process.env.NEXT_PUBLIC_BACKEND_URL
              }/stratmap/primary${
                strategyData.perspective.charAt(0).toUpperCase() +
                strategyData.perspective.slice(1)
              }/insert`;
              console.log("Endpoint:", endpoint); // Log the endpoint for debugging
              const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(strategyData),
              });

              if (!response.ok) {
                console.error(
                  `Error posting ${strategyData.perspective} strategy:`,
                  response.status
                );
              }
            }
          );

          await Promise.all(postPromises);

          // Update hasPrimaryStrats in the user entity
          if (department_id) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/update/primaryStrats/${department_id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hasPrimaryStrats: 1 }),
              }
            );

            if (!response.ok) {
              console.error(
                "Error updating hasPrimaryStrats in user session:",
                response.status
              );
              // Handle the error appropriately (e.g., show an error message)
            } else {
              localStorage.setItem("hasPrimaryStrats", "1");
              setHasPrimaryStrats("1"); // Store in local storage
            }
          } else {
            console.error("Username not found in session data.");
          }

          // Re-fetch primary strategies to update the UI
          fetchPrimaryFinancialStrategies(department_id);
          fetchPrimaryStakeholderStrategies(department_id);
          fetchPrimaryInternalProcessStrategies(department_id);
          fetchPrimaryLearningGrowthStrategies(department_id);
        } catch (error) {
          console.error("Error posting to primary strategies:", error);
          // Handle errors, e.g., display an error message to the user
        }
      }
    };

    postToPrimaryStrategies();

    return () => {
      isMounted = false; // Cleanup: set isMounted to false on unmount
    };
  }, []);

  useEffect(() => {
    setHasPrimaryStrats(localStorage.getItem("hasPrimaryStrats"));

    fetchExistingStrategies(department_id);

    const fetchPrimaryStrategies = async () => {
      if (currentView === "primary" && department_id) {
        setIsLoading(true);
        try {
          const [financial, stakeholder, internal, learning] =
            await Promise.all([
              fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryFinancial/get/${department_id}`
              ).then((res) => res.json()),
              fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryStakeholder/get/${department_id}`
              ).then((res) => res.json()),
              fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryInternal/get/${department_id}`
              ).then((res) => res.json()),
              fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryLearning/get/${department_id}`
              ).then((res) => res.json()),
            ]);

          setPrimaryFinancialStrategies(
            financial.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            }))
          );
          setPrimaryStakeholderStrategies(
            stakeholder.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            }))
          );
          setPrimaryInternalProcessStrategies(
            internal.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            }))
          );
          setPrimaryLearningGrowthStrategies(
            learning.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
            }))
          );
        } catch (error) {
          console.error("Error fetching primary strategies:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPrimaryStrategies();
  }, [session, currentView, selectedComponent, hasPrimaryStrats]);

  interface GeneratedSentence {
    id: number;
    fID: number;
    value: string;
    targetYear: string;
  }

  interface StrategyCategories {
    financial: GeneratedSentence[];
    stakeholder: GeneratedSentence[];
    internalProcess: GeneratedSentence[];
    learningGrowth: GeneratedSentence[];
  }

  const [primaryFinancialStrategies, setPrimaryFinancialStrategies] = useState<
    GeneratedSentence[]
  >([]);
  const [primaryStakeholderStrategies, setPrimaryStakeholderStrategies] =
    useState<GeneratedSentence[]>([]);
  const [
    primaryInternalProcessStrategies,
    setPrimaryInternalProcessStrategies,
  ] = useState<GeneratedSentence[]>([]);
  const [primaryLearningGrowthStrategies, setPrimaryLearningGrowthStrategies] =
    useState<GeneratedSentence[]>([]);

  const [strategies, setStrategies] = useState<StrategyCategories>({
    financial: [],
    stakeholder: [],
    internalProcess: [],
    learningGrowth: [],
  });

  const handlePrimaryFSave = async () => {
    try {
      const data = {
        office_target: `${newPrimaryFTargetCode}: ${newPrimaryFStrategy}`,
        department: { id: department_id }, // Initialize with current department ID
        targetYear: currentYear,
      };

      for (const department of departments) {
        // Loop through all departments
        data.department.id = department.id; // Update department ID for each iteration

        console.log("Data to be sent:", data);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryFinancial/insert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          console.error(
            "Error saving primary financial strategy to department",
            department.id,
            response.status
          );
        }
      }

      closePrimaryFModal();
      fetchPrimaryFinancialStrategies(department_id);
    } catch (error) {
      console.error("Error saving primary financial strategy:", error);
    }
  };

  const handlePrimarySSave = async () => {
    try {
      const data = {
        office_target: `${newPrimarySTargetCode}: ${newPrimarySStrategy}`,
        department: { id: department_id },
        targetYear: currentYear,
      };

      for (const department of departments) {
        data.department.id = department.id;

        console.log("Data to be sent (Stakeholder):", data);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryStakeholder/insert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          console.error(
            "Error saving primary stakeholder strategy to department",
            department.id,
            response.status
          );
        }
      }

      closePrimarySModal();
      fetchPrimaryStakeholderStrategies(department_id);
    } catch (error) {
      console.error("Error saving primary stakeholder strategy:", error);
    }
  };

  const handlePrimaryLGSave = async () => {
    try {
      const data = {
        office_target: `${newPrimaryLGTargetCode}: ${newPrimaryLGStrategy}`,
        department: { id: department_id },
        targetYear: currentYear,
      };

      for (const department of departments) {
        data.department.id = department.id;

        console.log("Data to be sent (Learning & Growth):", data);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryLearning/insert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          console.error(
            "Error saving primary learning & growth strategy to department",
            department.id,
            response.status
          );
        }
      }

      closePrimaryLGModal();
    } catch (error) {
      console.error("Error saving primary learning & growth strategy:", error);
    }
  };

  const handlePrimaryIPSave = async () => {
    try {
      const data = {
        office_target: `${newPrimaryIPTargetCode}: ${newPrimaryIPStrategy}`,
        department: { id: department_id },
        targetYear: currentYear,
      };

      for (const department of departments) {
        data.department.id = department.id;

        console.log("Data to be sent (Internal Process):", data);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryInternal/insert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          console.error(
            "Error saving primary internal process strategy to department",
            department.id,
            response.status
          );
        }
      }

      closePrimaryIPModal();
    } catch (error) {
      console.error("Error saving primary internal process strategy:", error);
    }
  };

  // Primary financial
  const [isPrimaryFModalOpen, setIsPrimaryFModalOpen] = useState(false);
  const [newPrimaryFStrategy, setNewPrimaryFStrategy] = useState("");
  const [newPrimaryFTargetCode, setNewPrimaryFTargetCode] = useState("");

  const openPrimaryFModal = () => {
    setIsPrimaryFModalOpen(true);
    setNewPrimaryFTargetCode("");
    setNewPrimaryFStrategy("");
  };

  const closePrimaryFModal = () => {
    setNewPrimaryFTargetCode("");
    setIsPrimaryFModalOpen(false);
  };

  // Primary stakeholder
  const [isPrimarySModalOpen, setIsPrimarySModalOpen] = useState(false);
  const [newPrimarySStrategy, setNewPrimarySStrategy] = useState("");
  const [newPrimarySTargetCode, setNewPrimarySTargetCode] = useState("");

  const openPrimarySModal = () => {
    setIsPrimarySModalOpen(true);
    setNewPrimarySTargetCode("");
    setNewPrimarySStrategy("");
  };

  const closePrimarySModal = () => {
    setNewPrimarySTargetCode("");
    setIsPrimarySModalOpen(false);
  };

  // internal process
  const [isPrimaryIPModalOpen, setIsPrimaryIPModalOpen] = useState(false);
  const [newPrimaryIPStrategy, setNewPrimaryIPStrategy] = useState("");
  const [newPrimaryIPTargetCode, setNewPrimaryIPTargetCode] = useState("");

  const openPrimaryIPModal = () => {
    setIsPrimaryIPModalOpen(true);
    setNewPrimaryIPTargetCode("");
    setNewPrimaryIPStrategy("");
  };

  const closePrimaryIPModal = () => {
    setNewPrimaryIPTargetCode("");
    setIsPrimaryIPModalOpen(false);
  };

  // Primary learning&growth
  const [isPrimaryLGModalOpen, setIsPrimaryLGModalOpen] = useState(false);
  const [newPrimaryLGStrategy, setNewPrimaryLGStrategy] = useState("");
  const [newPrimaryLGTargetCode, setNewPrimaryLGTargetCode] = useState("");

  const openPrimaryLGModal = () => {
    setIsPrimaryLGModalOpen(true);
    setNewPrimaryLGTargetCode("");
    setNewPrimaryLGStrategy("");
  };

  const closePrimaryLGModal = () => {
    setNewPrimaryLGTargetCode("");
    setIsPrimaryLGModalOpen(false);
  };

  const fetchPrimaryFinancialStrategies = async (department_id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryFinancial/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("primary financial data: ", data);

      const currentYear = new Date().getFullYear().toString(); // Convert to string
      const nextYear = (parseInt(currentYear) + 1).toString();

      // Filter data for the current year and next year
      const filteredData = data.filter((item: any) => {
        return item.targetYear === `${currentYear}-${nextYear}`;
      });

      // Update the strategies state with the fetched primary financial strategies
      setPrimaryFinancialStrategies(
        filteredData.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error("Error fetching primary financial strategies:", error);
    }
  };

  const fetchPrimaryStakeholderStrategies = async (department_id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryStakeholder/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const currentYear = new Date().getFullYear().toString();
      const nextYear = (parseInt(currentYear) + 1).toString();

      const filteredData = data.filter((item: any) => {
        return item.targetYear === `${currentYear}-${nextYear}`;
      });

      setPrimaryStakeholderStrategies(
        filteredData.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error("Error fetching primary stakeholder strategies:", error);
    }
  };

  const fetchPrimaryInternalProcessStrategies = async (
    department_id: number
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryInternal/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const currentYear = new Date().getFullYear().toString();
      const nextYear = (parseInt(currentYear) + 1).toString();

      const filteredData = data.filter((item: any) => {
        return item.targetYear === `${currentYear}-${nextYear}`;
      });

      setPrimaryInternalProcessStrategies(
        filteredData.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error(
        "Error fetching primary internal process strategies:",
        error
      );
    }
  };

  const fetchPrimaryLearningGrowthStrategies = async (
    department_id: number
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/primaryLearning/get/${department_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const currentYear = new Date().getFullYear().toString();
      const nextYear = (parseInt(currentYear) + 1).toString();

      const filteredData = data.filter((item: any) => {
        return item.targetYear === `${currentYear}-${nextYear}`;
      });

      setPrimaryLearningGrowthStrategies(
        filteredData.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        }))
      );
    } catch (error) {
      console.error(
        "Error fetching primary learning and growth strategies:",
        error
      );
    }
  };

  const fetchExistingStrategies = async (department_id: number) => {
    if (department_id) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/byDepartment/${department_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("existing data: ", data);

      const strategies = {
        financial: data.financial.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        })),
        stakeholder: data.stakeholder.map((item: any) => ({
          id: 2,
          fID: item.id,
          value: item.office_target,
        })),
        internalProcess: data.internalProcess.map((item: any) => ({
          id: 3,
          fID: item.id,
          value: item.office_target,
        })),
        learningGrowth: data.learningGrowth.map((item: any) => ({
          id: 4,
          fID: item.id,
          value: item.office_target,
        })),
      };

      setStrategies(strategies);
      console.log(strategies);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching existing strategies:", error);
    }
  };

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDepartmentId = parseInt(event.target.value, 10);
    const selected = departments.find(
      (department) => department.id === selectedDepartmentId
    );

    setStrategies({
      financial: [],
      stakeholder: [],
      internalProcess: [],
      learningGrowth: [],
    });

    setSelectedDepartment(selected || null);
    if (selected) {
      localStorage.setItem("selectedDepartmentId", selected.id.toString()); // Store in local storage
      fetchStrategiesForDepartment(selected.id);
    }
  };

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

        // Fetch strategies for the first department initially if available
        if (data.departments.length > 0) {
          setSelectedDepartment(data.departments[0]);
          fetchStrategiesForDepartment(data.departments[0].id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchStrategiesForDepartment = async (departmentId: number) => {
    try {
      const perspectives = ["financial", "internal", "learning", "stakeholder"];
      const promises = perspectives.map((perspective) =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stratmap/${perspective}/get/${departmentId}`
        )
          .then((res) => {
            if (!res.ok) {
              // If a 404 or other error, return an empty array to avoid breaking Promise.all
              return [];
            }
            return res.json();
          })
          .then((data) => ({ perspective, data }))
          .catch((error) => {
            console.error(
              `Error fetching data for perspective ${perspective}:`,
              error
            );
            return { perspective, data: [] }; // Return empty data on fetch error
          })
      );

      const results = await Promise.all(promises);

      const newStrategies: StrategyCategories = {
        financial: [],
        stakeholder: [],
        internalProcess: [],
        learningGrowth: [],
      };

      results.forEach(({ perspective, data }) => {
        switch (perspective) {
          case "financial":
            newStrategies.financial = data.map((item: any) => ({
              id: 1,
              fID: item.id,
              value: item.office_target,
              targetYear: item.targetYear,
            }));
            break;
          case "stakeholder":
            newStrategies.stakeholder = data.map((item: any) => ({
              id: 2,
              fID: item.id,
              value: item.office_target,
              targetYear: item.targetYear,
            }));
            break;
          case "internal":
            newStrategies.internalProcess = data.map((item: any) => ({
              id: 3,
              fID: item.id,
              value: item.office_target,
              targetYear: item.targetYear,
            }));
            break;
          case "learning":
            newStrategies.learningGrowth = data.map((item: any) => ({
              id: 4,
              fID: item.id,
              value: item.office_target,
              targetYear: item.targetYear,
            }));
            break;
        }
      });

      if (selectedYear) {
        const filteredStrategies = {
          financial: filterStrategiesByYear(newStrategies.financial),
          stakeholder: filterStrategiesByYear(newStrategies.stakeholder),
          internalProcess: filterStrategiesByYear(
            newStrategies.internalProcess
          ),
          learningGrowth: filterStrategiesByYear(newStrategies.learningGrowth),
        };
        setStrategies(filteredStrategies);
      } else {
        setStrategies(newStrategies); // Display all strategies if no year is selected
      }
    } catch (error) {
      console.error("Error fetching strategies for department:", error);
      setStrategies({
        financial: [],
        stakeholder: [],
        internalProcess: [],
        learningGrowth: [],
      });
    }
  };

  const filterStrategiesByYear = (strategies: GeneratedSentence[]) => {
    return strategies.filter((strategy) => {
      return strategy.targetYear === selectedYear;
    });
  };

  const handleYearConfirm = () => {
    if (selectedDepartment && selectedYear) {
      // Check if both are defined
      fetchStrategiesForDepartment(selectedDepartment.id);
    }
  };

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
                STRATEGY MAPPING
              </Typography>
            </Grid>

            {/* TOGGLE BUTTON HERE */}
            <Grid item>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="auto"
                height="3rem"
                borderRadius={2}
                sx={{ gap: 1, p: 1, borderWidth: 0.5, mt: { lg: "-2" }, mb: 1 }}
              >
                <Button
                  onClick={() => setCurrentView("primary")}
                  variant={currentView === "primary" ? "contained" : "outlined"}
                  fullWidth
                  sx={{
                    py: 2,
                    px: 3,
                    fontSize: "13px",
                    background:
                      currentView === "primary"
                        ? "linear-gradient(to left, #8a252c, #AB3510)"
                        : "transparent",
                    color: currentView === "primary" ? "white" : "#AB3510",
                    flexGrow: 2,
                    height: "100%",
                    border: "1px solid transparent",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      background: "linear-gradient(to left, #8a252c, #AB3510)",
                      color: "white",
                      border:
                        currentView === "primary"
                          ? "none"
                          : "0.5px solid #AB3510",
                    },
                  }}
                >
                  PRIMARY
                </Button>
                <Button
                  onClick={() => setCurrentView("secondary")}
                  variant={
                    currentView === "secondary" ? "contained" : "outlined"
                  }
                  fullWidth
                  sx={{
                    p: 2,
                    fontSize: "13px",
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
            </Grid>
            <Typography
              sx={{
                fontSize: { lg: "1rem", sm: "1rem", md: "1rem", xs: "0.8rem" },
              }}
            >
              The Strategy Mapping feature uses AI to automatically generate
              strategies based on your inputs from four key perspectives:
              Financial, Stakeholder, Internal Processes, and Learning & Growth.
              This ensures a well-rounded approach to achieving your goals.
            </Typography>
          </Grid>

          <Grid container sx={{ mt: 5 }}>
            <Box width="100%" sx={{ mt: -1 }}>
              {currentView === "primary" && (
                <>
                  {/* FINANCIAL PRIMARY */}
                  <Cards>
                    <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        sx={{
                          ml: 1,
                          height: "55px",
                          "& .MuiInputBase-root": { height: "55px" },
                        }}
                      >
                        <Grid item sm={11.3} container alignItems="center">
                          <Box>
                            <img
                              src="/financial.png"
                              alt=""
                              className="h-[4rem]"
                            />
                          </Box>
                          <Box sx={{ ml: 1 }}>
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
                              <span className="text-[#ff7b00d3]">
                                Financial:
                              </span>{" "}
                              Stewardship Overview
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
                              Measures financial performance and profitability.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sm={0.7}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              background: "#ff7b00d3",
                              borderRadius: "50%",
                              width: "2.5rem",
                              height: "2.5rem",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                              onClick={openPrimaryFModal}
                            >
                              <div className="flex flex-row">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* add modal here */}
                      {isPrimaryFModalOpen && (
                        <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                          <Box
                            className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                            sx={{
                              width: "60%",
                              height: "80%",
                              maxWidth: "95vw",
                              maxHeight: "95vh",
                              // maxHeight: '100vh',
                            }}
                          >
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
                              Financial Strategy
                            </Typography>
                            <div className="flex flex-col mb-1">
                              <span className="mr-3 break-words font-regular text-[13px]">
                                Target Code
                                <span className="text-[#DD1414]">*</span>
                              </span>
                            </div>
                            <TextField
                              variant="outlined"
                              value={newPrimaryFTargetCode}
                              onChange={(e) =>
                                setNewPrimaryFTargetCode(e.target.value)
                              }
                              sx={{
                                height: "40px",
                                "& .MuiInputBase-root": { height: "40px" },
                                "& .MuiOutlinedInput-input": {
                                  fontSize: "15px",
                                },
                              }}
                            />
                            <Box sx={{ mt: 3 }}>
                              <span className="mr-3 break-words font-regular text-[13px]">
                                Strategy
                                <span className="text-[#DD1414]">*</span>
                              </span>
                              <span className="mb-3 text-[13px]">
                                <br />
                                Before inputting a strategy, please follow this
                                format.
                              </span>
                              <span className="text-[13px]">
                                <br />
                                1. Choose one of the following{" "}
                                <span className="font-bold">
                                  strategic themes
                                </span>
                                :
                              </span>
                              <ul className="list-disc ml-10 mb-2 text-[13px]">
                                <li className="font-bold">
                                  Excellence in Service Quality
                                </li>
                                <li className="font-bold">
                                  Excellence in Internal Service Systems
                                </li>
                                <li className="font-bold">
                                  Excellence in Organizational Stewardship
                                </li>
                              </ul>
                              <span className="text-[13px]">
                                2. After selecting the theme, leave a space and
                                then input the{" "}
                                <span className="font-bold">target code</span>{" "}
                                followed by a colon{" "}
                                <span className="font-bold">(:)</span>
                              </span>
                              <span className="text-[13px]">
                                <br />
                                3. Finally, write the{" "}
                                <span className="font-bold">strategy.</span>
                              </span>
                              <br />
                              <span className="text-[13px]">
                                <br />
                                The correct format should be:{" "}
                                <span className="font-bold">
                                  Strategic Theme Target Code: Strategy
                                </span>
                              </span>
                              <span className="font-bold text-[13px]">
                                <br />
                                Example:{" "}
                                <span className="font-bold text-red-500">
                                  Excellence in Service Quality T001: Improve
                                  customer response time.
                                </span>
                              </span>

                              <Grid item sx={{ mt: 2 }}>
                                <TextField
                                  value={newPrimaryFStrategy}
                                  onChange={(e) =>
                                    setNewPrimaryFStrategy(e.target.value)
                                  }
                                  multiline
                                  rows={5}
                                  sx={{
                                    width: "100%",
                                    overflowY: "auto",
                                    "& .MuiInputBase-root": {},
                                    "& .MuiOutlinedInput-input": {
                                      fontSize: "15px",
                                    },
                                  }}
                                />
                              </Grid>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap", // Allow buttons to wrap
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={closePrimaryFModal}
                                sx={{
                                  minWidth: "15%",
                                  color: "#AB3510",
                                  p: 1,
                                  fontSize: "13px",
                                }}
                                style={{
                                  background: "white",
                                  border: "1px solid #AB3510",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={async () => {
                                  await handlePrimaryFSave(); //change
                                  fetchPrimaryFinancialStrategies(
                                    department_id
                                  ); //change
                                }}
                                sx={{
                                  minWidth: "15%",
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  p: 1,
                                  fontSize: "13px",
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12}>
                          {primaryFinancialStrategies.map(
                            // Map the fetched primary data directly
                            (strategy: GeneratedSentence, index: number) => (
                              <div
                                key={strategy.id}
                                className={`flex justify-between items-center p-2 m-3 w-auto ${
                                  index < primaryFinancialStrategies.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                                }`}
                              >
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
                                  {strategy.value}
                                </Typography>
                              </div>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </StyledBox>
                  </Cards>
                  {/* LEARNING PRIMARY */}
                  <Cards sx={{ borderColor: "black", borderWidth: 1, mt: 5 }}>
                    <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        sx={{
                          ml: 1,
                          height: "55px",
                          "& .MuiInputBase-root": { height: "55px" },
                        }}
                      >
                        <Grid item sm={11.3} container alignItems="center">
                          <Box>
                            <img
                              src="/learning.png"
                              alt=""
                              className="h-[4rem]"
                            />
                          </Box>
                          <Box sx={{ ml: 1 }}>
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
                              <span className="text-[#ff7b00d3]">
                                Learning & Growth:
                              </span>{" "}
                              Culture & People Development Overview
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
                              Enhances organizational culture and employee
                              growth.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sm={0.7}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              background: "#ff7b00d3",
                              borderRadius: "50%",
                              width: "2.5rem",
                              height: "2.5rem",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                              onClick={openPrimaryLGModal}
                            >
                              <div className="flex flex-row">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* add modal here */}
                      {isPrimaryLGModalOpen && (
                        <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                          <Box
                            className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                            sx={{
                              width: "60%",
                              height: "80%",
                              maxWidth: "95vw",
                              maxHeight: "95vh",
                              // maxHeight: '100vh',
                            }}
                          >
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
                              Learning & Growth Strategy
                            </Typography>
                            <div className="flex flex-col mb-1">
                              <span className="mr-3 break-words font-regular text-[13px]">
                                Target Code
                                <span className="text-[#DD1414]">*</span>
                              </span>
                            </div>
                            <TextField
                              variant="outlined"
                              value={newPrimaryLGTargetCode}
                              onChange={(e) =>
                                setNewPrimaryLGTargetCode(e.target.value)
                              }
                              sx={{
                                height: "40px",
                                "& .MuiInputBase-root": { height: "40px" },
                                "& .MuiOutlinedInput-input": {
                                  fontSize: "15px",
                                },
                              }}
                            />
                            <Box sx={{ mt: 3 }}>
                              <span className="mr-3 break-words font-regular text-[13px]">
                                Strategy
                                <span className="text-[#DD1414]">*</span>
                              </span>
                              <span className="mb-3 text-[13px]">
                                <br />
                                Before inputting a strategy, please follow this
                                format.
                              </span>
                              <span className="text-[13px]">
                                <br />
                                1. Choose one of the following{" "}
                                <span className="font-bold">
                                  strategic themes
                                </span>
                                :
                              </span>
                              <ul className="list-disc ml-10 mb-2 text-[13px]">
                                <li className="font-bold">
                                  Excellence in Service Quality
                                </li>
                                <li className="font-bold">
                                  Excellence in Internal Service Systems
                                </li>
                                <li className="font-bold">
                                  Excellence in Organizational Stewardship
                                </li>
                              </ul>
                              <span className="text-[13px]">
                                2. After selecting the theme, leave a space and
                                then input the{" "}
                                <span className="font-bold">target code</span>{" "}
                                followed by a colon{" "}
                                <span className="font-bold">(:)</span>
                              </span>
                              <span className="text-[13px]">
                                <br />
                                3. Finally, write the{" "}
                                <span className="font-bold">strategy.</span>
                              </span>
                              <br />
                              <span className="text-[13px]">
                                <br />
                                The correct format should be:{" "}
                                <span className="font-bold">
                                  Strategic Theme Target Code: Strategy
                                </span>
                              </span>
                              <span className="font-bold text-[13px]">
                                <br />
                                Example:{" "}
                                <span className="font-bold text-red-500">
                                  Excellence in Service Quality T001: Improve
                                  customer response time.
                                </span>
                              </span>

                              <Grid item sx={{ mt: 2 }}>
                                <TextField
                                  value={newPrimaryLGStrategy}
                                  onChange={(e) =>
                                    setNewPrimaryLGStrategy(e.target.value)
                                  }
                                  multiline
                                  rows={5}
                                  sx={{
                                    width: "100%",
                                    overflowY: "auto",
                                    "& .MuiInputBase-root": {},
                                    "& .MuiOutlinedInput-input": {
                                      fontSize: "15px",
                                    },
                                  }}
                                />
                              </Grid>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={closePrimaryLGModal}
                                sx={{
                                  minWidth: "15%",
                                  color: "#AB3510",
                                  p: 1,
                                  fontSize: "13px",
                                }}
                                style={{
                                  background: "white",
                                  border: "1px solid #AB3510",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={async () => {
                                  await handlePrimaryLGSave(); //change
                                  fetchPrimaryLearningGrowthStrategies(
                                    department_id
                                  ); //change
                                }}
                                sx={{
                                  minWidth: "15%",
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  p: 1,
                                  fontSize: "13px",
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12}>
                          {primaryLearningGrowthStrategies.map(
                            // Map the fetched primary data directly
                            (strategy: GeneratedSentence, index: number) => (
                              <div
                                key={strategy.id}
                                className={`flex justify-between items-center p-2 m-3 w-auto ${
                                  index <
                                  primaryLearningGrowthStrategies.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                                }`}
                              >
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
                                  {strategy.value}
                                </Typography>
                              </div>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </StyledBox>
                  </Cards>

                  {/* INTERNAL PRIMARY */}
                  <Cards sx={{ borderColor: "black", borderWidth: 1, mt: 5 }}>
                    <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        sx={{
                          ml: 1,
                          height: "55px",
                          "& .MuiInputBase-root": { height: "55px" },
                        }}
                      >
                        <Grid item sm={11.3} container alignItems="center">
                          <Box>
                            <img
                              src="/internal.png"
                              alt=""
                              className="h-[4rem]"
                            />
                          </Box>
                          <Box sx={{ ml: 1 }}>
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
                              <span className="text-[#ff7b00d3]">
                                Internal Process:
                              </span>{" "}
                              Process & Technology Overview
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
                              Optimizes and manages internal processes and
                              technology.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sm={0.7}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              background: "#ff7b00d3",
                              borderRadius: "50%",
                              width: "2.5rem",
                              height: "2.5rem",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                              onClick={openPrimaryIPModal}
                            >
                              <div className="flex flex-row">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* add modal here */}
                      {isPrimaryIPModalOpen && (
                        <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                          <Box
                            className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                            sx={{
                              width: "60%",
                              height: "80%",
                              maxWidth: "95vw",
                              maxHeight: "95vh",
                              // maxHeight: '100vh',
                            }}
                          >
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
                              Internal Process Strategy
                            </Typography>
                            <div className="flex flex-col mb-1">
                              <span className="mr-3 break-words font-regular text-[13px]">
                                Target Code
                                <span className="text-[#DD1414]">*</span>
                              </span>
                            </div>
                            <TextField
                              variant="outlined"
                              value={newPrimaryIPTargetCode}
                              onChange={(e) =>
                                setNewPrimaryIPTargetCode(e.target.value)
                              }
                              sx={{
                                height: "40px",
                                "& .MuiInputBase-root": { height: "40px" },
                                "& .MuiOutlinedInput-input": {
                                  fontSize: "15px",
                                },
                              }}
                            />
                            <Box>
                              <span className="mr-3 break-words font-regular text-[13px]">
                                Strategy
                                <span className="text-[#DD1414]">*</span>
                              </span>
                              <span className="mb-3 text-[13px]">
                                <br />
                                Before inputting a strategy, please follow this
                                format.
                              </span>
                              <span className="text-[13px]">
                                <br />
                                1. Choose one of the following{" "}
                                <span className="font-bold">
                                  strategic themes
                                </span>
                                :
                              </span>
                              <ul className="list-disc ml-10 mb-2 text-[13px]">
                                <li className="font-bold">
                                  Excellence in Service Quality
                                </li>
                                <li className="font-bold">
                                  Excellence in Internal Service Systems
                                </li>
                                <li className="font-bold">
                                  Excellence in Organizational Stewardship
                                </li>
                              </ul>
                              <span className="text-[13px]">
                                2. After selecting the theme, leave a space and
                                then input the{" "}
                                <span className="font-bold">target code</span>{" "}
                                followed by a colon{" "}
                                <span className="font-bold">(:)</span>
                              </span>
                              <span className="text-[13px]">
                                <br />
                                3. Finally, write the{" "}
                                <span className="font-bold">strategy.</span>
                              </span>
                              <br />
                              <span className="text-[13px]">
                                <br />
                                The correct format should be:{" "}
                                <span className="font-bold">
                                  Strategic Theme Target Code: Strategy
                                </span>
                              </span>
                              <span className="font-bold text-[13px]">
                                <br />
                                Example:{" "}
                                <span className="font-bold text-red-500">
                                  Excellence in Service Quality T001: Improve
                                  customer response time.
                                </span>
                              </span>

                              <Grid item sx={{ mt: 2 }}>
                                <TextField
                                  value={newPrimaryIPStrategy}
                                  onChange={(e) =>
                                    setNewPrimaryIPStrategy(e.target.value)
                                  }
                                  multiline
                                  rows={5}
                                  sx={{
                                    width: "100%",
                                    overflowY: "auto",
                                    "& .MuiInputBase-root": {},
                                    "& .MuiOutlinedInput-input": {
                                      fontSize: "15px",
                                    },
                                  }}
                                />
                              </Grid>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={closePrimaryIPModal}
                                sx={{
                                  minWidth: "15%",
                                  color: "#AB3510",
                                  p: 1,
                                  fontSize: "13px",
                                }}
                                style={{
                                  background: "white",
                                  border: "1px solid #AB3510",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={async () => {
                                  await handlePrimaryIPSave(); //change
                                  fetchExistingStrategies(department_id); //change
                                }}
                                sx={{
                                  minWidth: "15%",
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  p: 1,
                                  fontSize: "13px",
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12}>
                          {primaryInternalProcessStrategies.map(
                            // Map the fetched primary data directly
                            (strategy: GeneratedSentence, index: number) => (
                              <div
                                key={strategy.id}
                                className={`flex justify-between items-center p-2 m-3 w-auto ${
                                  index <
                                  primaryInternalProcessStrategies.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                                }`}
                              >
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
                                  {strategy.value}
                                </Typography>
                              </div>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </StyledBox>
                  </Cards>

                  {/* STAKEHOLDER PRIMARY */}
                  <Cards sx={{ borderColor: "black", borderWidth: 1, mt: 5 }}>
                    <StyledBox sx={{ background: "white", borderRadius: 2 }}>
                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        sx={{
                          ml: 1,
                          height: "55px",
                          "& .MuiInputBase-root": { height: "55px" },
                        }}
                      >
                        <Grid item sm={11.3} container alignItems="center">
                          <Box>
                            <img
                              src="/stakeholder.png"
                              alt=""
                              className="h-[4rem]"
                            />
                          </Box>
                          <Box sx={{ ml: 1 }}>
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
                              <span className="text-[#ff7b00d3]">
                                Stakeholder:
                              </span>{" "}
                              Client Relationship Overview
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
                              Measures client engagement quality and value.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sm={0.7}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              background: "#ff7b00d3",
                              borderRadius: "50%",
                              width: "2.5rem",
                              height: "2.5rem",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              className="text-[#ffffff] w-[3rem] h-6 cursor-pointer"
                              onClick={openPrimarySModal}
                            >
                              <div className="flex flex-row">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* add modal here */}
                      {isPrimarySModalOpen && (
                        <Box className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center">
                          <Box
                            className="bg-white p-8 rounded-lg shadow-md relative overflow-y-auto"
                            sx={{
                              width: "60%",
                              height: "80%",
                              maxWidth: "95vw",
                              maxHeight: "95vh",
                              // maxHeight: '100vh',
                            }}
                          >
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
                              Stakeholder Strategy
                            </Typography>
                            <div className="flex flex-col mb-1">
                              <span className="mr-3 break-words font-regular text-[13px]">
                                Target Code
                                <span className="text-[#DD1414]">*</span>
                              </span>
                            </div>
                            <TextField
                              variant="outlined"
                              value={newPrimarySTargetCode}
                              onChange={(e) =>
                                setNewPrimarySTargetCode(e.target.value)
                              }
                              sx={{
                                height: "40px",
                                "& .MuiInputBase-root": { height: "40px" },
                                "& .MuiOutlinedInput-input": {
                                  fontSize: "15px",
                                },
                              }}
                            />
                            <Box>
                              <span className="mr-3 break-words font-regular text-[13px]">
                                Strategy
                                <span className="text-[#DD1414]">*</span>
                              </span>
                              <span className="mb-3 text-[13px]">
                                <br />
                                Before inputting a strategy, please follow this
                                format.
                              </span>
                              <span className="mb-3 text-[13px]">
                                <br />
                                1. Choose one of the following{" "}
                                <span className="font-bold">
                                  strategic themes
                                </span>
                                :
                              </span>
                              <ul className="list-disc ml-10 mb-2 text-[13px]">
                                <li className="font-bold">
                                  Excellence in Service Quality
                                </li>
                                <li className="font-bold">
                                  Excellence in Internal Service Systems
                                </li>
                                <li className="font-bold">
                                  Excellence in Organizational Stewardship
                                </li>
                              </ul>
                              <span className="mb-3 text-[13px]">
                                2. After selecting the theme, leave a space and
                                then input the{" "}
                                <span className="font-bold">target code</span>{" "}
                                followed by a colon{" "}
                                <span className="font-bold">(:)</span>
                              </span>
                              <span className="mb-3 text-[13px]">
                                <br />
                                3. Finally, write the{" "}
                                <span className="font-bold">strategy.</span>
                              </span>
                              <br />
                              <span className="mb-3 text-[13px]">
                                <br />
                                The correct format should be:{" "}
                                <span className="font-bold">
                                  Strategic Theme Target Code: Strategy
                                </span>
                              </span>
                              <span className="font-bold text-[13px]">
                                <br />
                                Example:{" "}
                                <span className="font-bold text-red-500">
                                  Excellence in Service Quality T001: Improve
                                  customer response time.
                                </span>
                              </span>

                              <Grid item sx={{ mt: 2 }}>
                                <TextField
                                  value={newPrimarySStrategy}
                                  onChange={(e) =>
                                    setNewPrimarySStrategy(e.target.value)
                                  }
                                  multiline
                                  rows={5}
                                  sx={{
                                    width: "100%",
                                    overflowY: "auto",
                                    "& .MuiInputBase-root": {},
                                    "& .MuiOutlinedInput-input": {
                                      fontSize: "15px",
                                    },
                                  }}
                                />
                              </Grid>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={closePrimarySModal}
                                sx={{
                                  minWidth: "15%",
                                  color: "#AB3510",
                                  p: 1,
                                  fontSize: "13px",
                                }}
                                style={{
                                  background: "white",
                                  border: "1px solid #AB3510",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={async () => {
                                  await handlePrimarySSave(); //change
                                  fetchExistingStrategies(department_id); //change
                                }}
                                sx={{
                                  minWidth: "15%",
                                  background:
                                    "linear-gradient(to left, #8a252c, #AB3510)",
                                  p: 1,
                                  fontSize: "13px",
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Grid
                        container
                        alignItems="center"
                        p={1}
                        justifyContent="space-between"
                      >
                        <Grid item xs={12}>
                          {primaryStakeholderStrategies.map(
                            // Map the fetched primary data directly
                            (strategy: GeneratedSentence, index: number) => (
                              <div
                                key={strategy.id}
                                className={`flex justify-between items-center p-2 m-3 w-auto ${
                                  index <
                                  primaryStakeholderStrategies.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                                }`}
                              >
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
                                  {strategy.value}
                                </Typography>
                              </div>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </StyledBox>
                  </Cards>
                </>
              )}
              {currentView === "secondary" && (
                <>
                  {/* ADD DROPDOWN HERE */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <select
                      id="departmentSelect"
                      className="border border-gray-200 shadow-sm rounded-md mb-8 px-3 py-1 w-[65%] md:w-[full] h-[2.5rem] text-[15px]"
                      onChange={handleDepartmentChange}
                    >
                      <option value="">Select a department</option>
                      {departments
                        .filter(
                          (department) =>
                            department.department_name !== "QA Department"
                        )
                        .map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.department_name}
                          </option>
                        ))}
                    </select>

                    <TextField
                      placeholder="Select Year ex. 2024"
                      variant="outlined"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      sx={{
                        width: "35%",
                        mt: -4,
                        height: "40px",
                        "& .MuiInputBase-root": { height: "40px" },
                        "& .MuiOutlinedInput-input": {
                          fontSize: "15px",
                        },
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleYearConfirm}
                      sx={{
                        mt: -4,
                        background:
                          "linear-gradient(to left, #8a252c, #AB3510)",
                        color: "white",
                        width: 50,
                        borderRadius: 1,
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                  {/* ADD !SELECTED DEP HERE */}
                  {!selectedDepartment && (
                    <div className="items-center align-middle mt-10 justify-center text-center">
                      <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[97%] h-auto md:h-[30rem]">
                        <div className="flex flex-col mt-28">
                          <span className="font-bold text-2xl md:text-[2rem] text-gray-300 text-center">
                            Please Select a Department
                          </span>
                          <span className="font-medium mt-5 text-base md:text-[1rem] text-gray-300">
                            Please select a department from the dropdown menu
                            <br /> to view the mapped strategies.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedDepartment && (
                    <>
                      <Cards>
                        <StyledBox
                          sx={{ background: "white", borderRadius: 2 }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            sx={{
                              ml: 1,
                              height: "55px",
                              "& .MuiInputBase-root": { height: "55px" },
                            }}
                          >
                            <Grid item sm={11.3} container alignItems="center">
                              <Box>
                                <img
                                  src="/financial.png"
                                  alt=""
                                  className="h-[4rem]"
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
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
                                  <span className="text-[#ff7b00d3]">
                                    Financial:
                                  </span>{" "}
                                  Stewardship Overview
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
                                  Measures financial performance and
                                  profitability.
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            justifyContent="space-between"
                          >
                            <Grid item xs={12}>
                              {strategies.financial.length > 0 ? (
                                <>
                                  {strategies.financial.map(
                                    (
                                      strategy: GeneratedSentence,
                                      index: number
                                    ) => (
                                      <div
                                        key={strategy.id}
                                        className={`flex justify-between items-center p-2 m-3 w-auto ${
                                          index <
                                          strategies.financial.length - 1
                                            ? "border-b border-gray-200"
                                            : ""
                                        }`}
                                      >
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
                                          {strategy.value}
                                        </Typography>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="items-center align-middle justify-center text-center">
                                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[100%] h-auto md:h-[30rem]">
                                    <div className="flex flex-col mt-28">
                                      <span className="font-bold text-2xl md:text-[2rem] text-gray-300 text-center">
                                        No strategies exist for this
                                        perspective... yet.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </StyledBox>
                      </Cards>

                      <Cards sx={{ mt: 5 }}>
                        <StyledBox
                          sx={{ background: "white", borderRadius: 2 }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            sx={{
                              ml: 1,
                              height: "55px",
                              "& .MuiInputBase-root": { height: "55px" },
                            }}
                          >
                            <Grid item sm={11.3} container alignItems="center">
                              <Box>
                                <img
                                  src="/learning.png"
                                  alt=""
                                  className="h-[4rem]"
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
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
                                  <span className="text-[#ff7b00d3]">
                                    Learning & Growth:
                                  </span>{" "}
                                  Culture & People Development Overview
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
                                  Enhances organizational culture and employee
                                  growth.
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            justifyContent="space-between"
                          >
                            <Grid item xs={12}>
                              {strategies.learningGrowth.length > 0 ? (
                                <>
                                  {strategies.learningGrowth.map(
                                    (
                                      strategy: GeneratedSentence,
                                      index: number
                                    ) => (
                                      <div
                                        key={strategy.id}
                                        className={`flex justify-between items-center p-2 m-3 w-auto ${
                                          index <
                                          strategies.learningGrowth.length - 1
                                            ? "border-b border-gray-200"
                                            : ""
                                        }`}
                                      >
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
                                          {strategy.value}
                                        </Typography>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="items-center align-middle justify-center text-center">
                                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[100%] h-auto md:h-[30rem]">
                                    <div className="flex flex-col mt-28">
                                      <span className="font-bold text-2xl md:text-[2rem] text-gray-300 text-center">
                                        No strategies exist for this
                                        perspective... yet.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </StyledBox>
                      </Cards>

                      <Cards sx={{ mt: 5 }}>
                        <StyledBox
                          sx={{ background: "white", borderRadius: 2 }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            sx={{
                              ml: 1,
                              height: "55px",
                              "& .MuiInputBase-root": { height: "55px" },
                            }}
                          >
                            <Grid item sm={11.3} container alignItems="center">
                              <Box>
                                <img
                                  src="/internal.png"
                                  alt=""
                                  className="h-[4rem]"
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
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
                                  <span className="text-[#ff7b00d3]">
                                    Internal Process:
                                  </span>{" "}
                                  Process & Technology Overview
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
                                  Optimizes and manages internal processes and
                                  technology.
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            justifyContent="space-between"
                          >
                            <Grid item xs={12}>
                              {strategies.internalProcess.length > 0 ? (
                                <>
                                  {strategies.internalProcess.map(
                                    (
                                      strategy: GeneratedSentence,
                                      index: number
                                    ) => (
                                      <div
                                        key={strategy.id}
                                        className={`flex justify-between items-center p-2 m-3 w-auto ${
                                          index <
                                          strategies.internalProcess.length - 1
                                            ? "border-b border-gray-200"
                                            : ""
                                        }`}
                                      >
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
                                          {strategy.value}
                                        </Typography>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="items-center align-middle justify-center text-center">
                                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[100%] h-auto md:h-[30rem]">
                                    <div className="flex flex-col mt-28">
                                      <span className="font-bold text-2xl md:text-[2rem] text-gray-300 text-center">
                                        No strategies exist for this
                                        perspective... yet.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </StyledBox>
                      </Cards>

                      <Cards sx={{ mt: 5 }}>
                        <StyledBox
                          sx={{ background: "white", borderRadius: 2 }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            sx={{
                              ml: 1,
                              height: "55px",
                              "& .MuiInputBase-root": { height: "55px" },
                            }}
                          >
                            <Grid item sm={11.3} container alignItems="center">
                              <Box>
                                <img
                                  src="/stakeholder.png"
                                  alt=""
                                  className="h-[4rem]"
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
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
                                  <span className="text-[#ff7b00d3]">
                                    Stakeholder:
                                  </span>{" "}
                                  Client Relationship Overview
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
                                  Measures client engagement quality and value.
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            p={1}
                            justifyContent="space-between"
                          >
                            <Grid item xs={12}>
                              {strategies.stakeholder.length > 0 ? (
                                <>
                                  {strategies.stakeholder.map(
                                    (
                                      strategy: GeneratedSentence,
                                      index: number
                                    ) => (
                                      <div
                                        key={strategy.id}
                                        className={`flex justify-between items-center p-2 m-3 w-auto ${
                                          index <
                                          strategies.stakeholder.length - 1
                                            ? "border-b border-gray-200"
                                            : ""
                                        }`}
                                      >
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
                                          {strategy.value}
                                        </Typography>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="items-center align-middle justify-center text-center">
                                  <div className="border-4 border-dashed border-gray-200 p-8 rounded-lg w-full md:w-[100%] h-auto md:h-[30rem]">
                                    <div className="flex flex-col mt-28">
                                      <span className="font-bold text-2xl md:text-[2rem] text-gray-300 text-center">
                                        No strategies exist for this
                                        perspective... yet.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Grid>
                          </Grid>
                        </StyledBox>
                      </Cards>

                      {/* end here */}
                    </>
                  )}
                </>
              )}
            </Box>
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
}
