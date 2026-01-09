import React, { SVGProps, ReactNode, FC } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const createIcon = (path: ReactNode): FC<IconProps> => {
    const IconComponent: FC<IconProps> = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
            {path}
        </svg>
    );
    IconComponent.displayName = 'Icon';
    return IconComponent;
};

// Based on heroicons v2
export const HomeIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6" {...props}>
        <path fill="currentColor" d="M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272h16v176c0 35.3 28.7 64 64 64h288c35.3 0 64-28.7 64-64V272h16c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1zM240 320h32c26.5 0 48 21.5 48 48v96H192v-96c0-26.5 21.5-48 48-48"/>
    </svg>
);
export const BookOpenIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.583 7.238c3.007.53 4.799 1.639 5.417 2.276c.618-.637 2.41-1.746 5.418-2.276c1.523-.269 2.285-.403 2.933.112C21 7.864 21 8.7 21 10.372v6.007c0 1.529 0 2.293-.416 2.77c-.417.477-1.333.639-3.166.962c-1.635.288-2.91.747-3.833 1.208c-.909.454-1.363.681-1.585.681s-.677-.227-1.585-.68c-.923-.462-2.198-.921-3.832-1.21c-1.834-.322-2.75-.484-3.167-.961S3 17.908 3 16.379v-6.007C3 8.7 3 7.864 3.649 7.35c.648-.515 1.41-.38 2.933-.112M12 9v13M8.5 3.059a6.29 6.29 0 0 1 7 .01M13.622 5.5a3.14 3.14 0 0 0-3.244-.01" />
    </svg>
);
export const UserCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />);
export const PlusCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const PlusIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />);
export const MagnifyingGlassIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />);
export const BellIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
            <path d="M5.158 11.491c-.073 1.396.011 2.882-1.236 3.817A2.3 2.3 0 0 0 3 17.153C3 18.15 3.782 19 4.8 19h14.4c1.018 0 1.8-.85 1.8-1.847c0-.726-.342-1.41-.922-1.845c-1.247-.935-1.163-2.421-1.236-3.817a6.851 6.851 0 0 0-13.684 0"/>
            <path d="M10.5 3.125C10.5 3.953 11.172 5 12 5s1.5-1.047 1.5-1.875S12.828 2 12 2s-1.5.297-1.5 1.125M15 19a3 3 0 1 1-6 0"/>
        </g>
    </svg>
);
export const ArrowLeftIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />);
export const ChatBubbleOvalLeftEllipsisIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" {...props}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h8m-8 4h6m-1 7l-1 1l-3-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v5.5M19 16l-2 3h4l-2 3" />
    </svg>
);
export const SpeakerWaveIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />);
export const SpeakerXMarkIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />);
export const CheckCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const GoogleIcon: FC<IconProps> = (props) => ( <svg viewBox="0 0 48 48" className="h-6 w-6" {...props}><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.01,35.638,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>);
export const FacebookIcon: FC<IconProps> = (props) => ( <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#1877F2" {...props}><path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.99,3.657,9.128,8.438,9.879V14.89h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.24,0-1.628,0.772-1.628,1.562V12h2.773l-0.443,2.89h-2.33V21.88C18.343,21.128,22,16.99,22,12z"></path></svg>);
export const EyeIcon = createIcon(<><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 10.51 7.159 6 12 6c4.841 0 8.577 4.51 9.964 5.683.12.1.229.222.31.357a1.012 1.012 0 010 .639C20.577 13.49 16.841 18 12 18c-4.841 0-8.577-4.51-9.964-5.683a1.01 1.01 0 01-.31-.357z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>);
export const EyeSlashIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />);
export const RobotIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 10.5H13.5V13.5H10.5V10.5ZM10.5 10.5V7.5H13.5V10.5M4.5 10.5v3h3v-3h-3ZM7.5 10.5V7.5H4.5v3M16.5 10.5v3h3v-3h-3ZM19.5 10.5V7.5H16.5v3M9 16.5v4.5M15 16.5v4.5M6.45 6.45l-2.1-2.1M17.55 6.45l2.1-2.1M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3Z" />);
export const CameraIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.825L2.887 12.822c-.22.48-.133 1.02.214 1.365l3.962 3.169c.345.27.842.27 1.188 0l3.962-3.169c.346-.27.842-.27 1.188 0l3.962 3.169c.347.27.843.27 1.188 0l3.962-3.169a.835.835 0 00.214-1.365l-2.29-4.997a2.31 2.31 0 01-1.64-1.65L16.828 2.92a2.31 2.31 0 00-4.256 0l-.344 1.652a2.31 2.31 0 01-1.64 1.65l-4.997 2.29zM12 12a3 3 0 100-6 3 3 0 000 6z" />);
export const VideoCameraIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />);
export const FilmIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18.974 15.022a.026.026 0 0 1 .052 0a3.79 3.79 0 0 0 2.953 2.952c.028.006.028.046 0 .052a3.79 3.79 0 0 0-2.953 2.953c-.006.028-.046.028-.052 0a3.79 3.79 0 0 0-2.953-2.953c-.028-.006-.028-.046 0-.052a3.79 3.79 0 0 0 2.953-2.953Z"/>
            <path strokeLinecap="round" d="M14.647 12.673c.741-.52 1.112-.78 1.26-1.157a1.5 1.5 0 0 0 0-1.032c-.148-.377-.519-.637-1.26-1.157a28 28 0 0 0-1.53-1.01a27 27 0 0 0-1.324-.74c-.788-.414-1.182-.621-1.563-.57a1.32 1.32 0 0 0-.842.513c-.234.323-.264.787-.322 1.715C9.027 9.845 9 10.466 9 11s.027 1.155.066 1.765c.058.928.088 1.392.322 1.715c.195.268.525.469.842.512c.381.052.775-.155 1.563-.57c.466-.245.93-.5 1.324-.739a28 28 0 0 0 1.53-1.01Z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.872 14.836C22 13.923 22 12.728 22 11c0-2.8 0-4.2-.545-5.27a5 5 0 0 0-2.185-2.185C18.2 3 16.8 3 14 3h-4c-2.8 0-4.2 0-5.27.545A5 5 0 0 0 2.545 5.73C2 6.8 2 8.2 2 11s0 4.2.545 5.27a5 5 0 0 0 2.185 2.185C5.8 19 7.2 19 10 19h3.426"/>
        </g>
    </svg>
);
export const PaperAirplaneIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />);
export const XCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const UserPlusIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.5a3 3 0 11-6 0 3 3 0 016 0zM4 18.75v-1.5a4.5 4.5 0 014.5-4.5h3.75a4.5 4.5 0 014.5 4.5v1.5" />);
export const HeartIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />);
export const ChatBubbleLeftEllipsisIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 13.5h8m-8-5h4M6.099 19q-1.949-.192-2.927-1.172C2 16.657 2 14.771 2 11v-.5c0-3.771 0-5.657 1.172-6.828S6.229 2.5 10 2.5h4c3.771 0 5.657 0 6.828 1.172S22 6.729 22 10.5v.5c0 3.771 0 5.657-1.172 6.828S17.771 19 14 19c-.56.012-1.007.055-1.445.155c-1.199.276-2.309.89-3.405 1.424c-1.563.762-2.344 1.143-2.834.786c-.938-.698-.021-2.863.184-3.865" />
    </svg>
);
export const XMarkIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />);
export const ShareIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7c.774.16 1.359.429 1.828.876C21 8.992 21 10.788 21 14.38s0 5.388-1.172 6.504S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.116S3 17.972 3 14.38s0-5.388 1.172-6.504C4.642 7.429 5.226 7.16 6 7m6.025-5L12 14m.025-12a.7.7 0 0 0-.472.175C10.647 2.94 9 4.929 9 4.929M12.025 2a.7.7 0 0 1 .422.174C13.353 2.94 15 4.93 15 4.93" />
    </svg>
);
export const SparklesIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.312-2.312L12 18.25l1.178-.398a3.375 3.375 0 002.312-2.312L16.5 14.25l.398 1.178a3.375 3.375 0 002.312 2.312L20.25 18.25l-1.178.398a3.375 3.375 0 00-2.312 2.312z" />);
export const LightbulbIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <path fill="currentColor" d="M12 3.75c2.928 0 5.25 2.275 5.25 5.02c0 1.71-.44 2.581-.998 3.373q-.19.266-.417.56c-.524.685-1.154 1.51-1.601 2.699a3.5 3.5 0 0 1-.353.698l-.056.08a3 3 0 0 1-.42.482c-.406.372-.894.588-1.405.588c-.51 0-.999-.216-1.406-.588a3 3 0 0 1-.42-.483l-.055-.08a3.5 3.5 0 0 1-.353-.697c-.447-1.19-1.077-2.014-1.601-2.7a18 18 0 0 1-.417-.56c-.557-.79-.998-1.662-.998-3.373C6.75 6.025 9.073 3.75 12 3.75m3.167 13.119c.192-.3.35-.617.471-.94c.362-.963.818-1.562 1.318-2.217c.17-.223.345-.453.523-.706c.71-1.008 1.271-2.175 1.271-4.237c0-3.628-3.05-6.519-6.75-6.519S5.25 5.141 5.25 8.77c0 2.06.561 3.228 1.271 4.236c.178.253.353.483.523.706c.5.655.956 1.254 1.318 2.217c.121.323.28.64.471.94l.222 2.216a2.96 2.96 0 0 0 5.89 0zm-1.66 1.53l-.054.536a1.46 1.46 0 0 1-2.906 0l-.053-.536c.45.222.955.351 1.506.351c.55 0 1.056-.13 1.506-.351M2.423 3.019a.75.75 0 0 1 1.056-.095l1.5 1.25a.75.75 0 0 1-.96 1.152l-1.5-1.25a.75.75 0 0 1-.096-1.056m19.152 0a.75.75 0 0 1-.096 1.057l-1.5 1.25a.75.75 0 1 1-.96-1.152l1.5-1.25a.75.75 0 0 1 1.056.096M1.25 8.25A.75.75 0 0 1 2 7.5h2A.75.75 0 0 1 4 9H2a.75.75 0 0 1-.75-.75m18 0A.75.75 0 0 1 20 7.5h2A.75.75 0 0 1 22 9h-2a.75.75 0 0 1-.75-.75M5.17 11.915a.75.75 0 0 1-.335 1.006l-1.5.75a.75.75 0 1 1-.67-1.342l1.5-.75a.75.75 0 0 1 1.006.336m13.66 0a.75.75 0 0 1 1.005-.336l1.5.75a.75.75 0 1 1-.67 1.342l-1.5-.75a.75.75 0 0 1-.336-1.006"/>
    </svg>
);
export const BookmarkIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.2185a48.507 48.507 0 0111.186 0z" />);
export const PlayCircleIcon = createIcon(<><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></>);
export const MicrophoneIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM12 5.25a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 004.5 0V7.5A2.25 2.25 0 0012 5.25z" />);
export const PlayIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />);
export const PauseIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />);
export const PhotoIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <g fill="none">
            <circle cx="15.091" cy="8.909" r="1.5" fill="currentColor"/>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.5 16.57a4 4 0 0 0 4 3.93h3.48M3.5 16.57V7.5a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v3.48m-17 5.59l.178-.2l3.206-3.827a2 2 0 0 1 3.066 0l1.242 1.482"/>
            <path fill="currentColor" fillRule="evenodd" d="M17.5 23a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11m0-8.993a.5.5 0 0 1 .5.5V17h2.493a.5.5 0 1 1 0 1H18v2.494a.5.5 0 0 1-1 0V18h-2.493a.5.5 0 1 1 0-1H17v-2.493a.5.5 0 0 1 .5-.5" clipRule="evenodd"/>
        </g>
    </svg>
);
export const EllipsisVerticalIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />);
export const ArrowUturnLeftIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />);
export const ArrowUturnRightIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />);
export const ArrowRightIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />);
export const ArrowDownTrayIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />);
export const DocumentDuplicateIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m9.375 2.625c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-3.375c0-.621.504-1.125 1.125-1.125h1.5z" />);
export const DocumentTextIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />);
export const Squares2X2Icon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6.75c0-1.768 0-2.652.55-3.2C4.097 3 4.981 3 6.75 3c1.768 0 2.652 0 3.2.55c.55.548.55 1.432.55 3.2c0 1.768 0 2.652-.55 3.2c-.548.55-1.432.55-3.2.55c-1.768 0-2.652 0-3.2-.55C3 9.403 3 8.519 3 6.75Zm0 10.507c0-1.768 0-2.652.55-3.2c.548-.55 1.432-.55 3.2-.55c1.768 0 2.652 0 3.2.55c.55.548.55 1.432.55 3.2c0 1.768 0 2.652-.55 3.2c-.548.55-1.432.55-3.2.55c-1.768 0-2.652 0-3.2-.55C3 19.91 3 19.026 3 17.258ZM13.5 6.75c0-1.768 0-2.652.55-3.2c.548-.55 1.432-.55 3.2-.55c1.768 0 2.652 0 3.2.55c.55.548.55 1.432.55 3.2c0 1.768 0 2.652-.55 3.2c-.548.55-1.432.55-3.2.55c-1.768 0-2.652 0-3.2-.55c-.55-.548-.55-1.432-.55-3.2Zm0 10.507c0-1.768 0-2.652.55-3.2c.548-.55 1.432-.55 3.2-.55c1.768 0 2.652 0 3.2.55c.55.548.55 1.432.55 3.2c0 1.768 0 2.652-.55 3.2c-.548.55-1.432.55-3.2.55c-1.768 0-2.652 0-3.2-.55c-.55-.548-.55-1.432-.55-3.2Z"/>
    </svg>
);
export const TrashIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />);
export const AcademicCapIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />);
export const CheckIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />);
export const LockClosedIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />);
export const RocketLaunchIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6" {...props}>
        <path fill="currentColor" d="M349.1 0v116.4L116.4 349.1H0V512h162.9V395.6l232.7-232.7H512V0z"/>
    </svg>
);
export const PencilSquareIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />);
export const MegaphoneIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" className="h-6 w-6" {...props}>
        <path fill="currentColor" fillRule="evenodd" d="M3.61 1.184C4.7 1.085 5.835 1 7 1s2.301.085 3.39.184h.003c.833.08 1.624.396 2.24.914c.618.52 1.029 1.22 1.135 1.993v.002c.123.927.232 1.905.232 2.912s-.11 1.984-.23 2.91l-.001.004c-.106.773-.517 1.472-1.135 1.992c-.616.519-1.407.835-2.24.915h-.003a43 43 0 0 1-2.684.173a.625.625 0 1 1-.034-1.25a41 41 0 0 0 2.604-.168a2.84 2.84 0 0 0 1.553-.626c.404-.34.64-.768.7-1.204c.12-.915.22-1.825.22-2.746s-.1-1.833-.22-2.746c-.06-.436-.297-.864-.701-1.204a2.84 2.84 0 0 0-1.554-.626C9.198 2.33 8.107 2.25 7 2.25s-2.197.081-3.275.179a2.84 2.84 0 0 0-1.554.626c-.404.34-.64.768-.7 1.204q-.084.617-.144 1.236a.625.625 0 0 1-1.244-.117c.04-.436.093-.865.149-1.285v-.002c.106-.774.517-1.473 1.134-1.993a4.1 4.1 0 0 1 2.241-.914zM.063 7.89a.75.75 0 0 1 .75-.75c1.516 0 2.807.428 3.718 1.336c.912.909 1.341 2.197 1.341 3.71a.75.75 0 0 1-1.5 0c0-1.236-.346-2.096-.9-2.648S2.055 8.64.813 8.64a.75.75 0 0 1-.75-.75M0 10.553a.75.75 0 0 1 .75-.75c.682 0 1.32.194 1.789.66c.468.467.662 1.105.662 1.786a.75.75 0 0 1-1.5 0c0-.404-.111-.614-.222-.724c-.11-.11-.322-.222-.729-.222a.75.75 0 0 1-.75-.75" clipRule="evenodd"/>
    </svg>
);
export const Bars3Icon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />);
export const ChevronRightIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />);
export const ChevronLeftIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />);
export const StarIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.254 3.96a.563.563 0 00-.162.531l1.205 5.272a.563.563 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.563.563 0 01-.84-.61l1.205-5.272a.563.563 0 00-.162-.531l-4.254-3.96a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />);
export const CircleStackIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />);
export const CreditCardIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6" {...props}>
        <path fill="currentColor" d="M2 9.5A4.5 4.5 0 0 1 6.5 5h19A4.5 4.5 0 0 1 30 9.5v13a4.5 4.5 0 0 1-4.5 4.5h-19A4.5 4.5 0 0 1 2 22.5v-13ZM6.5 7A2.5 2.5 0 0 0 4 9.5V11h24V9.5A2.5 2.5 0 0 0 25.5 7h-19ZM4 22.5A2.5 2.5 0 0 0 6.5 25h19a2.5 2.5 0 0 0 2.5-2.5V13H4v9.5ZM21 19h3a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2Z"/>
    </svg>
);
export const LanguageIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.76 14.16 9 15.333 9h1.334c1.5 0 2.823-1.012 3.16-2.443m-7.16 2.443c.18-.073.359-.15.534-.23m-2.198 4.315a48.47 0 01-5.25 0m5.25 0c-.068.09-.133.178-.196.265A48.47 48.47 0 003 10.5" />);
export const SunIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />);
export const ArrowDownIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />);
export const UsersIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <g fill="none">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.162 10.926L13.716 4.48a2.5 2.5 0 0 0-1.767-.732h-5.2a3 3 0 0 0-3 3v5.2a2.5 2.5 0 0 0 .731 1.768l6.445 6.446a4 4 0 0 0 5.657 0l1.79-1.79l1.79-1.79a4 4 0 0 0 0-5.657"/>
            <circle cx="7.738" cy="7.738" r="1.277" fill="currentColor" transform="rotate(-45 7.738 7.738)"/>
        </g>
    </svg>
);
export const ShieldCheckIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <path fill="currentColor" d="M16.5 11L13 7.5l1.4-1.4l2.1 2.1L20.7 4l1.4 1.4l-5.6 5.6M11 7H2v2h9V7m10 6.4L19.6 12L17 14.6L14.4 12L13 13.4l2.6 2.6l-2.6 2.6l1.4 1.4l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6l2.6-2.6M11 15H2v2h9v-2Z"/>
    </svg>
);
export const KeyIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />);
export const AtSymbolIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />);
export const GlobeAltIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686-5.836A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253m0 0A11.953 11.953 0 0012 16.5c2.998 0 5.74 1.1 7.843-2.918" />);
export const CheckBadgeIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />);
export const RecordCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />);
export const UserIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />);
export const MoonIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />);
export const ArrowRightOnRectangleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />);
export const AdjustmentsVerticalIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" {...props}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8.7 8.7c1.1-1 2.2-2 3.3-2.7m0 0c3.1-2 6-2.6 7.4-1.3c1.8 1.8 0 6.6-4 10.7c-4.1 4-8.9 5.8-10.7 4C3.4 18 4 15.2 6 12m6-6C9 4 6 3.3 4.7 4.6c-1.8 1.8 0 6.6 4 10.7M12 6c1.2.7 2.3 1.7 3.4 2.7m2.7 3.4c2 3 2.6 6 1.3 7.3C18 20.7 15 20 12 18m2-6a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"/>
    </svg>
);
export const ChatBubbleBottomCenterTextIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337zM7.5 10.5h9M7.5 12.75h5.25" />);
export const ClockIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const ArrowUpCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const ArrowDownCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const InformationCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />);
export const ExclamationTriangleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />);
export const ExclamationCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />);
export const GifIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" {...props}>
        <path d="M10 9h1.5v2H10V9Zm-1.5 4.5h3V12h-3v1.5Zm4.5-4.5H16v6h-3V9Z" />
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 12.5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1V10h-1V9.5H10v3h2.5V14h-1.5a1 1 0 0 1-1-1Zm7-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1.5Z" />
    </svg>
);
export const ArrowPathIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" {...props}>
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
            <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2a9.98 9.98 0 0 1 7.6 3.5"/>
            <path d="M20 2.5V6h-3.5m-.555 6.358c-.176.626-1.012 1.07-2.682 1.955c-1.615.856-2.422 1.284-3.073 1.112a1.66 1.66 0 0 1-.712-.392C9 14.583 9 13.709 9 11.963c0-1.747 0-2.62.478-3.07c.198-.186.443-.321.712-.393c.65-.172 1.458.256 3.073 1.113c1.67.886 2.506 1.328 2.682 1.955c.073.259.073.531 0 .79"/>
        </g>
    </svg>
);
export const ArrowsPointingOutIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m4.5 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />);
export const ArrowsPointingInIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />);
export const Cog6ToothIcon: FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" {...props}>
        <g fill="currentColor">
            <path d="M12 1.25c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75c-.822 0-1.622-.092-2.392-.267a.75.75 0 1 1 .332-1.463a9.25 9.25 0 1 0 0-18.04a.75.75 0 1 1-.332-1.463c.77-.175 1.57-.267 2.392-.267ZM3.132 16.686a.75.75 0 0 1 1.034.235a9.302 9.302 0 0 0 2.913 2.913a.75.75 0 0 1-.8 1.27a10.804 10.804 0 0 1-3.382-3.383a.75.75 0 0 1 .235-1.035ZM2.98 9.94a.75.75 0 1 0-1.463-.332c-.175.77-.267 1.57-.267 2.392c0 .822.092 1.622.267 2.393a.75.75 0 0 0 1.463-.333A9.283 9.283 0 0 1 2.75 12c0-.709.08-1.398.23-2.06Zm4.334-6.808a.75.75 0 0 1-.235 1.034A9.303 9.303 0 0 0 4.166 7.08a.75.75 0 0 1-1.27-.8A10.803 10.803 0 0 1 6.28 2.897a.75.75 0 0 1 1.035.235Z"/>
            <path fillRule="evenodd" d="M8.25 9.213c0-1.423 1.496-2.49 2.825-1.705l4.72 2.787c1.273.752 1.273 2.658 0 3.41l-4.72 2.786c-1.329.785-2.825-.282-2.825-1.705V9.213Zm1.71-.408a.467.467 0 0 0-.21.408v5.573c0 .199.096.338.21.409c.11.068.232.076.352.005l4.72-2.787A.465.465 0 0 0 15.25 12a.465.465 0 0 0-.218-.414L10.312 8.8a.323.323 0 0 0-.353.005Z" clipRule="evenodd"/>
        </g>
    </svg>
);
export const FaceSmileIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />);
export const StopIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />);