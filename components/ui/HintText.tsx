import { cn } from '@/lib/utils';
import React from 'react';
import ShinyText from './ShinyText';

const HintText = ({
  text,
  className,
  shine = true,
  textClassName
}: {
  text: string;
  className?: string;
  shine?: boolean;
  textClassName?: string;
}) => {
  return (
    <div className={cn('text-xs', className)}>
      {shine ? (
        <ShinyText className={cn('!text-secondary/70', textClassName)} text={text} speed={2} />
      ) : (
        <p className={cn('text-secondary/70', textClassName)}>{text}</p>
      )}
    </div>
  );
};

export default HintText;
