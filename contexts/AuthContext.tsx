import React, { createContext, useState, useEffect, useContext, FC, ReactNode } from 'react';
import * as api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loginActivity: any[];
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void;

  // Security functions
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  enableTwoFactorAuthApp: () => Promise<{ secret: string, qrCode: string, backupCodes: string[] } | null>;
  verifyTwoFactorAuthApp: (token: string) => Promise<boolean>;
  sendVerificationCode: (method: 'sms' | 'email') => Promise<boolean>;
  verifyOtpCode: (method: 'sms' | 'email', code: string) => Promise<boolean>;
  disableTwoFactorAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginActivity, setLoginActivity] = useState<any[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('doumipod-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        const activity = await api.getLoginActivity();
        setLoginActivity(activity);
      }
    };
    loadUser();
  }, []);

  const login = async (userData: User) => {
    localStorage.setItem('doumipod-user', JSON.stringify(userData));
    setUser(userData);
    const activity = await api.getLoginActivity();
    setLoginActivity(activity);
  };

  const logout = () => {
    localStorage.removeItem('doumipod-user');
    setUser(null);
    setLoginActivity([]);
  };

  const updateUser = (updatedUserData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUserData };
      localStorage.setItem('doumipod-user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };
  
  // Security functions
  const changePassword = async (current: string, newPass: string): Promise<boolean> => {
      try {
          await api.changePassword(current, newPass);
          return true;
      } catch (e) {
          console.error(e);
          return false;
      }
  };

  const enableTwoFactorAuthApp = async () => {
      if (!user) return null;
      try {
          return await api.enableTwoFactorAuthApp(user.username);
      } catch (e) {
          console.error(e);
          return null;
      }
  };
  
  const verifyTwoFactorAuthApp = async (token: string): Promise<boolean> => {
      if (!user) return false;
      try {
          const updatedUser = await api.verifyTwoFactorAuthApp(user.username, token);
          updateUser(updatedUser);
          return true;
      } catch (e) {
          console.error(e);
          return false;
      }
  };
  
  const sendVerificationCode = async (method: 'sms' | 'email'): Promise<boolean> => {
      const destination = method === 'sms' ? user?.phone : user?.username; // Assuming email is username
      if (!destination) return false;
      try {
          await api.sendVerificationCode(method, destination);
          return true;
      } catch (e) {
          console.error(e);
          return false;
      }
  };
  
  const verifyOtpCode = async (method: 'sms' | 'email', code: string): Promise<boolean> => {
      const destination = method === 'sms' ? user?.phone : user?.username;
      if (!destination || !user) return false;
      try {
          const updatedUser = await api.verifyOtpCode(method, destination, code, user.username);
          updateUser(updatedUser);
          return true;
      } catch(e) {
          console.error(e);
          return false;
      }
  };
  
  const disableTwoFactorAuth = async (): Promise<boolean> => {
      if (!user) return false;
      try {
          const updatedUser = await api.disableTwoFactorAuth(user.username);
          updateUser(updatedUser);
          return true;
      } catch (e) {
          console.error(e);
          return false;
      }
  };


  return (
    <AuthContext.Provider value={{ 
        user, loginActivity, login, logout, updateUser,
        changePassword, enableTwoFactorAuthApp, verifyTwoFactorAuthApp,
        sendVerificationCode, verifyOtpCode, disableTwoFactorAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};