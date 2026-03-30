"use client";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesPoint {
  name: string;
  [currency: string]: string | number;
}

interface AnalyticsPoint {
  name: string;
  value: number;
  color: string;
}

interface DashboardChartsProps {
  salesData: SalesPoint[];
  salesCurrencies: string[];
  analyticsData: AnalyticsPoint[];
}

export function DashboardCharts({
  salesData,
  salesCurrencies,
  analyticsData,
}: DashboardChartsProps) {
  const totalAnalytics = analyticsData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const SALES_COLORS = ["#4f46e5", "#0f766e", "#dc2626", "#a16207", "#7c3aed"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/70">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Sales Trend</h3>
          <p className="text-xs text-slate-500 mt-1">
            Monthly paid revenue split by currency (no cross-currency mixing)
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, key) => [
                  `${Number(value).toLocaleString()}`,
                  `${String(key)} revenue`,
                ]}
                contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
              />
              {salesCurrencies.map((currency, index) => (
                <Line
                  key={currency}
                  type="monotone"
                  dataKey={currency}
                  stroke={SALES_COLORS[index % SALES_COLORS.length]}
                  strokeWidth={2}
                  dot={{
                    fill: SALES_COLORS[index % SALES_COLORS.length],
                    r: 3,
                  }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-4">
          {salesCurrencies.map((currency, index) => (
            <div key={currency} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: SALES_COLORS[index % SALES_COLORS.length],
                }}
              />
              <span className="text-sm text-slate-600">{currency}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/70">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Order Mix</h3>
          <p className="text-xs text-slate-500 mt-1">
            Distribution of completed, pending, and cancelled orders
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {analyticsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-4">
          {analyticsData.map((entry) => {
            const percentage = totalAnalytics
              ? Math.round((entry.value / totalAnalytics) * 100)
              : 0;
            return (
              <div key={entry.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-600">
                  {entry.name} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
