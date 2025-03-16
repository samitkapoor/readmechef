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
  const { message, repository, accessToken } = await request.json();

  const packageJson = await fetchRepoFiles(
    repository.owner.login,
    repository.name,
    accessToken,
    'package.json'
  );

  const prompt = `
    You are an expert in writing README files. Based on the following project details:
    - Repository Name: ${repository.name}
    - Description: ${repository.description}
    - Package.json: ${JSON.stringify(packageJson)}
    - Message: ${message}

    Generate a professional, well-structured README.md file.
    `;

  const res = await getGeminiReponse(prompt);

  return NextResponse.json({ message: res.candidates[0].content.parts });
};
