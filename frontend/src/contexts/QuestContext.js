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
      
      return {
        ...state,
        quests: state.quests.filter(q => q.id !== action.payload),
        completedQuests: [...state.completedQuests, completedQuest],
        xp: {
          ...state.xp,
          currentXP: state.xp.currentXP + questToComplete.xpReward,
          totalEarned: newTotalXP,
          completedQuests: state.xp.completedQuests + 1
        },
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
      
      return {
        ...state,
        inventory: [...state.inventory, inventoryItem],
        xp: {
          ...state.xp,
          currentXP: newCurrentXP,
          totalSpent: state.xp.totalSpent + reward.cost
        },
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
      
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload),
        claimedRewards: [...state.claimedRewards, claimedReward]
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
      return {
        ...state,
        recurringTasks: [...state.recurringTasks, { ...action.payload, id: Date.now().toString() }]
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
        return {
          ...state,
          xp: {
            ...state.xp,
            currentXP: state.xp.currentXP + bonusXP,
            totalEarned: state.xp.totalEarned + bonusXP,
            lastMonthlyBonus: new Date().toISOString()
          },
          notifications: [...state.notifications, {
            id: Date.now().toString(),
            type: 'monthly_bonus',
            message: `🎁 Monthly Bonus! +${bonusXP} XP earned!`,
            timestamp: new Date().toISOString()
          }]
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
        notifications: [{
          id: Date.now().toString(),
          type: 'reset',
          message: '🧨 All data has been reset! Ready for a fresh adventure!',
          timestamp: new Date().toISOString()
        }]
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