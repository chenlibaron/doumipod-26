import React, { FC } from 'react';

export const BadgeCard: FC<{ name: string; image: string; isUnlocked: boolean; isLatest: boolean; }> = ({ name, image, isUnlocked, isLatest }) => (
    <div 
        className={`relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-md transition-all duration-500 bg-cover bg-center ${isUnlocked ? '' : 'grayscale'} ${isLatest ? 'ring-4 ring-offset-2 ring-yellow-300 dark:ring-yellow-400 animate-pulse' : ''}`}
        style={{ backgroundImage: `url(${image})` }}
        aria-label={`${name} badge`}
    >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm">
            <p className="text-white text-xs font-semibold text-center capitalize">{name}</p>
        </div>
    </div>
);