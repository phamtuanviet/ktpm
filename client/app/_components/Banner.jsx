import React from 'react'

// Display a banner with a video background and an overlay image
const Banner = () => {
  return (
    <div
    className="w-full flex flex-col items-center justify-center text-center 
px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-[2rem] gap-[4rem] pb-[3rem] z-0"
  >
    <div>
      <h1 className="font-[400] text-5xl leading-[4rem]">
        Happiness on the bay every trip
      </h1>
    </div>
    <div className="mt-1 mb-0 flex justify-center items-center relative w-full md:w-[80%] ">
      <div className="flex justify-center">
        <video
          className="w-[80%] rounded-[200rem]"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/back.mp4" type="video/mp4" />
        </video>
      </div>
      <img
        className="absolute w-[100%] pointer-events-none"
        src={"/images/flight.png"}
      />
    </div>
  </div>
  )
}

export default Banner