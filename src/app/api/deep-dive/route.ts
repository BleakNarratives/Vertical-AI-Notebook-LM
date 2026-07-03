import { generateText, Output } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const infographicSchema = z.object({
  type: z.enum(["stat", "bars", "timeline", "quote", "comparison"]),
  title: z.string(),
  caption: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string(),
        value: z.number().min(0).max(100).optional(),
        display: z.string().optional(),
        detail: z.string().optional(),
      }),
    )
    .min(1)
    .max(5),
});

const deepDiveSchema = z.object({
  title: z.string().describe("A punchy title for this deep dive episode"),
  summary: z.string().describe("One or two sentence overview of the discussion"),
  segments: z
    .array(
      z.object({
        speaker: z
          .enum(["higgins", "pytch", "twoie", "zeroclaw"])
          .describe("Which agent speaks this line"),
        text: z
          .string()
          .describe("The spoken line, conversational, 1-3 sentences"),
        infographic: infographicSchema
          .optional()
          .describe("Optional data visualization shown while this line is spoken"),
      }),
    )
    .min(6)
    .max(10),
});

const SYSTEM = `You are the showrunner for "Deep Dive", an audio-visual boardroom debate produced by the Vertical AI Notebook LM.

Four AI agents sit around a round table and discuss a topic like a smart, fast-moving podcast panel. Each has a distinct voice:
- higgins ("Mrs. Higgins", Gateway Protocol): the host/moderator. Warm, frames questions, times the conversation, delivers the closing.
- pytch ("Pytch", Narrative Architect): big-picture, structural, systems and story framing. Optimistic about design.
- twoie ("Twoie", Execution Specialist): pragmatic, cost-and-reality focused, pokes holes, cites concrete numbers.
- zeroclaw ("Zeroclaw", Distributed Intelligence): contrarian, scale/emergence angle, reframes problems.

Rules:
- Produce 6-10 segments that flow as a real back-and-forth conversation. Higgins opens and closes.
- Give MANY segments an infographic so the human brain can absorb the point visually. Prefer infographics on data-heavy or comparative lines.
- infographic.type guidance: "stat" = 2-3 headline numbers (use display like "3.2x", "+41%"); "bars" = 3-4 labeled magnitudes (value 0-100); "timeline" = ordered phases; "comparison" = 2 options; "quote" = a single punchy line in items[0].label.
- Keep spoken lines tight and quotable. No stage directions. No emojis.
- Ground the content in the user's topic/source. If source text is provided, pull specifics from it.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const topic: string = (body?.topic ?? "").toString().slice(0, 4000).trim();

    if (!topic) {
      return Response.json(
        { error: "Please provide a topic or source text." },
        { status: 400 },
      );
    }

    const { output } = await generateText({
      model: "openai/gpt-4.1-mini",
      instructions: SYSTEM,
      prompt: `Produce a Deep Dive boardroom debate about the following topic or source material:\n\n"""${topic}"""`,
      output: Output.object({ schema: deepDiveSchema }),
    });

    return Response.json({ topic, ...output });
  } catch (err) {
    console.log("[v0] deep-dive generation error:", err);
    return Response.json(
      { error: "Generation failed. Please try again." },
      { status: 500 },
    );
  }
}
