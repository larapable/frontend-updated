'use client';
import Link from 'next/link'
import React from 'react'
import '@/app/page.css'

const NavigateBusiness = () => {
  return (
    <div style={{
      backgroundImage: 'url("landingbg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%',
      height: '83vh',  // Adjust height as needed
      marginTop: '-10rem'
    }}>
      <div className='flex flex-row'>
        <div className='ml-[25rem]'>
          <div className='mt-[10rem]'>
            <span className='text-6xl text-white font-extrabold'>NAVIGATE YOUR</span> <br/>
            <span className='text-7xl text-[#fad655] font-extrabold'>BUSINESS SUCCESS</span>
          </div>

          <div className="inline-block mt-10 self-start break-words font-regular text-[1.5rem] text-[#ffffff]">
            Welcome to Atlas, your all-in-one solution for tracking, analyzing, <br /> and optimizing your business performance.
          </div>
        </div>
        <div className="bg-[url('/welcome-image.png')] right-1 md:right-10 xl:top-5 xl:right-16 h-[35rem] w-[35rem] mt-[-1rem] bg-pattern-2 bg-cover hidden lg:flex  transform transition-transform hover:scale-110 duration-300 ease-in-out">
        </div>
      </div>
      <div className='flex flex-row gap-5 ml-[25rem] mt-[-7rem]'>
        <Link href="/login">
          <div className="rounded-[2rem] bg-[#fad655] justify-center p-[1.1rem_0.7rem_1.1rem_0] w-[13rem] h-[4rem] box-sizing-border transform transition-transform hover:scale-110 duration-300 ease-in-out">
            <div className="flex flex-row justify-center box-sizing-border">
              <span className="relative break-words font-semibold text-[1.3rem] text-[#962203]">
                Login
              </span>
            </div>
          </div>
        </Link>
        <Link href="/signup">
          <div className="rounded-[2rem] bg-[#FFFFFF] justify-center p-[1.1rem_0.3rem_1.1rem_0] w-[13rem] h-[4rem] box-sizing-border transform transition-transform hover:scale-110 duration-300 ease-in-out">
            <div className="flex flex-row justify-center box-sizing-border">
              <span className="relative break-words font-semibold text-[1.3rem] text-[#962203]">
                Sign up
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default NavigateBusiness
