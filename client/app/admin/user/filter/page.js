"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import { Eye, Pen, SlidersHorizontal, X } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "@/app/_components/Pagination";
import Table from "@/app/_components/Table";
import {
  columnUsers,
  updateUsersFormFields,
  filterUsersFormFields,
} from "@/data/hardData.js";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import UpdateModal from "@/app/_components/UpdateModal";
import FilterModal from "@/app/_components/FilterModal";
import userService from "@/lib/api/user";

const page = () => {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
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

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-200"
    >
      <td className="font-sans">{item.id}</td>
      <td className="hidden md:table-cell font-sans py-4">{item.name}</td>
      <td className="hidden lg:table-cell font-sans">{item.email}</td>
      <td className="hidden lg:table-cell font-sans">
        {item.isVerified ? "Yes" : "No"}
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
  const fetchData = async () => {
    try {
      const filterData = {
        ...allParams,
        page: currentPage,
        pageSize: 10,
      };
      const res = await userService.filterUsers(filterData);
      setUsers(res?.data.users);
      setTotalPages(res?.data.totalPages);
    } catch (error) {
      console.error("Error fetch users:", error);
      setUsers([]);
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

  const handleUpdate = (item) => {
    setEditingItem(item);
  };

  const handleFilter = () => {
    setIsFilter(true);
  };

  const closeModal = () => {
    setEditingItem(null);
  };

  const closeFilterModal = () => {
    setIsFilter(false);
  };

  const submitUpdate = async (updatedValues) => {
    const { id, role, isVerified } = updatedValues;
    const updatedData = { role, isVerified };
    await userService.updateUser(id, updatedData);
    fetchData();
    closeModal();
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
              <p>Filter Users</p>
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
          <Table columns={columnUsers} renderRow={renderRow} data={users} />

          {editingItem && (
            <UpdateModal
              key="update-modal"
              item={editingItem}
              onClose={closeModal}
              onSubmit={submitUpdate}
              updateFormFields={updateUsersFormFields}
              type="Users"
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
