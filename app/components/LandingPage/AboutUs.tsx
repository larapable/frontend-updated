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
        'Our platform provides comprehensive frameworks to develop long-term strategic plans tailored to your organization’s goals and market dynamics.',
    },
    {
      icon: 'mdi:chart-timeline-variant',
      term: 'Execution Management',
      definition:
        'Efficiently manage and execute your strategic plans with our user-friendly tools designed to monitor progress and adapt to changing conditions.',
    },
    {
      icon: 'mdi:brain',
      term: 'AI-Driven Insights',
      definition:
        'Leverage advanced AI algorithms to gain actionable insights that enhance decision-making and drive performance improvements across your organization.',
    },
    {
      icon: 'mdi:chart-areaspline',
      term: 'Performance Tracking',
      definition:
        'Track key performance indicators (KPIs) in real time to evaluate the effectiveness of your strategies and make informed adjustments as necessary.',
    },
    {
      icon: 'mdi:clipboard-list',
      term: 'SWOT Analysis',
      definition:
        'Conduct thorough SWOT analyses to identify strengths, weaknesses, opportunities, and threats, enabling you to capitalize on your unique position in the market.',
    },
  ];

  return (
    <Box
      style={{ backgroundImage: `url('/landingbg.png')` }}
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
      <Box sx={{mb: '-5rem' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
          What Makes Atlas Stand Out?
        </Typography>
        <Typography sx={{ mt: 2, fontSize: '1.5rem', color: 'white' }}>
          Explore what distinguishes Atlas as the leading platform for
          strategic planning and <br />
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
    width: '300px', 
    textAlign: 'center',
    justifyContent: 'center',
    height: '400px', 
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
  };

  const iconStyle = {
    color: isHovered ? '#AB3510' : '#FFFFFF',
    fontSize: '3rem',
    transition: 'color 0.3s',
  };

  return (
    <Box
      sx={boxStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon icon={icon} style={iconStyle} />
      <Typography variant="h5" sx={{ mt: 2, ...titleStyle, fontWeight:'600' }}>
        {term}
      </Typography>
      <Typography sx={{ mt: 3, ...textStyle, fontSize: '18px' }}>
        {definition}
      </Typography>
    </Box>
  );
};

export default AboutUs;