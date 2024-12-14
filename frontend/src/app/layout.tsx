import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import Navigation from "@/components/navigation/navigation";
import BigNavigation from "@/components/navigation/big-nav";
import MobileNavigation from "@/components/navigation/mobile-nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "UK Malifaux Community",
  description: "Work in Progress!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-green-100`}
      >
        <div className="container max-w-screen-md md:mx-auto p-4">
          <div className="flex justify-between items-center text-l font-bold">
            <BigNavigation />
            <MobileNavigation />

            <h1 className="text-3xl font-bold text-right p-1 siz">
              <Link href="/">UK Malifaux Community</Link>
            </h1>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
