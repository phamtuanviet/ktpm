"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import InfoSearchFlight from "../_components/InfoSearchFlight";
import {
  Armchair,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Crown,
  ListFilterPlus,
  PlaneTakeoff,
  Timer,
} from "lucide-react";
import flightService from "@/lib/api/flight";
import { getFlightDuration } from "@/services/date";
import FilterFlight from "../_components/FilterFlight";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("payload");
  const [dataSearch, setDataSearch] = useState(null);
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [inboundFlights, setInboundFlights] = useState([]);
  const [filterOutboundFlight, setFilterOutboundFlight] = useState([]);
  const [filterInboundFlight, setFilterInboundFlight] = useState([]);
  const [step, setStep] = useState("outbound");
  const [openDetail, setOpenDetail] = useState({
    flightId: null,
    seatClass: null,
    seatData: null,
  });
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedInbound, setSelectedInbound] = useState(null);

  const [isFilter, setIsFilter] = useState(false);
  const [timeRange, setTimeRange] = useState("");

  const fetchFlights = async () => {
    const res = await flightService.searchFlightsByUser(dataSearch);
    const { outbound = [], inbound = [] } = res?.data || {};
    setOutboundFlights(outbound);
    setInboundFlights(inbound);
    setStep("outbound");
    setTimeRange("");
  };

  const onCloseFilter = () => {
    setIsFilter((prev) => !prev);
  };

  const onSubmitFilter = (data) => {
    setTimeRange(data);
  };

  useEffect(() => {
    if (isFilter) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilter]);

  const formatTimeVn = (isoString) => {
    const d = new Date(isoString);
    const utcH = d.getUTCHours();
    const utcM = d.getUTCMinutes();
    const utcS = d.getUTCSeconds();
    const vnH = (utcH + 7) % 24;
    const hh = String(vnH).padStart(2, "0");
    const mm = String(utcM).padStart(2, "0");
    const ss = String(utcS).padStart(2, "0");
    console.log(`${hh}:${mm}:${ss}`);
    return `${hh}:${mm}:${ss}`;
  };

  useEffect(() => {
    if (!timeRange) {
      setFilterOutboundFlight(outboundFlights);
      setFilterInboundFlight(inboundFlights);
      return;
    } else if (timeRange) {
      console.log(timeRange);
      const { start, end } = JSON.parse(timeRange);

      if (step === "outbound") {
        setFilterOutboundFlight(
          outboundFlights.filter((flight) => {
            const depTime = formatTimeVn(flight.departureTime);
            return depTime >= start && depTime <= end;
          })
        );
      } else {
        setFilterInboundFlight(
          inboundFlights.filter((flight) => {
            const depTime = formatTimeVn(flight.departureTime);
            return depTime >= start && depTime <= end;
          })
        );
      }
    }
  }, [timeRange, outboundFlights, inboundFlights, step]);

  const disPlayTextFilter = () => {
    const { start, end } = JSON.parse(timeRange);
    const displayFromJson = `Start: ${start}, End: ${end}`;
    return displayFromJson;
  };

  const flightsToShow =
    dataSearch?.tripType === "twoway"
      ? step === "outbound"
        ? filterOutboundFlight
        : filterInboundFlight
      : filterOutboundFlight;

  useEffect(() => {
    if (!raw) return;
    try {
      const decoded = decodeURIComponent(raw);
      setDataSearch(JSON.parse(decoded));
    } catch (err) {
      console.error("Failed to parse payload:", err);
      setDataSearch(null);
    }
  }, [raw]);

  useEffect(() => {
    if (dataSearch) fetchFlights();
  }, [dataSearch]);

  if (!dataSearch) {
    return <div>Chưa có dữ liệu hoặc payload không hợp lệ</div>;
  }

  return (
    <>
      <Header />
      <InfoSearchFlight data={dataSearch} type={step} />
      <div
        className="w-full flex flex-col justify-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem] min-h-[30rem] gap-5"
      >
        {outboundFlights.length !== 0 && (
          <div className="flex flex-row justify-between mt-[1rem]">
            <button
              className="flex flex-row p-3 bg-primary gap-2 rounded-2xl text-white cursor-pointer"
              onClick={() => setIsFilter(!isFilter)}
            >
              <div>
                <ListFilterPlus />
              </div>
              <p className="text-lg">Show filters</p>
            </button>
            {timeRange && (
              <p className="text-center font-medium text-xl text-primary flex items-center">{`${disPlayTextFilter()}`}</p>
            )}
          </div>
        )}

        {outboundFlights.length !== 0 && (
          <div className="flex flex-col gap-3">
            {flightsToShow.map((flight) => {
              const firstClass = flight.seats.find(
                (s) => s.seatClass === "FIRST_CLASS"
              );
              const business = flight.seats.find(
                (s) => s.seatClass === "BUSINESS"
              );
              const economy = flight.seats.find(
                (s) => s.seatClass === "ECONOMY"
              );

              const handleDetail = (seatClass, seatData) => {
                if (
                  openDetail.flightId === flight.id &&
                  openDetail.seatClass === seatClass
                ) {
                  return setOpenDetail({
                    flightId: null,
                    seatClass: null,
                    seatData: null,
                  });
                }
                setOpenDetail({ flightId: flight.id, seatClass, seatData });
              };

              const handleBooked = (seatClass) => {
                const selected = { flight, seatClass };
                if (step === "outbound") setSelectedOutbound(selected);
                else setSelectedInbound(selected);
                if (step === "outbound" && dataSearch?.tripType === "twoway") {
                  setStep("inbound");
                  setTimeRange("");
                } else {
                  const dataConfirm = {
                    selectedOutbound:
                      step === "outbound" ? selected : selectedOutbound,
                    selectedInbound: step === "outbound" ? undefined : selected,
                    adults: dataSearch.adults,
                    children: dataSearch.children,
                    infants: dataSearch.infants,
                  };
                  sessionStorage.setItem(
                    "dataBookingFlightConfirm",
                    JSON.stringify(dataConfirm)
                  );
                  router.push(`/search-flight/confirm`);
                }
              };
              return (
                <div
                  className="flex flex-col rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
                  key={flight.id}
                >
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 ">
                    <div className="flex-[1] flex flex-row justify-between p-5">
                      <div className="flex flex-col gap-1 font-sans">
                        <div className="text-primary">
                          {flight.departureAirport.iataCode}{" "}
                          {flight.estimatedDeparture
                            ? new Date(
                                flight.estimatedDeparture
                              ).toLocaleString()
                            : new Date(flight.departureTime).toLocaleString()}
                        </div>
                        <div className="text-primary">
                          {flight.arrivalAirport.iataCode}{" "}
                          {flight.estimatedArrival
                            ? new Date(flight.estimatedArrival).toLocaleString()
                            : new Date(flight.arrivalTime).toLocaleString()}
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
                            {flight.estimatedDeparture
                              ? getFlightDuration(
                                  flight.estimatedDeparture,
                                  flight.estimatedArrival
                                )
                              : getFlightDuration(
                                  flight.departureTime,
                                  flight.arrivalTime
                                )}
                          </p>
                        </div>
                        <div className="flex flex-row gap-1">
                          <div>
                            <PlaneTakeoff />
                          </div>
                          <p>
                            {"Operated by Qairline: "}
                            {flight.flightNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-[1] flex flex-row h-[10rem] items-stretch  justify-center text-white text-sans p-0 w-full">
                      <div
                        className="flex-[1] flex flex-col cursor-pointer bg-[#D1D5DB] hover:bg-[#BCC0C5] transition-colors duration-200 h-full gap-2 py-2 justify-between"
                        onClick={() => handleDetail("ECONOMY", economy)}
                      >
                        <div className="flex justify-center">
                          <Crown />
                        </div>
                        <p className=" font-semibold">ECONOMY</p>
                        {economy ? (
                          <p className="text-center">{`Price: ${economy.price} USD`}</p>
                        ) : (
                          "Full"
                        )}
                        <div className="flex justify-center">
                          {openDetail.flightId === flight.id &&
                          openDetail.seatClass === "ECONOMY" ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </div>
                      </div>
                      <div
                        className="flex-[1] flex flex-col cursor-pointer bg-[#93C5FD] hover:bg-[#84B1E4] transition-colors duration-200 h-full gap-2  py-2 justify-between"
                        onClick={() => handleDetail("BUSINESS", business)}
                      >
                        <div className="flex justify-center">
                          <Briefcase />
                        </div>
                        <p className=" font-semibold">BUSINESS</p>
                        {business ? (
                          <p className="text-center">{`Price: ${business.price} USD`}</p>
                        ) : (
                          "Full"
                        )}
                        <div className="flex justify-center">
                          {openDetail.flightId === flight.id &&
                          openDetail.seatClass === "BUSINESS" ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </div>
                      </div>
                      <div
                        className="flex-1 flex flex-col cursor-pointer bg-[#FDE68A] hover:bg-[#E4CF7C] transition-colors duration-200 h-full gap-2 py-2 justify-between overflow-hidden"
                        onClick={() => handleDetail("FIRST_CLASS", firstClass)}
                      >
                        <div className="flex justify-center">
                          <Armchair />
                        </div>
                        <p className=" font-semibold">FIRST CLASS</p>
                        {firstClass ? (
                          <p className="text-center">{`Price: ${firstClass.price} USD`}</p>
                        ) : (
                          "Full"
                        )}
                        <div className="flex justify-center">
                          {openDetail.flightId === flight.id &&
                          openDetail.seatClass === "FIRST_CLASS" ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {openDetail.flightId === flight.id && (
                    <div className="p-4 rounded-b-2xl flex flex-col gap-2 items-center">
                      <h4 className="font-bold mb-2">
                        {openDetail.seatClass.replace("_", " ")} Details
                      </h4>
                      {openDetail.seatData ? (
                        <ul className="list-none pl-5 ">
                          <li>Price: ${openDetail.seatData.price}</li>
                          <li>
                            Available Seats:{" "}
                            {openDetail.seatData.availableSeats}
                          </li>
                          <li>Total Seats: {openDetail.seatData.totalSeats}</li>
                        </ul>
                      ) : (
                        <p>No seats available in this class.</p>
                      )}
                      {openDetail.seatData && (
                        <button
                          className="flex flex-row p-3 bg-primary gap-2 rounded-2xl text-white cursor-pointer"
                          onClick={() => handleBooked(openDetail.seatClass)}
                        >
                          <p className="text-lg font-semibold">
                            Confirm And Continue
                          </p>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {flightsToShow.length === 0 && (
              <div className="flex flex-col min-h-[30rem] items-center justify-center font-semibold text-3xl">
                No flight found
              </div>
            )}
          </div>
        )}
        {outboundFlights.length === 0 && (
          <div className="flex flex-col min-h-[30rem] items-center justify-center font-semibold text-3xl">
            No flight found
          </div>
        )}
      </div>
      <Footer />
      {isFilter && (
        <FilterFlight onClose={onCloseFilter} onSubmit={onSubmitFilter} />
      )}
    </>
  );
}
