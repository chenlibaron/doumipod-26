import React, { useState, useRef, useCallback, useEffect } from 'react';
import { generateStationAudio, generateSingleSpeakerAudio } from '../services/api';
import { decode, createWavBlobUrl } from '../utils/audio';
import { subwayChime, trainAmbience } from '../assets/audio';

export const useGameAudio = () => {
    const [audioCache, setAudioCache] = useState({});
    const [audioLoadingLine, setAudioLoadingLine] = useState(null);
    const [isSequencePlaying, setIsSequencePlaying] = useState(false);

    const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
    const announcementAudioRef = useRef<HTMLAudioElement | null>(null);
    const chimeAudioRef = useRef<HTMLAudioElement | null>(null);
    const ambienceAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Cleanup function to stop all audio when the component unmounts
        return () => {
            ttsAudioRef.current?.pause();
            announcementAudioRef.current?.pause();
            chimeAudioRef.current?.pause();
            ambienceAudioRef.current?.pause();
        };
    }, []);

    const playAudio = useCallback(async (text) => {
        if (audioLoadingLine === text) {
            if (ttsAudioRef.current) {
                ttsAudioRef.current.pause();
                ttsAudioRef.current.onended = null;
            }
            setAudioLoadingLine(null);
            return;
        }

        if (ttsAudioRef.current) {
            ttsAudioRef.current.pause();
            ttsAudioRef.current.onended = null;
        }

        const playFromUrl = (url) => {
            ttsAudioRef.current = new Audio(url);
            ttsAudioRef.current.play().catch(e => console.error("Audio playback error:", e));
            setAudioLoadingLine(text);
            ttsAudioRef.current.onended = () => setAudioLoadingLine(null);
            ttsAudioRef.current.onerror = () => {
                console.error("Audio playback error (onerror event)");
                setAudioLoadingLine(null);
            };
        };

        if (audioCache[text]) {
            playFromUrl(audioCache[text]);
            return;
        }

        setAudioLoadingLine(text);
        try {
            const audioB64 = await generateSingleSpeakerAudio(text);
            const pcmBytes = decode(audioB64);
            const pcmInt16 = new Int16Array(pcmBytes.buffer);
            const wavUrl = createWavBlobUrl(pcmInt16, 24000, 1);
            
            setAudioCache(prev => {
                const newCache = { ...prev, [text]: wavUrl };
                const keys = Object.keys(newCache);
                if (keys.length > 50) {
                    URL.revokeObjectURL(newCache[keys[0]]);
                    delete newCache[keys[0]];
                }
                return newCache;
            });
            playFromUrl(wavUrl);
        } catch (e) {
            console.error("Failed to fetch audio from API:", e);
            setAudioLoadingLine(null);
        }
    }, [audioLoadingLine, audioCache]);

    const playArrivalSequence = useCallback(async (stationName) => {
        setIsSequencePlaying(true);
        try {
            const audioData = await generateStationAudio(stationName);
            const stationAudioData = audioData.station_audio;
            
            const ambience = new Audio(trainAmbience);
            ambience.loop = true;
            ambience.volume = 0.3;
            ambience.play().catch(e => console.error("Ambience audio failed:", e));
            ambienceAudioRef.current = ambience;

            await new Promise(resolve => setTimeout(resolve, 800));

            const chime = new Audio(subwayChime);
            chime.play().catch(e => console.error("Chime audio failed:", e));
            chimeAudioRef.current = chime;
            
            await new Promise(resolve => { chime.onended = resolve; });

            const pcmBytes = decode(stationAudioData.audio_base64);
            const pcmInt16 = new Int16Array(pcmBytes.buffer);
            const wavUrl = createWavBlobUrl(pcmInt16, 24000, 1);
            
            const announcement = new Audio(wavUrl);
            announcement.play().catch(e => console.error("Announcement audio failed:", e));
            announcementAudioRef.current = announcement;

            await new Promise((resolve, reject) => {
                announcement.onended = resolve;
                announcement.onerror = reject;
            });

        } catch (error) {
            console.error("Failed to load station audio:", error);
            // Re-throw to be caught by the game logic hook
            throw new Error("Could not load station audio. Continuing without it.");
        } finally {
            ambienceAudioRef.current?.pause();
            setIsSequencePlaying(false);
        }
    }, []);

    return { playAudio, playArrivalSequence, audioLoadingLine, isSequencePlaying };
};