"use client";

import { BarChart3, Target } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bins, Capability, Specification } from "../type";

interface CPKChartProps {
  title: string;
  capability: Capability;
  histogram: Bins[];
  specification: Specification;
  totalMeasurements: number;
}

export function CPKChart({
  title,
  capability,
  histogram,
  specification,
  totalMeasurements
}: CPKChartProps) {
  const chartData = useMemo(() => {
    const sortedHistogram = [...histogram].sort((a, b) => a.from_val - b.from_val);
    const total = sortedHistogram.reduce(
      (sum, bin) => sum + bin.frequency,
      0,
    );

    return sortedHistogram.map((bin) => {
      const x = (bin.from_val + bin.to_val) / 2;
      const density =
        capability.std_deviation > 0
          ? (1 / (capability.std_deviation * Math.sqrt(2 * Math.PI))) *
            Math.exp(
              -0.5 * Math.pow((x - capability.mean) / capability.std_deviation, 2),
            )
          : 0;

      return {
        label: `${bin.from_val.toFixed(3)} – ${bin.to_val.toFixed(3)}`,
        x,
        frequency: bin.frequency,
        gaussian: density * total * (bin.to_val - bin.from_val),
      };
    });
  }, [capability.mean, capability.std_deviation, histogram]);

  const histogramMin = chartData[0]?.x ?? specification.limit_min;
  const histogramMax = chartData.at(-1)?.x ?? specification.limit_max;
  const domainMin = Math.min(histogramMin, specification.limit_min);
  const domainMax = Math.max(histogramMax, specification.limit_max);
  const domainPadding = Math.max((domainMax - domainMin) * 0.04, 0.0001);
  const isCapable = capability.cpk >= 1.33;

  return (
    <section className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <BarChart3 className="h-4 w-4 text-primary" />
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Distribución de mediciones frente a especificación
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
            isCapable
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          }`}
        >
          Cpk {capability.cpk.toFixed(2)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-b border-border/40 bg-muted/20 px-5 py-3 sm:grid-cols-4">
        {[
          ["Media", capability.mean.toFixed(4)],
          ["Desviación Estándar", capability.std_deviation.toFixed(4)],
          ["Cp", capability.cp.toFixed(2)],
          ["Muestras", String(totalMeasurements)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border/40 bg-background/60 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="px-2 py-5 sm:px-5">
        <ResponsiveContainer width="100%" height={310}>
          <ComposedChart
            data={chartData}
            margin={{ top: 24, right: 28, bottom: 12, left: 8 }}
            barCategoryGap="8%"
          >
            <defs>
              <linearGradient id="spcHistogramBars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(37 99 235)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity={0.45} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
              strokeOpacity={0.55}
            />
            <XAxis
              dataKey="x"
              type="number"
              domain={[domainMin - domainPadding, domainMax + domainPadding]}
              tickFormatter={(value: number) => value.toFixed(3)}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              dy={8}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              width={34}
            />
            <Tooltip
              formatter={(value, name) => {
                const numericValue = Number(value ?? 0);
                const seriesName = String(name ?? "");

                return [
                  seriesName === "Frecuencia"
                    ? numericValue
                    : numericValue.toFixed(2),
                  seriesName,
                ];
              }}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.label
                  ? `Intervalo: ${payload[0].payload.label}`
                  : ""
              }
              cursor={{ fill: "var(--muted)", fillOpacity: 0.35 }}
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

            <ReferenceLine
              x={specification.limit_min}
              stroke="rgb(239 68 68)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={{ value: "LIE", position: "insideTopLeft", fill: "rgb(239 68 68)", fontSize: 10 }}
            />
            <ReferenceLine
              x={specification.nominal_value}
              stroke="rgb(16 185 129)"
              strokeWidth={1.5}
              label={{ value: "Objetivo", position: "insideTopRight", fill: "rgb(16 185 129)", fontSize: 10 }}
            />
            <ReferenceLine
              x={specification.limit_max}
              stroke="rgb(239 68 68)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={{ value: "LSE", position: "insideTopRight", fill: "rgb(239 68 68)", fontSize: 10 }}
            />

            <Bar
              dataKey="frequency"
              name="Frecuencia"
              fill="url(#spcHistogramBars)"
              stroke="rgb(37 99 235)"
              strokeWidth={1}
              radius={[6, 6, 0, 0]}
              barSize={44}
              minPointSize={3}
              animationDuration={600}
            />
            <Line
              type="monotone"
              dataKey="gaussian"
              name="Curva normal"
              dot={false}
              stroke="rgb(124 58 237)"
              strokeWidth={2.5}
              activeDot={{ r: 4, fill: "rgb(124 58 237)" }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
            Frecuencia
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-violet-600" />
            Curva normal
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-emerald-500" />
            Objetivo {specification.nominal_value.toFixed(3)}
          </span>
        </div>
      </div>
    </section>
  );
}
