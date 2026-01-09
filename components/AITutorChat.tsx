import React, { useState, useEffect, useRef, FC, KeyboardEvent } from 'react';
import { AITutorMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { PaperAirplaneIcon, RobotIcon } from './icons/Icons';

// A simple markdown parser
const SimpleMarkdown: FC<{ text: string }> = ({ text }) => {
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 p-1 rounded-md text-sm">$1</code>') // Inline code
        .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>') // List items
        .replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

interface AITutorChatProps {
    messages: AITutorMessage[];
    isLoading: boolean;
    onSendMessage: (input: string) => Promise<void>;
}

export const AITutorChat: FC<AITutorChatProps> = ({ messages, isLoading, onSendMessage }) => {
    const { user } = useAuth();
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const text = userInput;
        setUserInput('');
        await onSendMessage(text);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                         {msg.role === 'model' && (
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                 <RobotIcon className="w-5 h-5" />
                             </div>
                         )}
                         <div className={`max-w-sm md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                               <SimpleMarkdown text={msg.text} />
                            </div>
                         </div>
                         {msg.role === 'user' && (
                             <img src={user?.avatar} alt="Your avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                         )}
                    </div>
                ))}
                {isLoading && messages.some(m => m.role === 'user') && (
                     <div className="flex items-start gap-3">
                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                             <RobotIcon className="w-5 h-5" />
                         </div>
                         <div className="max-w-sm md:max-w-md p-3 rounded-2xl bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                             <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                             </div>
                         </div>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                     <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask your tutor..."
                        className="flex-1 h-10 px-4 bg-gray-100 dark:bg-slate-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                        disabled={isLoading}
                    />
                    <button onClick={handleSendMessage} disabled={!userInput.trim() || isLoading} className="p-2 text-white bg-indigo-500 rounded-full hover:bg-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 transition-colors">
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};