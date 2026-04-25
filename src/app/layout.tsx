import { EasterEgg } from "@/components/AI/EasterEgg";
import { CoffeeMug } from "@/components/Boardroom/CoffeeMug";
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
    <html lang="en" className="bg-obsidian selection:bg-neon-red selection:text-obsidian">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
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

        <main className="flex-1 relative flex flex-col items-center justify-center p-4 [perspective:1000px]">
          {/* Central Obelisk container - with Boardroom Perspective */}
          <div className="w-full max-w-4xl min-h-[70vh] border-x border-grey-dark bg-grey-dark/20 relative [transform:rotateX(5deg)] transform-gpu shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-30" />
             {children}

             {/* Boardroom Props */}
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-24 pointer-events-auto">
               <CoffeeMug />
               <div className="hidden md:block w-32 h-1 bg-grey-dark border-t border-grey-medium opacity-40 [transform:rotateX(45deg)]" title="Laptop Base" />
             </div>

             <EasterEgg />
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
