// Mock data for Quest Log RPG
export const mockQuests = [
  {
    id: '1',
    name: 'Complete project proposal',
    rank: 'Epic',
    dueDate: '2025-07-08T14:00',
    reward: 'Movie Night',
    description: 'Finish the quarterly project proposal with detailed timeline and budget breakdown.',
    xpReward: 75,
    dateAdded: '2025-07-01',
    isImportant: true,
    attachments: [],
    progressStatus: 'in_progress'
  },
  {
    id: '2',
    name: 'Clean the house',
    rank: 'Common',
    dueDate: '2025-07-06',
    reward: 'Social Media Time',
    description: 'Deep clean all rooms including bathroom and kitchen.',
    xpReward: 25,
    dateAdded: '2025-07-02',
    isImportant: false,
    attachments: [],
    progressStatus: 'not_started'
  },
  {
    id: '3',
    name: 'Learn new programming language',
    rank: 'Legendary',
    dueDate: '2025-07-10T10:00',
    reward: 'New Book',
    description: 'Complete the intro course for Python programming.',
    xpReward: 100,
    dateAdded: '2025-07-03',
    isImportant: true,
    attachments: [],
    progressStatus: 'almost_done'
  },
  {
    id: '4',
    name: 'Call mom',
    rank: 'Rare',
    dueDate: '2025-07-05T18:00',
    reward: 'Ice Cream',
    description: '',
    xpReward: 50,
    dateAdded: '2025-07-04',
    isImportant: false,
    attachments: [],
    progressStatus: 'pending'
  }
];

export const mockCompletedQuests = [
  {
    id: '5',
    name: 'Morning workout',
    rank: 'Common',
    xpEarned: 25,
    dateCompleted: '2025-01-13T08:00:00',
    reward: 'Protein Shake'
  },
  {
    id: '6',
    name: 'Read 20 pages',
    rank: 'Rare',
    xpEarned: 50,
    dateCompleted: '2025-01-12T20:30:00',
    reward: 'Gaming Session'
  },
  {
    id: '7',
    name: 'Finish coding challenge',
    rank: 'Epic',
    xpEarned: 75,
    dateCompleted: '2025-01-11T15:45:00',
    reward: 'Movie Night'
  }
];

export const mockRewards = [
  {
    id: '1',
    name: '🎮 Gaming Session',
    cost: 50,
    description: 'Enjoy 1 hour of your favorite game',
    isCustom: false,
    icon: '🎮',
    category: 'Entertainment'
  },
  {
    id: '2',
    name: '💰 Spending Money',
    cost: 25,
    description: 'Small treat or coffee money',
    isCustom: false,
    icon: '💰',
    category: 'Treats'
  },
  {
    id: '3',
    name: '🍿 Movie Night',
    cost: 75,
    description: 'Watch a movie with snacks',
    isCustom: false,
    icon: '🍿',
    category: 'Entertainment'
  },
  {
    id: '4',
    name: '📱 Social Media Time',
    cost: 30,
    description: '30 minutes of guilt-free scrolling',
    isCustom: false,
    icon: '📱',
    category: 'Digital'
  },
  {
    id: '5',
    name: '🍦 Ice Cream',
    cost: 40,
    description: 'Treat yourself to your favorite flavor',
    isCustom: true,
    icon: '🍦',
    category: 'Treats'
  },
  {
    id: '6',
    name: '📚 New Book',
    cost: 100,
    description: 'Buy that book you\'ve been wanting',
    isCustom: true,
    icon: '📚',
    category: 'Learning'
  }
];

export const mockInventory = [
  {
    id: 'inv_1',
    rewardId: '1',
    rewardName: '🎮 Gaming Session',
    dateClaimed: '2025-01-12T10:00:00',
    xpCost: 50,
    description: 'Enjoy 1 hour of your favorite game'
  },
  {
    id: 'inv_2',
    rewardId: '4',
    rewardName: '📱 Social Media Time',
    dateClaimed: '2025-01-13T15:30:00',
    xpCost: 30,
    description: '30 minutes of guilt-free scrolling'
  }
];

export const mockClaimedRewards = [
  {
    id: 'claimed_1',
    rewardName: '🍿 Movie Night',
    xpCost: 75,
    dateClaimed: '2025-01-10T19:00:00',
    dateUsed: '2025-01-10T20:00:00'
  },
  {
    id: 'claimed_2',
    rewardName: '💰 Spending Money',
    xpCost: 25,
    dateClaimed: '2025-01-11T12:00:00',
    dateUsed: '2025-01-11T14:00:00'
  }
];

export const mockXPData = {
  currentXP: 175,
  totalEarned: 650,
  totalSpent: 475,
  completedQuests: 8,
  lastMonthlyBonus: '2024-12-01T00:00:00Z' // Set to last month so bonus is available
};

export const mockSettings = {
  xpSystem: 'default',
  autoCleanup: {
    enabled: true,
    frequency: '1month',
    recurringOnly: false,
    keepImportant: true,
    includeRewards: false
  },
  notifications: {
    levelUp: true,
    questDue: true,
    rewardClaimed: true
  },
  calendarView: {
    enabled: true,
    defaultView: 'month'
  }
};

export const mockRecurringTasks = [
  {
    id: '1',
    name: 'Daily Exercise',
    rank: 'Common',
    frequency: 'Daily',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    status: 'Active',
    lastAdded: '2025-01-13',
    xpReward: 25,
    isImportant: false,
    startBeforeDue: 0, // Add to quests 0 days before due
    customFrequency: null,
    yearlyDate: null
  },
  {
    id: '2',
    name: 'Weekly Review',
    rank: 'Rare',
    frequency: 'Weekly',
    days: ['Sun'],
    status: 'Active',
    lastAdded: '2025-01-12',
    xpReward: 50,
    isImportant: true,
    startBeforeDue: 1, // Add to quests 1 day before due
    customFrequency: null,
    yearlyDate: null
  },
  {
    id: '3',
    name: 'Monthly Goal Setting',
    rank: 'Epic',
    frequency: 'Monthly',
    days: ['1st'],
    status: 'Inactive',
    lastAdded: '2025-01-01',
    xpReward: 75,
    isImportant: false,
    startBeforeDue: 2, // Add to quests 2 days before due
    customFrequency: null,
    yearlyDate: null
  },
  {
    id: '4',
    name: 'Anniversary Celebration',
    rank: 'Legendary',
    frequency: 'Yearly',
    days: [],
    status: 'Active',
    lastAdded: '2024-06-15',
    xpReward: 100,
    isImportant: true,
    startBeforeDue: 7, // Add to quests 7 days before due
    customFrequency: null,
    yearlyDate: '06-15' // June 15th every year
  },
  {
    id: '5',
    name: 'Weekend Reflection',
    rank: 'Rare',
    frequency: 'Weekends',
    days: ['Sat', 'Sun'],
    status: 'Active',
    lastAdded: '2025-01-12',
    xpReward: 50,
    isImportant: false,
    startBeforeDue: 0,
    customFrequency: null,
    yearlyDate: null
  }
];

export const frequencies = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Weekdays', label: 'Weekdays' },
  { value: 'Yearly', label: 'Yearly' },
  { value: 'Weekends', label: 'Weekends Only' },
  { value: 'Custom', label: 'Custom Frequency' }
];

// Custom frequency options
export const customFrequencyUnits = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' }
];

export const endConditionTypes = [
  { value: 'never', label: 'Never' },
  { value: 'after', label: 'After X occurrences' },
  { value: 'on', label: 'On specific date' }
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