import { Check, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div
      className="w-full flex flex-col items-center justify-center text-center 
px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-[2rem] gap-[2rem] pb-[1rem] z-0 bg-gray-500"
    >
      <div className="border-b-2 border-b-gray-800 w-full flex flex-col sm:flex-row justify-between pb-10">
        <div className="flex flex-col gap-4 items-center flex-1">
          <p className="text-white text-lg font-semibold"> Our Commitments</p>
          <ul className="list-none">
            <li className="text-sm font-medium text-white flex gap-4 items-start">
              <Check className="text-green-400 w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]" />
              <p className="text-start">
                Best Price Guarantee: We offer the most competitive prices on
                flights worldwide.
              </p>
            </li>
            <li className="text-sm font-medium text-white flex gap-4 items-start">
              <Check className="text-green-400 w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]" />
              <p className="text-start">
                24/7 Customer Support: Our team is available around the clock to
                assist you with your booking needs.
              </p>
            </li>
            <li className="text-sm font-medium text-white flex gap-4 items-start">
              <Check className="text-green-400 w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]" />
              <p className="text-start">
                Safe and Secure Transactions: Your personal and payment
                information is protected with the highest level of security.
              </p>
            </li>
            <li className="text-sm font-medium text-white flex gap-4 items-start">
              <Check className="text-green-400 w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]" />
              <p className="text-start">
                Easy Booking Process: Book your flights quickly and efficiently
                with just a few clicks.
              </p>
            </li>
            <li className="text-sm font-medium text-white flex gap-4 items-start">
              <Check className="text-green-400 w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]" />
              <p className="text-start">
                Transparent Pricing: No hidden fees — the price you see is the
                price you pay.
              </p>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-4 items-center flex-1">
            <p className="text-white text-lg font-semibold">Contact</p>
            <ul className="list-none space-y-5 start w-full">
              <li className="text-sm font-medium text-white flex gap-4 items-start">
                <Phone className="text-black w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]" />
                <p className="text-start">0984586064</p>
              </li>
              <li className="text-sm font-medium text-white flex gap-4 items-start">
                <img
                  src="/svg/google.svg"
                  className="w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]"
                />
                <p href="23020172@vnu.edu.vn" className="text-start">23020172@vnu.edu.vn</p>
              </li>
              <li className="text-sm font-medium text-white flex gap-4 items-start">
                <img
                  src="/svg/facebook.svg"
                  className="text-blue w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]"
                />
                <Link href="https://www.facebook.com/pham.viet.42049" target="_blank" className="text-start">
                  https://www.facebook.com/pham.viet.42049
                </Link>
              </li>
              <li className="text-sm font-medium text-white flex gap-4 items-start">
                <img
                  src="/svg/github.svg"
                  className=" w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]"
                />
                <Link href="https://github.com/phamtuanviet" target="_blank" className="text-start">https://github.com/phamtuanviet</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-white p-0 m-0">
        @Product is created by Int3306 2025(UET VNU){" "}
      </div>
    </div>
  );
};

export default Footer;
