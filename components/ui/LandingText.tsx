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
    <div className={cn('text-center py-12 border-b-[1px] border-neutral-700 w-full', className)}>
      <div className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 leading-tight">
        {children}
      </div>
    </div>
  );
};

export default LandingText;
