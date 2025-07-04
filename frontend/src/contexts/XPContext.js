import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockXPData, mockQuests, mockCompletedQuests, mockRewards, mockCustomRewards, mockLevels } from '../data/mock';

const XPContext = createContext();

const initialState = {
  xp: mockXPData,
  quests: mockQuests,
  completedQuests: mockCompletedQuests,
  rewards: [...mockRewards, ...mockCustomRewards],
  levels: mockLevels
};

// Helper function to get current level
const getCurrentLevel = (totalEarned, levels) => {
  const sortedLevels = [...levels].sort((a, b) => b.xpRequired - a.xpRequired);
  const currentLevel = sortedLevels.find(level => totalEarned >= level.xpRequired);
  return currentLevel || levels[0];
};

// Helper function to get next level
const getNextLevel = (totalEarned, levels) => {
  const sortedLevels = [...levels].sort((a, b) => a.xpRequired - b.xpRequired);
  const nextLevel = sortedLevels.find(level => totalEarned < level.xpRequired);
  return nextLevel || null;
};

// Helper function to get level progress
const getLevelProgress = (totalEarned, levels) => {
  const currentLevel = getCurrentLevel(totalEarned, levels);
  const nextLevel = getNextLevel(totalEarned, levels);
  
  if (!nextLevel) {
    return { progress: 100, progressXP: 0, totalXPForNext: 0 };
  }
  
  const progressXP = totalEarned - currentLevel.xpRequired;
  const totalXPForNext = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = (progressXP / totalXPForNext) * 100;
  
  return { progress, progressXP, totalXPForNext };
};

function xpReducer(state, action) {
  switch (action.type) {
    case 'ADD_QUEST':
      return {
        ...state,
        quests: [...state.quests, { ...action.payload, id: Date.now().toString() }]
      };
    
    case 'UPDATE_QUEST':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload.id ? { ...quest, ...action.payload } : quest
        )
      };
    
    case 'COMPLETE_QUEST':
      const questToComplete = state.quests.find(q => q.id === action.payload);
      if (!questToComplete) return state;
      
      const completedQuest = {
        ...questToComplete,
        dateCompleted: new Date().toISOString(),
        xpEarned: questToComplete.xpReward
      };
      
      return {
        ...state,
        quests: state.quests.filter(q => q.id !== action.payload),
        completedQuests: [...state.completedQuests, completedQuest],
        xp: {
          ...state.xp,
          currentXP: state.xp.currentXP + questToComplete.xpReward,
          totalEarned: state.xp.totalEarned + questToComplete.xpReward,
          completedQuests: state.xp.completedQuests + 1
        }
      };
    
    case 'REDEEM_REWARD':
      const reward = state.rewards.find(r => r.id === action.payload);
      if (!reward || state.xp.currentXP < reward.cost) return state;
      
      return {
        ...state,
        xp: {
          ...state.xp,
          currentXP: state.xp.currentXP - reward.cost,
          totalSpent: state.xp.totalSpent + reward.cost
        }
      };
    
    case 'DELETE_QUEST':
      return {
        ...state,
        quests: state.quests.filter(q => q.id !== action.payload)
      };
    
    case 'ADD_CUSTOM_REWARD':
      return {
        ...state,
        rewards: [...state.rewards, { ...action.payload, id: Date.now().toString(), isCustom: true }]
      };
    
    case 'UPDATE_CUSTOM_REWARD':
      return {
        ...state,
        rewards: state.rewards.map(reward =>
          reward.id === action.payload.id ? { ...reward, ...action.payload } : reward
        )
      };
    
    case 'DELETE_CUSTOM_REWARD':
      return {
        ...state,
        rewards: state.rewards.filter(r => r.id !== action.payload)
      };
    
    case 'UPDATE_LEVELS':
      return {
        ...state,
        levels: action.payload
      };
    
    case 'RESET_ALL':
      return initialState;
    
    default:
      return state;
  }
}

export function XPProvider({ children }) {
  const [state, dispatch] = useReducer(xpReducer, initialState);
  
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
        // Dispatch actions to load each part of the state
        if (parsed.xp) state.xp = parsed.xp;
        if (parsed.quests) state.quests = parsed.quests;
        if (parsed.completedQuests) state.completedQuests = parsed.completedQuests;
        if (parsed.rewards) state.rewards = parsed.rewards;
        if (parsed.levels) state.levels = parsed.levels;
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);
  
  // Helper functions for level system
  const getCurrentLevel = () => getCurrentLevel(state.xp.totalEarned, state.levels);
  const getNextLevel = () => getNextLevel(state.xp.totalEarned, state.levels);
  const getLevelProgress = () => getLevelProgress(state.xp.totalEarned, state.levels);
  
  const contextValue = {
    state,
    dispatch,
    getCurrentLevel,
    getNextLevel,
    getLevelProgress
  };
  
  return (
    <XPContext.Provider value={contextValue}>
      {children}
    </XPContext.Provider>
  );
}

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};