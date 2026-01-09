import React, { useState, useRef, FC } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { RocketLaunchIcon, BookOpenIcon, SparklesIcon, ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon } from '../components/icons/Icons';
import { LearningPathView } from '../components/learn/LearningPathView';
import { ProverbView } from '../components/learn/ProverbView';
import { IdiomView } from '../components/learn/IdiomView';
import { GrammarView } from '../components/learn/GrammarView';
import { VocabularyView } from '../components/learn/VocabularyView';
import { DialogueView } from '../components/learn/DialogueView';
import { DictionaryView } from '../components/learn/DictionaryView';
import { ExpressionsPlusView } from '../components/learn/ExpressionsPlusView';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { BadgeGallery } from '../components/learn/BadgeGallery';
import { LearningProgressCircle } from '../components/learn/LearningProgressCircle';
import { OpenPodLogo, AskDoumiLogo } from '../components/common/Logos';

type LearnSection = 'Learning Path' | 'Proverb' | 'Idiom' | 'Grammar' | 'Vocabulary' | 'Dialogue' | 'Dictionary' | 'Expressions Plus';

const mainCardGradient = 'bg-gradient-to-r from-purple-200 to-indigo-200 dark:from-purple-900/70 dark:to-indigo-900/70';

interface LearnPageProps {}

const EditorSpaceCTA: FC = () => (
    <Link
        to="/editor"
        className="flex-1 flex items-center justify-center p-3 bg-violet-100 dark:bg-violet-400 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
    >
        <OpenPodLogo size="base" />
    </Link>
);

const AITutorCTA: FC = () => (
    <Link
        to="/ai-tutor"
        className="flex-1 flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-400 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
    >
        <AskDoumiLogo size="base" />
    </Link>
);


export const LearnPage: FC<LearnPageProps> = () => {
    const { user } = useAuth();
    const { points, unlockedBadgesCount, addPoints } = useAppContext();
    const [activeSection, setActiveSection] = useState<LearnSection>('Learning Path');
    const tabBarRef = useRef<HTMLDivElement>(null);

    const handleTabClick = (section: LearnSection) => {
        setActiveSection(section);
        // The scrollIntoView logic might not be necessary if the bar is always visible or sticky
    };

    const navItems: { name: LearnSection, icon: React.ReactNode }[] = [
        { name: 'Learning Path', icon: <RocketLaunchIcon className="w-5 h-5" /> },
        { name: 'Proverb', icon: <BookOpenIcon className="w-5 h-5" /> },
        { name: 'Idiom', icon: <BookOpenIcon className="w-5 h-5" /> },
        { name: 'Grammar', icon: <BookOpenIcon className="w-5 h-5" /> },
        { name: 'Vocabulary', icon: <SparklesIcon className="w-5 h-5" /> },
        { name: 'Dialogue', icon: <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" /> },
        { name: 'Dictionary', icon: <MagnifyingGlassIcon className="w-5 h-5" /> },
        { name: 'Expressions Plus', icon: <SparklesIcon className="w-5 h-5" /> }
    ];

    return (
        <div>
            <div className="space-y-4">
                <div className="px-4 pt-4 space-y-4">
                    <div className="flex space-x-4">
                        <EditorSpaceCTA />
                        <AITutorCTA />
                    </div>
                    <Card extraClasses={mainCardGradient}>
                        <div className="flex items-center space-x-4">
                            <LearningProgressCircle points={points} />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 dark:text-slate-100">Keep up the great work!</p>
                                <p className="text-sm text-slate-700 dark:text-slate-200">Next badge unlocks at 10,000 pts</p>
                            </div>
                        </div>
                    </Card>
                </div>
                <BadgeGallery unlockedBadgesCount={unlockedBadgesCount} />
            </div>
            
            <div ref={tabBarRef} className="sticky top-0 bg-white/80 backdrop-blur-md dark:bg-slate-900/80 z-10">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide px-4 py-2">
                    {navItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => handleTabClick(item.name)}
                            className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                activeSection === item.name
                                ? 'bg-indigo-500 text-white'
                                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-4 px-4 pb-4">
                <div style={{ display: activeSection === 'Learning Path' ? 'block' : 'none' }}><LearningPathView user={user} addPoints={addPoints} /></div>
                <div style={{ display: activeSection === 'Proverb' ? 'block' : 'none' }}><ProverbView addPoints={addPoints} /></div>
                <div style={{ display: activeSection === 'Idiom' ? 'block' : 'none' }}><IdiomView addPoints={addPoints} /></div>
                <div style={{ display: activeSection === 'Grammar' ? 'block' : 'none' }}><GrammarView addPoints={addPoints} /></div>
                <div style={{ display: activeSection === 'Vocabulary' ? 'block' : 'none' }}><VocabularyView addPoints={addPoints} /></div>
                <div style={{ display: activeSection === 'Dialogue' ? 'block' : 'none' }}><DialogueView addPoints={addPoints} /></div>
                <div style={{ display: activeSection === 'Dictionary' ? 'block' : 'none' }}><DictionaryView addPoints={addPoints} /></div>
                <div style={{ display: activeSection === 'Expressions Plus' ? 'block' : 'none' }}><ExpressionsPlusView addPoints={addPoints} /></div>
            </div>
        </div>
    );
};