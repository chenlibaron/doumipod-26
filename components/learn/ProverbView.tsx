import React, { useState, useCallback, useEffect, FC, ReactNode } from 'react';
import { generateProverbFlashcard, generateProverbImage } from '../../services/api';
import { ProverbFlashcard, DialogueLine, AudioPlaybackStyle } from '../../types';
import { koreanProverbs } from '../../data/proverbs';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ArrowLeftIcon, SpeakerWaveIcon } from '../icons/Icons';
import { mainCardGradient, nestedCardStyle, dialogueBubbleStyle } from './common';

type FlashcardTab = 'Explanation' | 'Dialogue' | 'Usage' | 'Vocabulary';
type ExplanationLang = 'English' | 'Burmese';

interface ProverbViewProps {
    addPoints: (amount: number, type: 'learning' | 'social') => void;
}

const CACHE_KEY = 'doumipod-proverbCache';

export const ProverbView: FC<ProverbViewProps> = ({ addPoints }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProverbData, setSelectedProverbData] = useState<ProverbFlashcard | null>(null);
    const [selectedProverbImage, setSelectedProverbImage] = useState<string | null>(null);
    const [activeProverbTab, setActiveProverbTab] = useState<FlashcardTab>('Explanation');
    const [explanationLang, setExplanationLang] = useState<ExplanationLang>('English');
    const [audioLoadingLine, setAudioLoadingLine] = useState<string | null>(null);
    
    const [cache, setCache] = useState<Record<string, { flashcard: ProverbFlashcard, image: string | null }>>({});

    useEffect(() => {
        try {
            const savedCache = localStorage.getItem(CACHE_KEY);
            if (savedCache) {
                setCache(JSON.parse(savedCache));
            }
        } catch (e) {
            console.error("Failed to load proverb cache", e);
        }
    }, []);

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

    const handleSelectProverb = useCallback(async (proverb: string) => {
        if (cache[proverb]) {
            setSelectedProverbData(cache[proverb].flashcard);
            setSelectedProverbImage(cache[proverb].image);
            return;
        }

        setIsLoading(true);
        setIsImageLoading(true);
        setError(null);
        setSelectedProverbData(null);
        setSelectedProverbImage(null);

        try {
            const data = await generateProverbFlashcard(proverb);
            setSelectedProverbData(data);
            addPoints(15, 'learning');
            setIsLoading(false);

            let imageData: string | null = null;
            try {
                imageData = await generateProverbImage(data.image_prompt);
                setSelectedProverbImage(imageData);
            } catch (imageErr) {
                console.error("Image generation failed:", imageErr);
            } finally {
                setIsImageLoading(false);
                const newCache = { ...cache, [proverb]: { flashcard: data, image: imageData } };
                setCache(newCache);
                localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
            }

        } catch (err) {
            setError(`Failed to generate flashcard for "${proverb}". Please try again.`);
            console.error(err);
            setIsLoading(false);
            setIsImageLoading(false);
        }
    }, [addPoints, cache]);

    const ProverbTabButton: FC<{ tab: FlashcardTab, children: ReactNode }> = ({ tab, children }) => (
        <button onClick={() => setActiveProverbTab(tab)} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeProverbTab === tab ? 'bg-white/20 dark:bg-black/20 backdrop-blur-sm border-indigo-300/30 dark:border-indigo-900/30 border-t border-x' : 'bg-transparent text-slate-700 dark:text-slate-200'}`}>{children}</button>
    );

    if (isLoading && !selectedProverbData) return <div className="mt-8 flex justify-center"><LoadingSpinner /></div>;
    if (error && !selectedProverbData) return <div className="text-center p-4"><p className="text-red-500">{error}</p></div>;

    if (selectedProverbData) {
        return (
            <Card extraClasses={`animate-fade-in ${mainCardGradient}`}>
                <button onClick={() => { setSelectedProverbData(null); setSelectedProverbImage(null); }} className="flex items-center text-sm font-semibold text-slate-800 dark:text-slate-100 hover:underline mb-4">
                    <ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to Library
                </button>
                {isImageLoading ? (
                    <div className="rounded-lg w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center"><LoadingSpinner /></div>
                ) : selectedProverbImage ? (
                    <img src={`data:image/jpeg;base64,${selectedProverbImage}`} alt={selectedProverbData.image_prompt} className="rounded-lg w-full aspect-[4/3] object-cover bg-gray-200 dark:bg-gray-700 mb-4" />
                ) : (
                    <div className="rounded-lg w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center text-gray-500">Image not available</div>
                )}
                <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold font-korean text-slate-800 dark:text-slate-100">{selectedProverbData.proverb_korean}</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-200 italic">"{selectedProverbData.proverb_english_literal}"</p>
                </div>
                
                <div className="border-b border-indigo-300/30 dark:border-indigo-900/30">
                    <div className="flex flex-nowrap overflow-x-auto scrollbar-hide">
                        <ProverbTabButton tab="Explanation">Explanation</ProverbTabButton>
                        <ProverbTabButton tab="Dialogue">Dialogue</ProverbTabButton>
                        <ProverbTabButton tab="Usage">Usage</ProverbTabButton>
                        <ProverbTabButton tab="Vocabulary">Vocabulary</ProverbTabButton>
                    </div>
                </div>

                <div className="pt-4">
                    {activeProverbTab === 'Explanation' && (
                        <div>
                            <div className="flex justify-center mb-3 space-x-2">
                                <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                                <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{explanationLang === 'English' ? selectedProverbData.explanation_english : selectedProverbData.explanation_burmese}</p>
                        </div>
                    )}
                    {activeProverbTab === 'Dialogue' && (
                        <div>
                            <div className="flex justify-center mb-3 space-x-2">
                                <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                                <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                            </div>
                            <div className="space-y-3">
                                {selectedProverbData.dialogue.map((line: DialogueLine, i: number) => (
                                    <div key={i} className={`flex flex-col ${line.speaker === 'Ji-woo' ? 'items-start' : 'items-end'}`}>
                                        <div className={`p-2 rounded-lg max-w-xs ${dialogueBubbleStyle}`}>
                                            <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs mb-1">{line.speaker}</p>
                                            <p className="font-medium text-slate-800 dark:text-slate-100 font-korean">{line.korean}</p>
                                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{explanationLang === 'English' ? line.english : line.burmese}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeProverbTab === 'Usage' && (
                        <div>
                            <div className="flex justify-center mb-3 space-x-2">
                                <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                                <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{explanationLang === 'English' ? selectedProverbData.usage_notes : selectedProverbData.usage_notes_burmese}</p>
                        </div>
                    )}
                    {activeProverbTab === 'Vocabulary' && (
                        <ul className="space-y-2">
                            {selectedProverbData.vocabulary.map((word, i) => (
                                <li key={i} className={`p-2 ${nestedCardStyle}`}>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-bold font-korean text-slate-800 dark:text-slate-100">{word.hangul}</p>
                                        <button onClick={() => playAudio(word.hangul)} aria-label="Play pronunciation" className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors disabled:opacity-50" disabled={!!audioLoadingLine}>
                                            {audioLoadingLine === word.hangul ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : <SpeakerWaveIcon className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">{word.english} / {word.burmese}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Card>
        )
    }

    return (
        <Card extraClasses={`animate-fade-in ${mainCardGradient}`}>
            <h3 className="text-xl font-bold text-center mb-4 text-slate-800 dark:text-slate-100">Proverb Library</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-hide">
                {koreanProverbs.map(({ proverb, description }) => (
                    <button key={proverb} onClick={() => handleSelectProverb(proverb)} className="w-full text-left p-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-l border-b border-indigo-300/30 dark:border-indigo-900/30 rounded-lg hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                        <p className="font-bold font-korean text-slate-800 dark:text-slate-100">{proverb}</p>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{description}</p>
                    </button>
                ))}
            </div>
        </Card>
    );
};