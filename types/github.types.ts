export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  open_issues_count: number;
  forks: number;
  topics: string[];
  license?: {
    name: string;
  };
  updated_at: string;
};
