import { cn } from '@/lib/utils';
import React from 'react';
import ShinyText from './ShinyText';

const HintText = ({
  text,
  className,
  shine = true
}: {
  text: string;
  className?: string;
  shine?: boolean;
}) => {
  return (
    <div className={cn('text-xs', className)}>
      {shine ? (
        <ShinyText className="!text-secondary/70" text={text} speed={2} />
      ) : (
        <p className="text-secondary/70">{text}</p>
      )}
    </div>
  );
};

export default HintText;
