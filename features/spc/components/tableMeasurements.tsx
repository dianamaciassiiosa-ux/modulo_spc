"use client";

import { AlertTriangle, CheckCircle2, Rows3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Specification, Subgroups, XRMeasurement } from "../type";

interface TableMeasurementsProps {
  subgroups: Subgroups[];
  specification: Specification;
  xrMeasurements: XRMeasurement;
}

export function TableMeasurements({
  subgroups,
  specification,
  xrMeasurements,
}: TableMeasurementsProps) {
  const readingCount = Math.max(
    0,
    ...subgroups.map((subgroup) => subgroup.measurements.length),
  );

  const isOutsideSpecification = (measurement: number) =>
    measurement < specification.limit_min || measurement > specification.limit_max;

  const isSubgroupOutOfControl = (subgroup: Subgroups) =>
    subgroup.average < xrMeasurements.lic ||
    subgroup.average > xrMeasurements.lsc;

  const outOfControlCount = subgroups.filter(isSubgroupOutOfControl).length;

  return (
    <section className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <Rows3 className="h-4 w-4 text-primary" />
            Mediciones por subgrupo
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Lecturas individuales, promedio, rango y estado de control
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
            outOfControlCount > 0
              ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {outOfControlCount > 0 ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          {outOfControlCount > 0
            ? `${outOfControlCount} subgrupos OOC`
            : "Todos bajo control"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/35 hover:bg-muted/35">
              <TableHead className="sticky left-0 min-w-24 bg-muted/95 font-semibold">
                Ciclo / fecha
              </TableHead>
              {Array.from({ length: readingCount }, (_, index) => (
                <TableHead key={index} className="min-w-24 text-center font-semibold">
                  Lectura {index + 1}
                </TableHead>
              ))}
              <TableHead className="min-w-24 text-center font-semibold">
                Promedio (X̄)
              </TableHead>
              <TableHead className="min-w-20 text-center font-semibold">
                Rango
              </TableHead>
              <TableHead className="min-w-36 text-center font-semibold">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subgroups.map((subgroup, subgroupIndex) => {
              const isOoc = isSubgroupOutOfControl(subgroup);
              const hasOutsideSpecification = subgroup.measurements.some(
                isOutsideSpecification,
              );

              return (
                <TableRow
                  key={`${subgroup.cycle_number}-${subgroup.measured_at}`}
                  className={isOoc ? "bg-red-500/5 hover:bg-red-500/10" : ""}
                >
                  <TableCell className="sticky left-0 bg-card font-medium">
                    <div>Ciclo {subgroup.cycle_number}</div>
                    <div className="text-[10px] font-normal text-muted-foreground">
                      {new Date(subgroup.measured_at).toLocaleString()}
                    </div>
                  </TableCell>

                  {Array.from({ length: readingCount }, (_, readingIndex) => {
                    const reading = subgroup.measurements[readingIndex];
                    const isOutside =
                      reading !== undefined &&
                      isOutsideSpecification(reading);

                    return (
                      <TableCell
                        key={readingIndex}
                        className={`text-center font-mono text-xs tabular-nums ${
                          isOutside
                            ? "font-semibold text-red-600 dark:text-red-400"
                            : ""
                        }`}
                      >
                        {reading === undefined ? "—" : reading.toFixed(4)}
                      </TableCell>
                    );
                  })}

                  <TableCell
                    className={`text-center font-mono text-xs font-semibold tabular-nums ${
                      isOoc ? "text-red-600 dark:text-red-400" : ""
                    }`}
                  >
                    {subgroup.average.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs tabular-nums">
                    {subgroup.range.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          isOoc
                            ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isOoc ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {isOoc ? "OOC" : "En control"}
                      </span>

                      {hasOutsideSpecification && (
                        <span className="text-[10px] font-medium text-red-600 dark:text-red-400">
                          Fuera de especificación
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border/40 px-5 py-3 text-[11px] text-muted-foreground">
        <span>
          Control X̄: {xrMeasurements.lic.toFixed(4)} –{" "}
          {xrMeasurements.lsc.toFixed(4)}
        </span>
        <span>
          Especificación: {specification.limit_min.toFixed(4)} –{" "}
          {specification.limit_max.toFixed(4)}
        </span>
        <span className="text-red-600 dark:text-red-400">
          Las lecturas rojas están fuera de especificación
        </span>
      </div>
    </section>
  );
}
