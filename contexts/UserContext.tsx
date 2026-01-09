import React, { createContext, useState, useContext, useEffect, useMemo, FC, ReactNode } from 'react';
import * as api from '../services/api';
import { User } from '../types';

interface UserContextType {
    users: User[];
    usersByUsername: Record<string, User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            const userList = await api.getUsers();
            setUsers(userList);
        };
        fetchUsers();
    }, []);

    const usersByUsername = useMemo(() => {
        return users.reduce((acc, user) => {
            acc[user.username] = user;
            return acc;
        }, {} as Record<string, User>);
    }, [users]);

    const value = {
        users,
        usersByUsername,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};