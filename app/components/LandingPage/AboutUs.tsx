import { useRef, useEffect } from 'react';
import '@/app/page.css'
import { Box, Paper, Typography } from '@mui/material';

const AboutUs = () => {


  return (
    <Box
      sx={{
        backgroundColor: '#fafac2',
        height: '125vh',
        mt: '10rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: '#302E2E',

          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
      }}
      id="strategic-management-section"
    >
      <Box sx={{ mt: '-3rem', mb: '-5rem' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#302E2E' }}>
          What Makes Atlas Stand Out?
        </Typography>
        <Typography sx={{ mt: 2, fontSize: '1.5rem' }}>
          Explore what distinguishes Atlas as the leading platform for strategic planning and <br />
          execution, offering advanced tools and AI-driven insights
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Paper
          sx={{
            width: '40rem',
            height: '13rem',
            border: '1px solid #E0E0E0',
            boxShadow: 3,
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            padding: '1.5rem', // Added padding for spacing
            display: 'flex',
            alignItems: 'center', // Center content vertically
          }}
        >
          <img
            src="/swotFeature.png"
            alt="SWOT Analysis"
            style={{ height: '8rem', marginRight: '1.25rem' }} // Adjusted height and margin
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'start' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              SWOT Analysis
            </Typography>
            <Typography sx={{ mt: 1, fontSize: '1.2rem' }}>
              Conduct comprehensive SWOT analyses to evaluate internal strengths and weaknesses, as well as external opportunities and threats.
            </Typography>
          </Box>
        </Paper>


        <Paper
          sx={{
            width: '40rem',
            height: '13rem',
            border: '1px solid #E0E0E0',
            boxShadow: 3,
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            padding: '1.5rem', // Added padding for spacing
            display: 'flex',
            alignItems: 'center', // Center content vertically
          }}
        >
          <img
            src="/scorecardFeature.png"
            alt="Business Scorecard"
            style={{ height: '8rem', marginRight: '1.25rem' }} // Adjusted height and margin
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'start' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Business Scorecard
            </Typography>
            <Typography sx={{ mt: 1, fontSize: '1.2rem' }}>
              Track and measure performance metrics across various perspectives, including financial, customer, internal processes, and learning and growth.
            </Typography>
          </Box>
        </Paper>

      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 10, alignItems: 'center', justifyContent: 'center' }}>
        <Paper
          sx={{
            width: '40rem',
            height: '13rem',
            border: '1px solid #E0E0E0',
            boxShadow: 3,
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            padding: '1.5rem', // Added padding for spacing
            display: 'flex',
            alignItems: 'center', // Center content vertically
          }}
        >
          <img
            src="/mappingFeature.png"
            alt="Strategic Mapping"
            style={{ height: '8rem', marginRight: '1.25rem' }} // Adjusted height and margin
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'start' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Strategic Mapping
            </Typography>
            <Typography sx={{ mt: 1, fontSize: '1.2rem' }}>
              Create visual representations of organizational objectives, initiatives, and their interrelationships using strategic maps.
            </Typography>
          </Box>
        </Paper>


        <Paper
          sx={{
            width: '40rem',
            height: '13rem',
            border: '1px solid #E0E0E0',
            boxShadow: 3,
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            padding: '1.5rem', // Added padding for spacing
            display: 'flex',
            alignItems: 'center', // Center content vertically
          }}
        >
          <img
            src="/visualizationFeature.png"
            alt="Data Visualization"
            style={{ height: '8rem', marginRight: '1.25rem' }} // Adjusted height and margin
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'start' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Data Visualization
            </Typography>
            <Typography sx={{ mt: 1, fontSize: '1.2rem' }}>
              Analyze data using built-in analytical tools and visualize results through charts, graphs, and other visualizations.
            </Typography>
          </Box>
        </Paper>

      </Box>
    </Box>
  );
};

export default AboutUs