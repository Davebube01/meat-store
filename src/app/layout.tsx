import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CoreProvider } from "@/core/providers/CoreProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeatStore | Quality Goat Meat & More",
  description: "Fresh, quality goat meat and vegetables delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CoreProvider>
          {children}
        </CoreProvider>
      </body>
    </html>
  );
}

