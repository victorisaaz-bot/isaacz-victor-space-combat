import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prime Edge — Arcade Shooting Simulation",
  description: "Experience the fastest, most precise browser-based arcade shooting range. Master target tracking, chain high-scoring combos, and top global leaderboards.",
  keywords: ["shooting game", "arcade shooter", "aim trainer", "browser game", "reaction time", "Prime Edge"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-prime-bg text-prime-text cyber-grid`}>
        <Navbar />
        <main className="flex-1 flex flex-col relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

