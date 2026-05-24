import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JARVIS Platform | Voice AI for Everyone",
  description: "Build Voice AI Agents in minutes. Add voice intelligence to any app with one API key.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased bg-[#0a0a0f] text-[#e8e8f0] min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
