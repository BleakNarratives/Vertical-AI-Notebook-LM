export type AgentConfig = {
  id: string;
  name: string;
  role: string;
  hook: string;
};

export const agents: AgentConfig[] = [
  {
    id: 'higgins',
    name: 'Mrs. Higgins',
    role: 'Front Desk Lady / Gateway Protocol',
    hook: 'src/hooks/useHiggins.ts'
  },
  {
    id: 'pytch',
    name: 'Pytch',
    role: 'Narrative Architect',
    hook: 'src/hooks/usePytch.ts'
  },
  {
    id: 'twoie',
    name: 'Twoie',
    role: 'Execution Specialist',
    hook: 'src/hooks/useTwoie.ts'
  },
  {
    id: 'zeroclaw',
    name: 'Zeroclaw Swarm',
    role: 'Distributed Intelligence',
    hook: 'src/hooks/useZeroclaw.ts'
  }
];

export const triggerAgent = (agentId: string) => {
  console.log(`Agent Triggered: ${agentId} - Awaiting voodoo doll synchronization...`);
  // Dispatch custom event for UI feedback
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('agent-trigger', { detail: { agentId } }));
  }
};
