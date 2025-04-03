import React from 'react';

const MovingBorderCard = ({
  children,
  wrapperClassName,
  className,
  speed = 5
}: {
  children?: React.ReactNode;
  wrapperClassName?: string;
  className?: string;
  speed?: number;
}) => {
  return (
    <div
      style={{
        animationDuration: `${speed}s`
      }}
      className={`moving-border-card p-[3px] ${wrapperClassName}`}
    >
      <div className={`flex items-center justify-center relative ${className}`}>{children}</div>
    </div>
  );
};

export default MovingBorderCard;
