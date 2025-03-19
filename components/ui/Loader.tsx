import React from 'react';

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-[var(--secondary)]"></div>
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
