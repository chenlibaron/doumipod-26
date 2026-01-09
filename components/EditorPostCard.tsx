import React, { useState, useRef, useEffect, FC } from 'react';
import { User, EditorPost } from '../types';
import { EyeIcon, Squares2X2Icon, SpeakerWaveIcon, SpeakerXMarkIcon } from './icons/Icons';
import { ExpandableText } from './common/ExpandableText';

const timeAgo = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return new Date(timestamp).toLocaleDateString();
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};

const formatViews = (views: number): string => {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (views >= 1000) {
        return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return views.toString();
};


interface EditorPostCardProps {
    post: EditorPost;
    onHashtagClick: (hashtag: string) => void;
}

export const EditorPostCard: FC<EditorPostCardProps> = ({ post, onHashtagClick }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (post.video && videoElement) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    videoElement.play().catch(() => {});
                } else {
                    videoElement.pause();
                }
            }, { threshold: 0.5 });
            observer.observe(videoElement);
            return () => {
                if(videoElement) {
                    observer.unobserve(videoElement);
                    videoElement.pause();
                }
            };
        }
    }, [post.video]);

    const hasImages = post.images && post.images.length > 0;

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 animate-fade-in-up">
            <div className="flex justify-between items-start">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 flex-1 pr-2">{post.title}</h3>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full"/>
                <span>{post.author.name}</span>
                <span>&middot;</span>
                <span>{timeAgo(post.timestamp)}</span>
            </div>

            {hasImages && (
                <div className="relative rounded-lg mb-3 overflow-hidden">
                    <img src={post.images![0]} alt="Post content" className="w-full h-auto" />
                    {post.images!.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold p-1 rounded-md flex items-center space-x-1">
                            <Squares2X2Icon className="w-4 h-4" />
                            <span>1/{post.images!.length}</span>
                        </div>
                    )}
                </div>
            )}
            {post.video && (
                <div className="relative rounded-lg mb-3 overflow-hidden">
                    <video ref={videoRef} src={post.video} loop muted={isMuted} playsInline className="w-full bg-black" />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(prev => !prev);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/40 rounded-full pointer-events-auto"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <SpeakerXMarkIcon className="w-5 h-5 text-white" /> : <SpeakerWaveIcon className="w-5 h-5 text-white" />}
                    </button>
                </div>
            )}
            
            <ExpandableText
                text={post.content}
                maxLength={200}
                className="text-sm text-gray-600 dark:text-gray-300"
                onHashtagClick={onHashtagClick}
            />
            
            <div className="flex justify-end items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <EyeIcon className="w-5 h-5"/>
                    <span className="text-xs font-semibold">{formatViews(post.views || 0)}</span>
                </div>
            </div>
        </div>
    );
};