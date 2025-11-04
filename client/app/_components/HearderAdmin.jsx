"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import Sidebar from "../_components/Sidebar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const HearderAdmin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("persist:root.auth");
    router.push("/");
  };
  return (
    <>
      <div className="fixed block md:hidden h-screen z-[21]">
        <Sidebar type="small" />
      </div>
      <div className="flex justify-end sticky top-0 w-full md:hidden border-b-2 border-b-gray-300 bg-white z-[20] py-2 pr-3 items-center shadow-md">
        <div className="flex gap-2 items-center ">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className={"w-[2.5rem] h-[2.5rem] overflow-hidden"}>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-[9999]">
              <DropdownMenuLabel className="font-bold text-1xl">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="font-medium text-1xl hover:bg-primary"
              >
                <LogOut />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default HearderAdmin;
