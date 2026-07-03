import { EasterEgg } from "@/components/AI/EasterEgg";
import { SecurityOverlay } from "@/components/SecurityOverlay";
import { SentinelIntegrity } from "@/components/SentinelIntegrity";
import { CoffeeMug } from "@/components/Boardroom/CoffeeMug";
import { Laptop } from "@/components/Boardroom/Laptop";
import { Whiteboard } from "@/components/Boardroom/Whiteboard";
import { VideoViewer } from "@/components/Boardroom/VideoViewer";
import { Papers } from "@/components/Boardroom/Papers";
import { PerspectiveWrapper } from "@/components/Boardroom/PerspectiveWrapper";

/**
 * CodeCityChrome - the original 2D perspective "boardroom" shell.
 * Extracted from the old root layout so the new full-screen Studio can
 * live at the root without inheriting this heavy decorative frame.
 */
export function CodeCityChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 relative flex flex-col items-center justify-center p-4 [perspective:1000px] overflow-hidden">
      {/* Floor/Table Shadow */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-60 pointer-events-none" />

      {/* Central Obelisk container - with Boardroom Perspective */}
      <div className="w-full max-w-5xl min-h-[75vh] border-x border-grey-dark bg-gradient-to-b from-grey-dark/10 via-obsidian to-obsidian relative transform-gpu shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
        <PerspectiveWrapper>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-30" />

          {/* Perspective Background Elements - Simulated Table Surface */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [mask-image:linear-gradient(to_top,black_20%,transparent_80%)]" />
          <div className="absolute -bottom-20 -left-20 -right-20 h-40 bg-obsidian blur-3xl opacity-50 -z-10" />

          <Whiteboard />
          <VideoViewer />

          <div className="relative z-10">{children}</div>

          {/* Boardroom Props */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-12 md:gap-24 pointer-events-auto z-20 scale-75 md:scale-90 origin-bottom">
            <Papers context="user" />
            <Laptop />
            <CoffeeMug />
          </div>

          <EasterEgg />
          <SecurityOverlay />
          <SentinelIntegrity />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-amber to-transparent opacity-30" />
        </PerspectiveWrapper>
      </div>
    </div>
  );
}
