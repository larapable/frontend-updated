import React from 'react'
import Link from 'next/link'

const GetStarted = () => {
  return (
    <div>
      <div className="m-[10rem_5.1rem_8.1rem_8.1rem] flex flex-row w-[fit-content] box-sizing-border">
        <div className="m-[5rem_3.6rem_2.8rem_0] flex flex-col box-sizing-border">
          <div className="m-[0_0_1.1rem_0] inline-block break-words font-extrabold text-[6rem] text-[#FFFFFF]">
            Igniting Growth in<br/>
            every endeavor.
          </div>
          <Link href="/signup">
          <div className="rounded-[2rem] bg-[#EFAF21] relative flex flex-row justify-center self-start p-[1.1rem_0_1.1rem_0.7rem] w-[20rem] h-[5rem] box-sizing-border transform transition-transform hover:scale-110 transition duration-300 ease-in-out">
            <div className="flex flex-row justify-center box-sizing-border">
              <span className="break-words font-semibold text-[1.5rem] text-[#962203]">
                Get Started -&gt;
              </span>
            </div>
          </div>
          </Link>
        </div>
        <div className="bg-[url('/ignite-growth.png')] bg-[50%_50%] bg-cover bg-no-repeat w-[30.4rem] h-[35.4rem] m-[-3rem_0_0_15rem] hidden gap-12 lg:flex transform transition-transform hover:scale-110 transition duration-300 ease-in-out">
        </div>
      </div> 
    
    </div>
  )
}

export default GetStarted