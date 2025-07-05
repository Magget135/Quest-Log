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
    // Due today - just show time
    const timeStr = due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Today at ${timeStr}`;
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
  
  const isToday = due.toDateString() === now.toDateString();
  
  if (isToday) {
    return 'today'; // Always return 'today' for same day, regardless of time
  }
  
  return due.getTime() < now.getTime() ? 'overdue' : 'future';
};

export const getPastDueInfo = (dueDate) => {
  if (!dueDate) return null;
  
  const now = new Date();
  const due = new Date(dueDate);
  const isToday = due.toDateString() === now.toDateString();
  
  // Only show past due badge if it's today and time has passed
  if (isToday && due.getTime() < now.getTime()) {
    const diffMs = now.getTime() - due.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `⚠️ Past due by ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `⚠️ Past due by ${diffMinutes}m`;
    } else {
      return `⚠️ Just past due`;
    }
  }
  
  return null;
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
    case 'today': return 'border-l-blue-500 bg-blue-50'; // Blue for today
    case 'overdue': return 'border-l-red-500 bg-red-50'; // Red for overdue (not today)
    case 'future': return 'border-l-green-500 bg-green-50'; // Green for future
    default: return 'border-l-gray-500 bg-gray-50';
  }
};

export const shouldShowPastDueBadge = (dueDate) => {
  return getPastDueInfo(dueDate) !== null;
};

export const isCurrentMonth = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  
  return date.getFullYear() === now.getFullYear() && 
         date.getMonth() === now.getMonth();
};

export const formatMonthYear = (dateString) => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
};