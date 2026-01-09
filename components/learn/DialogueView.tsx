import React, { useState, useCallback, useRef, useEffect, FC } from 'react';
import { generateDialogue, generateDialogueAudio } from '../../services/api';
import { DialogueScript } from '../../types';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { PlayIcon, PauseIcon, ArrowPathIcon } from '../icons/Icons';
import { mainCardGradient, dialogueBubbleStyle } from './common';
import { decode, createWavBlobUrl } from '../../utils/audio';

type ExplanationLang = 'English' | 'Burmese';

interface DialogueViewProps {
    addPoints: (amount: number, type: 'learning' | 'social') => void;
}

interface DialogueCacheItem {
    script: DialogueScript;
    audioB64: string;
    duration: number;
}

const CACHE_KEY = 'doumipod-dialogueCache';

export const DialogueView: FC<DialogueViewProps> = ({ addPoints }) => {
    const [dialogueInput, setDialogueInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogueResult, setDialogueResult] = useState<DialogueScript | null>(null);
    
    // Audio State
    const [dialogueAudio, setDialogueAudio] = useState<{ url: string; duration: number } | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioCurrentTime, setAudioCurrentTime] = useState(0);
    const [isReplayable, setIsReplayable] = useState(false);
    const [activeDialogueLine, setActiveDialogueLine] = useState<number>(-1);
    const [dialogueTimings, setDialogueTimings] = useState<{start: number, end: number}[]>([]);
    const dialogueLineRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [explanationLang, setExplanationLang] = useState<ExplanationLang>('English');
    const [cache, setCache] = useState<Record<string, DialogueCacheItem>>({});

    useEffect(() => {
        try {
            const savedCache = localStorage.getItem(CACHE_KEY);
            if (savedCache) {
                setCache(JSON.parse(savedCache));
            }
        } catch (e) {
            console.error("Failed to load dialogue cache", e);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    const handleSearch = useCallback(async () => {
        const term = dialogueInput.trim();
        if (!term) return;

        if (cache[term]) {
            const cached = cache[term];
            const pcmBytes = decode(cached.audioB64);
            const pcmInt16 = new Int16Array(pcmBytes.buffer);
            const wavUrl = createWavBlobUrl(pcmInt16, 24000, 1);
            
            setDialogueResult(cached.script);
            setDialogueAudio({ url: wavUrl, duration: cached.duration });
            setIsLoading(false);
            setIsAudioLoading(false);
            return;
        }

        setIsLoading(true);
        setIsAudioLoading(true);
        setError(null);
        setDialogueResult(null);
        setDialogueAudio(null);
        setIsAudioPlaying(false);
        setAudioProgress(0);
        setAudioCurrentTime(0);
        setIsReplayable(false);
        setActiveDialogueLine(-1);
        try {
            const script = await generateDialogue(dialogueInput);
            setDialogueResult(script);
            addPoints(5, 'learning');
            setIsLoading(false);

            try {
                const audioB64 = await generateDialogueAudio(script);
                const pcmBytes = decode(audioB64);
                const pcmInt16 = new Int16Array(pcmBytes.buffer);
                const wavUrl = createWavBlobUrl(pcmInt16, 24000, 1);
                
                const audio = new Audio(wavUrl);
                audio.onloadedmetadata = () => {
                    const duration = audio.duration;
                    setDialogueAudio({ url: wavUrl, duration });
                    
                    const newCacheItem: DialogueCacheItem = { script, audioB64, duration };
                    const newCache = { ...cache, [term]: newCacheItem };
                    setCache(newCache);
                    localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
                };
                audio.onerror = () => {
                    setError('Failed to load generated audio.');
                };
            } catch (audioErr) {
                console.error("Audio generation error:", audioErr);
                setError('Dialogue generated, but failed to create audio.');
            } finally {
                setIsAudioLoading(false);
            }
        } catch (err) {
            setError('Failed to fetch dialogue. Please try again.');
            setIsLoading(false);
            setIsAudioLoading(false);
        }
    }, [dialogueInput, addPoints, cache]);

    useEffect(() => {
        if (dialogueResult && dialogueAudio) {
            dialogueLineRefs.current = dialogueLineRefs.current.slice(0, dialogueResult.dialogue.length);
            const totalChars = dialogueResult.dialogue.reduce((sum, line) => sum + line.korean.length, 0);
            if (totalChars === 0) return;
            let cumulativeTime = 0;
            const timings = dialogueResult.dialogue.map(line => {
                const lineDuration = (line.korean.length / totalChars) * dialogueAudio.duration;
                const startTime = cumulativeTime;
                cumulativeTime += lineDuration;
                const endTime = cumulativeTime;
                return { start: startTime, end: endTime };
            });
            setDialogueTimings(timings);
        } else {
            setDialogueTimings([]);
        }
    }, [dialogueResult, dialogueAudio]);

    useEffect(() => {
        if (activeDialogueLine !== -1) {
            dialogueLineRefs.current[activeDialogueLine]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeDialogueLine]);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isReplayable) {
            audio.currentTime = 0;
            audio.play();
            setIsReplayable(false);
            return;
        }
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    };

    return (
        <div>
            <div className="flex space-x-2">
                <input value={dialogueInput} onChange={(e) => setDialogueInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} type="text" placeholder="e.g., ordering food" className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
                <button onClick={handleSearch} disabled={isLoading || isAudioLoading} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-indigo-300">Generate</button>
            </div>
            {isLoading && <div className="mt-4 flex justify-center"><LoadingSpinner /></div>}
            {error && <div className="mt-4 text-center text-red-500">{error}</div>}
            {dialogueResult && (
                <Card extraClasses={`mt-4 ${mainCardGradient}`}>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center font-korean">{dialogueResult.title}</h3>
                    {isAudioLoading ? (
                         <div className="flex items-center justify-center space-x-2 p-4 text-slate-700 dark:text-slate-200">
                            <LoadingSpinner />
                            <span>Generating audio...</span>
                        </div>
                    ) : dialogueAudio && (
                         <div className="p-2 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-sm mb-4">
                            <audio
                                ref={audioRef}
                                src={dialogueAudio.url}
                                onPlay={() => setIsAudioPlaying(true)}
                                onPause={() => setIsAudioPlaying(false)}
                                onTimeUpdate={() => {
                                    if (audioRef.current) {
                                        const currentTime = audioRef.current.currentTime;
                                        setAudioCurrentTime(currentTime);
                                        setAudioProgress((currentTime / audioRef.current.duration) * 100);
                                        const activeIndex = dialogueTimings.findIndex(t => currentTime >= t.start && currentTime < t.end);
                                        if (activeIndex !== -1) {
                                            setActiveDialogueLine(activeIndex);
                                        }
                                    }
                                }}
                                onEnded={() => {
                                    setIsAudioPlaying(false);
                                    setIsReplayable(true);
                                    setActiveDialogueLine(-1);
                                }}
                                className="hidden"
                            />
                            <div className="flex items-center space-x-3">
                                <button onClick={handlePlayPause} className="p-2 text-slate-800 dark:text-slate-100">
                                    {isReplayable ? <ArrowPathIcon className="w-6 h-6" /> : isAudioPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                                </button>
                                <div className="flex-1 flex items-center space-x-2">
                                     <span className="text-xs font-mono text-slate-700 dark:text-slate-200 w-10 text-center">{new Date(audioCurrentTime * 1000).toISOString().substr(14, 5)}</span>
                                    <input type="range" value={audioProgress} min="0" max="100" onChange={(e) => { if(audioRef.current) audioRef.current.currentTime = (dialogueAudio.duration * parseInt(e.target.value)) / 100; if(isReplayable) setIsReplayable(false); }} className="w-full h-1.5 bg-white/50 rounded-lg appearance-none cursor-pointer range-thumb" />
                                    <span className="text-xs font-mono text-slate-700 dark:text-slate-200 w-10 text-center">{new Date(dialogueAudio.duration * 1000).toISOString().substr(14, 5)}</span>
                                </div>
                            </div>
                             <style>{`.range-thumb::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #6366f1; cursor: pointer; } .range-thumb::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #6366f1; cursor: pointer; }`}</style>
                        </div>
                    )}
                    <div className="flex justify-start mb-3 space-x-2">
                        <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                        <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                        {dialogueResult.dialogue.map((line, i) => (
                            <div
                                key={i}
                                ref={el => { dialogueLineRefs.current[i] = el; }}
                                className={`flex flex-col ${line.speaker === 'Ji-woo' ? 'items-start' : 'items-end'}`}
                            >
                                <div className={`p-2 rounded-lg max-w-xs transition-colors duration-300 ${activeDialogueLine === i ? 'bg-indigo-200/50 dark:bg-indigo-900/50' : dialogueBubbleStyle}`}>
                                    <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs mb-1">{line.speaker}</p>
                                    <p className="font-medium text-slate-800 dark:text-slate-100 font-korean">{line.korean}</p>
                                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{explanationLang === 'English' ? line.english : line.burmese}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};