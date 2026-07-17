import { StyleSheet } from "@react-pdf/renderer";

export const chartTheme = {
  background: "#ffffff",
  border: "#d1d5db",
  grid: "#e5e7eb",
  text: "#111827",
  mutedText: "#4b5563",
  primary: "#2563eb",
  primaryLight: "#93c5fd",
  danger: "#dc2626",
  dangerDark: "#7f1d1d",
  warning: "#d97706",
  success: "#059669",
  capability: "#7c3aed",
} as const;

export const chartText = {
  axis: { fontSize: 6.5, fill: chartTheme.mutedText },
  axisTitle: { fontSize: 7, fill: chartTheme.mutedText },
  annotation: { fontSize: 6.5, fontWeight: 600 },
} as const;

export const styles = StyleSheet.create({
    container: {
      marginTop: 14,
      padding: 10,
      backgroundColor: chartTheme.background,
      border: `1 solid ${chartTheme.border}`,
      borderRadius: 4,
      position: "relative",
    },
    caption: {
      marginTop: 5,
      color: chartTheme.mutedText,
      fontSize: 7,
      lineHeight: 1.35,
    },
    emptyText: {
      paddingVertical: 18,
      color: chartTheme.mutedText,
      fontSize: 8,
      textAlign: "center",
    },
    
  page: {
    padding: 30,
    paddingBottom: 85,
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: 9,
  },
    title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
    textAlign: "center",
  },
  notice: {
    position: "absolute",
    left: 30,
    right: 30,
    bottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    border: "1 solid #dc2626",
    color: "#dc2626",
    textAlign: "center",
    fontSize: 7,
  },
  watermark: {
    position: "absolute",
    top: 250,
    left: 122,
    width: 350,
    height: 300,
    objectFit: "contain",
    opacity: 0.22,
    transform: "rotate(-25deg)",
  },
  logo_header:{
    position:"absolute",
    left:30,
    top:10,
    width:40,
    height:40,
    objectFit:"contain",

},
  right_header:{
    
    top:-20,
    textAlign:"right",
    fontWeight:"bold",

  },
  pagNumber: {
    position: "absolute",
    bottom: 43,
    right: 30,
    fontSize: 9,
  },
  table:{
    width:"100%",
    borderWidth:0.7,
    borderColor:"#d1d5db"
  },
  row:{
    flexDirection:"row",
    minHeight:28,
    borderBottomWidth:0.5,
    borderBottomColor:"#999b9e"
  },
  lastRow:{
    borderBottomWidth:0,
  },
  headerRow:{
    minHeight:25,
    backgroundColor:"rgba(34,100,199,0.5)"
  },
  cell:{
    paddingHorizontal:3,
    paddingVertical:4,
    borderRightWidth:0.5,
    borderRightColor:"#d1d5db",
    justifyContent:"center",
    flexShrink:1,
  },
  lastCell:{
    borderRightWidth:0,
  },
  cycleCell:{
    width:96,
  },
  readingCell:{
    flexGrow:1,
    flexBasis:0,
    minWidth:36,
    textAlign:"center"
  },
  averageCell:{
    width:58,
    textAlign:"center"
  },
  cycleTitle: {
    fontSize: 7,
    fontWeight: "bold",
  },

  cycleDate: {
    marginTop: 2,
    fontSize: 6,
    color: "#6b7280",
  },

  valueText: {
    fontSize: 7,
    textAlign: "center",
  },

  averageText: {
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },

  outsideSpecification: {
    color: "#dc2626",
    fontWeight: "bold",
  },

  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderWidth: 0.5,
    borderRadius: 8,
  },
  clasification:{
    textAlign:"center",
    textSize:9,
    fontFamily:"Helvetica",
    fontStyle:"italic"
  },
  company:{
    textAlign:"center",
    font:"bold",
    textSize:12,
    fontFamily:"Helvetica",
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 0.7,
    borderColor: chartTheme.border,
    borderRadius: 4,
    backgroundColor: "#f9fafb",
  },
  infoColumn: {
    width: "50%",
    padding: 8,
  },
  info_left: {
    borderRightWidth: 0.7,
    borderRightColor: chartTheme.border,
  },
  info_right: {},
  infoHeading: {
    marginBottom: 5,
    color: chartTheme.primary,
    fontSize: 9,
    fontWeight: 700,
  },
  infoLine: {
    marginBottom: 3,
    color: chartTheme.text,
    fontSize: 8,
    lineHeight: 1.3,
  },
  infoLabel: {
    fontWeight: 700,
  },
});
