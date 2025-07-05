import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  mockXPData, 
  mockQuests, 
  mockCompletedQuests, 
  mockRewards, 
  mockInventory, 
  mockClaimedRewards, 
  mockSettings,
  mockRecurringTasks 
} from '../data/mock';
import { getXPSystem, getCurrentLevel, getLevelProgress } from '../data/xpSystems';
import { isCurrentMonth } from '../utils/timeUtils';
import { checkAchievements, initializeAchievements } from '../utils/achievementLogic';

const QuestContext = createContext();

const initialState = {
  xp: mockXPData,
  quests: mockQuests,
  completedQuests: mockCompletedQuests,
  rewards: mockRewards,
  inventory: mockInventory,
  claimedRewards: mockClaimedRewards,
  settings: mockSettings,
  recurringTasks: mockRecurringTasks,
  achievements: initializeAchievements(),
  notifications: []
};

function questReducer(state, action) {
  switch (action.type) {
    case 'ADD_QUEST':
      return {
        ...state,
        quests: [...state.quests, { 
          ...action.payload, 
          id: Date.now().toString(),
          progressStatus: action.payload.progressStatus || 'not_started'
        }]
      };
    
    case 'UPDATE_QUEST':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload.id ? { ...quest, ...action.payload } : quest
        )
      };

    case 'UPDATE_QUEST_PROGRESS':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload.id 
            ? { ...quest, progressStatus: action.payload.progressStatus } 
            : quest
        )
      };
    
    case 'DELETE_QUEST':
      return {
        ...state,
        quests: state.quests.filter(q => q.id !== action.payload)
      };
    
    case 'COMPLETE_QUEST':
      const questToComplete = state.quests.find(q => q.id === action.payload);
      if (!questToComplete) return state;
      
      const completedQuest = {
        ...questToComplete,
        dateCompleted: new Date().toISOString(),
        xpEarned: questToComplete.xpReward
      };
      
      const newTotalXP = state.xp.totalEarned + questToComplete.xpReward;
      const currentXPSystem = getXPSystem(state.settings.xpSystem);
      const oldLevel = getCurrentLevel(state.xp.totalEarned, currentXPSystem);
      const newLevel = getCurrentLevel(newTotalXP, currentXPSystem);
      
      const notifications = [];
      if (newLevel.level > oldLevel.level) {
        notifications.push({
          id: Date.now().toString(),
          type: 'level_up',
          message: `🎉 Level Up! You're now a ${newLevel.title}!`,
          timestamp: new Date().toISOString()
        });
      }
      
      // Create intermediate state for achievement checking
      const intermediateState = {
        ...state,
        quests: state.quests.filter(q => q.id !== action.payload),
        completedQuests: [...state.completedQuests, completedQuest],
        xp: {
          ...state.xp,
          currentXP: state.xp.currentXP + questToComplete.xpReward,
          totalEarned: newTotalXP,
          completedQuests: state.xp.completedQuests + 1
        },
        lastCompletedQuestId: action.payload // Helper for achievement logic
      };
      
      // Check for achievements
      const achievementResult = checkAchievements(intermediateState, { type: 'COMPLETE_QUEST' });
      
      // Add achievement unlock notifications
      achievementResult.newlyUnlocked.forEach(achievement => {
        notifications.push({
          id: `achievement_${Date.now()}_${achievement.id}`,
          type: 'achievement_unlock',
          message: `🎉 Achievement Unlocked: ${achievement.name}!`,
          achievement: achievement,
          timestamp: new Date().toISOString()
        });
      });
      
      return {
        ...intermediateState,
        achievements: achievementResult.achievements,
        notifications: [...state.notifications, ...notifications]
      };
    
    case 'CLAIM_REWARD':
      const reward = state.rewards.find(r => r.id === action.payload);
      if (!reward || state.xp.currentXP < reward.cost) return state;
      
      const inventoryItem = {
        id: `inv_${Date.now()}`,
        rewardId: reward.id,
        rewardName: reward.name,
        dateClaimed: new Date().toISOString(),
        xpCost: reward.cost,
        description: reward.description
      };
      
      const newCurrentXP = state.xp.currentXP - reward.cost;
      const oldLevelForReward = getCurrentLevel(state.xp.totalEarned, getXPSystem(state.settings.xpSystem));
      const newLevelForReward = getCurrentLevel(state.xp.totalEarned, getXPSystem(state.settings.xpSystem));
      
      const rewardNotifications = [];
      if (newLevelForReward.level < oldLevelForReward.level) {
        rewardNotifications.push({
          id: Date.now().toString(),
          type: 'level_down',
          message: `📉 Level Down! You're now a ${newLevelForReward.title}.`,
          timestamp: new Date().toISOString()
        });
      }
      
      // Create intermediate state for achievement checking
      const intermediateRewardState = {
        ...state,
        inventory: [...state.inventory, inventoryItem],
        xp: {
          ...state.xp,
          currentXP: newCurrentXP,
          totalSpent: state.xp.totalSpent + reward.cost
        }
      };
      
      // Check for achievements
      const rewardAchievementResult = checkAchievements(intermediateRewardState, { type: 'CLAIM_REWARD' });
      
      // Add achievement unlock notifications
      rewardAchievementResult.newlyUnlocked.forEach(achievement => {
        rewardNotifications.push({
          id: `achievement_${Date.now()}_${achievement.id}`,
          type: 'achievement_unlock',
          message: `🎉 Achievement Unlocked: ${achievement.name}!`,
          achievement: achievement,
          timestamp: new Date().toISOString()
        });
      });
      
      return {
        ...intermediateRewardState,
        achievements: rewardAchievementResult.achievements,
        notifications: [...state.notifications, ...rewardNotifications]
      };
    
    case 'USE_INVENTORY_ITEM':
      const itemToUse = state.inventory.find(item => item.id === action.payload);
      if (!itemToUse) return state;
      
      const claimedReward = {
        id: `claimed_${Date.now()}`,
        rewardName: itemToUse.rewardName,
        xpCost: itemToUse.xpCost,
        dateClaimed: itemToUse.dateClaimed,
        dateUsed: new Date().toISOString()
      };
      
      // Create intermediate state for achievement checking
      const intermediateInventoryState = {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload),
        claimedRewards: [...state.claimedRewards, claimedReward]
      };
      
      // Check for achievements
      const inventoryAchievementResult = checkAchievements(intermediateInventoryState, { type: 'USE_INVENTORY_ITEM' });
      
      // Add achievement unlock notifications
      const inventoryNotifications = [];
      inventoryAchievementResult.newlyUnlocked.forEach(achievement => {
        inventoryNotifications.push({
          id: `achievement_${Date.now()}_${achievement.id}`,
          type: 'achievement_unlock',
          message: `🎉 Achievement Unlocked: ${achievement.name}!`,
          achievement: achievement,
          timestamp: new Date().toISOString()
        });
      });
      
      return {
        ...intermediateInventoryState,
        achievements: inventoryAchievementResult.achievements,
        notifications: [...state.notifications, ...inventoryNotifications]
      };
    
    case 'ADD_REWARD':
      return {
        ...state,
        rewards: [...state.rewards, { ...action.payload, id: Date.now().toString(), isCustom: true }]
      };
    
    case 'UPDATE_REWARD':
      return {
        ...state,
        rewards: state.rewards.map(reward =>
          reward.id === action.payload.id ? { ...reward, ...action.payload } : reward
        )
      };
    
    case 'DELETE_REWARD':
      return {
        ...state,
        rewards: state.rewards.filter(r => r.id !== action.payload)
      };
    
    case 'ADD_RECURRING_TASK':
      // Create intermediate state for achievement checking
      const intermediateRecurringState = {
        ...state,
        recurringTasks: [...state.recurringTasks, { 
          ...action.payload, 
          id: Date.now().toString(),
          startBeforeDue: action.payload.startBeforeDue || 0,
          customFrequency: action.payload.customFrequency || null,
          yearlyDate: action.payload.yearlyDate || null
        }]
      };
      
      // Check for achievements
      const recurringAchievementResult = checkAchievements(intermediateRecurringState, { type: 'ADD_RECURRING_TASK' });
      
      // Add achievement unlock notifications
      const recurringNotifications = [];
      recurringAchievementResult.newlyUnlocked.forEach(achievement => {
        recurringNotifications.push({
          id: `achievement_${Date.now()}_${achievement.id}`,
          type: 'achievement_unlock',
          message: `🎉 Achievement Unlocked: ${achievement.name}!`,
          achievement: achievement,
          timestamp: new Date().toISOString()
        });
      });
      
      return {
        ...intermediateRecurringState,
        achievements: recurringAchievementResult.achievements,
        notifications: [...state.notifications, ...recurringNotifications]
      };
    
    case 'UPDATE_RECURRING_TASK':
      return {
        ...state,
        recurringTasks: state.recurringTasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };
    
    case 'DELETE_RECURRING_TASK':
      return {
        ...state,
        recurringTasks: state.recurringTasks.filter(t => t.id !== action.payload)
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'CHANGE_XP_SYSTEM':
      const newXPSystem = getXPSystem(action.payload);
      // Reset rewards to be within new range
      const updatedRewards = state.rewards.map(reward => ({
        ...reward,
        cost: Math.min(reward.cost, newXPSystem.rewardRange.max)
      }));
      
      return {
        ...state,
        settings: { ...state.settings, xpSystem: action.payload },
        rewards: updatedRewards
      };
    
    case 'APPLY_MONTHLY_BONUS':
      // Check if bonus already claimed this month
      if (isCurrentMonth(state.xp.lastMonthlyBonus)) {
        return state; // No bonus if already claimed this month
      }
      
      const xpSystem = getXPSystem(state.settings.xpSystem);
      const userLevel = getCurrentLevel(state.xp.totalEarned, xpSystem);
      const bonusXP = xpSystem.monthlyBonusXP[userLevel.level - 1] || 0;
      
      if (bonusXP > 0) {
        // Create intermediate state for achievement checking
        const intermediateMonthlyState = {
          ...state,
          xp: {
            ...state.xp,
            currentXP: state.xp.currentXP + bonusXP,
            totalEarned: state.xp.totalEarned + bonusXP,
            lastMonthlyBonus: new Date().toISOString()
          }
        };
        
        // Check for achievements
        const monthlyAchievementResult = checkAchievements(intermediateMonthlyState, { type: 'APPLY_MONTHLY_BONUS' });
        
        // Create notifications
        const monthlyNotifications = [{
          id: Date.now().toString(),
          type: 'monthly_bonus',
          message: `🎁 Monthly Bonus! +${bonusXP} XP earned!`,
          timestamp: new Date().toISOString()
        }];
        
        // Add achievement unlock notifications
        monthlyAchievementResult.newlyUnlocked.forEach(achievement => {
          monthlyNotifications.push({
            id: `achievement_${Date.now()}_${achievement.id}`,
            type: 'achievement_unlock',
            message: `🎉 Achievement Unlocked: ${achievement.name}!`,
            achievement: achievement,
            timestamp: new Date().toISOString()
          });
        });
        
        return {
          ...intermediateMonthlyState,
          achievements: monthlyAchievementResult.achievements,
          notifications: [...state.notifications, ...monthlyNotifications]
        };
      }
      return state;
    
    case 'RESET_EVERYTHING':
      // Keep only default systems and settings structure
      const { eraseRewards = true, resetXPSystem = false } = action.payload || {};
      
      return {
        xp: {
          currentXP: 0,
          totalEarned: 0,
          totalSpent: 0,
          completedQuests: 0,
          lastMonthlyBonus: null
        },
        quests: [],
        completedQuests: [],
        rewards: eraseRewards ? mockRewards.filter(r => !r.isCustom) : state.rewards,
        inventory: [],
        claimedRewards: eraseRewards ? [] : state.claimedRewards,
        settings: {
          xpSystem: resetXPSystem ? 'default' : state.settings.xpSystem,
          autoCleanup: {
            enabled: false,
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
        },
        recurringTasks: [],
        achievements: initializeAchievements(), // Reset achievements to initial state
        notifications: [{
          id: Date.now().toString(),
          type: 'reset',
          message: '🧨 All data has been reset! Ready for a fresh adventure!',
          timestamp: new Date().toISOString()
        }]
      };
    
    case 'LOAD_STATE':
      // Load state from localStorage and ensure achievements are properly initialized
      const loadedState = action.payload;
      return {
        ...loadedState,
        achievements: initializeAchievements(loadedState.achievements || [])
      };
    
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'RESET_ALL':
      return initialState;
    
    default:
      return state;
  }
}

