"use client";
import React, { use, useEffect, useState } from "react";
import Sidebar from "../_components/Sidebar";
import HearderAdmin from "../_components/HearderAdmin";

import Card from "@/app/_components/Card";
import RevenueChart from "@/app/_components/RevenueChart";
import FlightStatusChart from "@/app/_components/FlightStatusChart";
import TicketChart from "@/app/_components/TicketChart";

import userService from "@/lib/api/user";
import aircraftService from "@/lib/api/aircraft";
import flightService from "@/lib/api/flight";
// import ticketService from "@/lib/api/ticket";
import newsService from "@/lib/api/news";
import revenueService from "@/lib/api/revenue";

import { UserIcon, Plane, PlaneTakeoff, Newspaper } from "lucide-react";
import ticketService from "@/lib/api/ticket";

const page = () => {
  const [count, setCount] = useState({
    users: 0,
    aircrafts: 0,
    flights: 0,
    news: 0,
  });

  const [revenue, setRevenue] = useState([]);
  const [flightStatus, setFlightStatus] = useState([]);
  const [ticketStats, setTicketStats] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const users = await userService.countUsers();
        const aircrafts = await aircraftService.countAircrafts();
        const flights = await flightService.countFlights();
        const news = await newsService.countNews();

        setCount({
          users: users.data.count,
          aircrafts: aircrafts.count,
          flights: flights.data.count,
          news: news.count,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const revenueData = await ticketService.getRevenue();

        setRevenue(revenueData.data.result);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };

    fetchRevenue();
  }, []);

  useEffect(() => {
    const fetchFlightStatus = async () => {
      try {
        const res = await flightService.countStatus();

        const formatted = (res.data.count || []).map((item) => ({
          name: item.status,
          value: item.count,
        }));

        setFlightStatus(formatted);
      } catch (error) {
        console.error("Error fetching flight status:", error);
      }
    };

    fetchFlightStatus();
  }, []);

  useEffect(() => {
    const fetchTicketStats = async () => {
      try {
        const res = await ticketService.countTicketStats();
        setTicketStats(res.data.data);
      } catch (error) {
        console.error("Error fetching ticket stats:", error);
      }
    };

    fetchTicketStats();
  }, []);

  return (
    <div className="min-h-screen w-full flex">
      <div>
        <Sidebar type="big" />
      </div>
      <div className="flex-1">
        <HearderAdmin />

        {/* edit here */}
        <div className="flex flex-col p-5 items-center justify-between">
          {/* 4 cards */}
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:gap-6 2xl:gap-7.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <Card
                title="Users"
                value={count.users}
                icon={UserIcon}
                color="text-indigo-600"
              />
              <Card
                title="Aircrafts"
                value={count.aircrafts}
                icon={Plane}
                color="text-sky-600"
              />
              <Card
                title="Flights"
                value={count.flights}
                icon={PlaneTakeoff}
                color="text-orange-600 dark:text-orange-400"
              />
              <Card
                title="News"
                value={count.news}
                icon={Newspaper}
                color="text-rose-600 dark:text-rose-400"
              />
            </div>
          </div>

          {/* 30% left 70% right */}
          <div className="mt-8 w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Pie Chart (Flight status) */}
              <div className="w-full lg:w-1/3 bg-white dark:bg-gray-dark rounded-[10px] p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-dark dark:text-white">
                  Flight Status
                </h2>
                {/* TODO: <FlightStatusChart data={...} /> */}
                <FlightStatusChart data={flightStatus} />
              </div>

              {/* Line Chart (Tickets stats) */}
              <div className="w-full lg:w-2/3 bg-white dark:bg-gray-dark rounded-[10px] p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-dark dark:text-white">
                  Tickets Stats
                </h2>
                {/* TODO: <TicketChart data={...} /> */}
                <TicketChart data={ticketStats} />
              </div>
            </div>
          </div>

          {/* revenue chart */}
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <RevenueChart data={revenue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
