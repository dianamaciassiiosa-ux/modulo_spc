"use client";

import { Activity, AlertTriangle } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Specification, Subgroups, XRMeasurement } from "../type";

interface XRChartProps {
  title: string;
  subtitle: string;
  data: XRMeasurement;
  subgroups: Subgroups[];
  metric: "average" | "range";
  valueLabel: string;
  specification?: Specification;
}

export function XRChart({
  title,
  data,
  subgroups,
  metric,
  valueLabel,
  specification,
  subtitle,
}: XRChartProps) {
  const points = subgroups.map((subgroup) => ({
    cycleNumber: subgroup.cycle_number,
    measuredAt: subgroup.measured_at,
    value: subgroup[metric],
    outOfControl:
      subgroup[metric] < data.lic || subgroup[metric] > data.lsc,
  }));
  const outOfControl = points.filter((point) => point.outOfControl).length;
  const controlSpan = Math.max(data.lsc - data.lic, 0.0001);
  const maxSpecificationDistance = controlSpan * 1.5;
  const showLsl =
    specification !== undefined &&
    data.lic - specification.limit_min <= maxSpecificationDistance;
  const showUsl =
    specification !== undefined &&
    specification.limit_max - data.lsc <= maxSpecificationDistance;
  const showSpecification = showLsl || showUsl;
  const values = [
    ...points.map((point) => point.value),
    data.lsc,
    data.lc,
    data.lic,
    ...(showLsl && specification ? [specification.limit_min] : []),
    ...(showUsl && specification ? [specification.limit_max] : []),
  ];
  const range = Math.max(...values) - Math.min(...values);
  const padding = Math.max(range * 0.15, Math.abs(data.lc) * 0.0005, 0.001);
  const domain: [number, number] = [
    Math.min(...values) - padding,
    Math.max(...values) + padding,
  ];
  const decimals = range < 0.1 ? 4 : range < 10 ? 3 : 2;

  return (
    <section className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <Activity className="h-4 w-4 text-primary" />
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
           {subtitle}
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
            outOfControl > 0
              ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {outOfControl > 0 && <AlertTriangle className="h-3.5 w-3.5" />}
          {outOfControl > 0
            ? `${outOfControl} fuera de control`
            : "Proceso bajo control"}
        </div>
      </div>

      <div className="px-2 py-5 sm:px-5">
        <ResponsiveContainer width="100%" height={290}>
          <LineChart
            data={points}
            margin={{ top: 16, right: 28, bottom: 4, left: 8 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
              strokeOpacity={0.55}
            />

            <XAxis
              dataKey="cycleNumber"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              dy={8}
            />
            <YAxis
              domain={domain}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => value.toFixed(decimals)}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              width={64}
            />

            <Tooltip
              formatter={(value) => [
                Number(value ?? 0).toFixed(decimals),
                valueLabel,
              ]}
              labelFormatter={(label, payload) => {
                const measuredAt = payload?.[0]?.payload?.measuredAt;
                return measuredAt
                  ? `Ciclo ${label} · ${new Date(measuredAt).toLocaleString()}`
                  : `Ciclo ${label}`;
              }}
              cursor={{ stroke: "var(--muted-foreground)", strokeOpacity: 0.25 }}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgb(0 0 0 / 0.1)",
                color: "var(--card-foreground)",
                fontSize: "12px",
              }}
              labelStyle={{
                color: "var(--card-foreground)",
                fontWeight: 600,
                marginBottom: "4px",
              }}
              itemStyle={{ color: "var(--card-foreground)" }}
            />

            {showLsl && specification && (
                <ReferenceLine
                  y={specification.limit_min}
                  stroke="rgb(240 39 12)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  label={{ value: "LIE", position: "insideBottomLeft", fill: "rgb(240 39 12)", fontSize: 10 }}
                />
            )}
            {showUsl && specification && (
                <ReferenceLine
                  y={specification.limit_max}
                  stroke="rgb(240 39 12)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  label={{ value: "LSE", position: "insideTopLeft", fill: "rgb(240 39 12)", fontSize: 10 }}
                />
            )}
           
            <ReferenceLine
              y={data.lsc}
              stroke="rgb(240 160 12)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={{ value: "LSC", position: "insideBottomRight", fill: "rgb(240 160 12)", fontSize: 10 }}
            />
            <ReferenceLine
              y={data.lc}
              stroke="rgb(16 185 129)"
              strokeWidth={1.5}
              label={{ value: "LC", position: "insideTopRight", fill: "rgb(16 185 129)", fontSize: 10 }}
            />
            <ReferenceLine
              y={data.lic}
              stroke="rgb(240 160 12)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={{ value: "LIC", position: "insideBottomRight", fill: "rgb(240 160 12)", fontSize: 10 }}
            />

            <Line
              type="monotone"
              dataKey="value"
              name={valueLabel}
              stroke="rgb(37 99 235)"
              strokeWidth={2.5}
              activeDot={{ r: 6, fill: "rgb(37 99 235)", stroke: "var(--card)", strokeWidth: 2 }}
              dot={(props) => {
                const { cx, cy, payload } = props as unknown as {
                  cx?: number;
                  cy?: number;
                  payload: { outOfControl: boolean };
                };

                if (cx == null || cy == null) return <g />;

                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={payload.outOfControl ? 5.5 : 4}
                    fill={payload.outOfControl ? "rgb(239 68 68)" : "rgb(37 99 235)"}
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-blue-600" />
            {valueLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-emerald-500" />
            Línea central
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t border-dashed border-amber-500" />
            Límites de control
          </span>
          {
            showSpecification && (
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-t border-dashed border-red-500" />
                Límites de especificación
              </span>
            )
          }
        </div>
      </div>
    </section>
  );
}
