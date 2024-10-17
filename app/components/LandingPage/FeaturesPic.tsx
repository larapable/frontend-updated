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
            width: '50%', // Set width for the image box
            display: 'flex',
            justifyContent: 'center', // Center the image horizontally
            alignItems: 'center', 
            ml: '3rem', // Adjust margin left as needed
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
            display: 'flex',
            flexDirection: 'column',
            ml: '5rem', 
            mt: '15rem', 
            textAlign: 'left', 
            width: '40%', // Set a width for the text box to control justification
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            A Visual Tour of Atlas
          </Typography>
          <Typography sx={{ mt: "3rem", fontSize: '1.5rem', textAlign: 'justify' }}>
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