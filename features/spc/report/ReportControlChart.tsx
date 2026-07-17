import { Circle, G, Line, Polyline, Rect, Svg, Text, View } from "@react-pdf/renderer";
import { Subgroups, XRMeasurement } from "../type";
import { chartText, chartTheme, styles } from "./utils/styles";

interface ReportControlChartProps { 
    subgroups: Subgroups[]; 
    limits: XRMeasurement; 
    type: "x" | "r";
}

const WIDTH = 535;
const HEIGHT = 230;
const MARGIN = { top: 18, right: 18, bottom: 45, left: 55 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

function formatMeasurementTime(measuredAt: string): string {
  const isoTime = measuredAt.match(/T(\d{2}:\d{2})/);

  if (isoTime) {
    return isoTime[1];
  }

  const date = new Date(measuredAt);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


export function ReportControlChart({ subgroups, limits, type
 }: ReportControlChartProps) {
  const config = type === "x"
    ? {
        title: "Grafica X ",
        valueLabel: "promedio",
        getValue: (subgroup: Subgroups) => subgroup.average,
      }
    : {
        title: "Grafica R ",
        valueLabel: "rango",
        getValue: (subgroup: Subgroups) => subgroup.range,
      };

  if (subgroups.length === 0) {
    return <View style={styles.container}><Text style={styles.title}>{config.title}</Text><Text style={styles.emptyText}>No hay subgrupos disponibles.</Text></View>;
  }

  const values = subgroups.map(config.getValue);
  const allValues = [...values, limits.lsc, limits.lc, limits.lic];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const rawRange = rawMax - rawMin;
  const padding = Math.max(rawRange * 0.12, Math.abs(limits.lc) * 0.0005, 0.001);
  const minY = rawMin - padding;
  const maxY = rawMax + padding;
  const domain = Math.max(maxY - minY, Number.EPSILON);
  const decimals = rawRange < 0.1 ? 4 : rawRange < 10 ? 3 : 2;
  const xForIndex = (index: number) => MARGIN.left + (subgroups.length === 1 ? PLOT_WIDTH / 2 : (index / (subgroups.length - 1)) * PLOT_WIDTH);
  const yForValue = (value: number) => MARGIN.top + ((maxY - value) / domain) * PLOT_HEIGHT;
  const linePoints = values.map((value, index) => `${xForIndex(index)},${yForValue(value)}`).join(" ");
  const yTicks = Array.from({ length: 5 }, (_, index) => minY + (index / 4) * domain);
  const xLabelStep = Math.max(1, Math.ceil(subgroups.length / 10));
  const controlLines = [
    { label: "LSC", value: limits.lsc, color: "#d97706", dash: "5 3" },
    { label: "LC", value: limits.lc, color: "#059669", dash: undefined },
    { label: "LIC", value: limits.lic, color: "#d97706", dash: "5 3" },
  ];

  return (
    <View style={styles.container} wrap={false}>
      <Text style={styles.title}>{config.title}</Text>
      <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Rect x={MARGIN.left} y={MARGIN.top} width={PLOT_WIDTH} height={PLOT_HEIGHT} fill={chartTheme.background} stroke={chartTheme.border} strokeWidth={0.75} />
        {yTicks.map((tick) => { 
            const y = yForValue(tick); 
            return <G key={`y-${tick}`}>
                <Line x1={MARGIN.left} y1={y} x2={MARGIN.left + PLOT_WIDTH} y2={y} stroke={chartTheme.grid} strokeWidth={0.5} />
                <Text x={MARGIN.left - 5} y={y + 2.5} textAnchor="end" style={chartText.axis}>
                {tick.toFixed(decimals)}</Text>
            </G>; })}
        {controlLines.map((item) => { const y = yForValue(item.value); return <G key={item.label}><Line x1={MARGIN.left} y1={y} x2={MARGIN.left + PLOT_WIDTH} y2={y} stroke={item.color} strokeWidth={1} strokeDasharray={item.dash} /><Text x={MARGIN.left + PLOT_WIDTH - 3} y={y - 3} textAnchor="end" style={{ fontSize: 6.5, fill: item.color }}>{`${item.label} ${item.value.toFixed(decimals)}`}</Text></G>; })}
        <Polyline points={linePoints} fill="none" stroke={chartTheme.primary} strokeWidth={1.5} />
        {subgroups.map((subgroup, index) => {
          const value = config.getValue(subgroup);
          const outOfControl = value < limits.lic || value > limits.lsc;
          const showLabel = index % xLabelStep === 0 || index === subgroups.length - 1;
          return <G key={`${subgroup.cycle_number}-${subgroup.measured_at}`}><Circle cx={xForIndex(index)} cy={yForValue(value)} r={outOfControl ? 3.2 : 2.4} fill={outOfControl ? chartTheme.danger : chartTheme.primary} stroke={outOfControl ? chartTheme.dangerDark : chartTheme.background} strokeWidth={0.8} />{showLabel && <G><Text x={xForIndex(index)} y={MARGIN.top + PLOT_HEIGHT + 11} textAnchor="middle" style={chartText.axis}>{`C${subgroup.cycle_number}`}</Text><Text x={xForIndex(index)} y={MARGIN.top + PLOT_HEIGHT + 20} textAnchor="middle" style={chartText.axis}>{formatMeasurementTime(subgroup.measured_at)}</Text></G>}</G>;
        })}
        <Text x={MARGIN.left + PLOT_WIDTH / 2} y={HEIGHT - 4} textAnchor="middle" style={chartText.axisTitle}>Ciclo · Hora</Text>
      </Svg>
      <Text style={styles.caption}>Azul: {config.valueLabel} del subgrupo. Rojo: punto fuera de los limites de control.</Text>
    </View>
  );
}
