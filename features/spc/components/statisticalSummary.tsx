"use client";

import { Activity, AlertTriangle, Gauge, Ruler, Sigma } from "lucide-react";
import { StatiscalSummary } from "../type";
import { KpiTile } from "@/features/share/charts/kpi-tile";

interface StatisticalSummaryProps {
  summary: StatiscalSummary;
}

export function StatisticalSummary({ summary }: StatisticalSummaryProps) {
  const capable = summary.cpk >= 1.33;

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Resumen estadístico
          </h2>
          <p className="text-xs text-muted-foreground">
            Estabilidad y capacidad general del proceso
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            summary.outOfControl === 0
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
          }`}>
            {summary.outOfControl === 0
              ? "Proceso estable"
              : `${summary.outOfControl} subgrupos OOC`}
          </span>
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            capable
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          }`}>
            {capable ? "Proceso capaz" : "Capacidad insuficiente"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        <KpiTile
          icon={Activity}
          label="Media global"
          value={summary.greatStocking.toFixed(4)}
          caption={`${summary.subgroups} subgrupos`}
        />
        <KpiTile
          icon={Ruler}
          label="Rango promedio"
          value={summary.avgRanges.toFixed(4)}
          caption={`Control R: ${summary.lcl_r.toFixed(4)} – ${summary.ucl_r.toFixed(4)}`}
        />
        <KpiTile
          icon={Sigma}
          label="Sigma estimada"
          value={summary.estimatedSigma.toFixed(4)}
          caption={`${summary.totalMeasurements} mediciones`}
        />
        <KpiTile
          icon={Gauge}
          label="Cpk"
          value={summary.cpk.toFixed(2)}
          caption={`Cp ${summary.cp.toFixed(2)} · CPU ${summary.cpu.toFixed(2)} · CPL ${summary.cpl.toFixed(2)}`}
          valueClass={capable
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-amber-600 dark:text-amber-400"}
        />
        <KpiTile
          icon={Activity}
          label="Control X̄"
          value={`${summary.lcl_avg.toFixed(4)} – ${summary.ucl_avg.toFixed(4)}`}
          caption="LIC – LSC"
        />
        <KpiTile
          icon={Ruler}
          label="Especificación"
          value={`${summary.lsl.toFixed(4)} – ${summary.usl.toFixed(4)}`}
          caption="LIE – LSE"
        />
        <KpiTile
          icon={AlertTriangle}
          label="Fuera de especificación"
          value={String(summary.outOfSpecification)}
          caption="Lecturas individuales"
          valueClass={summary.outOfSpecification > 0
            ? "text-red-600 dark:text-red-400"
            : "text-emerald-600 dark:text-emerald-400"}
        />
      </div>


    </section>
  );
}
