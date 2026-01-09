import React, { useState, FC } from 'react';
import { Link } from 'react-router-dom';
import { LongVideo, ShortVideo } from '../types';
import { Card } from '../components/common/Card';
import { EyeIcon, PlayCircleIcon } from '../components/icons/Icons';
import { useAppContext } from '../contexts/AppContext';
import { ShortVideoFeedViewer } from '../components/ShortVideoFeedViewer';

const ShortVideoCard: FC<{ video: ShortVideo, onSelect: () => void }> = ({ video, onSelect }) => (
    <div className="flex-shrink-0 w-32 cursor-pointer group" onClick={onSelect}>
        <div className="relative aspect-[9/16] rounded-lg overflow-hidden shadow-md">
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 text-white">
                <h4 className="text-xs font-bold truncate">{video.title}</h4>
                <div className="flex items-center space-x-1 text-xs opacity-80">
                    <EyeIcon className="w-3 h-3"/>
                    <span>{video.views}</span>
                </div>
            </div>
        </div>
    </div>
);

const LongVideoCard: FC<{ video: LongVideo }> = ({ video }) => (
    <Card extraClasses="cursor-pointer group animate-fade-in-up" >
        <Link to={`/videos/${video.id}`}>
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <PlayCircleIcon className="w-12 h-12 text-white/80 transform group-hover:scale-110 transition-transform" />
                </div>
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">{video.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{video.caption}</p>
        </Link>
    </Card>
);

interface VideosPageProps {}

export const VideosPage: FC<VideosPageProps> = () => {
    const { shortVideos, longVideos } = useAppContext();
    const [viewingShorts, setViewingShorts] = useState<{ videos: ShortVideo[], startIndex: number } | null>(null);

    return (
        <div className="min-h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/10 dark:via-purple-900/10 dark:to-pink-900/10 relative">
            <div className="pt-4 pb-24">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 px-4 mb-3">Shorts</h2>
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-4">
                    {shortVideos.map((video, index) => (
                        <ShortVideoCard 
                            key={video.id} 
                            video={video} 
                            onSelect={() => setViewingShorts({ videos: shortVideos, startIndex: index })}
                        />
                    ))}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 px-4 mt-6 mb-3">Learn with Videos</h2>
                <div className="space-y-4 px-4">
                    {longVideos.map((video) => (
                        <LongVideoCard key={video.id} video={video} />
                    ))}
                </div>
            </div>
            
            {viewingShorts && (
                <ShortVideoFeedViewer
                    videos={viewingShorts.videos}
                    startIndex={viewingShorts.startIndex}
                    onClose={() => setViewingShorts(null)}
                />
            )}
        </div>
    );
};