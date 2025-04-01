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
    <section className="relative px-6 md:px-10 flex flex-col items-center justify-start w-full overflow-hidden">
      <div className="flex flex-col items-center justify-center max-w-[1300px] w-full">
        <div className="border-[1px] border-neutral-700 w-full border-y-0">
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
          className="w-full aspect-video bg-card overflow-hidden shadow-2xl relative group border-[1px] border-neutral-700 border-y-0"
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
              <button className="w-16 h-16 rounded-full bg-primary/80 text-white flex items-center justify-center hover:bg-primary transition-colors">
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
