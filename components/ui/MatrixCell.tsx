'use client';

import React from 'react';
import MatrixBeam from './MatrixBeam';

type MatrixCellProps = {
  matrixChars?: string;
  beamsPerCell?: number;
};

const MatrixCell = ({ matrixChars, beamsPerCell = 10 }: MatrixCellProps) => {
  return (
    <div className="bg-black relative overflow-hidden h-full">
      {Array.from({ length: beamsPerCell }).map((_, beamIndex) => (
        <MatrixBeam
          key={beamIndex}
          characters={matrixChars}
          duration={Math.random() * 4 + 6} // Slower duration: 6-10s
          delay={Math.random() * 5} // More varied delay
          beamHeight={Math.floor(Math.random() * 20) + 15} // Longer beams: 15-35
        />
      ))}
    </div>
  );
};

export default MatrixCell;
