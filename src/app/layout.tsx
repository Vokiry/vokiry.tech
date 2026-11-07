import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionProvider } from "@/components/SectionContext";
import { StationRadarWatermark } from "@/components/StationRadarWatermark";
import { siteConfig } from "@/lib/siteConfig";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: siteConfig.author.title,
  description: `${siteConfig.author.role} // Личная станция и лаборатория`,
  keywords: [
    siteConfig.author.name,
    "вайбкод",
    "стримы",
    "медианищета",
    "костыли",
    "twitch",
    "tui",
    "system24",
  ],
  authors: [{ name: siteConfig.author.name }],
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    title: siteConfig.author.title,
    description: `${siteConfig.author.role} // Личная станция`,
    url: siteConfig.siteUrl,
    siteName: siteConfig.author.title,
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} font-sans`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] bg-tactical-grid relative">
        <StationRadarWatermark />
        <SectionProvider>
          <Navigation />
          <main className="flex-1 w-full relative z-[1]">
            {children}
          </main>
          <Footer />
        </SectionProvider>
      </body>
    </html>
  );
}
