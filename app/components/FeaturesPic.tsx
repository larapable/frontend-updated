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
    <div className='h-screen w-[100%] justify-center align-middle items-center text-[#302E2E]'>
      <div className='flex flex-row justify-center'>
        <div className="w-[50%] mt-[7rem]">
          <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
        </div>
        <div className='flex flex-col ml-20 mt-[20rem]'>
          <span className='text-[3rem] font-bold break-words'>A Visual Tour of Atlas</span>
          <span className='text-[1.3rem] font-regular break-words mt-10'>
            Take a guided tour through Atlas and explore its intuitive interface <br/>
            and powerful features firsthand. This slideshow offers a glimpse into <br/>
            how Atlas simplifies strategic planning with AI-driven tools, <br/>
            facilitates SWOT analysis, creates balanced scorecards, and generates <br/>
            insightful reports—all designed to enhance decision-making and drive <br/>
            organizational success.
          </span>
        </div>
      </div>
    </div>
  )
}

export default FeaturesPic