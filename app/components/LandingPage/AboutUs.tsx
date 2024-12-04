import { useState } from 'react';
import '@/app/page.css';
import { Box, Typography } from '@mui/material';
import { Icon } from '@iconify/react';

interface FeatureBoxProps {
  icon: string;
  term: string;
  definition: string;
}

const AboutUs = () => {
  const features = [
    {
      icon: 'mdi:strategy',
      term: 'Strategic Planning',
      definition:
        'Provides comprehensive frameworks to develop long-term strategic plans.',
    },
    {
      icon: 'mdi:chart-timeline-variant',
      term: 'Execution Management',
      definition:
        'Manage and execute your strategic plans with our user-friendly tools.',
    },
    {
      icon: 'mdi:brain',
      term: 'AI-Driven Insights',
      definition:
        'Leverage advanced AI algorithms to gain actionable insights.',
    },
    {
      icon: 'mdi:chart-areaspline',
      term: 'Performance Tracking',
      definition:
        'Track KPIs in real time to evaluate the effectiveness of your strategies.',
    },
    {
      icon: 'mdi:clipboard-list',
      term: 'SWOT Analysis',
      definition:
        'Conduct thorough SWOT analyses enabling you to capitalize on your unique position in the market.',
    },
  ];

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
        mt: '10rem',
        display: 'flex',
        flexDirection: 'row',
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
      id="strategic-management-section"
    >
      <Box sx={{ mb: '-5rem' }}>
        <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' } }}>
          What Makes Atlas Stand Out?
        </Typography>
        <Typography sx={{ mt: 2, color: 'white', fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' }  }}>
          Explore what distinguishes Atlas as the leading platform for
          <br />strategic planning and
          execution, offering advanced tools and AI-driven insights
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          width: '100%',
          height: 'auto',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {features.map((feature, index) => (
          <FeatureBox key={index} {...feature} />
        ))}
      </Box>
    </Box>
  );
};

const FeatureBox = ({ icon, term, definition }: FeatureBoxProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const boxStyle = {
    backgroundColor: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
    border: '1px solid #fad655',
    borderRadius: '2rem',
    padding: '2rem',
    width: {lg: '300px'},
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: { lg: 'row', md: 'row', sm: 'column', xs: 'column' },
    height: { lg: '280px', md: '280px', sm: '280px', xs: '280px' },
    marginTop: { lg: '3rem' },
    cursor: 'pointer',
    overflow: 'hidden',
    wordWrap: 'break-word',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };

  const titleStyle = {
    color: isHovered ? '#AB3510' : '#FFFFFF',
    transition: 'color 0.3s',
  };

  const textStyle = {
    color: isHovered ? '#302E2E' : '#FFFFFF',
    transition: 'color 0.3s',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const iconStyle = {
    color: isHovered ? '#AB3510' : '#FFFFFF',
    fontSize: '1.8rem',
    transition: 'color 0.3s',
  };

  return (
    <Box
      sx={boxStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon icon={icon} style={iconStyle} />
      <Typography sx={{ mt: 2, ...titleStyle, fontWeight: '600' }}>
        {term}
      </Typography>
      <Typography sx={{ mt: 2, ...textStyle, fontSize: '15px' }}>
        {definition}
      </Typography>
    </Box>
  );
};

export default AboutUs;