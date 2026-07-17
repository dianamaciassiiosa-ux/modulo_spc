import {
  Svg,
  G,
  Line,
  Path,
  Rect,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  Bins,
  Specification,
  StatiscalSummary,
} from "../type";
import { chartText, chartTheme, styles } from "./utils/styles";

interface ReportCapabilityChartProps {
  statilcalSummary: StatiscalSummary;
  bins: Bins[];
  specification: Specification;
}

const WIDTH = 535;
const HEIGHT = 230;

const MARGIN = {
  top: 24,
  right: 18,
  bottom: 38,
  left: 55,
};

const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

const X_TICKS = 6;
const Y_TICKS = 5;
const CURVE_POINTS = 160;

/**
 * Función de densidad de probabilidad normal.
 */
function normalPdf(
  value: number,
  mean: number,
  sigma: number,
): number {
  if (!Number.isFinite(sigma) || sigma <= 0) {
    return 0;
  }

  const exponent =
    -0.5 * Math.pow((value - mean) / sigma, 2);

  return (
    Math.exp(exponent) /
    (sigma * Math.sqrt(2 * Math.PI))
  );
}

function getDecimals(range: number): number {
  if (range < 0.01) return 4;
  if (range < 0.1) return 3;
  if (range < 1) return 2;
  if (range < 10) return 1;

  return 0;
}

type SpecificationLine = {
  label: string;
  value: number;
  color: string;
  anchor: "start" | "middle" | "end";
  labelOffset: number;
};

