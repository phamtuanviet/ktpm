"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import { useParams } from "next/navigation";
import ticketService from "@/lib/api/ticket";
import Ticket from "@/app/_components/Ticket";
import TicketDes from "@/app/_components/TicketDes";
const page = () => {
  const { id } = useParams();
  const [currentId, setCurrentId] = useState(id);

  const [ticket, setTicket] = useState(null);
  const fetchTicket = async () => {
    try {
      const res = await ticketService.getTicketById(currentId);
      setTicket(res?.data || null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setTicket(null);
    }
  };

  useEffect(() => {
    setCurrentId(id);
  }, [id]);
  useEffect(() => {
    fetchTicket();
  }, [currentId]);
  useEffect(() => {
    setCurrentId(id);
  }, [id]);
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar type="big" />
      <div className="flex-1">
        <HearderAdmin />
        <div className="p-5 flex flex-col items-center justify-between">
          {ticket && (
            <div className="w-full max-w-[50rem] flex flex-col justify-center items-center font-medium gap-2 ">
              <TicketDes data={ticket} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
