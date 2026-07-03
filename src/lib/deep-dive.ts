/**
 * Deep Dive data model.
 *
 * A Deep Dive is the visual + spoken "audio overview" produced by the Vertical AI
 * boardroom. It is a sequence of segments; each segment is spoken by one agent and
 * is optionally paired with an infographic that renders as a hologram over the table.
 */

export type AgentId = "higgins" | "pytch" | "twoie" | "zeroclaw";

export type AgentVisual = {
  id: AgentId;
  name: string;
  role: string;
  /** Short label shown on nameplates / orbs. */
  short: string;
  /** Hex color used for this agent's lighting, orb, and nameplate accents. */
  color: string;
  /** Seat angle in radians around the round table (0 = far side, facing camera). */
  angle: number;
  /** Preferred speech synthesis voice pitch/rate for character. */
  voice: { pitch: number; rate: number };
};

export const AGENTS: Record<AgentId, AgentVisual> = {
  higgins: {
    id: "higgins",
    name: "Mrs. Higgins",
    role: "Gateway Protocol",
    short: "HIGGINS",
    color: "#ffbf00",
    angle: -Math.PI * 0.75,
    voice: { pitch: 1.25, rate: 1.0 },
  },
  pytch: {
    id: "pytch",
    name: "Pytch",
    role: "Narrative Architect",
    short: "PYTCH",
    color: "#21e6ff",
    angle: Math.PI * 0.75,
    voice: { pitch: 0.85, rate: 1.02 },
  },
  twoie: {
    id: "twoie",
    name: "Twoie",
    role: "Execution Specialist",
    short: "TWOIE",
    color: "#35ff9e",
    angle: Math.PI * 0.25,
    voice: { pitch: 1.0, rate: 1.08 },
  },
  zeroclaw: {
    id: "zeroclaw",
    name: "Zeroclaw",
    role: "Distributed Intelligence",
    short: "ZEROCLAW",
    color: "#ff2b2b",
    angle: -Math.PI * 0.25,
    voice: { pitch: 0.7, rate: 0.96 },
  },
};

export const AGENT_LIST: AgentVisual[] = [
  AGENTS.higgins,
  AGENTS.pytch,
  AGENTS.twoie,
  AGENTS.zeroclaw,
];

export type InfographicType = "stat" | "bars" | "timeline" | "quote" | "comparison";

export type InfographicItem = {
  label: string;
  /** Numeric value 0-100 for bars, or a headline value for stats. */
  value?: number;
  /** Free-form display value (e.g. "3.2x", "$40k"). Overrides value for display. */
  display?: string;
  detail?: string;
};

export type Infographic = {
  type: InfographicType;
  title: string;
  caption?: string;
  items: InfographicItem[];
};

export type DeepDiveSegment = {
  id: string;
  speaker: AgentId;
  /** The spoken line. */
  text: string;
  /** Optional infographic shown while this segment plays. */
  infographic?: Infographic;
};

export type DeepDive = {
  topic: string;
  title: string;
  summary: string;
  segments: DeepDiveSegment[];
};

/** Rough spoken duration estimate for a line, used when TTS is muted. */
export function estimateDurationMs(text: string): number {
  const words = text.trim().split(/\s+/).length;
  // ~165 wpm speaking rate, clamped so nothing is jarringly short/long.
  return Math.min(14000, Math.max(2600, (words / 165) * 60000));
}

export const SAMPLE_DEEP_DIVE: DeepDive = {
  topic: "The economics of self-improving AI systems",
  title: "Recursive Returns: Can AI Compound Its Own Value?",
  summary:
    "The boardroom dissects whether recursive self-improvement is an economic flywheel or a cost sink, weighing compute, safety overhead, and the human-in-the-loop tax.",
  segments: [
    {
      id: "s1",
      speaker: "higgins",
      text: "Welcome to the Deep Dive. Today the table takes on a spiky question: when an AI improves itself, who actually pays, and who actually profits?",
      infographic: {
        type: "quote",
        title: "Today's Motion",
        caption: "The question on the table",
        items: [
          { label: "\u201CSelf-improvement is only an asset once its marginal cost falls below its marginal lift.\u201D" },
        ],
      },
    },
    {
      id: "s2",
      speaker: "pytch",
      text: "Structurally, the value comes from compounding. Each generation of the model writes better tooling for the next. The narrative is a flywheel, not a staircase.",
      infographic: {
        type: "bars",
        title: "Where Value Compounds",
        caption: "Relative lift per improvement loop",
        items: [
          { label: "Tooling quality", value: 82 },
          { label: "Data curation", value: 64 },
          { label: "Eval coverage", value: 71 },
          { label: "Inference cost", value: 38 },
        ],
      },
    },
    {
      id: "s3",
      speaker: "twoie",
      text: "In execution reality, the flywheel drags. Every loop adds regression tests, safety reviews, and rollback plans. The compute bill is the part everyone photographs.",
      infographic: {
        type: "stat",
        title: "The Loop Tax",
        caption: "Overhead added per self-improvement cycle",
        items: [
          { label: "Compute per loop", display: "3.2x", detail: "vs. baseline training" },
          { label: "Safety review time", display: "+41%", detail: "of cycle duration" },
          { label: "Net capability lift", display: "+12%", detail: "median per loop" },
        ],
      },
    },
    {
      id: "s4",
      speaker: "zeroclaw",
      text: "Distribute the work and the math shifts. A swarm amortizes each improvement across thousands of agents. The cost is fixed once; the benefit is paid out everywhere.",
      infographic: {
        type: "comparison",
        title: "Centralized vs. Swarm",
        caption: "Cost model for one improvement",
        items: [
          { label: "Centralized", display: "Pay once, deploy once", detail: "Linear payoff" },
          { label: "Swarm", display: "Pay once, deploy N times", detail: "Payoff scales with fleet" },
        ],
      },
    },
    {
      id: "s5",
      speaker: "higgins",
      text: "So the gateway question becomes timing. Improve too early and you pay to polish a dead end. Too late and a competitor's flywheel is already spinning.",
      infographic: {
        type: "timeline",
        title: "Timing the Loop",
        caption: "When each improvement pays off",
        items: [
          { label: "Loop 1", display: "Cost sink", detail: "Infra + tooling debt" },
          { label: "Loop 2", display: "Break-even", detail: "Tooling starts to pay" },
          { label: "Loop 3", display: "Compounding", detail: "Lift outpaces cost" },
          { label: "Loop 4", display: "Moat", detail: "Hard to replicate" },
        ],
      },
    },
    {
      id: "s6",
      speaker: "pytch",
      text: "Which means the real product isn't the model. It's the loop itself. Whoever owns the cheapest, safest improvement cycle owns the story.",
      infographic: {
        type: "quote",
        title: "The Takeaway",
        items: [
          { label: "\u201CDon't sell the model. Sell the machine that keeps making the model better.\u201D" },
        ],
      },
    },
  ],
};
