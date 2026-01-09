import React, { useState, useCallback, useEffect, FC } from 'react';
import { generateExpressionExplanation, generateExpressionImage } from '../../services/api';
import { ExpressionExplanation, AudioPlaybackStyle, ExpressionCategory } from '../../types';
import { expressionCategories } from '../../data/expressions';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ArrowLeftIcon, SpeakerWaveIcon, ChevronRightIcon } from '../icons/Icons';
import { mainCardGradient, nestedCardStyle } from './common';

type ExplanationLang = 'English' | 'Burmese';

interface ExpressionsPlusViewProps {
    addPoints: (amount: number, type: 'learning' | 'social') => void;
}

interface ExpressionCacheItem {
    explanation: ExpressionExplanation;
    image: string | null;
}

const CACHE_KEY = 'doumipod-expressionsCache';

export const ExpressionsPlusView: FC<ExpressionsPlusViewProps> = ({ addPoints }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<ExpressionCategory | null>(null);
    const [selectedExpression, setSelectedExpression] = useState<{ korean: string; description: string } | null>(null);
    const [expressionExplanation, setExpressionExplanation] = useState<ExpressionExplanation | null>(null);
    const [expressionImage, setExpressionImage] = useState<string | null>(null);
    
    const [explanationLang, setExplanationLang] = useState<ExplanationLang>('English');
    const [audioLoadingLine, setAudioLoadingLine] = useState<string | null>(null);

    const [cache, setCache] = useState<Record<string, ExpressionCacheItem>>({});

    useEffect(() => {
        try {
            const savedCache = localStorage.getItem(CACHE_KEY);
            if (savedCache) {
                setCache(JSON.parse(savedCache));
            }
        } catch (e) {
            console.error("Failed to load expressions cache", e);
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


    const handleSelectExpression = useCallback(async (expression: string, description: string) => {
        if (cache[expression]) {
            setSelectedExpression({ korean: expression, description });
            setExpressionExplanation(cache[expression].explanation);
            setExpressionImage(cache[expression].image);
            return;
        }

        setIsLoading(true);
        setIsImageLoading(true);
        setError(null);
        setSelectedExpression({ korean: expression, description });
        setExpressionExplanation(null);
        setExpressionImage(null);
        try {
            const explanationData = await generateExpressionExplanation(expression, description);
            setExpressionExplanation(explanationData);
            addPoints(15, 'learning');
            setIsLoading(false);

            let imageData: string | null = null;
            try {
                imageData = await generateExpressionImage(explanationData.image_prompt);
                setExpressionImage(imageData);
            } catch (imageErr) {
                console.error("Image generation failed:", imageErr);
            } finally {
                setIsImageLoading(false);
                const newCacheItem: ExpressionCacheItem = { explanation: explanationData, image: imageData };
                const newCache = { ...cache, [expression]: newCacheItem };
                setCache(newCache);
                localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
            }
        } catch (err) {
            setError(`Failed to generate flashcard for "${expression}". Please try again.`);
            console.error(err);
            setIsLoading(false);
            setIsImageLoading(false);
        }
    }, [addPoints, cache]);

    if (isLoading && !expressionExplanation) return <div className="mt-8 flex justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="text-center p-4"><p className="text-red-500">{error}</p></div>;

    if (selectedExpression && expressionExplanation) {
         return (
            <Card extraClasses={`animate-fade-in ${mainCardGradient}`}>
                 <button onClick={() => setSelectedExpression(null)} className="flex items-center text-sm font-semibold text-slate-800 dark:text-slate-100 hover:underline mb-4">
                    <ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to List
                </button>
                 {isImageLoading ? (
                    <div className="rounded-lg w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center"><LoadingSpinner /></div>
                 ) : expressionImage ? (
                    <img src={`data:image/jpeg;base64,${expressionImage}`} alt={expressionExplanation.image_prompt} className="rounded-lg w-full aspect-[4/3] object-cover bg-gray-200 dark:bg-gray-700 mb-4" />
                 ) : (
                    <div className="rounded-lg w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center text-gray-500">Image not available</div>
                 )}
                 <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold font-korean text-slate-800 dark:text-slate-100">{expressionExplanation.expression_korean}</h3>
                </div>
                
                 <div>
                    <div className="flex justify-center mb-3 space-x-2">
                        <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>English</button>
                        <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50 text-slate-800 dark:text-slate-100'}`}>Burmese</button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed mb-4">{explanationLang === 'English' ? expressionExplanation.explanation_english : expressionExplanation.explanation_burmese}</p>

                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Example Sentences</h4>
                    <ul className="space-y-3">
                        {expressionExplanation.example_sentences.map((ex, i) => (
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
                </div>
            </Card>
        );
    }

    if (selectedCategory) {
        return (
            <Card extraClasses={`animate-fade-in ${mainCardGradient}`}>
                 <button onClick={() => setSelectedCategory(null)} className="flex items-center text-sm font-semibold text-slate-800 dark:text-slate-100 hover:underline mb-4">
                    <ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to Categories
                </button>
                <h3 className="text-xl font-bold text-center mb-4 text-slate-800 dark:text-slate-100">{selectedCategory.name}</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-hide">
                    {selectedCategory.expressions.map(({ korean, description }) => (
                        <button key={korean} onClick={() => handleSelectExpression(korean, description)} className="w-full text-left p-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-l border-b border-indigo-300/30 dark:border-indigo-900/30 rounded-lg hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                            <p className="font-bold font-korean text-slate-800 dark:text-slate-100">{korean}</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300">{description}</p>
                        </button>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card extraClasses={`animate-fade-in ${mainCardGradient}`}>
            <h3 className="text-xl font-bold text-center mb-4 text-slate-800 dark:text-slate-100">Expressions Plus Library</h3>
            <div className="space-y-2">
                 {expressionCategories.map((category) => (
                    <button key={category.name} onClick={() => setSelectedCategory(category)} className="w-full text-left p-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-lg hover:bg-white/30 dark:hover:bg-black/30 transition-colors flex justify-between items-center">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{category.name}</span>
                        <ChevronRightIcon className="w-5 h-5 text-slate-600 dark:text-slate-300"/>
                    </button>
                ))}
            </div>
        </Card>
    );
};