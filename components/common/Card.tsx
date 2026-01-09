import React, { ReactNode, CSSProperties, FC } from 'react';

interface CardProps {
  children: ReactNode;
  extraClasses?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export const Card: FC<CardProps> = ({ children, extraClasses = '', onClick, style }) => {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-left w-full ${extraClasses}`}
      style={style}
    >
      {children}
    </Component>
  );
};