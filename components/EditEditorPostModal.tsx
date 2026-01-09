import React, { FC } from 'react';
import { EditorPost } from '../types';

interface EditEditorPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: EditorPost | null;
  onSave: (postId: number, newTitle: string, newContent: string) => void;
}

export const EditEditorPostModal: FC<EditEditorPostModalProps> = () => {
  return null;
};