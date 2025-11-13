import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toLocalDatetimeString } from "@/services/date";

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

const CreateModal = ({
  onClose,
  onSubmit,
  createFormFields,
  type,
  option = { searchFlightsByQuery: null },
}) => {
  const { searchFlightsByQuery } = option;
  const [suggestions, setSuggestions] = useState({});
  const abortControllers = useRef({});
  const [formValues, setFormValues] = useState(() =>
    createFormFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {})
  );

  // Function to handle autocomplete suggestions
  const handleAutocomplete = async (fieldName, value, searchFn) => {
    abortControllers.current[fieldName]?.abort();
    const ctrl = new AbortController();
    abortControllers.current[fieldName] = ctrl;
    try {
      const result = await searchFn(value, {
        signal: ctrl?.signal || undefined,
      });

      if (!result) {
        return;
      }
      const { data } = result;
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

  // Function to handle changes in form fields
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormValues((prev) => {
      const next = { ...prev };
      next[name] =
        type === "file"
          ? files[0]
          : type === "datetime-local"
          ? new Date(value)
          : value;

      const field = createFormFields.find((f) => f.name === name);
      if (field?.type === "flightNumber" && value) {
        handleAutocomplete(name, value, searchFlightsByQuery);
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
            <h2 className="text-xl font-semibold">{`Create ${type}`}</h2>
            <button
              onClick={onClose}
              className="cursor-pointer hover:bg-red-500 p-1 hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {createFormFields.map((field) => {
              if (field.type === "flightNumber") {
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
                      value={formValues[field.name]}
                      onChange={(e) => handleChange(e)}
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
                                [field.name]: opt.flightNumber,
                              }));
                              setSuggestions((s) => ({
                                ...s,
                                [field.name]: [],
                              }));
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {opt.flightNumber}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              } else {
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
                        required={field.required}
                        className="mt-1 border rounded px-3 py-2"
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
                        required={field.required}
                        rows={field.rows}
                        className="mt-1 border rounded px-3 py-2"
                      />
                    ) : field.type === "file" ? (
                      <input
                        id={field.name}
                        name={field.name}
                        type="file"
                        onChange={handleChange}
                        required={field.required}
                        className="mt-1 border rounded px-3 py-2"
                      />
                    ) : field.type === "datetime-local" ? (
                      <input
                        id={field.name}
                        name={field.name}
                        type="datetime-local"
                        value={toLocalDatetimeString(formValues[field.name])}
                        onChange={handleChange}
                        required={field.required}
                        className="mt-1 border rounded px-3 py-2"
                      />
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        onChange={handleChange}
                        required={field.required}
                        className="mt-1 border rounded px-3 py-2"
                      />
                    )}
                  </div>
                );
              }
            })}

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
                Create
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateModal;
