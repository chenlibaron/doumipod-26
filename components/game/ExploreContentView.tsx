import React, { FC } from 'react';
import { ExploreContent } from '../../types';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ArrowLeftIcon, SpeakerWaveIcon } from '../icons/Icons';

interface ExploreContentViewProps {
    content: ExploreContent;
    image: string | null;
    isImageLoading: boolean;
    onBack: () => void;
    playAudio: (text: string) => void;
    audioLoadingLine: string | null;
}

export const ExploreContentView: FC<ExploreContentViewProps> = ({ content, image, isImageLoading, onBack, playAudio, audioLoadingLine }) => (
    <div className="absolute inset-0 bg-slate-900 animate-fade-in p-4 overflow-y-auto">
        <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-300 mb-4 sticky top-0"><ArrowLeftIcon className="w-4 h-4 mr-1"/> Back</button>
        
        {isImageLoading ? (
            <div className="w-full aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-6"><LoadingSpinner /></div>
        ) : image && (
            <img src={`data:image/jpeg;base64,${image}`} alt={`Realistic view of ${content.title}`} className="w-full aspect-video object-cover rounded-lg mb-6"/>
        )}

        <h1 className="text-2xl font-bold text-white text-center mb-6">{content.title}</h1>
        <div className="space-y-4">
            {content.paragraphs.map((p, i) => (
                <Card key={i} extraClasses="bg-slate-800">
                    <div className="flex items-start justify-between gap-2">
                        <p className="font-korean text-lg text-white mb-2 flex-1">{p.korean}</p>
                        <button
                            onClick={() => playAudio(p.korean)}
                            className="p-1 text-gray-400 hover:text-white rounded-full transition-colors disabled:opacity-50"
                            disabled={!!audioLoadingLine}
                            aria-label="Play Korean pronunciation"
                        >
                            {audioLoadingLine === p.korean ? <LoadingSpinner /> : <SpeakerWaveIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{p.english}</p>
                    <p className="text-sm text-gray-400">{p.burmese}</p>
                </Card>
            ))}
        </div>
    </div>
);