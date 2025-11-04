"use client"
import React, { useEffect, useState } from "react";
import PriceDetail from "./PriceDetail";
import { useRouter } from "next/navigation";

// Display the total price of the flight and allow the user to continue to the next step
// This component shows the total price of the flight based on selected seats and allows the user to continue to the next step of filling out their information.
const PriceAndContinueFlight = ({ data }) => {
  // Extract the outbound and inbound seat information from the selected flight data
  // and calculate the total price for adults and children.
  const seatOutbound = data.selectedOutbound.flight.seats.find(
    (s) => data.selectedOutbound.seatClass === s.seatClass
  );
  const seatInbound = data.selectedInbound
    ? data.selectedInbound.flight.seats.find(
        (s) => data.selectedInbound.seatClass === s.seatClass
      )
    : null;
  const router = useRouter();
  const [totalPrice, setTotalPirce] = useState(0);
  const [totalPriceChildren, setTotalPriceChildren] = useState(0);
  const [totalPriceAdults, setTotalPriceAdults] = useState(0);
  const [isDetail, setIsDetail] = useState(false);
  useEffect(() => {
    const priceDeparture = seatOutbound.price;
    const priceArrival = seatInbound?.price || 0;
    setTotalPriceChildren(
      (priceArrival + priceDeparture) * data.children * 0.8
    );
    setTotalPriceAdults((priceArrival + priceDeparture) * data.adults);
  });
  useEffect(() => {
    setTotalPirce(totalPriceAdults + totalPriceChildren);
  }, [totalPriceAdults, totalPriceChildren]);

  // Effect to handle body overflow when the detail view is open
  // This effect sets the body's overflow to hidden when the detail view is open
  useEffect(() => {
    if (isDetail) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDetail]);

  const onCloseDetail = () => {
    setIsDetail(!isDetail);
  };
  const handleCountinue = () => {
    const priceData = {
      totalPrice,
      totalPriceAdults,
      totalPriceChildren,
    };

    sessionStorage.setItem("priceFlight", JSON.stringify(priceData));
    router.push("/search-flight/fill-form");
  };
  return (
    <>
      <div
        className="w-full flex flex-col justify-end text-end 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem]"
      >
        <p className="font-medium text-2xl text-primary">
          {`Total price: `}
          <span className="font-bold">{`${totalPrice} `}</span>
          {"USD"}
        </p>
        <p className="font-sans text-lg">
          {`Total price for all passengers (including taxes, fees and discounts)`}
          {` `}
          <span
            className="text-primary hover:text-yellow-200 cursor-pointer"
            onClick={() => {
              setIsDetail(!isDetail);
            }}
          >
            See price details
          </span>
        </p>
        <div className="mt-3">
          <button
            className="p-5 bg-primary text-white rounded-2xl text-lg font-sans cursor-pointer"
            onClick={() => handleCountinue()}
          >
            Continue
          </button>
        </div>
      </div>
      {isDetail && (
        <PriceDetail
          onClose={onCloseDetail}
          totalPriceChildren={totalPriceChildren}
          totalPriceAdults={totalPriceAdults}
        />
      )}
    </>
  );
};

export default PriceAndContinueFlight;
