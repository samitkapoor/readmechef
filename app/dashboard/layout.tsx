import React from 'react';

import SessionWrapper from '@/components/SessionWrapper';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionWrapper>
      <div className="px-4 py-20">{children}</div>
    </SessionWrapper>
  );
};

export default DashboardLayout;
