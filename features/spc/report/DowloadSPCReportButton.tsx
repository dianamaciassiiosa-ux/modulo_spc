"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { SPC, StatiscalSummary } from "../type";
import { SPCReportDocument } from "./SPCReportDocument";

export function DownloadSPCReportButton({ spc,staticalSummary }: { spc: SPC; staticalSummary:StatiscalSummary }) {
  return (
    <PDFDownloadLink
      document={<SPCReportDocument spc={spc} staticalSummary={staticalSummary}/>}
      fileName={`SPC-${spc.feature_info.id}.pdf`}
    >
      {({ loading }) =>
        loading ? "Generando reporte..." : "Descargar PDF"
      }
    </PDFDownloadLink>
  );
}