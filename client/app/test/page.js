"use client";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [check, isCheck] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("dataPassengers");
    if (raw) setData(JSON.parse(raw));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be exactly 6 digits");
      return;
    }
    setError("");
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
    if (error) setError("");
  };
  console.log(data);

  return (
    <>
      {!check && (
        <form
          onSubmit={handleSubmit}
          className="w-full h-full fixed flex flex-col justify-center text-center items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem]"
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl flex flex-col gap-3">
            <p className="font-semibold text-2xl">OTP Authentication</p>
            <div className="w-full">
              <label className="block text-sm text-start font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
              className="p-2 bg-blue-300 text-white rounded-lg hover:bg-blue-500 cursor-pointer"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
      
    </>
  );
};

export default Page;
