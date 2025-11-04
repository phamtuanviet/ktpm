"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { LogOut, UserRoundPen } from "lucide-react";
import { logoutUser } from "@/redux/features/authSlice";
import Swal from "sweetalert2";

// QAirline
const Header = () => {
  const path = usePathname();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogin = () => {
    // Điều hướng đến trang /auth với isLogin=true (đăng nhập)
    router.push("/auth?isLogin=true");
  };

  const handleRegister = () => {
    // Điều hướng đến trang /auth với isLogin=false (đăng ký)
    router.push("/auth?isLogin=false");
  };

  const handleChangePassword = () => {
    router.push("/auth/forget-password?type=new-password");
  };
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
    <div className="flex flex-col w-full">
      <div className="flex p-6 justify-between shadow-sm sticky top-0 w-full z-[999] bg-white px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mx-auto">
        <Link href={"/"}>
          <div className="flex gap-1 items-center cursor-pointer font-bold">
            <Image alt="logo" width={70} height={70} src={"/images/logo.png"} />
            <p className="text-[1.5rem] text-primary">QAirLine</p>
          </div>
        </Link>
        <div className="flex items-center">
          <ul className="hidden md:flex gap-10 items-center">
            <Link href={"/"}>
              <li
                className={`hover:text-primary font-medium text-[1.25rem] cursor-pointer `}
              >
                Home
              </li>
            </Link>

            <Link href={"/look-up"}>
              <li
                className={`hover:text-primary font-medium text-[1.25rem] cursor-pointer`}
              >
                Look Up
              </li>
            </Link>
            {user && user?.isAccountVerified && (
              <Link href={"/your-flight"}>
                <li
                  className={`hover:text-primary font-medium text-[1.25rem] cursor-pointer`}
                >
                  Your Flight
                </li>
              </Link>
            )}
            <Link href={"/news"}>
              <li
                className={`hover:text-primary font-medium text-[1.25rem] cursor-pointer`}
              >
                News
              </li>
            </Link>
          </ul>
        </div>
        {(!user?.isAccountVerified || !user) && (
          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={handleLogin}>
              Sign in
            </Button>
            <Button variant="outline" onClick={handleRegister}>
              Sign up
            </Button>
          </div>
        )}
        {user?.isAccountVerified && (
          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className={"w-[4rem] h-[4rem]"}>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[999]">
                <DropdownMenuLabel className="font-bold text-1xl">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleChangePassword}
                  className="font-medium text-1xl hover:bg-primary"
                >
                  <UserRoundPen />
                  <span>Change Password</span>
                </DropdownMenuItem>
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
        )}
      </div>
      <div className="flex md:hidden flex-row items-center justify-center shadow-sm p-4">
        <ul className="gap-5 flex flex-row items-center justify-center">
          <Link href={"/"}>
            <li
              className={`hover:text-primary font-medium text-[1.25rem] cursor-pointer `}
            >
              Home
            </li>
          </Link>

          <Link href={"/look-up"}>
            <li
              className={`hover:text-primary font-medium text-[1.25rem] cursor-pointer`}
            >
              Look Up
            </li>
          </Link>
          {user && user?.isAccountVerified && (
            <Link href={"/your-flight"}>
              <li
                className={`hover:text-primary font-medium text-[1.25rem] cursor-pointer`}
              >
                Your Flight
              </li>
            </Link>
          )}
          <Link href={"/news"}>
            <li
              className={`hover:text-primary font-medium text-[1.25rem] cursor-pointer`}
            >
              News
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};
export default Header;
