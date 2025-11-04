"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import { useParams } from "next/navigation";
import userService from "@/lib/api/user";
import TicketUser from "@/app/_components/TicketUser";
const page = () => {
  const { id } = useParams();
  const [currentId, setCurrentId] = useState(id);
  const [user, setUser] = useState(null);
  const fetchUser = async () => {
    try {
      const res = await userService.getUserById(currentId);
      setUser(res?.userData || null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setUser(null);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [currentId]);
  useEffect(() => {
    setCurrentId(id);
  }, [id]);
  console.log(user);
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar type="big" />
      <div className="flex-1">
        <HearderAdmin />
        <div className="p-5 flex flex-col items-center justify-between">
          {user && (
            <div className="w-full max-w-[50rem] flex flex-col justify-center items-center font-medium gap-2 ">
              <p className="font-bold text-2xl text-primary">
                User data description
              </p>
              <div className="w-full flex flex-col gap-2 font-sans text-start">
                <p className="text-xl">
                  ID: <span className="font-bold text-[1.5xl]">{user?.id}</span>
                </p>
                <p className="text-xl">
                  Name:{" "}
                  <span className="font-bold text-[1.5xl]">{user?.name}</span>
                </p>
                <p className="text-xl">
                  Email:{" "}
                  <span className="font-bold text-[1.5xl]">{user?.email}</span>
                </p>
                <p className="text-xl">
                  Role:{" "}
                  <span className="font-bold text-[1.5xl]">{user?.role}</span>
                </p>
              </div>
              <div className="flex flex-col w-full ">
                {user.tickets.length > 0 &&
                  user.tickets.map((t) => <TicketUser key={t.id} data={t} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
