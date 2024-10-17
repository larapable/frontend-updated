import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutUsClick = () => {
    const element = document.getElementById("strategic-management-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBenefitClick = () => {
    const element = document.getElementById("benefit-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="bg-gray-100 py-5 px-6" style={{background: "linear-gradient(to left, #882723, #AB3510)"}}>
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        <Link href="/">
          <div className="flex justify-start">
            <Image src="/logo.png" alt="Logo" width={150} height={150} />
          </div>
        </Link>

        <button
          className="block lg:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            ) : (
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            )}
          </svg>
        </button>

        <div className="hidden lg:flex space-x-8">
        <Typography
            component="span" 
            sx={{
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '1.3rem', 
              fontFamily: 'Arial, sans-serif', 
              "&:hover": { fontWeight: 'bold', color: '#ffffff' },
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
              "&:hover": { fontWeight: 'bold', color: '#ffffff' },
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
              "&:hover": { fontWeight: 'bold', color: '#ffffff' },
              transition: 'all 0.3s',
            }}
            onClick={handleBenefitClick}
          >
            Benefits
          </Typography>
          <a
            href="/team"
            // component="span"
            className='hover:font-bold'
            style={{
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '1.3rem',
              fontFamily: 'Arial, sans-serif',
              transition: 'all 0.3s',
            }}
          >
            Team
          </a>
          <a
            href="/contact"
            className='hover:font-bold'
            // component="span"
            style={{
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '1.3rem',
              fontFamily: 'Arial, sans-serif',
              transition: 'all 0.3s',
            }}
          >
            Contact
          </a>
        </div>

        <div className="hidden lg:flex space-x-4">
          <Link href="/login" passHref>
            <div className="px-6 py-3 border border-[#FFFFFF] text-white rounded-3xl hover:border-[#faa555] hover:bg-[#ffe68d86] text-lg font-semibold">
              Login
            </div>
          </Link>
          <Link href="/signup" passHref>
          <div className="px-5 py-3 border border-[#fad655] text-[#962203] bg-[#fad655] rounded-3xl hover:border-[#fad655] hover:bg-[#ffe68d86] text-lg font-semibold">
              Signup
            </div>
          </Link>
        </div>

        {/* Mobile Menu (Visible on smaller screens) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 w-full">
            <ul className="space-y-4">
              <li>
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
                onClick={handleHomeClick}
              >
                Home
              </Typography>
              </li>
              <li>
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
              </li>
              <li>
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
                onClick={handleBenefitClick}
              >
                Benefits
              </Typography>
              </li>
              <a
                href="/team"
                 className='hover:font-bold'
                style={{
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  fontSize: '1.3rem',
                  fontFamily: 'Arial, sans-serif',
                  transition: 'all 0.3s',
                }}
              >
                Team
              </a>
              <li>
              <a
                href="/contact"
                className='hover:font-bold'
                style={{
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  fontSize: '1.3rem',
                  fontFamily: 'Arial, sans-serif',
                  transition: 'all 0.3s',
                }}
              >
                Contact
              </a>
              </li>
              <li>
                <Link href="/login">
                  <div className="px-6 py-3 border border-[#FFFFFF] text-white rounded-3xl hover:border-[#fad655] hover:bg-[#ffe68d86] text-lg font-semibold block text-center">
                    Login
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                <div className="px-5 py-3 border border-[#fad655] text-[#962203] bg-[#fad655] rounded-3xl hover:border-[#fad655] hover:bg-[#ffe68d86] text-lg font-semibold block text-center">
                    Signup
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;