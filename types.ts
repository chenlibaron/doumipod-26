interface NotificationChannel {
    push: boolean;
    email: boolean;
}

export interface VisibilitySettings {
    profileVisibility: 'public' | 'users' | 'private';
    showLearningActivity: boolean;
    showQuizScores: boolean;
    searchableByEmail: boolean;
}

export interface NotificationSettings {
    pauseAll: boolean;
    dailyReminders: NotificationChannel;
    newModuleRecommendations: NotificationChannel;
    quizResults: NotificationChannel;
    streakReminders: NotificationChannel;
    announcements: NotificationChannel;
}

export interface User {
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  isPremium: boolean;
  isSuspended?: boolean;
  premiumSince?: number | null;
  planType?: 'free' | 'monthly' | 'yearly' | 'custom';
  premiumExpiresAt?: number | null;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'none' | 'app' | 'sms' | 'email';
  twoFactorSecret?: string;
  backupCodes: string[];
  phone?: string;
  country?: string;
  city?: string;
  visibilitySettings?: VisibilitySettings;
  notificationSettings?: NotificationSettings;
}

export interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    timestamp: number;
}

export interface GiftCode {
    code: string;
    planType: 'monthly' | 'yearly' | 'custom';
    durationDays: number;
    status: 'available' | 'redeemed' | 'expired';
    generatedAt: number;
    redeemedBy?: string;
    expiresAt?: number;
}

export interface PaymentMethod {
    id: number;
    type: 'Visa' | 'Mastercard';
    last4: string;
    expiry: string;
    isDefault: boolean;
}

export interface BillingRecord {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: 'Paid' | 'Failed';
}

export interface EditorPost {
  id: number;
  title: string;
  content: string;
  author: User;
  timestamp: number;
  images?: string[];
  video?: string;
  views: number;
}

export interface ShortVideo {
  id: number;
  thumbnail: string;
  title: string;
  views: string;
  videoUrl: string;
}

export interface ExplanationCard {
  ko: string;
  en: string;
  hint: string;
}

export interface SubtitleCue {
  start: number;
  end: number;
  ko: string;
  en: string;
}

export interface LongVideo {
  id: number;
  thumbnail: string;
  title: string;
  caption: string;
  videoUrl: string;
  explanations: ExplanationCard[];
  subtitles?: SubtitleCue[];
}

export interface LoginActivity {
    id: number;
    device: string;
    location: string;
    timestamp: number;
    isCurrent: boolean;
}

export type MockUsersData = { [key: string]: Partial<User> };


export interface AITutorMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface TOPIKQuestion {
  passage_korean: string | null;
  passage_english: string | null;
  question: string;
  options: { [key: string]: string };
  answer: string;
  explanation: string;
}

export interface LearningPathStep {
    type: 'grammar' | 'vocabulary' | 'dialogue' | 'article' | 'reading_practice' | 'hangul_vowel' | 'hangul_consonant' | 'hangul_batchim' | 'pronunciation_rule';
    topic: string;
    title: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    content?: any;
}

export interface LearningModule {
    module_title: string;
    module_description: string;
    steps: LearningPathStep[];
}

export type LearningPathData = {
    Beginner: LearningModule[];
    Intermediate: LearningModule[];
    Advanced: LearningModule[];
};

export interface GrammarExplanation {
  title: string;
  explanation_korean: string;
  explanation_english: string;
  explanation_burmese: string;
  construction_rules_english: string;
  construction_rules_burmese: string;
  usage_notes_english: string;
  usage_notes_burmese: string;
  common_mistakes_english: string;
  common_mistakes_burmese: string;
  politeness_level_english: string;
  politeness_level_burmese: string;
  example_sentences: { korean: string; english: string; burmese: string }[];
}

export interface VocabularyWord {
  hangul: string;
  english: string;
  burmese: string;
  example_korean: string;
  example_english: string;
  example_burmese: string;
}

export interface DialogueLine {
    speaker: string;
    korean: string;
    english: string;
    burmese: string;
}

export interface DialogueScript {
    title: string;
    speakers: {name: string, voice: string}[];
    dialogue: DialogueLine[];
}

export interface ReadingContent {
  title: string;
  korean_article: string;
  english_translation: string;
  burmese_translation: string;
  key_vocabulary: { hangul: string; english: string; burmese: string }[];
}

export interface HangulLesson {
    title: string;
    explanation: string;
    explanation_burmese: string;
    characters: {
        hangul: string;
        name: string;
        sound: string;
        example_word_korean: string;
        example_word_english: string;
    }[];
}

export interface PronunciationRule {
    title: string;
    rule_description: string;
    rule_description_burmese: string;
    explanation: string;
    explanation_burmese: string;
    examples: {
        korean: string;
        pronunciation: string;
        english: string;
    }[];
}

export interface ProverbFlashcard {
  proverb_korean: string;
  proverb_english_literal: string;
  explanation_english: string;
  explanation_burmese: string;
  dialogue: DialogueLine[];
  usage_notes: string;
  usage_notes_burmese: string;
  vocabulary: { hangul: string; english: string; burmese: string }[];
  image_prompt: string;
}

export interface IdiomFlashcard {
  idiom_korean: string;
  idiom_english_literal: string;
  explanation_english: string;
  explanation_burmese: string;
  dialogue: DialogueLine[];
  usage_notes: string;
  usage_notes_burmese: string;
  vocabulary: { hangul: string; english: string; burmese: string }[];
  image_prompt: string;
}

export interface DictionaryEntry {
    hangul: string;
    korean_pronunciation: string;
    pronunciation: string;
    part_of_speech: string;
    definition_english: string;
    definition_burmese: string;
    example_sentences: { korean: string; english: string; burmese: string }[];
    conjugation?: any;
}

export interface ExpressionExplanation {
  expression_korean: string;
  explanation_english: string;
  explanation_burmese: string;
  example_sentences: { korean: string; english: string; burmese: string }[];
  image_prompt: string;
}

export interface ExpressionCategory {
    name: string;
    expressions: {
        korean: string;
        description: string;
    }[];
}

export type AudioPlaybackStyle = 'none' | 'line-by-line' | 'full-dialogue';

export interface Spot {
    spot_name: string;
    category: string;
    short_reason: string;
    vibe_tag: string;
    emoji?: string;
}

export interface ExploreCategory {
    id: string;
    title: string;
    short_label: string;
    icon: string;
}

export interface ExploreContent {
    title: string;
    paragraphs: {
        korean: string;
        english: string;
        burmese: string;
    }[];
}

export interface QuizCard {
    id: string;
    type: string;
    topic: string;
    caption: string;
    question: string;
    choices: { [key: string]: string };
    correct: string;
    difficulty: string;
    focus: {
        vocabulary: string[];
        grammar: string[];
    };
}

export interface SubwayLine {
    line_number: number;
    line_name: string;
    color: string;
    stops: string[];
}

export interface SubwayStop {
    id: string;
    name: string;
    status: 'new' | 'current' | 'completed';
}

export interface Broadcast {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'critical';
  timestamp: number;
}