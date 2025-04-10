import { cn } from '@/lib/utils';
import React from 'react';

const LandingText = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('text-center w-full', className)}>
      <div className="text-xl md:text-3xl lg:text-5xl text-white/90 leading-tight">{children}</div>
    </div>
  );
};

export default LandingText;
