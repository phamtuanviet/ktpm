import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// Variants for framer-motion animations
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 50, opacity: 0 },
};

// Options for time ranges
const options = [
  {
    label: "00:00 - 02:59",
    value: JSON.stringify({ start: "00:00:00", end: "02:59:59" }),
  },
  {
    label: "03:00 - 05:59",
    value: JSON.stringify({ start: "03:00:00", end: "05:59:59" }),
  },
  {
    label: "06:00 - 08:59",
    value: JSON.stringify({ start: "06:00:00", end: "08:59:59" }),
  },
  {
    label: "09:00 - 11:59",
    value: JSON.stringify({ start: "09:00:00", end: "11:59:59" }),
  },
  {
    label: "12:00 - 14:59",
    value: JSON.stringify({ start: "12:00:00", end: "14:59:59" }),
  },
  {
    label: "15:00 - 17:59",
    value: JSON.stringify({ start: "15:00:00", end: "17:59:59" }),
  },
  {
    label: "18:00 - 20:59",
    value: JSON.stringify({ start: "18:00:00", end: "20:59:59" }),
  },
  {
    label: "21:00 - 23:59",
    value: JSON.stringify({ start: "21:00:00", end: "23:59:59" }),
  },
];

// FilterFlight component for filtering flights used by the admin
const FilterFlight = ({ onClose, onSubmit }) => {
  const [timeRange, setTimeRange] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(timeRange);
    onClose();
  };
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[9999] overflow-y-scroll w-screen h-screen"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl relative "
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filter flight</h2>
              <button
                onClick={onClose}
                className="cursor-pointer hover:bg-red-500 p-1 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="timeRange" className="">
                Departure Time
              </label>
              <select
                id="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className=""
              >
                <option value="">All</option>

                {options.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mb-4">
              <button
                className="p-2 bg-red-300 text-white rounded-lg  hover:bg-red-500 cursor-pointer font-medium"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="p-2 bg-blue-300 text-white rounded-lg  hover:bg-blue-500 cursor-pointer font-medium"
                type="submit"
              >
                Confirm
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterFlight;
