import { User, EditorPost, Announcement, Banner, GiftCode, BillingRecord, LoginActivity, MockUsersData } from '../types';
import { mockUsersData, mockEditorPostsData, mockAnnouncementsData, mockBannersData, mockGiftCodesData, mockBillingHistoryData, mockLoginActivity } from '../data/mockData';
export * from './geminiService'; // Re-export all Gemini functions

const USERS_KEY = 'doumipod-users';
const EDITOR_POSTS_KEY = 'doumipod-editor-posts';
const ANNOUNCEMENTS_KEY = 'doumipod-announcements';
const BANNERS_KEY = 'doumipod-banners';
const GIFT_CODES_KEY = 'doumipod-gift-codes';
const BILLING_HISTORY_KEY = 'doumipod-billing-history';
const LOGIN_ACTIVITY_KEY = 'doumipod-login-activity';


// Helper to get data from localStorage or initialize with mock data
const getData = (key: string, mockData: any) => {
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            return JSON.parse(saved);
        }
        localStorage.setItem(key, JSON.stringify(mockData));
        return mockData;
    } catch (e) {
        console.error(`Failed to get or set ${key} in localStorage`, e);
        return mockData;
    }
};

// Helper to set data to localStorage
const setData = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Failed to set ${key} in localStorage`, e);
    }
};

// --- API Functions ---
export const getUsers = async (): Promise<User[]> => getData(USERS_KEY, Object.values(mockUsersData));
export const getGiftCodes = async (): Promise<GiftCode[]> => getData(GIFT_CODES_KEY, mockGiftCodesData);
export const getBillingHistory = async (): Promise<BillingRecord[]> => getData(BILLING_HISTORY_KEY, mockBillingHistoryData);
export const getLoginActivity = async (): Promise<LoginActivity[]> => getData(LOGIN_ACTIVITY_KEY, mockLoginActivity);


// --- Editor and Admin API Functions ---

export const getEditorPosts = async (): Promise<EditorPost[]> => getData(EDITOR_POSTS_KEY, mockEditorPostsData);
export const getAnnouncements = async (): Promise<Announcement[]> => getData(ANNOUNCEMENTS_KEY, mockAnnouncementsData);
export const getBanners = async (): Promise<Banner[]> => getData(BANNERS_KEY, mockBannersData);

export const addAnnouncement = async (data: Omit<Announcement, 'id' | 'timestamp'>): Promise<Announcement> => {
    const newAnnouncement: Announcement = { ...data, id: Date.now(), timestamp: Date.now() };
    const announcements = await getAnnouncements();
    setData(ANNOUNCEMENTS_KEY, [newAnnouncement, ...announcements]);
    return newAnnouncement;
};

export const updateAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
    const announcements = await getAnnouncements();
    const newAnnouncements = announcements.map(a => a.id === announcement.id ? announcement : a);
    setData(ANNOUNCEMENTS_KEY, newAnnouncements);
    return announcement;
};

export const deleteAnnouncement = async (announcementId: number): Promise<void> => {
    const announcements = await getAnnouncements();
    setData(ANNOUNCEMENTS_KEY, announcements.filter(a => a.id !== announcementId));
};

export const addBanner = async (data: Omit<Banner, 'id'>): Promise<Banner> => {
    const newBanner: Banner = { ...data, id: Date.now() };
    const banners = await getBanners();
    setData(BANNERS_KEY, [newBanner, ...banners]);
    return newBanner;
};

export const deleteBanner = async (bannerId: number): Promise<void> => {
    const banners = await getBanners();
    setData(BANNERS_KEY, banners.filter(b => b.id !== bannerId));
};

// --- Premium & Gift Code API Functions ---
export const redeemGiftCode = async (code: string, currentUser: User): Promise<User> => {
    const codes = await getGiftCodes();
    const users = await getUsers();
    
    const giftCode = codes.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!giftCode) throw new Error("Gift code not found.");
    if (giftCode.status !== 'available') throw new Error("This gift code has already been redeemed.");
    if (giftCode.expiresAt && giftCode.expiresAt < Date.now()) {
        giftCode.status = 'expired';
        setData(GIFT_CODES_KEY, codes);
        throw new Error("This gift code has expired.");
    }

    const now = Date.now();
    const currentExpiry = (currentUser as any).premiumExpiresAt && (currentUser as any).premiumExpiresAt > now ? (currentUser as any).premiumExpiresAt : now;
    const newExpiry = currentExpiry + giftCode.durationDays * 24 * 60 * 60 * 1000;

    const updatedUser = { 
        ...currentUser, 
        isPremium: true, 
        premiumSince: currentUser.premiumSince || now,
        premiumExpiresAt: newExpiry,
        planType: giftCode.planType === 'custom' ? currentUser.planType : giftCode.planType,
    };
    
    const newUsers = users.map(u => u.username === currentUser.username ? updatedUser : u);
    setData(USERS_KEY, newUsers);

    giftCode.status = 'redeemed';
    giftCode.redeemedBy = currentUser.username;
    setData(GIFT_CODES_KEY, codes);

    return updatedUser as User;
};

export const upgradeToPremium = async (planType: 'monthly' | 'yearly', currentUser: User): Promise<User> => {
    const users = await getUsers();
    const durationDays = planType === 'monthly' ? 30 : 365;
    
    const now = Date.now();
    const currentExpiry = (currentUser as any).premiumExpiresAt && (currentUser as any).premiumExpiresAt > now ? (currentUser as any).premiumExpiresAt : now;
    const newExpiry = currentExpiry + durationDays * 24 * 60 * 60 * 1000;
    
     const updatedUser = { 
        ...currentUser, 
        isPremium: true, 
        premiumSince: currentUser.premiumSince || now,
        premiumExpiresAt: newExpiry,
        planType: planType,
    };
    
    const newUsers = users.map(u => u.username === currentUser.username ? updatedUser : u);
    setData(USERS_KEY, newUsers);
    
    return updatedUser as User;
};

// --- Password & Security API Functions ---

// In-memory mock for OTPs and secrets
const twoFactorSecrets: Record<string, any> = {};
const activeOTPs: Record<string, string> = {};

// Mock function to generate a 2FA secret and QR code URL
const generateSecret = () => {
    const secret = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('').sort(() => 0.5 - Math.random()).join('').substring(0, 16);
    const issuer = encodeURIComponent('Doumipod App');
    const account = encodeURIComponent('user@doumipod.com');
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}`;
    return { secret, qrCode };
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // In a real backend, you'd validate the currentPassword against the user's hash.
    console.log("Attempting to change password...");
    if (newPassword.length < 6) throw new Error("New password must be at least 6 characters long.");
    // Simulate success
    return true;
};

