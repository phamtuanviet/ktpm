"use client";
import React, { use, useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import {
  ArrowDownWideNarrow,
  Eye,
  Pen,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
// import TableSearch from "@/app/_components/TableSearch";
import Pagination from "@/app/_components/Pagination";
import Table from "@/app/_components/Table";
import {
  columnFlights,
  columnUsers,
  createFlightsFormFields,
  filterFlightFormFields,
  filterUsersFormFields,
  sortFlightFormFields,
  sortUserFormFields,
  updateFlightsFormFields,
  updateUsersFormFields,
} from "@/data/hardData.js";
import userService from "@/lib/api/user";
import Link from "next/link";
import UpdateModal from "@/app/_components/UpdateModal";
import FilterModal from "@/app/_components/FilterModal";
import SortModal from "@/app/_components/SortModal";
import UpdateFlight from "@/app/_components/UpdateFlight";
import aircraftService from "@/lib/api/aircraft";
import flightService from "@/lib/api/flight";
import CreateFlight from "@/app/_components/CreateFlight";
import airportService from "@/lib/api/airport";
import { toast } from "sonner";
const page = () => {
  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
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
      <td className="font-sans">{item.id}</td>
      <td className="font-sans">{item.flightNumber}</td>
      <td className="font-sans">{item.departureAirport.name}</td>
      <td className="font-sans">{item.arrivalAirport.name}</td>
      <td className="font-sans">
        {item.estimatedDeparture
          ? new Date(item.estimatedDeparture).toLocaleString()
          : new Date(item.departureTime).toLocaleString()}
      </td>
      <td className="font-sans">
        {item.estimatedArrival
          ? new Date(item.estimatedArrival).toLocaleString()
          : new Date(item.arrivalTime).toLocaleString()}
      </td>
      <td className="hidden lg:table-cell font-sans">{item.status}</td>
      <td className="hidden lg:table-cell font-sans">{item.totalSeats}</td>
      <td className="hidden lg:table-cell font-sans">{item.bookedSeats}</td>
      <td>
        <div className="flex items-center gap-1">
          <Link href={`/admin/flight/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 cursor-pointer">
              <Eye className="w-[16px] h-[16px] text-white" />
            </button>
          </Link>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-green-200 cursor-pointer"
            onClick={() => handleUpdate(item)}
          >
            <Pen className="w-[16px] h-[16px] text-white" />
          </button>
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
      const res = await flightService.getFlightsBySearch(
        currentPage,
        pageSize,
        query.trim(),
        sortBy,
        sortOrder
      );
      setFlights(res?.data.flights);
      setTotalPages(res?.data.totalPages);
    } catch (error) {
      console.error("Error fetch flights:", error);
      setFlights([]);
    }
  };

  const handleSearch = () => {
    if (currentPage !== 1) setCurrentPage(1);
    else fetchData(1, 10, query, sortBy, sortOrder);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (item) => {
    setEditingItem(item);
  };

  const closeModal = () => {
    setEditingItem(null);
  };

  const closeFilterModal = () => {
    setIsFilter(false);
  };

  const closeSortModal = () => {
    setIsSort(false);
  };

  const closeCreateModal = () => {
    setIsCreate(false);
  };

  const handleCreate = () => {
    setIsCreate(true);
  };

  const handleFilter = () => {
    setIsFilter(true);
  };

  const handleSort = () => {
    setIsSort(true);
  };

  const submitUpdate = async (updatedValues) => {
    if (updatedValues.departureTime >= updatedValues.arrivalTime) {
      return toast.error("Invalid time");
    }
    await flightService.updateFlight(updatedValues.id, updatedValues);
    fetchData(currentPage, 10, query, sortBy, sortOrder);
    closeModal();
  };

  const submitCreate = async (createdValues) => {
    if (createdValues.departureTime >= createdValues.arrivalTime) {
      return toast.error("Invalid time");
    }
    await flightService.createFlight(createdValues);
    fetchData(currentPage, 10, query, sortBy, sortOrder);
    closeCreateModal();
  };

  const submitSort = async (sortData) => {
    setSortBy(sortData.sortBy);
    setSortOrder(sortData.sortOrder);
    setCurrentPage(1);
    closeSortModal();
  };

  const searchListAirports = async (q, { signal } = {}) => {
    return await airportService.searchAirportsInFlight(q, { signal });
  };

  const searchListAircrafts = async (q, { signal } = {}) => {
    return await aircraftService.searchAircraftsInFlight(q, { signal });
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
            <p className="hidden md:block">All Flights</p>
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
                <button
                  className="flex flex-row items-center justify-center rounded-full bg-yellow-200 p-2 cursor-pointer"
                  onClick={handleCreate}
                >
                  <Plus className="w-[14px] h-[14px]" />
                </button>
              </div>
            </div>
          </div>
          <Table columns={columnFlights} renderRow={renderRow} data={flights} />

          {editingItem && (
            <UpdateFlight
              key="update-flight"
              item={editingItem}
              onClose={closeModal}
              onSubmit={submitUpdate}
              updateFormFields={updateFlightsFormFields}
              type="Flight"
              searchAirportsByQuery={searchListAirports}
              searchAircraftsByQuery={searchListAircrafts}
            />
          )}
          {isFilter && (
            <FilterModal
              key="filter-modal"
              onClose={closeFilterModal}
              fields={filterFlightFormFields}
              type="flight"
              option={{
                searchAirportsByQuery: searchListAirports,
                searchAircraftsByQuery: searchListAircrafts,
              }}
            />
          )}
          {isSort && (
            <SortModal
              key="sort-modal"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onClose={closeSortModal}
              sortFormFields={sortFlightFormFields}
              onSubmit={submitSort}
            />
          )}
          {isCreate && (
            <CreateFlight
              key="create-flight"
              onClose={closeCreateModal}
              searchAirportsByQuery={searchListAirports}
              searchAircraftsByQuery={searchListAircrafts}
              type="Flight"
              onSubmit={submitCreate}
              createFormFields={createFlightsFormFields}
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
