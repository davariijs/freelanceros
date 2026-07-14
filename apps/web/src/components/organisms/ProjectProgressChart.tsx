"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface ProjectProgressChartProps {
  completed: number;
  total: number;
  className?: string;
}

export const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({
  completed,
  total,
  className,
}) => {
  const { t, locale, theme } = useApp();
  const isRtl = locale === "fa";
  const isDark = theme === "dark";

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = React.useMemo(() => {
    return [
      { name: isRtl ? "شنبه" : "Mon", progress: Math.max(0, percent - 12) },
      { name: isRtl ? "یکشنبه" : "Tue", progress: Math.max(0, percent - 4) },
      { name: isRtl ? "دوشنبه" : "Wed", progress: Math.max(0, percent - 8) },
      { name: isRtl ? "سه‌شنبه" : "Thu", progress: Math.max(0, percent + 2) },
      { name: isRtl ? "چهارشنبه" : "Fri", progress: Math.max(0, percent - 2) },
      { name: isRtl ? "پنجشنبه" : "Sat", progress: Math.max(0, percent + 6) },
      { name: isRtl ? "جمعه" : "Sun", progress: percent },
    ];
  }, [percent, isRtl]);

  const tooltipBg = isDark
    ? "rgba(9, 9, 14, 0.95)"
    : "rgba(255, 255, 255, 0.95)";
  const tooltipBorder = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.08)";
  const tooltipText = isDark ? "#ffffff" : "#111111";

  return (
    <section
      aria-label={t.projectProgress || "Project Progress"}
      className={cn(
        "p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between relative",
        className,
      )}
    >
      <style>{`
        .recharts-wrapper:focus,
        .recharts-surface:focus,
        .recharts-wrapper *:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
      `}</style>

      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {t.projectProgress}
          </p>
          <h3 className="text-2xl font-black mt-1 text-neutral-900 dark:text-neutral-100">
            {percent}%
          </h3>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md">
          {completed} / {total}
        </span>
      </div>

      <div className="grow relative w-full h-44 select-none" aria-hidden="true">
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ outline: "none" }}
        >
          <AreaChart
            data={data}
            style={{ outline: "none" }}
            margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "12px",
                color: tooltipText,
                fontSize: "11px",
              }}
              itemStyle={{ color: "#10b981" }}
              labelStyle={{ color: "#888888", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorProgress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
