// Mock data for Quest Log app
export const mockQuests = [
  {
    id: '1',
    name: 'Complete project proposal',
    rank: 'Epic',
    dueDate: '2025-01-15',
    reward: 'Movie',
    xpReward: 150,
    dateAdded: '2025-01-10'
  },
  {
    id: '2',
    name: 'Clean the house',
    rank: 'Common',
    dueDate: '2025-01-14',
    reward: 'Scrolling',
    xpReward: 50,
    dateAdded: '2025-01-12'
  },
  {
    id: '3',
    name: 'Learn new skill',
    rank: 'Legendary',
    dueDate: '2025-01-16',
    reward: '1 Hour Gaming',
    xpReward: 200,
    dateAdded: '2025-01-13'
  },
  {
    id: '4',
    name: 'Call mom',
    rank: 'Rare',
    dueDate: '2025-01-13',
    reward: '$1 Credit',
    xpReward: 75,
    dateAdded: '2025-01-10'
  }
];

export const mockCompletedQuests = [
  {
    id: '5',
    name: 'Morning workout',
    rank: 'Common',
    xpEarned: 50,
    dateCompleted: '2025-01-13T08:00:00'
  },
  {
    id: '6',
    name: 'Read 20 pages',
    rank: 'Rare',
    xpEarned: 75,
    dateCompleted: '2025-01-12T20:30:00'
  },
  {
    id: '7',
    name: 'Finish coding challenge',
    rank: 'Epic',
    xpEarned: 150,
    dateCompleted: '2025-01-11T15:45:00'
  }
];

export const mockRewards = [
  {
    id: '1',
    name: '1 Hour Gaming',
    cost: 100,
    emoji: '🎮',
    isCustom: false,
    note: 'Enjoy your favorite game'
  },
  {
    id: '2',
    name: '$1 Credit',
    cost: 25,
    emoji: '💰',
    isCustom: false,
    note: 'Small spending money'
  },
  {
    id: '3',
    name: 'Movie Night',
    cost: 100,
    emoji: '🍿',
    isCustom: false,
    note: 'Watch a movie with snacks'
  },
  {
    id: '4',
    name: 'Social Media',
    cost: 50,
    emoji: '📱',
    isCustom: false,
    note: '30 minutes of scrolling'
  }
];

export const mockCustomRewards = [
  {
    id: '5',
    name: 'Ice Cream',
    cost: 75,
    emoji: '🍦',
    isCustom: true,
    note: 'Treat yourself to your favorite flavor'
  },
  {
    id: '6',
    name: 'New Book',
    cost: 200,
    emoji: '📚',
    isCustom: true,
    note: 'Buy that book you\'ve been wanting'
  }
];

export const mockRecurringTasks = [
  {
    id: '1',
    name: 'Daily Exercise',
    rank: 'Common',
    frequency: 'Daily',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    status: 'Active',
    lastAdded: '2025-01-13'
  },
  {
    id: '2',
    name: 'Weekly Review',
    rank: 'Rare',
    frequency: 'Weekly',
    days: ['Sun'],
    status: 'Active',
    lastAdded: '2025-01-12'
  },
  {
    id: '3',
    name: 'Monthly Goal Setting',
    rank: 'Epic',
    frequency: 'Monthly',
    days: ['1st'],
    status: 'Inactive',
    lastAdded: '2025-01-01'
  }
];

export const mockXPData = {
  currentXP: 325,
  totalEarned: 875,
  totalSpent: 550,
  completedQuests: 12
};

export const mockLevels = [
  { id: 1, name: 'Novice', xpRequired: 0, color: 'bg-gray-100 text-gray-800' },
  { id: 2, name: 'Apprentice', xpRequired: 250, color: 'bg-green-100 text-green-800' },
  { id: 3, name: 'Hero', xpRequired: 500, color: 'bg-blue-100 text-blue-800' },
  { id: 4, name: 'Champion', xpRequired: 1000, color: 'bg-purple-100 text-purple-800' },
  { id: 5, name: 'Legend', xpRequired: 2000, color: 'bg-yellow-100 text-yellow-800' },
  { id: 6, name: 'Master', xpRequired: 4000, color: 'bg-red-100 text-red-800' }
];

export const questRanks = [
  { value: 'Common', label: 'Common', color: 'bg-gray-100 text-gray-800' },
  { value: 'Rare', label: 'Rare', color: 'bg-blue-100 text-blue-800' },
  { value: 'Epic', label: 'Epic', color: 'bg-purple-100 text-purple-800' },
  { value: 'Legendary', label: 'Legendary', color: 'bg-yellow-100 text-yellow-800' }
];

export const frequencies = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Weekdays', label: 'Weekdays' }
];

export const dayOptions = [
  { value: 'Mon', label: 'Monday' },
  { value: 'Tue', label: 'Tuesday' },
  { value: 'Wed', label: 'Wednesday' },
  { value: 'Thu', label: 'Thursday' },
  { value: 'Fri', label: 'Friday' },
  { value: 'Sat', label: 'Saturday' },
  { value: 'Sun', label: 'Sunday' }
];