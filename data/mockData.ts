import { User, Banner, Announcement, GiftCode, PaymentMethod, EditorPost, ShortVideo, LongVideo, ExplanationCard, VisibilitySettings, NotificationSettings, BillingRecord, LoginActivity, SubtitleCue, MockUsersData } from '../types';

const defaultVisibilitySettings: VisibilitySettings = {
    profileVisibility: 'users',
    showLearningActivity: true,
    showQuizScores: true,
    searchableByEmail: true,
};

const defaultNotificationSettings: NotificationSettings = {
    pauseAll: false,
    dailyReminders: { push: true, email: false },
    newModuleRecommendations: { push: true, email: true },
    quizResults: { push: true, email: false },
    streakReminders: { push: true, email: false },
    announcements: { push: true, email: true },
};

const adminUser: User = {
    name: 'Doumipod Admin',
    username: '@doumipod_admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    bio: 'App Administrator & Content Editor.',
    isPremium: true,
    isSuspended: false,
    premiumSince: Date.now() - 86400000 * 30,
    planType: 'yearly',
    premiumExpiresAt: Date.now() + 86400000 * 335,
    visibilitySettings: defaultVisibilitySettings,
    notificationSettings: defaultNotificationSettings,
    twoFactorEnabled: false,
    twoFactorMethod: 'none',
    backupCodes: [],
};


