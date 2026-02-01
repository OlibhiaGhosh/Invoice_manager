import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Suspense } from "react";
import { Providers } from "./provider";

export const metadata: Metadata = {
  title: "Freelance Finance",
  description: "Invoice generator and financial manager UI",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body
        className={`antialiased font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Providers>
        <Suspense fallback={null}>
          {/* <ThemeProvider
            attribute="class"
            defaultTheme="dark"
        enableSystem={false}
          > */}
            {children}
          {/* </ThemeProvider> */}
        </Suspense>
        <Analytics />
        </Providers>
      </body>
    </html>
  );
}
