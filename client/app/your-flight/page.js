"use client";
import React, { useEffect, useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import Ticket from "../_components/Ticket";
import ticketService from "@/lib/api/ticket";

const page = () => {
  const [dataTickets, setDataTickets] = useState([]);
  const handleSearch = async () => {
    const newData = await ticketService.lookUpTicket("none");
    setDataTickets(newData.data);
  };
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      <Header />
      <div
        className="w-full flex flex-col justify-center text-center 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 my-[2rem]"
      >
        {dataTickets &&
          dataTickets.map((ticket, index) => (
            <Ticket key={index} data={ticket} handleCancel={handleSearch} />
          ))}
        {dataTickets.length === 0 && (
          <div className="min-h-[30rem] flex items-center justify-center">
            <p className="font-bold text-3xl">You don't have ticket</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default page;
