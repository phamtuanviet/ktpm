import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FormMessage } from "@radix-ui/react-form";

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

const UpdateModal = ({ item, onClose, onSubmit, updateFormFields, type }) => {
  const [formValues, setFormValues] = useState(
    updateFormFields.reduce((acc, field) => {
      acc[field.name] = field.type === "file" ? null : item[field.name] ?? "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
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
          className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
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
              className="cursor-pointer hover:bg-red-500 p-1 hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {updateFormFields.map((field) => (
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
                    readOnly={!field.editable}
                    disabled={!field.editable}
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
                    disabled={!field.editable}
                    required={field.required}
                    className="mt-1 border rounded px-3 py-2"
                  />
                ) : field.type === "datetime-local" ? (
                  <input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    value={new Date(formValues[field.name])
                      .toISOString()
                      .slice(0, 16)}
                    onChange={handleChange}
                    required={field.required}
                    disabled={!field.editable}
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
            ))}

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
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateModal;
