import React from 'react';

import SessionWrapper from '@/components/SessionWrapper';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <SessionWrapper>{children}</SessionWrapper>;
};

export default DashboardLayout;
