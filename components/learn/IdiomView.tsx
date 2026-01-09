import React, { useState, useCallback, useEffect, FC, ReactNode } from 'react';
import { generateIdiomFlashcard, generateProverbImage } from '../../services/api';
import { IdiomFlashcard, DialogueLine, AudioPlaybackStyle } from '../../types';
import { koreanIdioms } from '../../data/idioms';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ArrowLeftIcon, SpeakerWaveIcon } from '../icons/Icons';
import { mainCardGradient, nestedCardStyle, dialogueBubbleStyle } from './common';

type FlashcardTab = 'Explanation' | 'Dialogue' | 'Usage' | 'Vocabulary';
type ExplanationLang = 'English' | 'Burmese';

interface IdiomViewProps {
    addPoints: (amount: number, type: 'learning' | 'social') => void;
}

const CACHE_KEY = 'doumipod-idiomCache';

export const IdiomView: FC<IdiomViewProps> = ({ addPoints }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIdiomData, setSelectedIdiomData] = useState<IdiomFlashcard | null>(null);
    const [selectedIdiomImage, setSelectedIdiomImage] = useState<string | null>(null);
    const [activeIdiomTab, setActiveIdiomTab] = useState<FlashcardTab>('Explanation');
    const [explanationLang, setExplanationLang] = useState<ExplanationLang>('English');
    const [audioLoadingLine, setAudioLoadingLine] = useState<string | null>(null);
    
    const [cache, setCache] = useState<Record<string, { flashcard: IdiomFlashcard, image: string | null }>>({});

    useEffect(() => {
        try {
            const savedCache = localStorage.getItem(CACHE_KEY);
            if (savedCache) {
                setCache(JSON.parse(savedCache));
            }
        } catch (e) {
            console.error("Failed to load idiom cache", e);
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

    const handleSelectIdiom = useCallback(async (idiom: string) => {
        if (cache[idiom]) {
            setSelectedIdiomData(cache[idiom].flashcard);
            setSelectedIdiomImage(cache[idiom].image);
            return;
        }

        setIsLoading(true);
        setIsImageLoading(true);
        setError(null);
        setSelectedIdiomData(null);
        setSelectedIdiomImage(null);
        
        try {
            const data = await generateIdiomFlashcard(idiom);
            setSelectedIdiomData(data);
            addPoints(15, 'learning');
            setIsLoading(false);

            let imageData: string | null = null;
            try {
                imageData = await generateProverbImage(data.image_prompt);
                setSelectedIdiomImage(imageData);
            } catch (imageErr) {
                console.error("Image generation failed:", imageErr);
            } finally {
                setIsImageLoading(false);
                const newCache = { ...cache, [idiom]: { flashcard: data, image: imageData } };
                setCache(newCache);
                localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
            }
        } catch (err) {
            setError(`Failed to generate flashcard for "${idiom}". Please try again.`);
            console.error(err);
            setIsLoading(false);
            setIsImageLoading(false);
        }
    }, [addPoints, cache]);

    const IdiomTabButton: FC<{ tab: FlashcardTab, children: ReactNode }> = ({ tab, children }) => (
        <button onClick={() => setActiveIdiomTab(tab)} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeIdiomTab === tab ? 'bg-white/20 dark:bg-black/20 backdrop-blur-sm border-indigo-300/30 dark:border-indigo-900/30 border-t border-x' : 'bg-transparent text-slate-700 dark:text-slate-200'}`}>{children}</button>
    );

    if (isLoading && !selectedIdiomData) return <div className="mt-8 flex justify-center"><LoadingSpinner /></div>;
    if (error && !selectedIdiomData) return <div className="text-center p-4"><p className="text-red-500">{error}</p></div>;

    if (selectedIdiomData) {
        return (
            <Card extraClasses={`animate-fade-in ${mainCardGradient}`}>
                <button onClick={() => { setSelectedIdiomData(null); setSelectedIdiomImage(null); }} className="flex items-center text-sm font-semibold text-slate-800 dark:text-slate-100 hover:underline mb-4">
                    <ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to Library
                </button>
                {isImageLoading ? (
                    <div className="rounded-lg w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center"><LoadingSpinner /></div>
                ) : selectedIdiomImage ? (
                    <img src={`data:image/jpeg;base64,${selectedIdiomImage}`} alt={selectedIdiomData.image_prompt} className="rounded-lg w-full aspect-[4/3] object-cover bg-gray-200 dark:bg-gray-700 mb-4" />
                ) : (
                    <div className="rounded-lg w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center text-gray-500">Image not available</div>
                )}
                <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold font-korean text-slate-800 dark:text-slate-100">{selectedIdiomData.idiom_korean}</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-200 italic">"{selectedIdiomData.idiom_english_literal}"</p>
                </div>
                
                <div className="border-b border-indigo-300/30 dark:border-indigo-900/30">
                    <div className="flex flex-nowrap overflow-x-auto scrollbar-hide">
                        <IdiomTabButton tab="Explanation">Explanation</IdiomTabButton>
                        <IdiomTabButton tab="Dialogue">Dialogue</IdiomTabButton>
                        <IdiomTabButton tab="Usage">Usage</IdiomTabButton>
                        <IdiomTabButton tab="Vocabulary">Vocabulary</IdiomTabButton>
                    </div>
                </div>

                <div className="pt-4">
                    {activeIdiomTab === 'Explanation' && (
                        <div>
                            <div className="flex justify-center mb-3 space-x-2">
                                <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                                <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{explanationLang === 'English' ? selectedIdiomData.explanation_english : selectedIdiomData.explanation_burmese}</p>
                        </div>
                    )}
                    {activeIdiomTab === 'Dialogue' && (
                        <div>
                            <div className="flex justify-center mb-3 space-x-2">
                                <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                                <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                            </div>
                            <div className="space-y-3">
                                {selectedIdiomData.dialogue.map((line: DialogueLine, i: number) => (
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
                    {activeIdiomTab === 'Usage' && (
                         <div>
                            <div className="flex justify-center mb-3 space-x-2">
                                <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                                <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{explanationLang === 'English' ? selectedIdiomData.usage_notes : selectedIdiomData.usage_notes_burmese}</p>
                        </div>
                    )}
                    {activeIdiomTab === 'Vocabulary' && (
                        <ul className="space-y-2">
                            {selectedIdiomData.vocabulary.map((word, i) => (
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
            <h3 className="text-xl font-bold text-center mb-4 text-slate-800 dark:text-slate-100">Idiom Library</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-hide">
                {koreanIdioms.map(({ idiom, description }) => (
                    <button key={idiom} onClick={() => handleSelectIdiom(idiom)} className="w-full text-left p-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-l border-b border-indigo-300/30 dark:border-indigo-900/30 rounded-lg hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                        <p className="font-bold font-korean text-slate-800 dark:text-slate-100">{idiom}</p>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{description}</p>
                    </button>
                ))}
            </div>
        </Card>
    );
};