// Time and date utilities for Quest Log

// Get user's timezone or stored preference
export const getUserTimezone = () => {
  const stored = localStorage.getItem('questLogTimezone');
  if (stored) {
    const { useSystemTimezone, selectedTimezone } = JSON.parse(stored);
    if (!useSystemTimezone && selectedTimezone) {
      return selectedTimezone;
    }
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Save timezone preference
export const saveTimezonePreference = (useSystemTimezone, selectedTimezone = null) => {
  localStorage.setItem('questLogTimezone', JSON.stringify({
    useSystemTimezone,
    selectedTimezone
  }));
};

// Get timezone preference from storage
export const getTimezonePreference = () => {
  const stored = localStorage.getItem('questLogTimezone');
  if (stored) {
    return JSON.parse(stored);
  }
  return { useSystemTimezone: true, selectedTimezone: null };
};

// Format relative due date with time
export const formatRelativeDueDate = (dueDate, includeTime = false) => {
  if (!dueDate) return 'No due date';
  
  const timezone = getUserTimezone();
  const now = new Date();
  const due = new Date(dueDate);
  
  // If it's just a date (no time), treat as all day
  const isAllDay = dueDate.length === 10; // YYYY-MM-DD format
  
  if (isAllDay) {
    return formatRelativeDate(due, now) + ' (All Day)';
  }
  
  const timeString = due.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    timeZone: timezone 
  });
  
  return formatRelativeDate(due, now) + ` at ${timeString}`;
};

// Format relative date portion
const formatRelativeDate = (due, now) => {
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 1 && diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < -1 && diffDays >= -7) {
    return `${Math.abs(diffDays)} days ago`;
  } else {
    // For dates far in the future or past, show the actual date
    const timezone = getUserTimezone();
    return due.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      timeZone: timezone 
    });
  }
};

// Get timezone display name
export const getTimezoneDisplayName = (timezone) => {
  try {
    const now = new Date();
    const shortName = now.toLocaleDateString('en', {
      timeZoneName: 'short',
      timeZone: timezone
    }).split(', ')[1];
    
    return `${timezone} (${shortName})`;
  } catch (error) {
    return timezone;
  }
};

// Popular timezone list
export const POPULAR_TIMEZONES = [
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Ho_Chi_Minh',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland'
];

// Get all available timezones (fallback for comprehensive list)
export const getAllTimezones = () => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch (error) {
    // Fallback to popular timezones if not supported
    return POPULAR_TIMEZONES;
  }
};

// Format timestamp for completed quests with timezone
export const formatCompletedTimestamp = (timestamp) => {
  const timezone = getUserTimezone();
  const date = new Date(timestamp);
  
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone
  });
};

// Check if a date is overdue, today, or future (CARD BACKGROUND LOGIC)
export const getDateStatus = (dueDate) => {
  if (!dueDate) return 'future';
  
  const now = new Date();
  const due = new Date(dueDate);
  
  // Compare just the date part (ignore time for card background)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  
  if (dueDay < today) return 'overdue';      // Past dates = red
  if (dueDay.getTime() === today.getTime()) return 'today';  // Today = blue (regardless of time)
  return 'future';                           // Future dates = green
};

// Check if quest time has passed (for TODAY's quests only)
export const getTimeOverdueInfo = (dueDate) => {
  if (!dueDate) return null;
  
  const now = new Date();
  const due = new Date(dueDate);
  
  // Only check time overdue for today's quests
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  
  // If it's not today, don't show time overdue
  if (dueDay.getTime() !== today.getTime()) return null;
  
  // If it's just a date (no time), no time overdue
  const isAllDay = dueDate.length === 10;
  if (isAllDay) return null;
  
  // Check if time has passed
  if (due <= now) {
    const timeDiff = now - due;
    return {
      isOverdue: true,
      overdueText: formatOverdueTime(timeDiff)
    };
  }
  
  return null;
};

// Format overdue time in human readable format
const formatOverdueTime = (milliseconds) => {
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  
  if (totalMinutes < 60) {
    return `Passed by ${totalMinutes} min${totalMinutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (minutes === 0) {
    return `Passed by ${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `Passed by ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
};