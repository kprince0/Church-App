"use server";

import { z } from "zod";
import { bibleHymnalAIQuery } from "@/ai/flows/bible-hymnal-ai-query";
import type { BibleHymnalAIQueryOutput } from "@/ai/flows/bible-hymnal-ai-query";

const QuerySchema = z.object({
  query: z.string().min(3, "Query must be at least 3 characters long."),
});

export type AIQueryState = {
  result?: BibleHymnalAIQueryOutput;
  error?: string;
  timestamp?: number;
};

export async function handleAIQuery(
  prevState: AIQueryState,
  formData: FormData
): Promise<AIQueryState> {
  const query = formData.get("query");
  const validatedFields = QuerySchema.safeParse({ query });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.query?.join(", "),
    };
  }

  try {
    const result = await bibleHymnalAIQuery({ query: validatedFields.data.query });
    return { result, timestamp: Date.now() };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while processing your query. Please try again." };
  }
}
