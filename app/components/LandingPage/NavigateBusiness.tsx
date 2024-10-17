'use client';
import Link from 'next/link'
import React from 'react'
import '@/app/page.css'
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';


const NavigateBusiness = () => {
  return (
    <section 
      className="bg-cover bg-center py-20 text-white min-h-screen" 
      style={{ backgroundImage: `url('/landingbg.png')` }} 
    >
      <div className="container mx-auto text-center justify-center items-center">
        <div className="max-w-3xl mx-auto">
          {/* Image */}
          <div className="flex overflow-hidden justify-center items-center"> {/* Added wrapper */}
            <Image 
              src="/landingbg.gif" 
              alt="Navigate Business" 
              width={300} 
              height={200} 
            />
          </div>

          {/* Title */}
          <Typography sx={{fontWeight: "bold", mb: 1, fontSize: "5rem"}}>Navigate Your Business with Ease</Typography>

          {/* Short Description */}
          <Typography sx={{fontWeight: "regular", mb: 4, fontSize: "1.5rem"}}>
            Welcome to Atlas, your all-in-one solution for tracking, analyzing,
            <br /> and optimizing your business performance.
          </Typography>

          {/* Circle Buttons */}
          <div className="flex justify-center space-x-4">
          <Button
              href="/contact"
              variant="outlined"
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
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
              Connect
              <MailOutlineIcon sx={{ color: '#ffffff', ml:2 }} />
            </Button>
            <Button
              component="a" 
              href="https://www.instagram.com/gen_ming" 
              target="_blank" 
              rel="noopener noreferrer"
              variant="outlined"
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: '5rem',
                borderColor: '#FFFFFF',
                color: '#FFFFFF', // Change text color to white
                width: '3rem',
                height: '4rem',
                '&:hover': {
                  borderColor: '#fad655', // Optional: Change border color on hover
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: Change background color on hover
                  transform: 'scale(1.1)',
                },
              }}
            >
              <InstagramIcon sx={{ color: '#ffffff' }} />
            </Button>
            <Button
              component="a" 
              href="https://www.facebook.com/lara.pable"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: '5rem',
                borderColor: '#FFFFFF',
                color: '#FFFFFF', // Change text color to white
                width: '3rem',
                height: '4rem',
                '&:hover': {
                  borderColor: '#fad655', // Optional: Change border color on hover
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: Change background color on hover
                  transform: 'scale(1.1)',
                },
              }}
            >
              <FacebookOutlinedIcon sx={{ color: '#ffffff'}} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavigateBusiness;
