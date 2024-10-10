"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Box,
  Drawer,
  AppBar,
  List,
  Typography,
  CssBaseline,
  Toolbar,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  ListItemAvatar,
  IconButton,
  Collapse,
} from "@mui/material";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import FlagIcon from "@mui/icons-material/Flag";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import BarChartIcon from "@mui/icons-material/BarChart";
import MessageIcon from "@mui/icons-material/Message";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { BrowserRouter as Router } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface Department {
  id: number;
  department_name: string;
  head_officer: string;
}

const drawerWidth = 280;

export default function QANavbar() {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "linear-gradient(to left, #8a252c, #AB3510)",
              color: "white",
            },
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Description"
            sx={{ width: "70%", height: "20%", ml: 3, mt: 1 }}
          />
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <List>
                <Divider sx={{ background: "#ffffff" }} />
                <ListItem
                  disablePadding
                  sx={{
                    "&:hover": {
                      backgroundColor: "#962203",
                    },
                  }}
                >
                  <Link href="/qaprofileview" legacyBehavior>
                    <ListItemButton>
                      <ListItemIcon>
                        <AccountCircleIcon sx={{ color: "#F2F2F2" }} />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                  </Link>
                </ListItem>

                <ListItem
                  disablePadding
                  sx={{
                    "&:hover": {
                      backgroundColor: "#962203",
                    },
                  }}
                >
                  <Link href="/qastratmapview" legacyBehavior>
                    <ListItemButton>
                      <ListItemIcon>
                        <ForkRightIcon sx={{ color: "#F2F2F2" }} />
                      </ListItemIcon>
                      <ListItemText primary="Strat Mapping" />
                    </ListItemButton>
                  </Link>
                </ListItem>

                <ListItem
                  disablePadding
                  sx={{
                    "&:hover": {
                      backgroundColor: "#962203",
                    },
                  }}
                >
                  <Link href="/qascorecard" legacyBehavior>
                    <ListItemButton>
                      <ListItemIcon>
                        <CreditScoreIcon sx={{ color: "#F2F2F2" }} />
                      </ListItemIcon>
                      <ListItemText primary="Scorecard" />
                    </ListItemButton>
                  </Link>
                </ListItem>

                <ListItem
                  disablePadding
                  sx={{
                    "&:hover": {
                      backgroundColor: "#962203",
                    },
                  }}
                >
                  <Link href="/qareportview" legacyBehavior>
                    <ListItemButton>
                      <ListItemIcon>
                        <BarChartIcon sx={{ color: "#F2F2F2" }} />
                      </ListItemIcon>
                      <ListItemText primary="Report Analysis" />
                    </ListItemButton>
                  </Link>
                </ListItem>
              </List>
            </Box>

            <Box sx={{ pb: 1 }}>
              <Divider sx={{ background: "#ffffff" }} />
              <ListItem
                disablePadding
                sx={{
                  "&:hover": {
                    backgroundColor: "#962203",
                  },
                }}
              >
                <ListItemButton
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#F2F2F2" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Router>
  );
}
