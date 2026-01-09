import React, { useState, useCallback, useEffect, FC } from 'react';
import { useAIFetch } from '../../hooks/useAIFetch';
import { fetchDictionaryEntry } from '../../services/api';
import { DictionaryEntry, AudioPlaybackStyle } from '../../types';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SpeakerWaveIcon } from '../icons/Icons';
import { mainCardGradient, nestedCardStyle } from './common';

type ExplanationLang = 'English' | 'Burmese';

interface DictionaryViewProps {
    addPoints: (amount: number, type: 'learning' | 'social') => void;
}

const CACHE_KEY = 'doumipod-dictionaryCache';
const LAST_SEARCH_KEY = 'doumipod-dictionaryLastSearch';

export const DictionaryView: FC<DictionaryViewProps> = ({ addPoints }) => {
    const [dictionaryInput, setDictionaryInput] = useState('');
    const [cache, setCache] = useState<Record<string, DictionaryEntry>>({});
    const { data: dictionaryResult, isLoading, error, execute, setData } = useAIFetch(fetchDictionaryEntry);
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
            console.error("Failed to load dictionary cache", e);
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
                addPoints(3, 'learning');
            }
        } catch (e) {
            // error is handled by hook
        }
    }, [execute, setData, addPoints, cache]);

    useEffect(() => {
        if (hasLoaded) {
            const lastSearch = localStorage.getItem(LAST_SEARCH_KEY);
            if (lastSearch) {
                setDictionaryInput(lastSearch);
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
                <input value={dictionaryInput} onChange={(e) => setDictionaryInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch(dictionaryInput)} type="text" placeholder="e.g., 사랑" className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
                <button onClick={() => handleSearch(dictionaryInput)} disabled={isLoading} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-indigo-300">Search</button>
            </div>
            {isLoading && <div className="mt-4 flex justify-center"><LoadingSpinner /></div>}
            {error && <div className="mt-4 text-center text-red-500">{error}</div>}
            {dictionaryResult && (
                 <Card extraClasses={`mt-4 ${mainCardGradient}`}>
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-korean">{dictionaryResult.hangul}</h3>
                        <button onClick={() => playAudio(dictionaryResult.hangul)} aria-label="Play pronunciation" className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors disabled:opacity-50" disabled={!!audioLoadingLine}>
                            {audioLoadingLine === dictionaryResult.hangul ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div> : <SpeakerWaveIcon className="w-6 h-6" />}
                        </button>
                        <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 font-korean">{dictionaryResult.korean_pronunciation}</span>
                    </div>
                    <p className="text-md text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{dictionaryResult.pronunciation}</span> | <span className="italic">{dictionaryResult.part_of_speech}</span>
                    </p>
                    <div className="flex justify-start my-3 space-x-2">
                        <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                        <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 mb-4">{explanationLang === 'English' ? dictionaryResult.definition_english : dictionaryResult.definition_burmese}</p>

                    {dictionaryResult.conjugation && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Conjugation</h4>
                            <div className={`p-3 rounded-lg text-sm ${nestedCardStyle}`}>
                                {Object.entries(dictionaryResult.conjugation).map(([form, values]) => {
                                    if (Array.isArray(values) && values.length > 0) {
                                        return (
                                            <div key={form} className="grid grid-cols-3 gap-2 py-2 border-b border-indigo-200/50 dark:border-indigo-800/50 last:border-b-0">
                                                <div className="col-span-1 font-semibold text-slate-700 dark:text-slate-200 capitalize">{form.replace('_', ' ')}</div>
                                                <div className="col-span-2 font-korean text-slate-800 dark:text-slate-100">
                                                    {values.join(', ')}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    )}


                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Example Sentences</h4>
                    <ul className="space-y-3">
                        {dictionaryResult.example_sentences.map((ex, i) => (
                            <li key={i} className={`p-2 ${nestedCardStyle}`}>
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-slate-800 dark:text-slate-100 font-korean">{ex.korean}</p>
                                    <button onClick={() => playAudio(ex.korean)} aria-label="Play pronunciation" className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors disabled:opacity-50" disabled={!!audioLoadingLine}>
                                        {audioLoadingLine === ex.korean ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div> : <SpeakerWaveIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{explanationLang === 'English' ? ex.english : ex.burmese}</p>
                            </li>
                        ))}
                    </ul>
                 </Card>
            )}
        </div>
    );
};