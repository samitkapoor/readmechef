import React from 'react';

const GitlabLoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col w-screen items-center justify-center px-4 relative outline-none border-none">
      <div
        style={{
          background: 'radial-gradient(circle at center, transparent, rgba(0, 0, 0, 0.5))'
        }}
        className="absolute inset-0 z-0"
      />
      <div
        style={{
          background:
            'radial-gradient(circle at center, transparent 20%, rgba(255, 0, 0, 0.1), transparent 60%)'
        }}
        className="absolute inset-0 z-0 opacity-70"
      />

      {children}
    </div>
  );
};

export default GitlabLoginLayout;
