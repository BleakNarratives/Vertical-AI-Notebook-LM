import { ModuleButton } from "@/components/ModuleButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-12 p-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase">
          Vertical AI <br/>
          <span className="text-neon-red">Notebook LM</span>
        </h1>
        <p className="text-grey-medium font-mono text-sm max-w-md mx-auto">
          Welcome to the Code City. Immersive execution environment for bleak narratives and recursive improvement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <ModuleButton label="Initialize Molt" variant="primary" />
        <ModuleButton label="Consult Higgins" variant="secondary" />
        <ModuleButton label="Wake Pytch" variant="secondary" />
        <ModuleButton label="Zeroclaw Swarm" variant="secondary" />
      </div>

      <div className="absolute bottom-12 right-12 opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <span className="text-[10px] font-mono text-neon-amber">
          Looking for Easter eggs? Try the obsidian shadows.
        </span>
      </div>
    </div>
  );
}
