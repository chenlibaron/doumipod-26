import React, { ReactNode, FC } from 'react';

interface HeaderProps {
    children: ReactNode;
}

export const Header: FC<HeaderProps> = ({ children }) => {
    return (
        <header className="sticky top-0 z-40 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16">
            {children}
        </header>
    );
};