import React, { useState, FC } from 'react';
import { usePosts } from '../contexts/PostsContext';
import { EditorPostCard } from '../components/EditorPostCard';
import { TOPIKPrepView } from '../components/editor/TOPIKPrepView';

interface EditorPageProps {
  onHashtagClick: (hashtag: string) => void;
}


export const EditorPage: FC<EditorPageProps> = ({ onHashtagClick }) => {
    const { editorPosts } = usePosts();
    const [activeTab, setActiveTab] = useState<'editor' | 'topik'>('editor');
    
    return (
        <div className="animate-fade-in">
            <div className="flex border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md z-10">
                <button 
                    onClick={() => setActiveTab('editor')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'editor' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    Editor's Picks
                </button>
                <button 
                    onClick={() => setActiveTab('topik')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'topik' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    TOPIK Prep
                </button>
            </div>
            <div className="p-4">
                {activeTab === 'editor' && (
                    <div className="space-y-4">
                        {editorPosts.map(post => (
                            <EditorPostCard
                                key={post.id}
                                post={post}
                                onHashtagClick={onHashtagClick}
                            />
                        ))}
                    </div>
                )}
                {activeTab === 'topik' && <TOPIKPrepView />}
            </div>
        </div>
    );
};