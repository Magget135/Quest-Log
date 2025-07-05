import React, { useEffect } from 'react';
import { useQuest } from '../contexts/QuestContext';
import { toast } from '../hooks/use-toast';

const NotificationManager = () => {
  const { state, dispatch } = useQuest();
  
  useEffect(() => {
    // Process new notifications
    state.notifications.forEach(notification => {
      if (notification.type === 'level_up') {
        toast({
          title: "🎉 Level Up!",
          description: notification.message,
          duration: 5000,
        });
      } else if (notification.type === 'level_down') {
        toast({
          title: "📉 Level Down",
          description: notification.message,
          duration: 5000,
          variant: "destructive"
        });
      } else if (notification.type === 'monthly_bonus') {
        toast({
          title: "🎁 Monthly Bonus",
          description: notification.message,
          duration: 5000,
        });
      }
      
      // Dismiss notification after showing
      setTimeout(() => {
        dispatch({ type: 'DISMISS_NOTIFICATION', payload: notification.id });
      }, 100);
    });
  }, [state.notifications, dispatch]);
  
  return null;
};

export default NotificationManager;