import React, { useState, useEffect, useRef, useCallback, FC } from 'react';
import { XMarkIcon, RecordCircleIcon, CheckIcon, ArrowUturnLeftIcon, ArrowPathIcon } from './icons/Icons';

interface VideoRecorderProps {
    onComplete: (blob: Blob) => void;
    onClose: () => void;
}

const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

export const VideoRecorder: FC<VideoRecorderProps> = ({ onComplete, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerIntervalRef = useRef<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

    useEffect(() => {
        let stream: MediaStream | null = null;
        let objectUrl: string | null = null;
        const videoEl = videoRef.current;

        if (!videoEl) return;

        if (recordedBlob) {
            videoEl.srcObject = null;
            objectUrl = URL.createObjectURL(recordedBlob);
            videoEl.src = objectUrl;
            videoEl.load();
            videoEl.play().catch(e => console.error("Recorded blob playback failed", e));
        } else {
            videoEl.src = '';
            navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: true,
            }).then(mediaStream => {
                stream = mediaStream;
                streamRef.current = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play().catch(e => console.error("Camera autoplay failed", e));
                } else {
                    stream.getTracks().forEach(track => track.stop());
                }
            }).catch(err => {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please check permissions.");
            });
        }
    
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
            streamRef.current = null;
        };
    }, [recordedBlob, facingMode]);
    
    const startRecording = () => {
        if (!streamRef.current) return;
        
        chunksRef.current = [];
        const recorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = recorder;
        
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setRecordedBlob(blob);
        };
        
        recorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        timerIntervalRef.current = window.setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };
    
    const handleSwitchCamera = () => {
        if (isRecording) return;
        setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    };

    const handleUseVideo = () => {
        if (recordedBlob) {
            onComplete(recordedBlob);
        }
    };
    
    const handleRetake = () => {
        setRecordedBlob(null);
    };

    if (error) {
        return (
            <div className="bg-black text-white h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg">Close</button>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col" role="dialog" aria-modal="true">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                loop={!!recordedBlob}
            />

            <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-between">
                    {!recordedBlob && !isRecording ? (
                        <button onClick={handleSwitchCamera} className="p-2 bg-black/40 rounded-full">
                            <ArrowPathIcon className="w-6 h-6 text-white" />
                        </button>
                    ) : <div />}
                    <button onClick={onClose} className="p-2 bg-black/40 rounded-full">
                        <XMarkIcon className="w-6 h-6 text-white" />
                    </button>
                </div>

                {recordedBlob ? (
                    <div className="flex justify-around items-center">
                        <button onClick={handleRetake} className="flex flex-col items-center space-y-1 text-white font-semibold">
                            <div className="p-3 bg-white/30 rounded-full"><ArrowUturnLeftIcon className="w-7 h-7" /></div>
                            <span>Retake</span>
                        </button>
                         <button onClick={handleUseVideo} className="flex flex-col items-center space-y-1 text-white font-semibold">
                            <div className="p-3 bg-indigo-500 rounded-full"><CheckIcon className="w-7 h-7" /></div>
                            <span>Use Video</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        {isRecording && <div className="text-white bg-black/40 px-2 py-1 rounded-md mb-2 font-mono">{formatTime(recordingTime)}</div>}
                        <button onClick={isRecording ? stopRecording : startRecording} className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                            {isRecording ? (
                                <div className="w-8 h-8 bg-red-500 rounded-md animate-pulse"></div>
                            ) : (
                                <RecordCircleIcon className="w-16 h-16 text-red-500"/>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};