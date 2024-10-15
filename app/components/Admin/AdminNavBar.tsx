"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { signOut } from "next-auth/react";
import { BrowserRouter as Router } from "react-router-dom";
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';

const drawerWidth = 310;

export default function AdminNavBar() {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          borderRadius:10 
        }}
      >
        <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: 'linear-gradient(to left, #8a252c, #AB3510)', color: 'white', borderTopRightRadius: '30px',borderBottomRightRadius: '30px', },
        }}>
          <Box component="img" src="/logo.png" alt="Description" sx={{ width: '90%', height: '25%',ml:1, mt: 1}} />
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                  <Link href="/admindashboard" legacyBehavior>
                    <ListItemButton sx={{ minHeight: '60px', fontSize: '40px' }}>
                      <ListItemIcon>
                        <SpaceDashboardRoundedIcon sx={{ color: "#F2F2F2", fontSize: '40px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '23px', ml:2, fontWeight: 400 }}/>
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
                  <Link href="/adminlistofusers" legacyBehavior>
                    <ListItemButton sx={{ minHeight: '60px' }}>
                      <ListItemIcon>
                        <PeopleAltRoundedIcon sx={{ color: "#F2F2F2", fontSize: '40px' }} />
                      </ListItemIcon>
                      <ListItemText primary="List of Users" primaryTypographyProps={{ fontSize: '23px', ml:2, fontWeight: 400 }}/>
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
                  <Link href="/registerdepartment" legacyBehavior>
                    <ListItemButton sx={{ minHeight: '60px' }}>
                      <ListItemIcon>
                        <HowToRegRoundedIcon sx={{ color: "#F2F2F2", fontSize: '40px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Register Dep" primaryTypographyProps={{ fontSize: '23px', ml:2, fontWeight: 400 }}/>
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
                  sx={{ minHeight: '60px' }}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#F2F2F2", fontSize: '40px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '23px', ml:2, fontWeight: 400 }}/>
                </ListItemButton>
              </ListItem>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Router>
  );
}
