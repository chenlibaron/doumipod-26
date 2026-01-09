import React, { FC } from 'react';
import { BadgeCard } from './BadgeCard';

const badgeData = [
    { name: 'new learner', image: 'https://picsum.photos/200/200?random=1' },
    { name: 'active learner', image: 'https://picsum.photos/200/200?random=2' },
    { name: 'progress achiever', image: 'https://picsum.photos/200/200?random=3' },
    { name: 'confident speaker', image: 'https://picsum.photos/200/200?random=4' },
    { name: 'consistent learner', image: 'https://picsum.photos/200/200?random=5' },
    { name: 'fluent communicator', image: 'https://picsum.photos/200/200?random=6' },
    { name: 'creative speaker', image: 'https://picsum.photos/200/200?random=7' },
    { name: 'cultural learner', image: 'https://picsum.photos/200/200?random=8' },
    { name: 'language mentor', image: 'https://picsum.photos/200/200?random=9' },
    { name: 'master speaker', image: 'https://picsum.photos/200/200?random=10' },
];

export const BadgeGallery: FC<{ unlockedBadgesCount: number }> = ({ unlockedBadgesCount }) => (
    <div>
        <h3 className="px-4 text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">Your Badges</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
            {badgeData.map((badge, index) => (
                <BadgeCard 
                    key={badge.name}
                    name={badge.name}
                    image={badge.image}
                    isUnlocked={index < unlockedBadgesCount}
                    isLatest={index === unlockedBadgesCount - 1}
                />
            ))}
        </div>
    </div>
);