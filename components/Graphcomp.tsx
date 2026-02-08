import { Graph } from "@/components/ui/graph";

export function InvoiceTrends() {
  return (
    <Graph
      title="Invoice Trends"
      data={{
        type: "bar",
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            label: "Revenue",
            data: [120000, 150000, 180000, 200000],
            color: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "Expenses",
            data: [80000, 95000, 110000, 125000],
            color: "rgba(255, 99, 132, 0.6)",
          },
        ],
      }}
      variant="bordered"
      size="lg"
      showLegend={true}
    />
  );
}