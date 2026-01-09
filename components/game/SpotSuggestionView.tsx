import React, { FC } from 'react';
import { Spot } from '../../types';
import { Card } from '../common/Card';
import { ArrowLeftIcon } from '../icons/Icons';

interface SpotSuggestionViewProps {
    spots: Spot[];
    onSelect: (spot: Spot) => void;
    stationName: string;
    onBack: () => void;
}

export const SpotSuggestionView: FC<SpotSuggestionViewProps> = ({ spots, onSelect, stationName, onBack }) => {
    return (
        <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto">
            <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-300 mb-4 sticky top-0"><ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to Map</button>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-1">도착 (Arrived): {stationName}</h1>
                <h2 className="text-xl font-bold text-white/80 mb-6">"Where do you want to go today?"</h2>
            </div>
            <div className="space-y-3">
                {spots.map((spot, index) => (
                    <Card
                        key={spot.spot_name}
                        onClick={() => onSelect(spot)}
                        extraClasses="bg-slate-800 hover:bg-slate-700 transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                       <div className="flex items-center space-x-4">
                            <div className="p-3 bg-slate-700 rounded-lg">
                                <span className="text-4xl">{spot.emoji}</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-white">{spot.spot_name}</p>
                                <p className="text-sm text-gray-300">{spot.short_reason}</p>
                                <div className="mt-1 px-2 py-0.5 bg-indigo-500/50 text-indigo-200 text-xs rounded-full inline-block">
                                    #{spot.vibe_tag}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};