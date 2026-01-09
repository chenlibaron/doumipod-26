import React, { useState, useRef, FC, ReactNode, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, FacebookIcon, EyeIcon, EyeSlashIcon } from './icons/Icons';
import SignUp from './SignUp';
import { User } from '../types';

const DoumipodLogo: FC<{ size?: 'xl' | '2xl' | '3xl', className?: string }> = ({ size = 'xl', className = '' }) => {
  const sizeClasses = {
    xl: 'text-3xl',
    '2xl': 'text-4xl',
    '3xl': 'text-4xl',
  };
  const textSize = sizeClasses[size];

  return (
    <div className={`font-black ${className} ${textSize} text-gray-900 dark:text-gray-100`} style={{ fontFamily: "'Auriol', 'Cinzel', serif" }}>
      Doumipod
    </div>
  );
};

const Auth: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [initialSignUpData, setInitialSignUpData] = useState<any | undefined>(undefined);
  
  const [devTapCount, setDevTapCount] = useState(0);
  const [showDevLogin, setShowDevLogin] = useState(false);
  const devTapTimeoutRef = useRef<number | null>(null);

  const [modTapCount, setModTapCount] = useState(0);
  const [showModLogin, setShowModLogin] = useState(false);
  const modTapTimeoutRef = useRef<number | null>(null);

  const [testerTapCount, setTesterTapCount] = useState(0);
  const [showTesterLogin, setShowTesterLogin] = useState(false);
  const testerTapTimeoutRef = useRef<number | null>(null);
  
  // Mock login handler
  const handleSocialLogin = (provider: 'Google' | 'Facebook') => {
    // In a real app, you would get data from the provider. Here we mock it.
    const socialUser: any = {
      name: 'Sarah Jones',
      email: 'sarah.jones.social@example.com',
      avatar: 'https://i.pravatar.cc/150?u=sarahjones',
      bio: 'Learning Korean in the heart of Seoul! 🇰🇷 Follow my journey.'
    };
    console.log(`Starting sign-up process with ${provider}...`);
    setInitialSignUpData(socialUser);
    setView('signup');
  };
  
  const handleEmailLogin = (e: FormEvent) => {
      e.preventDefault();
      // This is a mock login, it bypasses the step-by-step creation for quick access.
      const mockUser: any = {
        name: 'Sarah Jones',
        username: '@sarah_in_seoul',
        avatar: 'https://i.pravatar.cc/150?u=sarahjones',
        bio: 'Learning Korean in the heart of Seoul! 🇰🇷 Follow my journey.',
        isPremium: false,
        twoFactorEnabled: false,
        twoFactorMethod: 'none',
        backupCodes: [],
      };
      console.log('Logging in with Email/Phone...');
      login(mockUser);
  }

  const handleDeveloperLogin = () => {
    const devUser: any = {
        name: 'Doumipod Admin',
        username: '@doumipod_admin',
        avatar: 'https://i.pravatar.cc/150?u=admin',
        bio: 'App Administrator & Content Editor.',
        isPremium: true,
        twoFactorEnabled: false,
        twoFactorMethod: 'none',
        backupCodes: [],
    };
    login(devUser);
  };

  const handleModeratorLogin = () => {
      const modUser: any = {
        name: 'Alex Lee',
        username: '@doumipod_mod',
        avatar: 'https://i.pravatar.cc/150?u=moderator',
        bio: 'Community Moderator & Content Creator. Here to help you learn!',
        isPremium: false,
        twoFactorEnabled: false,
        twoFactorMethod: 'none',
        backupCodes: [],
      };
      login(modUser);
  };
  
  const handleTesterLogin = () => {
    const testerUser: any = {
        name: 'Doumipod Tester',
        username: '@doumipod_tester',
        avatar: 'https://i.pravatar.cc/150?u=tester',
        bio: 'Just a normal user account for testing purposes.',
        isPremium: false,
        twoFactorEnabled: false,
        twoFactorMethod: 'none',
        backupCodes: [],
    };
    login(testerUser);
  };

  const handleTitleTap = () => {
    if (showDevLogin) return;
    if (devTapTimeoutRef.current) clearTimeout(devTapTimeoutRef.current);
    const newCount = devTapCount + 1;
    setDevTapCount(newCount);
    if (newCount >= 7) {
        setShowDevLogin(true);
    } else {
        devTapTimeoutRef.current = window.setTimeout(() => setDevTapCount(0), 2000);
    }
  };

  const handleSubtitleTap = () => {
      if (showModLogin) return;
      if (modTapTimeoutRef.current) clearTimeout(modTapTimeoutRef.current);
      const newCount = modTapCount + 1;
      setModTapCount(newCount);
      if (newCount >= 5) {
          setShowModLogin(true);
      } else {
          modTapTimeoutRef.current = window.setTimeout(() => setModTapCount(0), 2000);
      }
  };

  const handleSeparatorTap = () => {
    if (showTesterLogin) return;
    if (testerTapTimeoutRef.current) clearTimeout(testerTapTimeoutRef.current);
    const newCount = testerTapCount + 1;
    setTesterTapCount(newCount);
    if (newCount >= 9) {
        setShowTesterLogin(true);
    } else {
        testerTapTimeoutRef.current = window.setTimeout(() => setTesterTapCount(0), 2000);
    }
  };

  const SocialButton: FC<{ provider: 'Google' | 'Facebook', icon: ReactNode, text: string }> = ({ provider, icon, text }) => (
      <button 
        onClick={() => handleSocialLogin(provider)}
        className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
      >
        {icon}
        <span className="ml-3 font-medium text-gray-700 dark:text-gray-200">{text}</span>
      </button>
  );

  if (view === 'signup') {
    return <SignUp 
              onSignUpComplete={login} 
              initialData={initialSignUpData} 
              onSwitchToLogin={() => {
                setInitialSignUpData(undefined);
                setView('login');
              }} 
           />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
            <div onClick={handleTitleTap} className="cursor-pointer flex justify-center">
                <DoumipodLogo size="3xl" />
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400 select-none" onClick={handleSubtitleTap}>
                Welcome back!
            </p>
        </div>
        
        <div className="space-y-4">
            <SocialButton provider="Google" icon={<GoogleIcon />} text={'Sign in with Google'} />
            <SocialButton provider="Facebook" icon={<FacebookIcon />} text={'Sign in with Facebook'} />
        </div>

        <div className="flex items-center justify-center space-x-2">
            <span className="h-px w-full bg-gray-200 dark:bg-gray-600"></span>
            <span onClick={handleSeparatorTap} className="text-sm text-gray-400 dark:text-gray-500 select-none cursor-pointer">OR</span>
            <span className="h-px w-full bg-gray-200 dark:bg-gray-600"></span>
        </div>

        <form className="space-y-6" onSubmit={handleEmailLogin}>
           <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">Email or Phone</label>
              <input id="email" name="email" type="text" required className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Email or Phone" />
           </div>
           <div>
              <label htmlFor="password"  className="text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">Password</label>
              <div className="relative">
                <input 
                    id="password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    className="w-full mt-1 p-2 pr-10 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Password" 
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
           </div>
           <button type="submit" className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
             Sign In
           </button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don't have an account?
            <button onClick={() => { setInitialSignUpData(undefined); setView('signup')}} className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign Up
            </button>
        </p>

        {(showDevLogin || showModLogin || showTesterLogin) && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center space-y-2 animate-fade-in">
                {showDevLogin && (
                    <button onClick={handleDeveloperLogin} className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        Login as Developer
                    </button>
                )}
                 {showModLogin && (
                    <button onClick={handleModeratorLogin} className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        Login as Moderator
                    </button>
                )}
                {showTesterLogin && (
                    <button onClick={handleTesterLogin} className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        Login as Tester
                    </button>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default Auth;