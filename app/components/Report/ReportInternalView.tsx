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
interface ReportInternalView {
  id: number;
  perspective: string;
  // target_code: string;
  office_target: string;
  // actions: string;
  // budget: number;
  incharge: string;
  // ofi: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
  evidence_link: string; //link
  targetYear: string;
}

interface ReportInternalViewProps {
  selectedYear: string; 
}

const ReportInternalView: React.FC<ReportInternalViewProps> = ({ selectedYear }) => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  //Report
  const [internalReports, setInternalReports] = useState<ReportInternalView[]>(
    []
  );
  const [primaryInternalReports, setPrimaryInternalReports] = useState<
    ReportInternalView[]
  >([]);
  const allInternalReports = [...primaryInternalReports, ...internalReports];

  useEffect(() => {
    const getReports = async (department_id: number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/internal/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch internal reports");
        }
        const data = await response.json();
        //console.log("response data:", data);
        setInternalReports(data);
      } catch (error) {
        console.error("Error fetching internal reports:", error);
      }
    };

    getReports(department_id);
  }, [department_id]);

  useEffect(() => {
    const getPrimaryReports = async (department_id: number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsc/primaryInternalBsc/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary internal reports");
        }
        const data = await response.json();
        setPrimaryInternalReports(data);
      } catch (error) {
        console.error("Error fetching primary internal reports: ", error);
      }
    };
    getPrimaryReports(department_id);
  }, [department_id]);

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
            mt: -1,
            mb: 2,
          }}
        >
          <img src="/internal.png" alt="" className=" h-[4rem] mr-2" />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginRight: "1rem",
            }}
          >
            <Box sx={{ alignContent: "center", justifyContent: "center" }}>
            <Typography sx={{fontWeight: '600', fontSize: { lg: '1rem', sm: '1rem', md: '1rem', xs: '0.8rem' }}}>
                INTERNAL PERSPECTIVE
              </Typography>
              <Typography sx={{fontSize: { lg: '0.9rem', sm: '0.9rem', md: '0.9rem', xs: '0.8rem' }}}>
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
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Office Target
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  KPI
                </TableCell>

                {/* <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
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
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Year
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Performance <br />
                  <div className="font-medium text-[11px]">
                    <span>Actual </span>
                    <span className="font-bold">|</span>
                    <span> Target</span>
                  </div>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#2e2c2c",
                  }}
                >
                  Link of Evidence
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {allInternalReports
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
                    report.evidence_link &&
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
                        index < allInternalReports.length - 1
                          ? "gray-200"
                          : "transparent"
                      }`,
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell sx={{ maxWidth: "35rem" }}>
                      <span className="font-medium text-[13px]">
                        {report.office_target}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[13px]">
                        {truncateString(report.key_performance_indicator, 20)}
                      </span>
                    </TableCell>
                    {/* <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {truncateString(report?.incharge || "...", 8)}
                      </span>
                    </TableCell> */}
                    {/* {added targetYear} */}
                    <TableCell align="center">
                      <span className="font-medium text-[13px]">
                        {report.targetYear}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-medium text-[13px] mr-2">
                        {report.actual_performance}
                      </span>
                      <span className="text-center">|</span>
                      <span className="font-medium text-[13px] ml-2">
                        {report.target_performance}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {report.evidence_link ? (
                        <a
                          href={report.evidence_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 underline font-medium text-[13px]"
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
};

export default ReportInternalView;