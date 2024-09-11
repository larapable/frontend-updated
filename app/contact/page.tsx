import TeamsPage from '../components/TeamsPage'
import React from 'react'
import Link from 'next/link'
import { Button } from "@mui/material";

const page = () => {
  return (
    <div className='text-[rgb(59,59,59)] items-center justify-center text-center'>
      <div className='flex flex-col'>
        <div className="font-bold lg:text-[3.5rem] mt-10">Contact our team</div>
        <div className='font-medium text-[1.3rem] mt-5'>We value collaboration and work closely with our clients every step of the way, <br/>ensuring their vision and goals are met with precision and excellence.</div>

        <div className='flex flex-row items-center justify-center text-center gap-5 mt-10'>
          <button 
            className="rounded-[0.6rem] text-[#AB3510] border border-[#AB3510] hover:text-white hover:bg-[#AB3510] font-medium text-lg py-3 px-3 w-[10rem] h-[fit-content] mb-10 items-center"
          >
              <Link href="/">Home</Link>
          </button>
          <button 
            className="rounded-[0.6rem] text-[#ffffff] font-medium text-lg py-3 px-3 w-[10rem] h-[fit-content] mb-10 items-center"
            style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}>
              <Link href="/team">Team</Link>
          </button>
        </div>

        <div style={{
          backgroundImage: 'url("landingbg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '46vh',  // Adjust height as needed
        }}>
          
          <div className='flex flex-row gap-10 items-center justify-center mt-10'>
            <div className='bg-white h-[21rem] w-[35rem] rounded-md'>
              <div className='flex flex-col'>
                <div className='text-[1.5rem] font-bold mt-10'>Talk to the Team</div>
                <div className='flex flex-row mt-5'>
                  <div className='flex flex-col mt-5 ml-16 items-start'>
                    <div className='text-[1.3rem] font-medium'>Genevieve:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Lara:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Arziel:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Arvin:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Lyndon:</div>
                  </div>
                  <div className='flex flex-col mt-5 ml-[11rem] items-end'>
                  <div className='text-[1.3rem] font-medium'>+63123456789</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>+63123456789</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>+63123456789</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>+63123456789</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>+63123456789</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white h-[21rem] w-[35rem] rounded-md'>
              <div className='flex flex-col'>
                <div className='text-[1.5rem] font-bold mt-10'>Browse the Team</div>
                <div className='flex flex-row mt-5'>
                  <div className='flex flex-col mt-5 ml-16 items-start'>
                    <div className='text-[1.3rem] font-medium'>Facebook:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Instagram:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Twitter:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>MS Teams:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Gmail:</div>
                  </div>
                  <div className='flex flex-col mt-5 ml-[12rem] items-end'>
                  <div className='text-[1.3rem] font-medium'>atlas.official</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>atlas.official</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>atlas.official</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>atlas.official</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>atlas.official</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white h-[21rem] w-[35rem] rounded-md'>
              <div className='flex flex-col'>
                <div className='text-[1.5rem] font-bold mt-10'>Visit the Team</div>
                <div className='flex flex-row mt-5'>
                  <div className='flex flex-col mt-5 ml-16 items-start'>
                    <div className='text-[1.3rem] font-medium'>Address:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Building:</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>Business Hours:</div>
                  </div>
                  <div className='flex flex-col mt-5 ml-[8rem] items-end'>
                  <div className='text-[1.3rem] font-medium'>Tabok Mandaue</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>North Wing 2nd</div>
                    <div className='text-[1.3rem] mt-1 font-medium'>9:00am - 6:00pm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          

        </div>

        <div className='font-medium italic text-[1rem] mt-12'>'Your goals, our journey. Together, we achieve.'</div>
        <div className="inline-block break-words font-normal text-[1rem] text-[#504B4B]">
          Copyright. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default page