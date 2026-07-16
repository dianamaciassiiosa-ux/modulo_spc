import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { SPC, StatiscalSummary } from "../type";
import { ReportControlChart } from "./ReportControlChart";
import { ReportCapabilityChart } from "./ReportCapabilityChart";
import { ReportMeasurementsTable } from "./ReportMeasurementsTable";
import watermarkImage from "../../../public/images/siiosa-group-final.png";
import manufactureLogo from "../../../public/images/siiosa-manufactura-final.png"
import rdLogo from "../../../public/images/siiosa-rd.png"
import { styles } from "./utils/styles";

interface Props {
  spc: SPC;
  staticalSummary: StatiscalSummary;
}

export function SPCReportDocument({ spc, staticalSummary }: Props) {
  return (
    <Document
      title={`Reporte SPC - ${spc.feature_info.name}`}
      author="Sistema SPC"
      subject="Control Estadístico del Proceso"
    >
      <Page size="A4" style={styles.page}>
        <Image
          fixed
          src={watermarkImage.src}
          style={styles.logo_header}
        />
        <Image
          fixed
          src={manufactureLogo.src}
          style={[styles.logo_header, {left:70}]}
        />
        <Image
          fixed
          src={rdLogo.src}
          style={[styles.logo_header, {left:110}]}
        />

        <Text
          fixed
          style={styles.right_header}>
          Código de producción: 3783718
        </Text>
        <Text
          fixed
          style={styles.right_header}>
          Revision: 01
        </Text>
        
        <Text fixed style={styles.right_header}>
          Date: {new Date().toLocaleString()}
        </Text>
        <Text style={styles.title}>Control Estadistico de Procesos</Text>

        <Text>Característica: {spc.feature_info.name}</Text>
        <Text>Identificador: {spc.feature_info.id}</Text>

        <ReportMeasurementsTable
          subgroups={spc.subgroups}
          specification={spc.specifications}
        />

        <ReportControlChart subgroups={spc.subgroups} limits={spc.x_chart} type="x" />
        <ReportControlChart subgroups={spc.subgroups} limits={spc.r_chart} type="r" />
        
        <ReportCapabilityChart
          statilcalSummary={staticalSummary}
          bins={spc.histogram}
          specification={spc.specifications}
        />
        <Image
          fixed
          src={watermarkImage.src}
          style={styles.watermark}
        />
         <View
          fixed 
          style={styles.notice}>
          <Text>
            CONFIDENCIAL – Uso exclusivo interno SIIOSA GROUP. Prohibida su reproducción o distribución sin autorización
          </Text>
        </View>
        <Text
          fixed
          style={styles.pagNumber}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
        />
       
      </Page>
    </Document>
  );
}


