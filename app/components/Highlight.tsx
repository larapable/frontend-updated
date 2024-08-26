import React from 'react'
import '@/app/page.css'

const Highlight = () => {
  return (
    <div className='gap-12 lg:flex mt-[8rem] justify-center text-center flex flex-col text-[#302E2E]'>
        <div className='flex flex-col'>
          <span className='text-[#302E2E] font-semibold text-4xl'>Why Choose Atlas?</span>
          <span className='mt-8 text-[1.5rem]'>Discover how Atlas can revolutionize your strategic planning with AI-driven insights,  <br/> comprehensive SWOT analysis, and balanced scorecard creation.</span>
        </div>
        <div className='flex flex-row justify-center mt-10'>
          <div className='flex flex-col transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
            <img src="/partner.png" alt="" className=" h-[20rem] mt-3 mb-5 mr-5" />
            <span className='text-[1.5rem] font-bold'>Strategy Partner</span>
          </div>
          <div className='flex flex-col transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
            <img src="/ai.png" alt="" className=" h-[20rem] mt-3 mb-5 mr-5" />
            <span className='text-[1.5rem] font-bold'>AI - Powered</span>
          </div>
          <div className='flex flex-col transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
            <img src="/ahead.png" alt="" className=" h-[20rem] mt-3 mb-5 mr-5" />
            <span className='text-[1.5rem] font-bold'>Always Ahead</span>
          </div>
        </div>
    </div>
  )
}

export default Highlight