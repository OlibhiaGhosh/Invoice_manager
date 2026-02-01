import type React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="mt-1 size-4 text-primary" />
      <span className="text-sm">{children}</span>
    </li>
  )
}

export function Plans() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      cta: "Get started",
      highlight: false,
      features: ["Up to 5 invoices / month", "Basic invoice template", "Mark paid/unpaid"],
    },
    {
      name: "Pro",
      price: "$12/mo",
      cta: "Upgrade to Pro",
      highlight: true,
      features: ["Unlimited invoices", "Custom logo & colors", "PDF export", "Payment tracking"],
    },
    {
      name: "Premium",
      price: "$29/mo",
      cta: "Go Premium",
      highlight: false,
      features: ["All Pro features", "Multiple businesses", "Priority support", "Advanced reports"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-balance">Choose a plan</h1>
        <p className="text-sm text-muted-foreground">Simple, transparent pricing. Upgrade anytime.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name} className={p.highlight ? "border-primary ring-1 ring-primary/20" : ""}>
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>{p.name}</span>
                <span className="text-lg font-semibold">{p.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {p.features.map((f) => (
                  <Feature key={f}>{f}</Feature>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={p.highlight ? "default" : "secondary"}>
                {p.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
