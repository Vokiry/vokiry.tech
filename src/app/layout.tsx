import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionProvider } from "@/components/SectionContext";

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
  title: "vokiry.tech // станция",
  description: "Дурной вайбкодер × Медианищета // Личная станция и лаборатория",
  keywords: ["vokiry", "вайбкод", "стримы", "медианищета", "костыли", "twitch", "разработка"],
  authors: [{ name: "vokiry" }],
  openGraph: {
    title: "vokiry.tech // станция",
    description: "Дурной вайбкодер × Медианищета",
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
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] bg-tactical-grid">
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
