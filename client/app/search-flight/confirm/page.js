"use client";
import ConfirmFlight from "@/app/_components/ConfirmFlight";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header";
import PriceAndContinueFlight from "@/app/_components/PriceAndContinueFlight";
import React from "react";
import { useEffect, useState } from "react";

const page = () => {
  const [data, setData] = useState(null);

  // Load data from sessionStorage when the component mounts
  useEffect(() => {
    const raw = sessionStorage.getItem("dataBookingFlightConfirm");
    if (raw) setData(JSON.parse(raw));
  }, []);

  if (!data) return <p>No search data</p>;
  return (
    <>
      <Header />
      <div
        className="w-full flex flex-col justify-center items-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem] pt-5"
      >
        <div className="rouned-2xl p-3 w-[20rem] bg-white text-primary text-bold text-2xl">
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
                {data.selectedInbound && data.selectedOutbound
                  ? "Round trip flight"
                  : "One way flight"}
                {passengerText}
              </span>
            );
          })()}
        </div>
      </div>
      {data.selectedOutbound && (
        <ConfirmFlight dataFlight={data.selectedOutbound} />
      )}
      {data.selectedInbound && (
        <ConfirmFlight dataFlight={data.selectedInbound} />
      )}
      <PriceAndContinueFlight data={data} />
      <Footer />
    </>
  );
};

export default page;
