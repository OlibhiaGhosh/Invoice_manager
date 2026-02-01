import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card text-card-foreground">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Jump into your work:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/invoices/new">Create Invoice</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/invoices">View Invoices</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
