import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/ThemeProvider";
import { StoreProvider } from "@/store/StoreProvider";
import { Toaster } from "@/components/ui/toaster";

import { GeistSans } from 'geist/font/sans';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Devotional-B",
  description: "Get all your answers here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={cn(GeistSans.className, "antialiased min-h-screen pt-12 bg-[#F1F2F2] dark:bg-[#181818]")}>
          <Providers>
            <Navbar />
            <div className="md:container md:max-w-7xl md:mx-auto h-full pt-4 ">
            {children}
            </div>
            <Toaster />
          </Providers> 
        </body>
      </html>
    </StoreProvider>
  );
}
