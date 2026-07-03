import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "DEEP DIVE STUDIO | Vertical AI Notebook LM",
  description:
    "An interactive, infographic-driven audio boardroom. Watch the Vertical AI agents debate your sources in a live 3D Code City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-obsidian selection:bg-neon-red selection:text-obsidian scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-obsidian text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neon-red focus:text-obsidian focus:font-mono focus:text-xs uppercase tracking-widest outline-none"
        >
          Skip to main content
        </a>

        <header className="h-14 shrink-0 border-b border-grey-dark flex items-center px-5 md:px-8 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50">
          <Link
            href="/"
            className="text-neon-red font-mono text-sm md:text-base tracking-[0.3em] font-bold"
          >
            CODE CITY <span className="text-grey-medium">// STUDIO</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 md:gap-6 font-mono text-[10px] uppercase tracking-widest">
            <Link
              href="/"
              className="text-white/70 hover:text-neon-cyan transition-colors"
            >
              Deep Dive
            </Link>
            <Link
              href="/code-city"
              className="text-white/70 hover:text-neon-red transition-colors"
            >
              Boardroom
            </Link>
            <span className="hidden sm:flex items-center gap-2 text-neon-amber">
              <span className="h-2 w-2 rounded-full bg-neon-amber animate-pulse" />
              Link Active
            </span>
          </nav>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 relative flex flex-col">
          {children}
        </main>

        <footer className="h-7 shrink-0 border-t border-grey-dark flex items-center px-5 md:px-8 bg-obsidian text-[10px] font-mono text-grey-medium uppercase tracking-widest">
          <span>[ BLEAK NARRATIVES ]</span>
          <span className="ml-auto">TERM: 2829543670389124673</span>
        </footer>
      </body>
    </html>
  );
}
