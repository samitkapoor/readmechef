import { cn } from '@/lib/utils';
import React from 'react';
import ShinyText from './ShinyText';

const HintText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={cn('text-xs', className)}>
      <ShinyText className="!text-secondary/70" text={text} speed={2} />
    </div>
  );
};

export default HintText;
