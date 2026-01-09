import React, { useEffect, useRef, useState, FC } from 'react';
import { XMarkIcon, MicrophoneIcon, PlayIcon, PauseIcon } from './icons/Icons';

interface MediaViewerModalProps {
  media: { url: string; type: 'image' | 'video' | 'audio'; duration?: number } | null;
  onClose: () => void;
}

const formatTime = (seconds: number) => {
    const s = Math.floor(seconds || 0);
    const minutes = Math.floor(s / 60);
    const remainingSeconds = s % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MediaViewerModal: FC<MediaViewerModalProps> = ({ media, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // FIX: Use the native DOM KeyboardEvent for window.addEventListener, not React's synthetic event.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (media?.type === 'video' && video) {
      // The `autoPlay` prop with `muted` is more reliable for autoplaying video.
      // Programmatic play can be blocked by browsers.
      return () => {
        if (video && !video.paused) {
          video.pause();
        }
      };
    }
    
    const audio = audioRef.current;
    if (media?.type === 'audio' && audio) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
             playPromise.then(() => setIsPlaying(true)).catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Audio playback error:", error);
                }
            });
        }

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        };
        const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', onEnded);
        
        return () => {
            audio.pause();
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', onEnded);
        };
    } else {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
    }
  }, [media]);

   const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Audio playback error:", error);
                }
            });
        }
        setIsPlaying(!isPlaying);
    };

  if (!media) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {media.type === 'video' ? (
          <video
            ref={videoRef}
            src={media.url}
            controls
            autoPlay
            muted
            loop
            className="max-w-full max-h-full rounded-lg shadow-2xl outline-none"
          />
        ) : media.type === 'image' ? (
          <img
            src={media.url}
            alt="Full screen view"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
          />
        ) : (
             <div className="bg-white dark:bg-slate-800 p-8 rounded-xl w-full max-w-sm flex flex-col items-center space-y-6 shadow-2xl">
                <div className="p-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                    <MicrophoneIcon className="w-16 h-16 text-indigo-500" />
                </div>
                <audio ref={audioRef} src={media.url} preload="auto" />
                <div className="w-full flex items-center gap-4">
                  <button onClick={togglePlay} className="p-2 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                     {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />} 
                  </button>
                  <div className="flex-grow bg-gray-200 dark:bg-slate-600 h-2 rounded-full">
                     <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <div className="w-full flex justify-between text-xs font-mono text-gray-500 dark:text-gray-400">
                   <span>{formatTime(currentTime)}</span>
                   <span>{formatTime(media.duration || 0)}</span>
                </div>
              </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/70 hover:text-white bg-black/30 rounded-full p-2"
          aria-label="Close media viewer"
        >
          <XMarkIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default MediaViewerModal;