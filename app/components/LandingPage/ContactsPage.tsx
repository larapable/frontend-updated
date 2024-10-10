import React from 'react'

const ContactsPage = () => {
  return (
    <div className="flex-col items-center bg-[#8a252c] lg:w-full lg:ml-[10%] md:w-full hidden lg:flex">
      {/* number container */}
      <div className="flex flex-row items-center justify-start left-align ml-[-23rem] hover:scale-110 transition-transform">
      <img
        src="c-phone.png"
        className="w-20 h-20 mt-20 lg:mr-5 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
        alt="Contact Phone"
      />
        <div className="m-[5rem_0_1.1rem_0] inline-block break-words font-bold text-[2rem] text-[#FAD655]">
            Talk to team
        </div>
      </div>
    {/* number info container */}
        <div className="m-[0_1.9rem_2.8rem_5rem] flex flex-col items-center self-start w-[fit-content] box-sizing-border">
          <div className="m-[0_0.1rem_0.6rem_0] flex flex-row w-[fit-content] box-sizing-border">
            <span className="m-[0_0.9rem_0_0] break-words font-bold  text-[1.5rem] text-[#FFFFFF]">
              Phone number 1  :
            </span>
            <span className="break-words font-normal  text-[1.5rem] text-[#FFFFFF]">
              09123456789
            </span>
          </div>
          <div className="m-[0_0_0.5rem_0] flex flex-row w-[fit-content] box-sizing-border">
            <div className="m-[0_1.1rem_0.1rem_0] inline-block break-words  font-bold  text-[1.5rem] text-[#FFFFFF]">
              Phone number 2 :
            </div>
            <div className="m-[0.1rem_0_0_0] inline-block break-words font-normal  text-[1.5rem] text-[#FFFFFF]">
              09123456789
            </div>
          </div>
          <div className="m-[0_1rem_0_0] flex flex-row w-[fit-content] box-sizing-border">
            <div className="m-[0_0.9rem_0.1rem_-3rem] inline-block break-words font-bold  text-[1.5rem] text-[#FFFFFF]">
              Tel number     :
            </div>
            <div className="m-[0.1rem_0_0_0] inline-block break-words font-normal text-[1.5rem] text-[#FFFFFF]">
              +123 456 78
            </div>
          </div>
        </div>
      {/* media container */}
        <div className="flex flex-row items-center justify-start left-align ml-[-20rem] hover:scale-110 transition-transform">
        <img
            src="c-media.png"
            className="w-20 h-20 lg:mr-5 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
            alt="Contact Media"
        />
        <div className="m-[1.3rem_0_1.3rem_0] inline-block break-words font-bold text-[2rem] text-[#FAD655]">
            Browse the team
        </div>
        </div>
        {/* media info container */}
        <div className="m-[0_1.9rem_3.2rem_5rem] flex flex-col self-start w-[fit-content] box-sizing-border">
          <div className="m-[0_0_0.6rem_0] flex flex-row self-start w-[fit-content] box-sizing-border">
            <span className="m-[0_1rem_0_0] break-words font-bold  text-[1.5rem] text-[#FFFFFF]">
              Facebook               :
            </span>
            <span className="break-words font-normal  text-[1.5rem] text-[#FFFFFF]">
              atlas@official
            </span>
          </div>
          <div className="m-[0_0_0.5rem_0] flex flex-row self-start w-[fit-content] box-sizing-border">
            <div className="m-[0_1.1rem_0.1rem_0] inline-block break-words font-bold  text-[1.5rem] text-[#FFFFFF]">
              Instagram              :
            </div>
            <div className="m-[0.1rem_0_0_0] inline-block break-words font-normal  text-[1.5rem] text-[#FFFFFF]">
              atlas@official
            </div>
          </div>
          <div className="flex flex-row w-[fit-content] box-sizing-border">
            <div className="m-[0_1rem_0.1rem_0] inline-block break-words font-bold  text-[1.5rem] text-[#FFFFFF]">
              Gmail                       :
            </div>
            <div className="m-[0.1rem_0_0_0] inline-block break-words font-normal  text-[1.5rem] text-[#FFFFFF]">
              atlas.official@gmail.com
            </div>
          </div>
        </div>
        {/* location container */}
        <div className="flex flex-row items-center justify-start left-align ml-[-23rem] hover:scale-110 transition-transform">
        <img
            src="c-location.png"
            className="w-20 h-20 lg:mr-5 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
            alt="Contact Location"
        />
        <div className="m-[1.3rem_0_1.3rem_0] inline-block break-words font-bold text-[2rem] text-[#FAD655]">
            Visit the team
        </div>
        </div>
        {/* location info container */}
        <div className="m-[0_1.9rem_3.2rem_-4rem] flex flex-col w-[fit-content] box-sizing-border">
          <div className="m-[0_0_0.8rem_0] flex flex-row w-[fit-content] box-sizing-border">
            <span className="m-[0_1rem_0_0] break-words font-bold  text-[1.5rem] text-[#FFFFFF]">
              Address                  :   
            </span>
            <span className="break-words font-normal  text-[1.5rem] text-[#FFFFFF]">
              Insular Square Tabok, Mandaue City
            </span>
          </div>
          <div className="m-[0_0_0.6rem_0] flex flex-row self-start w-[fit-content] box-sizing-border">
            <div className="m-[0_1.2rem_0.1rem_0] inline-block break-words font-bold  text-[1.5rem] text-[#FFFFFF]">
              Building                  :
            </div>
            <div className="m-[0.1rem_0_0_0] inline-block break-words font-normal  text-[1.5rem] text-[#FFFFFF]">
              2nd Floor
            </div>
          </div>
          <div className="flex flex-row self-start w-[fit-content] box-sizing-border">
            <div className="m-[0_1.1rem_0.1rem_0] inline-block break-words font-bold  text-[1.5rem] text-[#FFFFFF]">
              Business Hours  :
            </div>
            <div className="m-[0.1rem_0_0_0] inline-block break-words font-normal  text-[1.5rem] text-[#FFFFFF]">
              Mon - Sat 9:00 AM - 5:00 PM
            </div>
          </div>
        </div>
    </div>
  )
}

export default ContactsPage