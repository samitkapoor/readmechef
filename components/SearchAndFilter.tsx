import Dropdown from './ui/Dropdown';

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
      <div className="w-full">
        <input
          type="text"
          placeholder="Find a repository..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-1 text-sm rounded-md border border-gray-700 bg-[var(--card)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>
      <Dropdown
        onChange={(value) => onVisibilityChange(value as VisibilityFilter)}
        value={visibilityFilter}
        optionsHeading="Select Type"
        options={[
          { value: 'all', label: 'All' },
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' }
        ]}
        placeholder="Type"
      />
    </div>
  );
};

export default SearchAndFilter;
