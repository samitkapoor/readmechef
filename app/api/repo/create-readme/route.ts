import { generateGoogleResponse } from '@/config/google';
import { NextRequest, NextResponse } from 'next/server';

interface Repository {
  owner: {
    login: string;
  };
  name: string;
  description: string;
}

interface RequestBody {
  message: string;
  repository: Repository;
  accessToken: string;
  previousConversation: string[];
}

interface RepoDetails {
  stars: number;
  forks: number;
  openIssues: number;
  topics: string[];
  defaultBranch: string;
  language: string;
  lastUpdate: string;
  homepage: string | null;
  hasWiki: boolean;
  visibility: string;
}

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

const fetchRepoDetails = async (
  owner: string,
  repo: string,
  accessToken: string
): Promise<RepoDetails> => {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await response.json();

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    topics: data.topics || [],
    defaultBranch: data.default_branch,
    language: data.language,
    lastUpdate: data.updated_at,
    homepage: data.homepage,
    hasWiki: data.has_wiki,
    visibility: data.visibility
  };
};

const fetchContributors = async (owner: string, repo: string, accessToken: string) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contributors`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.json();
};

const fetchAllRepoFiles = async (owner: string, repo: string, accessToken: string) => {
  const [packageJson, license, readme] = await Promise.all([
    fetchRepoFiles(owner, repo, accessToken, 'package.json'),
    fetchRepoFiles(owner, repo, accessToken, 'LICENSE'),
    fetchRepoFiles(owner, repo, accessToken, 'README.md')
  ]);

  return { packageJson, license, readme };
};

const generatePrompt = (
  repository: Repository,
  message: string,
  previousConversation: string[],
  files: { packageJson: string; license: string; readme: string },
  repoDetails: RepoDetails,
  contributors: string[]
) => {
  return `
    You are an expert technical writer specializing in creating comprehensive and professional project documentation. Your task is to create or improve a README.md file that follows industry best practices and effectively communicates the project's value.

    Repository Information:
    - Name: ${repository.name}
    - Description: ${repository.description}
    - Primary Language: ${repoDetails.language}
    - Topics/Tags: ${repoDetails.topics.join(', ')}
    - Stars: ${repoDetails.stars}
    - Forks: ${repoDetails.forks}
    - Open Issues: ${repoDetails.openIssues}
    - Last Updated: ${repoDetails.lastUpdate}
    - Visibility: ${repoDetails.visibility}
    ${repoDetails.homepage ? `- Homepage: ${repoDetails.homepage}` : ''}
    
    Project Files:
    - Package.json: ${JSON.stringify(files.packageJson)}
    - LICENSE: ${JSON.stringify(files.license)}
    - Existing README: ${JSON.stringify(files.readme)}
    
    Contributors: ${JSON.stringify(contributors)}
    
    Context:
    - Previous Conversation: ${JSON.stringify(previousConversation)}
    - Latest Message: ${message}

    Instructions for README Generation:
    1. Structure:
       - Start with a clear, concise project title and description
       - Include badges for build status, version, license, etc. where applicable
       - Add a table of contents for longer READMEs
       - Include visuals (screenshots, diagrams) placeholders where relevant
    
    2. Essential Sections:
       - Installation instructions with prerequisites
       - Usage examples with code snippets
       - Features and highlights
       - API documentation if applicable
       - Contributing guidelines
       - License information
       - Acknowledgments
    
    3. Style Guidelines:
       - Use clear, professional language
       - Include code blocks with proper syntax highlighting
       - Use tables and lists for better readability
       - Add emojis strategically for visual appeal
       - Ensure proper markdown formatting
    
    4. Special Considerations:
       - If README exists, preserve useful existing content while improving structure and clarity
       - Address specific user requests from the conversation
       - Highlight the project's unique value proposition
       - Include troubleshooting section if common issues are identified
       - Add links to additional documentation if available

    Generate a README that is professional, comprehensive, and user-friendly while maintaining technical accuracy.
    `;
};

export const POST = async (request: NextRequest) => {
  const { message, repository, accessToken, previousConversation }: RequestBody =
    await request.json();

  const [files, repoDetails, contributors] = await Promise.all([
    fetchAllRepoFiles(repository.owner.login, repository.name, accessToken),
    fetchRepoDetails(repository.owner.login, repository.name, accessToken),
    fetchContributors(repository.owner.login, repository.name, accessToken)
  ]);

  const prompt = generatePrompt(
    repository,
    message,
    previousConversation,
    files,
    repoDetails,
    contributors
  );

  const res = await generateGoogleResponse(prompt);
  console.log(res);

  // const res = await getGeminiReponse(prompt);

  return NextResponse.json({ message: res });
};
