import { HierarchicalTask } from "@/features/planner/gantt.types";
import { Text, View } from "@react-pdf/renderer";
import { ganttStyles } from "./utils/styles";

interface GanttPDFReportProps {
  hierarchicalTask: HierarchicalTask[];
  startDate: string;
  endDate: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function parseISODate(value: string, field: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} debe ser una fecha ISO valida`);
  }

  return date;
}

export function validateGanttRange(startDate: string, endDate: string) {
  const start = parseISODate(startDate, "startDate");
  const end = parseISODate(endDate, "endDate");
  const duration = end.getTime() - start.getTime();

  if (duration <= 0) {
    throw new Error("endDate debe ser posterior a startDate");
  }

  if (duration > 15 * DAY_MS) {
    throw new Error("El reporte Gantt permite un rango maximo de 15 dias");
  }

  return { start, end, duration };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function GanttPDFReport({
  hierarchicalTask,
  startDate,
  endDate,
}: GanttPDFReportProps) {
  const { start, end, duration } = validateGanttRange(startDate, endDate);
  const columnCount = Math.max(1, Math.ceil(duration / DAY_MS));
  const columns = Array.from(
    { length: columnCount },
    (_, index) => new Date(start.getTime() + index * DAY_MS),
  );

  const getBarStyle = (task: HierarchicalTask) => {
    const taskStart = parseISODate(task.start, `Inicio de ${task.text}`);
    const taskEnd = parseISODate(task.end, `Fin de ${task.text}`);
    const visibleStart = Math.max(taskStart.getTime(), start.getTime());
    const visibleEnd = Math.min(taskEnd.getTime(), end.getTime());

    if (visibleStart >= visibleEnd) return null;

    return {
      left: `${((visibleStart - start.getTime()) / duration) * 100}%`,
      width: `${((visibleEnd - visibleStart) / duration) * 100}%`,
    };
  };

  return (
    <View style={ganttStyles.table}>
      <View style={[ganttStyles.row, ganttStyles.headerRow]} fixed>
        <View style={[ganttStyles.taskNameCell, ganttStyles.headerCell]}>
          <Text>Tarea</Text>
        </View>
        <View style={ganttStyles.timelineCell}>
          <View style={ganttStyles.dayColumns}>
            {columns.map((day) => (
              <View key={day.toISOString()} style={ganttStyles.dayHeader}>
                <Text>{formatDate(day)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {hierarchicalTask.map((task) => {
        const barStyle = getBarStyle(task);

        return (
          <View key={task.id} style={ganttStyles.row} wrap={false}>
            <View
              style={[
                ganttStyles.taskNameCell,
                { paddingLeft: 5 + task.level * 7 },
              ]}
            >
              <Text
                style={
                  task.type === "Summary"
                    ? ganttStyles.summaryText
                    : ganttStyles.taskText
                }
              >
                {task.children.length > 0 ? "- " : "• "}
                {task.text}
              </Text>
            </View>

            <View style={ganttStyles.timelineCell}>
              <View style={ganttStyles.dayColumns}>
                {columns.map((day) => (
                  <View key={day.toISOString()} style={ganttStyles.dayCell} />
                ))}
              </View>
              {barStyle && (
                <View
                  style={[
                    ganttStyles.taskBar,
                    task.type === "Summary" ? ganttStyles.summaryBar : {},
                    barStyle,
                  ]}
                >
                  <View
                    style={[
                      ganttStyles.progressBar,
                      { width: `${Math.max(0, Math.min(1, task.progress)) * 100}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
