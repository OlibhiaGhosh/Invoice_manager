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
import { Separator } from "@/components/ui/separator";
import GoogleButton from "@/components/ui/googlebutton";
import { useState } from "react";
import Axios from "axios";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await Axios.post("/api/auth/signup", data);
      console.log(res);
      if (res.status === 201) {
        router.push("/signin");
      }
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Start sending invoices</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input id="company_name" type="text" onChange={handleChange} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
          {error && (<p className="text-sm text-red-600 text-center">{error}</p>)}
          <Separator />
          <GoogleButton />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
