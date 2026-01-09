import React, { FC } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  confirmButtonClass?: string;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = () => {
  return null;
};