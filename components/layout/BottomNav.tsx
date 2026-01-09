import React, { SVGProps, FC } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, FilmIcon, RocketLaunchIcon } from '../icons/Icons';

interface BottomNavProps {
    activeTab: string;
}

const NavButton: FC<{ tab: string; to: string; IconComponent: FC<SVGProps<SVGSVGElement>>; isActive: boolean }> = ({ tab, to, IconComponent, isActive }) => (
    <Link
        to={to}
        aria-label={tab}
        className="flex flex-col items-center justify-center flex-1 focus:outline-none h-full"
    >
        <span className={`p-2 rounded-full transition-colors ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/50' : ''}`}>
          <IconComponent className={`w-6 h-6 transition-colors ${isActive ? 'text-indigo-500' : 'text-gray-500 dark:text-gray-400'}`} />
        </span>
    </Link>
);

export const BottomNav: FC<BottomNavProps> = ({ activeTab }) => {
    return (
        <nav className="flex items-center justify-around h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
            <NavButton tab="Learn" to="/" IconComponent={BookOpenIcon} isActive={activeTab === 'Learn'} />
            <NavButton tab="Videos" to="/videos" IconComponent={FilmIcon} isActive={activeTab === 'Videos'} />
            <NavButton tab="Game" to="/game" IconComponent={RocketLaunchIcon} isActive={activeTab === 'Game'} />
        </nav>
    );
};