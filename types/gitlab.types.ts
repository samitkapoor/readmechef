export interface GitLabRepo {
  id: number;
  name: string;
  path: string;
  description: string | null;
  visibility: string;
  web_url: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  language?: string;
  star_count: number;
  forks_count: number;
  owner: {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
  };
}
