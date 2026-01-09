

import React, { useState, useEffect, useRef, useCallback, MouseEvent, TouchEvent, FC } from 'react';
import { LoadingSpinner } from './common/LoadingSpinner';
import { PaperAirplaneIcon, XMarkIcon } from './icons/Icons';

interface VideoTrimmerModalProps {
  video: { url: string; file: File } | null;
  onClose: () => void;
  onTrimComplete: (trimmedVideoBlob: Blob) => void;
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

const VideoTrimmerModal: FC<VideoTrimmerModalProps> = ({ video, onClose, onTrimComplete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [isTrimming, setIsTrimming] = useState(false);
    const [draggingHandle, setDraggingHandle] = useState<'start' | 'end' | null>(null);

    const interactionHandlerRef = useRef<((e: globalThis.MouseEvent | globalThis.TouchEvent) => void) | undefined>(undefined);
    
    useEffect(() => {
        const videoElement = videoRef.current;
        // Cleanup function to pause video on unmount, preventing interruption errors.
        return () => {
            if (videoElement && !videoElement.paused) {
                videoElement.pause();
            }
        }
    }, []);

    useEffect(() => {
        interactionHandlerRef.current = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
            if (!timelineRef.current || !duration || !draggingHandle) return;
            
            const timeline = timelineRef.current;
            const rect = timeline.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            const time = percentage * duration;

            if (draggingHandle === 'start') {
                if (time < endTime) setStartTime(time);
            } else if (draggingHandle === 'end') {
                if (time > startTime) setEndTime(time);
            }
        };
    }); 

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && !draggingHandle) {
            videoElement.currentTime = startTime;
        }
    }, [startTime, draggingHandle]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && !draggingHandle) {
            videoElement.currentTime = endTime;
        }
    }, [endTime, draggingHandle]);
    
    const handleLoadedMetadata = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            setDuration(videoElement.duration);
            setEndTime(videoElement.duration);
        }
    };

    const handleTimeUpdate = () => {
        const videoElement = videoRef.current;
        if (videoElement && !draggingHandle) {
            setPlaybackTime(videoElement.currentTime);
            // Loop within the selected range
            if (videoElement.currentTime >= endTime) {
                videoElement.currentTime = startTime;
                videoElement.play().catch(e => {
                    if (e.name !== 'AbortError') console.error("Loop playback error:", e);
                });
            }
        }
    };
    
    const startDrag = (handle: 'start' | 'end') => (e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        setDraggingHandle(handle);
    };

    const stopDrag = useCallback(() => {
        setDraggingHandle(null);
    }, []);

    useEffect(() => {
        if (!draggingHandle) return;

        const eventListener = (e: globalThis.MouseEvent | globalThis.TouchEvent) => interactionHandlerRef.current?.(e);

        window.addEventListener('mousemove', eventListener);
        window.addEventListener('touchmove', eventListener);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);

        return () => {
            window.removeEventListener('mousemove', eventListener);
            window.removeEventListener('touchmove', eventListener);
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchend', stopDrag);
        };
    }, [draggingHandle, stopDrag]);

    const handleTrimAndSend = async () => {
        if (!video || !videoRef.current) return;
        setIsTrimming(true);

        const videoElement = videoRef.current;

        // Browser compatibility check for captureStream
        if (typeof (videoElement as any).captureStream !== 'function') {
            alert("Your browser does not support the video trimming feature. Please try a different browser like Chrome or Firefox.");
            setIsTrimming(false);
            return;
        }

        try {
            const stream = (videoElement as any).captureStream();
            const recorder = new MediaRecorder(stream, { mimeType: video.file.type });

            const chunks: Blob[] = [];
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            
            recorder.onstop = () => {
                const trimmedBlob = new Blob(chunks, { type: video.file.type });
                onTrimComplete(trimmedBlob);
                setIsTrimming(false);
            };

            recorder.start();
            videoElement.currentTime = startTime;

            try {
                await videoElement.play();
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Video play interrupted by user action, trimming cancelled.');
                    recorder.stop();
                    setIsTrimming(false);
                    return;
                }
                throw error;
            }

            setTimeout(() => {
                if (recorder.state === "recording") {
                    recorder.stop();
                    videoElement.pause();
                }
            }, (endTime - startTime) * 1000);

        } catch (error) {
            console.error("Error trimming video:", error);
            setIsTrimming(false);
        }
    };

    if (!video) return null;
    
    const startPercent = (startTime / duration) * 100;
    const endPercent = (endTime / duration) * 100;
    const playbackPercent = (playbackTime / duration) * 100;

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-lg shadow-2xl flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Trim Video</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 flex-1 flex items-center justify-center min-h-0">
                    <video
                        ref={videoRef}
                        src={video.url}
                        className="w-full max-h-full rounded-lg bg-black object-contain"
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                    />
                </div>
                
                <div className="px-6 py-4 space-y-4">
                    <div ref={timelineRef} className="relative h-10 w-full flex items-center cursor-ew-resize">
                        {/* Timeline Track */}
                        <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        {/* Selected Range */}
                        <div className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-indigo-500 rounded-full" style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}></div>
                        {/* Playback Progress */}
                        { (playbackTime >= startTime && playbackTime <= endTime) &&
                            <div className="absolute top-1/2 -translate-y-1/2 h-1 w-1 bg-white rounded-full" style={{ left: `${playbackPercent}%` }}></div>
                        }
                        {/* Start Handle */}
                        <div
                            onMouseDown={startDrag('start')}
                            onTouchStart={startDrag('start')}
                            className="absolute top-1/2 w-4 h-6 bg-white dark:bg-gray-300 rounded-md border-2 border-indigo-500 cursor-ew-resize"
                            style={{ left: `${startPercent}%`, transform: 'translate(-50%, -50%)' }}
                        ></div>
                        {/* End Handle */}
                        <div
                            onMouseDown={startDrag('end')}
                            onTouchStart={startDrag('end')}
                            className="absolute top-1/2 w-4 h-6 bg-white dark:bg-gray-300 rounded-md border-2 border-indigo-500 cursor-ew-resize"
                            style={{ left: `${endPercent}%`, transform: 'translate(-50%, -50%)' }}
                        ></div>
                    </div>
                     <div className="flex justify-between text-sm font-mono text-gray-600 dark:text-gray-400">
                        <span>{formatTime(startTime)}</span>
                        <span>{formatTime(endTime)}</span>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={handleTrimAndSend}
                        disabled={isTrimming}
                        className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800"
                    >
                        {isTrimming ? <LoadingSpinner /> : <PaperAirplaneIcon className="w-5 h-5" />}
                        <span>{isTrimming ? 'Sending...' : 'Send'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoTrimmerModal;