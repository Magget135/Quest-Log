// Achievements & Badges System
// Each achievement has: id, name, description, icon, category, unlocked, dateUnlocked

export const ACHIEVEMENT_CATEGORIES = {
  QUEST_COMPLETION: 'Quest Completion',
  XP_MILESTONES: 'XP Milestones', 
  REWARDS: 'Rewards & Store',
  PRODUCTIVITY: 'Productivity',
  DEDICATION: 'Dedication',
  SPECIAL: 'Special Achievements'
};

export const ACHIEVEMENTS = [
  // Quest Completion Achievements
  {
    id: 'first_quest',
    name: 'First Steps',
    description: 'Complete your very first quest',
    icon: '🌟',
    category: ACHIEVEMENT_CATEGORIES.QUEST_COMPLETION,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete any quest to unlock'
  },
  {
    id: 'quest_master_5',
    name: 'Quest Apprentice',
    description: 'Complete 5 quests',
    icon: '⚔️',
    category: ACHIEVEMENT_CATEGORIES.QUEST_COMPLETION,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete 5 quests total'
  },
  {
    id: 'quest_master_25',
    name: 'Quest Veteran',
    description: 'Complete 25 quests',
    icon: '🛡️',
    category: ACHIEVEMENT_CATEGORIES.QUEST_COMPLETION,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete 25 quests total'
  },
  {
    id: 'legendary_hunter',
    name: 'Legendary Hunter',
    description: 'Complete a Legendary quest',
    icon: '👑',
    category: ACHIEVEMENT_CATEGORIES.QUEST_COMPLETION,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete any Legendary difficulty quest'
  },
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete 3 quests in a single day',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.PRODUCTIVITY,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete 3 quests on the same day'
  },
  {
    id: 'procrastinator_redeemed',
    name: 'Procrastinator Redeemed',
    description: 'Complete a quest that was in "Delaying" status',
    icon: '🔄',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete a quest after marking it as "Delaying"'
  },

  // XP Milestone Achievements
  {
    id: 'xp_milestone_100',
    name: 'Rising Adventurer',
    description: 'Earn 100 total XP',
    icon: '✨',
    category: ACHIEVEMENT_CATEGORIES.XP_MILESTONES,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Earn 100 total XP from completed quests'
  },
  {
    id: 'xp_milestone_500',
    name: 'Experienced Hero',
    description: 'Earn 500 total XP',
    icon: '💫',
    category: ACHIEVEMENT_CATEGORIES.XP_MILESTONES,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Earn 500 total XP from completed quests'
  },
  {
    id: 'xp_milestone_1000',
    name: 'XP Champion',
    description: 'Earn 1000 total XP',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.XP_MILESTONES,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Earn 1000 total XP from completed quests'
  },

  // Rewards & Store Achievements
  {
    id: 'first_reward',
    name: 'Reward Collector',
    description: 'Claim your first reward from the store',
    icon: '🎁',
    category: ACHIEVEMENT_CATEGORIES.REWARDS,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Purchase any reward from the Reward Store'
  },
  {
    id: 'reward_spender',
    name: 'Big Spender',
    description: 'Spend 200 XP on rewards',
    icon: '💰',
    category: ACHIEVEMENT_CATEGORIES.REWARDS,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Spend a total of 200 XP on rewards'
  },
  {
    id: 'inventory_user',
    name: 'Inventory Master',
    description: 'Use a reward from your inventory',
    icon: '🎒',
    category: ACHIEVEMENT_CATEGORIES.REWARDS,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Use any item from your inventory'
  },

  // Dedication Achievements
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    description: 'Complete quests on 7 different days',
    icon: '📅',
    category: ACHIEVEMENT_CATEGORIES.DEDICATION,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete at least one quest on 7 different days'
  },
  {
    id: 'monthly_bonus_claimer',
    name: 'Monthly Bonus Master',
    description: 'Claim a monthly XP bonus',
    icon: '📈',
    category: ACHIEVEMENT_CATEGORIES.DEDICATION,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Claim your monthly XP bonus'
  },

  // Special Achievements
  {
    id: 'important_quest_master',
    name: 'Priority Expert',
    description: 'Complete 5 important quests',
    icon: '⭐',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete 5 quests marked as Important'
  },
  {
    id: 'recurring_master',
    name: 'Routine Builder',
    description: 'Create 3 recurring tasks',
    icon: '🔁',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Create 3 different recurring tasks'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 10 quests without marking any as "Abandoned"',
    icon: '💎',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Complete 10 quests without abandoning any'
  },
  {
    id: 'level_up_master',
    name: 'Level Up Master',
    description: 'Reach Level 3 in any XP system',
    icon: '🚀',
    category: ACHIEVEMENT_CATEGORIES.XP_MILESTONES,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Advance to Level 3 or higher'
  },
  {
    id: 'attachment_organizer',
    name: 'Organized Adventurer',
    description: 'Add attachments to 5 different quests',
    icon: '📎',
    category: ACHIEVEMENT_CATEGORIES.PRODUCTIVITY,
    unlocked: false,
    dateUnlocked: null,
    hint: 'Add attachments to 5 different quests'
  }
];

// Helper function to get achievement by ID
export const getAchievementById = (id) => {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
};

// Helper function to get achievements by category
export const getAchievementsByCategory = (category) => {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
};

// Helper function to count unlocked achievements
export const getUnlockedCount = (achievements) => {
  return achievements.filter(achievement => achievement.unlocked).length;
};

// Helper function to get achievement progress
export const getAchievementProgress = (achievements) => {
  const unlocked = getUnlockedCount(achievements);
  const total = achievements.length;
  return { unlocked, total, percentage: Math.round((unlocked / total) * 100) };
};