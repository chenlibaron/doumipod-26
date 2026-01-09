import React, { useState, useRef, useEffect, FC } from 'react';
import { ShortVideo } from '../types';
import { XMarkIcon, PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './icons/Icons';

interface ShortVideoItemProps {
  video: ShortVideo;
  isActive: boolean;
}

const ShortVideoItem: FC<ShortVideoItemProps> = ({ video, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isActive) {
        // Explicitly load the media to ensure the correct video source is displayed.
        // This fixes issues where some browsers don't update the content for the <video> tag on src change.
        videoElement.load();
        // Attempt to play, but handle browser autoplay restrictions gracefully
        videoElement.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false); // If autoplay fails, show the play icon
        });
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive, video.videoUrl]); // Depend on both isActive and the videoUrl

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative h-full w-full snap-start flex-shrink-0 bg-black" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-contain"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
          <PlayIcon className="w-20 h-20 text-white/50" />
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none bg-gradient-to-t from-black/50 to-transparent p-2 rounded-b-lg">
        <h3 className="font-bold">{video.title}</h3>
        <p className="text-sm opacity-80">{video.views} views</p>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsMuted(m => !m); }} 
        className="absolute top-16 right-4 p-2 bg-black/40 rounded-full pointer-events-auto"
      >
        {isMuted ? <SpeakerXMarkIcon className="w-6 h-6 text-white" /> : <SpeakerWaveIcon className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
};

interface ShortVideoFeedViewerProps {
  videos: ShortVideo[];
  startIndex: number;
  onClose: () => void;
}

export const ShortVideoFeedViewer: FC<ShortVideoFeedViewerProps> = ({ videos, startIndex, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Set initial scroll position without animation
      container.scrollTop = startIndex * container.clientHeight;
    }

    const handleScroll = () => {
      if (container) {
        const newIndex = Math.round(container.scrollTop / container.clientHeight);
        setCurrentIndex(newIndex);
      }
    };
    
    let scrollTimeout: number;
    const debouncedScrollHandler = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(handleScroll, 150);
    };

    container?.addEventListener('scroll', debouncedScrollHandler);
    return () => {
        clearTimeout(scrollTimeout);
        container?.removeEventListener('scroll', debouncedScrollHandler);
    };
  }, [startIndex]);

  return (
    <div className="fixed inset-0 bg-black z-50 animate-fade-in" role="dialog" aria-modal="true">
      <div ref={containerRef} className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {videos.map((video, index) => (
          <ShortVideoItem
            key={video.id}
            video={video}
            isActive={index === currentIndex}
          />
        ))}
      </div>
      <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/40 rounded-full text-white z-10">
        <XMarkIcon className="w-6 h-6" />
      </button>
    </div>
  );
};