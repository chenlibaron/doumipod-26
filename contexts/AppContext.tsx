import React, { createContext, useState, useContext, useCallback, useEffect, FC, ReactNode } from 'react';
import { mockShortVideosData, mockLongVideosData, mockPaymentMethodsData, mockGiftCodesData } from '../data/mockData';
import * as api from '../services/api';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const AppContext = createContext(undefined);

export const AppProvider: FC<{children: ReactNode}> = ({ children }) => {
    const { user, updateUser } = useAuth();
    const { showToast } = useUI();

    const [settingsModalState, setSettingsModalState] = useState<boolean | string>(false);
    const [trimmingVideo, setTrimmingVideo] = useState(null);
    const [minimizedVideo, setMinimizedVideo] = useState(null);
    
    const [points, setPoints] = useState(5);
    const [unlockedBadgesCount, setUnlockedBadgesCount] = useState(0);
    
    const [shortVideos, setShortVideos] = useState(mockShortVideosData);
    const [longVideos, setLongVideos] = useState(mockLongVideosData);
    const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethodsData);
    const [giftCodes, setGiftCodes] = useState(mockGiftCodesData);
    const [billingHistory, setBillingHistory] = useState([]);
    const [broadcasts] = useState([
        { id: Date.now(), title: 'Welcome to Doumipod!', content: 'We are happy to have you here. Feel free to explore the app and start your learning journey.', type: 'info', timestamp: Date.now() - 3600000 * 2 }
    ]);
    const [dismissedBroadcasts, setDismissedBroadcasts] = useState(new Set());
    const [isGameModeActive, setIsGameModeActive] = useState(false);
    const [videoPlaybackTimes, setVideoPlaybackTimesState] = useState({});
    
    useEffect(() => {
        // Load data from localStorage on initial mount
        const loadInitialData = async () => {
            try {
                const savedPoints = localStorage.getItem('doumipod-points');
                const savedBadges = localStorage.getItem('doumipod-unlockedBadges');
                const billingHistoryData = await api.getBillingHistory();
                const savedPlaybackTimes = localStorage.getItem('doumipod-videoPlaybackTimes');

                if (savedPoints) setPoints(JSON.parse(savedPoints));
                if (savedBadges) setUnlockedBadgesCount(JSON.parse(savedBadges));
                if (savedPlaybackTimes) setVideoPlaybackTimesState(JSON.parse(savedPlaybackTimes));
                setBillingHistory(billingHistoryData);

            } catch (e) {
                console.error("Failed to load user data from localStorage", e);
            }
        };
        loadInitialData();
    }, []);

    const addPoints = useCallback((amount, type) => {
        setPoints(prevPoints => {
            const newPoints = prevPoints + amount;
            if (newPoints >= 10000) {
                const newBadgeCount = Math.min(unlockedBadgesCount + 1, 10);
                setUnlockedBadgesCount(newBadgeCount);
                localStorage.setItem('doumipod-unlockedBadges', JSON.stringify(newBadgeCount));
                showToast("Badge Unlocked!", 'success');
                localStorage.setItem('doumipod-points', JSON.stringify(5));
                return 5;
            } else {
                localStorage.setItem('doumipod-points', JSON.stringify(newPoints));
                return newPoints;
            }
        });
    }, [unlockedBadgesCount, showToast]);

    const addPaymentMethod = (cardDetails) => {
        const newMethod = { id: Date.now(), ...cardDetails, isDefault: paymentMethods.length === 0 };
        setPaymentMethods(prev => [...prev, newMethod]);
        showToast('Payment method added!', 'success');
    };

    const removePaymentMethod = (cardId) => {
        setPaymentMethods(prev => prev.filter(pm => pm.id !== cardId));
        showToast('Payment method removed.', 'success');
    };

    const setDefaultPaymentMethod = (cardId) => {
        setPaymentMethods(prev => prev.map(pm => ({...pm, isDefault: pm.id === cardId})));
        showToast('Default payment method updated.', 'success');
    };

    const dismissBroadcast = (id) => {
        setDismissedBroadcasts(prev => new Set(prev).add(id));
    };

    const clearLearningProgress = useCallback(() => {
        setPoints(0);
        setUnlockedBadgesCount(0);
        localStorage.removeItem('doumipod-points');
        localStorage.removeItem('doumipod-unlockedBadges');
        showToast('Learning progress cleared.', 'success');
    }, [showToast]);

    const redeemGiftCode = useCallback(async (code) => {
        if (!user) {
            showToast('You must be logged in.', 'error');
            return false;
        }
        try {
            const updatedUser = await api.redeemGiftCode(code, user);
            updateUser(updatedUser);
            showToast('Gift code redeemed successfully!', 'success');
            return true;
        } catch (e) {
            showToast(e.message, 'error');
            return false;
        }
    }, [user, updateUser, showToast]);

    const upgradeToPremium = useCallback(async (planType) => {
        if (!user) {
            showToast('You must be logged in.', 'error');
            return false;
        }
        try {
            const updatedUser = await api.upgradeToPremium(planType, user);
            updateUser(updatedUser);
            showToast('Successfully upgraded to Premium!', 'success');
            return true;
        } catch (e) {
            showToast('Upgrade failed. Please try again.', 'error');
            return false;
        }
    }, [user, updateUser, showToast]);

    const exportUserData = useCallback(async () => {
        if (!user) {
            showToast('You must be logged in.', 'error');
            return;
        }
        try {
            await api.exportUserData(user);
            showToast('Your data export has started and will be downloaded shortly.', 'success');
        } catch (e) {
            showToast('Failed to export data.', 'error');
        }
    }, [user, showToast]);

    const setVideoPlaybackTime = useCallback((videoId, time) => {
        setVideoPlaybackTimesState(prev => {
            const newTimes = { ...prev, [videoId]: time };
            localStorage.setItem('doumipod-videoPlaybackTimes', JSON.stringify(newTimes));
            return newTimes;
        });
    }, []);

    const value = {
        settingsModalState, trimmingVideo,
        minimizedVideo, points, unlockedBadgesCount,
        shortVideos, longVideos, paymentMethods, giftCodes, billingHistory, broadcasts, dismissedBroadcasts,
        isGameModeActive, videoPlaybackTimes,
        setSettingsModalState,
        setTrimmingVideo, setMinimizedVideo, 
        addPoints, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, dismissBroadcast,
        clearLearningProgress, redeemGiftCode, upgradeToPremium, exportUserData,
        setIsGameModeActive, setVideoPlaybackTime,
        showToast,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};