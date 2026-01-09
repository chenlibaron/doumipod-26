import React, { FC } from 'react';

export const LearningProgressCircle: FC<{ points: number }> = ({ points }) => {
    const progress = Math.min(points / 100, 100);
    const radius = 60;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 128 128"
                className="-rotate-90"
            >
                <circle
                    stroke="currentColor"
                    className="text-white/20 dark:text-black/20"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius + stroke / 2}
                    cy={radius + stroke / 2}
                />
                <circle
                    stroke="url(#progressGradient)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius + stroke / 2}
                    cy={radius + stroke / 2}
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" /> 
                        <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{Math.floor(progress)}%</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">{points} / 10,000 pts</span>
            </div>
        </div>
    );
};