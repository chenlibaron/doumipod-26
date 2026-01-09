import React, { createContext, useState, useContext, useCallback, FC, ReactNode } from 'react';

const UIContext = createContext(undefined);

export const UIProvider: FC<{children: ReactNode}> = ({ children }) => {
    const [theme, setThemeState] = useState(() => (localStorage.getItem('doumipod-theme')) || 'system');
    const [language, setLanguageState] = useState(() => localStorage.getItem('doumipod-language') || 'English');
    const [fontSize, setFontSizeState] = useState(() => (localStorage.getItem('doumipod-fontSize')) || 'base');
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 3000);
    }, []);

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('doumipod-theme', newTheme);
    }, []);

    const setLanguage = useCallback((newLang) => {
        setLanguageState(newLang);
        localStorage.setItem('doumipod-language', newLang);
    }, []);

    const setFontSize = useCallback((newSize) => {
        setFontSizeState(newSize);
        localStorage.setItem('doumipod-fontSize', newSize);
    }, []);

    const value = {
        theme, language, fontSize, toastMessage,
        setTheme, setLanguage, setFontSize, showToast
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};