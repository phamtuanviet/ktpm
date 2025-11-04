import { Search } from "lucide-react";
import React from "react";

const TableSearch = () => {
  return (
    <div className="w-full md:w-auto flex  items-center rounded-full border-[1.5px] border-gray-300 px-2">
      <Search className="text-gray-300" />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
