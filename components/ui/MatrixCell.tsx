'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import MatrixBeam from './MatrixBeam';

type MatrixCellProps = {
  matrixChars?: string;
  beamsPerCell?: number;
};

/**
 * MatrixCell - A container for matrix-style falling character beams
 * Optimized to only render and animate when in viewport
 */
const MatrixCell = memo(({ matrixChars, beamsPerCell = 7 }: MatrixCellProps) => {
  // Track if the component is in the viewport
  const [isInView, setIsInView] = useState(false);

  // Limit beams on mobile for better performance
  const [actualBeamCount, setActualBeamCount] = useState(beamsPerCell);

  // Reference to the container element for intersection observer
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize the beam array to avoid recreating on every render
  const beamArray = useRef(Array.from({ length: beamsPerCell }));

  useEffect(() => {
    // Create an intersection observer to detect when component enters/exits viewport
    // This prevents unnecessary animations and calculations when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: '150px', // Start loading slightly before visible
        threshold: 0 // Trigger when at least 10% visible
      }
    );

    // Detect mobile/low-performance devices and reduce beam count if needed
    const isMobile = window.innerWidth < 768;
    const isLowPerfDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    if (isMobile || isLowPerfDevice) {
      // Reduce beams on mobile/low-performance devices
      setActualBeamCount(beamsPerCell / 2);
    }

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [beamsPerCell]);

  return (
    <div
      ref={containerRef}
      className="bg-black relative flex justify-around overflow-hidden h-full w-full"
      style={{
        willChange: 'contents', // Hint to browser for optimization
        contain: 'content' // Improve rendering performance
      }}
    >
      {/* Only render beams when in viewport to save resources */}
      {isInView &&
        beamArray.current.slice(0, actualBeamCount).map((_, beamIndex) => (
          <MatrixBeam
            key={beamIndex}
            characters={matrixChars}
            duration={Math.random() * 4 + 6} // Slower duration: 6-10s
            beamHeight={Math.floor(Math.random() * 20) + 15} // Longer beams: 15-35
            inView={isInView} // Pass inView state to prevent animations when not visible
          />
        ))}
    </div>
  );
});

// Add display name for better debugging
MatrixCell.displayName = 'MatrixCell';

export default MatrixCell;
