import { BadgeCheck, CalendarDays, ShieldCheck } from "lucide-react";
import React from "react";

// Apart of body section of the home page, this component displays featured travel options
const TralveFeatured = () => {
  return (
    <div
      className="w-full flex flex-col items-start
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-[2rem] gap-[4rem] pb-[3rem] z-0 bg-gray-200"
    >
      <div className="flex max-w-[70%]">
        <p className="text-3xl wrap font-bold max-w-full wrap">
          Travel to make memories all around the world
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col gap-10 justify-center items-center rounded-4xl bg-white p-10 cursor-pointer transform transition-all duration-300 hover:scale-[1.1]">
          <CalendarDays className="w-[10rem] h-[10rem] min-w-[10rem] min-h-[10rem] bg-blue-400 text-white rounded-full p-5" />
          <p className="font-semibold text-2xl">Book & relax</p>
          <p className="text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita
            nam deleniti est incidunt eligendi.
          </p>
        </div>
        <div className="flex flex-col gap-10 justify-center items-center rounded-4xl bg-white p-10 cursor-pointer transform transition-all duration-300 hover:scale-[1.1]">
          <BadgeCheck className="w-[10rem] h-[10rem] min-w-[10rem] min-h-[10rem] bg-orange-400 text-white rounded-full p-5" />
          <p className="font-semibold text-2xl">Smart checklist</p>
          <p className="text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita
            nam deleniti est incidunt eligendi.
          </p>
        </div>
        <div className="flex flex-col gap-10 justify-center items-center rounded-4xl bg-white p-10 cursor-pointer transform transition-all duration-300 hover:scale-[1.1]">
          <ShieldCheck className="w-[10rem] h-[10rem] min-w-[10rem] min-h-[10rem] bg-yellow-400 text-white rounded-full p-5" />
          <p className="font-semibold text-2xl">Save more</p>
          <p className="text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita
            nam deleniti est incidunt eligendi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TralveFeatured;
