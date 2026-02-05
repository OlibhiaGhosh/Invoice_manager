import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import InvoiceDownloadButton from "./invoice-download-button";

export const InvoicePreview = ({invoice}: any) => {
  return (
    <>
      <InvoiceDownloadButton invoice={invoice} />
      <PDFViewer width="1000" height="800" showToolbar={false}>
        <InvoicePDF
          invoice= {invoice}
        />
      </PDFViewer>
    </>
  );
};
