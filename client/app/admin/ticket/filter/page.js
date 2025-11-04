"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import { Eye, Pen, SlidersHorizontal, X } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "@/app/_components/Pagination";
import Table from "@/app/_components/Table";
import { filterTicketsFormFields, columnTickets } from "@/data/hardData.js";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FilterModal from "@/app/_components/FilterModal";
import flightService from "@/lib/api/flight";
import ticketService from "@/lib/api/ticket";

const page = () => {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilter, setIsFilter] = useState(false);

  const [allParams, setAllParams] = useState(() => {
    const initialParams = {};
    for (const key of searchParams.keys()) {
      initialParams[key] = searchParams.get(key);
    }
    return initialParams;
  });

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const searchListFlights = async (q, { signal } = {}) => {
    return await flightService.searchFlightsInTicket(q, { signal });
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-200"
    >
      <td className="font-sans hidden lg:table-cell">{item.id}</td>
      <td className="font-sans hidden lg:table-cell">
        {item.flight.flightNumber}
      </td>
      <td className="font-sans">{item.passenger.fullName}</td>
      <td className="font-sans">{item.flight.departureAirport.name}</td>
      <td className="font-sans">{item.flight.arrivalAirport.name}</td>

      <td className="font-sans">
        {item.flight.estimatedDeparture
          ? new Date(item.flight.estimatedDeparture).toLocaleString()
          : new Date(item.flight.departureTime).toLocaleString()}
      </td>
      <td className="font-sans hidden lg:table-cell">{item.seatNumber}</td>
      <td className="font-sans table-cell sm:hidden">
        {item.bookingReference}
      </td>
      <td className="font-sans hidden lg:table-cell">{item.passengerType}</td>
      <td className="font-sans hidden lg:table-cell">
        {item.flightSeat.seatClass}
      </td>
      <td className="font-sans">{item.isCancelled ? "Yes" : "No"} </td>
      <td>
        <div className="flex items-center gap-1">
          <Link href={`/admin/ticket/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 cursor-pointer">
              <Eye className="w-[16px] h-[16px] text-white" />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
  const fetchData = async () => {
    try {
      const filterData = {
        ...allParams,
        page: currentPage,
        pageSize: 10,
      };
      const res = await ticketService.filterTickets(filterData);
      setTickets(res?.data.tickets);
      setTotalPages(res?.data.totalPages);
    } catch (error) {
      console.error("Error fetch tickets:", error);
      setTickets([]);
    }
  };

  useEffect(() => {
    setAllParams(() => {
      const params = {};
      for (const key of searchParams.keys()) {
        params[key] = searchParams.get(key);
      }
      return params;
    });
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    setIsFilter(true);
  };

  const closeFilterModal = () => {
    setIsFilter(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, allParams]);

  return (
    <div className="h-screen w-full flex">
      <Sidebar type="big" />
      <div className="flex-1">
        <HearderAdmin />
        <div className="p-5 flex flex-col items-center justify-between">
          <div className="w-full md:w-[80%] flex flex-col  justify-between font-medium gap-2">
            <div className="flex flex-row items-center  justify-start gap-2">
              <p>Filter Tickets</p>
              <button
                className="flex flex-row items-center justify-center rounded-full bg-yellow-200 p-2 cursor-pointer"
                onClick={handleFilter}
              >
                <SlidersHorizontal className="w-[15px] h-[15px]" />
              </button>
            </div>
            <div className="flex flex-col w-full gap-2 items-center justify-center">
              {Object.entries(allParams).map(([key, value]) => (
                <div
                  key={key}
                  className="w-full rounded-2xl bg-blue-200 text-white p-2"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} : {value}
                </div>
              ))}
            </div>
          </div>
          <Table columns={columnTickets} renderRow={renderRow} data={tickets} />

          {isFilter && (
            <FilterModal
              key="filter-modal"
              onClose={closeFilterModal}
              fields={filterTicketsFormFields}
              option={{
                searchFlightsByQuery: searchListFlights,
              }}
              type="ticket"
            />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