export const enableTwoFactorAuthApp = async (username: string): Promise<{ secret: string, qrCode: string, backupCodes: string[] }> => {
    const { secret, qrCode } = generateSecret();
    const backupCodes = Array.from({ length: 5 }, () => Math.random().toString(36).substring(2, 8).toUpperCase());
    
    twoFactorSecrets[username] = { secret, qrCode };
    
    const users = await getUsers();
    const newUsers = users.map(u => u.username === username ? { ...u, twoFactorSecret: secret, backupCodes } : u);
    setData(USERS_KEY, newUsers);

    return { secret, qrCode, backupCodes };
};

export const verifyTwoFactorAuthApp = async (username: string, token: string): Promise<User> => {
    // In a real backend, you'd use a library like 'otplib' to verify the token against the secret.
    const MOCK_VALID_TOKEN = "123456";
    if (token !== MOCK_VALID_TOKEN) throw new Error("Invalid authenticator code.");

    const users = await getUsers();
    let updatedUser: User | undefined;
    const newUsers = users.map(u => {
        if (u.username === username) {
            updatedUser = { ...u, twoFactorEnabled: true, twoFactorMethod: 'app' };
            return updatedUser;
        }
        return u;
    });

    setData(USERS_KEY, newUsers);
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
};

export const sendVerificationCode = async (method: 'sms' | 'email', destination: string): Promise<void> => {
    // Simulate sending an OTP
    const MOCK_OTP = "123456";
    activeOTPs[destination] = MOCK_OTP;
    console.log(`Sending OTP ${MOCK_OTP} to ${destination} via ${method}`);
    // Simulate a delay
    await new Promise(res => setTimeout(res, 1000));
};

export const verifyOtpCode = async (method: 'sms' | 'email', destination: string, code: string, username: string): Promise<User> => {
    if (activeOTPs[destination] !== code) {
        throw new Error("Invalid verification code.");
    }
    delete activeOTPs[destination];

    const users = await getUsers();
    let updatedUser: User | undefined;
    const newUsers = users.map(u => {
        if (u.username === username) {
            updatedUser = { ...u, twoFactorEnabled: true, twoFactorMethod: method };
            return updatedUser;
        }
        return u;
    });

    setData(USERS_KEY, newUsers);
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
};

export const disableTwoFactorAuth = async (username: string): Promise<User> => {
    const users = await getUsers();
    let updatedUser: User | undefined;
    const newUsers = users.map(u => {
        if (u.username === username) {
            updatedUser = { ...u, twoFactorEnabled: false, twoFactorMethod: 'none', twoFactorSecret: undefined, backupCodes: [] };
            return updatedUser;
        }
        return u;
    });
    setData(USERS_KEY, newUsers);
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
};

export const exportUserData = async (user: User): Promise<void> => {
    const dataToExport = {
        profile: {
            name: user.name,
            username: user.username,
            bio: user.bio,
            isPremium: user.isPremium,
        },
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doumipod_export_${user.username}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};