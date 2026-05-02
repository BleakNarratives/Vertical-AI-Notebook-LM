'use client';

import { ModuleButton } from "@/components/ModuleButton";
import { Persona } from "@/components/AI/Persona";
import { Papers } from "@/components/Boardroom/Papers";
import { useHiggins } from "@/hooks/useHiggins";
import { usePytch } from "@/hooks/usePytch";
import { useZeroclaw } from "@/hooks/useZeroclaw";
import { useSentinel } from "@/hooks/useSentinel";
import { useMoltAutomation } from "@/hooks/useMoltAutomation";
import { useEffect } from "react";

export default function Home() {
  const { level, isImproving, triggerMolt, isLockdown } = useMoltAutomation();
  const { consultHiggins, isProcessing: isHigginsActive } = useHiggins();
  const { wakePytch, isConstructing: isPytchActive } = usePytch();
  const { triggerSwarm, isSwarming: isZeroclawActive } = useZeroclaw();
  const { logSecurityEvent } = useSentinel();

  useEffect(() => {
    logSecurityEvent('Home module initialized', 'LOW');
  }, [logSecurityEvent]);

  return (
    <div className="flex flex-col items-center justify-between h-full gap-8 p-8 py-16">
      {/* Top of the table - Personas */}
      <div className="relative w-full flex justify-center gap-4 md:gap-8 scale-75 md:scale-90 pointer-events-none mb-12">
        <div className="flex flex-col items-center gap-2">
          <Persona name="Mrs. Higgins" role="Gateway" status={isHigginsActive ? 'active' : 'idle'} />
          <div className="pointer-events-auto">
            <Papers context="higgins" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Persona name="Pytch" role="Architect" status={isPytchActive ? 'active' : 'idle'} />
          <div className="pointer-events-auto">
            <Papers context="pytch" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Persona name="Twoie" role="Execution" status={isImproving ? 'active' : 'idle'} />
          <div className="pointer-events-auto">
            <Papers context="twoie" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Persona name="Zeroclaw" role="Distributed" status={isZeroclawActive ? 'active' : 'idle'} />
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
          {level > 0 && (
            <span aria-live="polite" className="block mt-2 text-neon-amber animate-pulse">
              Current Molt Level: {level}
            </span>
          )}
        </p>
        {isLockdown && (
          <div aria-live="assertive" className="mt-4 p-2 border border-neon-red bg-neon-red/10 text-neon-red font-mono text-xs animate-pulse">
            [ SYSTEM LOCKDOWN ACTIVE ] - SECURITY BREACH COUNTERMEASURES ENGAGED
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <ModuleButton
          label={isImproving ? "Improving..." : "Initialize Molt"}
          variant="primary"
          onClick={triggerMolt}
          isLoading={isImproving}
          disabled={isLockdown}
        />
        <ModuleButton
          label={isHigginsActive ? "Consulting..." : "Consult Higgins"}
          variant="secondary"
          onClick={consultHiggins}
          isLoading={isHigginsActive}
          disabled={isLockdown}
        />
        <ModuleButton
          label={isPytchActive ? "Awakening..." : "Wake Pytch"}
          variant="secondary"
          onClick={wakePytch}
          isLoading={isPytchActive}
          disabled={isLockdown}
        />
        <ModuleButton
          label={isZeroclawActive ? "Swarming..." : "Zeroclaw Swarm"}
          variant="secondary"
          onClick={triggerSwarm}
          isLoading={isZeroclawActive}
          disabled={isLockdown}
        />
      </div>

      <div className="absolute bottom-12 right-12 opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <span className="text-[10px] font-mono text-neon-amber">
          Looking for Easter eggs? Try the obsidian shadows.
        </span>
      </div>
    </div>
  );
}
