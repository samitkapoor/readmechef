import React from 'react';

const GridDivider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col border-y-[1px] border-primary/40 items-center justify-center w-full">
      <div className="border-[1px] border-y-0 border-primary/40 max-w-[1200px] bg-background h-[50px] md:h-[100px] lg:h-[150px] w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default GridDivider;
