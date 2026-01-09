import React, { useRef, FC, ChangeEvent } from 'react';
import { PhotoIcon, VideoCameraIcon, RecordCircleIcon } from './icons/Icons';

interface MediaSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (files: FileList, type: 'photo' | 'video') => void;
  onStartRecording: () => void;
  allowedMediaTypes?: ('photo' | 'video')[];
}

export const MediaSourceModal: FC<MediaSourceModalProps> = ({ isOpen, onClose, onFileSelect, onStartRecording, allowedMediaTypes = ['photo', 'video'] }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files, type);
    } else {
      // If user cancels file selection, just close the modal.
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[70] flex justify-center items-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-t-2xl w-full max-w-lg p-4 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center mb-2">
          <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <h3 className="text-lg font-bold text-center text-gray-800 dark:text-gray-200 mb-4">Add Media</h3>
        
        <div className="space-y-3">
          <input type="file" ref={imageInputRef} onChange={(e) => handleFileChange(e, 'photo')} accept="image/*" multiple className="hidden" />
          <input type="file" ref={videoInputRef} onChange={(e) => handleFileChange(e, 'video')} accept="video/*" className="hidden" />

          {allowedMediaTypes.includes('photo') && (
            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full flex items-center space-x-4 p-4 text-left font-semibold bg-gray-50 dark:bg-slate-700/50 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
            >
              <PhotoIcon className="w-6 h-6 text-indigo-500" />
              <span>Photo Library</span>
            </button>
          )}
          
          {allowedMediaTypes.includes('video') && (
            <>
              <button
                onClick={() => videoInputRef.current?.click()}
                className="w-full flex items-center space-x-4 p-4 text-left font-semibold bg-gray-50 dark:bg-slate-700/50 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
              >
                <VideoCameraIcon className="w-6 h-6 text-teal-500" />
                <span>Video Library</span>
              </button>

              <button
                onClick={onStartRecording}
                className="w-full flex items-center space-x-4 p-4 text-left font-semibold bg-gray-50 dark:bg-slate-700/50 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
              >
                <VideoCameraIcon className="w-6 h-6 text-rose-500"/>
                <span>Record Video</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};