import React, { FC } from 'react';
import { SettingsView } from '../../SettingsModal';
import { SettingsRow } from '../common';
import { UserIcon } from '../../icons/Icons';
import { PersonalDetailsView } from './PersonalDetailsView';

interface AccountSettingsViewProps {
    view: SettingsView;
    setView: (view: SettingsView) => void;
}

export const AccountSettingsView: FC<AccountSettingsViewProps> = ({ view, setView }) => {
    if (view === 'personalDetails') {
        return <PersonalDetailsView />;
    }

    return (
        <>
            <SettingsRow icon={<UserIcon />} label="Personal Details" onClick={() => setView('personalDetails')} />
        </>
    );
};