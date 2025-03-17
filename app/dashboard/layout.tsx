import React from 'react';

import SessionWrapper from '@/components/SessionWrapper';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionWrapper>
      <div className="px-4 py-20 relative">
        <div
          style={{
            background: 'linear-gradient(135deg, transparent, #77C14E14, transparent)'
          }}
          className="fixed h-screen w-screen top-0 z-0"
        />
        <div className="relative z-10">{children}</div>
      </div>
    </SessionWrapper>
  );
};

export default DashboardLayout;