export function ReportCapabilityChart({
  statilcalSummary,
  bins,
  specification,
}: ReportCapabilityChartProps) {
  /*
   * Se ordenan los intervalos para asegurar que el histograma
   * se dibuje de menor a mayor.
   */
  const sortedBins = [...bins]
    .filter(
      (bin) =>
        Number.isFinite(bin.from_val) &&
        Number.isFinite(bin.to_val) &&
        Number.isFinite(bin.frequency) &&
        bin.to_val > bin.from_val &&
        bin.frequency >= 0,
    )
    .sort((a, b) => a.from_val - b.from_val);

  if (sortedBins.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Capacidad del proceso</Text>
        <Text style={styles.emptyText}>
          No hay datos para generar el histograma.
        </Text>
      </View>
    );
  }

  /*
   * Se supone que greatStocking representa la media general.
   * Si el nombre corresponde a otro dato, sustitúyelo por
   * la propiedad que contenga la media del proceso.
   */
  const mean = Number.isFinite(
    statilcalSummary.greatStocking,
  )
    ? statilcalSummary.greatStocking
    : specification.nominal_value;

  const sigma =
    Number.isFinite(statilcalSummary.estimatedSigma) &&
    statilcalSummary.estimatedSigma > 0
      ? statilcalSummary.estimatedSigma
      : 0;

  const frequencies = sortedBins.map(
    (bin) => bin.frequency,
  );

  const totalFrequency = frequencies.reduce(
    (sum, frequency) => sum + frequency,
    0,
  );

  const totalMeasurements =
    statilcalSummary.totalMeasurements > 0
      ? statilcalSummary.totalMeasurements
      : totalFrequency;

  /*
   * Para superponer correctamente una curva normal sobre
   * frecuencias, se multiplica la densidad por:
   *
   * total de mediciones × ancho del intervalo.
   *
   * Se utiliza la mediana de los anchos de los bins.
   */
  const binWidths = sortedBins
    .map((bin) => bin.to_val - bin.from_val)
    .sort((a, b) => a - b);

  const representativeBinWidth =
    binWidths[Math.floor(binWidths.length / 2)] || 1;

  /*
   * Dominio del eje X.
   *
   * Además de los bins y especificaciones, se incluyen
   * cuatro sigmas para mostrar las colas de la distribución.
   */
  const firstBin = sortedBins[0];
  const lastBin = sortedBins[sortedBins.length - 1];

  const normalMin =
    sigma > 0 ? mean - 4 * sigma : firstBin.from_val;

  const normalMax =
    sigma > 0 ? mean + 4 * sigma : lastBin.to_val;

  const rawMinX = Math.min(
    firstBin.from_val,
    specification.limit_min,
    specification.nominal_value,
    normalMin,
  );

  const rawMaxX = Math.max(
    lastBin.to_val,
    specification.limit_max,
    specification.nominal_value,
    normalMax,
  );

  const rawXRange = Math.max(
    rawMaxX - rawMinX,
    Number.EPSILON,
  );

  const xPadding = rawXRange * 0.03;

  const minX = rawMinX - xPadding;
  const maxX = rawMaxX + xPadding;
  const xDomain = Math.max(maxX - minX, Number.EPSILON);

  /*
   * La curva devuelve frecuencia esperada, no solamente
   * densidad de probabilidad.
   */
  const normalExpectedFrequency = (
    value: number,
  ): number =>
    normalPdf(value, mean, sigma) *
    totalMeasurements *
    representativeBinWidth;

  const curveSamples = Array.from(
    { length: CURVE_POINTS + 1 },
    (_, index) => {
      const value =
        minX + (index / CURVE_POINTS) * xDomain;

      return {
        value,
        frequency: normalExpectedFrequency(value),
      };
    },
  );

  const maxHistogramFrequency = Math.max(
    ...frequencies,
    0,
  );

  const maxNormalFrequency = Math.max(
    ...curveSamples.map(
      (sample) => sample.frequency,
    ),
    0,
  );

  const maxY =
    Math.max(
      maxHistogramFrequency,
      maxNormalFrequency,
      1,
    ) * 1.12;

  const xForValue = (value: number): number =>
    MARGIN.left +
    ((value - minX) / xDomain) * PLOT_WIDTH;

  const yForValue = (value: number): number =>
    MARGIN.top +
    PLOT_HEIGHT -
    (value / maxY) * PLOT_HEIGHT;

  const normalPath =
    sigma > 0
      ? curveSamples
          .map((sample, index) => {
            const x = xForValue(sample.value);
            const y = yForValue(sample.frequency);

            return `${index === 0 ? "M" : "L"} ${x.toFixed(
              2,
            )} ${y.toFixed(2)}`;
          })
          .join(" ")
      : "";

  const xTicks = Array.from(
    { length: X_TICKS + 1 },
    (_, index) =>
      minX + (index / X_TICKS) * xDomain,
  );

  const yTicks = Array.from(
    { length: Y_TICKS + 1 },
    (_, index) => (index / Y_TICKS) * maxY,
  );

  const xDecimals = getDecimals(xDomain);
  const yDecimals = maxY < 5 ? 1 : 0;

  const specificationLines: SpecificationLine[] = [
    {
      label: "LSL",
      value: specification.limit_min,
      color: "#dc2626",
      anchor: "end",
      labelOffset: -3,
    },
    {
      label: "Nominal",
      value: specification.nominal_value,
      color: "#16a34a",
      anchor: "middle",
      labelOffset: 0,
    },
    {
      label: "USL",
      value: specification.limit_max,
      color: "#dc2626",
      anchor: "start",
      labelOffset: 3,
    },
  ];

  return (
    <View style={styles.container} wrap={false}>
      <Text style={styles.subtitle}>Capacidad del proceso</Text>
      <Svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    >
      {/* Fondo del área de dibujo */}
      <Rect
        x={MARGIN.left}
        y={MARGIN.top}
        width={PLOT_WIDTH}
        height={PLOT_HEIGHT}
        fill={chartTheme.background}
        stroke={chartTheme.border}
        strokeWidth={0.8}
      />

      {/* Líneas horizontales y etiquetas del eje Y */}
      {yTicks.map((tick, index) => {
        const y = yForValue(tick);

        return (
          <G key={`y-tick-${index}`}>
            <Line
              x1={MARGIN.left}
              y1={y}
              x2={MARGIN.left + PLOT_WIDTH}
              y2={y}
              stroke={chartTheme.grid}
              strokeWidth={0.6}
            />

            <Text
              x={MARGIN.left - 6}
              y={y + 3}
              textAnchor="end"
              style={chartText.axis}
            >
              {tick.toFixed(yDecimals)}
            </Text>
          </G>
        );
      })}

      {/* Etiquetas del eje X */}
      {xTicks.map((tick, index) => {
        const x = xForValue(tick);

        return (
          <G key={`x-tick-${index}`}>
            <Line
              x1={x}
              y1={MARGIN.top + PLOT_HEIGHT}
              x2={x}
              y2={MARGIN.top + PLOT_HEIGHT + 4}
              stroke="#6b7280"
              strokeWidth={0.7}
            />

            <Text
              x={x}
              y={MARGIN.top + PLOT_HEIGHT + 14}
              textAnchor="middle"
              style={chartText.axis}
            >
              {tick.toFixed(xDecimals)}
            </Text>
          </G>
        );
      })}

      {/* Barras del histograma */}
      {sortedBins.map((bin, index) => {
        const startX = xForValue(bin.from_val);
        const endX = xForValue(bin.to_val);
        const barY = yForValue(bin.frequency);

        const barWidth = Math.max(
          endX - startX - 1,
          0.5,
        );

        const barHeight =
          MARGIN.top + PLOT_HEIGHT - barY;

        return (
          <Rect
            key={`bin-${index}`}
            x={startX + 0.5}
            y={barY}
            width={barWidth}
            height={barHeight}
            fill={chartTheme.primaryLight}
            stroke={chartTheme.primary}
            strokeWidth={0.7}
            opacity={0.82}
          />
        );
      })}

      {/* Curva normal */}
      {normalPath !== "" && (
        <Path
          d={normalPath}
          fill="none"
          stroke={chartTheme.capability}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Límites y valor nominal */}
      {specificationLines.map((item) => {
        const x = xForValue(item.value);

        return (
          <G key={item.label}>
            <Line
              x1={x}
              y1={MARGIN.top}
              x2={x}
              y2={MARGIN.top + PLOT_HEIGHT}
              stroke={item.color}
              strokeWidth={1.2}
              strokeDasharray="4 3"
            />

            <Text
              x={x + item.labelOffset}
              y={MARGIN.top - 6}
              textAnchor={item.anchor}
              style={{ fontSize: 6.5 , fontWeight:600}}
              fill={item.color}
            >
              {`${item.label}: ${item.value.toFixed(
                xDecimals,
              )}`}
            </Text>
          </G>
        );
      })}

      {/* Leyenda de la curva normal */}
      <Line
        x1={MARGIN.left + 8}
        y1={MARGIN.top + 11}
        x2={MARGIN.left + 31}
        y2={MARGIN.top + 11}
        stroke={chartTheme.capability}
        strokeWidth={2}
      />

      <Text
        x={MARGIN.left + 36}
        y={MARGIN.top + 14}
        style={chartText.axisTitle}
      >
        Curva normal
      </Text>

      {/* Indicadores de capacidad */}
      <Text
        x={MARGIN.left + PLOT_WIDTH - 6}
        y={MARGIN.top + 14}
        textAnchor="end"
        style={{ fontSize: 7.5, fontWeight: 600 }}
        fill={chartTheme.text}
      >
        {`Cp: ${statilcalSummary.cp.toFixed(
          2,
        )}   Cpk: ${statilcalSummary.cpk.toFixed(2)}`}
      </Text>

      {/* Nombre del eje X */}
      <Text
        x={MARGIN.left + PLOT_WIDTH / 2}
        y={HEIGHT - 4}
        textAnchor="middle"
        style={chartText.axisTitle}
      >
        Medición
      </Text>

      {/* Nombre del eje Y */}
      <Text
        x={13}
        y={MARGIN.top + PLOT_HEIGHT / 2}
        textAnchor="middle"
        style={chartText.axisTitle}
        transform={`rotate(-90 13 ${
          MARGIN.top + PLOT_HEIGHT / 2
        })`}
      >
        Frecuencia
      </Text>
      </Svg>
      <Text style={styles.caption}>
        Azul: frecuencia observada. Morado: distribución normal estimada. Rojo: límites de especificación.
      </Text>
    </View>
  );
}
