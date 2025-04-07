'use client';

import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';
import LandingText from './ui/LandingText';
import BrowserWindow from './ui/browser-window';

// Video player component
const VideoPlayer = memo(
  ({
    videoRef,
    isPlaying,
    isBuffering,
    handlePlayClick
  }: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isPlaying: boolean;
    isBuffering: boolean;
    handlePlayClick: () => void;
  }) => {
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

        {/* Loading Spinner Overlay - only show when buffering */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}

        {/* Video Controls Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          } ${isBuffering ? 'hidden' : ''}`}
          onClick={handlePlayClick}
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
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoSourceAdded, setVideoSourceAdded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Handle play button click
  const handlePlayClick = useCallback(() => {
    if (!videoRef.current) return;

    if (!videoSourceAdded && !isVideoLoaded) {
      // First time play - need to add source and start loading
      setIsBuffering(true);

      // Create source element for the video
      const source = document.createElement('source');
      source.type = 'video/mp4';
      source.src = '/api/video/demo';

      videoRef.current.appendChild(source);
      videoRef.current.load();
      setVideoSourceAdded(true);

      // This will be handled by the loadeddata event listener
      return;
    }

    // Normal play/pause toggle after video is loaded
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      // Show buffering if video needs to buffer
      if (videoRef.current.readyState < 3) {
        setIsBuffering(true);
      }
      videoRef.current.play().catch((err) => {
        console.error('Error playing video:', err);
        setIsBuffering(false);
      });
    }

    setIsPlaying(!isPlaying);
  }, [isPlaying, isVideoLoaded, videoSourceAdded]);

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

  // Add event listeners for video loading and buffering
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      setIsBuffering(false);

      // If this is the first load and the user clicked play, start playing
      if (!isVideoLoaded && videoSourceAdded) {
        video.play().catch((err) => console.error('Error playing video:', err));
        setIsPlaying(true);
      }
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const handleError = () => {
      setIsBuffering(false);
      console.error('Error loading video');
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      // Remove event listeners on cleanup
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [isVideoLoaded, videoSourceAdded]);

  // Load video lazily when component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !videoSourceAdded && !isVideoLoaded) {
          // We'll load the video source only when play is clicked now
          // Just mark the component as visible
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => observer.disconnect();
  }, [videoSourceAdded, isVideoLoaded]);

  return (
    <section className="relative flex flex-col items-center justify-start w-full pb-10">
      <div
        id="demo-section"
        className="flex flex-col items-center justify-center max-w-[1200px] w-full pb-10"
      >
        <div className="w-full border-y-0 bg-background">
          <LandingText className="!border-none">
            What if I told you that you could create a perfect README in just one step?
          </LandingText>
        </div>

        <BrowserWindow className="rounded-lg" url={'readmechef.com/demo'}>
          <div
            ref={videoContainerRef}
            style={{
              perspective: '1000px'
            }}
            className="w-full aspect-video bg-card overflow-hidden relative group"
          >
            <VideoPlayer
              videoRef={videoRef}
              isPlaying={isPlaying}
              isBuffering={isBuffering}
              handlePlayClick={handlePlayClick}
            />
          </div>
        </BrowserWindow>
      </div>
    </section>
  );
};

export default memo(DemoSection);
