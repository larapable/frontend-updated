import Image from "next/image"
import Link from "next/link"
import { useRef } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {

  // WHEN HOME IS CLICKED
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
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
  
  return (
    <div style={{ background:"linear-gradient(to left, #882723, #AB3510)", height:"20rem" }} > 
      <div className="rounded-[1.3rem] bg-[rgba(180,54,54,0.31)] relative m-[0_2.1rem_5rem_2.4rem] flex flex-row justify-between p-[1.3rem_2.5rem_1rem_1rem] w-[97%] h-[7rem] box-sizing-border ">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={100} height={80}/>
        </Link>
        <div className="flex flex-row justify-between w-[90] box-sizing-border mr-[-2rem]">
          <ul className="hidden h-full gap-12 lg:flex">
            <span className="regular-24 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold hover:text-[#FAD655] mt-4" onClick={handleHomeClick}>
              Home
            </span>
            <span className="regular-24 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold hover:text-[#FAD655] mt-4" onClick={handleAboutUsClick}>
              About Us
            </span>
            <span className="regular-24 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold hover:text-[#FAD655] mt-4" onClick={handleFeatureClick}>
              Features
            </span>
            <div>
              <div className="regular-24 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold hover:text-[#FAD655] mt-4">
                <Link href="/team">Team</Link>
              </div>
            </div>
            <div>
              <div className="regular-24 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold hover:text-[#FAD655] mt-4">
                <Link href="/contact">Contact</Link>
              </div>
            </div>

          </ul>
        </div>
      </div>


    </div>
  )
}

export default Navbar