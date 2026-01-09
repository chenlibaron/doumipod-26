import React, { useState, useCallback, useEffect, FC } from 'react';
import { useAIFetch } from '../../hooks/useAIFetch';
import { generateVocabulary } from '../../services/api';
import { VocabularyWord, AudioPlaybackStyle } from '../../types';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SpeakerWaveIcon } from '../icons/Icons';
import { mainCardGradient, nestedCardStyle } from './common';

type ExplanationLang = 'English' | 'Burmese';

interface VocabularyViewProps {
    addPoints: (amount: number, type: 'learning' | 'social') => void;
}

const CACHE_KEY = 'doumipod-vocabularyCache';
const LAST_SEARCH_KEY = 'doumipod-vocabularyLastSearch';

export const VocabularyView: FC<VocabularyViewProps> = ({ addPoints }) => {
    const [vocabInput, setVocabInput] = useState('');
    const [cache, setCache] = useState<Record<string, VocabularyWord[]>>({});
    const { data: vocabResult, isLoading, error, execute, setData } = useAIFetch(generateVocabulary);
    const [explanationLang, setExplanationLang] = useState<ExplanationLang>('English');
    const [audioLoadingLine, setAudioLoadingLine] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    
    useEffect(() => {
        try {
            const savedCache = localStorage.getItem(CACHE_KEY);
            if (savedCache) {
                setCache(JSON.parse(savedCache));
            }
        } catch (e) {
            console.error("Failed to load vocabulary cache", e);
        }
        setHasLoaded(true);
    }, []);

    const handleSearch = useCallback(async (termToSearch: string) => {
        const term = termToSearch.trim();
        if (!term) return;

        localStorage.setItem(LAST_SEARCH_KEY, term);
        
        if (cache[term]) {
            setData(cache[term]);
            return;
        }
        try {
            const result = await execute(term);
            if (result) {
                setCache(prevCache => {
                    const newCache = { ...prevCache, [term]: result };
                    localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
                    return newCache;
                });
                addPoints(5, 'learning');
            }
        } catch (e) {
            // error is handled by hook
        }
    }, [execute, setData, addPoints, cache]);

    useEffect(() => {
        if (hasLoaded) {
            const lastSearch = localStorage.getItem(LAST_SEARCH_KEY);
            if (lastSearch) {
                setVocabInput(lastSearch);
                handleSearch(lastSearch);
            }
        }
    }, [hasLoaded, handleSearch]);

    const playAudio = useCallback((text: string) => {
        if ('speechSynthesis' in window && !audioLoadingLine) {
            setAudioLoadingLine(text);
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.rate = 0.9;
            
            const onEnd = () => setAudioLoadingLine(null);
            utterance.onend = onEnd;
            utterance.onerror = onEnd;

            window.speechSynthesis.speak(utterance);
        } else if (!('speechSynthesis' in window)) {
            alert('Sorry, your browser does not support text-to-speech functionality.');
        }
    }, [audioLoadingLine]);

    return (
         <div>
            <div className="flex space-x-2">
                <input value={vocabInput} onChange={(e) => setVocabInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch(vocabInput)} type="text" placeholder="e.g., food" className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
                <button onClick={() => handleSearch(vocabInput)} disabled={isLoading} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-indigo-300">Generate</button>
            </div>
            {isLoading && <div className="mt-4 flex justify-center"><LoadingSpinner /></div>}
            {error && <div className="mt-4 text-center text-red-500">{error}</div>}
            {vocabResult && (
                <div className={`mt-4 p-4 rounded-xl ${mainCardGradient}`}>
                    <div className="flex justify-start mb-2 space-x-2">
                        <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                        <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                    </div>
                    <div className="space-y-2">
                        {vocabResult.map((word, i) => (
                            <Card key={i} extraClasses={nestedCardStyle}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 font-korean">{word.hangul}</p>
                                         <button onClick={() => playAudio(word.hangul)} aria-label="Play pronunciation" className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors disabled:opacity-50" disabled={!!audioLoadingLine}><SpeakerWaveIcon className="w-4 h-4" /></button>
                                    </div>
                                    <p className="text-md text-slate-700 dark:text-slate-300 text-right">{word.english} / {word.burmese}</p>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 font-korean">{word.example_korean}</p>
                                        <button onClick={() => playAudio(word.example_korean)} aria-label="Play pronunciation" className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors disabled:opacity-50" disabled={!!audioLoadingLine}>
                                            {audioLoadingLine === word.example_korean ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div> : <SpeakerWaveIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{explanationLang === 'English' ? word.example_english : word.example_burmese}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};