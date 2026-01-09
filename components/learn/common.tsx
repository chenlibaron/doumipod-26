import React, { FC } from 'react';

export const mainCardGradient = 'bg-gradient-to-r from-purple-200 to-indigo-200 dark:from-purple-900/70 dark:to-indigo-900/70';
export const nestedCardStyle = 'bg-transparent border-l border-b border-indigo-300/30 dark:border-indigo-800/30 shadow-[-1px_1px_5px_rgba(99,102,241,0.05)] rounded-lg';
export const dialogueBubbleStyle = 'bg-white/30 dark:bg-black/30 backdrop-blur-sm';


export const GrammarDetailSection: FC<{ title: string, content?: string }> = ({ title, content }) => {
    if (!content || content.trim() === '') return null;
    return (
        <div className="mt-4">
            <h4 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                {title}
            </h4>
            <div
                className={`p-3 text-sm text-gray-700 dark:text-gray-300 ml-1 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_b]:font-semibold ${nestedCardStyle} leading-relaxed whitespace-pre-wrap`}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};