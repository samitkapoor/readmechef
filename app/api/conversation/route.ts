'use server';

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { Repository, RepoDetails } from '@/types/github.types';
import { ClientMessage } from '@/types/ai.types';

// Helper functions for fetching repository data
const fetchRepoFiles = async (
  owner: string,
  repo: string,
  accessToken: string,
  fileName: string
) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${fileName}:`, error);
    return null;
  }
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
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contributors`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      return [];
    }
    const contributors = await response.json();
    return contributors.map((contributor: { login: string }) => contributor.login);
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return [];
  }
};

const fetchAllRepoFiles = async (owner: string, repo: string, accessToken: string) => {
  const [packageJson, license, readme] = await Promise.all([
    fetchRepoFiles(owner, repo, accessToken, 'package.json'),
    fetchRepoFiles(owner, repo, accessToken, 'LICENSE'),
    fetchRepoFiles(owner, repo, accessToken, 'README.md')
  ]);

  return { packageJson, license, readme };
};

// Generate a comprehensive prompt with repository context
const generateContextualizedInput = async (
  input: string,
  repository: Repository,
  accessToken: string,
  isFirstMessage: boolean
) => {
  try {
    // Only fetch detailed repository information if this is the first message
    if (isFirstMessage) {
      const [files, repoDetails, contributors] = await Promise.all([
        fetchAllRepoFiles(repository.owner.login, repository.name, accessToken),
        fetchRepoDetails(repository.owner.login, repository.name, accessToken),
        fetchContributors(repository.owner.login, repository.name, accessToken)
      ]);

      return `
            You are an expert technical writer specializing in creating comprehensive and professional project documentation. Your task is to create or improve a README.md file that follows industry best practices and effectively communicates the project's value.
  
            Repository Information:
            - Name: ${repository.name}
            - Owner: ${repository.owner.login}
            - Description: ${repository.description || 'No description provided'}
            - Primary Language: ${repoDetails.language || 'Unknown'}
            - Topics/Tags: ${repoDetails.topics.join(', ') || 'None'}
            - Stars: ${repoDetails.stars || 0}
            - Forks: ${repoDetails.forks || 0}
            - Open Issues: ${repoDetails.openIssues || 0}
            - Last Updated: ${repoDetails.lastUpdate || 'Unknown'}
            - Visibility: ${repoDetails.visibility || 'Unknown'}
            ${repoDetails.homepage ? `- Homepage: ${repoDetails.homepage}` : ''}
  
            Project Files:
            - Package.json: ${files.packageJson ? JSON.stringify(files.packageJson) : 'Not found'}
            - LICENSE: ${files.license ? JSON.stringify(files.license) : 'Not found'}
            - Existing README: ${files.readme ? JSON.stringify(files.readme) : 'Not found'}
  
            Contributors: ${contributors.length > 0 ? JSON.stringify(contributors) : 'None found'}
  
            User Request: ${input}
  
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
            Respond to the user's specific request: ${input}
          `;
    } else {
      // For follow-up messages, just pass the input with minimal context
      return `
          Continue helping with the README.md for repository ${repository.name} (${repository.owner.login}/${repository.name}).
          User request: ${input}
        `;
    }
  } catch (error) {
    console.error('Error generating contextualized input:', error);
    // Fallback to basic context if there's an error
    return `
        Repository Information:
        - Name: ${repository.name}
        - Owner: ${repository.owner.login}
        - Description: ${repository.description || 'No description provided'}
        
        I am helping you create a README.md file for this repository. ${input}
      `;
  }
};

export const POST = async (request: NextRequest) => {
  const {
    history,
    input,
    repository,
    accessToken
  }: {
    history: ClientMessage[];
    input: string;
    repository: Repository;
    accessToken: string;
  } = await request.json();

  const messages = history.map((his) => ({ role: his.role, content: his.display }));

  const isFirstMessage = messages.length === 0;

  // Get contextualized input
  const contextualizedInput = await generateContextualizedInput(
    input,
    repository,
    accessToken,
    isFirstMessage
  );

  console.log([...messages, { role: 'user', content: contextualizedInput }]);

  const result = await streamText({
    model: google('gemini-2.0-flash-001'),
    messages: [...messages, { role: 'user', content: contextualizedInput }]
  });

  return result.toTextStreamResponse();
};
