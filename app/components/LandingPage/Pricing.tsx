import { useRef, useEffect } from 'react';
import '@/app/page.css'
import { Box, Typography, Button, Paper, Avatar, Divider } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';


const Pricing = () => {


  return (
    <Box
      sx={{
        backgroundColor: '#fafac2',
        height: '110vh',
        width: '100%',
        mt: '12rem',
        textAlign: 'center',
        color: '#302E2E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      id="pricing-section"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" fontWeight="bold">
          Choose Your Plan
        </Typography>
        <Typography variant="h6" mt={2}>
          Choose the right plan for your needs. Unlock powerful features and <br />
          enhance your strategic planning today.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
          mt: 4,
        }}
      >
        {/* FREE */}
        <Paper
          elevation={3}
          sx={{
            height: '35rem',
            width: '25rem',
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', p: 3 }}>
            <Avatar sx={{ bgcolor: '#FFF9C4', height: '6rem', width: '6rem' }}>
              <img src="/coins.png" alt="" style={{ height: '5rem', width: '5rem' }} />
            </Avatar>
            <Box sx={{ ml: 2, mt: 1 }}>
              <Typography variant="h6" fontWeight="medium">
                Free
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Typography variant="h4" fontWeight="extrabold" mt={1}>
                  $0.00
                </Typography>
                <Typography variant="body1" color="text.secondary" ml={1}>
                  /month
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ mx: 2, my: 1 }} />
          <Box sx={{ p: 2 }}>
            {Array(5)
              .fill('lorem')
              .map((text, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2, color: '#d14330' }}>
                  <CheckCircle sx={{ color: '#d14330' }} />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {text}
                  </Typography>
                </Box>
              ))}
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#e0e0e0',
              width: '20rem',
              margin: 'auto',
              marginTop: '2rem',
              borderRadius: '30px',
              '&:hover': {
                bgcolor: '#AB3510',
                color: 'white',
              },
            }}
          >
            Get Started
          </Button>
        </Paper>

        {/* BASIC */}
        <Paper
          elevation={3}
          sx={{
            height: '35rem',
            width: '25rem',
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', p: 3 }}>
            <Avatar sx={{ bgcolor: '#FFF9C4', height: '6rem', width: '6rem' }}>
              <img src="/coins.png" alt="" style={{ height: '5rem', width: '5rem' }} />
            </Avatar>
            <Box sx={{ ml: 2, mt: 1 }}>
              <Typography variant="h6" fontWeight="medium">
                Basic
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Typography variant="h4" fontWeight="extrabold" mt={1}>
                  $10.00
                </Typography>
                <Typography variant="body1" color="text.secondary" ml={1}>
                  /month
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ mx: 2, my: 1 }} />
          <Box sx={{ p: 2 }}>
            {Array(5)
              .fill('lorem')
              .map((text, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2, color: '#d14330' }}>
                  <CheckCircle sx={{ color: '#d14330' }} />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {text}
                  </Typography>
                </Box>
              ))}
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#e0e0e0',
              width: '20rem',
              margin: 'auto',
              marginTop: '2rem',
              borderRadius: '30px',
              '&:hover': {
                bgcolor: '#AB3510',
                color: 'white',
              },
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default Pricing