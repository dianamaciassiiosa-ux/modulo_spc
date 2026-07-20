"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Snapshot } from "@/features/planner/gantt.types";
import { PlannerReportDocument } from "./PlannerReportDocument";
import { validateGanttRange } from "./ganttPDFReport";

interface DownloadPlannerReportProps {
  snapshot?: Snapshot;
  startDate?: string;
  endDate?: string;
}

export function DowloadPlannerReport({
  snapshot,
  startDate,
  endDate,
}: DownloadPlannerReportProps) {
  if (!snapshot || !startDate || !endDate) {
    return null;
  }

  try {
    validateGanttRange(startDate, endDate);
  } catch (error) {
    return (
      <span className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Rango de fechas invalido"}
      </span>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <PlannerReportDocument
          snapshot={snapshot}
          startDate={startDate}
          endDate={endDate}
        />
      }
      fileName={`Planner-${snapshot.title || "reporte"}.pdf`}
    >
      {({ loading, error }) => {
        if (loading) return "Generando reporte...";
        if (error) return "No se pudo generar el PDF";
        return "Descargar PDF";
      }}
    </PDFDownloadLink>
  );
}
