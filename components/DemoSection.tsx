'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import LandingText from './ui/LandingText';

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      style={{
        backgroundColor: '#000000',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23198d49' fill-opacity='0.15'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
      className="relative flex flex-col items-center justify-start w-full"
    >
      <div
        id="demo-section"
        className="flex flex-col items-center justify-center max-w-[1300px] w-full"
      >
        <div className="border-[1px] border-primary/40 w-full border-y-0 bg-background shadow-[0_0_15px_rgba(25,141,73,0.05)_inset]">
          <LandingText>
            What if I told you that you could create
            <br />a perfect README in just one step?
          </LandingText>
        </div>

        {/* Video Player with scroll animation */}
        <motion.div
          style={{
            perspective: '1000px'
          }}
          className="w-full aspect-video bg-card overflow-hidden shadow-2xl relative group border-[1px] border-primary/40 border-y-0"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            poster="/readmechef-poster.png"
          >
            <source src="/readmechef-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Controls Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
              isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
          >
            <div onClick={togglePlay} className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full text-primary bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
