interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  license?: {
    name: string;
  };
  updated_at: string;
}

interface RepositoryCardProps {
  repo: GitHubRepo;
  onClick: () => void;
}

const RepositoryCard = ({ repo, onClick }: RepositoryCardProps) => {
  // Format the updated_at time to "Updated X minutes/hours/days ago"
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const updatedDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Updated ${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `Updated ${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `Updated ${Math.floor(diffInMinutes / (60 * 24))} days ago`;
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-6 border-b border-gray-800 bg-[#0d1117] hover:bg-[#161b22] transition-colors cursor-pointer"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-[#58a6ff]">{repo.name}</h2>
          <span className="ml-3 text-xs px-2 py-1 rounded-full bg-[#21262d] text-gray-400 border border-gray-700">
            {repo.private ? 'Private' : 'Public'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          {repo.language && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3178c6]"></span>
              <span>{repo.language}</span>
            </div>
          )}

          {repo.license && (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.53.53-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04c-.21.176-.441.327-.686.45C14.556 10.78 13.88 11 13 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L12.178 4.5h-.162c-.305 0-.604-.079-.868-.231l-1.29-.736a.245.245 0 0 0-.124-.033H8.75V13h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5V3.5h-.984a.245.245 0 0 0-.124.033l-1.29.736c-.264.152-.563.231-.868.231h-.162l2.112 4.692a.75.75 0 0 1-.154.838l-.53-.53.53.53-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04a3.29 3.29 0 0 1-.686.45C4.556 10.78 3.88 11 3 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L2.178 4.5H1.75a.75.75 0 0 1 0-1.5h2.234a.249.249 0 0 0 .125-.033l1.29-.736c.263-.15.562-.231.866-.231H7.25V.75a.75.75 0 0 1 1.5 0ZM2.238 6l-1.51 3.35a.75.75 0 0 1-.128.192c.335.136.774.25 1.4.25.483 0 .98-.089 1.347-.268.261-.133.48-.325.635-.541L4.238 9l-2-3Zm10.024 0-2 3 .256-.017c.156.216.374.408.635.54.367.18.864.269 1.347.269.626 0 1.066-.114 1.4-.25a.755.755 0 0 1-.128-.192L12.262 6Z"></path>
              </svg>
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
