'use client';

import { ModuleButton } from "@/components/ModuleButton";
import { useMolt } from "@/hooks/useMolt";
import { useHiggins } from "@/hooks/useHiggins";
import { usePytch } from "@/hooks/usePytch";
import { useZeroclaw } from "@/hooks/useZeroclaw";
import { useSentinel } from "@/hooks/useSentinel";
import { useMoltAutomation } from "@/hooks/useMoltAutomation";
import { useEffect } from "react";

export default function Home() {
  const { isLockdown } = useMoltAutomation();
  const { level, isImproving, triggerMolt } = useMolt();
  const { consultHiggins, isProcessing: isHigginsActive } = useHiggins();
  const { wakePytch, isConstructing: isPytchActive } = usePytch();
  const { triggerSwarm, isSwarming: isZeroclawActive } = useZeroclaw();
  const { logSecurityEvent } = useSentinel();

  useEffect(() => {
    logSecurityEvent('Home module initialized', 'LOW');
  }, [logSecurityEvent]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-12 p-8">
      <div className="space-y-4 text-center">
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
