import React, { FC, ReactNode } from 'react';
import { ChevronRightIcon, CheckIcon } from '../icons/Icons';

export const SettingsToggle: FC<{ label: string, enabled: boolean, onToggle: (enabled: boolean) => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-3 px-4">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <button
            onClick={() => onToggle(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 ${
                enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-pressed={enabled}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

export const SettingsRow: FC<{ icon: ReactNode, label: string, onClick: () => void, detail?: ReactNode }> = ({ icon, label, onClick, detail }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between text-left py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 px-4 transition-colors">
        <div className="flex items-center space-x-4">
            <div className="text-gray-500 dark:text-gray-400">{icon}</div>
            <span className="text-gray-800 dark:text-gray-200">{label}</span>
        </div>
        <div className="flex items-center space-x-2">
            {detail}
            <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
    </button>
);

export const RadioRow: FC<{ label: string, isSelected: boolean, onClick: () => void }> = ({ label, isSelected, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between text-left py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 px-4 transition-colors">
        <span className="text-gray-800 dark:text-gray-200">{label}</span>
        {isSelected && <CheckIcon className="w-5 h-5 text-indigo-500" />}
    </button>
);