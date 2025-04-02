import React from 'react';

const GridDivider = ({
  enableBackground = true,
  children
}: {
  enableBackground?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        backgroundColor: '#020b05',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cg fill='%23198d49' fill-opacity='0.25'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E")`
      }}
      className="flex flex-col border-y-[1px] border-primary/40 items-center justify-center bg-white/10 w-full shadow-[0_0_10px_rgba(25,141,73,0.15)]"
    >
      <div
        style={
          enableBackground
            ? {
                backgroundColor: '#000000',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23198d49' fill-opacity='0.15'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }
            : {}
        }
        className="border-[1px] border-y-0 border-primary/40 max-w-[1300px] bg-background h-[150px] sm:h-[400px] w-full flex items-center justify-center shadow-[0_0_10px_rgba(25,141,73,0.1)_inset]"
      >
        {children}
      </div>
    </div>
  );
};

export default GridDivider;
