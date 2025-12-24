import ticketService from "@/lib/api/ticket";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

// This component displays ticket details and allows users to cancel the ticket
// It shows flight information, passenger details, and provides a form to enter a cancel code for ticket cancellation.
const Ticket = ({ data, handleCancel }) => {
  const [isDetail, setIsDetail] = useState(false);
  const [cancelCode, setCancelCode] = useState("");
  const cancelTicket = async () => {
    const res = await ticketService.cancelTicket({ id: data.id, cancelCode });
    if (res) handleCancel();
  };
  return (
    <div
      className="w-full flex flex-col justify-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem] items-center"
    >
      <div className="flex flex-col gap-2 rounded-2xl w-full max-w-[50rem] overflow-x-hidden border-2 p-3 mt-[3rem]">
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
        <div className="flex flex-col lg:flex-row justify-between border-y-2">
          <div className="flex flex-col gap-3 text-start">
            <p className="font-light text-xl">
              Airline: <span className="font-bold text-[1.5xl]">QAirline</span>
            </p>
            <p className="font-light text-xl">
              Departure Airport:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.flight?.departureAirport.name}` || "None"}</span>
            </p>
            <p className="font-light text-xl">
              Arrival Airport:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.flight?.arrivalAirport.name}` || "None"}</span>
            </p>
            <p className="font-light text-xl">
              Flight Number:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.flight?.flightNumber}` || "None"}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 text-start">
            <p className="font-light text-xl">
              Departure time:{" "}
              <span className="font-bold text-[1.5xl]">
                {data.flight?.estimatedDeparture
                  ? new Date(data.flight?.estimatedDeparture).toLocaleString()
                  : new Date(data.flight?.departureTime).toLocaleString()}
              </span>
            </p>
            <p className="font-light text-xl">
              Arrival time:{" "}
              <span className="font-bold text-[1.5xl]">
                {data.flight?.estimatedArrival
                  ? new Date(data.flight?.estimatedArrival).toLocaleString()
                  : new Date(data.flight?.arrivalTime).toLocaleString()}
              </span>
            </p>
            <p className="font-light text-xl">
              Seat Number:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.seatNumber}`}</span>
            </p>
            <p className="font-light text-xl">
              Booking Refference:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.bookingReference}`}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 text-start">
            <p className="font-light text-xl">
              Passenger Name:{" "}
              <span className="font-bold text-[1.5xl]">
                {data.passenger.fullName}
              </span>
            </p>
            <p className="font-light text-xl">
              Date Of Birth:{" "}
              <span className="font-bold text-[1.5xl]">{`${new Date(
                data.passenger.dob
              ).toLocaleString()}`}</span>
            </p>
            <p className="font-light text-xl">
              Email:{" "}
              <span className="font-bold text-[1.5xl]">{`${data.passenger.email}`}</span>
            </p>
          </div>
        </div>
        {/* <div
          className="flex flex-col lg:flex-row items-center justify-center py-2"
          onClick={() => setIsDetail((prev) => !prev)}
        >
          {isDetail ? <ChevronUp /> : <ChevronDown />}
        </div>
        {isDetail && (
          <div className="flex flex-row justify-between items-center text-start">
            {data.flight.seats.map((seat) => (
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
        )} */}

        <div className="flex flex-row justify-start py-2 gap-3 items-center">
          <div className="w-[25rem]">
            <input
              name="cancelCode"
              type="text"
              value={cancelCode}
              onChange={(e) => setCancelCode(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-3 "
              placeholder={`Type CancelCode to cancel ticket`}
            />
          </div>
          <button
            className="text-white bg-red-300 hover:bg-red-500 p-3 rounded-2xl font-medium"
            onClick={cancelTicket}
          >
            Cancel Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
