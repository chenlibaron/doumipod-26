import React, { FC } from 'react';
import { SettingsView } from '../../SettingsModal';
import { SettingsRow, RadioRow } from '../common';
import { LanguageIcon, SunIcon, DocumentTextIcon } from '../../icons/Icons';
import { useUI } from '../../../contexts/UIContext';

interface GeneralViewsProps {
    view: SettingsView;
    setView: (view: SettingsView) => void;
}

export const GeneralViews: FC<GeneralViewsProps> = ({ view, setView }) => {
    const { theme, language, fontSize, setTheme, setLanguage, setFontSize } = useUI();
    
    switch (view) {
        case 'language':
            return (
                <>
                    <RadioRow label="English" isSelected={language === 'English'} onClick={() => { setLanguage('English'); setView('general'); }} />
                    <RadioRow label="한국어 (Korean)" isSelected={language === '한국어 (Korean)'} onClick={() => { setLanguage('한국어 (Korean)'); setView('general'); }} />
                    <RadioRow label="မြန်မာ (Burmese)" isSelected={language === 'မြန်မာ (Burmese)'} onClick={() => { setLanguage('မြန်မာ (Burmese)'); setView('general'); }} />
                </>
            );
        case 'theme':
            return (
                <>
                    <RadioRow label="Light" isSelected={theme === 'light'} onClick={() => { setTheme('light'); setView('general'); }} />
                    <RadioRow label="Dark" isSelected={theme === 'dark'} onClick={() => { setTheme('dark'); setView('general'); }} />
                    <RadioRow label="System" isSelected={theme === 'system'} onClick={() => { setTheme('system'); setView('general'); }} />
                </>
            );
        case 'fontSize':
            const sizes: ('sm' | 'base' | 'lg' | 'xl')[] = ['sm', 'base', 'lg', 'xl'];
            return (
                <>
                    {sizes.map(size => (
                        <RadioRow key={size} label={size.toUpperCase()} isSelected={fontSize === size} onClick={() => { setFontSize(size); setView('general'); }} />
                    ))}
                </>
            );
        default: // 'general' view
             return (
                <>
                    <SettingsRow icon={<LanguageIcon />} label="Language" onClick={() => setView('language')} detail={<span className="text-sm text-gray-500 dark:text-gray-400">{language}</span>} />
                    <SettingsRow icon={<SunIcon />} label="Theme" onClick={() => setView('theme')} detail={<span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{theme}</span>} />
                    <SettingsRow icon={<DocumentTextIcon />} label="Font Size" onClick={() => setView('fontSize')} detail={<span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{fontSize}</span>} />
                </>
            );
    }
};