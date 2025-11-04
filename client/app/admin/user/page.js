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
  columnUsers,
  filterUsersFormFields,
  sortUserFormFields,
  updateUsersFormFields,
} from "@/data/hardData.js";
import userService from "@/lib/api/user";
import Link from "next/link";
import UpdateModal from "@/app/_components/UpdateModal";
import FilterModal from "@/app/_components/FilterModal";
import SortModal from "@/app/_components/SortModal";
const page = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
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
      <td className="font-sans">{item.id}</td>
      <td className="hidden md:table-cell font-sans py-4">{item.name}</td>
      <td className="hidden lg:table-cell font-sans">{item.email}</td>
      <td className="hidden lg:table-cell font-sans">
        {item.isAccountVerified ? "Yes" : "No"}
      </td>
      <td className="font-sans">{item.role}</td>
      <td>
        <div className="flex items-center gap-1">
          <Link href={`/admin/user/${item.id}`}>
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
      const res = await userService.getUserBySearch(
        currentPage,
        pageSize,
        query.trim(),
        sortBy,
        sortOrder
      );
      setUsers(res?.data.users);
      setTotalPages(res?.data.totalPages);
    } catch (error) {
      console.error("Error fetch news:", error);
      setUsers([]);
    }
  };

  const handleSearch = () => {
    if (currentPage !== 1) setCurrentPage(1);
    else fetchData(1, 10, query,sortBy,sortOrder);
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

  const handleFilter = () => {
    setIsFilter(true);
  };

  const handleSort = () => {
    setIsSort(true);
  };

  const submitUpdate = async (updatedValues) => {
    const { id, role, isAccountVerified } = updatedValues;
    const updatedData = { role, isAccountVerified };
    await userService.updateUser(id, updatedData);
    fetchData(currentPage, 10, query,sortBy,sortOrder);
    closeModal();
  };

  const submitSort = async (sortData) => {
    setSortBy(sortData.sortBy);
    setSortOrder(sortData.sortOrder);
    setCurrentPage(1);
    closeSortModal();
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
            <p className="hidden md:block">All Users</p>
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
          <Table columns={columnUsers} renderRow={renderRow} data={users} />

          {editingItem && (
            <UpdateModal
              key="update-modal"
              item={editingItem}
              onClose={closeModal}
              onSubmit={submitUpdate}
              updateFormFields={updateUsersFormFields}
              type="User"
            />
          )}
          {isFilter && (
            <FilterModal
              key="filter-modal"
              onClose={closeFilterModal}
              fields={filterUsersFormFields}
              type="user"
            />
          )}
          {isSort && (
            <SortModal
              key="sort-modal"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onClose={closeSortModal}
              sortFormFields={sortUserFormFields}
              onSubmit={submitSort}
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