// Mock Data
export const mockUsersData: MockUsersData = {
    admin: adminUser,
    moderator: { name: 'Alex Lee', username: '@doumipod_mod', avatar: 'https://i.pravatar.cc/150?u=moderator', bio: 'Community Moderator & Content Creator. Here to help you learn!', isPremium: false, isSuspended: false, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
    tester: { name: 'Doumipod Tester', username: '@doumipod_tester', avatar: 'https://i.pravatar.cc/150?u=tester', bio: 'Just a normal user account for testing purposes.', isPremium: false, isSuspended: false, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
    minjun: { name: 'Min-jun Kim', username: '@minjun', avatar: 'https://i.pravatar.cc/150?u=minjun', bio: 'Seoul native. Tech enthusiast and language exchange partner.', isPremium: false, isSuspended: false, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
    seoyeon: { name: 'Seo-yeon Lee', username: '@seoyeon', avatar: 'https://i.pravatar.cc/150?u=seoyeon', bio: 'Future translator. Dreaming in Korean and English.', isPremium: false, isSuspended: false, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
    jihoon: { name: 'Ji-hoon Park', username: '@jihoon', avatar: 'https://i.pravatar.cc/150?u=jihoon', bio: 'Just here for the K-Dramas and the food.', isPremium: false, isSuspended: true, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
    sarah: { name: 'Sarah Jones', username: '@sarah_in_seoul', avatar: 'https://i.pravatar.cc/150?u=sarahjones', bio: 'Learning Korean in the heart of Seoul! 🇰🇷 Follow my journey.', isPremium: false, isSuspended: false, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
    chris: { name: 'Chris Evans', username: '@chrisevans', avatar: 'https://i.pravatar.cc/150?u=chrisevans', isPremium: false, isSuspended: false, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
    hyejin: { name: 'Hye-jin Choi', username: '@hyejin', avatar: 'https://i.pravatar.cc/150?u=hyejin', isPremium: false, isSuspended: false, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
    david: { name: 'David Kim', username: '@davidkim', avatar: 'https://i.pravatar.cc/150?u=davidkim', isPremium: false, isSuspended: false, premiumSince: null, planType: 'free', visibilitySettings: defaultVisibilitySettings, notificationSettings: defaultNotificationSettings, twoFactorEnabled: false, twoFactorMethod: 'none', backupCodes: [] },
};

export const mockBannersData: Banner[] = [
    { id: 1, imageUrl: 'https://picsum.photos/400/200?random=banner1', linkUrl: '#' },
    { id: 2, imageUrl: 'https://picsum.photos/400/200?random=banner2', linkUrl: '#' },
];

export const mockAnnouncementsData: Announcement[] = [
    {
        id: 1,
        title: "Server Maintenance Scheduled",
        content: "Please be aware that Doumipod will be undergoing scheduled maintenance this Sunday from 2 AM to 3 AM KST. The app may be temporarily unavailable during this time.",
        timestamp: Date.now() - 86400000,
    },
    {
        id: 2,
        title: "Community Guidelines Update",
        content: "We've updated our community guidelines to ensure Doumipod remains a safe and positive space for all learners. Please take a moment to review them on our website.",
        timestamp: Date.now() - 86400000 * 4,
    }
];

export const mockGiftCodesData: GiftCode[] = [
    { code: 'MONTHLY24', planType: 'monthly', durationDays: 30, status: 'available', generatedAt: Date.now() - 86400000 * 2 },
    { code: 'YEARLYGIFT', planType: 'yearly', durationDays: 365, status: 'available', generatedAt: Date.now() - 86400000 * 10 },
    { code: 'USEDCODE', planType: 'monthly', durationDays: 30, status: 'redeemed', redeemedBy: '@jihoon', generatedAt: Date.now() - 86400000 * 5 },
    { code: 'EXPIRED', planType: 'custom', durationDays: 7, status: 'expired', generatedAt: Date.now() - 86400000 * 40, expiresAt: Date.now() - 86400000 * 10 }
];

export const mockPaymentMethodsData: PaymentMethod[] = [
    { id: 1, type: 'Visa', last4: '1234', expiry: '12/2025', isDefault: true }
];

export const mockBillingHistoryData: BillingRecord[] = [
    { id: 1, date: '2023-10-01', description: 'Doumipod Premium (Yearly)', amount: 99.99, status: 'Paid' },
    { id: 2, date: '2022-10-01', description: 'Doumipod Premium (Yearly)', amount: 99.99, status: 'Paid' },
];

export const mockEditorPostsData: EditorPost[] = [
    {
        id: 1,
        title: "Tip of the Week: Mastering Korean Particles",
        content: "Particles (조사) are tricky but essential! This week, focus on the difference between 은/는 and 이/가. Remember, 은/는 is for topic marking (contrast/emphasis), while 이/가 is for subject marking. Try making 5 sentences with each! Practice is key to mastering these, and you'll find your Korean sounding much more natural once you get the hang of them. Don't be afraid to make mistakes; that's how we learn best. 화이팅!",
        author: adminUser,
        timestamp: Date.now() - 86400000 * 2,
        images: ['https://picsum.photos/800/400?random=20'],
        views: 4500,
    },
    {
        id: 2,
        title: "New Dialogue Feature is Live!",
        content: "Practice real-life conversations with our new AI-powered dialogue feature. Find it in the 'Learn' tab. We'd love to hear your feedback!",
        author: adminUser,
        timestamp: Date.now() - 86400000 * 5,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
        views: 12300,
    }
];

export const mockShortVideosData: ShortVideo[] = [
    { id: 201, thumbnail: "https://picsum.photos/seed/short1/270/480", title: "When telling a secret", views: "12K", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
    { id: 202, thumbnail: "https://picsum.photos/seed/short2/270/480", title: "Beat the Translator", views: "17K", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
    { id: 203, thumbnail: "https://picsum.photos/seed/short3/270/480", title: "Funny Reaction", views: "8.1K", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
    { id: 204, thumbnail: "https://picsum.photos/seed/short4/270/480", title: "Useful Expression", views: "15K", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: 205, thumbnail: "https://picsum.photos/seed/short5/270/480", title: "BTS Moment", views: "22K", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    { id: 206, thumbnail: "https://picsum.photos/seed/short6/270/480", title: "Korean Slang", views: "9K", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
];

export const explanationCardsData: ExplanationCard[] = [
    { ko: "이 형 또 시처럼 썼어요.", en: "He basically wrote a poem again.", hint: "시처럼 = like a poem" },
    { ko: "이거 비밀인데...", en: "This is a secret...", hint: "비밀 = secret" },
    { ko: "귀엽다!", en: "Cute!", hint: "귀엽다 = cute" },
    { ko: "정말 대박이야.", en: "It’s really amazing.", hint: "대박 = awesome" },
    { ko: "조금 어려웠어요.", en: "It was a little difficult.", hint: "조금 = a little" },
    { ko: "한 번 더 해주세요.", en: "Please do it again.", hint: "한 번 더 = once more" },
    { ko: "완벽해요!", en: "Perfect!", hint: "완벽 = perfect" },
    { ko: "좋은 아이디어예요.", en: "It’s a good idea.", hint: "아이디어 = idea" },
    { ko: "다음에 또 봐요.", en: "See you next time.", hint: "다음 = next" }
];

const mockSubtitles: SubtitleCue[] = [
  { start: 1, end: 4, ko: "안녕하세요, 여러분!", en: "Hello, everyone!" },
  { start: 5, end: 8, ko: "오늘 한국어를 배워볼까요?", en: "Shall we learn Korean today?" },
  { start: 9, end: 12, ko: "이 표현은 정말 유용해요.", en: "This expression is really useful." },
  { start: 13, end: 16, ko: "따라 해보세요.", en: "Try repeating after me." },
  { start: 18, end: 22, ko: "참 잘했어요!", en: "Great job!" },
  { start: 23, end: 26, ko: "다음 시간에 또 만나요.", en: "See you next time." },
];

export const mockLongVideosData: LongVideo[] = [
    { id: 301, thumbnail: "https://picsum.photos/seed/long1/640/360", title: "What is ARMY to me?", caption: "K-pop vocabulary episode", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", explanations: explanationCardsData.slice(0, 3), subtitles: mockSubtitles },
    { id: 302, thumbnail: "https://picsum.photos/seed/long2/640/360", title: "Korean Culture Tips", caption: "Etiquette sharing", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4", explanations: explanationCardsData.slice(3, 6) },
    { id: 303, thumbnail: "https://picsum.photos/seed/long3/640/360", title: "Korean Cafe Dialogues", caption: "Basic phrase practice", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", explanations: explanationCardsData.slice(6, 9) },
    { id: 304, thumbnail: "https://picsum.photos/seed/long4/640/360", title: "BTS Poem Reading", caption: "Fun poetic content", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4", explanations: explanationCardsData },
    { id: 305, thumbnail: "https://picsum.photos/seed/long5/640/360", title: "Pronunciation Battle", caption: "Practice fun sounds", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", explanations: explanationCardsData.slice(2, 7) },
    { id: 306, thumbnail: "https://picsum.photos/seed/long6/640/360", title: "Hidden Korean Expressions", caption: "Advanced phrases", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", explanations: explanationCardsData.slice(1, 5) },
];

export const mockLoginActivity: LoginActivity[] = [
    { id: 1, device: 'iPhone 14 Pro', location: 'Seoul, South Korea', timestamp: Date.now(), isCurrent: true },
    { id: 2, device: 'Windows Desktop', location: 'Busan, South Korea', timestamp: Date.now() - 7200000, isCurrent: false },
    { id: 3, device: 'Android Tablet', location: 'New York, USA', timestamp: Date.now() - 86400000 * 3, isCurrent: false },
];