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
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

interface ReportFinancialView {
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
}

const ReportFinancialView = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  //Report
  const [financialReports, setFinancialReports] = useState<
    ReportFinancialView[]
  >([]);
  const [primaryFinancialReports, setPrimaryFinancialReports] = useState<
    ReportFinancialView[]
  >([]);
  const allFinancialReports = [...primaryFinancialReports, ...financialReports];

  useEffect(() => {
    const getReports = async (department_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial reports");
        }
        const data = await response.json();
        //console.log("response data:", data);
        setFinancialReports(data);
      } catch (error) {
        console.error("Error fetching financial reports:", error);
      }
    };
    getReports(department_id);
  }, [department_id]);

  useEffect(() => {
    const getPrimaryReports = async (department_id: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/bsc/primaryFinancialBsc/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch primary financial reports");
        }
        const data = await response.json();
        setPrimaryFinancialReports(data);
      } catch (error) {
        console.error("Error fetching primary financial reports: ", error);
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
    <Grid item>
      <Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src="/financial.png" alt="" className=" h-[5rem] mr-2" />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginRight: "1rem",
            }}
          >
            <Box sx={{ alignContent: "center", justifyContent: "center" }}>
              <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                FINANCIAL PERSPECTIVE
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
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
                <TableCell sx={{ fontWeight: "bold" }}>Office Target</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  KPI
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  In-charge
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Performance <br />
                  <div className="font-medium ">
                    <span>Actual </span>
                    <span className="font-bold">|</span>
                    <span> Target</span>
                  </div>
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Link of Evidence
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {allFinancialReports
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
                    report.evidence_link //link
                )
                .map((report, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor: index % 2 === 0 ? "white" : "#fff6d1",
                    }}
                  >
                    {/* Table Cells */}
                    <TableCell>
                      <span className="font-semibold text-gray-500">
                        {truncateString(report.office_target, 45)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="font-semibold text-gray-500">
                        {truncateString(report.key_performance_indicator, 20)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {truncateString(report?.incharge || "...", 8)}
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-start mr-2">
                        {report.actual_performance}
                      </span>
                      <span className="text-center">|</span>
                      <span className="text-end ml-2">
                        {report.target_performance}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {report.evidence_link ? (
                        <a
                          href={report.evidence_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 underline"
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

export default ReportFinancialView;
