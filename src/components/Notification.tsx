import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 z-[1000] rounded shadow-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {message}
    </div>
  );
};

export default Notification;
