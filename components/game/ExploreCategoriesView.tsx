import React, { FC } from 'react';
import { ExploreCategory } from '../../types';
import { exploreCategoriesData } from '../../data/subwayData';
import { Card } from '../common/Card';
import { ArrowLeftIcon } from '../icons/Icons';

interface ExploreCategoriesViewProps {
    onSelect: (category: ExploreCategory) => void;
    onBack: () => void;
}

export const ExploreCategoriesView: FC<ExploreCategoriesViewProps> = ({ onSelect, onBack }) => (
    <div className="absolute inset-0 bg-slate-900 animate-fade-in p-4 overflow-y-auto">
        <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-300 mb-4 sticky top-0"><ArrowLeftIcon className="w-4 h-4 mr-1"/> Back</button>
        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Explore this place</h1>
            <p className="text-gray-400">Choose what you want to dive into</p>
        </div>
        <div className="space-y-3">
            {exploreCategoriesData.map(category => (
                <Card key={category.id} onClick={() => onSelect(category)} extraClasses="bg-slate-800 hover:bg-slate-700">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                            <p className="font-bold text-white">{category.title}</p>
                            <p className="text-sm text-gray-400">{category.short_label}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);