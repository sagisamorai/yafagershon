"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartProps {
  data: { date: string; views: number }[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-stone-500 text-center py-8">אין נתונים להצגה</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a8a29e" />
          <YAxis tick={{ fontSize: 11 }} stroke="#a8a29e" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e7e5e4",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelFormatter={(v) => `תאריך: ${v}`}
            formatter={(v) => [`${v} צפיות`, "צפיות"]}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#d97706"
            fill="#fef3c7"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
