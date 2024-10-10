import React from 'react'
import Link from "next/link"
import { Box, Typography, Button, IconButton } from '@mui/material';

const BottomPage = () => {

  // WHEN ABOUT US IS CLICKED
  const handleAboutUsClick = () => {
    const element = document.getElementById("strategic-management-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  // WHEN FEATURE IS CLICKED
  const handleFeatureClick = () => {
    const element = document.getElementById("feature-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // WHEN PRICING IS CLICKED
  const handlePricingClick = () => {
    const element = document.getElementById("pricing-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', p: '1.2rem 1.6rem', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '90%', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box
            sx={{
              background: 'linear-gradient(to left, #882723, #AB3510)',
              borderRadius: '0.6rem',
              width: '17.9rem',
              height: '10.4rem',
              mr: 2,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                backgroundImage: 'url("/logo.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '1.5rem', margin: '3.7rem 0 2.3rem 0' }}>
            NAVIGATE YOUR <br />
            <span style={{ color: '#fad655', fontWeight: 'bold', fontSize: '2rem' }}>BUSINESS SUCCESS</span>
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#686666' }}>Atlas</Typography>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={handleAboutUsClick}>About us</Typography>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={handleFeatureClick}>Features</Typography>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={handlePricingClick}>Pricing</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#686666' }}>Organization</Typography>
            <Link href="/team" passHref>
              <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Team</Typography>
            </Link>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Services</Typography>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Projects</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#686666' }}>Quick Links</Typography>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Facebook</Typography>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Instagram</Typography>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Gmail</Typography>
            <Typography variant="body2" sx={{ color: '#686666', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Twitter</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'space-between', width: '90%', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#504B4B' }}>Stay Connected</Typography>
          <Link href="/contact">
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
              <IconButton>
                <img src="fb.png" alt="Facebook" width="30" height="30" />
              </IconButton>
              <IconButton>
                <img src="gmail.png" alt="Gmail" width="30" height="30" />
              </IconButton>
              <IconButton>
                <img src="insta.png" alt="Instagram" width="30" height="30" />
              </IconButton>
              <IconButton>
                <img src="twitter.png" alt="Twitter" width="30" height="30" />
              </IconButton>
              <IconButton>
                <img src="phone.png" alt="Phone" width="30" height="30" />
              </IconButton>
            </Box>
          </Link>
        </Box>

        <Typography variant="body2" sx={{ fontWeight: 'normal', color: '#504B4B', marginTop: '3rem' }}>Copyright. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default BottomPage