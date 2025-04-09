import { GitFork, Scale, Star } from 'lucide-react';
import { GitHubRepo } from '../types/github.types';
import { GitLabRepo } from '../types/gitlab.types';
import dayjs from 'dayjs';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import HintText from './ui/HintText';

// Union type for repositories from either platform
type Repo = GitHubRepo | GitLabRepo;

// Type guard to check if a repo is a GitHub repo
function isGitHubRepo(repo: Repo): repo is GitHubRepo {
  return 'stargazers_count' in repo;
}

type RepositoryCardProps = {
  repo: Repo;
  onClick: () => void;
  index: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const RepositoryCard = ({ repo, onClick, index, ...props }: RepositoryCardProps) => {
  const getTimeAgo = (date: string) => {
    const now = dayjs();
    const updatedAt = dayjs(date);
    const diffInMinutes = now.diff(updatedAt, 'minutes');

    if (diffInMinutes < 60) {
      return `Updated ${diffInMinutes} minutes ago`;
    } else if (diffInMinutes / 60 < 24) {
      return `Updated ${Math.floor(diffInMinutes / 60)} hours ago`;
    } else if (diffInMinutes / (60 * 24) < 30) {
      return `Updated ${Math.floor(diffInMinutes / (60 * 24))} days ago`;
    } else {
      return `Updated on ${updatedAt.format('MMM DD, YYYY')}`;
    }
  };

  // Get repository properties based on platform
  const isPrivate = isGitHubRepo(repo) ? repo.private : repo.visibility === 'private';
  const stars = isGitHubRepo(repo) ? repo.stargazers_count : repo.star_count;
  const forks = isGitHubRepo(repo) ? repo.forks : repo.forks_count;
  const openIssues = isGitHubRepo(repo) ? repo.open_issues_count : undefined;
  const topics = isGitHubRepo(repo) ? repo.topics : [];
  const license = isGitHubRepo(repo) ? repo.license : undefined;
  const updatedAt = isGitHubRepo(repo) ? repo.updated_at : repo.last_activity_at;

  return (
    <div className="py-6 border-b border-gray-800" {...props}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col mb-1">
          <div className="flex items-center relative">
            <h2
              onClick={onClick}
              className="text-xl font-semibold text-primary hover:underline cursor-pointer"
            >
              {repo.name}
            </h2>
            <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-[var(--card)] text-gray-400 border border-gray-700">
              {isPrivate ? 'Private' : 'Public'}
            </span>
          </div>
          {index <= 9 && <HintText text={`${index}`} className="leading-none" />}

          {repo.description && <p className="text-sm mt-1 text-gray-400">{repo.description}</p>}
        </div>

        {topics.length > 0 && (
          <div className="flex items-center gap-1 text-sm flex-wrap">
            {topics.map((topic, i) => {
              return (
                <div
                  key={i + Date.now() + topic}
                  className="rounded-full px-2 py-0.5 bg-primary/5 text-primary"
                >
                  {topic}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
          {stars > 0 && (
            <div className="flex items-center gap-1.5">
              <Star size={16} />
              <span>{stars}</span>
            </div>
          )}

          {forks > 0 && (
            <div className="flex items-center gap-1.5">
              <GitFork size={16} />
              <span>{forks}</span>
            </div>
          )}

          {openIssues !== undefined && openIssues > 0 && (
            <div className="flex items-center gap-1.5">
              <span>{openIssues} issues need help</span>
            </div>
          )}

          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span>{repo.language}</span>
            </div>
          )}

          {license && (
            <div className="flex items-center gap-1">
              <Scale size={16} />
              <span>{license.name}</span>
            </div>
          )}

          <span>{getTimeAgo(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;
