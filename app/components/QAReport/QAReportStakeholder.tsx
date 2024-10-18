"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface ReportStakeholder {
    id: number;
    perspective: string;
    office_target: string;
    incharge: string;
    key_performance_indicator: string;
    target_performance: string;
    actual_performance: string;
    evidence_link: string; 
    targetYear: string;
  }

  type QAReportStakeholderProps = {
    selectedDepartmentId: number;
    selectedYear: string;
  };

  export default function QAStakeholder({selectedDepartmentId,selectedYear }: QAReportStakeholderProps) {

    const { data: session, status, update } = useSession();
    console.log("useSession Hook session object", session);
    let user;
    if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

    const [stakeholderReport, setStakeholderReport] = useState<
    ReportStakeholder[]
  >([]);
  const [primaryStakeholderReports, setPrimaryStakeholderReports] = useState<
    ReportStakeholder[]
  >([]);
  const allStakeholderReports = [
    ...primaryStakeholderReports,
    ...stakeholderReport,
  ];

  useEffect(() => {
    const getReports = async (selectedDepartmentId: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/stakeholder/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stakeholder reports");
        }
        const data = await response.json();
        console.log("response data:", data);
        setStakeholderReport(data);
      } catch (error) {
        console.error("Error fetching stakeholder reports:", error);
      }
    };

    getReports(selectedDepartmentId);
  }, [selectedDepartmentId]);

  useEffect(() => {
    const getPrimaryReports = async (selectedDepartmentId: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryStakeholderBsc/get/${selectedDepartmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary stakeholder reports");
        }
        const data = await response.json();
        //console.log("response data:", data);
        setPrimaryStakeholderReports(data);
      } catch (error) {
        console.error("Error fetching primary stakeholder reports:", error);
      }
    };
    getPrimaryReports(selectedDepartmentId);
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
    <Grid item sx={{ color: "#2e2c2c" }}>
      <Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            mt: -2,
            mb: 2,
          }}
        >
          <img src="/stakeholder.png" alt="" className=" h-[6rem] mr-2" />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginRight: "1rem",
            }}
          >
            <Box sx={{ alignContent: "center", justifyContent: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "600" }}>
                STAKEHOLDER PERSPECTIVE
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "500" }}>
                The Annual Progress Report offers a detailed look into academic
                performance during the first half of the year.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Box>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}
        >
          <Table>
            {/* Table Header */}
            <TableHead>
              <TableRow sx={{ bgcolor: "#fff6d1" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Office Target
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  KPI
                </TableCell>

                {/* <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  In-charge
                </TableCell> */}
                 {/* {added targetYear} */}
                 <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Year
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
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
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#2e2c2c",
                  }}
                >
                  Link of Evidence
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {allStakeholderReports
                .filter(
                  (report) =>
                    // report.target_code &&
                    report.office_target &&
                    report.key_performance_indicator &&
                    // report.actions &&
                    // report.budget &&
                    report.incharge &&
                    report.actual_performance !== null &&
                    report.target_performance !== null &&
                    // report.ofi &&
                    report.evidence_link &&//link
                    report.targetYear
                )
                .filter((scorecard) => {
                  if (!selectedYear) return true; 
                  return scorecard.targetYear === selectedYear;
                })
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${
                        index < allStakeholderReports.length - 1
                          ? "gray-200"
                          : "transparent"
                      }`,
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell sx={{ maxWidth: "35rem" }}>
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {report.office_target}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report.key_performance_indicator, 20)}
                      </span>
                    </TableCell>
                    {/* <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {truncateString(report?.incharge || "...", 8)}
                      </span>
                    </TableCell> */}
                     {/* {added targetYear} */}
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c]">
                        {report.targetYear}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c] mr-2">
                        {report.actual_performance}
                      </span>
                      <span className="text-center">|</span>
                      <span className="font-medium text-[1.1rem] text-[#2e2c2c] ml-2">
                        {report.target_performance}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {report.evidence_link ? (
                        <a
                          href={report.evidence_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 underline font-medium text-[1.1rem]"
                        >
                          {report.evidence_link.length > 20
                            ? `${report.evidence_link.substring(0, 15)}...`
                            : report.evidence_link}
                        </a>
                      ) : (
                        "..."
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Grid>
  );
  }
