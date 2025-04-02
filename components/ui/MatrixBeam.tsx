'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type MatrixBeamProps = {
  duration: number;
  delay: number;
  characters: string;
  beamHeight?: number;
  isParentHovered?: boolean;
};

const MatrixBeam = ({
  duration,
  delay,
  characters,
  beamHeight = 20,
  isParentHovered = false
}: MatrixBeamProps) => {
  const beamChars = useMemo(() => {
    const result = [];
    for (let i = 0; i < beamHeight; i++) {
      result.push(characters[Math.floor(Math.random() * characters.length)]);
    }
    return result;
  }, [characters, beamHeight]);

  // Fixed horizontal position for this beam
  const beamPosition = useMemo(() => `${Math.random() * 80 + 5}%`, []);

  return (
    <motion.div
      className="absolute text-green-500 font-mono text-xs md:text-sm"
      style={{
        left: beamPosition, // Use fixed position from useMemo
        top: '-50px', // Start above viewport
        opacity: 0.8
      }}
      initial={{ y: '-100%' }}
      animate={{
        y: '200%' // Only animate vertical movement
      }}
      transition={{
        y: { duration, delay, repeat: Infinity, ease: 'linear' }
      }}
    >
      {/* Container for characters with hover animations */}
      <motion.div
        className="flex flex-col"
        animate={{
          filter: isParentHovered ? 'brightness(1.5) contrast(1.2)' : 'brightness(1)'
        }}
        transition={{
          filter: { duration: 0.2 }
        }}
      >
        {/* Wrapper for shake animation */}
        <motion.div
          animate={
            isParentHovered
              ? {
                  rotate: [0, -1, 1, -1, 0]
                }
              : { rotate: 0 }
          }
          transition={{
            rotate: {
              duration: 0.15,
              repeat: isParentHovered ? Infinity : 0,
              repeatType: 'mirror'
            }
          }}
          style={{ transformOrigin: 'center center' }}
        >
          {beamChars.map((char, index) => {
            // Randomize brightness for each character to create depth
            const brightness = index === 0 ? 2 : 0.7 + Math.random() * 0.5;
            // First character is brightest (the "head")
            const isHead = index === 0;

            return (
              <motion.div
                key={index}
                className={`text-center ${isHead ? 'text-white' : ''}`}
                style={{
                  filter: `brightness(${brightness})`,
                  textShadow: isHead
                    ? '0 0 8px rgba(255, 255, 255, 0.8)'
                    : '0 0 5px rgba(0, 255, 0, 0.5)'
                }}
                // Random character switching animation for some characters
                animate={
                  Math.random() > 0.7
                    ? {
                        opacity: [1, 1, 1],
                        content: [
                          char,
                          characters[Math.floor(Math.random() * characters.length)],
                          char
                        ]
                      }
                    : {}
                }
                transition={{ duration: 1, repeat: Infinity, repeatDelay: Math.random() * 2 }}
              >
                {char}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MatrixBeam;
