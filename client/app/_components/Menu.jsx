"use client";
import { logoutUser } from "@/redux/features/authSlice";
import {
  House,
  LogOut,
  Newspaper,
  Plane,
  PlaneTakeoff,
  Settings,
  TicketsPlane,
  Timer,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  // Handle logout confirmation and action
  // This function will be called when the user clicks the logout link
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You will have to log in again!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUser());
        localStorage.removeItem("persist:root.auth");
        router.push("/");
        console.log("Đã logout");
      }
    });
  };
  return (
    <div className="mt-4 text-sm">
      <div className="flex flex-col gap-1">
        <span className="text-gray-400 font-medium my-4 pl-3">Menu</span>
        <Link
          href={"/admin"}
          className="flex items-center justify-start gap-3 pl-3 hover:bg-gray-200"
        >
          <House />
          <span className="font-medium my-4">Home</span>
        </Link>
        <Link
          href={"/admin/user"}
          className="flex items-center justify-start gap-3 pl-3 hover:bg-gray-200"
        >
          <User />
          <span className="font-medium my-4">Users</span>
        </Link>
        <Link
          href={"/admin/aircraft"}
          className="flex items-center justify-start gap-3 pl-3 hover:bg-gray-200"
        >
          <Plane />
          <span className="font-medium my-4">Aircrafts</span>
        </Link>
        <Link
          href={"/admin/flight"}
          className="flex items-center justify-start gap-3 pl-3 hover:bg-gray-200"
        >
          <PlaneTakeoff />
          <span className="font-medium my-4">Flights</span>
        </Link>
        <Link
          href={"/admin/ticket"}
          className="flex items-center justify-start gap-3 pl-3 hover:bg-gray-200"
        >
          <TicketsPlane />
          <span className="font-medium my-4">Tickets</span>
        </Link>
        <Link
          href={"/admin/news"}
          className="flex items-center justify-start gap-3 pl-3 hover:bg-gray-200"
        >
          <Newspaper />
          <span className="font-medium my-4">News</span>
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-gray-400 font-medium my-4 pl-3">Other</span>
        <Link
          href={"/admin"}
          className="flex items-center justify-start gap-3 pl-3 hover:bg-gray-200"
        >
          <Settings />
          <span className="font-medium my-4">Setting</span>
        </Link>
        <Link
          href={"/admin"}
          className="flex items-center justify-start gap-3 pl-3 hover:bg-gray-200"
          onClick={handleLogout}
        >
          <LogOut />
          <span className="font-medium my-4">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
