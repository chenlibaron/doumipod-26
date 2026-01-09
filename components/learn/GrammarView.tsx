import React, { useState, useCallback, useEffect, FC } from 'react';
import { useAIFetch } from '../../hooks/useAIFetch';
import { generateGrammarExplanation } from '../../services/api';
import { GrammarExplanation, AudioPlaybackStyle } from '../../types';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SpeakerWaveIcon } from '../icons/Icons';
import { mainCardGradient, nestedCardStyle, GrammarDetailSection } from './common';

type ExplanationLang = 'English' | 'Burmese';

interface GrammarViewProps {
    addPoints: (amount: number, type: 'learning' | 'social') => void;
}

const CACHE_KEY = 'doumipod-grammarCache';
const LAST_SEARCH_KEY = 'doumipod-grammarLastSearch';

export const GrammarView: FC<GrammarViewProps> = ({ addPoints }) => {
    const [grammarInput, setGrammarInput] = useState('');
    const [cache, setCache] = useState<Record<string, GrammarExplanation>>({});
    const { data: grammarResult, isLoading, error, execute, setData } = useAIFetch(generateGrammarExplanation);
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
            console.error("Failed to load grammar cache", e);
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
            // error is already set by the hook
        }
    }, [execute, setData, addPoints, cache]);

    useEffect(() => {
        if (hasLoaded) {
            const lastSearch = localStorage.getItem(LAST_SEARCH_KEY);
            if (lastSearch) {
                setGrammarInput(lastSearch);
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
                <input value={grammarInput} onChange={(e) => setGrammarInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch(grammarInput)} type="text" placeholder="e.g., -(으)세요" className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
                <button onClick={() => handleSearch(grammarInput)} disabled={isLoading} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-indigo-300">Search</button>
            </div>
            {isLoading && <div className="mt-4 flex justify-center"><LoadingSpinner /></div>}
            {error && <div className="mt-4 text-center text-red-500">{error}</div>}
            {grammarResult && (
                <Card extraClasses={`mt-4 ${mainCardGradient}`}>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-korean">{grammarResult.title}</h3>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 font-korean">{grammarResult.explanation_korean}</p>
                    <div className="flex justify-start my-3 space-x-2">
                        <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                        <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">{explanationLang === 'English' ? grammarResult.explanation_english : grammarResult.explanation_burmese}</p>
                    
                    <GrammarDetailSection title="Construction" content={explanationLang === 'English' ? grammarResult.construction_rules_english : grammarResult.construction_rules_burmese} />
                    <GrammarDetailSection title="Usage Notes" content={explanationLang === 'English' ? grammarResult.usage_notes_english : grammarResult.usage_notes_burmese} />
                    <GrammarDetailSection title="Common Mistakes" content={explanationLang === 'English' ? grammarResult.common_mistakes_english : grammarResult.common_mistakes_burmese} />
                    <GrammarDetailSection title="Politeness Level" content={explanationLang === 'English' ? grammarResult.politeness_level_english : grammarResult.politeness_level_burmese} />

                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">Example Sentences</h4>
                    <ul className="space-y-3">
                        {grammarResult.example_sentences.map((ex, i) => (
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