export function QuestProvider({ children }) {
  const [state, dispatch] = useReducer(questReducer, initialState);
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('questLogState', JSON.stringify(state));
  }, [state]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('questLogState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Merge with current state to ensure new features are included
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);
  
  // Helper functions
  const getCurrentLevelInfo = () => {
    const xpSystem = getXPSystem(state.settings.xpSystem);
    return getCurrentLevel(state.xp.totalEarned, xpSystem);
  };
  
  const getLevelProgressInfo = () => {
    const xpSystem = getXPSystem(state.settings.xpSystem);
    return getLevelProgress(state.xp.totalEarned, xpSystem);
  };
  
  const getXPSystemInfo = () => {
    return getXPSystem(state.settings.xpSystem);
  };
  
  const canAffordReward = (cost) => {
    return state.xp.currentXP >= cost;
  };
  
  const canClaimMonthlyBonus = () => {
    return !isCurrentMonth(state.xp.lastMonthlyBonus);
  };
  
  const contextValue = {
    state,
    dispatch,
    getCurrentLevelInfo,
    getLevelProgressInfo,
    getXPSystemInfo,
    canAffordReward,
    canClaimMonthlyBonus
  };
  
  return (
    <QuestContext.Provider value={contextValue}>
      {children}
    </QuestContext.Provider>
  );
}

export const useQuest = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuest must be used within a QuestProvider');
  }
  return context;
};