import React from 'react';

import SessionWrapper from '@/components/SessionWrapper';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionWrapper>
      <div className="relative">
        <div className="fixed h-screen w-screen top-0 z-0" />
        <div className="relative z-10">{children}</div>
      </div>
    </SessionWrapper>
  );
};

export default DashboardLayout;
