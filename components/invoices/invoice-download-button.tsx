"use client";
import React from 'react'
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

const InvoiceDownloadButton = ({invoice}: any) => {
  return (
    <div className="flex justify-end m-4">
            {" "}
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} />}
              fileName={`invoice-${invoice.invoice_id}.pdf`}
              className="bg-purple-400 p-2 rounded-lg font-bold"
            >
              {({ loading }) =>
                loading ? "Preparing PDF..." : "Download Invoice PDF"
              }
            </PDFDownloadLink>
          </div>
  )
}

export default InvoiceDownloadButton