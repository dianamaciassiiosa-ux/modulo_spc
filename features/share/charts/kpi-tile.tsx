"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

/**
 * KpiTile — tile compacto para KPIs de valor mixto (string ya formateado).
 *
 * Usar cuando:
 * - El KPI no es un escalar 0-1 (ej. "45/120", "2.4 hrs", "CNC-Torno")
 * - No se requiere radial dial ni tooltip de performance levels
 * - Se quiere uniformidad visual en grids de KPIs del style enterprise
 *
 * Para KPIs escalares 0-1 con WebSocket live + dial radial usar SingleKpiCard.
 */

export interface KpiTileProps {
  icon: LucideIcon
  label: string
  value: string
  caption?: string
  /** Tailwind class para el color del valor (ej. "text-red-600 dark:text-red-400") */
  valueClass?: string
  /** 0-100 · si se pasa renderiza Progress bar debajo del valor */
  progress?: number
  /** Trend con dirección + etiqueta. tone: positive (emerald) | warning (amber) */
  trend?: {
    direction: "up" | "down"
    label: string
    tone?: "positive" | "warning"
  }
}

export function KpiTile({
  icon: Icon,
  label,
  value,
  caption,
  valueClass,
  progress,
  trend,
}: KpiTileProps) {
  const trendTone =
    trend?.tone === "warning"
      ? "text-amber-600 dark:text-amber-500"
      : "text-emerald-600 dark:text-emerald-500"

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className={`mt-2 text-3xl font-bold tabular-nums tracking-tight ${valueClass ?? ""}`}>
        {value}
      </p>

      {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}

      {progress !== undefined && <Progress value={progress} className="mt-3 h-1.5" />}

      {trend && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trendTone}`}>
          {trend.direction === "up" ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {trend.label}
        </div>
      )}
    </div>
  )
}
