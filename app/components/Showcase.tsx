import React from 'react'
import '@/app/page.css'

const Showcase = () => {
  return (
    <div className='gap-12 lg:flex mt-[8rem] justify-center text-center flex flex-col text-[#302E2E]'
          id="features-section">
        <div className='flex flex-col'>
          <span className='text-[#302E2E] font-semibold text-4xl'>Atlas Feature Showcase</span>
          <span className='mt-8 text-[1.5rem]'>Dive into the feature showcase of Atlas and discover a comprehensive suite <br/>
          designed to elevate your strategic planning endeavors.</span>
        </div>
        <div className='flex flex-row justify-center mt-[5rem]'>
          <div className='flex flex-col transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
            <img src="/goalFeature.png" alt="" className=" h-[15rem] mt-3 mb-5 mr-5" />
            <span className='text-[1.5rem] font-bold'>Goal Setting</span>
          </div>
          <div className='flex flex-col transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
            <img src="/swot.png" alt="" className=" h-[15rem] mt-3 mb-5 mr-5" />
            <span className='text-[1.5rem] font-bold'>SWOT Analysis</span>
          </div>
          <div className='flex flex-col transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
            <img src="/strategic.png" alt="" className=" h-[15rem] mt-3 mb-5 mr-5" />
            <span className='text-[1.5rem] font-bold'>Strategy Mapping</span>
          </div>
          <div className='flex flex-col transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
            <img src="/card.png" alt="" className=" h-[15rem] mt-3 mb-5 mr-5" />
            <span className='text-[1.5rem] font-bold'>Balance Scorecard</span>
          </div>
          <div className='flex flex-col transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
            <img src="/visualization.png" alt="" className=" h-[15rem] mt-3 mb-5 mr-5" />
            <span className='text-[1.5rem] font-bold'>Visualization</span>
          </div>
        </div>
    </div>
  )
}

export default Showcase