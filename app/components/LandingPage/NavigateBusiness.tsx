'use client';
import Link from 'next/link'
import React from 'react'
import '@/app/page.css'
import { Box, Typography, Button } from '@mui/material';


const NavigateBusiness = () => {
  return (
    <Box
      sx={{
        backgroundImage: 'url("landingbg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '80vh', // Adjust height as needed
        marginTop: '-10rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', // Center items vertically
        justifyContent: 'center', // Center items horizontally
      }}
    >
      {/* Left Section */}
      <Box sx={{ textAlign: 'left', marginTop: '-3rem', marginLeft: '5rem' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', fontSize: '3rem' }}>
          NAVIGATE YOUR
        </Typography>
        <Typography variant="h2" sx={{ color: '#fad655', fontWeight: 'bold', fontSize: '5rem' }}>
          BUSINESS SUCCESS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginTop: '10px',
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          Welcome to Atlas, your all-in-one solution for tracking, analyzing,
          <br /> and optimizing your business performance.
        </Typography>

        {/* Buttons Section Below the Description */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, marginTop: '2rem', justifyContent: 'left' }}>
          <Link href="/login" passHref>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#fad655', // Same as the old code
                borderRadius: '2rem',
                color: '#962203',
                width: '13rem',
                height: '4rem',
                boxShadow: 'none', // Remove shadow for consistency
                '&:hover': {
                  backgroundColor: '#f1c40f', // Optional: Change hover color
                  transform: 'scale(1.1)',
                },
              }}
            >
              Login
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button
              variant="outlined"
              sx={{
                borderRadius: '2rem',
                borderColor: '#FFFFFF',
                color: '#FFFFFF', // Change text color to white
                width: '13rem',
                height: '4rem',
                '&:hover': {
                  borderColor: '#fad655', // Optional: Change border color on hover
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: Change background color on hover
                  transform: 'scale(1.1)',
                },
              }}
            >
              Sign up
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          backgroundImage: 'url("/welcome-image.png")',
          backgroundSize: 'cover',
          height: '35rem',
          width: '35rem',
          marginTop: '-4rem',
          marginLeft: '3rem', // This pushes the image to the right
          display: { xs: 'none', lg: 'block' }, // Hide on smaller screens
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      />
    </Box>
  );
};

export default NavigateBusiness
