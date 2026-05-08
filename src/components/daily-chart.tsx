"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyPoint } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export function DailyChart({ data, metric = "impressions" }: { data: DailyPoint[]; metric?: "impressions" | "clicks" | "spend" }) {
  const label = metric === "impressions" ? "Impressions" : metric === "clicks" ? "Clics" : "Budget";
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#111" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f5f5f5" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#737373" }} tickFormatter={(d) => d.slice(5)} />
          <YAxis tick={{ fontSize: 11, fill: "#737373" }} tickFormatter={(v) => formatNumber(Number(v))} width={60} />
          <Tooltip
            contentStyle={{ fontSize: 12, border: "1px solid #e5e5e5", borderRadius: 8 }}
            formatter={(v) => [formatNumber(Number(v)), label]}
          />
          <Area type="monotone" dataKey={metric} stroke="#111" fill="url(#g1)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
