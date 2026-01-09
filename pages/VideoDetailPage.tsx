import React, { useState, useRef, useEffect, useCallback, FC, MouseEvent, TouchEvent, PointerEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LongVideo, ExplanationCard } from '../types';
import { ArrowLeftIcon, PlayIcon, PauseIcon, LightbulbIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, SpeakerWaveIcon, SpeakerXMarkIcon, Cog6ToothIcon, ChatBubbleBottomCenterTextIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, CheckIcon } from '../components/icons/Icons';
import { Card } from '../components/common/Card';
import { useAppContext } from '../contexts/AppContext';

interface VideoDetailPageProps {}

const formatTime = (timeInSeconds: number) => {
    const time = Math.floor(timeInSeconds || 0);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


const ExplanationCardView: FC<{ card: ExplanationCard; isCurrent: boolean }> = ({ card, isCurrent }) => (
    <div className={`w-full flex-shrink-0 snap-center transition-transform duration-300 ${isCurrent ? 'scale-100' : 'scale-90 opacity-60'}`}>
        <Card extraClasses="h-full flex flex-col justify-between">
            <div>
                <p className="text-2xl font-bold font-korean text-gray-800 dark:text-gray-200">{card.ko}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{card.en}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-start space-x-2">
                <LightbulbIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{card.hint}</p>
            </div>
        </Card>
    </div>
);

export const VideoDetailPage: FC<VideoDetailPageProps> = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { longVideos, videoPlaybackTimes, setVideoPlaybackTime, setMinimizedVideo } = useAppContext();
    
    const video = longVideos.find(v => v.id.toString() === videoId);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollableContentRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isScrubbing, setIsScrubbing] = useState(false);
    
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSettings, setShowSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const [subtitleLang, setSubtitleLang] = useState<'off' | 'ko' | 'en'>('off');
    const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
    const [showSubtitleSettings, setShowSubtitleSettings] = useState(false);


    const controlsTimeoutRef = useRef<number | null>(null);
    const touchStartY = useRef(0);
    const touchMoveY = useRef(0);
    const isPageDragging = useRef(false);
    const dragProgress = useRef(0);

    const onBack = () => navigate(-1);
    const onMinimize = (videoToMinimize: LongVideo, currentTime: number) => {
        setMinimizedVideo({ video: videoToMinimize, currentTime });
        navigate('/videos');
    };

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!video) return;
        return () => {
            if (videoEl) {
                if (videoEl.currentTime > 1 && videoEl.currentTime < videoEl.duration - 1) {
                    setVideoPlaybackTime(video.id, videoEl.currentTime);
                } else if (videoEl.ended || videoEl.currentTime >= videoEl.duration - 1) {
                    setVideoPlaybackTime(video.id, 0);
                }
            }
        };
    }, [video, setVideoPlaybackTime]);

    const hideControls = useCallback(() => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying && !isScrubbing && !showSettings && !showSubtitleSettings) {
                 setShowControls(false);
            }
        }, 3000);
    }, [isPlaying, isScrubbing, showSettings, showSubtitleSettings]);

    useEffect(() => {
        if (showControls) {
            hideControls();
        }
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        }
    }, [showControls, hideControls]);

    const togglePlayPause = useCallback(() => {
        const videoEl = videoRef.current;
        if (videoEl) {
            if (videoEl.paused) {
                videoEl.play();
            } else {
                videoEl.pause();
            }
            setShowControls(true); // Show controls on interaction
        }
    }, []);
    
    const handleRewind = (e: MouseEvent) => {
        e.stopPropagation();
        if(videoRef.current) videoRef.current.currentTime -= 10;
        hideControls();
    };

    const handleForward = (e: MouseEvent) => {
        e.stopPropagation();
        if(videoRef.current) videoRef.current.currentTime += 10;
        hideControls();
    };

    const handleVideoTap = () => {
        setShowControls(c => !c);
    };

    const handleTransitionEnd = () => {
        if (isClosing && video) {
            const currentTime = videoRef.current?.currentTime || 0;
            onMinimize(video, currentTime);
        }
    };

    const handleTouchStart = (e: TouchEvent) => {
        if (scrollableContentRef.current && scrollableContentRef.current.scrollTop === 0) {
            touchStartY.current = e.touches[0].clientY;
            touchMoveY.current = e.touches[0].clientY;
            isPageDragging.current = false;
        } else {
            touchStartY.current = 0;
        }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        if (touchStartY.current === 0) return;
    
        touchMoveY.current = e.touches[0].clientY;
        const deltaY = touchMoveY.current - touchStartY.current;
        
        if (deltaY < 0) return;
    
        const container = containerRef.current;
        if (container) {
            if (!isPageDragging.current) {
                isPageDragging.current = true;
            }
            e.preventDefault();
    
            dragProgress.current = Math.min(1, deltaY / (window.innerHeight / 1.5));
            
            container.style.transition = 'none';
            const scale = 1 - dragProgress.current * 0.15;
            container.style.transform = `translateY(${deltaY}px) scale(${scale})`;
            container.style.borderRadius = `${dragProgress.current * 32}px`;
            container.style.overflow = 'hidden';
        }
    };

    const handleTouchEnd = () => {
        if (!isPageDragging.current) return;
    
        const deltaY = touchMoveY.current - touchStartY.current;
        const container = containerRef.current;
        
        if (container) {
            container.style.transition = 'transform 0.3s ease-out, border-radius 0.3s ease-out, opacity 0.3s ease-out';
            if (deltaY > 150) {
                if (videoRef.current) {
                    videoRef.current.pause();
                }
                container.style.transform = `translateY(100vh) scale(0.8)`;
                container.style.opacity = '0.5';
                setIsClosing(true);
            } else {
                container.style.transform = 'translateY(0px) scale(1)';
                container.style.borderRadius = '0px';
            }
        }
        
        touchStartY.current = 0;
        touchMoveY.current = 0;
        isPageDragging.current = false;
        dragProgress.current = 0;
    };
    
    const scrollTimeoutRef = useRef<number | null>(null);

    const handleScroll = useCallback(() => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = window.setTimeout(() => {
            if (scrollRef.current) {
                const { scrollLeft, clientWidth } = scrollRef.current;
                const index = Math.round(scrollLeft / clientWidth);
                setCurrentIndex(index);
            }
        }, 150);
    }, []);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        scrollContainer?.addEventListener('scroll', handleScroll);
        return () => {
            scrollContainer?.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [handleScroll]);

    // Video Player State Handlers
    const handleTimeUpdate = () => {
        if (!isScrubbing && videoRef.current && video) {
            const currentTime = videoRef.current.currentTime;
            setProgress(currentTime);

            if (subtitleLang !== 'off' && video.subtitles) {
                const activeCue = video.subtitles.find(cue => currentTime >= cue.start && currentTime <= cue.end);
                if (activeCue) {
                    setCurrentSubtitle(activeCue[subtitleLang as 'ko' | 'en']);
                } else {
                    setCurrentSubtitle(null);
                }
            } else {
                setCurrentSubtitle(null);
            }
        }
    };
    const handleLoadedMetadata = () => {
        if (videoRef.current && video) {
            setDuration(videoRef.current.duration);
            const savedTime = videoPlaybackTimes[video.id];
            if (savedTime && typeof savedTime === 'number' && savedTime < videoRef.current.duration) {
                videoRef.current.currentTime = savedTime;
                setProgress(savedTime);
            }
        }
    };
    const handleEnded = () => setIsPlaying(false);

    // Timeline Scrubbing Logic
    const handleScrub = useCallback((clientX: number) => {
        const timeline = timelineRef.current;
        const videoEl = videoRef.current;
        if (!timeline || !videoEl || !duration) return;

        const rect = timeline.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const time = percentage * duration;

        videoEl.currentTime = time;
        setProgress(time);
    }, [duration]);

    const handlePointerDownTimeline = (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsScrubbing(true);
        if(controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        handleScrub(e.clientX);
    };

    const handlePointerMoveTimeline = useCallback((e: globalThis.PointerEvent) => {
        handleScrub(e.clientX);
    }, [handleScrub]);
    
    const handlePointerUpTimeline = useCallback(() => {
        setIsScrubbing(false);
        hideControls();
        window.removeEventListener('pointermove', handlePointerMoveTimeline);
        window.removeEventListener('pointerup', handlePointerUpTimeline);
    }, [hideControls, handlePointerMoveTimeline]);

    useEffect(() => {
        if (isScrubbing) {
            window.addEventListener('pointermove', handlePointerMoveTimeline);
            window.addEventListener('pointerup', handlePointerUpTimeline);
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMoveTimeline);
            window.removeEventListener('pointerup', handlePointerUpTimeline);
        }
    }, [isScrubbing, handlePointerMoveTimeline, handlePointerUpTimeline]);

    const handlePlaybackRateChange = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
            setShowSettings(false);
        }
    };
    
    // Fullscreen Logic
    const toggleFullscreen = useCallback(() => {
        const elem = videoContainerRef.current;
        if (!elem) return;
        
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    if (!video) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Video not found. <Link to="/videos" className="text-indigo-500 underline">Go back to videos.</Link></p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 bg-slate-50 dark:bg-slate-900 z-40 flex flex-col`}
            onTransitionEnd={handleTransitionEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div ref={videoContainerRef} className="w-full max-w-xl mx-auto flex-shrink-0 relative">
                <div className="aspect-video w-full bg-black cursor-pointer" onClick={handleVideoTap}>
                    <video
                        ref={videoRef}
                        src={video.videoUrl}
                        autoPlay
                        muted={isMuted}
                        className="w-full h-full object-contain pointer-events-none"
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={handleEnded}
                    />
                    {currentSubtitle && (
                        <div className="absolute bottom-4 left-0 right-0 px-4 text-center pointer-events-none">
                            <span className="px-3 py-1.5 bg-black/60 text-white text-sm sm:text-base rounded-md font-korean">
                                {currentSubtitle}
                            </span>
                        </div>
                    )}
                </div>
                
                <div 
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 flex flex-col justify-between pointer-events-none ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Top Bar */}
                    <div className="flex justify-between items-center p-4 pointer-events-auto">
                         <button onClick={onBack} className="p-2 bg-black/40 rounded-full">
                            <ArrowLeftIcon className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Center Controls */}
                    <div className="flex justify-center items-center space-x-12 pointer-events-auto">
                         <button onClick={handleRewind} className="p-2">
                            <ArrowUturnLeftIcon className="w-10 h-10 text-white"/>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); togglePlayPause();}}>
                            {isPlaying ? <PauseIcon className="w-16 h-16 text-white" /> : <PlayIcon className="w-16 h-16 text-white" />}
                        </button>
                        <button onClick={handleForward} className="p-2">
                            <ArrowUturnRightIcon className="w-10 h-10 text-white"/>
                        </button>
                    </div>

                    {/* Bottom Controls */}
                    <div className="p-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-auto">
                        <div 
                            ref={timelineRef}
                            onPointerDown={handlePointerDownTimeline}
                            className="flex-1 h-5 flex items-center group cursor-pointer"
                        >
                            <div className="relative w-full h-1 bg-white/30 rounded-full group-hover:h-2 transition-all">
                                <div className="absolute h-full bg-white/50 rounded-full" style={{ width: `100%`}}></div>
                                <div className="absolute h-full bg-indigo-400 rounded-full" style={{ width: `${(progress / duration) * 100}%` }}></div>
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full"
                                    style={{ left: `calc(${(progress / duration) * 100}% - 6px)` }}
                                ></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <span className="text-white text-xs font-mono">{formatTime(progress)}</span>
                                <span className="text-white/70 text-xs font-mono">/</span>
                                <span className="text-white/70 text-xs font-mono">{formatTime(duration)}</span>
                                <button onClick={() => setIsMuted(m => !m)} className="text-white">
                                    {isMuted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
                                </button>
                            </div>
                             <div className="flex items-center space-x-2 relative">
                                <div className="relative">
                                    <button onClick={() => setShowSubtitleSettings(s => !s)} className={`p-1 rounded-sm ${subtitleLang !== 'off' ? 'bg-indigo-500/50' : ''}`}>
                                        <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-white"/>
                                    </button>
                                    {showSubtitleSettings && (
                                        <div className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-lg p-2 text-white text-sm w-32">
                                            {(['off', 'ko', 'en'] as const).map(lang => (
                                                <button 
                                                    key={lang} 
                                                    onClick={() => {
                                                        setSubtitleLang(lang);
                                                        setShowSubtitleSettings(false);
                                                    }} 
                                                    className={`w-full text-left px-3 py-1.5 rounded-md hover:bg-white/20 flex justify-between items-center ${subtitleLang === lang ? 'font-bold' : ''}`}
                                                >
                                                    {lang === 'ko' ? '한국어' : lang === 'en' ? 'English' : 'Off'}
                                                    {subtitleLang === lang && <CheckIcon className="w-4 h-4"/>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setShowSettings(s => !s)} className="p-1">
                                    <Cog6ToothIcon className="w-6 h-6 text-white"/>
                                </button>
                                {showSettings && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-lg p-2 text-white text-sm">
                                        {[0.5, 1, 1.5, 2].map(rate => (
                                            <button key={rate} onClick={() => handlePlaybackRateChange(rate)} className={`w-full text-left px-3 py-1.5 rounded-md hover:bg-white/20 flex justify-between items-center ${playbackRate === rate ? 'font-bold' : ''}`}>
                                                {rate}x {playbackRate === rate && <CheckIcon className="w-4 h-4"/>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <button onClick={toggleFullscreen} className="p-1">
                                    {isFullscreen ? <ArrowsPointingInIcon className="w-6 h-6 text-white"/> : <ArrowsPointingOutIcon className="w-6 h-6 text-white"/>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={scrollableContentRef} className="flex-1 overflow-y-auto">
                 <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{video.title}</h1>
                 </div>

                 <div className="mt-6">
                    <div className="flex justify-between items-center px-4 mb-3">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Sentence Breakdown</h2>
                        <p className="text-sm font-mono text-gray-500 dark:text-gray-400">{currentIndex + 1} / {video.explanations.length}</p>
                    </div>
                    <div 
                        ref={scrollRef} 
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 px-4 pb-4"
                    >
                        {video.explanations.map((card, index) => (
                            <ExplanationCardView key={index} card={card} isCurrent={index === currentIndex} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};