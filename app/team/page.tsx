import TeamsPage from '../components/TeamsPage'
import React from 'react'
import Link from 'next/link'
import { Button } from "@mui/material";

const page = () => {
  return (
    <div className='text-[rgb(59,59,59)] items-center justify-center text-center'>
      <div className='flex flex-col'>
        <div className="font-bold lg:text-[3.5rem] mt-10">Meet our team</div>
        <div className='font-medium text-[1.3rem] mt-5'>Our team comprises highly skilled professionals with expertise in their respective fields, <br/>ensuring top-notch quality and results for our clients.</div>

        <div className='flex flex-row items-center justify-center text-center gap-5 mt-10'>
          <button 
            className="rounded-[0.6rem] text-[#AB3510] border border-[#AB3510] hover:text-white hover:bg-[#AB3510] font-medium text-lg py-3 px-3 w-[10rem] h-[fit-content] mb-10 items-center"
          >
              <Link href="/">Home</Link>
          </button>
          <button 
            className="rounded-[0.6rem] text-[#ffffff] font-medium text-lg py-3 px-3 w-[10rem] h-[fit-content] mb-10 items-center"
            style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}>
              <Link href="/contact">Contact</Link>
          </button>
        </div>

        <div style={{
          backgroundImage: 'url("landingbg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '46vh',  // Adjust height as needed
        }}>

          <div className='flex flex-row items-center justify-center gap-10'>
            <div className='flex flex-col'>
              <img className="w-[18rem] h-[20rem] mt-5" 
                src="profile-ebeb.png"
                alt=""
              />
              <div className='bg-white h-[5rem] w-[19rem] rounded-lg mt-[-2rem] ml-[-0.5rem] items-center justify-center'>
                <div className='flex flex-col'>
                  <div className='text-[1.3rem] font-bold mt-3'>Genevieve Miao</div>
                  <div className='text-[1rem]'>Developer / Designer</div>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <img className="w-[18rem] h-[20rem] mt-5" 
                src="profile-lara.png"
                alt=""
              />
              <div className='bg-white h-[5rem] w-[19rem] rounded-lg mt-[-2rem] ml-[-0.5rem] items-center justify-center'>
                <div className='flex flex-col'>
                  <div className='text-[1.3rem] font-bold mt-3'>Lara Pable</div>
                  <div className='text-[1rem]'>Developer / Designer</div>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <img className="w-[18rem] h-[20rem] mt-5" 
                src="profile-arziel.png"
                alt=""
              />
              <div className='bg-white h-[5rem] w-[19rem] rounded-lg mt-[-2rem] ml-[-0.5rem] items-center justify-center'>
                <div className='flex flex-col'>
                  <div className='text-[1.3rem] font-bold mt-3'>Arziel Mae Lawas</div>
                  <div className='text-[1rem]'>Developer / Designer</div>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <img className="w-[18rem] h-[20rem] mt-5" 
                src="profile-arvin.png"
                alt=""
              />
              <div className='bg-white h-[5rem] w-[19rem] rounded-lg mt-[-2rem] ml-[-0.5rem] items-center justify-center'>
                <div className='flex flex-col'>
                  <div className='text-[1.3rem] font-bold mt-3'>Arvin Santillan</div>
                  <div className='text-[1rem]'>Developer / Designer</div>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <img className="w-[18rem] h-[20rem] mt-5" 
                src="profile-lyndon.png"
                alt=""
              />
              <div className='bg-white h-[5rem] w-[19rem] rounded-lg mt-[-2rem] ml-[-0.5rem] items-center justify-center'>
                <div className='flex flex-col'>
                  <div className='text-[1.3rem] font-bold mt-3'>Lyndon Trocio</div>
                  <div className='text-[1rem]'>Developer / Designer</div>
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