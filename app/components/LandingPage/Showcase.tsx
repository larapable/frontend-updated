import React from 'react'
import '@/app/page.css'
import { Box, Grid, Typography } from '@mui/material';

const Showcase = () => {
  return (
    <Box
      sx={{
        mb: -10,
        mt: 8,
        textAlign: 'center',
        color: '#302E2E',
        gap: 3,
      }}
      id="features-section"
    >
      {/* Title and Description */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#302E2E' }}>
          Atlas Feature Showcase
        </Typography>
        <Typography sx={{ mt: 2, fontSize: '1.5rem' }}>
          Dive into the feature showcase of Atlas and discover a comprehensive suite designed to elevate your strategic planning endeavors.
        </Typography>
      </Box>

      {/* Feature Items */}
      <Grid container spacing={4} justifyContent="center">
        {[
          { img: "/goalFeature.png", title: "Goal Setting" },
          { img: "/swot.png", title: "SWOT Analysis" },
          { img: "/strategic.png", title: "Strategy Mapping" },
          { img: "/card.png", title: "Balance Scorecard" },
          { img: "/visualization.png", title: "Visualization" }
        ].map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                  // transition: 'transform 0.3s ease-in-out',
                  // '&:hover': {
                  //   transform: 'scale(1.1)',
                  // },
              }}
            >
              <img
                src={feature.img}
                alt={feature.title}
                style={{ height: '13rem', marginTop: '1rem', marginBottom: '1rem' }} // Adjusted height to 10rem
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}> {/* Adjusted font size for title */}
                {feature.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default Showcase