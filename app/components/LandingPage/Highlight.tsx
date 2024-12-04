import React from 'react'
import '@/app/page.css'
import { Box, Typography } from '@mui/material';

const Highlight = () => {
  return (
    <Box
      sx={{
        mb: '-3rem',
        mt: '5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: '#302E2E'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' } }}>
          Why Choose Atlas?
        </Typography>
        <Typography sx={{ mt: 2, fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
          Discover how Atlas can revolutionize your strategic planning with AI-driven  <br />insights,
          comprehensive SWOT analysis, and balanced scorecard creation.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 5,
          flexDirection: {lg: 'row', sm: 'column', md: 'row', xs: 'column'}
        }}
      >
        {[
          { img: "/partner.png", title: "Strategy Partner" },
          { img: "/ai.png", title: "AI - Powered" },
          { img: "/ahead.png", title: "Always Ahead" },
        ].map((feature, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              mx: 2 // Adds some margin between columns
            }}
          >
            <img
              src={feature.img}
              alt={feature.title}
              style={{ height: '15rem', marginTop: '1rem', marginBottom: '1rem' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              {feature.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
};

export default Highlight