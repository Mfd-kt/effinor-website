import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LangProvider from "@/components/LangProvider";
import SeoScripts from "@/components/SeoScripts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Effinor - Solutions d'efficacité énergétique",
  description: "Solutions techniques innovantes pour bâtiments professionnels, industriels et tertiaires",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr">
      <body className={`${inter.variable} font-sans antialiased bg-[#F9FAFB]`}>
        <SeoScripts />
        <LangProvider />
        {children}
      </body>
    </html>
  );
}