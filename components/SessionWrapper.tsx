'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import Loader from './ui/Loader';

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/login');
  } else if (status === 'loading') {
    return <Loader />;
  } else return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

export default SessionWrapper;
