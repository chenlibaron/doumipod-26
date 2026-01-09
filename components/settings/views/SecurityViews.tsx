import React, { useState, FC } from 'react';
import { SettingsView } from '../../SettingsModal';
import { SettingsRow } from '../common';
import { KeyIcon, ShieldCheckIcon, ClockIcon, ChatBubbleBottomCenterTextIcon, AtSymbolIcon } from '../../icons/Icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useUI } from '../../../contexts/UIContext';
import { Card } from '../../common/Card';
import { LoadingSpinner } from '../../common/LoadingSpinner';

interface SecurityViewsProps {
    view: SettingsView;
    setView: (view: SettingsView) => void;
}

export const SecurityViews: FC<SecurityViewsProps> = ({ view, setView }) => {
    const { 
        user, changePassword, enableTwoFactorAuthApp, verifyTwoFactorAuthApp, 
        sendVerificationCode, verifyOtpCode, disableTwoFactorAuth,
        loginActivity
    } = useAuth();
    const { showToast } = useUI();
    
    // State for this component
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorSetup, setTwoFactorSetup] = useState<{ secret: string, qrCode: string, backupCodes: string[] } | null>(null);
    const [twoFactorToken, setTwoFactorToken] = useState('');
    const [isVerifying2FA, setIsVerifying2FA] = useState(false);

    if (!user) return null;
    
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }
        const success = await changePassword(currentPassword, newPassword);
        if (success) {
            showToast('Password changed successfully!', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setView('passwordAndSecurity');
        } else {
            showToast('Failed to change password. Check your current password.', 'error');
        }
    };
    
    switch (view) {
        case 'changePassword':
            return (
                <div className="space-y-4 px-4">
                     <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                     <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                     <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                     <button onClick={handleChangePassword} className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg mt-2">Change Password</button>
                </div>
            );
        case 'twoFactorAuth':
            return (
              <div className="space-y-4">
                  <div className="px-4">
                    {user.twoFactorEnabled ? (
                        <Card extraClasses="text-center bg-green-50 dark:bg-green-900/30">
                            <p className="font-semibold text-green-800 dark:text-green-200">Two-Factor Authentication is ON</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Method: {user.twoFactorMethod.toUpperCase()}</p>
                            <button onClick={async () => { await disableTwoFactorAuth(); showToast('2FA Disabled'); }} className="mt-4 text-sm text-red-500 font-semibold">Disable</button>
                        </Card>
                    ) : (
                        <Card extraClasses="text-center">
                            <p className="font-semibold">Two-Factor Authentication is OFF</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Add an extra layer of security to your account.</p>
                        </Card>
                    )}
                  </div>
                  <SettingsRow icon={<ShieldCheckIcon />} label="Authenticator App" onClick={() => setView('twoFactorAppSetup')} />
                  <SettingsRow icon={<ChatBubbleBottomCenterTextIcon />} label="Text Message (SMS)" onClick={() => setView('twoFactorSmsSetup')} />
                  <SettingsRow icon={<AtSymbolIcon />} label="Email Verification" onClick={() => setView('twoFactorEmailSetup')} />
              </div>
            );
        case 'twoFactorAppSetup':
            return (
                <div className="text-center px-4">
                    {twoFactorSetup ? (
                        <>
                            <h3 className="font-bold">Verification</h3>
                            <p className="text-sm my-2">Enter the 6-digit code from your authenticator app.</p>
                            <input value={twoFactorToken} onChange={e => setTwoFactorToken(e.target.value)} type="text" maxLength={6} className="w-40 p-2 text-center text-2xl tracking-[0.5em] border rounded-md" />
                            <button onClick={async () => {
                                setIsVerifying2FA(true);
                                const success = await verifyTwoFactorAuthApp(twoFactorToken);
                                setIsVerifying2FA(false);
                                if (success) { showToast('Authenticator App enabled!'); setView('passwordAndSecurity'); }
                                else { showToast('Invalid code.', 'error'); }
                            }} disabled={isVerifying2FA} className="w-full py-2 bg-indigo-600 text-white rounded-lg mt-4">{isVerifying2FA ? 'Verifying...' : 'Verify'}</button>
                            <h3 className="font-bold mt-6">Backup Codes</h3>
                            <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-lg text-left font-mono space-y-1">
                                {user.backupCodes?.map(code => <p key={code}>{code}</p>)}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Save these codes somewhere safe. They can be used to log in if you lose access to your phone.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="font-bold">Set up Authenticator App</h3>
                            <p className="text-sm my-2">Scan this QR code with an authenticator app like Google Authenticator or Authy.</p>
                            {isVerifying2FA ? <div className="h-48 flex justify-center items-center"><LoadingSpinner/></div> : twoFactorSetup?.qrCode ? <img src={twoFactorSetup.qrCode} alt="QR Code" className="mx-auto my-4 p-2 border bg-white" /> : null}
                            <button onClick={async () => {
                                setIsVerifying2FA(true);
                                const setupData = await enableTwoFactorAuthApp();
                                setIsVerifying2FA(false);
                                if (setupData) setTwoFactorSetup(setupData);
                                else showToast('Could not start setup.', 'error');
                            }} disabled={isVerifying2FA} className="w-full py-2 bg-indigo-600 text-white rounded-lg">{isVerifying2FA ? 'Generating...' : 'Start Setup'}</button>
                        </>
                    )}
                </div>
            );
        case 'twoFactorSmsSetup':
        case 'twoFactorEmailSetup':
            const method = view === 'twoFactorSmsSetup' ? 'sms' : 'email';
            const destination = method === 'sms' ? user.phone : user.username;
            return (
                <div className="text-center px-4">
                    <p className="text-sm mb-4">We'll send a verification code to {destination}.</p>
                    <button onClick={async () => {
                        setIsVerifying2FA(true);
                        const success = await sendVerificationCode(method);
                        setIsVerifying2FA(false);
                        if (!success) showToast('Failed to send code.', 'error');
                    }} disabled={isVerifying2FA} className="w-full py-2 bg-indigo-500 text-white rounded-lg mb-4">{isVerifying2FA ? 'Sending...' : 'Send Code'}</button>
                    <input value={twoFactorToken} onChange={e => setTwoFactorToken(e.target.value)} type="text" maxLength={6} placeholder="6-digit code" className="w-40 p-2 text-center text-2xl tracking-[0.5em] border rounded-md" />
                    <button onClick={async () => {
                        setIsVerifying2FA(true);
                        const success = await verifyOtpCode(method, twoFactorToken);
                        setIsVerifying2FA(false);
                        if (success) { showToast(`${method.toUpperCase()} verification enabled!`); setView('passwordAndSecurity'); }
                        else { showToast('Invalid code.', 'error'); }
                    }} disabled={isVerifying2FA} className="w-full py-2 bg-green-600 text-white rounded-lg mt-4">{isVerifying2FA ? 'Verifying...' : 'Verify'}</button>
                </div>
            );
        case 'loginActivity':
            return (
                <div className="space-y-3 px-4">
                    {loginActivity.map(activity => (
                        <Card key={activity.id}>
                            <p className="font-semibold">{activity.device} {activity.isCurrent && <span className="text-xs text-green-500">(Current Session)</span>}</p>
                            <p className="text-sm text-gray-500">{activity.location}</p>
                            <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                        </Card>
                    ))}
                </div>
            );
        default: // 'passwordAndSecurity' view
            return (
                <>
                    <SettingsRow icon={<KeyIcon/>} label="Change Password" onClick={() => setView('changePassword')} />
                    <SettingsRow icon={<ShieldCheckIcon/>} label="Two-Factor Authentication" onClick={() => setView('twoFactorAuth')} detail={<span className={`text-sm font-semibold ${user.twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>{user.twoFactorEnabled ? 'On' : 'Off'}</span>} />
                    <SettingsRow icon={<ClockIcon/>} label="Login Activity" onClick={() => setView('loginActivity')} />
                </>
            );
    }
};