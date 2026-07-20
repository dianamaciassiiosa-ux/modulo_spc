import { StyleSheet } from "@react-pdf/renderer";

export const ganttStyles = StyleSheet.create({
  table: {
    width: "100%",
    marginTop: 16,
    borderWidth: 0.7,
    borderColor: "#cbd5e1",
  },
  row: {
    minHeight: 24,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
  },
  headerRow: {
    minHeight: 28,
    color: "#ffffff",
    backgroundColor: "#2563eb",
  },
  headerCell: {
    justifyContent: "center",
    fontWeight: 700,
  },
  taskNameCell: {
    width: "30%",
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRightWidth: 0.5,
    borderRightColor: "#cbd5e1",
    justifyContent: "center",
  },
  timelineCell: {
    width: "70%",
    position: "relative",
    justifyContent: "center",
  },
  dayColumns: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: "row",
  },
  dayHeader: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 0.35,
    borderRightColor: "#bfdbfe",
    fontSize: 6,
  },
  dayCell: {
    flexGrow: 1,
    flexBasis: 0,
    borderRightWidth: 0.35,
    borderRightColor: "#e2e8f0",
  },
  taskText: {
    color: "#334155",
    fontSize: 7,
  },
  summaryText: {
    color: "#0f172a",
    fontSize: 7,
    fontWeight: 700,
  },
  taskBar: {
    position: "absolute",
    top: 7,
    height: 10,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: "#93c5fd",
  },
  summaryBar: {
    top: 8,
    height: 8,
    backgroundColor: "#64748b",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2563eb",
  },
});
