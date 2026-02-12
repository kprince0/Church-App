'use server';
/**
 * @fileOverview A Genkit flow for querying the Bible and Hymnal using natural language.
 *
 * - bibleHymnalAIQuery - A function that handles natural language queries for Bible verses and hymns.
 * - BibleHymnalAIQueryInput - The input type for the bibleHymnalAIQuery function.
 * - BibleHymnalAIQueryOutput - The return type for the bibleHymnalAIQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BibleHymnalAIQueryInputSchema = z.object({
  query: z.string().describe('A natural language query related to the Bible or Hymnal.'),
});
export type BibleHymnalAIQueryInput = z.infer<typeof BibleHymnalAIQueryInputSchema>;

const BibleVerseSchema = z.object({
  book: z.string().describe('The name of the Bible book (e.g., "John", "Psalms").'),
  chapter: z.number().int().describe('The chapter number.'),
  verse: z.number().int().describe('The starting verse number.'),
  text: z.string().describe('The relevant Bible verse text.'),
});

const HymnSchema = z.object({
  title: z.string().describe('The title of the hymn.'),
  hymnNumber: z.string().optional().describe('The hymn number from the hymnal, if applicable.'),
  lyricsSnippet: z.string().describe('A relevant snippet of the hymn lyrics.'),
});

const BibleHymnalAIQueryResultSchema = z.union([
  BibleVerseSchema,
  HymnSchema,
]).describe('A single result, either a Bible verse or a hymn snippet.');

const BibleHymnalAIQueryOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the query and the findings.'),
  results: z.array(BibleHymnalAIQueryResultSchema).describe('A list of relevant Bible verses or hymns.'),
  additionalContext: z.string().optional().describe('Any additional context or explanation for the results.'),
});
export type BibleHymnalAIQueryOutput = z.infer<typeof BibleHymnalAIQueryOutputSchema>;

export async function bibleHymnalAIQuery(input: BibleHymnalAIQueryInput): Promise<BibleHymnalAIQueryOutput> {
  return bibleHymnalAIQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bibleHymnalAIQueryPrompt',
  input: { schema: BibleHymnalAIQueryInputSchema },
  output: { schema: BibleHymnalAIQueryOutputSchema },
  prompt: `You are an expert on the Holy Bible (Korean Revised Standard Version and English KJV) and the New Korean-English Hymnal.
Your task is to answer user queries by retrieving relevant verses, hymn titles, and lyrics snippets, and providing context.
The user will provide a natural language query related to biblical themes, theological concepts, or specific hymn topics.

When responding, adhere strictly to the following guidelines:
1. Identify if the query is about the Bible, a Hymn, or both.
2. For Bible references, provide the book, chapter, verse, and the exact text.
3. For Hymn references, provide the title, hymn number (if applicable and commonly known), and a relevant snippet of the lyrics.
4. If you cannot find a direct match, provide the closest possible related information or state that you cannot find it.
5. Provide a summary of your findings and additional context if necessary.

User query: {{{query}}}`,
});

const bibleHymnalAIQueryFlow = ai.defineFlow(
  {
    name: 'bibleHymnalAIQueryFlow',
    inputSchema: BibleHymnalAIQueryInputSchema,
    outputSchema: BibleHymnalAIQueryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
