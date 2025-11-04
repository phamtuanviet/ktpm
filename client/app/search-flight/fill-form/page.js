"use client";
import Footer from "@/app/_components/Footer";
import FormPassenger from "@/app/_components/FormPassenger";
import Header from "@/app/_components/Header";
import ticketService from "@/lib/api/ticket";
import { Divide, LocateFixed, MapPinCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

const page = () => {
  const [data, setData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [checkLogin, isCheckLogin] = useState(() => {
    if (user && isAuthenticated) return true;
    return false;
  });

  const [passengers, setPassengers] = useState({
    adults: [],
    children: [],
    infants: [],
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const rawData = sessionStorage.getItem("dataBookingFlightConfirm");
    const rawPrice = sessionStorage.getItem("priceFlight");
    const tempData = JSON.parse(rawData);
    const priceData = JSON.parse(rawPrice);
    setData(tempData);
    setPriceData(priceData);
    setPassengers({
      adults: Array.from({ length: tempData.adults }, () => ({
        fullName: "",
        dob: "",
        passport: "",
      })),
      children: Array.from({ length: tempData.children }, () => ({
        fullName: "",
        dob: "",
      })),
      infants: Array.from({ length: tempData.infants }, () => ({
        fullName: "",
        dob: "",
      })),
    });
  }, []);

  const handleDataChange = useCallback((group, index, newData) => {
    setPassengers((prev) => {
      const updated = { ...prev };
      updated[group] = [...prev[group]];
      updated[group][index] = newData;
      return updated;
    });
  }, []);
  if (!data || !priceData) return <p>No data</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    const dataPassengers = {
      outboundFlightId: data.selectedOutbound.flight.id,
      outboundSeatClass: data.selectedOutbound.seatClass,
      inboundFlightId: data?.selectedInbound?.flight?.id || null,
      inboundSeatClass: data?.selectedInbound?.seatClass || null,
      passengers,
      email,
    };
    const bodyRequest = {
      ...dataPassengers,
      step: "sendOtp",
    };
    sessionStorage.setItem("dataPassengers", JSON.stringify(dataPassengers));
    await ticketService.createTicketClient(bodyRequest);
    router.push("/search-flight/otp");
  };

  return (
    <>
      <Header />
      <div
        className="w-full flex flex-col justify-center items-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem] pt-5"
      >
        <div className="rouned-2xl p-3 w-full bg-white text-primary text-bold text-2xl flex flex-col gap-3 justify-center items-center text-center ">
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
                `${data.infants} ${data.infants === 1 ? "infant" : "infants"}`
              );
            const passengerText = parts.length ? ` | ${parts.join(", ")}` : "";

            return (
              <p>
                {data.selectedInbound && data.selectedOutbound
                  ? "Round trip flight"
                  : "One way flight"}
                {passengerText}
              </p>
            );
          })()}
          <div className="flex flex-row gap-5 items-center">
            <div>
              <LocateFixed />
            </div>
            <p>{`${data.selectedOutbound.flight.departureAirport.name}`}</p>
          </div>
          <div className="flex flex-row gap-5 items-center">
            <div>
              <MapPinCheck />
            </div>
            <p>{`${data.selectedOutbound.flight.arrivalAirport.name}`}</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {passengers.adults.map((_, i) => (
          <FormPassenger
            key={i}
            type="adult"
            onDataChange={(data) => handleDataChange("adults", i, data)}
          />
        ))}
        {passengers.children.map((_, i) => (
          <FormPassenger
            key={i}
            type="child"
            onDataChange={(data) => handleDataChange("children", i, data)}
          />
        ))}
        {passengers.infants.map((_, i) => (
          <FormPassenger
            key={i}
            type="infant"
            onDataChange={(data) => handleDataChange("infants", i, data)}
          />
        ))}
        {!checkLogin && (
          <div
            className="w-full flex flex-col justify-center text-center 
          px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem]"
          >
            <div className="w-full shadow-lg rounded-2xl px-[1rem] md:px-[10rem] py-[1rem] lg:py-[3rem] flex flex-col justify-center items-center gap-5">
              <p className="font-semibold text-2xl">{`Contact information`}</p>
              <div className="w-full">
                <label className="block text-sm text-start font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </div>
          </div>
        )}
        <div
          className="w-full flex flex-col justify-center items-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem] pt-5"
        >
          <div className="w-full flex flex-row justify-end">
            <button
              type="submit"
              className="p-5 bg-primary text-white rounded-2xl text-lg font-sans cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default page;
