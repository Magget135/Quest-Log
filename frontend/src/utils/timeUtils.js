// Time utility functions for Quest Log
export const formatRelativeDueDate = (dueDate) => {
  if (!dueDate) return 'No due date';
  
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));
  
  // Check if it's today
  const isToday = due.toDateString() === now.toDateString();
  
  if (isToday) {
    if (diffMs < 0) {
      // Past due today
      const pastMinutes = Math.abs(diffMinutes);
      const pastHours = Math.abs(diffHours);
      
      if (pastMinutes < 60) {
        return `⏰ Passed by ${pastMinutes} min${pastMinutes !== 1 ? 's' : ''}`;
      } else if (pastHours < 24) {
        return `⏰ Passed by ${pastHours} hour${pastHours !== 1 ? 's' : ''}`;
      }
    } else {
      // Due today
      const timeStr = due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `Today at ${timeStr}`;
    }
  }
  
  // Future dates
  if (diffDays > 0) {
    if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else {
      return due.toLocaleDateString();
    }
  }
  
  // Past dates (not today)
  const pastDays = Math.abs(diffDays);
  if (pastDays === 1) {
    return 'Yesterday';
  } else if (pastDays <= 7) {
    return `${pastDays} day${pastDays !== 1 ? 's' : ''} ago`;
  } else {
    return due.toLocaleDateString();
  }
};

export const getDateStatus = (dueDate) => {
  if (!dueDate) return 'none';
  
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  
  const isToday = due.toDateString() === now.toDateString();
  
  if (isToday) {
    return diffMs < 0 ? 'overdue' : 'today';
  }
  
  return diffMs < 0 ? 'overdue' : 'future';
};

export const formatCompletedTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  
  const date = new Date(dateTime);
  return date.toLocaleString();
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  
  const now = new Date();
  const due = new Date(dueDate);
  
  return due.getTime() < now.getTime();
};

export const getDueDateColor = (dueDate) => {
  const status = getDateStatus(dueDate);
  switch (status) {
    case 'overdue': return 'border-l-red-500 bg-red-50';
    case 'today': return 'border-l-blue-500 bg-blue-50';
    case 'future': return 'border-l-green-500 bg-green-50';
    default: return 'border-l-gray-500 bg-gray-50';
  }
};

export const shouldShowOverdueBadge = (dueDate) => {
  if (!dueDate) return false;
  
  const now = new Date();
  const due = new Date(dueDate);
  const isToday = due.toDateString() === now.toDateString();
  
  return isToday && due.getTime() < now.getTime();
};