// Achievement Logic - Functions to check and unlock achievements
import { ACHIEVEMENTS } from '../data/achievements';

// Helper function to get today's date as string
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

// Main function to check and unlock achievements
export const checkAchievements = (state, action) => {
  const currentAchievements = [...state.achievements];
  const newlyUnlocked = [];
  const now = new Date().toISOString();
  
  // Helper function to unlock achievement
  const unlockAchievement = (achievementId) => {
    const index = currentAchievements.findIndex(a => a.id === achievementId);
    if (index !== -1 && !currentAchievements[index].unlocked) {
      currentAchievements[index] = {
        ...currentAchievements[index],
        unlocked: true,
        dateUnlocked: now
      };
      newlyUnlocked.push(currentAchievements[index]);
    }
  };

  // Check achievements based on action type
  switch (action.type) {
    case 'COMPLETE_QUEST':
      checkQuestCompletionAchievements(state, unlockAchievement);
      break;
    
    case 'CLAIM_REWARD':
      checkRewardAchievements(state, unlockAchievement);
      break;
    
    case 'USE_INVENTORY_ITEM':
      checkInventoryAchievements(state, unlockAchievement);
      break;
    
    case 'ADD_RECURRING_TASK':
      checkRecurringTaskAchievements(state, unlockAchievement);
      break;
    
    case 'APPLY_MONTHLY_BONUS':
      checkMonthlyBonusAchievements(state, unlockAchievement);
      break;
    
    default:
      // Check general achievements that don't depend on specific actions
      checkGeneralAchievements(state, unlockAchievement);
      break;
  }

  return { achievements: currentAchievements, newlyUnlocked };
};

// Check quest completion related achievements
const checkQuestCompletionAchievements = (state, unlockAchievement) => {
  const completedCount = state.xp.completedQuests;
  const questToComplete = state.quests.find(q => q.id === state.lastCompletedQuestId);
  
  // First quest completed
  if (completedCount >= 1) {
    unlockAchievement('first_quest');
  }
  
  // Quest milestones
  if (completedCount >= 5) {
    unlockAchievement('quest_master_5');
  }
  
  if (completedCount >= 25) {
    unlockAchievement('quest_master_25');
  }
  
  // Legendary quest achievement
  if (questToComplete && questToComplete.rank === 'legendary') {
    unlockAchievement('legendary_hunter');
  }
  
  // Important quest achievement
  const importantQuestsCompleted = state.completedQuests.filter(q => q.isImportant).length;
  if (importantQuestsCompleted >= 5) {
    unlockAchievement('important_quest_master');
  }
  
  // Procrastinator redeemed achievement
  if (questToComplete && questToComplete.progressStatus === 'delaying') {
    unlockAchievement('procrastinator_redeemed');
  }
  
  // Speed runner achievement (3 quests in one day)
  const today = getTodayString();
  const questsCompletedToday = state.completedQuests.filter(q => 
    isSameDay(q.dateCompleted, today)
  ).length;
  
  if (questsCompletedToday >= 3) {
    unlockAchievement('speed_runner');
  }
  
  // Weekly warrior achievement (quests on 7 different days)
  const uniqueCompletionDays = [...new Set(
    state.completedQuests.map(q => new Date(q.dateCompleted).toDateString())
  )];
  
  if (uniqueCompletionDays.length >= 7) {
    unlockAchievement('weekly_warrior');
  }
  
  // Perfectionist achievement (10 quests without abandoning)
  const abandonedQuests = state.completedQuests.filter(q => q.progressStatus === 'abandoned').length;
  if (completedCount >= 10 && abandonedQuests === 0) {
    unlockAchievement('perfectionist');
  }
};

// Check XP milestone achievements
const checkXPAchievements = (state, unlockAchievement) => {
  const totalXP = state.xp.totalEarned;
  
  if (totalXP >= 100) {
    unlockAchievement('xp_milestone_100');
  }
  
  if (totalXP >= 500) {
    unlockAchievement('xp_milestone_500');
  }
  
  if (totalXP >= 1000) {
    unlockAchievement('xp_milestone_1000');
  }
};

// Check reward related achievements
const checkRewardAchievements = (state, unlockAchievement) => {
  const totalSpent = state.xp.totalSpent;
  
  // First reward claimed
  if (state.inventory.length > 0 || state.claimedRewards.length > 0) {
    unlockAchievement('first_reward');
  }
  
  // Big spender achievement
  if (totalSpent >= 200) {
    unlockAchievement('reward_spender');
  }
};

// Check inventory usage achievements
const checkInventoryAchievements = (state, unlockAchievement) => {
  if (state.claimedRewards.length > 0) {
    unlockAchievement('inventory_user');
  }
};

// Check recurring task achievements
const checkRecurringTaskAchievements = (state, unlockAchievement) => {
  if (state.recurringTasks.length >= 3) {
    unlockAchievement('recurring_master');
  }
};

// Check monthly bonus achievements
const checkMonthlyBonusAchievements = (state, unlockAchievement) => {
  unlockAchievement('monthly_bonus_claimer');
};

// Check level achievement
const checkLevelAchievements = (state, unlockAchievement, currentLevel) => {
  if (currentLevel && currentLevel.level >= 3) {
    unlockAchievement('level_up_master');
  }
};

// Check general achievements that can be checked at any time
const checkGeneralAchievements = (state, unlockAchievement) => {
  checkXPAchievements(state, unlockAchievement);
  
  // Check attachment organizer achievement
  const questsWithAttachments = state.quests.filter(q => 
    q.attachments && q.attachments.length > 0
  ).length;
  
  const completedQuestsWithAttachments = state.completedQuests.filter(q => 
    q.attachments && q.attachments.length > 0
  ).length;
  
  if (questsWithAttachments + completedQuestsWithAttachments >= 5) {
    unlockAchievement('attachment_organizer');
  }
};

// Function to manually trigger achievement checks (useful for initial load)
export const triggerAchievementCheck = (state) => {
  return checkAchievements(state, { type: 'MANUAL_CHECK' });
};

// Function to initialize achievements in state if they don't exist
export const initializeAchievements = (existingAchievements = []) => {
  const initializedAchievements = ACHIEVEMENTS.map(achievement => {
    const existing = existingAchievements.find(a => a.id === achievement.id);
    return existing || { ...achievement };
  });
  
  return initializedAchievements;
};