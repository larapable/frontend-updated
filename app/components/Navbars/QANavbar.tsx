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
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

interface Department {
  id: number;
  department_name: string;
  head_officer: string;
}

const drawerWidth = 310;

export default function QANavbar() {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          borderRadius: 10,
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
              borderTopRightRadius: "30px",
              borderBottomRightRadius: "30px",
            },
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Description"
            sx={{ width: "90%", height: "25%", ml: 1, mt: 1 }}
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
                    <ListItemButton
                      sx={{ minHeight: "60px", fontSize: "40px" }}
                    >
                      <ListItemIcon>
                        <HomeRoundedIcon
                          sx={{ color: "#F2F2F2", fontSize: "40px" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Home"
                        primaryTypographyProps={{
                          fontSize: "23px",
                          ml: 2,
                          fontWeight: 400,
                        }}
                      />
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
                    <ListItemButton sx={{ minHeight: "60px" }}>
                      <ListItemIcon>
                        <ForkRightIcon
                          sx={{ color: "#F2F2F2", fontSize: "40px" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Strat Mapping"
                        primaryTypographyProps={{
                          fontSize: "23px",
                          ml: 2,
                          fontWeight: 400,
                        }}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>

                {/* <ListItem
                  disablePadding
                  sx={{
                    "&:hover": {
                      backgroundColor: "#962203",
                    },
                  }}
                >
                  <Link href="/qascorecard" legacyBehavior>
                    <ListItemButton sx={{ minHeight: '60px' }}>
                      <ListItemIcon>
                        <CreditScoreIcon sx={{ color: "#F2F2F2", fontSize: '40px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Scorecard" primaryTypographyProps={{ fontSize: '23px', ml:2, fontWeight: 400 }}/>
                    </ListItemButton>
                  </Link>
                </ListItem> */}

                {/* <ListItem
                  disablePadding
                  sx={{
                    "&:hover": {
                      backgroundColor: "#962203",
                    },
                  }}
                >
                  <Link href="/qareportview" legacyBehavior>
                    <ListItemButton sx={{ minHeight: '60px' }}>
                      <ListItemIcon>
                        <BarChartIcon sx={{ color: "#F2F2F2", fontSize: '40px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Report Analysis" primaryTypographyProps={{ fontSize: '23px', ml:2, fontWeight: 400 }}/>
                    </ListItemButton>
                  </Link>
                </ListItem> */}
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
                  sx={{ minHeight: "60px" }}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#F2F2F2", fontSize: "40px" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontSize: "23px",
                      ml: 2,
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Router>
  );
}
