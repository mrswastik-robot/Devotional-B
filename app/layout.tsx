import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen pt-12 bg-[#F1F2F2] dark:bg-[#181818]")}>
        <Providers>
          <Navbar />
          <div className="container max-w-7xl mx-auto h-full pt-12 ">
          {children}
          </div>
        </Providers> 
      </body>
    </html>
  );
}
