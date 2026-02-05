import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Font registration removed - using default fonts for compatibility

// Invoice PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  billTo: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
  table: {
    Display: "table",
    width: "auto",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bbb",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "40%",
    backgroundColor: "#eee",
    borderRight: "1px solid #bbb",
    padding: 5,
  },
  tableCol: {
    width: "40%",
    borderRight: "1px solid #bbb",
    padding: 5,
  },
  tableColAmount: {
    width: "20%",
    padding: 5,
    textAlign: "right",
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  totalLabel: {
    width: "80%",
    textAlign: "right",
    paddingRight: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
  totalValue: {
    width: "20%",
    textAlign: "right",
    fontSize: 12,
    fontWeight: "bold",
  },
});
export default function InvoicePDF({ invoice }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* {invoice.companyLogo && (
            <Image style={styles.logo} src={invoice.companyLogo} />
          )} */}
          <Text style={styles.title}>INVOICE</Text>
        </View>

        {/* Bill To & Invoice Info */}
        <View style={styles.section}>
          <Text style={styles.billTo}>Bill To:</Text>
          <Text>{invoice.client_company_name}</Text>
          <Text>{invoice.client_email}</Text>
          <Text>{invoice.client_address}</Text>
          <Text>Invoice ID: {invoice.invoice_id}</Text>
          <Text>Issue Date: {invoice.issue_date}</Text>
          <Text>Due Date: {invoice.due_date}</Text>
        </View>

        {/* Invoice Items Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Quantity</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Amount</Text>
            </View>
          </View>

          {Array.isArray(invoice?.items) &&
            invoice.items.map((item: any, idx: any) => (
              <View style={styles.tableRow} key={idx}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.description}</Text>
                </View>

                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.qty}</Text>
                </View>

                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    ₹{Number(item.price || 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Totals */}
        {/* <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>₹{invoice.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax ({invoice.tax}%):</Text>
          <Text style={styles.totalValue}>₹{invoice.taxAmount.toFixed(2)}</Text>
        </View> */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            ₹{Number(invoice?.total_amount || 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.billTo}>Note:</Text>
          <Text>{invoice.notes}</Text>
        </View>
      </Page>
    </Document>
  );
}
