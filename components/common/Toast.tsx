import React, { FC } from 'react';
import { CheckCircleIcon, XCircleIcon } from '../icons/Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export const Toast: FC<ToastProps> = ({ message, type }) => {
    const isSuccess = type === 'success';

    return (
        <div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up"
        >
            <div className="flex items-center space-x-3 bg-slate-900/80 dark:bg-slate-700/80 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg">
                {isSuccess ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                    <XCircleIcon className="w-5 h-5 text-red-400" />
                )}
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
};