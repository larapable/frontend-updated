import { useRef, useEffect } from 'react';
import '@/app/page.css'

const Benefits = () => {


  return (
    <div className='bg-[#fafac2] h-screen w-[100%] justify-center text-center text-[#302E2E]'
        id="benefits-section">
      <div className='flex flex-col'>
        <span className='text-[#302E2E] font-semibold text-4xl mt-[7rem]'>Benefits of Choosing Atlas</span>
        <span className='mt-8 text-[1.5rem]'>Explore the advantages of using Atlas for your strategic planning needs. <br/> Benefit from intuitive AI-powered tools.
        </span>
      </div>

      <div className='flex flex-row justify-center gap-10'>
        <img src="/advantages.png" alt="" className=" h-[30rem] mt-20" />
        <div className='flex flex-col mt-[9rem] gap-5'>
            <div className='flex flex-row text-[#d14330] gap-5'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                </svg>
                <span className='text-[#302E2E] text-[1.5rem]'>Streamline strategic planning with intuitive AI-driven features.</span>
            </div>
            <div className='flex flex-row text-[#d14330] gap-5'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                </svg>
                <span className='text-[#302E2E] text-[1.5rem]'>Gain a competitive edge through comprehensive SWOT analysis.</span>
            </div>
            <div className='flex flex-row text-[#d14330] gap-5'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                </svg>
                <span className='text-[#302E2E] text-[1.5rem]'>Precisely map strategies to key business perspectives.</span>
            </div>
            <div className='flex flex-row text-[#d14330] gap-5'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                </svg>
                <span className='text-[#302E2E] text-[1.5rem]'>Leverage AI-driven insights for innovative strategy development.</span>
            </div>
            <div className='flex flex-row text-[#d14330] gap-5'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                </svg>
                <span className='text-[#302E2E] text-[1.5rem]'>Track progress and performance metrics seamlessly.</span>
            </div>
            <div className='flex flex-row text-[#d14330] gap-5'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                </svg>
                <span className='text-[#302E2E] text-[1.5rem]'>Enhance transparency and accountability across projects.</span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Benefits