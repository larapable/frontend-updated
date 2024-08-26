import { useRef, useEffect } from 'react';
import '@/app/page.css'

const Pricing = () => {


  return (
    <div className='bg-[#fafac2] h-screen w-[100%] mt-[12rem] justify-center text-center text-[#302E2E]'
          id="pricing-section">
      <div className='flex flex-col'>
        <span className='text-[#302E2E] font-semibold text-4xl mt-[5rem]'>Choose Your Plan</span>
        <span className='mt-8 text-[1.5rem]'>Choose the right plan for your needs. Unlock powerful features and <br/>
        enhance your strategic planning today.
        </span>
      </div>
      <div className='flex flex-row mt-14 justify-center gap-10'>
        {/* FREE */}
        <div className='bg-white border border-gray-100 h-[35rem] w-[25rem] rounded-xl transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
          <div className='flex flex-row'>
            <div className="h-[6rem] w-[6rem] mt-5 ml-8 bg-yellow-100 rounded-full flex items-center justify-center ">
              <img src="/coins.png" alt="" className="h-[5rem] w-[5rem] rounded-full" />
            </div>
            <div className='flex flex-col justify-start text-start ml-5'>
              <span className='mt-8 text-lg font-medium'>Free</span>
              <div className='flex flex-row'>
                <span className='text-4xl font-extrabold mt-1'>$0.00</span>
                <span className='mt-4 ml-1 text-gray-400'>/month</span>
              </div>
            </div>
          </div>
          <div className='mx-8 my-8 border-t border-gray-100'></div>
          <div className='flex flex-col'>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
          </div>
          <div className='bg-gray-100 h-[3rem] w-[20rem] ml-9 mt-10 rounded-3xl border border-gray-200 pt-2 hover:bg-[#AB3510] hover:text-white'>
            <span className='text-xl font-semibold'>Get Started</span>
          </div>
        </div>

        {/* BASIC */}
        <div className='bg-white border border-gray-100 h-[35rem] w-[25rem] rounded-xl transform transition-transform hover:scale-110 transition duration-300 ease-in-out'>
          <div className='flex flex-row'>
            <div className="h-[6rem] w-[6rem] mt-5 ml-8 bg-yellow-100 rounded-full flex items-center justify-center ">
              <img src="/coins.png" alt="" className="h-[5rem] w-[5rem] rounded-full" />
            </div>
            <div className='flex flex-col justify-start text-start ml-5'>
              <span className='mt-8 text-lg font-medium'>Basic</span>
              <div className='flex flex-row'>
                <span className='text-4xl font-extrabold mt-1'>$10.00</span>
                <span className='mt-4 ml-1 text-gray-400'>/month</span>
              </div>
            </div>
          </div>
          <div className='mx-8 my-8 border-t border-gray-100'></div>
          <div className='flex flex-col'>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
            <div className='flex flex-row items-start text-start ml-10 mt-5 text-[#d14330]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
              </svg>
              <span className='ml-5 text-lg mt-1 text-[#302E2E]'>lorem</span>
            </div>
          </div>
          <div className='bg-gray-100 h-[3rem] w-[20rem] ml-9 mt-10 rounded-3xl border border-gray-200 pt-2 hover:bg-[#AB3510] hover:text-white'>
            <span className='text-xl font-semibold'>Get Started</span>
          </div>
        </div>


      </div>

    </div>
  )
}

export default Pricing