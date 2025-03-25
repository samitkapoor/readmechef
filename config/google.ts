import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const generateGoogleResponse = async (prompt: string) => {
  const { text } = await generateText({
    model: google('gemini-2.0-flash-001'),
    prompt
  });

  return text;
};
