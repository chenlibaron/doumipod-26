import React, { useState, useCallback, useEffect, useMemo, useRef, FC } from 'react';
import { generateMoreModules, generateGrammarExplanation, generateVocabulary, generateDialogue, generateReadingContent, generateHangulLesson, generatePronunciationRule, generateSingleSpeakerAudio } from '../../services/api';
import { LearningPathStep, GrammarExplanation, VocabularyWord, DialogueScript, ReadingContent, HangulLesson, PronunciationRule, LearningModule, User } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Card } from '../common/Card';
import { SpeakerWaveIcon, RocketLaunchIcon, BookOpenIcon, SparklesIcon, ChatBubbleOvalLeftEllipsisIcon, CheckCircleIcon, DocumentTextIcon, AcademicCapIcon, ArrowLeftIcon, ArrowRightIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from '../icons/Icons';
import { mainCardGradient, nestedCardStyle, dialogueBubbleStyle, GrammarDetailSection } from './common';
import { learningPathData } from '../../data/learningPathData';
import { decode, createWavBlobUrl } from '../../utils/audio';

type ExplanationLang = 'English' | 'Burmese';

interface LearningPathViewProps {
    user: User | null;
    addPoints: (amount: number, type: 'learning' | 'social') => void;
}

const LAST_STATE_KEY = 'doumipod-learningPathLastState';

export const LearningPathView: FC<LearningPathViewProps> = ({ user, addPoints }) => {
    const [learningPaths, setLearningPaths] = useState<Partial<Record<'Beginner' | 'Intermediate' | 'Advanced', LearningModule[]>>>({});
    const [progress, setProgress] = useState<Partial<Record<'Beginner' | 'Intermediate' | 'Advanced', number>>>({});
    const [activePathLevel, setActivePathLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | null>(null);
    const [viewedModuleIndex, setViewedModuleIndex] = useState(0);

    const [isGeneratingMore, setIsGeneratingMore] = useState(false);
    const [expandedStep, setExpandedStep] = useState<{ moduleIndex: number; stepIndex: number; content: any } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [explanationLang, setExplanationLang] = useState<ExplanationLang>('English');
    const [audioLoadingLine, setAudioLoadingLine] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    const [audioCache, setAudioCache] = useState<Record<string, string>>({});
    const audioRef = useRef<HTMLAudioElement | null>(null);


     useEffect(() => {
        try {
            const savedPaths = localStorage.getItem('doumipod-learningPaths');
            const savedProgress = localStorage.getItem('doumipod-learningProgress');
            if (savedPaths) {
                setLearningPaths(JSON.parse(savedPaths));
            } else {
                setLearningPaths({});
            }
            if (savedProgress) {
                setProgress(JSON.parse(savedProgress));
            } else {
                setProgress({});
            }
        } catch (e) {
            console.error("Failed to parse learning path data from localStorage", e);
            localStorage.removeItem('doumipod-learningPaths');
            localStorage.removeItem('doumipod-learningProgress');
            setLearningPaths({});
            setProgress({});
        }
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    const playAudio = useCallback(async (text: string) => {
        if (audioLoadingLine === text) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.onended = null;
            }
            setAudioLoadingLine(null);
            return;
        }
    
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.onended = null;
        }
    
        const playFromUrl = (url: string) => {
            audioRef.current = new Audio(url);
            audioRef.current.play().catch(e => {
                console.error("Audio playback error:", e);
                setAudioLoadingLine(null);
            });
            setAudioLoadingLine(text);
            audioRef.current.onended = () => setAudioLoadingLine(null);
            audioRef.current.onerror = () => {
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
            alert('Sorry, failed to generate audio for this sentence.');
            setAudioLoadingLine(null);
        }
    }, [audioLoadingLine, audioCache]);

    const fetchStepContent = async (step: LearningPathStep) => {
        const getEnglishTopicFromTitle = (title: string, fallbackTopic: string): string => {
            let topic = title;
            if (topic.includes(':')) {
                topic = topic.split(':').slice(1).join(':').trim();
            }
            topic = topic.replace(/\s*\([\p{Script=Hangul}\s\d]+\)$/u, '').trim();
            
            if (!topic || /^[\p{Script=Hangul}\s\d.,!?'"()-[\]{}]+$/u.test(topic) && !/[a-zA-Z]/.test(topic)) {
                return fallbackTopic.replace(/\s*\([\p{Script=Hangul}\s\d]+\)$/u, '').trim();
            }
            return topic;
        };
        
        const specificTopic = getEnglishTopicFromTitle(step.title, step.topic);

        if (step.type === 'grammar') {
            const grammarPoint = step.title.split(':').pop()?.trim() || step.topic;
            return await generateGrammarExplanation(grammarPoint);
        } else if (step.type === 'vocabulary') {
            return await generateVocabulary(specificTopic);
        } else if (step.type === 'dialogue') {
            return await generateDialogue(specificTopic);
        } else if (step.type === 'article' || step.type === 'reading_practice') {
            return await generateReadingContent(specificTopic, step.level);
        } else if (step.type.startsWith('hangul')) {
            return await generateHangulLesson(specificTopic);
        } else if (step.type === 'pronunciation_rule') {
            return await generatePronunciationRule(specificTopic);
        }
        return null;
    };

    const handleStepClick = useCallback(async (step: LearningPathStep, moduleIndex: number, stepIndex: number, forceRefresh = false) => {
        const isCurrentlyExpanded = expandedStep?.moduleIndex === moduleIndex && expandedStep?.stepIndex === stepIndex;

        // If clicking the currently expanded item (and not forcing a refresh), just close it.
        if (isCurrentlyExpanded && !forceRefresh) {
            setExpandedStep(null);
            return;
        }

        // If content needs to be generated (or regenerated), fetch it.
        if (!step.content || forceRefresh) {
            setExpandedStep({ moduleIndex, stepIndex, content: null }); // Show loader in the new spot, implicitly closing any other.
            setError(null);

            try {
                const content = await fetchStepContent(step);
                if (!forceRefresh) {
                    addPoints(10, 'learning');
                }

                setExpandedStep({ moduleIndex, stepIndex, content });

                // Save the newly generated content to the main state
                setLearningPaths(currentPaths => {
                    if (!activePathLevel || !currentPaths[activePathLevel]) return currentPaths;
                    const updatedLevelPath = currentPaths[activePathLevel]!.map((module, mIndex) => {
                        if (mIndex !== moduleIndex) return module;
                        const updatedSteps = module.steps.map((s, sIndex) => 
                            sIndex === stepIndex ? { ...s, content } : s
                        );
                        return { ...module, steps: updatedSteps };
                    });
                    const newPaths = { ...currentPaths, [activePathLevel]: updatedLevelPath };
                    localStorage.setItem('doumipod-learningPaths', JSON.stringify(newPaths));
                    return newPaths;
                });

            } catch (e) {
                console.error(`Failed to load content for "${step.title}":`, e);
                setError(`Failed to load content for "${step.title}". Please try again.`);
                setExpandedStep(null); // Close the expansion on error
            }
        } else {
            // Content already exists, so just show it.
            setExpandedStep({ moduleIndex, stepIndex, content: step.content });
        }
    }, [expandedStep, activePathLevel, addPoints]);

    useEffect(() => {
        // This effect runs only once on initial load to restore the session
        if (hasLoaded && Object.keys(learningPaths).length > 0 && !activePathLevel) {
            const savedStateJSON = localStorage.getItem(LAST_STATE_KEY);
            if (savedStateJSON) {
                try {
                    const savedState = JSON.parse(savedStateJSON);
                    if (savedState.activePathLevel && learningPaths[savedState.activePathLevel]) {
                        setActivePathLevel(savedState.activePathLevel);
                        setViewedModuleIndex(savedState.viewedModuleIndex || 0);
                        if (savedState.expandedStep) {
                            const { moduleIndex, stepIndex } = savedState.expandedStep;
                            const step = learningPaths[savedState.activePathLevel]?.[moduleIndex]?.steps[stepIndex];
                            if (step) {
                                // Restore the view, but don't re-trigger a fetch automatically.
                                setExpandedStep({ moduleIndex, stepIndex, content: step.content || null });
                            }
                        }
                    }
                } catch(e) {
                    console.error("Failed to parse saved state from localStorage", e);
                    localStorage.removeItem(LAST_STATE_KEY);
                }
            }
        }
    }, [hasLoaded, learningPaths, activePathLevel]);


    useEffect(() => {
        if (hasLoaded) { // Don't save initial empty/restored state until it's settled
            const stateToSave = {
                activePathLevel,
                viewedModuleIndex,
                expandedStep: expandedStep ? { moduleIndex: expandedStep.moduleIndex, stepIndex: expandedStep.stepIndex } : null
            };
            localStorage.setItem(LAST_STATE_KEY, JSON.stringify(stateToSave));
        }
    }, [activePathLevel, viewedModuleIndex, expandedStep, hasLoaded]);


    const handleSelectLevel = useCallback((level: 'Beginner' | 'Intermediate' | 'Advanced') => {
        setError(null);
        let pathForLevel = learningPaths[level];

        if (!pathForLevel) {
            pathForLevel = learningPathData[level];
            const newPaths = { ...learningPaths, [level]: pathForLevel };
            const newProgress = { ...progress, [level]: 0 };
            
            setLearningPaths(newPaths);
            setProgress(newProgress);
            
            localStorage.setItem('doumipod-learningPaths', JSON.stringify(newPaths));
            localStorage.setItem('doumipod-learningProgress', JSON.stringify(newProgress));
        }
        
        setActivePathLevel(level);
        const currentProgress = progress[level] ?? 0;
        const pathLength = pathForLevel.length;
        setViewedModuleIndex(Math.min(currentProgress, pathLength > 0 ? pathLength - 1 : 0));
        setExpandedStep(null);
        setShowArchived(false); // Reset visibility on level change

    }, [learningPaths, progress]);
    
    const handleGenerateMoreModules = useCallback(async () => {
        if (!activePathLevel || !learningPaths[activePathLevel]) return;

        setIsGeneratingMore(true);
        setError(null);
        try {
            const currentPath = learningPaths[activePathLevel]!;
            const newModules = await generateMoreModules(activePathLevel, currentPath);
            if (newModules && newModules.length > 0) {
                const updatedPath = [...currentPath, ...newModules];
                const newPaths = { ...learningPaths, [activePathLevel]: updatedPath };
                setLearningPaths(newPaths);
                localStorage.setItem('doumipod-learningPaths', JSON.stringify(newPaths));
                
                // Auto-hide previously generated modules when new ones are added
                setShowArchived(false);
                // Move view to the first new module
                setViewedModuleIndex(currentPath.length);
            } else {
                setError("Couldn't generate new modules at this time. You may have covered most topics for this level!");
            }
        } catch (e) {
            console.error("Failed to generate more modules:", e);
            setError('Failed to generate new modules. Please try again.');
        } finally {
            setIsGeneratingMore(false);
        }
    }, [activePathLevel, learningPaths]);

    const handleCompleteModule = useCallback(() => {
        if (activePathLevel && learningPaths[activePathLevel]) {
            const currentProgress = progress[activePathLevel as keyof typeof progress] ?? 0;
            const currentPath = learningPaths[activePathLevel]!;
            if (currentProgress < currentPath.length) {
                const newIndex = currentProgress + 1;
                const newProgress = { ...progress, [activePathLevel]: newIndex };
                setProgress(newProgress);
                localStorage.setItem('doumipod-learningProgress', JSON.stringify(newProgress));
                setExpandedStep(null);
                addPoints(50, 'learning');
            }
        }
    }, [activePathLevel, learningPaths, progress, addPoints]);

    const handleSwitchLevel = () => {
        setActivePathLevel(null);
        setExpandedStep(null);
        localStorage.removeItem(LAST_STATE_KEY);
    };

    const resetAllPaths = () => {
        if (window.confirm("Are you sure you want to reset all your learning paths? This will clear all your progress and generated module content.")) {
            setLearningPaths({});
            setProgress({});
            setActivePathLevel(null);
            setExpandedStep(null);
            localStorage.removeItem('doumipod-learningPaths');
            localStorage.removeItem('doumipod-learningProgress');
            localStorage.removeItem(LAST_STATE_KEY);
        }
    };

    // Helper to determine module visibility
    const isModuleVisible = useCallback((index: number) => {
        if (!activePathLevel) return false;
        const standardLength = learningPathData[activePathLevel]?.length || 0;
        const currentProgress = progress[activePathLevel] ?? 0;
        
        // Always show standard modules
        if (index < standardLength) return true;
        
        // For generated modules (index >= standardLength):
        // If it's incomplete or the current one being worked on, show it.
        if (index >= currentProgress) return true;
        
        // If it's completed (archived), show only if toggle is on
        return showArchived;
    }, [activePathLevel, progress, showArchived]);

    const navigateModule = (direction: 'next' | 'prev') => {
        if (!activePathLevel || !learningPaths[activePathLevel]) return;
        
        setExpandedStep(null);
        const path = learningPaths[activePathLevel]!;
        
        const newIndex = direction === 'next' 
            ? Math.min(viewedModuleIndex + 1, path.length - 1) 
            : Math.max(viewedModuleIndex - 1, 0);
    
        if (newIndex !== viewedModuleIndex) {
            setViewedModuleIndex(newIndex);
        }
    };
    
    const LangToggle = () => (
        <div className="flex justify-start mb-3 space-x-2">
            <button onClick={() => setExplanationLang('English')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'English' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50'}`}>English</button>
            <button onClick={() => setExplanationLang('Burmese')} className={`px-3 py-1 text-xs rounded-full ${explanationLang === 'Burmese' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/50'}`}>Burmese</button>
        </div>
    );

    const StepContent: FC<{ type: LearningPathStep['type']; content: any; onRegenerate: () => void; isGeneratedModule: boolean }> = ({ type, content, onRegenerate, isGeneratedModule }) => {
        if (!content) return null;

        const RegenerateButton = () => isGeneratedModule ? (
            <button onClick={(e) => { e.stopPropagation(); onRegenerate(); }} className="mb-4 flex items-center space-x-1 text-xs text-indigo-500 hover:text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                <ArrowPathIcon className="w-3 h-3" />
                <span>Regenerate Content</span>
            </button>
        ) : null;

        switch (type) {
            case 'hangul_consonant':
            case 'hangul_vowel':
            case 'hangul_batchim':
                const hangulContent = content as HangulLesson;
                return (
                     <>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 font-korean">{hangulContent.title}</h3>
                            <RegenerateButton />
                        </div>
                        <LangToggle />
                        <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">{explanationLang === 'English' ? hangulContent.explanation : hangulContent.explanation_burmese}</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-transparent text-xs text-slate-800 dark:text-slate-200 uppercase">
                                    <tr>
                                        <th className="px-4 py-2">Character</th>
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Sound</th>
                                        <th className="px-4 py-2">Example</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hangulContent.characters.map((char, i) => (
                                        <tr key={i} className="border-b border-indigo-200/50 dark:border-indigo-800/50">
                                            <td className="px-4 py-2 font-bold text-lg font-korean text-slate-800 dark:text-slate-100">{char.hangul}</td>
                                            <td className="px-4 py-2 text-slate-700 dark:text-slate-200">{char.name}</td>
                                            <td className="px-4 py-2 font-mono text-slate-700 dark:text-slate-200">{char.sound}</td>
                                            <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                                                <span className="font-korean">{char.example_word_korean}</span> ({char.example_word_english})
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                );
            case 'pronunciation_rule':
                const ruleContent = content as PronunciationRule;
                return (
                    <>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 font-korean">{ruleContent.title}</h3>
                            <RegenerateButton />
                        </div>
                        <LangToggle />
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-semibold italic">"{explanationLang === 'English' ? ruleContent.rule_description : ruleContent.rule_description_burmese}"</p>
                        <p className="text-sm text-slate-700 dark:text-slate-200 mt-2 mb-4">{explanationLang === 'English' ? ruleContent.explanation : ruleContent.explanation_burmese}</p>
                        <ul className="space-y-2">
                            {ruleContent.examples.map((ex, i) => (
                                <li key={i} className={`p-2 rounded-md ${nestedCardStyle}`}>
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-slate-800 dark:text-slate-200 font-korean">{ex.korean} &rarr; <span className="font-bold text-indigo-600 dark:text-indigo-300">[{ex.pronunciation}]</span></p>
                                        <button onClick={() => playAudio(ex.korean)} aria-label="Play pronunciation" className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors disabled:opacity-50" disabled={!!audioLoadingLine}><SpeakerWaveIcon className="w-4 h-4" /></button>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{ex.english}</p>
                                </li>
                            ))}
                        </ul>
                    </>
                );
            case 'grammar':
                const grammarContent = content as GrammarExplanation;
                return (
                    <>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 font-korean">{grammarContent.title}</h3>
                            <RegenerateButton />
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200 font-korean">{grammarContent.explanation_korean}</p>
                        <LangToggle />
                        <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">{explanationLang === 'English' ? grammarContent.explanation_english : grammarContent.explanation_burmese}</p>
                        
                        <GrammarDetailSection title="Construction" content={explanationLang === 'English' ? grammarContent.construction_rules_english : grammarContent.construction_rules_burmese} />
                        <GrammarDetailSection title="Usage Notes" content={explanationLang === 'English' ? grammarContent.usage_notes_english : grammarContent.usage_notes_burmese} />
                        <GrammarDetailSection title="Common Mistakes" content={explanationLang === 'English' ? grammarContent.common_mistakes_english : grammarContent.common_mistakes_burmese} />
                        <GrammarDetailSection title="Politeness Level" content={explanationLang === 'English' ? grammarContent.politeness_level_english : grammarContent.politeness_level_burmese} />

                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">Example Sentences</h4>
                        <ul className="space-y-3">
                            {grammarContent.example_sentences.map((ex: any, i: number) => (
                                <li key={i} className={`p-2 ${nestedCardStyle} leading-relaxed`}>
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
                    </>
                );
            case 'vocabulary':
                return (
                    <>
                    <div className="flex justify-between items-start">
                        <LangToggle />
                        <RegenerateButton />
                    </div>
                    <div className="space-y-2">
                        {content.map((word: VocabularyWord, i: number) => (
                            <div key={i} className={`p-2 rounded-md ${nestedCardStyle}`}>
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
                            </div>
                        ))}
                    </div>
                    </>
                );
            case 'dialogue':
                 return (
                    <>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 text-center font-korean flex-1">{content.title}</h3>
                            <RegenerateButton />
                        </div>
                        <LangToggle />
                        <div className="space-y-3">
                            {content.dialogue.map((line: any, i: number) => (
                                <div key={i} className={`flex flex-col ${line.speaker === 'Ji-woo' ? 'items-start' : 'items-end'}`}>
                                    <div className={`p-2 rounded-lg max-w-xs ${dialogueBubbleStyle}`}>
                                        <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs mb-1">{line.speaker}</p>
                                        <p className="font-medium text-slate-800 dark:text-slate-100 font-korean">{line.korean}</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{explanationLang === 'English' ? line.english : line.burmese}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                 );
            case 'article':
            case 'reading_practice':
                const articleContent = content as ReadingContent;
                return (
                    <>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 font-korean">{articleContent.title}</h3>
                            <RegenerateButton />
                        </div>
                        <div className={`space-y-3 ${nestedCardStyle} p-3`}>
                            <p className="font-medium text-slate-800 dark:text-slate-100 font-korean leading-relaxed">{articleContent.korean_article}</p>
                            <LangToggle />
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic leading-relaxed">{explanationLang === 'English' ? articleContent.english_translation : articleContent.burmese_translation}</p>
                        </div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">Key Vocabulary</h4>
                        <ul className="space-y-2">
                            {articleContent.key_vocabulary.map((word: any, i: number) => (
                                <li key={i} className={`flex justify-between items-center ${nestedCardStyle} p-2`}>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-bold font-korean text-slate-800 dark:text-slate-100">{word.hangul}</p>
                                        <button onClick={() => playAudio(word.hangul)} aria-label="Play pronunciation" className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors disabled:opacity-50" disabled={!!audioLoadingLine}><SpeakerWaveIcon className="w-4 h-4" /></button>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 text-right">{word.english} / {word.burmese}</p>
                                </li>
                            ))}
                        </ul>
                    </>
                );
        }
        return null;
    };
    
    if (error && !activePathLevel) return <div className="text-center p-4"><p className="text-red-500">{error}</p></div>;

    if (!activePathLevel) {
        return (
            <div className="space-y-4">
                <Card extraClasses="text-center">
                    <h2 className="text-xl font-bold">Choose Your Path</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select a level to start your structured learning journey.</p>
                </Card>
                <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => handleSelectLevel('Beginner')} className="p-6 bg-green-100 dark:bg-green-900/50 rounded-lg text-left hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-green-800 dark:text-green-200">Beginner</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">Start with Hangul and basic grammar.</p>
                    </button>
                    <button onClick={() => handleSelectLevel('Intermediate')} className="p-6 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-left hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-blue-800 dark:text-blue-200">Intermediate</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Expand your vocabulary and conversational skills.</p>
                    </button>
                    <button onClick={() => handleSelectLevel('Advanced')} className="p-6 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-left hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-purple-800 dark:text-purple-200">Advanced</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">Master complex grammar and nuanced expressions.</p>
                    </button>
                </div>
                <div className="mt-6 text-center">
                    <button onClick={resetAllPaths} className="text-xs text-red-500 hover:underline">Reset All Learning Paths</button>
                </div>
            </div>
        );
    }

    const path = learningPaths[activePathLevel]!;
    const currentProgress = progress[activePathLevel] ?? 0;
    const viewedModule = path[viewedModuleIndex];
    const isModuleCompleted = viewedModuleIndex < currentProgress;
    const isLastModuleInPath = viewedModuleIndex === path.length - 1;
    const isViewingCurrentModule = viewedModuleIndex === currentProgress;
    const hasCompletedAll = currentProgress >= path.length;
    const standardLength = learningPathData[activePathLevel]?.length || 0;
    const hasArchivedModules = path.length > standardLength && (path.length - standardLength) > (path.length - currentProgress);
    const isGeneratedModule = viewedModuleIndex >= standardLength;

    const renderActionButton = () => {
        if (isGeneratingMore) {
            return (
                <button disabled className="w-full mt-4 py-2 bg-indigo-400 text-white font-semibold rounded-lg flex items-center justify-center">
                    <LoadingSpinner />
                    <span className="ml-2">Generating...</span>
                </button>
            );
        }

        if (hasCompletedAll) {
            return (
                <button onClick={handleGenerateMoreModules} className="w-full mt-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600">
                    Generate More Modules
                </button>
            );
        }
        
        if (isViewingCurrentModule && !isModuleCompleted) {
            return (
                <button onClick={handleCompleteModule} className="w-full mt-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                    Mark Module as Complete
                </button>
            );
        }

        if (isModuleCompleted) {
             return (
                 <button disabled className="w-full mt-4 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Module Complete
                </button>
            );
        }

        return null;
    };

    return (
         <div className="space-y-4">
            <div className="flex justify-between items-center">
                <button onClick={handleSwitchLevel} className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to Levels
                </button>
                {hasArchivedModules && (
                    <button onClick={() => setShowArchived(s => !s)} className="flex items-center text-xs font-semibold text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full">
                        {showArchived ? <EyeSlashIcon className="w-3 h-3 mr-1" /> : <EyeIcon className="w-3 h-3 mr-1" />}
                        {showArchived ? 'Hide History' : 'Show History'}
                    </button>
                )}
            </div>
            
            <Card extraClasses={`animate-fade-in ${mainCardGradient}`}>
                 <div className="flex justify-between items-center mb-4">
                     <button onClick={() => navigateModule('prev')} disabled={viewedModuleIndex === 0} className="p-2 rounded-full bg-white/20 dark:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed"><ArrowLeftIcon className="w-5 h-5"/></button>
                     <div className="text-center">
                        <p className="text-xs font-bold uppercase text-indigo-700 dark:text-indigo-300">{activePathLevel} PATH</p>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{viewedModule.module_title}</h2>
                        {isGeneratedModule && <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-full ml-1 align-middle">Custom</span>}
                        <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{viewedModuleIndex + 1} / {path.length}</p>
                     </div>
                     <button onClick={() => navigateModule('next')} disabled={viewedModuleIndex >= currentProgress || viewedModuleIndex === path.length - 1} className="p-2 rounded-full bg-white/20 dark:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed"><ArrowRightIcon className="w-5 h-5"/></button>
                 </div>
                 <p className="text-center text-sm text-slate-700 dark:text-slate-200 mb-4">{viewedModule.module_description}</p>
                
                 <div className="space-y-2">
                    {viewedModule.steps.map((step, stepIndex) => (
                        <div key={stepIndex}>
                            <button 
                                onClick={() => handleStepClick(step, viewedModuleIndex, stepIndex)}
                                className="w-full text-left p-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-l border-b border-indigo-300/30 dark:border-indigo-900/30 rounded-lg hover:bg-white/30 dark:hover:bg-black/30 transition-colors flex items-center space-x-3"
                            >
                                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white/30 dark:bg-black/30 flex items-center justify-center">
                                    {step.type === 'grammar' ? <BookOpenIcon className="w-5 h-5 text-indigo-800 dark:text-indigo-200"/> :
                                     step.type === 'vocabulary' ? <SparklesIcon className="w-5 h-5 text-indigo-800 dark:text-indigo-200"/> :
                                     step.type === 'dialogue' ? <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-indigo-800 dark:text-indigo-200"/> :
                                     step.type.includes('hangul') ? <AcademicCapIcon className="w-5 h-5 text-indigo-800 dark:text-indigo-200"/> :
                                     <DocumentTextIcon className="w-5 h-5 text-indigo-800 dark:text-indigo-200"/>}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{step.title}</p>
                                    <p className="text-xs text-slate-700 dark:text-slate-200 capitalize">{step.type.replace(/_/g, ' ')}</p>
                                </div>
                                {step.content && <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400"/>}
                            </button>
                            
                            {expandedStep && expandedStep.moduleIndex === viewedModuleIndex && expandedStep.stepIndex === stepIndex && (
                                <div className="p-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-b-lg border-x border-b border-indigo-300/30 dark:border-indigo-900/30">
                                    {expandedStep.content === null ? <div className="flex justify-center"><LoadingSpinner/></div> : (
                                        <StepContent 
                                            type={step.type} 
                                            content={expandedStep.content} 
                                            isGeneratedModule={isGeneratedModule}
                                            onRegenerate={() => handleStepClick(step, viewedModuleIndex, stepIndex, true)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                 </div>
                {renderActionButton()}
            </Card>
        </div>
    );
};