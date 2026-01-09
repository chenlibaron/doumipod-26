import React, { useState, useEffect, FC } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { ArrowLeftIcon, XMarkIcon } from './icons/Icons';

import { MainSettingsView } from './settings/views/MainSettingsView';
import { AccountSettingsView } from './settings/views/AccountSettingsView';
import { SubscriptionView } from './settings/views/SubscriptionView';
import { SecurityViews } from './settings/views/SecurityViews';
import { GeneralViews } from './settings/views/GeneralViews';
import { DataView } from './settings/views/DataView';


export type SettingsView = 
  | 'main' 
  | 'account'
  | 'personalDetails'
  | 'general' 
  | 'subscription' 
  | 'data'
  | 'dataClearLearning'
  | 'dataExport'
  | 'passwordAndSecurity' 
  | 'changePassword'
  | 'twoFactorAuth'
  | 'twoFactorAppSetup'
  | 'twoFactorSmsSetup'
  | 'twoFactorEmailSetup'
  | 'loginActivity'
  | 'language' 
  | 'paymentMethods' 
  | 'billingHistory' 
  | 'redeemCode' 
  | 'addPaymentMethod' 
  | 'choosePlan'
  | 'fontSize'
  | 'theme';

const viewCategoryMap: { [key in SettingsView]?: string } = {
  personalDetails: 'account',
  changePassword: 'passwordAndSecurity',
  twoFactorAuth: 'passwordAndSecurity',
  twoFactorAppSetup: 'twoFactorAuth',
  twoFactorSmsSetup: 'twoFactorAuth',
  twoFactorEmailSetup: 'twoFactorAuth',
  loginActivity: 'passwordAndSecurity',
  choosePlan: 'subscription',
  paymentMethods: 'subscription',
  addPaymentMethod: 'paymentMethods',
  billingHistory: 'subscription',
  redeemCode: 'subscription',
  language: 'general',
  theme: 'general',
  fontSize: 'general',
  dataClearLearning: 'data',
  dataExport: 'data',
};


const SettingsModal: FC = () => {
    const { logout } = useAuth();
    const { settingsModalState, setSettingsModalState } = useAppContext();
    const [view, setView] = useState<SettingsView>('main');

    useEffect(() => {
        if (settingsModalState && typeof settingsModalState === 'string') {
            setView(settingsModalState as SettingsView);
        } else if (!settingsModalState) {
            setView('main');
        }
    }, [settingsModalState]);

    const handleBack = () => {
        const category = viewCategoryMap[view];
        if (category) setView(category as SettingsView);
        else setView('main');
    };

    const handleClose = () => setSettingsModalState(false);

    const getTitle = () => {
      switch (view) {
          case 'main': return 'Settings';
          case 'account': return 'Account';
          case 'personalDetails': return 'Personal Details';
          case 'general': return 'General';
          case 'subscription': return 'Subscription';
          case 'data': return 'Your Data';
          case 'passwordAndSecurity': return 'Password & Security';
          case 'language': return 'Language';
          case 'theme': return 'Theme';
          case 'fontSize': return 'Font Size';
          case 'choosePlan': return 'Choose a Plan';
          case 'paymentMethods': return 'Payment Methods';
          case 'billingHistory': return 'Billing History';
          case 'changePassword': return 'Change Password';
          case 'twoFactorAuth': return 'Two-Factor Authentication';
          case 'twoFactorAppSetup': return 'Authenticator App';
          case 'twoFactorSmsSetup': return 'SMS Verification';
          case 'twoFactorEmailSetup': return 'Email Verification';
          case 'loginActivity': return 'Login Activity';
          case 'dataExport': return 'Export Your Data';
          case 'redeemCode': return 'Redeem a Code';
          case 'addPaymentMethod': return 'Add Payment Method';
          case 'dataClearLearning': return 'Clear Learning Progress';
          default: return 'Settings';
      }
    };

    const renderContent = () => {
        const accountViews: SettingsView[] = ['account', 'personalDetails'];
        const subscriptionViews: SettingsView[] = ['subscription', 'choosePlan', 'paymentMethods', 'addPaymentMethod', 'billingHistory', 'redeemCode'];
        const securityViews: SettingsView[] = ['passwordAndSecurity', 'changePassword', 'twoFactorAuth', 'twoFactorAppSetup', 'twoFactorSmsSetup', 'twoFactorEmailSetup', 'loginActivity'];
        const generalViews: SettingsView[] = ['general', 'language', 'theme', 'fontSize'];
        const dataViews: SettingsView[] = ['data', 'dataClearLearning', 'dataExport'];

        if (accountViews.includes(view)) return <AccountSettingsView view={view} setView={setView} />;
        if (subscriptionViews.includes(view)) return <SubscriptionView view={view} setView={setView} />;
        if (securityViews.includes(view)) return <SecurityViews view={view} setView={setView} />;
        if (generalViews.includes(view)) return <GeneralViews view={view} setView={setView} />;
        if (dataViews.includes(view)) return <DataView view={view} setView={setView} />;
        
        if (view === 'main') return <MainSettingsView setView={setView} onLogout={logout} />;
        
        return <p className="text-center text-gray-500 dark:text-gray-400 px-4">Settings not available yet.</p>;
    };

    if (!settingsModalState) return null;

    return (
        <div
            className="fixed inset-0 bg-white dark:bg-slate-900 z-50 animate-slide-in-right"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex flex-col h-full">
                <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between h-16">
                    <div className="w-8">
                        {view !== 'main' && (
                            <button onClick={handleBack} className="p-1 text-gray-600 dark:text-gray-300">
                                <ArrowLeftIcon />
                            </button>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{getTitle()}</h2>
                    <div className="w-8">
                        <button onClick={handleClose} className="p-1 text-gray-600 dark:text-gray-300">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    {renderContent()}
                </div>
            </div>
             <style>{`
                @keyframes slide-in-right {
                  from { transform: translateX(100%); }
                  to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                  animation: slide-in-right 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SettingsModal;