"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyPoint } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export function DailyChart({
  data,
  metric = "impressions",
}: {
  data: DailyPoint[];
  metric?: "impressions" | "clicks" | "spend";
}) {
  const label =
    metric === "impressions" ? "Impressions" : metric === "clicks" ? "Clics" : "Budget";
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="g-navy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#66FF99" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#66FF99" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(0,15,46,.08)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickFormatter={(d) => d.slice(5)}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickFormatter={(v) => formatNumber(Number(v))}
            width={60}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ stroke: "var(--navy)", strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{
              fontSize: 12,
              border: "1px solid var(--hairline-strong)",
              borderRadius: 8,
              boxShadow: "var(--shadow-card)",
              background: "white",
            }}
            labelStyle={{ color: "var(--muted)", fontWeight: 500 }}
            formatter={(v) => [formatNumber(Number(v)), label]}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke="var(--navy)"
            fill="url(#g-navy)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--green-600)", stroke: "var(--navy)", strokeWidth: 1.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
