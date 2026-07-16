import { View, Text } from "@react-pdf/renderer";
import { Specification, Subgroups } from "../type";
import { styles } from "./utils/styles";

interface ReportMeasurementsTableProps {
  subgroups: Subgroups[];
  specification: Specification;
}

export function ReportMeasurementsTable({
  subgroups,
  specification,
}: ReportMeasurementsTableProps) {
  const readingCount = Math.max(
    0,
    ...subgroups.map((subgroup) => subgroup.measurements.length),
  );

  const formatValue = (value: number | undefined) =>
    value === undefined ? "—" : value.toFixed(4);

  const formatNumber = (value: number | undefined, digits = 4) =>
    value === undefined || !Number.isFinite(value) ? "—" : value.toFixed(digits);

  const isOutsideSpecification = (value: number) =>
    value < specification.limit_min || value > specification.limit_max;

  return (
    <View style={styles.container} wrap={false}>
      <Text style={styles.title}>Resultados de medición</Text>

      {subgroups.length > 0 ? (
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <View style={[styles.cell, styles.cycleCell]}>
              <Text style={styles.cycleTitle}>Ciclo / fecha</Text>
            </View>

            {Array.from({ length: readingCount }, (_, index) => (
              <View key={`header-${index}`} style={[styles.cell, styles.readingCell]}>
                <Text style={styles.cycleTitle}>Lectura {index + 1}</Text>
              </View>
            ))}

            <View style={[styles.cell, styles.averageCell]}>
              <Text style={styles.cycleTitle}>Promedio</Text>
            </View>
            <View style={[styles.cell, styles.averageCell]}>
              <Text style={styles.cycleTitle}>Rango</Text>
            </View>
          </View>

          {subgroups.map((subgroup, index) => (
            <View
              key={`${subgroup.cycle_number}-${subgroup.measured_at}`}
              style={
                index === subgroups.length - 1
                  ? [styles.row, styles.lastRow]
                  : styles.row
              }
            >
              <View style={[styles.cell, styles.cycleCell]}>
                <Text style={styles.cycleTitle}>Ciclo {subgroup.cycle_number}</Text>
                <Text style={styles.cycleDate}>
                  {new Date(subgroup.measured_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </View>

              {Array.from({ length: readingCount }, (_, readingIndex) => {
                const reading = subgroup.measurements[readingIndex];
                const isOutside =
                  reading !== undefined && isOutsideSpecification(reading);

                return (
                  <View
                    key={`${subgroup.cycle_number}-${readingIndex}`}
                    style={[styles.cell, styles.readingCell]}
                  >
                    <Text style={isOutside ? [styles.valueText, styles.outsideSpecification] : styles.valueText}>
                      {formatValue(reading)}
                    </Text>
                  </View>
                );
              })}

              <View style={[styles.cell, styles.averageCell]}>
                <Text
                  style={
                    subgroup.average < specification.limit_min ||
                    subgroup.average > specification.limit_max
                      ? [styles.averageText, styles.outsideSpecification]
                      : styles.averageText
                  }
                >
                  {formatNumber(subgroup.average)}
                </Text>
              </View>

              <View style={[styles.cell, styles.averageCell]}>
                <Text style={styles.valueText}>{formatNumber(subgroup.range)}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No hay mediciones disponibles para mostrar.</Text>
      )}

      <Text style={styles.caption}>
        Las lecturas resaltadas en rojo están fuera de la especificación de diseño.
      </Text>
    </View>
  );
}