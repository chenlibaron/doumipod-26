import React, { FC } from 'react';
import { Spot } from '../../types';
import { ArrowLeftIcon, BookOpenIcon, SparklesIcon } from '../icons/Icons';

interface ActionSelectionViewProps {
    spot: Spot;
    onSelect: (action: 'explore' | 'quiz') => void;
    onBack: () => void;
}

export const ActionSelectionView: FC<ActionSelectionViewProps> = ({ spot, onSelect, onBack }) => (
    <div className="absolute inset-0 bg-slate-900 animate-fade-in p-4 flex flex-col justify-center items-center">
        <button onClick={onBack} className="absolute top-4 left-4 flex items-center text-sm font-semibold text-gray-300"><ArrowLeftIcon className="w-4 h-4 mr-1"/> Back</button>
        <div className="text-center">
            <span className="text-6xl">{spot.emoji}</span>
            <h1 className="text-3xl font-bold text-white mt-2">{spot.spot_name}</h1>
            <p className="text-gray-400">“{spot.short_reason}”</p>
        </div>
        <div className="flex space-x-4 mt-8">
            <button onClick={() => onSelect('explore')} className="flex items-center space-x-2 px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-600"><BookOpenIcon/><span>Explore</span></button>
            <button onClick={() => onSelect('quiz')} className="flex items-center space-x-2 px-6 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:bg-teal-600"><SparklesIcon/><span>Quizzes</span></button>
        </div>
    </div>
);