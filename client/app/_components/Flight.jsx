import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Flight = ({ data }) => {
  const [isDetail, setIsDetail] = useState(false);
  return (
    <div className="w-full max-w-[50rem]  flex flex-col justify-center text-center items-center">
      <div className="flex flex-col gap-2 rounded-2xl w-full overflow-x-hidden border-2 p-3 mt-[1rem]">
        <div className="flex flex-row justify-between items-center py-3 bg-white">
          <div className="flex gap-1 items-center cursor-pointer font-bold ">
            <Image alt="logo" width={40} height={40} src={"/images/logo.png"} />
            <p className="text-[1rem] text-primary">QAirLine</p>
          </div>
          <div className="font-medium text-xl text-primary">Flight</div>
          <div className="flex gap-1 items-center cursor-pointer font-bold">
            <Image alt="logo" width={40} height={40} src={"/images/logo.png"} />
            <p className="text-[1rem] text-primary">QAirLine</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between border-t-2 gap-3">
          <div className="flex flex-col gap-3 text-start">
            <p className="font-light text-xl">
              Airline: <span className="font-bold text-[1.5xl]">QAirline</span>
            </p>
            <p className="font-light text-xl">
              Flight Number:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.flightNumber}`}</span>
            </p>
            <p className="font-light text-xl">
              Status:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.status}`}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 text-start">
            <p className="font-light text-xl">
              Departure Airport:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.departureAirport.name}`}</span>
            </p>
            <p className="font-light text-xl">
              Arrival Airport:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.arrivalAirport.name}`}</span>
            </p>
            <p className="font-light text-xl">
              Aircraft name:{" "}
              <span className="font-bold text-[1.5xl]">
                {`${data.aircraft.name}`}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-3 text-start">
            <p className="font-light text-xl">
              Departure time:{" "}
              <span className="font-bold text-[1.5xl]">
                {data.estimatedDeparture
                  ? new Date(data.estimatedDeparture).toLocaleString()
                  : new Date(data.departureTime).toLocaleString()}
              </span>
            </p>
            <p className="font-light text-xl">
              Arrival time:{" "}
              <span className="font-bold text-[1.5xl]">
                {data.estimatedArrival
                  ? new Date(data.estimatedArrival).toLocaleString()
                  : new Date(data.arrivalTime).toLocaleString()}
              </span>
            </p>
            <p className="font-light text-xl">
              Manufacture Aircraft:{" "}
              <span className="font-bold text-[1.5xl]">
                {`${data.aircraft.manufacturer}`}
              </span>
            </p>
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row items-center justify-center py-2"
          onClick={() => setIsDetail((prev) => !prev)}
        >
          {isDetail ? <ChevronUp /> : <ChevronDown />}
        </div>
        {isDetail && (
          <div className="flex flex-row justify-between items-center text-start">
            {data.seats.map((seat) => (
              <div key={seat.seatClass} className="flex flex-col gap-3">
                <p className="font-light text-xl">
                  Seat Class:{" "}
                  <span className="font-bold text-[1.5xl]">
                    {`${seat.seatClass}`}
                  </span>
                </p>
                <p className="font-light text-xl">
                  Total seats:{" "}
                  <span className="font-bold text-[1.5xl]">
                    {`${seat.totalSeats}`}
                  </span>
                </p>
                <p className="font-light text-xl">
                  Booked seats:{" "}
                  <span className="font-bold text-[1.5xl]">
                    {`${seat.bookedSeats}`}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flight;
