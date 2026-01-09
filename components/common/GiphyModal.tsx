import React, { useState, useEffect, FC } from 'react';
import { XCircleIcon, MagnifyingGlassIcon } from '../icons/Icons';

const mockGifs = [
  { id: '3o7TKSjRrfIPjeiVyE', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDB0eGw1dGNpdzB0cGI2eTh1dGd1YnJ2NWY4cWt5eGE3M2ZtZzhpcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyE/giphy.gif', description: 'happy spongebob squarepants' },
  { id: '3o6Zt481isNVuQI1l6', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWUyZzJ5bzF1dXBjcGZzN2l6dnhuOXp0aDNodW5wNnZ4b3E4ejBtaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt481isNVuQI1l6/giphy.gif', description: 'the office michael scott no' },
  { id: '3o6wNZEPqX4b66n7cQ', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGN6NHE0Z2VqY3M0ZHlsaWpzaG00Z2NrbzhpZ2o2N3hjbGg5NzF0dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6wNZEPqX4b66n7cQ/giphy.gif', description: 'homer simpson thinking thinking' },
  { id: '26n6Gx9moCgs1pUuk', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExazlqNGVjbmRzbjMzeG13a2pxeXpwNnhxZTVpMWY4ZWw4eDFjajNnZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26n6Gx9moCgs1pUuk/giphy.gif', description: 'shrug emoji meme' },
  { id: '3o6wrnKTAc3Z5_c8G4', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjRsdG55NGd3cDBxNXZ5M21wMjlzajY0ZTh4bm83N201bHBiaHk2eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6wrnKTAc3Z5_c8G4/giphy.gif', description: 'friends joey tribbiani wink' },
  { id: '3o7aDgf134NzaaHI8o', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOW83NjllcnV2Nnc5aTNtd3N6eHRjNjI3cDR1emZ2NnAzMnd0ZWU1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7aDgf134NzaaHI8o/giphy.gif', description: 'minions happy dance' },
  { id: '3o85xr9Z1wI5I7ggwM', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDNncDdkMmcwdHdrMWNqMWk3a3p6MGdka3FqYmd5bHhzb2ZiaGcyOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o85xr9Z1wI5I7ggwM/giphy.gif', description: 'kermit the frog typing' },
  { id: 'l3q2K5jinAlChoCLS', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h1bDl0M2ZiaTFkZ2JtZWp1a2FucGl5dmNmaGdycnhqa21hYnNqNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2K5jinAlChoCLS/giphy.gif', description: 'excited baby dance' },
  { id: 'xT5LMHxhOfscxPfIfm', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG4yMnN6NGt2dHVqZnZkbmZiaXhhc2M2c2Vsc2d1d3g5dWNnaGNsdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMHxhOfscxPfIfm/giphy.gif', description: 'cat computer keyboard' },
  { id: 'd3mlE7uhX8KFgEmY', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2p1cW0wbTh0b2FwYXJwc3Z1ZnFhaXpzaTU5cGprbnN4dmd0bjVlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d3mlE7uhX8KFgEmY/giphy.gif', description: 'surprised pikachu meme' },
  { id: 'l0HlTy9xgaa3P0b6M', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnA2OTZudW5kNWthMTh4YzJ1ZG13MnFqb2ZidXRhMXI3bHhtbnl2ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlTy9xgaa3P0b6M/giphy.gif', description: 'parks and rec ron swanson deal' },
  { id: '3ornk57KwDXf81XP56', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTVtdHF3dDcyYTFzN2d2OG5tZXVxZ3RkMmZmbjZ5OXB4MHM1OXBkaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ornk57KwDXf81XP56/giphy.gif', description: 'star wars thank you' },
];

interface GiphyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGiphySelect: (url: string) => void;
}

export const GiphyModal: FC<GiphyModalProps> = ({ isOpen, onClose, onGiphySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // A simple filter, in a real app this would be an API call.
  const filteredGifs = searchTerm 
    ? mockGifs.filter(gif => gif.description.toLowerCase().includes(searchTerm.toLowerCase()))
    : mockGifs;

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => {
        document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">GIPHY</h2>
        <button onClick={onClose} aria-label="Close GIPHY modal"><XCircleIcon className="w-8 h-8 text-gray-400"/></button>
      </div>

      {/* Search */}
      <div className="p-4 flex-shrink-0">
         <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for GIFs..."
                className="w-full h-10 pl-10 pr-4 bg-gray-100 dark:bg-slate-800 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                autoFocus
            />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {filteredGifs.map(gif => (
            <button key={gif.id} onClick={() => onGiphySelect(gif.url)} className="aspect-square bg-gray-200 dark:bg-slate-700 rounded-md overflow-hidden hover:opacity-80 transition-opacity">
              <img src={gif.url} alt={gif.description} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};