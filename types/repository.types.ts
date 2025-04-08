import { GitHubRepo } from './github.types';
import { GitLabRepo } from './gitlab.types';

export type Repository = {
  id: string | number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  url: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  language: string | null;
  starCount: number;
  forkCount: number;
  topics: string[];
  owner: {
    login: string;
    avatarUrl: string;
  };
};

export function normalizeGitHubRepo(repo: GitHubRepo): Repository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    private: repo.private,
    url: repo.html_url,
    defaultBranch: repo.default_branch,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    language: repo.language,
    starCount: repo.stargazers_count,
    forkCount: repo.forks_count,
    topics: repo.topics || [],
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url
    }
  };
}

export function normalizeGitLabRepo(repo: GitLabRepo): Repository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.path_with_namespace,
    description: repo.description,
    private: repo.visibility !== 'public',
    url: repo.web_url,
    defaultBranch: repo.default_branch,
    createdAt: repo.created_at,
    updatedAt: repo.last_activity_at,
    language: repo.language,
    starCount: repo.star_count,
    forkCount: repo.forks_count,
    topics: repo.topics || [],
    owner: {
      login: repo.namespace.path,
      avatarUrl: repo.namespace.avatar_url || ''
    }
  };
}
