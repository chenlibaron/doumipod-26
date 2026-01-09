import React, { FC } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { SettingsView } from '../../SettingsModal';
import { SettingsRow } from '../common';
import { UserCircleIcon, StarIcon, CircleStackIcon, KeyIcon, AdjustmentsVerticalIcon, ArrowRightOnRectangleIcon } from '../../icons/Icons';

interface MainSettingsViewProps {
    setView: (view: SettingsView) => void;
    onLogout: () => void;
}

export const MainSettingsView: FC<MainSettingsViewProps> = ({ setView, onLogout }) => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <>
            <SettingsRow icon={<UserCircleIcon/>} label="Account" onClick={() => setView('account')} />
            <SettingsRow icon={<StarIcon />} label="Subscription" onClick={() => setView('subscription')} detail={<span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{user.isPremium ? 'Premium' : 'Free'}</span>} />
            <SettingsRow icon={<KeyIcon />} label="Password and Security" onClick={() => setView('passwordAndSecurity')} />
            <SettingsRow icon={<AdjustmentsVerticalIcon/>} label="General" onClick={() => setView('general')} />
            <SettingsRow icon={<CircleStackIcon/>} label="Your Data" onClick={() => setView('data')} />
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2 mx-4">
                <button onClick={onLogout} className="w-full flex items-center space-x-4 text-left py-2 text-red-500 hover:text-red-700 font-medium">
                   <ArrowRightOnRectangleIcon className="w-6 h-6"/>
                   <span>Log Out</span>
                </button>
            </div>
        </>
    );
};