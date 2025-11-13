"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import { Eye, Pen, SlidersHorizontal, X } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "@/app/_components/Pagination";
import Table from "@/app/_components/Table";
import {
  updateAircraftsFormFields,
  columnAircrafts,
  filterAircraftsFormFields,
} from "@/data/hardData.js";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import UpdateModal from "@/app/_components/UpdateModal";
import aircraftService from "@/lib/api/aircraft";
import FilterModal from "@/app/_components/FilterModal";

const page = () => {
  const searchParams = useSearchParams();
  const [aircrafts, setAircrafts] = useState([]);
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

  const deleteAircraft = (item) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await aircraftService.deleteAircraft(item.id);
        fetchData(currentPage, 10, query, sortBy, sortOrder);
      }
    });
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-200"
    >
      <td className="font-sans">{item.id}</td>
      <td className="font-sans py-4">{item.name}</td>
      <td className="font-sans">{item.manufacturer}</td>
      <td>
        <div className="flex items-center gap-1">
          <Link href={`/admin/aircraft/${item.id}`}>
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
      const res = await aircraftService.filterAircraft(filterData);
      setAircrafts(res?.aircrafts);
      setTotalPages(res?.totalPages);
    } catch (error) {
      console.error("Error fetch news:", error);
      setAircrafts([]);
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
    fetchData();
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
    const { id, name, manufacturer } = updatedValues;
    const updatedData = { name, manufacturer };
    await aircraftService.updateAircraft(id, updatedData);
    fetchData();
    closeModal();
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div className="h-screen w-full flex">
      <Sidebar type="big" />
      <div className="flex-1">
        <HearderAdmin />
        <div className="p-5 flex flex-col items-center justify-between">
          <div className="w-full md:w-[80%] flex flex-col  justify-between font-medium gap-2">
            <div className="flex flex-row items-center  justify-start gap-2">
              <p>Filter Aircrafts</p>
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
          <Table
            columns={columnAircrafts}
            renderRow={renderRow}
            data={aircrafts}
          />

          {editingItem && (
            <UpdateModal
              key="update-modal"
              item={editingItem}
              onClose={closeModal}
              onSubmit={submitUpdate}
              updateFormFields={updateAircraftsFormFields}
              type="Aircraft"
            />
          )}
          {isFilter && (
            <FilterModal
              key="filter-modal"
              onClose={closeFilterModal}
              fields={filterAircraftsFormFields}
              type="aircraft"
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
