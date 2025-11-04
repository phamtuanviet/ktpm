import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

// SortModal component for sorting items used in admin pages
const SortModal = ({ onClose, onSubmit, sortFormFields, type,sortBy,sortOrder }) => {
  const [selectSort, setSelectSort] = useState(sortBy);
  const [selectOrder, setSelectOrder] = useState(sortOrder);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      sortBy: selectSort,
      sortOrder: selectOrder,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sortSelect") {
      setSelectSort(value);
    } else if (name === "orderSelect") {
      setSelectOrder(value);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[20]"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{`Sort ${type}`}</h2>
            <button
              onClick={onClose}
              className="cursor-pointer hover:bg-red-500 p-1 hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Field selection */}
              <div className="flex flex-col">
                <label
                  htmlFor="sortSelect"
                  className="text-sm font-medium mb-1"
                >
                  Sort by
                </label>
                <select
                  name="sortSelect"
                  value={selectSort}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                >
                  {sortFormFields.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order selection */}
              <div className="flex flex-col">
                <label
                  htmlFor="orderSelect"
                  className="text-sm font-medium mb-1"
                >
                  Sort order
                </label>
                <select
                  name="orderSelect"
                  value={selectOrder}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white cursor-pointer"
              >
                Apply Sort
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SortModal;
