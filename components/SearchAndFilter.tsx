import { VisibilityFilter } from '@/types/filters.types';
import Dropdown from './ui/Dropdown';
import HintText from './ui/HintText';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibilityFilter: VisibilityFilter;
  onVisibilityChange: (filter: VisibilityFilter) => void;
  languageFilter: string;
  onLanguageChange: (language: string) => void;
  availableLanguages: Array<{ value: string; label: string }>;
  searchRef: React.RefObject<HTMLInputElement | null>;
}

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  visibilityFilter,
  onVisibilityChange,
  languageFilter,
  onLanguageChange,
  availableLanguages,
  searchRef
}: SearchAndFilterProps) => {
  return (
    <div className="flex gap-2 items-center justify-between">
      <div className="w-full relative">
        <input
          ref={searchRef}
          type="text"
          placeholder="Find a repository..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-1 text-sm rounded-md border border-gray-700 bg-[var(--card)] text-white focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <HintText
          text={navigator.platform.startsWith('Win') ? 'CTRL + K' : '⌘ + K'}
          className="mt-1 absolute top-full"
        />
      </div>
      <Dropdown
        onChange={(value) => onVisibilityChange(value as VisibilityFilter)}
        value={visibilityFilter}
        optionsHeading="Select Type"
        options={[
          { value: 'all', label: 'All' },
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' },
          { value: 'sources', label: 'Sources' },
          { value: 'forks', label: 'Forks' },
          { value: 'archived', label: 'Archived' },
          { value: 'can_be_sponsored', label: 'Can be sponsored' },
          { value: 'mirrors', label: 'Mirrors' },
          { value: 'templates', label: 'Templates' }
        ]}
        placeholder="Type"
      />

      <Dropdown
        onChange={(value) => onLanguageChange(value)}
        value={languageFilter}
        optionsHeading="Select language"
        options={[{ value: 'all', label: 'All' }, ...availableLanguages]}
        placeholder="Language"
      />
    </div>
  );
};

export default SearchAndFilter;
