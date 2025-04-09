'use server';

function formatBase64String(str: string, lineLength = 60) {
  let result = '';
  for (let i = 0; i < str.length; i += lineLength) {
    result += `'${str.slice(i, i + lineLength)}' +\n`;
  }
  // Remove the last '+' and add a semicolon
  return result.replace(/\+\n$/, ';\n');
}

/**
 * Fetches a single file from a GitLab repository
 */
export const fetchRepoFiles = async (projectId: number, accessToken: string, fileName: string) => {
  try {
    const url = `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(
      fileName
    )}?ref=main`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      return null;
    }
    const body = await response.json();
    body.content = formatBase64String(body.content);
    return body;
  } catch (error) {
    console.error(`Error fetching ${fileName}:`, error);
    return null;
  }
};

/**
 * Fetches directory structure to understand project layout
 */
export const fetchDirectoryStructure = async (
  projectId: number,
  accessToken: string,
  path: string = ''
) => {
  try {
    const url = `https://gitlab.com/api/v4/projects/${projectId}/repository/tree?path=${encodeURIComponent(
      path
    )}`;
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
export const fetchConfigFiles = async (projectId: number, accessToken: string) => {
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
    '.gitlab-ci.yml'
  ];

  const results = await Promise.all(
    configFiles.map(async (file) => {
      const data = await fetchRepoFiles(projectId, accessToken, file);
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
  projectId: number,
  accessToken: string,
  language: string
) => {
  // Determine directories to check based on language/framework patterns
  let directories = [];

  if (language === 'JavaScript' || language === 'TypeScript') {
    directories = ['src/', 'app/', 'lib/', 'components/', 'pages/'];
  } else if (language === 'Python') {
    directories = ['src/', 'app/', 'main/'];
  } else if (language === 'Java') {
    directories = ['src/main/java/', 'src/main/'];
  } else if (language === 'Go') {
    directories = ['cmd/', 'pkg/', 'internal/'];
  } else {
    directories = ['src/', 'lib/'];
  }

  // Fetch structure for each relevant directory
  const structurePromises = directories.map(async (dir) => {
    const structure = await fetchDirectoryStructure(projectId, accessToken, dir);
    return { directory: dir, files: structure };
  });

  const results = await Promise.all(structurePromises);
  return results.filter((result) => result.files.length > 0);
};

/**
 * Fetches documentation files beyond just README
 */
export const fetchDocumentationFiles = async (projectId: number, accessToken: string) => {
  const docPaths = ['docs/', 'CONTRIBUTING.md', 'CHANGELOG.md', 'CODE_OF_CONDUCT.md', '.gitlab/'];

  const results = await Promise.all(
    docPaths.map(async (path) => {
      try {
        // Check if it's a directory or a file
        if (path.endsWith('/')) {
          const structure = await fetchDirectoryStructure(projectId, accessToken, path);
          return { path, isDirectory: true, contents: structure };
        } else {
          const data = await fetchRepoFiles(projectId, accessToken, path);
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
  projectId: number,
  accessToken: string
): Promise<{
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
}> => {
  const url = `https://gitlab.com/api/v4/projects/${projectId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await response.json();

  return {
    stars: data.star_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count || 0,
    topics: data.topics || [],
    defaultBranch: data.default_branch,
    language: data.language || 'Unknown',
    lastUpdate: data.last_activity_at,
    homepage: data.web_url,
    hasWiki: data.wiki_enabled || false,
    visibility: data.visibility
  };
};

/**
 * Fetches contributors for a repository
 */
export const fetchContributors = async (projectId: number, accessToken: string) => {
  try {
    const url = `https://gitlab.com/api/v4/projects/${projectId}/repository/contributors`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      return [];
    }
    const contributors = await response.json();
    return contributors.map((contributor: { name: string }) => contributor.name);
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return [];
  }
};

/**
 * Fetches all relevant repo files and data
 */
export const fetchAllRepoFiles = async (
  projectId: number,
  accessToken: string,
  language: string
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
    fetchRepoFiles(projectId, accessToken, 'package.json'),
    fetchRepoFiles(projectId, accessToken, 'LICENSE'),
    fetchRepoFiles(projectId, accessToken, 'README.md'),
    fetchDirectoryStructure(projectId, accessToken),
    fetchConfigFiles(projectId, accessToken),
    fetchMainSourceFiles(projectId, accessToken, language),
    fetchDocumentationFiles(projectId, accessToken)
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
