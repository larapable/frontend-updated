import React from "react";
import { useState, ChangeEvent, MouseEvent, useEffect, useRef } from "react";
import "@/app/page.css";

const Features = () => {
  // FEATURE IMAGES FUNCTIONALITY
  const [hoveredImage, setHoveredImage] = useState("");
  const handleImageHover = (imageName: string) => {
    setHoveredImage(imageName);
  };

  const handleImageLeave = () => {
    setHoveredImage("");
  };
  return (
    <div id="feature-section">
      <div className="m-[10rem_3.4rem_7.8rem_13rem] flex flex-row w-[fit-content] box-sizing-border justify-center overflow-hidden">
        <div className="rounded-[1.3rem] border-[0.2rem_solid_#EFAF21] bg-[#FFFFFF] m-[2rem_3.4rem_0_0] w-[80rem] h-[55rem] hidden gap-12 lg:flex">
          <div className="flex justify-center items-center">
            <div
              className={
                "swot-feature-container" +
                (hoveredImage !== "swot" ? " hidden" : "")
              }
            >
              <img src="/swot-feature.png" alt="SWOT Image" />
            </div>
            <div className="stratmap-feature-container">
              {hoveredImage === "mapping" && (
                <img src="/stratmap-feature.png" alt="Mapping Image" />
              )}
            </div>
            <div className="scorecard-feature-container">
              {hoveredImage === "scorecard" && (
                <img src="/scorecard-feature.png" alt="Scorecard Image" />
              )}
            </div>
            <div className="visualization-feature-container">
              {hoveredImage === "analysis" && (
                <img src="/visualization-feature.png" alt="Analysis Image" />
              )}
            </div>
          </div>
        </div>

        <div className="m-[3.4rem_0_4.1rem_0] flex flex-col box-sizing-border justify-center align-middle">
          <div
            className="increases flex flex-col"
            onMouseEnter={() => handleImageHover("swot")}
            onMouseLeave={handleImageLeave}
          >
            <div className="m-[0_0.3rem_0.5rem_0.3rem] inline-block self-start break-words font-extrabold text-[2.5rem] text-[#FFFFFF]">
              <div id="feature-section" className="swot-analysis">
                SWOT Analysis
              </div>
            </div>
            <div className="m-[0_2.5rem_2.3rem_0.4rem] inline-block break-words font-regular text-[1.5rem] text-[#FFFFFF]">
              Conduct comprehensive SWOT analyses to evaluate internal strengths
              and <br /> weaknesses, as well as external opportunities and
              threats.
            </div>
          </div>

          <div>
            <div className="bg-[#FFFFFF] m-[0_0.3rem_0.8rem_0] w-[90%] h-[2%]"></div>
          </div>

          <div
            className="increases flex flex-col"
            onMouseEnter={() => handleImageHover("mapping")}
            onMouseLeave={handleImageLeave}
          >
            <div className="m-[0_0.3rem_0.8rem_0.3rem] inline-block self-start break-words font-extrabold text-[1.3rem] text-[#FFFFFF]">
              <div id="feature-section" className="strategic-mapping">
                Strategic Mapping
              </div>
            </div>
            <div className="m-[0_3.7rem_2.9rem_0.4rem] inline-block break-words font-regular text-[1.5rem] text-[#FFFFFF]">
              Create visual representations of organizational objectives,
              initiatives, and their interrelationships using strategic maps.
            </div>
          </div>
          <div>
            <div className="bg-[#FFFFFF] m-[0_0.3rem_0.8rem_0] w-[90%] h-[2%]"></div>
          </div>
          <div
            className="increases flex flex-col"
            onMouseEnter={() => handleImageHover("scorecard")}
            onMouseLeave={handleImageLeave}
          >
            <div className="m-[0_0.6rem_0.4rem_0.6rem] inline-block self-start break-words font-extrabold text-[1.3rem] text-[#FFFFFF]">
              <div id="feature-section" className="business-scorecard">
                Business Scorecard
              </div>
            </div>
            <div className="m-[0_0.9rem_1.9rem_0.4rem] inline-block break-words font-regular text-[1.5rem] text-[#FFFFFF]">
              Track and measure performance metrics across various perspectives,
              including financial, customer, internal processes, and learning and growth.
            </div>
          </div>

          <div>
            <div className="bg-[#FFFFFF] m-[0_0.3rem_0.8rem_0] w-[90%] h-[2%]"></div>
          </div>

          <div
            className="increases flex flex-col"
            onMouseEnter={() => handleImageHover("analysis")}
            onMouseLeave={handleImageLeave}
          >
            <div className="m-[0_0.4rem_0.8rem_0.4rem] inline-block self-start break-words font-extrabold text-[1.3rem] text-[#FFFFFF]">
              <div
                id="feature-section"
                className="data-analysis-and-visualization"
              >
                Data Analysis and Visualization
              </div>
            </div>
            <div className="m-[0_0.8rem_0_0.3rem] break-words font-regular text-[1.5rem] text-[#FFFFFF]">
              Analyze data using built-in analytical tools and visualize results
              through charts,
              <br /> graphs, and other visualizations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
