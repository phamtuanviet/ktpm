import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

// Variants for the backdrop and modal animations
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

const PriceDetail = ({ totalPriceChildren, totalPriceAdults, onClose}) => {
  const totalPrice = totalPriceAdults + totalPriceChildren;
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{`Price details`}</h2>
            <button
              onClick={onClose}
              className="cursor-pointer hover:bg-red-500 p-1 hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="">{`Total price`}</p>
            <p>{`${totalPrice} $`}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <p className="">{`Total adult price`}</p>
              <p>{`${totalPriceAdults} $`}</p>
            </div>
            {totalPriceChildren !== 0 ? (
              <div className="border-t-2 pt-4 flex justify-between items-center mb-4">
                <p className="">{`Total children price`}</p>
                <p>{`${totalPriceChildren} $`}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex justify-end mb-4">
            <button
              className="p-2 bg-red-300 text-white rounded-lg  hover:bg-red-500 cursor-pointer "
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PriceDetail;
