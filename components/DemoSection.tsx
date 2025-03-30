'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center']
  });

  // Transform values based on scroll position
  const rotateX = useTransform(scrollYProgress, [0, 0.7], [30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.4, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.85, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.7], [-80, 0]);

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
      ref={sectionRef}
      className="relative pb-20 px-6 md:px-10 flex flex-col items-center justify-start w-full overflow-hidden bg-gradient-to-b from-background to-black"
    >
      {/* Heading */}
      <div className="text-center mb-16 z-10 pt-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white/90 leading-tight">
          What if I told you that you could create a perfect README in just one step?
        </h2>
      </div>

      {/* Video Player with scroll animation */}
      <motion.div
        style={{
          boxShadow: '0px 0px 15px 5px rgba(236, 31, 31, 0.3)',
          perspective: '1000px',
          rotateX,
          opacity,
          scale,
          y: translateY
        }}
        className="w-full max-w-6xl aspect-video bg-card rounded-lg overflow-hidden shadow-2xl border border-gray-800/50 z-10 relative group"
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
    </section>
  );
};

export default DemoSection;
