import React, { useState, useRef, useEffect, FC, MouseEvent } from 'react';
import { LongVideo } from '../types';
import { XMarkIcon, PlayIcon, PauseIcon } from './icons/Icons';

interface MiniVideoPlayerProps {
    videoData: { video: LongVideo, currentTime: number };
    onClose: () => void;
    onMaximize: (video: LongVideo) => void;
}

export const MiniVideoPlayer: FC<MiniVideoPlayerProps> = ({ videoData, onClose, onMaximize }) => {
    const { video, currentTime } = videoData;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (videoEl) {
            videoEl.currentTime = currentTime;
            const playPromise = videoEl.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => setIsPlaying(false));
            }
        }
        
        return () => {
            if (videoEl && !videoEl.paused) {
                videoEl.pause();
            }
        }
    }, [currentTime, video.videoUrl]);

    const handleTogglePlay = (e: MouseEvent) => {
        e.stopPropagation();
        const videoEl = videoRef.current;
        if (videoEl) {
            if (videoEl.paused) {
                videoEl.play().then(() => setIsPlaying(true));
            } else {
                videoEl.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleClose = (e: MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    const handleMaximize = () => {
        onMaximize(video);
    }

    return (
        <div 
            onClick={handleMaximize}
            className="fixed bottom-20 right-4 w-52 bg-black rounded-lg shadow-2xl cursor-pointer z-30 animate-slide-up-fast flex items-center justify-center overflow-hidden"
            style={{ aspectRatio: '16/9' }}
        >
            <style>{`
                @keyframes slide-up-fast {
                    from { transform: translateY(150%) scale(0.8); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .animate-slide-up-fast { animation: slide-up-fast 0.3s ease-out forwards; }
            `}</style>
            <video
                ref={videoRef}
                src={video.videoUrl}
                loop
                muted
                className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/20 flex justify-center items-center">
                 <button onClick={handleTogglePlay} className="p-2 bg-black/40 rounded-full text-white opacity-0 hover:opacity-100 transition-opacity">
                    {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
                </button>
            </div>
            <button onClick={handleClose} className="absolute top-1 right-1 p-1 bg-black/40 rounded-full text-white">
                <XMarkIcon className="w-5 h-5"/>
            </button>
        </div>
    );
};