import React, { useState, FC } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useUI } from '../../../contexts/UIContext';

export const PersonalDetailsView: FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useUI();

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [country, setCountry] = useState(user?.country || '');
    const [city, setCity] = useState(user?.city || '');
    
    const handleSave = () => {
        updateUser({ name, phone, country, city });
        showToast('Personal details updated!', 'success');
    };
    
    return (
        <div className="space-y-4 px-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">These details are private and will not be displayed on your public profile.</p>
            <div>
                <label className="text-sm font-medium">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
            </div>
            <div>
                <label className="text-sm font-medium">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
            </div>
            <div>
                <label className="text-sm font-medium">Country/Region</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
            </div>
            <div>
                <label className="text-sm font-medium">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
            </div>
             <button onClick={handleSave} className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg mt-4">Save</button>
        </div>
    );
};