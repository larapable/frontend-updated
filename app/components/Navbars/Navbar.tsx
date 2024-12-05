"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import axios from 'axios';
import { Box, Drawer, AppBar, List, Typography, CssBaseline, Toolbar, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, ListItemAvatar, IconButton, Collapse } from '@mui/material';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import FlagIcon from '@mui/icons-material/Flag';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import BarChartIcon from '@mui/icons-material/BarChart';
import MessageIcon from '@mui/icons-material/Message';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { BrowserRouter as Router } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '@/app/page.css'

interface Department {
    id: number;
    department_name: string;
    head_officer: string;
  };

const drawerWidth = 250;

export default function Navbar() {

  const { data: session, update } = useSession();
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  let department_id = user?.department_id;
  const head = user?.head;
  

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [heads, setHeads] = useState([]);
  const [openDepartmentDropdown, setOpenDepartmentDropdown] = useState(false);

  const handleDepartmentChange = async (deptId: number) => {
    // const selectedDeptId = parseInt(e.target.value, 10);
    setSelectedDepartmentId(deptId);
    console.log('newid'+deptId);
        const updateUser = {
        ...session,
        user: {
            ...session?.user,
            department_id: deptId,
        },
        };
    console.log('testsetsetse');
        await update(updateUser);
        console.log('updatesesh'+JSON.stringify(session));
    };
    

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartments`
      );
      const data = await res.json();
      setDepartments(data.departments);
    };

    fetchDepartments();
  }, []);
  
  useEffect(() => {
    const fetchHeadDepartments = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/department/getAllDepartmentsHead`
      );
      const data = await res.json();
      setHeads(data.departmentsHead);
      // console.log(data);
    };

    fetchHeadDepartments();
  }, []);

  const handleDepartmentDropdownClick = () => {
    setOpenDepartmentDropdown(!openDepartmentDropdown);
  };


  return (
    <Router>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif', borderRadius:10  }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: 'linear-gradient(to left, #8a252c, #AB3510)', color: 'white', borderTopRightRadius: '30px',borderBottomRightRadius: '30px', },
        }}>
        <Box component="img" src="/logo.png" alt="Description" sx={{ width: '100%', height: '20%', mt: 1}} />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <List>

              <Divider sx={{background: '#ffffff'}}/>

              <ListItem disablePadding onClick={handleDepartmentDropdownClick} 
                sx={{
                    '&:hover': {
                      backgroundColor: '#962203',
                    },
                  }}
              >
                <ListItemButton sx={{ minHeight: '10%',py:1 }}>
                  <ListItemIcon>
                    <CorporateFareIcon sx={{ color: '#F2F2F2' }} />
                  </ListItemIcon>
                  <ListItemText primary="Department" primaryTypographyProps={{ fontSize: '15px', fontWeight: 400 }}/>
                  {openDepartmentDropdown ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>

              <Collapse in={openDepartmentDropdown} timeout="auto" unmountOnExit sx={{background: '#AB3510', color: 'white'}}>
                <List component="div" disablePadding>
                  {departments &&
                    departments
                      .filter((department: Department) => department.head_officer === head)
                      .map((department) => (
                        <ListItemButton 
                          key={department.id} 
                          sx={{ pl: 2, minHeight: '60px' }} 
                          onClick={() => handleDepartmentChange(department.id)}
                          selected={selectedDepartmentId === department.id}
                        >
                          <ListItemText primary={department.department_name} primaryTypographyProps={{ fontSize: '15px', ml:2, fontWeight: 400 }}/>
                        </ListItemButton>
                      ))}
                </List>
              </Collapse>

              <ListItem disablePadding
                    sx={{
                        '&:hover': {
                        backgroundColor: '#962203',
                        },
                    }}
                >
                <Link href="/profile" legacyBehavior>
                <ListItemButton sx={{ minHeight: '10%' }}>
                  <ListItemIcon>
                  <AccountCircleIcon sx={{ color: '#F2F2F2' }} />
                    </ListItemIcon>
                  <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '15px', fontWeight: 400 }} />
                </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding
                    sx={{
                        '&:hover': {
                        backgroundColor: '#962203',
                        },
                    }}
                >
                <Link href="/inputgoals" legacyBehavior>
                <ListItemButton sx={{ minHeight: '10%' }}>
                  <ListItemIcon>
                      <FlagIcon sx={{ color: '#F2F2F2' }} />
                    </ListItemIcon>
                  <ListItemText primary="Goal Settings" primaryTypographyProps={{ fontSize: '15px' }}/>
                </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding 
                    sx={{
                        '&:hover': {
                        backgroundColor: '#962203',
                        },
                    }}
                >
                <Link href="/swot" legacyBehavior>
                <ListItemButton sx={{ minHeight: '10%' }}>
                  <ListItemIcon>
                      <TipsAndUpdatesIcon sx={{ color: '#F2F2F2' }} />
                    </ListItemIcon>
                  <ListItemText primary="SWOT Matrix" primaryTypographyProps={{ fontSize: '15px' }}/>
                </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding
                    sx={{
                        '&:hover': {
                        backgroundColor: '#962203',
                        },
                    }}
                >
                <Link href="/stratmap" legacyBehavior>
                <ListItemButton sx={{ minHeight: '10%' }}>
                  <ListItemIcon>
                      <ForkRightIcon sx={{ color: '#F2F2F2' }} />
                    </ListItemIcon>
                  <ListItemText primary="Strat Mapping" primaryTypographyProps={{ fontSize: '15px'}}/>
                </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding
                    sx={{
                        '&:hover': {
                        backgroundColor: '#962203',
                        },
                    }}
                >
                <Link href="/scorecard" legacyBehavior>
                <ListItemButton sx={{ minHeight: '10%' }}>
                  <ListItemIcon>
                      <CreditScoreIcon sx={{ color: '#F2F2F2' }} />
                    </ListItemIcon>
                  <ListItemText primary="Scorecard" primaryTypographyProps={{ fontSize: '15px'}}/>
                </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding
                    sx={{
                        '&:hover': {
                        backgroundColor: '#962203',
                        },
                    }}
                >
                <Link href="/reports" legacyBehavior>
                <ListItemButton sx={{ minHeight: '10%' }}>
                  <ListItemIcon>
                      <BarChartIcon sx={{ color: '#F2F2F2'}} />
                    </ListItemIcon>
                  <ListItemText primary="Report Analysis" primaryTypographyProps={{ fontSize: '15px' }}/>
                </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding
                    sx={{
                        '&:hover': {
                        backgroundColor: '#962203',
                        },
                    }}
                >
                <Link href="/feedback" legacyBehavior>
                <ListItemButton sx={{ minHeight: '10%' }}>
                  <ListItemIcon>
                      <MessageIcon sx={{ color: '#F2F2F2'}} />
                    </ListItemIcon>
                  <ListItemText primary="Feedback" primaryTypographyProps={{ fontSize: '15px'}}/>
                </ListItemButton>
                </Link>
              </ListItem>
            </List>
          </Box>

          <Box sx={{ pb: 1 }}>
              <Divider sx={{background: '#ffffff'}}/>
              <ListItem disablePadding 
                    sx={{
                        '&:hover': {
                        backgroundColor: '#962203',
                        },
                    }}
                >
                <ListItemButton onClick={() => signOut({ callbackUrl: '/login' })} sx={{ minHeight: '10%' }}>
                  <ListItemIcon>
                      <LogoutIcon sx={{ color: '#F2F2F2'  }} />
                    </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '15px' }}/>
                </ListItemButton>
              </ListItem>
              </Box>

        </Box>
      </Drawer>

    </Box>
    </Router>
  );
}