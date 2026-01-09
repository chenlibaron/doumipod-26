import React, { useState, Fragment, FC, MouseEvent } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  onHashtagClick: (hashtag: string) => void;
}

const ContentRenderer: FC<{ 
    text: string; 
    onHashtagClick: (hashtag: string) => void;
}> = ({ text, onHashtagClick }) => {
    // Regex to match only #hashtags
    const parts = text.split(/(#[\p{L}\p{N}_]+)/gu);
    
    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('#')) {
                    const hashtag = part.substring(1);
                    return (
                        <button
                            key={index}
                            onClick={(e) => { e.stopPropagation(); onHashtagClick(hashtag); }}
                            className="font-semibold text-sky-500 hover:underline"
                        >
                            {part}
                        </button>
                    );
                }
                return <Fragment key={index}>{part}</Fragment>;
            })}
        </>
    );
};


export const ExpandableText: FC<ExpandableTextProps> = ({ text, maxLength, className = '', onHashtagClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return null;
  }
  
  const needsTruncation = maxLength && text.length > maxLength;

  const toggleExpanded = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card clicks or other parent events
    setIsExpanded(!isExpanded);
  };

  const currentText = needsTruncation && !isExpanded ? `${text.slice(0, maxLength)}...` : text;

  return (
    <p className={`${className} whitespace-pre-wrap break-words`}>
      <ContentRenderer 
        text={currentText} 
        onHashtagClick={onHashtagClick}
      />
      {needsTruncation && (
        <button onClick={toggleExpanded} className="text-sky-500 hover:underline ml-1 font-semibold outline-none focus:outline-none">
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </p>
  );
};