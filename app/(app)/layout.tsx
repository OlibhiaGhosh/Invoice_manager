"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, FileText, CreditCard, LogOut } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/invoices", label: "Invoices", icon: FileText },
    { href: "/billing", label: "Billing", icon: CreditCard },
  ];
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block border-r bg-sidebar">
        <div className="p-4">
          <Link href="/" className="block">
            <div className="font-semibold tracking-tight text-foreground text-balance">
              Freelance Finance
            </div>
            <div className="text-sm text-muted-foreground">
              Invoices & money
            </div>
          </Link>
        </div>
        <nav className="px-2 py-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4 text-sm text-muted-foreground hidden md:block">
          <Card className="p-3">
            <p className="mb-2">Need more features?</p>
            <Button asChild size="sm" className="w-full">
              <Link href="/billing">Upgrade</Link>
            </Button>
          </Card>
        </div>
      </aside>

      <main className="flex flex-col">
        <header className="w-full border-b bg-card/80 text-card-foreground supports-[backdrop-filter]:backdrop-blur">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 md:hidden">
              <span className="font-semibold">Freelance Finance</span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href="/invoices/new">New Invoice</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-6xl p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
