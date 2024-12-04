import { useRef, useEffect, useState } from 'react';
import '@/app/page.css'
import { Box, Typography, Button, Paper, Avatar, Divider } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import { keyframes } from '@emotion/react';


const Pricing = () => {

  const [isHovered, setIsHovered] = useState(false);

  const titleStyle = {
    color: isHovered ? '#AB3510' : '#FFFFFF',
    transition: 'color 0.3s',
  };

  const textStyle = {
    color: isHovered ? '#302E2E' : '#FFFFFF',
    transition: 'color 0.3s',
  };

  const spinAnimation = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  return (
    <Box
      style={{
        backgroundImage: `url('/landingbg.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        animation: 'moveBackground 5s ease-in-out infinite',
      }}
      sx={{
        backgroundColor: '#fafac2',
        height: '100vh',
        display: 'flex',
        flexDirection: 'col',
        flexWrap: 'wrap',
        alignItems: 'center',
        textAlign: 'center',
        color: '#302E2E',
        justifyContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        padding: '2rem',
        position: 'relative',
      }}
      id="pricing-section"
    >
      <Box sx={{ mb: '-5rem' }}>
        <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' } }}>
          Start for free and upgrade to <br />
          <StarRateRoundedIcon 
            sx={{ 
              color: 'yellow', 
              ml: 1, // Add margin left
              animation: `${spinAnimation} 2s linear infinite`, // Apply spin animation
            }} 
          />
          unlock more features
          <StarRateRoundedIcon 
            sx={{ 
              color: 'yellow', 
              animation: `${spinAnimation} 2s linear infinite`, // Apply spin animation
            }} 
          />
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { lg: 'row', md: 'row', sm: 'column', xs: 'column' },
          gap: 5,
          mt: '6rem',
          alignItems: 'center',
          width: '100%',
          height: 'auto',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' },
            backgroundColor: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid #fad655',
            borderRadius: '2rem',
            height: '25rem',
            width: '18rem',
            textAlign: 'start',
            p: 5,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Typography sx={{ ...textStyle, fontSize: '15px' }}>
            Free
          </Typography>
          <Typography sx={{ ...titleStyle, fontWeight: '600', fontSize: { lg: '1.5rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
            PHP 0.00
          </Typography>
          <Typography sx={{ ...textStyle, fontSize: '15px' }}>
            Forever
          </Typography>

          <Divider sx={{ mx: 1, my: 2, background: 'white' }} />
          {[
            'Limited user accounts',
            'Limited Strategic Goals',
            'Maximum of 5 SWOT items',
            'Limited AI-generated insights',
            'PDF report download is not available',
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1, // Add margin-bottom between items
              }}
            >
              <CheckCircle
                sx={{ mr: 1, color: 'white' }}
              />
              <Typography sx={{ ...textStyle, fontSize: '13px' }}>
                {feature}
              </Typography>
            </Box>
          ))}
          <div className="flex justify-center space-x-4 mt-3">
            <Button
              href="/signup"
              sx={{
                background: '#ffffff',
                fontSize: "15px",
                fontWeight: "bold",
                color: '#AB3510',
                width: '13rem',
                height: '2rem',
                '&:hover': {
                  transform: 'scale(1.1)',
                  background: '#fad655'
                },
              }}
            >
              Get Started
            </Button>
          </div>
        </Box>

        <Box
          sx={{
            backgroundColor: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid #fad655',
            borderRadius: '2rem',
            height: '27rem',
            width: '18rem',
            textAlign: 'start',
            p: 5,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Typography sx={{ ...textStyle, fontSize: '15px' }}>
            Pro
          </Typography>
          <Typography sx={{ ...titleStyle, fontWeight: '600',fontSize: { lg: '1.5rem', sm: '1.5rem', md: '1.5rem', xs: '1rem' } }}>
            PHP 200.00
          </Typography>
          <Typography sx={{ ...textStyle, fontSize: '15px' }}>
            Per Month
          </Typography>

          <Divider sx={{ mx: 1, my: 2, background: 'white' }} />
          {[
            'Unlimited user accounts',
            'Unlimited strategic goals',
            'Unlimited SWOT analysis input',
            'Advanced AI-generated insights',
            'PDF report download available',
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1, // Add margin-bottom between items
              }}
            >
              <CheckCircle
                sx={{ mr: 1, color: 'white' }}
              />
              <Typography sx={{ ...textStyle, fontSize: '13px',  }}>
                {feature}
              </Typography>
            </Box>
          ))}
          <div className="flex justify-center space-x-4 mt-3">
            <Button
              href="/payment"
              sx={{
                background: '#ffffff',
                fontSize: "15px",
                fontWeight: "bold",
                color: '#AB3510',
                width: '13rem',
                height: '2rem',
                '&:hover': {
                  transform: 'scale(1.1)',
                  background: '#fad655'
                },
              }}
            >
              Get Started
            </Button>
          </div>
        </Box>

      </Box>
    </Box>
  );
};

export default Pricing