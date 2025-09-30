'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

type NotificationType = 'success' | 'error';

interface BannerNotificationProps {
  message: string;
  type: NotificationType;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function BannerNotification({
  message,
  type,
  isVisible,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000
}: BannerNotificationProps) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />;

  return (
    <div className={`fixed top-16 left-0 right-0 z-50 ${bgColor} text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium">{message}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing banner notifications
export function useBannerNotification() {
  const [notification, setNotification] = React.useState<{
    message: string;
    type: NotificationType;
    isVisible: boolean;
  }>({ message: '', type: 'success', isVisible: false });

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type, isVisible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const showSuccess = (message: string) => showNotification(message, 'success');
  const showError = (message: string) => showNotification(message, 'error');

  return {
    notification,
    showSuccess,
    showError,
    hideNotification
  };
}