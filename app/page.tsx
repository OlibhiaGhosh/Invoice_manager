"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signOut, useSession } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserMenu } from "@/components/userMenu";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main className="min-h-dvh bg-background text-main-text">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="sr-only">Freelance Finance</span>
          <span aria-hidden className="text-xl">
            Freelance Finance
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          {!session ? (
            <Link
              href="/signin"
              className="font-semibold text-sm underline-offset-4 hover:underline bg-accent text-accent-foreground hover:opacity-90 px-4 py-2 rounded-md hover:scale-105 transition-all duration-150"
            >
              Sign in
            </Link>
          ) : (
            UserMenu({
              userName: session?.user?.name || "",
              userEmail: session?.user?.email || "",
              onSignOut: () => signOut(),
              onProfileClick: () => console.log("Profile clicked"),
            })
          )}
          <Button
            
            className="bg-secondary text-secondary-foreground hover:opacity-90 hover:scale-105 transition-all duration-150"
            onClick={() => {
              {session ? router.push("/dashboard") : router.push("/signin")}
            }}
          >
            Enter App
          </Button>
        </nav>
      </header>
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <h1 className="text-pretty text-4xl font-semibold leading-tight md:text-5xl">
              Create invoices in minutes. Track payments with ease.
            </h1>
            <p className="text-pretty text-sm/relaxed md:text-base">
              An elegant, fast UI for freelancers to generate invoices, manage
              clients, and understand cash flow. You bring the backend; this
              ships the experience.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:opacity-90 hover:scale-105 transition-all duration-150"
              >
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:opacity-90 hover:scale-105 transition-all duration-150"
                variant="default"
              >
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
            <p className="text-xs/relaxed opacity-80">
              Free plan available. Upgrade any time.
            </p>
          </div>

          <Card className="border-0 bg-card-foreground text-card shadow-md hover:scale-105 transition-all duration-150 ">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-card">Current Balance</p>
                    <p className="mt-1 text-2xl font-semibold">$8,420.00</p>
                  </div>
                  <div className="rounded-md bg-sidebar-primary px-3 py-2 text-sm font-medium text-secondary">
                    +$1,240 this month
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3 ">
                  <Stat label="Paid" value="$3,200" />
                  <Stat label="Overdue" value="$540" />
                  <Stat label="Unpaid" value="$1,100" />
                </div>
                <div className="rounded-md bg-muted-foreground p-4 text-sm">
                  Create, send, and download PDF invoices with one click. Keep
                  your history forever.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature
            title="Invoice Builder"
            description="Line items, taxes, discounts, notes—and a beautiful PDF."
          />
          <Feature
            title="Payment Tracking"
            description="Mark paid/unpaid, record payments, and see overdue."
          />
          <Feature
            title="Insights"
            description="Recent income, balances, and trends at a glance."
          />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-8 text-xs opacity-70">
        © {new Date().getFullYear()} Freelance Finance
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card-foreground p-4 text-card">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-md border bg-chart-3 hover:bg-card p-5 hover:scale-105 transition-all duration-150">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
