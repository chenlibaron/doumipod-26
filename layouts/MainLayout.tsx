import React, { ReactNode, FC } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { DoumipodLogo, OpenPodLogo, AskDoumiLogo } from '../components/common/Logos';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftIcon } from '../components/icons/Icons';

export const MainLayout: FC<{children: ReactNode}> = ({ children }) => {
    const { setSettingsModalState, isGameModeActive } = useAppContext();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const bottomNavPaths = ['/', '/videos', '/game'];
    const path = location.pathname;
    const isSubView = !bottomNavPaths.includes(path);
    const showNav = !isSubView && !isGameModeActive;

    let activeTab = 'Learn';
    if (path.startsWith('/videos')) activeTab = 'Videos';
    if (path.startsWith('/game')) activeTab = 'Game';

    const renderTitle = () => {
        if (path === '/editor') return <OpenPodLogo size="lg" />;
        if (path === '/ai-tutor') return <AskDoumiLogo size="lg" />;
        if (path.startsWith('/videos/')) return <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Videos</h1>;
        return <DoumipodLogo />;
    };

    return (
        <div className="max-w-xl mx-auto flex flex-col h-screen relative">
            {!isGameModeActive && (
                <Header>
                    {isSubView ? (
                        <>
                            <div className="flex-1 justify-self-start">
                                <button onClick={() => navigate(-1)} className="p-2 text-gray-600 dark:text-gray-300 -ml-2">
                                    <ArrowLeftIcon />
                                </button>
                            </div>
                            <div className="flex-1 justify-self-center flex justify-center">
                                {renderTitle()}
                            </div>
                            <div className="flex-1 justify-self-end" />
                        </>
                    ) : (
                        <>
                            {renderTitle()}
                            {user && (
                                <button onClick={() => setSettingsModalState(true)}>
                                    <img src={user.avatar} className='w-8 h-8 rounded-full' alt="User avatar" />
                                </button>
                            )}
                        </>
                    )}
                </Header>
            )}
            <main className={`flex-1 overflow-y-auto scrollbar-hide relative ${showNav ? 'pb-16' : ''}`}>
                {children}
            </main>
            {showNav && (
                <div className='fixed bottom-0 left-0 right-0 max-w-xl mx-auto'>
                    <BottomNav activeTab={activeTab} />
                </div>
            )}
        </div>
    );
};