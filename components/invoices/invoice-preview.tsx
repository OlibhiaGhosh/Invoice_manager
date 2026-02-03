"use client";
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import Image from "next/image"

// export function InvoicePreview() {
//   const printDownload = () => {
//     // UI placeholder for PDF generation
//     window.print()
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Invoice Preview</h1>
//         <div className="flex gap-2">
//           <Button variant="secondary" onClick={() => history.back()}>
//             Back
//           </Button>
//           <Button onClick={printDownload}>Download PDF</Button>
//         </div>
//       </div>

//       <Card className="p-6 print:p-0">
//         <CardContent className="p-0">
//           <article className="mx-auto max-w-3xl bg-white text-black p-6 print:p-0">
//             <header className="flex items-start justify-between border-b pb-4">
//               <div>
//                 <h2 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
//                   Freelance Finance
//                 </h2>
//                 <p className="text-sm text-neutral-600">123 Sage St, Suite 10 · hello@you.com</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm">Invoice</div>
//                 <div className="text-xl font-semibold">INV-00126</div>
//                 <div className="text-sm">Due: 2025-09-10</div>
//               </div>
//             </header>

//             <section className="grid gap-2 py-4 md:grid-cols-2">
//               <div>
//                 <div className="text-sm font-medium">Bill to</div>
//                 <div>Acme Co.</div>
//                 <div className="text-sm text-neutral-600">acme@example.com</div>
//               </div>
//               <div className="md:text-right">
//                 <div className="text-sm font-medium">From</div>
//                 <div>Your Name / Studio</div>
//                 <div className="text-sm text-neutral-600">you@example.com</div>
//               </div>
//             </section>

//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-[#F5C9B0]/30">
//                   <th className="text-left p-2">Description</th>
//                   <th className="text-right p-2">Qty</th>
//                   <th className="text-right p-2">Price</th>
//                   <th className="text-right p-2">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-b">
//                   <td className="p-2">Design work</td>
//                   <td className="p-2 text-right">5</td>
//                   <td className="p-2 text-right">$80.00</td>
//                   <td className="p-2 text-right">$400.00</td>
//                 </tr>
//                 <tr>
//                   <td className="p-2">Landing page implementation</td>
//                   <td className="p-2 text-right">6</td>
//                   <td className="p-2 text-right">$100.00</td>
//                   <td className="p-2 text-right">$600.00</td>
//                 </tr>
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colSpan={3} className="p-2 text-right">
//                     Subtotal
//                   </td>
//                   <td className="p-2 text-right">$1,000.00</td>
//                 </tr>
//                 <tr>
//                   <td colSpan={3} className="p-2 text-right">
//                     Tax
//                   </td>
//                   <td className="p-2 text-right">$0.00</td>
//                 </tr>
//                 <tr className="border-t">
//                   <td colSpan={3} className="p-2 text-right font-semibold">
//                     Total
//                   </td>
//                   <td className="p-2 text-right font-semibold">$1,000.00</td>
//                 </tr>
//               </tfoot>
//             </table>

//             <p className="mt-6 text-sm">Notes: Payment by bank transfer within 15 days. Thank you!</p>

//             {/* <div className="mt-8 text-xs text-neutral-500">
//               <div className="flex items-center gap-2">
//                 <span className="sr-only">Brand palette</span>
//                 <Image
//                   src="/images/palette.jpg"
//                   alt="Brand color palette (forest green, sage, peach, off-white)"
//                   width={120}
//                   height={60}
//                 />
//               </div>
//             </div> */}
//           </article>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
import React from "react";
import ReactDOM from "react-dom/client";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
const invoice = {
  id: "INV-00126",
  date: "2025-08-26",
  clientName: "Acme Co.",
  clientEmail: "contact@acme.com",
  companyLogo: "",
  items: [
    { name: "Design work", quantity: 5, amount: 400.0 },
    { name: "Landing page implementation", quantity: 6, amount: 600.0 },
  ],
  totalAmount: 1000.0034,
  notes: "Payment by bank transfer within 15 days. Thank you!",
};
export const InvoicePreview = () => {
  return (
    <>
      <div className="flex justify-end m-4">
        {" "}
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} />}
          fileName={`invoice-${invoice.id}.pdf`}
          className="bg-purple-400 p-2 rounded-lg font-bold"
        >
          {({ loading }) =>
            loading ? "Preparing PDF..." : "Download Invoice PDF"
          }
        </PDFDownloadLink>
      </div>
      <PDFViewer width="1100" height="800" showToolbar={false}>
        <InvoicePDF
          invoice={{
            id: "INV-00126",
            date: "2025-08-26",
            clientName: "Acme Co.",
            clientEmail: "contact@acme.com",
            companyLogo: "",
            items: [
              { name: "Design work", quantity: 5, amount: 400.0 },
              {
                name: "Landing page implementation",
                quantity: 6,
                amount: 600.0,
              },
            ],
            totalAmount: 1000.0034,
            notes: "Payment by bank transfer within 15 days. Thank you!",
          }}
        />
      </PDFViewer>
    </>
  );
};
// const root = ReactDOM.createRoot(document.getElementById("root")!);
// root.render(<InvoicePreview />);
