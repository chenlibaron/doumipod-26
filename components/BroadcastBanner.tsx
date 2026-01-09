import React, { FC } from 'react';
import { Broadcast } from '../types';
import { InformationCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, XMarkIcon } from './icons/Icons';

interface BroadcastBannerProps {
  broadcast: Broadcast;
  onDismiss: (id: number) => void;
}

const bannerConfig = {
  info: {
    icon: <InformationCircleIcon className="w-6 h-6 text-indigo-800 dark:text-indigo-200" />,
  },
  warning: {
    icon: <ExclamationTriangleIcon className="w-6 h-6 text-amber-700 dark:text-amber-300" />,
  },
  critical: {
    icon: <ExclamationCircleIcon className="w-6 h-6 text-rose-700 dark:text-rose-300" />,
  },
};

export const BroadcastBanner: FC<BroadcastBannerProps> = ({ broadcast, onDismiss }) => {
  const config = bannerConfig[broadcast.type];

  return (
    <div className="p-4 rounded-lg flex space-x-3 items-start shadow-lg bg-gradient-to-br from-sky-100 to-indigo-200 dark:from-sky-900 dark:to-indigo-900 text-slate-800 dark:text-slate-100">
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        <h4 className="font-bold">{broadcast.title}</h4>
        <p className="text-sm mt-1 opacity-90">{broadcast.content}</p>
      </div>
      <button onClick={() => onDismiss(broadcast.id)} className="p-1 -mr-2 -mt-2 rounded-full hover:bg-black/10">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};