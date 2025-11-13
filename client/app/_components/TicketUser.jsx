import Image from "next/image";
import React from "react";

const TicketUser = ({ data }) => {
  return (
    <div className="w-full max-w-[50rem]  flex flex-col justify-center text-center items-center">
      <div className="flex flex-col gap-2 rounded-2xl w-full overflow-x-hidden border-2 p-3 mt-[3rem]">
        <div className="flex flex-row justify-between items-center py-3 bg-white">
          <div className="flex gap-1 items-center cursor-pointer font-bold ">
            <Image alt="logo" width={40} height={40} src={"/images/logo.png"} />
            <p className="text-[1rem] text-primary">QAirLine</p>
          </div>
          <div className="font-medium text-xl text-primary">
            {data.flightSeat.seatClass.replace(/_/g, " ")}
          </div>
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
              Seat Number:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.seatNumber}`}</span>
            </p>
            <p className="font-light text-xl">
              Fullname:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.passenger.fullName}`}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 text-start">
            <p className="font-light text-xl">
              Cancel Code:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.cancelCode}`}</span>
            </p>
            <p className="font-light text-xl">
              Booking Refference:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.bookingReference}`}</span>
            </p>
            <p className="font-light text-xl">
              PassengerType:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.passenger.passengerType}`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketUser;
