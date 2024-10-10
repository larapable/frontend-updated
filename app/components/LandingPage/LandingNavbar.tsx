import Image from "next/image"
import Link from "next/link"
import { useRef } from 'react';
import { useRouter } from 'next/router';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";

const Navbar = () => {

  // WHEN HOME IS CLICKED
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
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

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(to left, #882723, #AB3510)", height: '20rem' }}>
      <Toolbar sx={{ justifyContent: "space-between", height: "7rem", backgroundColor: "rgba(180,54,54,0.31)", borderRadius: "1.3rem", padding: "1.3rem 2.5rem" }}>

        {/* Logo */}
        <Link href="/">
          <IconButton edge="start" color="inherit" aria-label="logo">
            <Image src="/logo.png" alt="logo" width={100} height={80} />
          </IconButton>
        </Link>

        {/* Navigation */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            gap: 5, // Space between all items
            alignItems: 'center', // Align items vertically in the center
          }}
        >
          <Typography
            component="span" // Using span for inline element
            sx={{
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '1.3rem', // Same font size
              fontFamily: 'Arial, sans-serif', // Same font family
              "&:hover": { fontWeight: 'bold', color: '#FAD655' },
              transition: 'all 0.3s',
            }}
            onClick={handleHomeClick}
          >
            Home
          </Typography>

          <Typography
            component="span"
            sx={{
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '1.3rem',
              fontFamily: 'Arial, sans-serif',
              "&:hover": { fontWeight: 'bold', color: '#FAD655' },
              transition: 'all 0.3s',
            }}
            onClick={handleAboutUsClick}
          >
            About Us
          </Typography>

          <Typography
            component="span"
            sx={{
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '1.3rem',
              fontFamily: 'Arial, sans-serif',
              "&:hover": { fontWeight: 'bold', color: '#FAD655' },
              transition: 'all 0.3s',
            }}
            onClick={handleFeatureClick}
          >
            Features
          </Typography>

          <Link href="/team" passHref>
            <Button
              sx={{
                color: '#FFFFFF',
                fontSize: '1.3rem',
                fontFamily: 'Arial, sans-serif',
                "&:hover": { fontWeight: 'bold', color: '#FAD655' },
                transition: 'all 0.3s',
                textTransform: 'none', // To prevent uppercase button text
              }}
            >
              Team
            </Button>
          </Link>

          <Link href="/contact" passHref>
            <Button
              sx={{
                color: '#FFFFFF',
                fontSize: '1.3rem',
                fontFamily: 'Arial, sans-serif',
                "&:hover": { fontWeight: 'bold', color: '#FAD655' },
                transition: 'all 0.3s',
                textTransform: 'none', // To prevent uppercase button text
              }}
            >
              Contact
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar