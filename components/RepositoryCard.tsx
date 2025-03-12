interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
}

interface RepositoryCardProps {
  repo: GitHubRepo;
  onClick: () => void;
}

const RepositoryCard = ({ repo, onClick }: RepositoryCardProps) => (
  <div
    onClick={onClick}
    className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-slate-800 flex flex-col justify-between hover:border-amber-500 dark:hover:border-amber-500 transition-colors cursor-pointer"
  >
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{repo.name}</h2>
      <p className="text-gray-700 dark:text-gray-300 truncate">
        {repo.description || 'No description available'}
      </p>
    </div>
    <div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{repo.language || 'No language'}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {repo.private ? 'Private' : 'Public'}
          </span>
        </div>
        <span className="text-sm text-gray-500">⭐ {repo.stargazers_count}</span>
      </div>
      <button className="w-full py-2 px-2 bg-white hover:bg-amber-50 dark:bg-slate-700 dark:hover:bg-slate-600 cursor-pointer text-gray-900 dark:text-white rounded-md mt-6 border border-gray-200 dark:border-gray-600 transition-colors">
        Select
      </button>
    </div>
  </div>
);

export default RepositoryCard;
