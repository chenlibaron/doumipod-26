import React, { createContext, useState, useContext, useEffect, useCallback, FC, ReactNode } from 'react';
import * as api from '../services/api';
import { EditorPost } from '../types';
import { useUI } from './UIContext';

interface PostsContextType {
    editorPosts: EditorPost[];
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [editorPosts, setEditorPosts] = useState<EditorPost[]>([]);
    
    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await api.getEditorPosts();
            setEditorPosts(posts);
        };
        fetchPosts();
    }, []);

    const value = {
        editorPosts,
    };

    return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};

export const usePosts = (): PostsContextType => {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error('usePosts must be used within a PostsProvider');
    }
    return context;
};