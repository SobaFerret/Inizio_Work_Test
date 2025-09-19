import { z } from "zod";

export const querySchema = z.object({
  q: z.string().min(1, "Query is required").max(200)
});

export const organicItemSchema = z.object({
  position: z.number().int().positive(),
  title: z.string(),
  link: z.string().url(),
  snippet: z.string().optional().default("")
});

export const resultsSchema = z.object({
  query: z.string(),
  fetched_at: z.string(),
  source: z.literal("google_serpapi"),
  results: z.array(organicItemSchema)
});
