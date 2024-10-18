import { useRef, useEffect, useState } from 'react';
import '@/app/page.css'
import { Box, Typography, Button, Paper, Avatar, Divider } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';


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
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
          Start for free and upgrade to <br />unlock more features
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'col',
          gap: 5,
          mt: 10,
          alignItems: 'center',
          width: '100%',
          height: 'auto',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid #fad655',
            borderRadius: '2rem',
            height: '33rem',
            width: '25rem',
            textAlign: 'start',
            p: 5,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Typography sx={{ ...textStyle, fontSize: '18px' }}>
            Free
          </Typography>
          <Typography variant="h4" sx={{ ...titleStyle, fontWeight: '600' }}>
            PHP 0.00
          </Typography>
          <Typography sx={{ ...textStyle, fontSize: '18px' }}>
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
                sx={{ mr: 1, mt: 2, color: 'white' }}
              />
              <Typography sx={{ ...textStyle, fontSize: '18px', mt: 2 }}>
                {feature}
              </Typography>
            </Box>
          ))}
          <div className="flex justify-center space-x-4 mt-3">
            <Button
              href="/signup"
              sx={{
                background: '#ffffff',
                fontSize: "18px",
                fontWeight: "bold",
                color: '#AB3510',
                width: '13rem',
                height: '3rem',
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
            height: '38rem',
            width: '25rem',
            textAlign: 'start',
            p: 5,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Typography sx={{ ...textStyle, fontSize: '18px' }}>
            Pro
          </Typography>
          <Typography variant="h4" sx={{ ...titleStyle, fontWeight: '600' }}>
            PHP 200.00
          </Typography>
          <Typography sx={{ ...textStyle, fontSize: '18px' }}>
            Forever
          </Typography>

          <Divider sx={{ mx: 1, my: 2, background: 'white' }} />
          {[
            'Unlimited user accounts',
            'Unlimited strategic goals',
            'Unlimited SWOT analysis input',
            'Advanced AI-generated insights',
            'PDF report download available',
            'Unlimited strategy maps',
            'Unlimited balanced scorecards',
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
                sx={{ mr: 1, mt: 2, color: 'white' }}
              />
              <Typography sx={{ ...textStyle, fontSize: '18px', mt: 2 }}>
                {feature}
              </Typography>
            </Box>
          ))}
          <div className="flex justify-center space-x-4 mt-3">
            <Button
              href="/payment"
              sx={{
                background: '#ffffff',
                fontSize: "18px",
                fontWeight: "bold",
                color: '#AB3510',
                width: '13rem',
                height: '3rem',
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