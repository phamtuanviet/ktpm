import { getDobMaxDate, getDobMinDate } from "@/services/date";
import React, { useEffect, useState } from "react";

const FormPassenger = ({ type, onDataChange }) => {
  const [dataPassenger, setDataPassenger] = useState(
    type === "adult"
      ? {
          fullName: "",
          dob: "",
          passport: "",
        }
      : {
          fullName: "",
          dob: "",
        }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...dataPassenger, [name]: value };
    setDataPassenger((prev) => ({ ...prev, [name]: value }));
    onDataChange?.(newData);
  };

  return (
    <div
      className="w-full flex flex-col justify-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem]"
    >
      <div className="w-full shadow-lg rounded-2xl px-[1rem] md:px-[10rem] py-[1rem] lg:py-[3rem] flex flex-col justify-center items-center gap-5">
        <p className="font-semibold text-2xl">{`${
          type.charAt(0).toUpperCase() + type.slice(1)
        }`}</p>
        <div className="w-full">
          <label className="block text-sm text-start font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={dataPassenger.fullName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="w-full">
          <label className="block text-sm text-start font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={dataPassenger.dob}
            onChange={handleChange}
            max={getDobMaxDate(type)}
            min={getDobMinDate(type)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {type === "adult" && (
          <div className="w-full">
            <label className="block text-sm font-medium text-start text-gray-700">
              Passport
            </label>
            <input
              type="text"
              name="passport"
              value={dataPassenger.passport}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPassenger;
