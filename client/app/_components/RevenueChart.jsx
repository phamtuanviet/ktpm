"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const fakeData = [
//   { date: "2025-05-05", value: 3500 },
//   { date: "2025-05-06", value: 2200 },
//   { date: "2025-05-07", value: 4700 },
//   { date: "2025-05-08", value: 1800 },
//   { date: "2025-05-09", value: 2600 },
//   { date: "2025-05-10", value: 3100 },
//   { date: "2025-05-11", value: 5200 },
// ];


export default function RevenueChart({ data }) {
  return (
    <div className="mt-10 bg-white dark:bg-gray-dark rounded-[10px] p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-dark dark:text-white">
        Revenue 
      </h2>

      <ResponsiveContainer width="100%" height={600}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(v) => `$${v}`} domain={[0, "dataMax + 1000"]} />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="total" fill="#228be6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

    </div>
  );
}
