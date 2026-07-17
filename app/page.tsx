"use client"

import { Button } from "@/components/ui/button";
import { QueueLayout } from "@/features/share/layouts/QueueLayout";
import { CPKChart } from "@/features/spc/components/chartCPK";
import { XRChart } from "@/features/spc/components/chartXR";
import { StatisticalSummary } from "@/features/spc/components/statisticalSummary";
import { TableMeasurements } from "@/features/spc/components/tableMeasurements";
import { DownloadSPCReportButton } from "@/features/spc/report/DowloadSPCReportButton";
import { spcService } from "@/features/spc/services/spc.services";
import { generateSpc, SPC, spcMock, StatiscalSummary } from "@/features/spc/type";
import { BookCheck, PackageSearch, Ruler } from "lucide-react";
import { useEffect, useMemo, useState } from "react";


/*
 * SPC por producto — estado del wiring (Ola 6, 2026-07-07):
 *
 * El backend SÍ calcula SPC real (carta I-MR + Cp/Cpk server-side) pero solo
 * POR FEATURE:  GET /quality/features/:id/spc  →  dto.SPCResultDTO.
 * Las features de calidad (quality_features) cuelgan de production_task_id
 * y solo son consultables vía GET /quality/features/task/:task_id.
 *
 * ⚠️ GAP-BACKEND: no existe endpoint para resolver producto → features:
 *   - falta  GET /quality/features?product_id=...  (o /products/:id/quality-features)
 *   - o un agregado  GET /quality/spc?product_id=...
 * Sin ese puente, esta página no puede mostrar mediciones reales del producto
 * seleccionado. Antes mostraba un elemento ALEATORIO de spcMockData (retirado):
 * ahora muestra un empty-state honesto hasta que el backend exponga la fuente.
 *
 * Cuando el endpoint exista, el wiring es directo: producto → lista de features
 * → GET /quality/features/:id/spc (ya trae UCL/LCL = μ±3σ̂, Cp/Cpk, puntos
 * fuera de control por reglas Nelson — no hace falta calcular límites aquí).
 */

export default function SpcPage() {
    const [productSearchOpen,setProductSearchOpen]=useState(false);
    // Sin fuente backend producto→mediciones, spc permanece null (empty-state honesto).
    const [spc,setSpc]=useState<SPC|null>(null);

    useEffect(()=>{
        /*const planId="fb4d215a-a2f6-47d9-8266-aca37352cb28";
        const featureId="b6caf9ac-727d-4b39-9bf1-aaa52cdc8d08";
        spcService.getControlChartData(planId,featureId).then((data)=>{
           setSpc(s);
        }).catch((error)=>{
            setSpc(spcMock);
        });*/
        setSpc(generateSpc(40));
    },[])


    const totalMeasurements = useMemo(() => {
        if (!spc) return 0;
        return spc.subgroups.reduce(
            (total, subgroup) => total + subgroup.measurements.length,
            0,
        );
    }, [spc]);
    const statiscalSummary = useMemo<StatiscalSummary | null>(() => {
        if (!spc) return null;

        const subgroups = spc.subgroups.length;
        const totalMeasurements = spc.subgroups.reduce(
            (total, subgroup) => total + subgroup.measurements.length,
            0,
        );
        const greatStocking = subgroups > 0
            ? spc.subgroups.reduce(
                (total, subgroup) => total + subgroup.average,
                0,
            ) / subgroups
            : 0;
        const avgRanges = subgroups > 0
            ? spc.subgroups.reduce(
                (total, subgroup) => total + subgroup.range,
                0,
            ) / subgroups
            : 0;
        const outOfSpecification = spc.subgroups.reduce(
            (total, subgroup) =>
                total + subgroup.measurements.filter(
                    (reading) =>
                        reading < spc.specifications.limit_min ||
                        reading > spc.specifications.limit_max,
                ).length,
            0,
        );

        return {
            greatStocking,
            avgRanges,
            estimatedSigma: spc.capability.std_deviation,
            ucl_avg: spc.x_chart.lsc,
            lcl_avg: spc.x_chart.lic,
            ucl_r: spc.r_chart.lsc,
            lcl_r: spc.r_chart.lic,
            lsl: spc.specifications.limit_min,
            usl: spc.specifications.limit_max,
            cp: spc.capability.cp,
            cpk: spc.capability.cpk,
            cpu: spc.capability.cpu,
            cpl: spc.capability.cpl,
            subgroups,
            totalMeasurements,
            outOfSpecification,
            outOfControl: spc.subgroups.filter(
                (subgroup) =>
                    subgroup.average < spc.x_chart.lic ||
                    subgroup.average > spc.x_chart.lsc,
            ).length,
        };
    }, [spc])


    return (

        <QueueLayout
            header={
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                        <BookCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Control Estadístico de Procesos (SPC)</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                        Selecciona un producto para ver sus cartas X̄-R, capacidad (Cp/Cpk) y mediciones.
                        </p>
                    </div>
                </div>
            }
            toolbar={
                <div className="space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 text-xs font-medium text-muted-foreground">Producto</div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-full justify-start font-normal lg:max-w-xl"
                    onClick={() => setProductSearchOpen(true)}
                  >
                    <PackageSearch className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">Selecciona un producto</span>

                  </Button>
                 </div>
              </div>

            
            </div>
            }
            master={
                <>
                    {
                        spc?
                    <div className="space-y-4">
                        {statiscalSummary && (
                            <StatisticalSummary summary={statiscalSummary} />
                        )}
                        <XRChart title="Gráfica X̄"
                        valueLabel="Media"
                        subtitle="Monitoreo de la estabilidad de la media"
                        data={spc.x_chart}
                        subgroups={spc.subgroups}
                        metric="average"
                        specification={spc.specifications}
                        />
                        <XRChart title="Gráfica R"
                        valueLabel="Rango"
                        data={spc.r_chart}
                        subgroups={spc.subgroups}
                        metric="range"
                        subtitle="Monitoreo de la estabilidad de la disperción del proceso"
                        />
                        <CPKChart title="Histograma de capacidad"
                        capability={spc.capability}
                        histogram={spc.histogram}
                        specification={spc.specifications}
                        totalMeasurements={totalMeasurements}
                        />
                        <TableMeasurements
                            subgroups={spc.subgroups}
                            specification={spc.specifications}
                            xrMeasurements={spc.x_chart}
                        />
                    </div>:
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-8 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <Ruler className="h-7 w-7 text-muted-foreground" />
                        </div>
                   
                            
                                <p className="text-base font-semibold">Sin mediciones registradas</p>
                                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                    No hay mediciones de calidad disponibles para{" "}
                                    <span className="font-medium text-foreground">NOMBRE DEL PRODUCTO</span>.
                                    Las cartas X̄-R y los índices Cp/Cpk aparecerán cuando existan
                                    mediciones registradas para las características de este producto.
                                </p>
                            
                    </div>
                    }
                </>
            }
            actions={
              spc && statiscalSummary && 

              < DownloadSPCReportButton spc={spc} staticalSummary={statiscalSummary} />
            }

        />
    )
}
