"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleButton from "@/components/ui/googlebutton";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("Signin clicked");
      if(!credentials.email || !credentials.password){
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }
      const res = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });
      console.log(res);
      router.push("/");
    } catch (err: any) {
      console.log(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your invoices and finances</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={handleChange} required />
          </div>
          <Button
            className="w-full"
            onClick={async () => {
              await handleSubmit();
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <div>{error && <p className="text-red-500">{error}</p>}</div>
          <Separator />
          <GoogleButton />
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
