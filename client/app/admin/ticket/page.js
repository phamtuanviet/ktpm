"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import {
  ArrowDownWideNarrow,
  Eye,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "@/app/_components/Pagination";
import Table from "@/app/_components/Table";
import {
  columnTickets,
  sortTicketFormFields,
  filterTicketsFormFields,
} from "@/data/hardData.js";
import Link from "next/link";
import FilterModal from "@/app/_components/FilterModal";
import SortModal from "@/app/_components/SortModal";
import ticketService from "@/lib/api/ticket";
import flightService from "@/lib/api/flight";
const page = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const onPageChange = (page) => {
    setCurrentPage(page);
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
      <td className="font-sans hidden lg:table-cell">
        {item.passenger.fullName}
      </td>
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
      <td className="font-sans hidden lg:table-cell">{item.passenger.passengerType}</td>
      <td className="font-sans hidden lg:table-cell">
        {item.flightSeat.seatClass}
      </td>
      <td>{item.isCancelled ? "Yes" : "No"}</td>
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
  const fetchData = async (
    currentPage = 1,
    pageSize = 10,
    query = "",
    sortBy = "id",
    sortOrder = "asc"
  ) => {
    try {
      const res = await ticketService.getTicketsBySearch(
        currentPage,
        pageSize,
        query.trim(),
        sortBy,
        sortOrder
      );
      setTickets(res?.data.tickets);
      setTotalPages(res?.data.totalPages);
    } catch (error) {
      console.error("Error fetch tickets:", error);
      setTickets([]);
    }
  };

  const handleSearch = () => {
    if (currentPage !== 1) setCurrentPage(1);
    else fetchData(1, 10, query, sortBy, sortOrder, sortBy, sortOrder);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    setIsFilter(true);
  };

  const closeFilterModal = () => {
    setIsFilter(false);
  };

  const closeSortModal = () => {
    setIsSort(false);
  };

  const handleSort = () => {
    setIsSort(true);
  };

  const submitSort = async (sortData) => {
    setSortBy(sortData.sortBy);
    setSortOrder(sortData.sortOrder);
    setCurrentPage(1);
    closeSortModal();
  };

  const searchListFlights = async (q, { signal } = {}) => {
    return await flightService.searchFlightsInTicket(q, { signal });
  };

  useEffect(() => {
    fetchData(currentPage, 10, query, sortBy, sortOrder);
  }, [currentPage, sortBy, sortOrder]);

  return (
    <div className="h-screen w-full flex">
      <div>
        <Sidebar type="big" />
      </div>
      <div className="flex-1">
        <HearderAdmin />
        <div className="p-5 flex flex-col items-center justify-between">
          <div className="w-full md:w-[80%] flex flex-row justify-between items-center font-medium">
            <p className="hidden md:block">All Tickets</p>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="w-full md:w-auto flex  items-center rounded-full border-[1.5px] border-gray-300 px-2">
                <Search
                  className={` ${
                    query.trim() === "" ? "text-gray-300" : ""
                  } cursor-pointer`}
                  onClick={handleSearch}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-[200px] p-2 bg-transparent outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-end">
                <button
                  className="flex flex-row items-center justify-center rounded-full bg-yellow-200 p-2 cursor-pointer"
                  onClick={handleFilter}
                >
                  <SlidersHorizontal className="w-[14px] h-[14px]" />
                </button>
                <button
                  className="flex flex-row items-center justify-center rounded-full bg-yellow-200 p-2 cursor-pointer"
                  onClick={handleSort}
                >
                  <ArrowDownWideNarrow className="w-[14px] h-[14px]" />
                </button>
              </div>
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
          {isSort && (
            <SortModal
              onClose={closeSortModal}
              sortBy={sortBy}
              sortOrder={sortOrder}
              type={"ticket"}
              onSubmit={submitSort}
              sortFormFields={sortTicketFormFields}
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
