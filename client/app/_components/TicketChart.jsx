"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// const fakeData = [
//   { date: "6/5/2025", booked: 3, cancelled: 1 },
//   { date: "7/5/2025", booked: 5, cancelled: 0 },
//   { date: "8/5/2025", booked: 2, cancelled: 2 },
//   { date: "9/5/2025", booked: 6, cancelled: 1 },
//   { date: "10/5/2025", booked: 4, cancelled: 0 },
//   { date: "11/5/2025", booked: 7, cancelled: 1 },
//   { date: "12/5/2025", booked: 1, cancelled: 0 },
// ];

export default function TicketLineChart( { data} ) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={Array.isArray(data) ? data : []}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 16 }} dy={10} />
        <YAxis allowDecimals={false} tick={{ fontSize: 16 }} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="booked"
          name="Booked Tickets"
          stroke="#228be6"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="cancelled"
          name="Cancelled Tickets"
          stroke="#EF4444"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
