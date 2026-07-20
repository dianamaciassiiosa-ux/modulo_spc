import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { Snapshot } from "@/features/planner/gantt.types";
import { styles } from "../../spc/report/utils/styles";
import { GanttPDFReport } from "./ganttPDFReport";
import { createTaskHierarchy } from "./utils/logic";
import watermarkImage from "../../../public/images/siiosa-group-final.png";
import manufactureLogo from "../../../public/images/siiosa-manufactura-final.png";
import rdLogo from "../../../public/images/siiosa-rd.png";

interface PlannerReportDocumentProps {
  snapshot: Snapshot;
  startDate: string;
  endDate: string;
}

function formatISODate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function PlannerReportDocument({
  snapshot,
  startDate,
  endDate,
}: PlannerReportDocumentProps) {
  const hierarchicalTasks = createTaskHierarchy(snapshot.tasks);

  return (
    <Document
      title={`Reporte Planner - ${snapshot.title}`}
      author="Modulos APS-Strategos IA"
      subject="Planificacion de produccion"
    >
      <Page size="A4" style={styles.page} orientation="landscape">
        <Image fixed src={watermarkImage.src} style={styles.logo_header} />
        <Image
          fixed
          src={manufactureLogo.src}
          style={[styles.logo_header, { left: 70 }]}
        />
        <Image
          fixed
          src={rdLogo.src}
          style={[styles.logo_header, { left: 110 }]}
        />

        <Text fixed style={styles.right_header}>
          Plan: {snapshot.title}
        </Text>
        <Text fixed style={styles.right_header}>
          Fecha: {new Date().toLocaleString("es-MX")}
        </Text>

        <Text style={styles.title}>Reporte de planificacion</Text>
        <Text style={styles.subtitle}>
          {formatISODate(startDate)} - {formatISODate(endDate)}
        </Text>
        {snapshot.description && (
          <Text style={{ textAlign: "center", color: "#475569" }}>
            {snapshot.description}
          </Text>
        )}

        <GanttPDFReport
          hierarchicalTask={hierarchicalTasks}
          startDate={startDate}
          endDate={endDate}
        />

        <Image fixed src={watermarkImage.src} style={styles.watermark_landscape} />
        <View fixed style={styles.notice}>
          <Text>
            CONFIDENCIAL - Uso exclusivo interno SIIOSA GROUP. Prohibida su
            reproduccion o distribucion sin autorizacion
          </Text>
        </View>
        <Text
          fixed
          style={styles.pagNumber}
          render={({ pageNumber, totalPages }) =>
            `Pagina ${pageNumber} de ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
