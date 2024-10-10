export default function RedContainer() {
  return (
    <div className="flex flex-col items-center bg-[#8a252c] lg:w-full lg:ml-[12%] md:w-full">
      <img
        src="wc-screen-scorecard.png"
        className="w-28 h-28 mt-24 lg:mr-96 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
        alt="Scorecard"
      />
      <p className="text-white ml-40 mr-20 mb-16 font-bold text-2xl">
        <span className="text-[#fad655]">Track key metrics</span>
        <span>
          , analyze trends, and make informed decisions to drive success.
        </span>
      </p>
      <img
        src="wc-screen-swot.png"
        className="w-28 h-28 mt-4 lg:mr-96 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
        alt="SWOT"
      />
      <p className="text-white ml-40 mr-20 mb-16 font-bold text-2xl">
        <span className="text-[#fad655]">
          Identify strength, weaknesses, opportunities, and threats{" "}
        </span>
        <span>to your business.</span>
      </p>
      <img
        src="wc-screen-stratmap.png"
        className="w-28 h-28 mt-4 lg:mr-96 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
        alt="Strategy"
      />
      <p className="text-white ml-40 mr-20 mb-4 md:mb-16 font-bold text-2xl">
        <span className="text-[#fad655]">Define objectives</span>
        <span>, outline initiatives, and map out your path to success.</span>
      </p>
    </div>
  );
}
