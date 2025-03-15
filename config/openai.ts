import OpenAI from 'openai';

export const getOpenAI = () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return openai;
};
