import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AZ1 — Portfolio",
    template: "%s | AZ1",
  },
  description:
    "AZ1 — Full-Stack Developer crafting modern web applications with clean code, thoughtful design, and a passion for solving real problems.",
  keywords: ["portfolio", "developer", "full-stack", "web development", "projects", "AZ1"],
  authors: [{ name: "AZ1" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AZ1 Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  );
}
