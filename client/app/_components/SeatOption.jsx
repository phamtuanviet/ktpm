import { Armchair, Briefcase, Crown } from "lucide-react";
import React from "react";

// Configuration for seat options
const seatConfig = {
  ECONOMY: {
    label: "Economy",
    icon: <Crown />,
    bg: "bg-[#D1D5DB] hover:bg-[#BCC0C5]",
  },
  BUSINESS: {
    label: "Business",
    icon: <Briefcase />,
    bg: "bg-[#93C5FD] hover:bg-[#84B1E4]",
  },
  FIRST_CLASS: {
    label: "First Class",
    icon: <Armchair />,
    bg: "bg-[#FDE68A] hover:bg-[#E4CF7C]",
  },
};

// SeatOption component to display seat options
export const SeatOption = ({ seat }) => {
  const cfg = seatConfig[seat.seatClass] || {};
  return (
    <div
      className={`
        flex-1 flex flex-col cursor-pointer 
        ${cfg.bg} transition-colors duration-200 
        gap-2 py-2 justify-center items-center text-white
      `}
    >
      <div className="flex items-center gap-1">
        {cfg.icon}
        <span className="font-semibold">{cfg.label}</span>
      </div>
      <p className="text-center">Price: {seat.price} USD</p>
    </div>
  );
};


