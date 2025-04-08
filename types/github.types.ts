export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  created_at: string;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  open_issues_count: number;
  forks: number;
  forks_count: number;
  topics: string[];
  license?: {
    name: string;
  };
  owner: {
    login: string;
    avatar_url: string;
  };
  updated_at: string;
  visibility:
    | 'all'
    | 'public'
    | 'private'
    | 'sources'
    | 'forks'
    | 'archived'
    | 'can_be_sponsored'
    | 'mirrors'
    | 'templates';
}

export type Repository = {
  owner: {
    login: string;
  };
  name: string;
  description: string;
};

export type RepoDetails = {
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
};
