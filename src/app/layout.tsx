import { EasterEgg } from "@/components/AI/EasterEgg";
import { SecurityOverlay } from "@/components/SecurityOverlay";
import { CoffeeMug } from "@/components/Boardroom/CoffeeMug";
import { Laptop } from "@/components/Boardroom/Laptop";
import { Whiteboard } from "@/components/Boardroom/Whiteboard";
import { VideoViewer } from "@/components/Boardroom/VideoViewer";
import { Papers } from "@/components/Boardroom/Papers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CODE CITY | VERTICAL AI",
  description: "Immersive execution environment for bleak narratives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-obsidian selection:bg-neon-red selection:text-obsidian scroll-smooth">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neon-red focus:text-obsidian focus:font-mono focus:text-xs uppercase tracking-widest outline-none"
        >
          Skip to main content
        </a>

        {/* Obelisk Center Layout */}
        <header className="h-16 border-b border-grey-dark flex items-center px-8 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50">
          <div className="text-neon-red font-mono text-lg tracking-[0.3em] font-bold">
            CODE CITY // <span className="text-grey-medium">v0.1.0</span>
          </div>
          <div className="ml-auto flex gap-4">
             <div className="h-2 w-2 rounded-full bg-neon-amber animate-pulse" />
             <span className="text-[10px] font-mono text-neon-amber uppercase tracking-tighter">System Link Active</span>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 relative flex flex-col items-center justify-center p-4 [perspective:1000px] overflow-hidden">
          {/* Floor/Table Shadow */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-60 pointer-events-none" />

          {/* Central Obelisk container - with Boardroom Perspective */}
          <div className="w-full max-w-5xl min-h-[75vh] border-x border-grey-dark bg-gradient-to-b from-grey-dark/10 via-obsidian to-obsidian relative [transform:rotateX(20deg)_translateZ(0)] transform-gpu shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-30" />

             {/* Perspective Background Elements - Simulated Table Surface */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
             <div className="absolute -bottom-20 -left-20 -right-20 h-40 bg-obsidian blur-3xl opacity-50 -z-10" />

             <Whiteboard />
             <VideoViewer />

             <div className="relative z-10">
               {children}
             </div>

             {/* Boardroom Props */}
             <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-end gap-12 md:gap-24 pointer-events-auto z-20">
               <Papers />

               <Laptop />
               <CoffeeMug />
             </div>

             <EasterEgg />
             <SecurityOverlay />
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-amber to-transparent opacity-30" />
          </div>
        </main>

        <footer className="h-8 border-t border-grey-dark flex items-center px-8 bg-obsidian text-[10px] font-mono text-grey-medium uppercase tracking-widest">
          <span>[ BLEAK NARRATIVES ]</span>
          <span className="ml-auto">TERM: 2829543670389124673</span>
        </footer>
      </body>
    </html>
  );
}
