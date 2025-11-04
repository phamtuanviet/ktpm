// file: ExtendedUpdateModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toLocalDatetimeString } from "@/services/date";

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

const SEAT_CLASSES = ["ECONOMY", "BUSINESS", "FIRST_CLASS"];

const UpdateFlight = ({
  item,
  onClose,
  onSubmit,
  updateFormFields,
  type,
  searchAirportsByQuery,
  searchAircraftsByQuery,
}) => {
  const [formValues, setFormValues] = useState(() => {
    const base = updateFormFields.reduce((acc, field) => {
      if (field.name === "seats") {
        acc.seats = SEAT_CLASSES.map((cls) => {
          const existing = item.seats?.find((s) => s.seatClass === cls);
          return existing
            ? { ...existing }
            : { seatClass: cls, totalSeats: 0, price: 0 };
        });
      } else if (field.type === "aircraft" || field.type === "airport") {
        acc[field.name] = item[field.name].name;
      } else if (field.name === "departureTime") {
        acc[field.name] = item["estimatedDeparture"] || item["departureTime"];
      } else if (field.name === "arrivalTime") {
        acc[field.name] = item["estimatedArrival"] || item["arrivalTime"];
      } else {
        acc[field.name] = item[field.name] ?? "";
      }
      return acc;
    }, {});
    console.log(base);
    return base;
  });

  const [suggestions, setSuggestions] = useState({});

  // Để hủy request nếu có các request tiếp theo được gửi đi trong cùng một input gõ tránh quá nhiều request
  // hoặc trành trường hợp request về một lúc không theo thứ tự gây sai suggestion
  const abortControllers = useRef({});

  const handleAutocomplete = async (fieldName, value, searchFn) => {
    abortControllers.current[fieldName]?.abort();
    const ctrl = new AbortController();
    abortControllers.current[fieldName] = ctrl;
    try {
      const { data } = await searchFn(value, {
        signal: ctrl?.signal || undefined,
      });
      setSuggestions((s) => ({ ...s, [fieldName]: data }));
    } catch (err) {
      if (
        err?.name === "AbortError" ||
        err?.message?.includes("cancel") ||
        err == "canceled"
      ) {
        return;
      }
      console.error(err);
    }
  };

  const handleChange = (e, seatClass) => {
    const { name, type, value, files } = e.target;
    setFormValues((prev) => {
      const next = { ...prev };
      if (seatClass) {
        next.seats = prev.seats.map((s) =>
          s.seatClass === seatClass
            ? {
                ...s,
                [name]:
                  type === "file"
                    ? files[0]
                    : type === "number"
                    ? Number(value)
                    : value,
              }
            : s
        );
      } else {
        next[name] =
          type === "file"
            ? files[0]
            : type === "datetime-local"
            ? new Date(value)
            : value;
        const field = updateFormFields.find((f) => f.name === name);
        if (field?.type === "airport" && value) {
          handleAutocomplete(name, value, searchAirportsByQuery);
        }
        if (field?.type === "aircraft" && value) {
          handleAutocomplete(name, value, searchAircraftsByQuery);
        }
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[20] overflow-y-scroll"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl relative mt-50 "
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{`Update ${type}`}</h2>
            <button
              onClick={onClose}
              className="hover:bg-red-500 p-1 rounded-full"
            >
              <X className="w-5 h-5 text-gray-700 hover:text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {updateFormFields.map((field) => {
              if (field.name === "seats") {
                return (
                  <div key="seats" className="space-y-2 border p-4 rounded">
                    <h3 className="font-medium">Seats configuration</h3>
                    {formValues.seats.map((s) => (
                      <div
                        key={s.seatClass}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-1/4 text-sm font-medium">
                          {s.seatClass}
                        </div>
                        <div className="w-1/3">
                          <label className="block text-xs">Total Seats</label>
                          <input
                            name="totalSeats"
                            type="number"
                            value={s.totalSeats}
                            onChange={(e) => handleChange(e, s.seatClass)}
                            className="mt-1 w-full border rounded px-2 py-1"
                          />
                        </div>
                        <div className="w-1/3">
                          <label className="block text-xs">Price</label>
                          <input
                            name="price"
                            type="number"
                            step="0.01"
                            value={s.price}
                            onChange={(e) => handleChange(e, s.seatClass)}
                            className="mt-1 w-full border rounded px-2 py-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              if (field.type === "airport" || field.type === "aircraft") {
                const list = suggestions[field.name] || [];
                return (
                  <div key={field.name} className="relative">
                    <label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={formValues[field.name]}
                      onChange={handleChange}
                      disabled={!field.editable}
                      className="mt-1 w-full border rounded px-3 py-2"
                      placeholder={`Search ${field.label}…`}
                      autoComplete="off"
                      required={field.required}
                    />
                    {list.length > 0 && (
                      <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto mt-1 rounded">
                        {list.map((opt, i) => (
                          <li
                            key={i}
                            onClick={() => {
                              setFormValues((prev) => ({
                                ...prev,
                                [field.name]: opt.name,
                              }));
                              setSuggestions((s) => ({
                                ...s,
                                [field.name]: [],
                              }));
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {opt.name} {opt.code ? `(${opt.code})` : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              return (
                <div key={field.name} className="flex flex-col">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formValues[field.name]}
                      onChange={handleChange}
                      disabled={!field.editable}
                      required={field.required}
                      className="mt-1 border-rounded px-3 py-2"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formValues[field.name]}
                      onChange={handleChange}
                      readOnly={!field.editable}
                      disabled={!field.editable}
                      required={field.required}
                      rows={field.rows}
                      className="mt-1 border-rounded px-3 py-2"
                    />
                  ) : field.type === "file" ? (
                    <input
                      id={field.name}
                      name={field.name}
                      type="file"
                      onChange={handleChange}
                      disabled={!field.editable}
                      required={field.required}
                      className="mt-1 border rounded px-3 py-2"
                    />
                  ) : field.type === "datetime-local" ? (
                    <input
                      id={field.name}
                      name={field.name}
                      type="datetime-local"
                      value={toLocalDatetimeString(
                        formValues[field.name] || field.default
                      )}
                      onChange={handleChange}
                      disabled={!field.editable}
                      required={field.required}
                      className="mt-1 border rounded px-3 py-2"
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formValues[field.name]}
                      onChange={handleChange}
                      readOnly={!field.editable}
                      disabled={!field.editable}
                      required={field.required}
                      className="mt-1 border rounded px-3 py-2"
                    />
                  )}
                </div>
              );
            })}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default UpdateFlight;
