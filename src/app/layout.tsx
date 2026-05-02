import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "My Portfolio",
    template: "%s | My Portfolio",
  },
  description:
    "A dynamic portfolio showcasing my projects, skills, and experience as a full-stack developer.",
  keywords: ["portfolio", "developer", "full-stack", "web development", "projects"],
  authors: [{ name: "Portfolio Owner" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "My Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
