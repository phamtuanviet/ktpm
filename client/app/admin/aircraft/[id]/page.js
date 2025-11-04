"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import { useParams } from "next/navigation";
import aircraftService from "@/lib/api/aircraft";
import FlightAircraft from "@/app/_components/FlightAircraft";
const page = () => {
  const { id } = useParams();
  const [currentId, setCurrentId] = useState(id);

  const [aircraft, setAircraft] = useState(null);
  const fetchAircraft = async () => {
    try {
      const res = await aircraftService.getAircraftById(currentId);
      setAircraft(res?.data || null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setAircraft(null);
    }
  };

  useEffect(() => {
    setCurrentId(id);
  }, [id]);
  useEffect(() => {
    fetchAircraft();
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
          {aircraft && (
            <div className="w-full max-w-[50rem] flex flex-col justify-center items-center font-medium gap-2 ">
              <p className="font-bold text-2xl text-primary">
                Aircraft data description
              </p>
              <div className="w-full flex flex-col gap-2 font-sans text-start">
                <p className="text-xl">
                  ID:{" "}
                  <span className="font-bold text-[1.5xl]">{aircraft?.id}</span>
                </p>
                <p className="text-xl">
                  Name:{" "}
                  <span className="font-bold text-[1.5xl]">
                    {aircraft?.name}
                  </span>
                </p>
                <p className="text-xl">
                  Manufacturer:{" "}
                  <span className="font-bold text-[1.5xl]">
                    {aircraft?.manufacturer}
                  </span>
                </p>
              </div>
              <div className="flex flex-col w-full gap-2">
                {aircraft.flights.length > 0 &&
                  aircraft.flights.map((t) => (
                    <FlightAircraft key={t.id} data={t} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
