import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockXPData, mockQuests, mockCompletedQuests, mockRewards } from '../data/mock';

const XPContext = createContext();

const initialState = {
  xp: mockXPData,
  quests: mockQuests,
  completedQuests: mockCompletedQuests,
  rewards: mockRewards
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
    
    default:
      return state;
  }
}

export function XPProvider({ children }) {
  const [state, dispatch] = useReducer(xpReducer, initialState);
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('rpgLogState', JSON.stringify(state));
  }, [state]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('rpgLogState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Merge with initial state to ensure we have all required fields
        Object.keys(parsed).forEach(key => {
          if (key === 'xp') {
            dispatch({ type: 'LOAD_XP', payload: parsed[key] });
          } else if (key === 'quests') {
            dispatch({ type: 'LOAD_QUESTS', payload: parsed[key] });
          } else if (key === 'completedQuests') {
            dispatch({ type: 'LOAD_COMPLETED', payload: parsed[key] });
          }
        });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);
  
  return (
    <XPContext.Provider value={{ state, dispatch }}>
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