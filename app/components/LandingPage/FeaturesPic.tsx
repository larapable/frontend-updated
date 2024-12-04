import { Box, Typography } from '@mui/material';
import React from 'react';
import { useState, ChangeEvent, MouseEvent, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FeaturesPic = () => {

  // SLIDESHOW
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    'f-scorecard.png',
    'f-stratmap.png',
    'f-swot.png',
    'f-report.png',
  ];

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <Box
      sx={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '2rem',
        position: 'relative',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#302E2E',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {/* Image Box */}
        <Box
          sx={{
            width: { lg: '50%', md: '50%', sm: '100%', xs: '100%' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', 
            ml: { lg: '3rem', md: '3rem', sm: '1rem', xs: '0.5rem' },
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            style={{ maxWidth: '100%', height: 'auto' }} // Ensure the image is responsive
          />
        </Box>
  
        {/* Description Box */}
        <Box
          sx={{
            display: {lg:'flex', md: 'flex', sm: 'none', xs: 'none'},
            flexDirection: 'column',
            ml: '3rem', 
            mt: '2rem', 
            textAlign: 'left', 
            width: '40%', // Set a width for the text box to control justification
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '2rem', sm: '2rem', md: '2rem', xs: '1.5rem' } }}>
            A Visual Tour of Atlas
          </Typography>
          <Typography sx={{ mt: "2rem", textAlign: 'justify', fontSize: { lg: '1.3rem', sm: '1rem', md: '1rem', xs: '0.8rem' } }}>
            Take a guided tour through Atlas and explore its intuitive interface
            and powerful features firsthand. This slideshow offers a glimpse into
            how Atlas simplifies strategic planning with AI-driven tools,
            facilitates SWOT analysis, creates balanced scorecards, and generates
            insightful reports—all designed to enhance decision-making and drive
            organizational success.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
};

export default FeaturesPic