export interface GitLabRepo {
  id: number;
  name: string;
  path: string;
  path_with_namespace: string;
  description: string | null;
  visibility: 'private' | 'public' | 'internal';
  web_url: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  language: string | null;
  star_count: number;
  forks_count: number;
  topics: string[];
  namespace: {
    path: string;
    avatar_url: string | null;
  };
  owner: {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
  };
}
