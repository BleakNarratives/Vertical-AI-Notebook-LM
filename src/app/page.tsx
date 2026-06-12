'use client';

import { ModuleButton } from "@/components/ModuleButton";
import { Persona } from "@/components/AI/Persona";
import { Papers } from "@/components/Boardroom/Papers";
import { Honeytoken } from "@/components/Boardroom/Honeytoken";
import { useHiggins } from "@/hooks/useHiggins";
import { usePytch } from "@/hooks/usePytch";
import { useZeroclaw } from "@/hooks/useZeroclaw";
import { useSentinel } from "@/hooks/useSentinel";
import { useMoltAutomation } from "@/hooks/useMoltAutomation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isLockdown, isBlacklisted, level, isImproving, triggerMolt } = useMoltAutomation();
  const { consultHiggins, isProcessing: isHigginsActive } = useHiggins();
  const { wakePytch, isConstructing: isPytchActive } = usePytch();
  const { triggerSwarm, isSwarming: isZeroclawActive } = useZeroclaw();
  const { logSecurityEvent } = useSentinel();
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    logSecurityEvent('Home module initialized', 'LOW');
  }, [logSecurityEvent]);

  useEffect(() => {
    let count = 0;
    const handleBreach = () => {
      count++;
      if (count >= 3) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 2000);
        count = 0;
      }
    };

    window.addEventListener('sentinel-decoy-breach', handleBreach);
    return () => window.removeEventListener('sentinel-decoy-breach', handleBreach);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-between h-full gap-8 p-8 py-16 transition-all duration-75 ${isGlitching || isBlacklisted ? 'animate-pulse bg-neon-red/30' : ''}`}>
      {isGlitching && (
        <div className="fixed inset-0 z-[200] pointer-events-none bg-white/5 mix-blend-overlay animate-glitch" />
      )}
      {isBlacklisted && (
        <div className="fixed inset-0 z-[300] bg-neon-red/20 mix-blend-multiply flex items-center justify-center pointer-events-none">
          <div className="border-4 border-neon-red p-8 bg-obsidian/90 shadow-[0_0_100px_rgba(255,0,0,0.6)] animate-bounce">
            <h2 className="text-6xl font-black text-neon-red uppercase tracking-[0.5em] text-center">
              SYSTEM BANNED
            </h2>
            <p className="text-neon-red font-mono text-center mt-4 tracking-widest text-sm">
              ACCESS REVOKED BY SENTINEL PROTOCOL [24H]
            </p>
          </div>
        </div>
      )}
      {/* Top of the table - Personas */}
      <div className="relative w-full flex justify-center gap-4 md:gap-8 scale-75 md:scale-90 pointer-events-auto mb-12">
        <div className="flex flex-col items-center gap-2">
          <Persona
            name="Mrs. Higgins"
            role="Gateway"
            status={isHigginsActive ? 'active' : 'idle'}
            onClick={(e) => consultHiggins(e)}
            disabled={isLockdown || isBlacklisted}
          />
          <div className="pointer-events-auto">
            <Papers context="higgins" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Persona
            name="Pytch"
            role="Architect"
            status={isPytchActive ? 'active' : 'idle'}
            onClick={(e) => wakePytch(e)}
            disabled={isLockdown || isBlacklisted}
          />
          <div className="pointer-events-auto">
            <Papers context="pytch" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Persona
            name="Twoie"
            role="Execution"
            status={isImproving ? 'active' : 'idle'}
            onClick={(e) => triggerMolt(e)}
            disabled={isLockdown || isBlacklisted}
          />
          <div className="pointer-events-auto">
            <Papers context="twoie" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Persona
            name="Zeroclaw"
            role="Distributed"
            status={isZeroclawActive ? 'active' : 'idle'}
            onClick={(e) => triggerSwarm(e)}
            disabled={isLockdown || isBlacklisted}
          />
          <div className="pointer-events-auto">
            <Papers context="zeroclaw" />
          </div>
        </div>
      </div>

      <div className="space-y-4 text-center z-10 flex-1 flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase">
          Vertical AI <br/>
          <span className="text-neon-red">Notebook LM</span>
        </h1>
        <p className="text-grey-medium font-mono text-sm max-w-md mx-auto">
          Welcome to the Code City. Immersive execution environment for bleak narratives and recursive improvement.
          {isLockdown && (
            <span aria-live="assertive" className="block mt-2 text-neon-red font-bold animate-pulse">
              [ SYSTEM LOCKDOWN ACTIVE ]
            </span>
          )}
          {level > 0 && !isLockdown && (
            <span aria-live="polite" className="block mt-2 text-neon-amber animate-pulse">
              Current Molt Level: {level}
            </span>
          )}
        </p>
        {isBlacklisted ? (
          <div aria-live="assertive" className="mt-4 p-2 border-2 border-neon-red bg-neon-red text-obsidian font-mono text-sm font-bold animate-pulse">
            [ SESSION BLOCK ACTIVE ] - ACCESS DENIED BY OBELISK SECURITY
          </div>
        ) : isLockdown && (
          <div aria-live="assertive" className="mt-4 p-2 border border-neon-red bg-neon-red/10 text-neon-red font-mono text-xs animate-pulse">
            [ SYSTEM LOCKDOWN ACTIVE ] - SECURITY BREACH COUNTERMEASURES ENGAGED
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <ModuleButton
          label={isImproving ? "Improving..." : "Initialize Molt"}
          variant="primary"
          onClick={(e) => triggerMolt(e)}
          isLoading={isImproving}
          disabled={isLockdown}
        />
        <ModuleButton
          label={isHigginsActive ? "Consulting..." : "Consult Higgins"}
          variant="secondary"
          onClick={(e) => consultHiggins(e)}
          isLoading={isHigginsActive}
          disabled={isLockdown}
        />
        <ModuleButton
          label={isPytchActive ? "Awakening..." : "Wake Pytch"}
          variant="secondary"
          onClick={(e) => wakePytch(e)}
          isLoading={isPytchActive}
          disabled={isLockdown}
        />
        <ModuleButton
          label={isZeroclawActive ? "Swarming..." : "Zeroclaw Swarm"}
          variant="secondary"
          onClick={(e) => triggerSwarm(e)}
          isLoading={isZeroclawActive}
          disabled={isLockdown}
        />
      </div>

      <Honeytoken />

      <div className="absolute bottom-12 right-12 opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <span className="text-[10px] font-mono text-neon-amber">
          Looking for Easter eggs? Try the obsidian shadows.
        </span>
      </div>
    </div>
  );
}
