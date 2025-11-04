import React from "react";
import { confidentTravels } from "@/data/hardData";

// Part of body component that displays travel support information
const ConfidentTralvel = () => {
  // Memoized component to avoid unnecessary re-renders
  const Special = React.memo(({ num, top, content, color }) => (
    <div className="flex flex-col gap-3 items-start">
      <p className={`${color} text-white font-medium px-7 rounded-2xl py-1`}>
        {num}
      </p>
      <p className="text-2xl font-medium">{top}</p>
      <p>{content}</p>
    </div>
  ));
  return (
    <div
      className="w-full flex flex-col items-center justify-center text-center 
px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-[2rem] gap-[4rem] pb-[3rem] z-0"
    >
      <div className="flex flex-col items-center text-center">
        <p className="font-medium text-2xl tracking-wide">TRAVEL SUPPORT</p>
        <h1 className="font-[400] text-5xl leading-[4rem]">
          Plan Your tralve with confidence
        </h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos ratione
          ducimus eveniet beatae.
        </p>
      </div>
      <div className="flex flex-row w-full">
        <div className="flex flex-col gap-10 flex-1">
          {confidentTravels.map((confidentTravel) => (
            <Special
              key={confidentTravel.id}
              num={confidentTravel.id}
              top={confidentTravel.top}
              content={confidentTravel.content}
              color={confidentTravel.color}
            />
          ))}
        </div>
        <div className="relative flex-1 min-h-full">
          <div className="w-[10rem] h-[16rem] rounded-4xl absolute z-[3] bottom-[5%] left-[20%]">
            <img
              src={"/images/con1.jpg"}
              className="w-full h-full object-cover rounded-4xl"
            />
          </div>
          <div className="w-[12rem] h-[19.2rem] rounded-4xl absolute z-[2] bottom-[13%] left-[35%]">
            <img
              src={"/images/con2.jpg"}
              className="w-full h-full object-cover rounded-4xl"
            />
          </div>
          <div className="w-[8rem] h-[12.8rem] rounded-4xl absolute z-[1] bottom-[7%] left-[60%]">
            <img
              src={"/images/con3.jpg"}
              className="w-full h-full object-cover rounded-4xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidentTralvel;
