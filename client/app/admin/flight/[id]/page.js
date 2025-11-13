"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import { useParams } from "next/navigation";
import flightService from "@/lib/api/flight";
import Flight from "@/app/_components/Flight";

const page = () => {
  const { id } = useParams();
  const [currentId, setCurrentId] = useState(id);

  const [flight, setFlight] = useState(null);
  const fetchFlight = async () => {
    try {
      const res = await flightService.getFlightById(currentId);
      setFlight(res?.data.flight || null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setFlight(null);
    }
  };

  useEffect(() => {
    setCurrentId(id);
  }, [id]);
  useEffect(() => {
    fetchFlight();
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
          {flight && <Flight data={flight} />}
        </div>
      </div>
    </div>
  );
};

export default page;
