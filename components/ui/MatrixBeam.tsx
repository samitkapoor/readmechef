'use client';

import React, { useMemo, memo } from 'react';
import { motion, useAnimation } from 'framer-motion';

type MatrixBeamProps = {
  duration?: number;
  delay?: number;
  characters?: string;
  beamHeight?: number;
  inView?: boolean;
};

const matrixChars =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#*_-+`~[](){}<>|中文字符';

/**
 * MatrixBeam - A single animated column of falling matrix characters
 * Optimized to reduce rerenders and pause animations when not in viewport
 */
const MatrixBeam = memo(
  ({
    duration = 1,
    delay = 0,
    characters = matrixChars,
    beamHeight = 20,
    inView = true
  }: MatrixBeamProps) => {
    const controls = useAnimation();

    const beamChars = useMemo(() => {
      return Array.from(
        { length: beamHeight },
        () => characters[Math.floor(Math.random() * characters.length)]
      );
    }, [characters, beamHeight]);

    const beamPosition = useMemo(() => `${Math.random() * 80 + 5}%`, []);

    React.useEffect(() => {
      if (inView) {
        controls.start({
          y: '200%',
          transition: {
            y: { duration, delay, repeat: Infinity, ease: 'linear' }
          }
        });
      } else {
        controls.stop();
      }
    }, [controls, inView, duration, delay]);

    return (
      <motion.div
        className="absolute text-green-500 font-mono text-xs md:text-sm"
        style={{
          left: beamPosition,
          top: '-50px',
          opacity: 0.8,
          willChange: 'transform',
          transform: 'translateZ(0)',
          pointerEvents: 'none'
        }}
        initial={{ y: '-100%' }}
        animate={controls}
      >
        <div className="flex flex-col">
          {beamChars.map((char, index) => {
            const brightness = index === 0 ? 2 : 0.7 + Math.random() * 0.5;
            const isHead = index === 0;

            const shouldAnimate = isHead || Math.random() > 0.8;

            return (
              <div
                key={index}
                className={`text-center ${isHead ? 'text-white' : ''}`}
                style={{
                  filter: `brightness(${brightness})`,
                  textShadow: isHead
                    ? '0 0 8px rgba(255, 255, 255, 0.8)'
                    : '0 0 5px rgba(0, 255, 0, 0.5)'
                }}
              >
                {shouldAnimate && inView ? (
                  <motion.span
                    animate={{ opacity: [1, 0.8, 1] }}
                    transition={{
                      duration: 0.5 + Math.random(),
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3
                    }}
                  >
                    {char}
                  </motion.span>
                ) : (
                  <span>{char}</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }
);

MatrixBeam.displayName = 'MatrixBeam';

export default MatrixBeam;
