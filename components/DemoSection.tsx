'use client';

import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import LandingText from './ui/LandingText';
import MovingBorderCard from './ui/MovingBorderCard';

// Video player component
const VideoPlayer = memo(
  ({
    videoRef,
    isPlaying,
    setIsPlaying
  }: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
  }) => {
    const togglePlay = useCallback(() => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }, [isPlaying, setIsPlaying, videoRef]);

    return (
      <>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          preload="none"
          poster="/readmechef-poster.png"
          controlsList="nodownload"
          disablePictureInPicture
          disableRemotePlayback
        >
          {/* Video source is set dynamically by the API */}
        </video>

        {/* Video Controls Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
          onClick={togglePlay}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 rounded-full text-primary bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
          </div>
        </div>
      </>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

// Main component
const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to pause video when not visible
  const handleScroll = useCallback(() => {
    if (videoRef.current && isPlaying) {
      const rect = videoRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isPlaying]);

  // Add passive scroll listener for better performance
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Load video when component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVideoLoaded && videoRef.current) {
          // Create source element for the video
          const source = document.createElement('source');
          source.type = 'video/mp4';
          source.src = '/api/video/demo';

          videoRef.current.appendChild(source);

          // Add event listener to handle loading
          videoRef.current.addEventListener(
            'loadeddata',
            () => {
              setIsVideoLoaded(true);
            },
            { once: true }
          );
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => observer.disconnect();
  }, [isVideoLoaded]);

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
        <div className="border-[1px] border-primary/40 w-full border-y-0 bg-background">
          <LandingText>
            What if I told you that you could create
            <br />a perfect README in just one step?
            <br />
            <span className="text-sm text-white/60">(Watch the video 👇🏻)</span>
          </LandingText>
        </div>

        {/* Video Player with scroll animation */}
        <MovingBorderCard speed={10} wrapperClassName="!p-[1px]">
          <motion.div
            ref={videoContainerRef}
            style={{
              perspective: '1000px'
            }}
            className="w-full aspect-video bg-card overflow-hidden relative group border-[1px] border-primary/40 border-y-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-10%' }}
          >
            <VideoPlayer videoRef={videoRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          </motion.div>
        </MovingBorderCard>
      </div>
    </section>
  );
};

export default memo(DemoSection);
