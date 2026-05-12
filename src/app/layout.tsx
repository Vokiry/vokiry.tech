import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionProvider } from "@/components/SectionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vokiry.tech",
  description: "Developer portfolio, utilities, and blog",
  keywords: ["developer", "portfolio", "utilities", "blog", "tools"],
  authors: [{ name: "vokiry" }],
  openGraph: {
    title: "vokiry.tech",
    description: "Developer portfolio, utilities, and blog",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)]">
        <SectionProvider>
          <div className="crt-scanlines" aria-hidden />
          <div className="crt-vignette" aria-hidden />
          <Navigation />
          <main className="flex-1 md:pl-64 relative z-[2]">
            {children}
          </main>
          <Footer />
        </SectionProvider>
      </body>
    </html>
  );
}