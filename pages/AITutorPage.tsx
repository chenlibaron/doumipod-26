import React, { useEffect, useCallback, FC } from 'react';
import { AITutorChat } from '../components/AITutorChat';
import { useAITutor } from '../contexts/AITutorContext';
import { useAppContext } from '../contexts/AppContext';

interface AITutorPageProps {
    
}

export const AITutorPage: FC<AITutorPageProps> = () => {
    const { messages, isLoading, sendMessage, initializeAiTutorChat } = useAITutor();
    const { addPoints } = useAppContext();

    useEffect(() => {
        initializeAiTutorChat();
    }, [initializeAiTutorChat]);

    const handleSendMessage = useCallback(async (input: string) => {
        await sendMessage(input);
        addPoints(2, 'learning');
    }, [sendMessage, addPoints]);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-fade-in">
            {/* Chat Content */}
            <AITutorChat 
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
};