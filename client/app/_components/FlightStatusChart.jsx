"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   { name: "Scheduled", value: 25 },
//   { name: "Delayed", value: 10 },
//   { name: "Departed", value: 8 },
//   { name: "Arrived", value: 12 },
//   { name: "Cancelled", value: 0 },
// ];

const COLORS = ["#228be6", "#F59E0B", "#10B981", "#6366F1", "#EF4444"];

export default function FlightStatusChart({ data }) {
  // const total = data.reduce((sum, d) => sum + d.value, 0);
  const validData = (Array.isArray(data) ? data : []).filter(item => item.value > 0);


  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          // data={Array.isArray(data) ? data : []}
          data={validData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          paddingAngle={2}
        >
          {(Array.isArray(data) ? data : []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} flights`, name]}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ marginTop: 24 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
