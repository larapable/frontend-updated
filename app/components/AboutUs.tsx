import { useRef, useEffect } from 'react';
import '@/app/page.css'

const AboutUs = () => {


  return (
    <div className='bg-[#fafac2] h-screen w-[100%] mt-[10rem] justify-center text-center text-[#302E2E]'
          id="strategic-management-section">
      <div className='flex flex-col'>
        <span className='text-[#302E2E] font-semibold text-4xl mt-[7rem]'>What Makes Atlas Stand Out?</span>
        <span className='mt-8 text-[1.5rem]'>Explore what distinguishes Atlas as the leading platform for strategic planning and <br/>
          execution, offering advanced tools and AI-driven insights
        </span>
      </div>
      <div className='flex flex-row gap-10 mt-20 items-center justify-center'>
        <div className='bg-white w-[50rem] h-[13rem] border border-gray-100 shadow-md rounded-2xl transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
          <div className='flex flex-row'>
            <img src="/swotFeature.png" alt="" className=" h-[10rem] mt-5 ml-5" />
            <div className='flex flex-col text-start ml-3'>
              <span className='mt-10 text-2xl font-semibold'>SWOT Analysis</span>
              <span className='mt-3 text-[1.2rem] font-regular'>Conduct comprehensive SWOT analyses to evaluate internal strengths and weaknesses, as well as external opportunities and threats.</span>
            </div>
          </div>
        </div>
        <div className='bg-white w-[50rem] h-[13rem] border border-gray-100 shadow-md rounded-2xl transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
          <div className='flex flex-row'>
            <img src="/scorecardFeature.png" alt="" className=" h-[10rem] mt-5 ml-5" />
            <div className='flex flex-col text-start ml-3'>
              <span className='mt-10 text-2xl font-semibold'>Business Scorecard</span>
              <span className='mt-3 text-[1.2rem] font-regular'>Track and measure performance metrics across various perspectives, including financial, customer, internal processes, 
              and learning and growth.</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-row gap-10 mt-10 items-center justify-center'>
        <div className='bg-white w-[50rem] h-[13rem] border border-gray-100 shadow-md rounded-2xl transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
          <div className='flex flex-row'>
            <img src="/mappingFeature.png" alt="" className=" h-[10rem] mt-5 ml-5" />
            <div className='flex flex-col text-start ml-3'>
              <span className='mt-10 text-2xl font-semibold'>Strategic Mapping</span>
              <span className='mt-3 text-[1.2rem] font-regular'>Create visual representations of organizational objectives, initiatives, and their interrelationships using strategic maps.</span>
            </div>
          </div>
        </div>
        <div className='bg-white w-[50rem] h-[13rem] border border-gray-100 shadow-md rounded-2xl transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
          <div className='flex flex-row'>
            <img src="/visualizationFeature.png" alt="" className=" h-[10rem] mt-5 ml-5" />
            <div className='flex flex-col text-start ml-3'>
              <span className='mt-10 text-2xl font-semibold'>Data Visualization</span>
              <span className='mt-3 text-[1.2rem] font-regular'>Analyze data using built-in analytical tools and visualize results through charts, graphs, and other visualizations.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs