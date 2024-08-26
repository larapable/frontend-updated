import React from 'react'
import Link from "next/link"

const BottomPage = () => {

  // WHEN ABOUT US IS CLICKED
  const handleAboutUsClick = () => {
    const element = document.getElementById("strategic-management-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  // WHEN FEATURE IS CLICKED
  const handleFeatureClick = () => {
    const element = document.getElementById("feature-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // WHEN PRICING IS CLICKED
  const handlePricingClick = () => {
    const element = document.getElementById("pricing-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
        <div className="bg-[#FFFFFF] relative flex flex-col items-center p-[1.2rem_1.2rem_1.1rem_1.6rem] box-sizing-border">
        <div className="m-[0_1.4rem_0.8rem_0] flex flex-row justify-between w-[90%] box-sizing-border">
          <div className="flex flex-row box-sizing-border">
            <div className="rounded-[0.6rem] relative m-[0_1.1rem_0_0] p-[0_1.7rem_0_1.7rem] w-[17.9rem] h-[10.4rem] box-sizing-border"
              style={{ background: "linear-gradient(to left, #882723, #AB3510)"}}>
              <div className="bg-[url('/logo.png')] bg-[50%_50%] bg-cover bg-no-repeat w-[14.1rem] h-[10.4rem]">
              </div>
            </div>
            <p className="m-[3.7rem_0_2.3rem_0] break-words font-extrabold text-[1.9rem] text-[#000000]">
              <span className="navigate-your-business-success-1-sub-5">
                NAVIGATE YOUR <br/><span className="business-success-text-2">BUSINESS SUCCESS</span>
              </span><span></span>
            </p>
          </div>
          <div className="m-[0.6rem_-2rem_1.1rem_0] flex flex-row box-sizing-border hidden gap-12 lg:flex">
            <div className="m-[0_3.3rem_1.7rem_0] flex flex-col items-center box-sizing-border">
              <div className="m-[0_0.5rem_1.1rem_0.4rem] inline-block break-words font-semibold text-[1.3rem] text-[#686666]">
                Atlas
              </div>
              <div className="m-[0_0_0.6rem_0.1rem] inline-block break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer" onClick={handleAboutUsClick}>
                About us
              </div>
              <div className="m-[0_0.2rem_0.6rem_0] inline-block break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer" onClick={handleFeatureClick}>
                Features
              </div>
              <span className="m-[0_0.5rem_0_0.5rem] break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer" onClick={handlePricingClick}>
                Pricing
              </span>
            </div>
            <div className="m-[0_1.7rem_1.7rem_0] flex flex-col items-center box-sizing-border">
              <div className="m-[0_0_1.1rem_0] inline-block break-words font-semibold text-[1.3rem] text-[#686666]">
                Organization
              </div>
              <div className="m-[0_0.9rem_0.6rem_0] inline-block break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer">
                <Link href="/team">Team</Link>
              </div>
              <div className="m-[0_0.6rem_0.6rem_0] inline-block break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer">
                Services
              </div>
              <span className="m-[0_0.5rem_0_0] break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer">
                Projects
              </span>
            </div>
            <div className="flex flex-col box-sizing-border">
              <div className="m-[0_0_1.1rem_0] inline-block break-words font-semibold text-[1.3rem] text-[#686666]">
                Quick Links
              </div>
              <div className="m-[0_1rem_0.6rem_1rem] inline-block self-start break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer">
                Facebook
              </div>
              <div className="m-[0_1rem_0.6rem_1rem] inline-block self-start break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer">
                Instagram
              </div>
              <div className="m-[0_0.9rem_0.6rem_0] inline-block self-center break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer">
                Gmail
              </div>
              <span className="m-[0_0.7rem_0_0] self-center break-words font-light text-[0.9rem] text-[#686666] hover:underline cursor-pointer">
                Twitter
              </span>
            </div>
          </div>
        </div>
        <div className="m-[0_0_0_0.4rem] flex flex-row justify-between w-[90%] box-sizing-border hidden gap-12 lg:flex">
          <div className="flex flex-col box-sizing-border">
            <div className="m-[0_0.1rem_0.1rem_0.1rem] inline-block self-start break-words font-semibold text-[0.9rem] text-[#504B4B]">
              Stay Connected
            </div>
            <Link href="/contact">
            <div className="flex flex-row w-[14.9rem] box-sizing-border">
              <div className="m-[0.1rem_0.5rem_0_0] flex flex-row justify-center w-[2.6rem] h-[2.5rem] box-sizing-border">
                <img className="w-[2.6rem] h-[2.5rem]" 
                src="fb.png"
                alt="fb"
                />
              </div>
              <div className="m-[0.1rem_0.6rem_0.1rem_0] flex flex-row justify-center w-[2.6rem] h-[2.5rem] box-sizing-border">
                <img className="w-[2.6rem] h-[2.5rem]" 
                src="gmail.png"
                alt="gmail"
                />
              </div>
              <img className="m-[0_0.7rem_0.1rem_0] w-[2.6rem] h-[2.5rem]" 
              src="insta.png"
              alt="insta"
              />
              <div className="m-[0.1rem_0.4rem_0.1rem_0] flex flex-row justify-center w-[2.6rem] h-[2.5rem] box-sizing-border">
                <img className="w-[2.6rem] h-[2.5rem]" 
                src="twitter.png"
                alt="twitter"
                />
              </div>
              <div className="m-[0.1rem_0_0_0] flex flex-row justify-center w-[2.6rem] h-[2.5rem] box-sizing-border">
                <img className="w-[2.6rem] h-[2.5rem]" 
                src="phone.png"
                alt="phone"
                />
              </div>
            </div>
            </Link>
          </div>
          <div className="m-[1.8rem_0_1rem_0] inline-block break-words font-normal text-[0.9rem] text-[#504B4B]">
            Copyright. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomPage