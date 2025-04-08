'use server';

import { RepoDetails } from '@/types/github.types';

/**
 * Fetches a single file from a GitHub repository
 */
export const fetchRepoFiles = async (
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

/**
 * Fetches directory structure to understand project layout
 */
export const fetchDirectoryStructure = async (
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
    return contents.map((item: { name: string; path: string; type: string; size: number }) => ({
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

/**
 * Fetches common config files for better project understanding
 */
export const fetchConfigFiles = async (owner: string, repo: string, accessToken: string) => {
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

/**
 * Fetches main source files based on common patterns
 */
export const fetchMainSourceFiles = async (
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

/**
 * Fetches documentation files beyond just README
 */
export const fetchDocumentationFiles = async (owner: string, repo: string, accessToken: string) => {
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
        console.error(`Error fetching documentation file ${path}:`, error);
        return null;
      }
    })
  );

  return results.filter(Boolean);
};

/**
 * Fetches repository details
 */
export const fetchRepoDetails = async (
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

/**
 * Fetches contributors for a repository
 */
export const fetchContributors = async (owner: string, repo: string, accessToken: string) => {
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

/**
 * Fetches all relevant repo files and data
 */
export const fetchAllRepoFiles = async (
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
