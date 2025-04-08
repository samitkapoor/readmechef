import React from 'react';

const GridDivider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="max-w-[1200px] bg-background h-[50px] md:h-[100px] lg:h-[150px] w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default GridDivider;
