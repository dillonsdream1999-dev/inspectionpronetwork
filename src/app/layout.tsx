import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inspection Pro Network | Exclusive Bed Bug Territories",
  description: "Inspection Pro Network connects high-intent homeowners with licensed pest control operators through exclusive territory subscriptions. Powered by Bed Bug Inspection Pro.",
  keywords: ["pest control", "bed bug inspection", "territory", "leads", "pest control marketing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
