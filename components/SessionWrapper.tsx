'use client';

import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import Loader from './ui/Loader';

const SessionWrapper = ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { username: string };
}) => {
  const { status, data: session } = useSession();
  const username = params.username;

  if (status === 'authenticated' && username !== session?.user?.username) {
    // signout
    signOut({ callbackUrl: '/login' });
    redirect('/login');
  } else if (status === 'unauthenticated') {
    redirect('/login');
  } else if (status === 'loading') {
    return <Loader />;
  } else return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

export default SessionWrapper;
