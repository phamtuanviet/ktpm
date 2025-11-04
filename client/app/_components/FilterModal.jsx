"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

const FilterModal = ({
  fields,
  onClose,
  type,
  option = {
    searchAirportsByQuery: null,
    searchAircraftsByQuery: null,
    searchFlightsByQuery: null,
  },
}) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedFields, setSelectedFields] = useState([]);
  // Initialize filter values based on fields
  const [filterValues, setFilterValues] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {})
  );
  const [suggestions, setSuggestions] = useState({});
  
  // Abort controllers to handle autocomplete requests
  // This allows us to cancel previous requests when a new one is made
  const abortControllers = useRef({});
  const {
    searchAirportsByQuery,
    searchAircraftsByQuery,
    searchFlightsByQuery,
  } = option;

  const handleSelectField = (fieldName) => {
    setSelectedFields((prev) =>
      prev.includes(fieldName)
        ? prev.filter((f) => f !== fieldName)
        : [...prev, fieldName]
    );
  };

  // Handle value changes for inputs, including autocomplete fields
  const handleValueChange = (e) => {
    const { name, type, value, files } = e.target;

    setFilterValues((prev) => {
      const next = { ...prev };
      next[name] = type === "file" ? files[0] : value; //type === "date" ? new Date(value)
      const field = fields.find((f) => f.name === name);
      if (field?.type === "airport" && value) {
        handleAutocomplete(name, value, searchAirportsByQuery);
      }
      if (field?.type === "aircraft" && value) {
        handleAutocomplete(name, value, searchAircraftsByQuery);
      }
      if (field?.type === "flightNumber" && value) {
        handleAutocomplete(name, value, searchFlightsByQuery);
      }
      return next;
    });
  };

  const handleAutocomplete = async (fieldName, value, searchFn) => {
    abortControllers.current[fieldName]?.abort();
    const ctrl = new AbortController();
    abortControllers.current[fieldName] = ctrl;
    try {
      const res = await searchFn(value, {
        signal: ctrl?.signal || undefined,
      });
      const data = res?.data || [];
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

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    selectedFields.forEach((fieldName) => {
      const value = filterValues[fieldName];
      if (value !== undefined && value !== "") {
        queryParams.append(fieldName, value);
      }
    });
    router.push(`/admin/${type}/filter?${queryParams.toString()}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[20]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {step === 1 ? "Select filter field" : "Enter filter value"}
            </h2>
            <button
              onClick={onClose}
              className="hover:bg-red-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 1 ? (
            <div className="space-y-3">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    selectedFields.includes(field.name)
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                  onClick={() => handleSelectField(field.name)}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.name)}
                      className="form-checkbox h-4 w-4"
                      readOnly
                    />
                    <span className="text-sm">{field.label}</span>
                  </label>
                </div>
              ))}

              <button
                onClick={() => setStep(2)}
                disabled={selectedFields.length === 0}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Continue ({selectedFields.length} field selected)
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => handleApplyFilters(e)} className="space-y-4">
              {fields
                .filter((field) => selectedFields.includes(field.name))
                .map((field) => {
                  if (
                    field.type === "airport" ||
                    field.type === "aircraft" ||
                    field.type === "flightNumber"
                  ) {
                    const list = suggestions[field.name] || [];
                    return (
                      <div key={field.name} className="relative">
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium mb-1"
                        >
                          {field.label}
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={filterValues[field.name]}
                          onChange={(e) => handleValueChange(e)}
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
                                  setFilterValues((prev) => ({
                                    ...prev,
                                    [field.name]: opt?.name || opt.flightNumber,
                                  }));
                                  setSuggestions((s) => ({
                                    ...s,
                                    [field.name]: [],
                                  }));
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                                {opt?.name || opt.flightNumber}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div key={field.name} className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                          {field.label}
                        </label>

                        {field.type === "select" ? (
                          <select
                            className="border rounded px-3 py-2"
                            name={field.name}
                            value={filterValues[field.name]}
                            onChange={(e) => handleValueChange(e)}
                            required
                          >
                            {field.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "date" ? (
                          <input
                            type={field.type}
                            name={field.name}
                            className="border rounded px-3 py-2"
                            value={filterValues[field.name]}
                            onChange={(e) => handleValueChange(e)}
                            required
                          />
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            className="border rounded px-3 py-2"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={filterValues[field.name] || ""}
                            onChange={(e) => handleValueChange(e)}
                            required
                          />
                        )}
                      </div>
                    );
                  }
                })}

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="p-2 text-gray-600 rounded-full hover:text-white hover:bg-[#2c2c2c] cursor-pointer"
                >
                  <ArrowLeft className="h-5" />
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                >
                  Apply filter
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default FilterModal;
