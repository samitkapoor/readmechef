'use server';

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { Repository, RepoDetails } from '@/types/github.types';
import { ClientMessage } from '@/types/ai.types';

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

// Fetch directory structure to understand project layout
const fetchDirectoryStructure = async (
  owner: string,
  repo: string,
  accessToken: string,
  path: string = ''
) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      console.error(`Error fetching directory structure for ${path}:`, response.status);
      return [];
    }

    const contents = await response.json();

    // Only return directories and important files to avoid excessive data
    return contents.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type,
      size: item.size
    }));
  } catch (error) {
    console.error(`Error fetching directory structure for ${path}:`, error);
    return [];
  }
};

// Fetch common config files for better project understanding
const fetchConfigFiles = async (owner: string, repo: string, accessToken: string) => {
  const configFiles = [
    'tsconfig.json',
    'next.config.js',
    'webpack.config.js',
    'babel.config.js',
    'vite.config.js',
    '.eslintrc.json',
    '.eslintrc.js',
    'jest.config.js',
    'docker-compose.yml',
    'Dockerfile',
    '.env.example',
    '.github/workflows/main.yml'
  ];

  const results = await Promise.all(
    configFiles.map(async (file) => {
      const data = await fetchRepoFiles(owner, repo, accessToken, file);
      if (data) {
        return {
          name: file,
          content: data
        };
      }
      return null;
    })
  );

  return results.filter(Boolean);
};

// Fetch main source files based on common patterns
const fetchMainSourceFiles = async (
  owner: string,
  repo: string,
  accessToken: string,
  repoDetails: RepoDetails
) => {
  // Determine directories to check based on language/framework patterns
  let directories = [];

  if (repoDetails.language === 'JavaScript' || repoDetails.language === 'TypeScript') {
    directories = ['src/', 'app/', 'lib/', 'components/', 'pages/'];
  } else if (repoDetails.language === 'Python') {
    directories = ['src/', 'app/', 'main/'];
  } else if (repoDetails.language === 'Java') {
    directories = ['src/main/java/', 'src/main/'];
  } else if (repoDetails.language === 'Go') {
    directories = ['cmd/', 'pkg/', 'internal/'];
  } else {
    directories = ['src/', 'lib/'];
  }

  // Fetch structure for each relevant directory
  const structurePromises = directories.map(async (dir) => {
    const structure = await fetchDirectoryStructure(owner, repo, accessToken, dir);
    return { directory: dir, files: structure };
  });

  const results = await Promise.all(structurePromises);
  return results.filter((result) => result.files.length > 0);
};

// Fetch documentation files beyond just README
const fetchDocumentationFiles = async (owner: string, repo: string, accessToken: string) => {
  const docPaths = ['docs/', 'CONTRIBUTING.md', 'CHANGELOG.md', 'CODE_OF_CONDUCT.md', '.github/'];

  const results = await Promise.all(
    docPaths.map(async (path) => {
      try {
        // Check if it's a directory or a file
        if (path.endsWith('/')) {
          const structure = await fetchDirectoryStructure(owner, repo, accessToken, path);
          return { path, isDirectory: true, contents: structure };
        } else {
          const data = await fetchRepoFiles(owner, repo, accessToken, path);
          return data ? { path, isDirectory: false, contents: data } : null;
        }
      } catch (error) {
        return null;
      }
    })
  );

  return results.filter(Boolean);
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

// Fetch all relevant repo files and data
const fetchAllRepoFiles = async (
  owner: string,
  repo: string,
  accessToken: string,
  repoDetails: RepoDetails
) => {
  const [
    packageJson,
    license,
    readme,
    rootStructure,
    configFiles,
    sourceFiles,
    documentationFiles
  ] = await Promise.all([
    fetchRepoFiles(owner, repo, accessToken, 'package.json'),
    fetchRepoFiles(owner, repo, accessToken, 'LICENSE'),
    fetchRepoFiles(owner, repo, accessToken, 'README.md'),
    fetchDirectoryStructure(owner, repo, accessToken),
    fetchConfigFiles(owner, repo, accessToken),
    fetchMainSourceFiles(owner, repo, accessToken, repoDetails),
    fetchDocumentationFiles(owner, repo, accessToken)
  ]);

  return {
    packageJson,
    license,
    readme,
    rootStructure,
    configFiles,
    sourceFiles,
    documentationFiles
  };
};

const generateContextualizedInput = async (
  input: string,
  repository: Repository,
  accessToken: string,
  isFirstMessage: boolean
) => {
  try {
    if (isFirstMessage) {
      const repoDetails = await fetchRepoDetails(
        repository.owner.login,
        repository.name,
        accessToken
      );

      const [files, contributors] = await Promise.all([
        fetchAllRepoFiles(repository.owner.login, repository.name, accessToken, repoDetails),
        fetchContributors(repository.owner.login, repository.name, accessToken)
      ]);

      return `
            Generate a README.md file for this GitHub repository:
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
            - Contributors: ${contributors.length > 0 ? JSON.stringify(contributors) : 'None found'}
            ${repoDetails.homepage ? `- Homepage: ${repoDetails.homepage}` : ''}
            
            Project Files and Structure:
            - Package.json: ${files.packageJson ? JSON.stringify(files.packageJson) : 'Not found'}
            - LICENSE: ${files.license ? JSON.stringify(files.license) : 'Not found'}
            - Existing README: ${files.readme ? JSON.stringify(files.readme) : 'Not found'}
            
            Root Directory Structure:
            ${JSON.stringify(files.rootStructure)}
            
            Configuration Files:
            ${JSON.stringify(files.configFiles)}
            
            Source Code Structure:
            ${JSON.stringify(files.sourceFiles)}
            
            Documentation Files:
            ${JSON.stringify(files.documentationFiles)}
  
            Generate a structured README with the following guidelines:
            1. Structure: Start with a clear project title and description.
            2. Essential Sections: Provide installation instructions with prerequisites, key features, 
            API documentation (if available), contribution guidelines.
            3 Style & Formatting: Use professional language, markdown best practices, syntax-highlighted code blocks, tables, and lists for clarity.
            Strategically use emojis for emphasis and ensure proper markdown formatting.
            4 Special Considerations: If a README exists, improve structure while preserving valuable content. Address specific user requests, 
            highlight the project's unique value, add troubleshooting for common issues, and include links to additional documentation if available.
            5 Don't add configuration files, project structure, Usage to the README.md file unless asked by the user.
            6 Use all the information provided to you to understand the project and then generate the README.md file.
          `;
    } else {
      return `
          Continue helping with the README.md for repository ${repository.name} (${repository.owner.login}/${repository.name}).
          User request: ${input}
        `;
    }
  } catch (error) {
    console.error('Error generating contextualized input:', error);
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

  const contextualizedInput = await generateContextualizedInput(
    input,
    repository,
    accessToken,
    isFirstMessage
  );

  const result = await streamText({
    model: google('gemini-2.0-flash-001'),
    messages: [...messages, { role: 'user', content: contextualizedInput }]
  });

  return result.toTextStreamResponse();
};
