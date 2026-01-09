import React, { useState, FC } from 'react';
import { SettingsView } from '../../SettingsModal';
import { SettingsRow } from '../common';
import { Card } from '../../common/Card';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { StarIcon, CreditCardIcon, DocumentDuplicateIcon, CheckCircleIcon } from '../../icons/Icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppContext } from '../../../contexts/AppContext';
import { useUI } from '../../../contexts/UIContext';

interface SubscriptionViewProps {
    view: SettingsView;
    setView: (view: SettingsView) => void;
}

export const SubscriptionView: FC<SubscriptionViewProps> = ({ view, setView }) => {
    const { user } = useAuth();
    const { 
        paymentMethods, billingHistory, addPaymentMethod,
        redeemGiftCode, upgradeToPremium
    } = useAppContext();
    const { showToast } = useUI();
    
    // State for this component
    const [redeemCodeInput, setRedeemCodeInput] = useState('');
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState<'monthly' | 'yearly' | false>(false);
    const [cardType, setCardType] = useState<'Visa' | 'Mastercard'>('Visa');
    const [last4, setLast4] = useState('');
    const [expiry, setExpiry] = useState('');

    if (!user) return null;

    const handleRedeemCode = async () => {
        if (!redeemCodeInput.trim()) return;
        setIsRedeeming(true);
        const success = await redeemGiftCode(redeemCodeInput);
        setIsRedeeming(false);
        if (success) {
            setRedeemCodeInput('');
            setView('subscription');
        }
    };
    
    const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
        setIsUpgrading(plan);
        const success = await upgradeToPremium(plan);
        setIsUpgrading(false);
        if (success) {
            setView('subscription');
        }
    };
  
    const handleAddPaymentMethod = () => {
        if (last4.length === 4 && expiry.match(/^\d{2}\/\d{4}$/)) {
            addPaymentMethod({ type: cardType, last4, expiry });
            setLast4('');
            setExpiry('');
            setView('paymentMethods');
        } else {
            showToast('Please enter valid card details.', 'error');
        }
    };

    switch (view) {
        case 'choosePlan':
            return (
              <div className="space-y-4 px-4">
                <Card extraClasses="border-purple-500 border-2">
                  <h4 className="font-bold text-lg text-purple-700 dark:text-purple-300">Doumipod Premium Yearly</h4>
                  <p className="text-2xl font-bold my-2">$99.99<span className="text-sm font-normal">/year</span> <span className="text-sm font-semibold text-green-500">(Save 20%)</span></p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> All Premium features</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> Best value</li>
                  </ul>
                  <button onClick={() => handleUpgrade('yearly')} disabled={isUpgrading === 'yearly'} className="w-full mt-4 py-2 bg-purple-600 text-white font-semibold rounded-lg flex justify-center items-center">
                    {isUpgrading === 'yearly' ? <LoadingSpinner /> : 'Upgrade Now'}
                  </button>
                </Card>
                <Card extraClasses="border-indigo-500 border-2">
                  <h4 className="font-bold text-lg text-indigo-700 dark:text-indigo-300">Doumipod Premium Monthly</h4>
                  <p className="text-2xl font-bold my-2">$9.99<span className="text-sm font-normal">/month</span></p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> Unlimited AI Tutor access</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> Advanced learning modules</li>
                  </ul>
                  <button onClick={() => handleUpgrade('monthly')} disabled={isUpgrading === 'monthly'} className="w-full mt-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg flex justify-center items-center">
                     {isUpgrading === 'monthly' ? <LoadingSpinner /> : 'Upgrade Now'}
                  </button>
                </Card>
              </div>
            );
        case 'paymentMethods':
            return (
                <div className="px-4">
                    {paymentMethods.map(pm => (
                        <div key={pm.id} className="p-3 mb-2 border rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{pm.type} ending in {pm.last4}</p>
                                <p className="text-sm text-gray-500">Expires {pm.expiry}</p>
                            </div>
                            {pm.isDefault && <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Default</span>}
                        </div>
                    ))}
                    <button onClick={() => setView('addPaymentMethod')} className="w-full mt-4 py-2 border-2 border-dashed rounded-lg text-indigo-500 border-indigo-500">Add Payment Method</button>
                </div>
            );
        case 'addPaymentMethod':
            return (
                 <div className="space-y-4 px-4">
                    <select value={cardType} onChange={e => setCardType(e.target.value as any)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
                        <option>Visa</option>
                        <option>Mastercard</option>
                    </select>
                    <input type="text" value={last4} onChange={e => setLast4(e.target.value.replace(/\D/g, '').slice(0,4))} maxLength={4} placeholder="Last 4 Digits" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                    <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YYYY" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                    <button onClick={handleAddPaymentMethod} className="w-full py-2 bg-indigo-600 text-white rounded-lg">Save Card</button>
                 </div>
            );
        case 'billingHistory':
            return billingHistory.length > 0 ? (
                <div className="space-y-3 px-4">
                    {billingHistory.map(record => (
                        <Card key={record.id}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{record.description}</p>
                                    <p className="text-sm text-gray-500">{record.date}</p>
                                </div>
                                <div className="text-right">
                                     <p className="font-semibold">${record.amount.toFixed(2)}</p>
                                     <p className={`text-xs font-bold ${record.status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{record.status.toUpperCase()}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 px-4">No billing history available.</p>;
        case 'redeemCode':
            return (
                <div className="space-y-4 px-4">
                    <input type="text" value={redeemCodeInput} onChange={e => setRedeemCodeInput(e.target.value)} placeholder="Enter gift code" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                    <button onClick={handleRedeemCode} disabled={isRedeeming} className="w-full py-2 bg-indigo-600 text-white rounded-lg flex justify-center items-center">
                       {isRedeeming ? <LoadingSpinner/> : 'Redeem'}
                    </button>
                </div>
            );
        default: // 'subscription' view
            return (
                <>
                    <div className="px-4">
                        <Card extraClasses="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <p className="font-bold text-lg">{user.isPremium ? `Doumipod Premium ${user.planType}` : 'Doumipod Free'}</p>
                            {user.isPremium && user.premiumExpiresAt ? (
                                <p className="text-sm opacity-90">Your plan is active until {new Date(user.premiumExpiresAt).toLocaleDateString()}.</p>
                            ) : (
                                <p className="text-sm opacity-90">Access basic learning features and the community feed.</p>
                            )}
                        </Card>
                    </div>
                    <div className="mt-4">
                        <SettingsRow icon={<StarIcon />} label="Upgrade or Change Plan" onClick={() => setView('choosePlan')} />
                        <SettingsRow icon={<CreditCardIcon />} label="Payment Methods" onClick={() => setView('paymentMethods')} />
                        <SettingsRow icon={<DocumentDuplicateIcon />} label="Billing History" onClick={() => setView('billingHistory')} />
                        <SettingsRow icon={<CheckCircleIcon />} label="Redeem a Code" onClick={() => setView('redeemCode')} />
                    </div>
                </>
            );
    }
};