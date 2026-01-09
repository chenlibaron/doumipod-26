import React, { FC } from 'react';

export const DoumipodLogo: FC<{ size?: 'xl' | '2xl' | '3xl', className?: string }> = ({ size = 'xl', className = '' }) => {
    const sizeClasses = {
        xl: 'text-xl',
        '2xl': 'text-4xl',
        '3xl': 'text-5xl',
    };
    const textSize = sizeClasses[size];

    return (
        <div
            className={`font-black ${className} ${textSize} text-gray-900 dark:text-gray-100`}
            style={{ fontFamily: "'Auriol', 'Cinzel', serif" }}
        >
            Doumipod
        </div>
    );
};

export const OpenPodLogo: FC<{ size?: 'sm' | 'base' | 'lg', className?: string }> = ({ size = 'lg', className = '' }) => {
    const sizeClasses = {
      sm: { text: 'text-sm', p: 'text-2xl', mx: '-mx-0.5', my: '-my-1' },
      base: { text: 'text-base', p: 'text-3xl', mx: '-mx-0.5', my: '-my-1.5' },
      lg: { text: 'text-lg', p: 'text-4xl', mx: '-mx-1', my: '-my-2' },
    };
    const classes = sizeClasses[size];
  
    return (
        <div
            className={`flex items-center font-black ${className}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
        >
            <span className={`${classes.text} text-gray-800 dark:text-gray-200`}>Open</span>
            <span
                className={`${classes.p} ${classes.mx} ${classes.my} text-violet-500`}
                style={{ fontFamily: "'Pacifico', cursive", fontWeight: 400 }}
            >
                P
            </span>
            <span className={`${classes.text} text-gray-800 dark:text-gray-200`}>od</span>
        </div>
    );
};

export const AskDoumiLogo: FC<{ size?: 'sm' | 'base' | 'lg' }> = ({ size = 'lg' }) => {
    const sizeClasses = {
      sm: { text: 'text-sm', d: 'text-2xl', mx: '-mx-0.5', my: '-my-1' },
      base: { text: 'text-base', d: 'text-3xl', mx: '-mx-0.5', my: '-my-1.5' },
      lg: { text: 'text-xl', d: 'text-5xl', mx: '-mx-1.5', my: '-my-2' },
    };
    const classes = sizeClasses[size];
  
    return (
        <div
            className={`flex items-center font-black`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
        >
            <span className={`${classes.text} text-gray-800 dark:text-gray-200`}>Ask</span>
            <span
                className={`${classes.d} ${classes.mx} ${classes.my} text-teal-500`}
                style={{ fontFamily: "'Pacifico', cursive", fontWeight: 400 }}
            >
                D
            </span>
            <span className={`${classes.text} text-gray-800 dark:text-gray-200`}>oumi</span>
        </div>
    );
};