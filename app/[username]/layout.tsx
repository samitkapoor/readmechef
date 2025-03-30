'use client';

import React from 'react';

import SessionWrapper from '@/components/SessionWrapper';
import { useParams } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const params: { username: string } = useParams();

  return (
    <SessionWrapper params={params}>
      <div className="relative">
        <div className="fixed h-screen w-screen top-0 z-0" />
        <div className="relative z-10">{children}</div>
      </div>
    </SessionWrapper>
  );
};

export default DashboardLayout;
