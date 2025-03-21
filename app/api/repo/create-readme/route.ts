import { getGeminiReponse } from '@/config/gemini';
import { NextRequest, NextResponse } from 'next/server';

const fetchRepoFiles = async (
  owner: string,
  repo: string,
  accessToken: string,
  fileName: string
) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.json();
};

export const POST = async (request: NextRequest, response: NextResponse) => {
  const { message, repository, accessToken, previousConversation } = await request.json();

  const packageJson = await fetchRepoFiles(
    repository.owner.login,
    repository.name,
    accessToken,
    'package.json'
  );

  const prompt = `
    You are an expert in writing README files. 
    
    Based on the following project details create a README.md file for this repository:
    - Repository Name: ${repository.name}
    - Description: ${repository.description}
    - Package.json: ${JSON.stringify(packageJson)}
    - Previous Conversation: ${JSON.stringify(previousConversation)}
    - Latest Message: ${message}

    Here are some guidelines for the README.md file:
    - Generate a professional, well-structured README.md file.
    - Use previous conversation to help you understand the user's needs and preferences. Only respond to questions that are related to generating the README.md file or the project details.
    - Previous Conversation is a list of messages between the user and the AI.
    - Latest Message is the latest message from the user. It is the message that the user has sent to the AI.
    - Understand the user's needs and preferences based on the previous conversation and latest message.
    - If Package.json is not found, use the repository name to generate the README.md file and ask the user to provide some details about the project.
    - If the user asks for a specific section, only generate that section.
    - If the user asks for a specific format, use that format.
    - If the user asks for a specific style, use that style.
    - If the user asks for a specific tone, use that tone.
    - If the user asks for a specific length, use that length.
    - If the user asks for a specific language, use that language.
    `;

  const res = await getGeminiReponse(prompt);

  return NextResponse.json({ message: res.candidates[0].content.parts });
};
