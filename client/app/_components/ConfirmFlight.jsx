import { getFlightDuration } from "@/services/date";
import { Armchair, PlaneTakeoff, Timer } from "lucide-react";
import React from "react";
import { SeatOption } from "./SeatOption";

// Display flight confirmation details including flight information, seat class, and seat details.
const ConfirmFlight = ({ dataFlight }) => {
  // Format seat class to a more readable format to uppercase the first letter of each word and replace underscores with spaces.
  const formatSeatClass = (seatClass) => {
    return seatClass
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const seat = dataFlight.flight.seats.find(
    (s) => s.seatClass === dataFlight.seatClass
  );
  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div
      className="w-full flex flex-col justify-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem] pt-5"
    >
      <div className="flex flex-col rounded-2xl overflow-hidden bg-gray-100 shadow-lg gap-2 p-4">
        <div className="flex flex-row justify-start">
          <p className=" font-semibold">
            {`${dataFlight.flight.departureAirport.name} to ${dataFlight.flight.arrivalAirport.name}  `}
            <span className="border-l-2 border-gray-200  text-primary font-light">{` ${formatDate(
              dataFlight.flight.estimatedDeparture ||
                dataFlight.flight.departureTime
            )}`}</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 border-y-2 ">
          <div className="flex-[0.7] flex flex-row justify-between p-5">
            <div className="flex flex-col gap-1 font-sans">
              <div className="text-primary">
                {dataFlight.flight.departureAirport.iataCode}{" "}
                {dataFlight.flight.estimatedDeparture
                  ? new Date(
                      dataFlight.flight.estimatedDeparture
                    ).toLocaleString()
                  : new Date(dataFlight.flight.departureTime).toLocaleString()}
              </div>
              <div className="text-primary">
                {dataFlight.flight.arrivalAirport.iataCode}{" "}
                {dataFlight.flight.estimatedArrival
                  ? new Date(
                      dataFlight.flight.estimatedArrival
                    ).toLocaleString()
                  : new Date(dataFlight.flight.arrivalTime).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col border-r-1"></div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1">
                <div>
                  <Timer />
                </div>
                <p>
                  {" "}
                  {`Flight time: `}
                  {dataFlight.flight.estimatedDeparture
                    ? getFlightDuration(
                        dataFlight.flight.estimatedDeparture,
                        dataFlight.flight.estimatedArrival
                      )
                    : getFlightDuration(
                        dataFlight.flight.departureTime,
                        dataFlight.flight.arrivalTime
                      )}
                </p>
              </div>
              <div className="flex flex-row gap-1">
                <div>
                  <PlaneTakeoff />
                </div>
                <p>
                  {"Operated by Qairline: "}
                  {dataFlight.flight.flightNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-[0.3] flex flex-row h-[10rem] items-stretch  justify-center text-white text-sans p-0 w-full">
            <SeatOption seat={seat}/>
          </div>
        </div>
        <div className="p-4 rounded-b-2xl flex flex-col gap-2 items-center">
          <h4 className="font-bold mb-2">
            {dataFlight.seatClass.replace("_", " ")} Details
          </h4>
          <ul className="list-none pl-5 ">
            <li>Price: ${seat.price}</li>
            <li>Available Seats: {seat.availableSeats}</li>
            <li>Total Seats: {seat.totalSeats}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfirmFlight;
