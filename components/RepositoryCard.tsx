import { GitFork, Scale, Star } from 'lucide-react';
import { GitHubRepo } from '../types/github.types';
import dayjs from 'dayjs';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

type RepositoryCardProps = {
  repo: GitHubRepo;
  onClick: () => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const RepositoryCard = ({ repo, onClick, ...props }: RepositoryCardProps) => {
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

  return (
    <div className="py-6 border-b border-gray-800" {...props}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 mb-1">
          <div className="flex items-center">
            <h2
              onClick={onClick}
              className="text-xl font-semibold text-primary hover:underline cursor-pointer"
            >
              {repo.name}
            </h2>
            <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-[var(--card)] text-gray-400 border border-gray-700">
              {repo.private ? 'Private' : 'Public'}
            </span>
          </div>

          {repo.description && <p className="text-sm text-gray-400">{repo.description}</p>}
        </div>

        {repo.topics.length > 0 && (
          <div className="flex items-center gap-1 text-sm">
            {repo.topics.map((topic, i) => {
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

        <div className="flex items-center gap-4 text-sm text-gray-400">
          {repo.stargazers_count > 0 && (
            <div className="flex items-center gap-1.5">
              <Star size={16} />
              <span>{repo.stargazers_count}</span>
            </div>
          )}

          {repo.forks > 0 && (
            <div className="flex items-center gap-1.5">
              <GitFork size={16} />
              <span>{repo.forks}</span>
            </div>
          )}

          {repo.open_issues_count > 0 && (
            <div className="flex items-center gap-1.5">
              <span>{repo.open_issues_count} issues need help</span>
            </div>
          )}

          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span>{repo.language}</span>
            </div>
          )}

          {repo.license && (
            <div className="flex items-center gap-1">
              <Scale size={16} />
              <span>{repo.license.name}</span>
            </div>
          )}

          <span>{getTimeAgo(repo.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;
