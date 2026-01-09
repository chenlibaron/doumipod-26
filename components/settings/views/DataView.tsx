import React, { FC } from 'react';
import { SettingsView } from '../../SettingsModal';
import { SettingsRow } from '../common';
import { TrashIcon, ArrowDownTrayIcon } from '../../icons/Icons';
import { useAppContext } from '../../../contexts/AppContext';

interface DataViewProps {
    view: SettingsView;
    setView: (view: SettingsView) => void;
}

export const DataView: FC<DataViewProps> = ({ view, setView }) => {
    const { clearLearningProgress, exportUserData } = useAppContext();

    switch (view) {
        case 'dataClearLearning':
            return (
                 <div className="text-center px-4">
                    <p className="text-sm mb-4">This will permanently reset your learning points and badges.</p>
                    <button onClick={() => { clearLearningProgress(); setView('data');}} className="px-4 py-2 bg-red-500 text-white rounded-lg">Clear Progress</button>
                </div>
            );
        case 'dataExport':
            return (
              <div className="text-center px-4">
                <p className="text-sm mb-4">Request an export of your personal data and learning progress.</p>
                <button onClick={exportUserData} className="px-4 py-2 bg-indigo-500 text-white rounded-lg">Request Data Export</button>
              </div>
            );
        default: // 'data' view
            return (
                <>
                    <SettingsRow icon={<TrashIcon/>} label="Clear Learning Progress" onClick={() => setView('dataClearLearning')} />
                    <SettingsRow icon={<ArrowDownTrayIcon/>} label="Export Your Data" onClick={() => setView('dataExport')} />
                </>
            );
    }
};