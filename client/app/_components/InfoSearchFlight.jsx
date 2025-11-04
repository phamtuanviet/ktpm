import { LocateFixed, MapPinCheck, ShieldCheck, Tag, Zap } from "lucide-react";
import React from "react";

const InfoSearchFlight = ({ data, type }) => {
  return (
    <div
      className="w-full flex flex-row items-center justify-center md:justify-between  text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-[1rem] bg-gradient-to-r from-[#1B75C6] to-[#5EB4F5]"
    >
      <div className="flex flex-col gap-1">
        <div className="text-white text-[1.2rem] font-semibold">
          {(() => {
            const parts = [];
            if (data.adults > 0)
              parts.push(
                `${data.adults} ${data.adults === 1 ? "adult" : "adults"}`
              );
            if (data.children > 0)
              parts.push(
                `${data.children} ${data.children === 1 ? "child" : "children"}`
              );
            if (data.infants > 0)
              parts.push(
                `${data.infants} ${
                  data.infants === 1 ? "infant" : "infants"
                }`
              );
            const passengerText = parts.length ? ` | ${parts.join(", ")}` : "";

            return (
              <span>
                {data.tripType === "oneway"
                  ? "One way flight"
                  : "Round trip flight"}
                {passengerText}
                {type === "outbound" ? " (Arrival)" : " (Return)"}
              </span>
            );
          })()}
        </div>
        <div className="bg-[#F8F8FF] flex flex-col rounded-[1rem] font-medium px-3">
          <div className="flex flex-row items-center text-primary">
            <div className=" p-2 text-primary">
              <LocateFixed size={20} />
            </div>
            <span>{`Departure Airport: ${
              type === "outbound" ? data.departureAirport : data.arrivalAirport
            }`}</span>
          </div>
          <div className="flex flex-row items-center text-primary">
            <div className="p-2 text-primary">
              <MapPinCheck size={20} />
            </div>
            <span>{`Arrival Airport: ${
              type === "outbound" ? data.arrivalAirport : data.departureAirport
            }`}</span>
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex-row gap-2 font-medium">
        <div className="flex flex-col items-center">
          <div className="rounded-full p-2 bg-[#F8F8FF] text-primary">
            <Tag size={20} />
          </div>
          <span className="mt-2 text-[#F8F8FF]">Affordable</span>
        </div>
        <div className="flex flex-col items-center ">
          <div className="rounded-full p-2 bg-[#F8F8FF] text-primary">
            <Zap size={20} />
          </div>
          <span className="mt-2 text-[#F8F8FF]">Convenient</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full p-2 bg-[#F8F8FF] text-primary">
            <ShieldCheck size={20} />
          </div>
          <span className="mt-2 text-[#F8F8FF]">Secure</span>
        </div>
      </div>
    </div>
  );
};

export default InfoSearchFlight;
