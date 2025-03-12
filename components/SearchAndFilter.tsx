type VisibilityFilter = 'all' | 'public' | 'private';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibilityFilter: VisibilityFilter;
  onVisibilityChange: (filter: VisibilityFilter) => void;
}

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  visibilityFilter,
  onVisibilityChange
}: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:w-96">
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div className="flex gap-2">
        <FilterButton
          label="All"
          isActive={visibilityFilter === 'all'}
          onClick={() => onVisibilityChange('all')}
        />
        <FilterButton
          label="Public"
          isActive={visibilityFilter === 'public'}
          onClick={() => onVisibilityChange('public')}
        />
        <FilterButton
          label="Private"
          isActive={visibilityFilter === 'private'}
          onClick={() => onVisibilityChange('private')}
        />
      </div>
    </div>
  );
};

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton = ({ label, isActive, onClick }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-amber-500 text-white'
        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
    }`}
  >
    {label}
  </button>
);

export default SearchAndFilter;
