import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuest } from '../contexts/QuestContext';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import LevelTooltip from './LevelTooltip';
import NavigationDropdown from './NavigationDropdown';
import UserProfile from './UserProfile';
import { getUserAvatar } from '../utils/avatarUtils';

const Layout = ({ children }) => {
  const location = useLocation();
  const { state, getCurrentLevelInfo, getXPSystemInfo } = useQuest();
  const { user } = useAuth();
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  const currentLevel = getCurrentLevelInfo();
  const xpSystem = getXPSystemInfo();
  
  const navItems = [
    { path: '/', label: 'Main Hall', icon: '🏰' },
    { 
      path: '/inventory', 
      label: 'Inventory', 
      icon: '🎒',
      badge: state.inventory.length > 0 ? state.inventory.length : null
    },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const shopItems = [
    { 
      path: '/rewards', 
      label: 'Enter Shop', 
      icon: '🏪',
      description: 'Opens the RPG-style reward store'
    },
    { 
      path: '/rewards/add', 
      label: 'Add Reward', 
      icon: '➕',
      description: 'Lets users manually create a new reward'
    }
  ];

  const historyItems = [
    { 
      path: '/archive', 
      label: 'Adventure Archive', 
      icon: '🧭',
      description: 'Completed quests and reward claims'
    },
    { 
      path: '/stats', 
      label: 'Journey Journal', 
      icon: '📊',
      description: 'Stats like total quests completed, rewards claimed, average XP per task'
    }
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen">
      {/* Medieval Header */}
      <header className="wood-bg border-b-4 border-blue-600 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold flex items-center text-blue-800" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                <span className="mr-3 text-4xl">⚔️</span>
                Quest Tavern
              </h1>
              <div className="medieval-scroll px-3 py-1">
                <Badge className="bg-blue-600 text-white border-blue-800 font-medium" style={{ fontFamily: 'Cinzel, serif' }}>
                  {xpSystem.name}
                </Badge>
              </div>
            </div>
            
            {/* Adventurer Status */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800" style={{ fontFamily: 'Cinzel, serif' }}>
                  {state.xp.currentXP} XP
                </div>
                <div className="text-sm text-blue-600" style={{ fontFamily: 'Cinzel, serif' }}>Gold Pieces</div>
              </div>
              
              <div className="flex items-center space-x-3">
                <LevelTooltip xpSystem={xpSystem} currentLevel={currentLevel}>
                  <div className="medieval-scroll px-4 py-2">
                    <Badge className={`${currentLevel.color} text-sm px-3 py-1 font-bold`} style={{ fontFamily: 'Cinzel, serif' }}>
                      {currentLevel.icon} {currentLevel.title}
                    </Badge>
                  </div>
                </LevelTooltip>
                <div className="text-sm text-blue-600" style={{ fontFamily: 'Cinzel, serif' }}>
                  Level {currentLevel.level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Medieval Navigation */}
      <nav className="parchment-bg border-b-2 border-blue-600 shadow-lg relative">
        <div className="container mx-auto px-4">
          <div className="flex space-x-2 relative items-center">
            {/* Main Hall */}
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-4 border-b-4 transition-colors duration-200 h-16 min-w-0 flex-shrink-0 ${
                isActive('/')
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-transparent text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <span className="text-lg">🏰</span>
              <span className="font-medium whitespace-nowrap">Main Hall</span>
            </Link>
            
            {/* Shop Dropdown */}
            <div className="relative h-16 w-auto">
              <NavigationDropdown
                icon="🏪"
                label="Shop"
                items={shopItems}
                isActive={isActive('/rewards')}
              />
            </div>
            
            {/* Inventory */}
            <Link
              to="/inventory"
              className={`flex items-center space-x-2 px-4 py-4 border-b-4 transition-colors duration-200 h-16 min-w-0 flex-shrink-0 ${
                isActive('/inventory')
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-transparent text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <span className="text-lg">🎒</span>
              <span className="font-medium whitespace-nowrap">Inventory</span>
              {state.inventory.length > 0 && (
                <div className="medieval-scroll px-2 py-1">
                  <Badge className="bg-blue-600 text-white text-xs font-bold">
                    {state.inventory.length}
                  </Badge>
                </div>
              )}
            </Link>
            
            {/* History Dropdown */}
            <div className="relative h-16 w-auto">
              <NavigationDropdown
                icon="📜"
                label="History"
                items={historyItems}
                isActive={isActive('/archive') || isActive('/stats')}
              />
            </div>
            
            {/* Achievements */}
            <Link
              to="/achievements"
              className={`flex items-center space-x-2 px-4 py-4 border-b-4 transition-colors duration-200 h-16 min-w-0 flex-shrink-0 ${
                isActive('/achievements')
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-transparent text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <span className="text-lg">🏆</span>
              <span className="font-medium whitespace-nowrap">Achievements</span>
              {state.achievements && state.achievements.filter(a => a.unlocked).length > 0 && (
                <div className="medieval-scroll px-2 py-1">
                  <Badge className="bg-blue-600 text-white text-xs font-bold">
                    {state.achievements.filter(a => a.unlocked).length}
                  </Badge>
                </div>
              )}
            </Link>
            
            {/* Settings */}
            <Link
              to="/settings"
              className={`flex items-center space-x-2 px-4 py-4 border-b-4 transition-colors duration-200 h-16 min-w-0 flex-shrink-0 ${
                isActive('/settings')
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-transparent text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <span className="text-lg">⚙️</span>
              <span className="font-medium whitespace-nowrap">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;