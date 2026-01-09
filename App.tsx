import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useAppContext } from './contexts/AppContext';
import { useUI } from './contexts/UIContext';
import Auth from './components/Auth';
import { LearnPage } from './pages/LearnPage';
import { EditorPage } from './pages/EditorPage';
import { AITutorPage } from './pages/AITutorPage';
import { VideoDetailPage } from './pages/VideoDetailPage';
import { VideosPage } from './pages/VideosPage';
import { GamePage } from './pages/GamePage';

import SettingsModal from './components/SettingsModal';
import VideoTrimmerModal from './components/VideoTrimmerModal';
import { BroadcastBanner } from './components/BroadcastBanner';
import { MiniVideoPlayer } from './components/MiniVideoPlayer';
import { Toast } from './components/common/Toast';

import { MainLayout } from './layouts/MainLayout';


const AppContent = () => {
    const {
        trimmingVideo, minimizedVideo,
        broadcasts, dismissedBroadcasts,
        setMinimizedVideo, dismissBroadcast, setTrimmingVideo,
    } = useAppContext();
    const { toastMessage } = useUI();
    const navigate = useNavigate();

    const activeBroadcast = broadcasts.find(b => !dismissedBroadcasts.has(b.id));

    return (
        <div className="h-full">
            <MainLayout>
                {activeBroadcast && <BroadcastBanner key='banner' broadcast={activeBroadcast} onDismiss={dismissBroadcast} />}
                <Routes>
                    <Route path="/" element={<LearnPage />} />
                    <Route path="/videos" element={<VideosPage />} />
                    <Route path="/videos/:videoId" element={<VideoDetailPage />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/editor" element={<EditorPage onHashtagClick={() => {}} />} />
                    <Route path="/ai-tutor" element={<AITutorPage />} />
                    <Route path="*" element={<LearnPage />} /> {/* Fallback route */}
                </Routes>
            </MainLayout>
            
            <SettingsModal />
            {trimmingVideo && <VideoTrimmerModal video={trimmingVideo} onClose={() => setTrimmingVideo(null)} onTrimComplete={(blob) => { if(trimmingVideo) trimmingVideo.onComplete(blob); setTrimmingVideo(null); }} />}
            
            {minimizedVideo && <MiniVideoPlayer videoData={minimizedVideo} onClose={() => setMinimizedVideo(null)} onMaximize={(video) => navigate(`/videos/${video.id}`)} />}
            {toastMessage && <Toast message={toastMessage.message} type={toastMessage.type} />}
        </div>
    );
};


const App = () => {
    const { user } = useAuth();
    const { theme, fontSize } = useUI();
    
    useEffect(() => {
        const root = window.document.documentElement;
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                if (e.matches) root.classList.add('dark'); else root.classList.remove('dark');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('font-size-sm', 'font-size-base', 'font-size-lg', 'font-size-xl');
        root.classList.add(`font-size-${fontSize}`);
    }, [fontSize]);
    
    if (!user) return <Auth />;

    return (
        <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-gray-100 font-sans">
            <AppContent />
        </div>
    );
};

export default App;