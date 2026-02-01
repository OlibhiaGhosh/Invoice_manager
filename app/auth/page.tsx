"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin")
  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-4">
        <div className="text-center text-secondary-foreground">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm opacity-80">Sign in or create an account</p>
        </div>

        <Card className="border-0 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-center">{tab === "signin" ? "Sign in" : "Create account"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-4">
                <AuthForm mode="signin" />
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <AuthForm mode="signup" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild className="bg-secondary text-secondary-foreground hover:opacity-90">
            <Link href="/dashboard">Continue to Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  return (
    <form className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor={`${mode}-email`}>Email</Label>
        <Input id={`${mode}-email`} type="email" placeholder="you@studio.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${mode}-password`}>Password</Label>
        <Input id={`${mode}-password`} type="password" placeholder="••••••••" />
      </div>
      {mode === "signup" && (
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" />
        </div>
      )}
      <Button type="button" className="w-full bg-accent text-accent-foreground hover:opacity-90">
        {mode === "signin" ? "Sign in" : "Create account"}
      </Button>
    </form>
  )
}
