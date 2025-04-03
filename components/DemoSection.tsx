'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import LandingText from './ui/LandingText';
import MovingBorderCard from './ui/MovingBorderCard';

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = () => {
    if (videoRef.current) {
      const rect = videoRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!isVisible && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPlaying]);

  useEffect(() => {
    // Use Intersection Observer to load video only when it's near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVideoLoaded) {
          if (videoRef.current) {
            // Only load the video when it's actually needed
            videoRef.current.src = '/readmechef-demo.mp4';

            // Optimize performance on mobile by reducing quality
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
              // Set lower quality options for mobile
              videoRef.current.setAttribute('playsinline', '');
              videoRef.current.currentTime = 0;

              // Reduce resolution rendering by using CSS
              videoRef.current.style.maxHeight = '480px';
              videoRef.current.classList.add('mobile-video');
            }

            // Add event listener to handle loading
            videoRef.current.addEventListener('loadeddata', () => {
              setIsVideoLoaded(true);
            });
          }
        }
      },
      { rootMargin: '400px', threshold: 0.1 } // Increased margin for earlier preloading
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
          >
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
              {/* Video source will be set dynamically when in viewport */}
              Your browser does not support the video tag.
            </video>

            {/* Video Controls Overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
            >
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center"
              >
                <button className="w-16 h-16 rounded-full text-primary bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </button>
              </div>
            </div>
          </motion.div>
        </MovingBorderCard>
      </div>
    </section>
  );
};

export default DemoSection;
