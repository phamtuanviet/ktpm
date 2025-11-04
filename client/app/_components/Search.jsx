"use client";
import React, { Children, useEffect, useRef, useState } from "react";
import {
  ArrowRightLeft,
  ArrowUpDown,
  CalendarDays,
  MapPin,
  Minus,
  Plane,
  Plus,
  SearchIcon,
  Users,
} from "lucide-react";
import airportService from "@/lib/api/airport";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

// Apart of the body in use client, this component is used to search for flights
const Search = () => {
  // type of trip oneway or twoway
  const [tripType, setTripType] = useState("oneway");
  // state to manage leaving and going airports, start and return dates, active section, airport suggestions, rotation state, passenger count, and loading state
  const [leavingFrom, setLeavingFrom] = useState("");
  const [goingTo, setGoingTo] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [activeSection, setActiveSection] = useState(null);
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [isRotated, setIsRotated] = useState(true);
  const [passenger, setPassenger] = useState([1, 0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Refs for each section to handle click outside events
  // These refs are used to detect clicks outside the active section to close it
  const leavingButtonRef = useRef(null);
  const leavingContentRef = useRef(null);
  const goingButtonRef = useRef(null);
  const goingContentRef = useRef(null);
  const startDateButtonRef = useRef(null);
  const startDateContentRef = useRef(null);
  const returnDateButtonRef = useRef(null);
  const returnDateContentRef = useRef(null);
  const passengerButtonRef = useRef(null);
  const passengerContentRef = useRef(null);

  // Handlers for minus and plus buttons to adjust passenger counts
  // These functions update the passenger state based on the index of the passenger type (adult, child, infant)
  const handleMinus = (index) => {
    setPassenger((prev) => {
      const newPassenger = [...prev];
      newPassenger[index] = Math.max(
        index === 0 ? 1 : 0,
        newPassenger[index] - 1
      );
      return newPassenger;
    });
  };

  // Function to handle incrementing the passenger count
  // This function increases the count of passengers based on the index
  const handlePlus = (index) => {
    setPassenger((prev) => {
      const newPassenger = [...prev];
      if (index === 2 && newPassenger[0] === newPassenger[2])
        return newPassenger;
      newPassenger[index]++;
      return newPassenger;
    });
  };

  // Effect to fetch airport suggestions based on leavingFrom input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (leavingFrom.trim()) {
        airportService
          .searchAirports(leavingFrom)
          .then((respone) => {
            setAirportSuggestions(respone.data);
          })
          .catch((errorMessage) => {
            setAirportSuggestions([]);
          });
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [leavingFrom]);

  // Effect to fetch airport suggestions based on goingTo input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (goingTo.trim()) {
        airportService
          .searchAirports(goingTo)
          .then((respone) => {
            setAirportSuggestions(respone.data);
          })
          .catch((errorMessage) => {
            setAirportSuggestions([]);
          });
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [goingTo]);

  // Effect to handle clicks outside the active section
  // This effect listens for mousedown events and checks if the click is outside the active section
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!activeSection) return;

      // Lấy refs tương ứng với section đang active
      let buttonRef, contentRef;
      switch (activeSection) {
        case "leaving":
          buttonRef = leavingButtonRef;
          contentRef = leavingContentRef;
          break;
        case "going":
          buttonRef = goingButtonRef;
          contentRef = goingContentRef;
          break;
        case "startDate":
          buttonRef = startDateButtonRef;
          contentRef = startDateContentRef;
          break;
        case "returnDate":
          buttonRef = returnDateButtonRef;
          contentRef = returnDateContentRef;
          break;
        case "passenger":
          buttonRef = passengerButtonRef;
          contentRef = passengerContentRef;
          break;
        default:
          return;
      }
      if (
        buttonRef.current &&
        contentRef.current &&
        !buttonRef.current.contains(event.target) &&
        !contentRef.current.contains(event.target)
      ) {
        if (activeSection === "leaving") {
          setLeavingFrom("");
        } else if (activeSection === "going") {
          setGoingTo("");
        }
        setActiveSection(null);
        setAirportSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeSection]);

  useEffect(() => {
    if (returnDate < startDate) {
      setReturnDate(startDate);
    }
  }, [startDate]);

  useEffect(() => {
    if (returnDate < startDate) {
      setStartDate(returnDate);
    }
  }, [returnDate]);

  const toogleSection = (section) => {
    if (section === activeSection) {
      setAirportSuggestions([]);
    }
    setActiveSection(section === activeSection ? null : section);
  };

  // Function to format the date for display
  // This function formats the date to a more readable format (e.g., "Jan 1")
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Function to handle search button click
  const handleSearch = () => {
    if (!leavingFrom || !goingTo) {
      toast.error("Please fill all fields");
    } else if (leavingFrom === goingTo) {
      toast.error("Departure airport and arrivial airport must be difference");
    } else {
      setIsLoading(true);
      const data = {
        tripType,
        departureAirport: leavingFrom,
        arrivalAirport: goingTo,
        startDate,
        returnDate,
        adults: passenger[0],
        children: passenger[1],
        infants: passenger[2],
      };
      const payload = encodeURIComponent(JSON.stringify(data));
      const href = `/search-flight?payload=${payload}`;
      router.push(href);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full flex flex-col justify-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem]"
    >
      <div className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-3 shadow-lg">
        <div className="flex gap-2 lg:gap-3">
          <button
            className={`cursor-pointer px-4 py-2.5 rounded-4xl transition-colors duration-1000 ease text-[1rem] lg:text-lg font-medium ${
              tripType === "oneway"
                ? "bg-primary text-white"
                : "bg-[white] text-black"
            }`}
            onClick={() => {
              setTripType("oneway");
            }}
          >
            One way
          </button>
          <button
            className={`cursor-pointer px-4 py-2.5 rounded-4xl transition-colors duration-1000 ease text-[1rem] lg:text-lg font-medium ${
              tripType === "oneway"
                ? "bg-[white] text-black"
                : "bg-primary text-white"
            }`}
            onClick={() => {
              setTripType("twoway");
            }}
          >
            Two way
          </button>
          <div className="relative flex items-start lg:w-[20rem] max-w-[40%]">
            <button
              className="border-2 border-gray-500 rounded-4xl 
              active:border-primary h-[4.5rem] cursor-pointer transition-all
               duration-300 ease-in-out transform scale-100 hover:scale-105 w-full"
              ref={passengerButtonRef}
              onClick={() => toogleSection("passenger")}
            >
              <div className="flex flex-row gap-2 items-center px-2 max-w-full">
                <Users className="w-[2rem] h-[2rem] min-w-[2rem] min-h-[2rem]" />
                <div className="flex flex-col items-start max-w-full overflow-hidden">
                  <p
                    className={`flex-[0] text-[0.75rem] md:text-[1rem] font-medium whitespace-nowrap overflow-hidden text-ellipsis truncate `}
                  >
                    Passenger
                  </p>
                  <p
                    className={`flex-[1] text-[0.75rem] md:text-[1rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis truncate max-w-full`}
                  >
                    {`${passenger[0]} adult${passenger[0] > 1 ? "s" : ""}` +
                      `${
                        passenger[1] > 0
                          ? ` ${passenger[1]} child${
                              passenger[1] > 1 ? "ren" : ""
                            }`
                          : ""
                      }` +
                      `${
                        passenger[2] > 0
                          ? ` ${passenger[2]} infant${
                              passenger[2] > 1 ? "s" : ""
                            }`
                          : ""
                      }`}
                  </p>
                </div>
              </div>
            </button>
            {activeSection === "passenger" && (
              <div
                className="absolute top-full right-0 rounded-lg shadow-lg bg-white p-4 border border-gray-200 z-[51] flex flex-col gap-6"
                ref={passengerContentRef}
              >
                <div className="flex  justify-between w-[15rem] lg:w-[25rem]">
                  <p className=" text-lg">Adults(12+)</p>
                  <div className="flex gap-3">
                    <Minus
                      className={`rounded-full border-2 font-light w-[2rem] h-[2rem] ${
                        passenger[0] <= 1
                          ? "border-gray-400 text-gray-400 "
                          : "border-primary text-primary cursor-pointer"
                      }`}
                      onClick={() => handleMinus(0)}
                    />
                    <span className="text-lg ">{passenger[0]}</span>
                    <Plus
                      className={`rounded-full border-2 text-primary border-primary font-light w-[2rem] h-[2rem] cursor-pointer`}
                      onClick={() => handlePlus(0)}
                    />
                  </div>
                </div>
                <div className="flex  justify-between w-[15rem] lg:w-[25rem]">
                  <p className=" text-lg">Children(2-12)</p>
                  <div className="flex gap-3">
                    <Minus
                      className={`rounded-full border-2 font-light w-[2rem] h-[2rem] ${
                        passenger[1] <= 0
                          ? "border-gray-400 text-gray-400 "
                          : "border-primary text-primary cursor-pointer"
                      }`}
                      onClick={() => handleMinus(1)}
                    />
                    <span className="text-lg ">{passenger[1]}</span>
                    <Plus
                      className={`rounded-full border-2 text-primary border-primary font-light w-[2rem] h-[2rem] cursor-pointer`}
                      onClick={() => handlePlus(1)}
                    />
                  </div>
                </div>
                <div className="flex  justify-between w-[15rem] lg:w-[25rem]">
                  <p className=" text-lg">infants(-2)</p>
                  <div className="flex gap-3">
                    <Minus
                      className={`rounded-full border-2 font-light w-[2rem] h-[2rem] ${
                        passenger[2] <= 0
                          ? "border-gray-400 text-gray-400 "
                          : "border-primary text-primary cursor-pointer"
                      }`}
                      onClick={() => handleMinus(2)}
                    />
                    <span className="text-lg ">{passenger[2]}</span>
                    <Plus
                      className={`rounded-full border-2 font-light w-[2rem] h-[2rem] ${
                        passenger[2] === passenger[0]
                          ? "border-gray-400 text-gray-400"
                          : "border-primary text-primary cursor-pointer"
                      }`}
                      onClick={() => handlePlus(2)}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveSection(null);
                  }}
                  className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col lg:flex-row gap-4 ">
            <div className="relative flex-1 lg:max-w-[40%]">
              <button
                className="border-2 border-gray-500 rounded-md w-full
              cursor-pointer active:border-primary h-[4.5rem] 
              transition-all duration-300 ease-in-out transform scale-100 hover:scale-105"
                ref={leavingButtonRef}
                onClick={() => toogleSection("leaving")}
              >
                <div className="flex flex-row gap-2 items-center px-4">
                  <MapPin className="w-[2rem] h-[2rem] min-w-[2rem] min-h-[2rem]" />
                  <div className="flex flex-col max-w-[100%] items-start">
                    <p
                      className={`${
                        leavingFrom
                          ? "flex-[0] text-[1rem] font-medium"
                          : "flex-1 text-[1.5rem] font-semibold"
                      }`}
                    >
                      Location
                    </p>
                    <p
                      className={`${
                        leavingFrom
                          ? "flex-[1] text-[1.5rem] font-semibold truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[100%]"
                          : ""
                      }`}
                    >
                      {leavingFrom}
                    </p>
                  </div>
                </div>
              </button>
              <motion.div
                className="hidden lg:block absolute z-50 cursor-pointer hover:bg-blue-100 
              bg-white -right-2 top-1/2 transform translate-x-1/2 -translate-y-1/2 rounded-full p-1 border-2 border-gray-500"
                animate={{ rotate: isRotated ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setIsRotated(!isRotated);
                  const temp = leavingFrom;
                  setLeavingFrom(goingTo);
                  setGoingTo(temp);
                }}
              >
                <ArrowRightLeft className="text-blue-600" />
              </motion.div>
              <motion.div
                className="block lg:hidden absolute z-50 cursor-pointer hover:bg-blue-100 
              bg-white right-[2rem] -bottom-2 transform translate-y-1/2 rounded-full p-1 border-2 border-gray-500"
                animate={{ rotate: isRotated ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setIsRotated(!isRotated);
                  const temp = leavingFrom;
                  setLeavingFrom(goingTo);
                  setGoingTo(temp);
                }}
              >
                <ArrowUpDown className="text-blue-600" />
              </motion.div>
              {activeSection === "leaving" && (
                <div
                  className="absolute w-full z-50 lg:w-[30rem] bg-white border border-gray-300 shadow-lg rounded-lg"
                  ref={leavingContentRef}
                >
                  <input
                    value={leavingFrom}
                    onChange={(e) => setLeavingFrom(e.target.value)}
                    className="w-full px-3 py-6 border-b border-gray-300 rounded-t-lg text-2xl focus:outline-none"
                    placeholder="Nhập tên sân bay..."
                  />
                  <div className="h-[25rem] overflow-y-auto">
                    {airportSuggestions.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center gap-2">
                        <SearchIcon className="w-[2.5rem] h-[2.5rem]" />
                        <p className="text-lg">Search by city or airport</p>
                      </div>
                    )}
                    {airportSuggestions.map((item) => (
                      <div
                        key={item.id}
                        className="px-3 py-6 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setLeavingFrom(item.name);
                          setAirportSuggestions([]);
                          setActiveSection(null);
                        }}
                      >
                        <Plane />
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative flex-1 lg:max-w-[40%]">
              <button
                className="border-2 border-gray-500 rounded-md w-full
              active:border-primary h-[4.5rem] cursor-pointer transition-all
               duration-300 ease-in-out transform scale-100 hover:scale-105"
                ref={goingButtonRef}
                onClick={() => toogleSection("going")}
              >
                <div className="flex flex-row gap-2 items-center px-4">
                  <MapPin className="w-[2rem] h-[2rem] min-w-[2rem] min-h-[2rem]" />
                  <div className="flex flex-col max-w-[90%] min-w-[90%] items-start">
                    <p
                      className={`${
                        goingTo
                          ? "flex-[0] text-[1rem] font-medium"
                          : "flex-1 text-[1.5rem] font-semibold"
                      }`}
                    >
                      Going to
                    </p>
                    <p
                      className={`${
                        goingTo
                          ? "flex-[1] text-[1.5rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis truncate max-w-[90%]"
                          : ""
                      }`}
                    >
                      {goingTo}
                      {/* {goingTo &&
                      goingTo.length > (tripType === "oneway" ? 25 : 18)
                        ? `${goingTo.slice(
                            0,
                            tripType === "oneway" ? 25 : 18
                          )}...`
                        : goingTo} */}
                    </p>
                  </div>
                </div>
              </button>
              {activeSection === "going" && (
                <div
                  className="absolute w-full z-50 lg:w-[30rem] bg-white border border-gray-300 shadow-lg rounded-lg"
                  ref={goingContentRef}
                >
                  <input
                    value={goingTo}
                    onChange={(e) => setGoingTo(e.target.value)}
                    className="w-full px-3 py-6 border-b border-gray-300 rounded-t-lg text-2xl focus:outline-none"
                    placeholder="Nhập tên sân bay..."
                  />
                  <div className="h-[25rem] overflow-y-auto">
                    {airportSuggestions.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center gap-2">
                        <SearchIcon className="w-[2.5rem] h-[2.5rem]" />
                        <p className="text-lg">Search by city or airport</p>
                      </div>
                    )}
                    {airportSuggestions.map((item) => (
                      <div
                        key={item.id}
                        className="px-3 py-6 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setGoingTo(item.name);
                          setAirportSuggestions([]);
                          setActiveSection(null);
                        }}
                      >
                        <Plane />
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative flex-1">
              <button
                className="border-2 border-gray-500 rounded-md w-full
              active:border-primary h-[4.5rem] cursor-pointer transition-all
               duration-300 ease-in-out transform scale-100 hover:scale-105"
                ref={startDateButtonRef}
                onClick={() => toogleSection("startDate")}
              >
                <div className="flex flex-row gap-2 items-center px-4">
                  <CalendarDays className="w-[2rem] h-[2rem] " />
                  <div className="flex flex-col items-start">
                    <p
                      className={`${
                        startDate
                          ? "flex-[0] text-[1rem] font-medium whitespace-nowrap overflow-hidden text-ellipsis truncate"
                          : "flex-1 text-[1.5rem] font-semibold"
                      }`}
                    >
                      Start date
                    </p>
                    <p
                      className={`${
                        startDate
                          ? "flex-[1] text-[1.5rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis truncate"
                          : "flex-0 text-[1rem] font-medium"
                      }`}
                    >
                      {formatDate(startDate)}
                    </p>
                  </div>
                </div>
              </button>
              {activeSection === "startDate" && (
                <div
                  className="absolute rounded-lg shadow-lg bg-white p-4 border border-gray-200 z-10"
                  ref={startDateContentRef}
                >
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => setStartDate(date)}
                    disabled={{ before: new Date() }}
                  />
                  {
                    <button
                      onClick={() => {
                        setActiveSection(null);
                      }}
                      className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                      Done
                    </button>
                  }
                </div>
              )}
            </div>
            {tripType === "twoway" && (
              <div className="relative flex-1">
                <button
                  className="border-2 border-gray-500  w-full
                 rounded-md active:border-primary h-[4.5rem] cursor-pointer 
                 transition-all duration-300 ease-in-out transform scale-100 hover:scale-105"
                  ref={returnDateButtonRef}
                  onClick={() => toogleSection("returnDate")}
                >
                  <div className="flex flex-row gap-2 items-center px-4">
                    <CalendarDays className="w-[2rem] h-[2rem] " />
                    <div className="flex flex-col items-start">
                      <p
                        className={`${
                          returnDate
                            ? "flex-[0] text-[1rem] font-medium whitespace-nowrap overflow-hidden text-ellipsis truncate"
                            : "flex-1 text-[1.5rem] font-semibold"
                        }`}
                      >
                        Return date
                      </p>
                      <p
                        className={`${
                          returnDate
                            ? "flex-[1] text-[1.5rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis truncate"
                            : "flex-0 text-[1rem] font-medium"
                        }`}
                      >
                        {formatDate(returnDate)}
                      </p>
                    </div>
                  </div>
                </button>

                {activeSection === "returnDate" && (
                  <div
                    className="absolute rounded-lg shadow-lg bg-white p-4 border border-gray-200 z-10"
                    ref={returnDateContentRef}
                  >
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={(date) => setReturnDate(date)}
                      disabled={{ before: startDate }}
                    />
                    {
                      <button
                        onClick={() => {
                          setActiveSection(null);
                        }}
                        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                      >
                        Done
                      </button>
                    }
                  </div>
                )}
              </div>
            )}
            <button
              className="cursor-pointer px-5 py-2.5 rounded-3xl text-lg font-medium bg-primary text-white transform scale-100 hover:scale-105"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default Search;
