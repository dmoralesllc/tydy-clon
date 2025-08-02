'use server';

/**
 * @fileOverview Suggests destinations based on user location history.
 *
 * - suggestDestination - A function that suggests a destination based on user history.
 * - SuggestDestinationInput - The input type for the suggestDestination function.
 * - SuggestDestinationOutput - The return type for the suggestDestination function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationInputSchema = z.object({
  userLocation: z
    .string()
    .describe('The current location of the user as a string.'),
  locationHistory: z
    .string()
    .describe(
      'A stringified array of previous locations the user has visited. Example: `["Home", "Work", "Gym"]`'
    ),
});
export type SuggestDestinationInput = z.infer<typeof SuggestDestinationInputSchema>;

const SuggestDestinationOutputSchema = z.object({
  suggestedDestination: z
    .string()
    .describe('The most likely destination the user is heading to.'),
  confidenceLevel: z.number().describe('A number between 0 and 1 indicating the confidence level in the suggestion.'),
});
export type SuggestDestinationOutput = z.infer<typeof SuggestDestinationOutputSchema>;

export async function suggestDestination(input: SuggestDestinationInput): Promise<SuggestDestinationOutput> {
  return suggestDestinationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationPrompt',
  input: {schema: SuggestDestinationInputSchema},
  output: {schema: SuggestDestinationOutputSchema},
  prompt: `You are an AI assistant that suggests the most likely destination for a user based on their location history.

  The user is currently at: {{{userLocation}}}
  Their location history is: {{{locationHistory}}}

  Suggest a destination the user is most likely heading to, and a confidence level between 0 and 1.
  Consider the user's current location and location history when making your suggestion.
  Be as accurate as possible. The location history is a stringified array.

  Make sure the destination exists in the location history.

  {{output schema=SuggestDestinationOutputSchema}}
  `,
});

const suggestDestinationFlow = ai.defineFlow(
  {
    name: 'suggestDestinationFlow',
    inputSchema: SuggestDestinationInputSchema,
    outputSchema: SuggestDestinationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
