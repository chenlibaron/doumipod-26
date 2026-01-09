import React, { useState, FC, ChangeEvent, FormEvent } from 'react';
import { User } from '../types';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon, ArrowRightIcon } from './icons/Icons';

interface SignUpProps {
    onSignUpComplete: (user: User) => void;
    onSwitchToLogin: () => void;
    initialData?: Partial<User> & { email?: string };
}

const ProgressBar: FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => {
    const progress = (step / totalSteps) * 100;
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-6">
            <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

const SignUp: FC<SignUpProps> = ({ onSignUpComplete, onSwitchToLogin, initialData }) => {
    const [view, setView] = useState<'form' | 'otp'>('form');
    const [otp, setOtp] = useState('');
    const [verificationMethod, setVerificationMethod] = useState<'sms' | 'email'>('sms');
    const [step, setStep] = useState(initialData?.name ? 2 : 1);
    const [formData, setFormData] = useState<Partial<User> & { phone?: string; region?: string; city?: string; language?: string, password?: string; email?: string }>({
        name: '',
        username: '',
        avatar: initialData?.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
        bio: 'New to Doumipod! Ready to learn Korean.',
        phone: '',
        region: '',
        city: '',
        language: 'English',
        password: '',
        email: initialData?.email || '',
        ...initialData,
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const isSocialSignUp = !!initialData?.name;
    const totalSteps = isSocialSignUp ? 4 : 5;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = () => {
        if (!formData.name || !formData.username) {
            alert("Something went wrong, name or username is missing.");
            return;
        }
        console.log("Proceeding to OTP verification. Use code: 123456");
        setView('otp');
    };

    const handleVerifyAndLogin = () => {
        const MOCK_OTP = '123456';
        if (otp === MOCK_OTP) {
            onSignUpComplete({
                ...formData,
                isPremium: false,
                twoFactorEnabled: false,
                twoFactorMethod: 'none',
                backupCodes: [],
            } as User);
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };
    
    const renderStep = () => {
        const inputClass = "w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500";

        switch (step) {
            case 1: // Account Creation (Email only)
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Create Your Account</h2>
                        <div>
                            <label htmlFor="name">Full Name</label>
                            <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} className={inputClass} placeholder="e.g., Sarah Jones" />
                        </div>
                         <div>
                            <label htmlFor="email">Email Address</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="e.g., sarah@example.com" />
                        </div>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input id="username" name="username" type="text" value={formData.username} onChange={handleInputChange} className={inputClass} placeholder="e.g., @sarah_in_seoul" />
                        </div>
                         <div className="relative">
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} className={inputClass} placeholder="Create a strong password" />
                             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-2 right-3 text-gray-400">
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                );
            case 2: // Phone Number
                 return (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Add Your Phone Number</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">This helps us keep your account secure.</p>
                        <div>
                            <label htmlFor="phone">Phone Number</label>
                            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="+1 (555) 123-4567" />
                        </div>
                    </div>
                 );
            case 3: // Region & City
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Where are you from?</h2>
                         <p className="text-sm text-gray-500 dark:text-gray-400">This helps us connect you with local learners.</p>
                        <div>
                            <label htmlFor="region">Country / Region</label>
                            <input id="region" name="region" type="text" value={formData.region} onChange={handleInputChange} className={inputClass} placeholder="e.g., United States" />
                        </div>
                        <div>
                            <label htmlFor="city">City</label>
                            <input id="city" name="city" type="text" value={formData.city} onChange={handleInputChange} className={inputClass} placeholder="e.g., New York" />
                        </div>
                    </div>
                );
            case 4: // Language
                return (
                     <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Choose your language</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select the primary language for the app interface.</p>
                        <div>
                            <label htmlFor="language">Language</label>
                            <select id="language" name="language" value={formData.language} onChange={handleInputChange} className={inputClass}>
                                <option>English</option>
                                <option>한국어 (Korean)</option>
                                <option>Español (Spanish)</option>
                                <option>Français (French)</option>
                                <option>မြန်မာ (Burmese)</option>
                                <option>中文 (Chinese)</option>
                                <option>日本語 (Japanese)</option>
                            </select>
                        </div>
                    </div>
                );
            case 5: // Review & Finish (only for email signup)
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ready to go, {formData.name}?</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Review your information and complete your sign up.</p>
                        <div className="p-4 bg-gray-100 dark:bg-slate-700/50 rounded-lg space-y-2 text-sm">
                            <p><strong className="text-gray-600 dark:text-gray-300">Name:</strong> {formData.name}</p>
                            <p><strong className="text-gray-600 dark:text-gray-300">Email:</strong> {formData.email}</p>
                            <p><strong className="text-gray-600 dark:text-gray-300">Username:</strong> {formData.username}</p>
                            <p><strong className="text-gray-600 dark:text-gray-300">Phone:</strong> {formData.phone}</p>
                            <p><strong className="text-gray-600 dark:text-gray-300">Location:</strong> {formData.city}, {formData.region}</p>
                             <p><strong className="text-gray-600 dark:text-gray-300">Language:</strong> {formData.language}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const isNextDisabled = () => {
        switch (step) {
            case 1: return !formData.name || !formData.email || !formData.username || !formData.password || formData.password.length < 6;
            case 2: return !formData.phone;
            case 3: return !formData.region || !formData.city;
            case 4: return !formData.language;
            default: return false;
        }
    };
    
    if (view === 'otp') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900">
                <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg animate-fade-in">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Verify Your Account</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Enter the 6-digit code we sent via {verificationMethod === 'sms' ? 'SMS' : 'email'} to {verificationMethod === 'sms' ? formData.phone : formData.email}.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="otp" className="sr-only">Verification Code</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full p-3 text-center text-2xl tracking-[0.5em] border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="------"
                                maxLength={6}
                                autoComplete="one-time-code"
                            />
                        </div>
                        <button onClick={handleVerifyAndLogin} className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                            Verify & Login
                        </button>
                    </div>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Didn't receive it? <button onClick={() => alert('Code resent!')} className="font-medium text-indigo-600 hover:underline">Resend</button> or 
                        <button onClick={() => setVerificationMethod(m => m === 'sms' ? 'email' : 'sms')} className="font-medium text-indigo-600 hover:underline ml-1">
                            Use {verificationMethod === 'sms' ? 'Email' : 'SMS'}
                        </button>
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <ProgressBar step={step} totalSteps={totalSteps} />
                <div className="min-h-[320px]">
                    {renderStep()}
                </div>
                
                <div className="flex justify-between items-center pt-4">
                    <button 
                        onClick={prevStep} 
                        disabled={step === 1 || (isSocialSignUp && step === 2)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                    {step < totalSteps ? (
                        <button 
                            onClick={nextStep} 
                            disabled={isNextDisabled()}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <span>Next</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                            Finish
                        </button>
                    )}
                </div>

                <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    Already have an account?
                    <button onClick={onSwitchToLogin} className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;