import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OverviewCards() {
  const items = [
    { label: "Balance", value: "$8,420", helper: "After upcoming payouts" },
    { label: "Overdue", value: "$1,240", helper: "2 invoices overdue" },
    { label: "This month", value: "$3,180", helper: "Income so far" },
    { label: "Open invoices", value: "6", helper: "Awaiting payment" },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label} className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{i.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{i.value}</div>
            <p className="text-xs text-muted-foreground">{i.helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
