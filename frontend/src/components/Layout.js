import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuest } from '../contexts/QuestContext';
import { Badge } from './ui/badge';
import LevelTooltip from './LevelTooltip';
import NavigationDropdown from './NavigationDropdown';

const Layout = ({ children }) => {
  const location = useLocation();
  const { state, getCurrentLevelInfo, getXPSystemInfo } = useQuest();
  
  const currentLevel = getCurrentLevelInfo();
  const xpSystem = getXPSystemInfo();
  
  const navItems = [
    { path: '/', label: 'Main Hall', icon: '🏰' },
    { path: '/archive', label: 'Chronicles', icon: '📜' },
    { path: '/rewards', label: 'Merchant', icon: '💰' },
    { 
      path: '/inventory', 
      label: 'Inventory', 
      icon: '🎒',
      badge: state.inventory.length > 0 ? state.inventory.length : null
    },
    { path: '/recurring', label: 'Daily Tasks', icon: '🔄' },
    { 
      path: '/achievements', 
      label: 'Honors', 
      icon: '🏆',
      badge: state.achievements ? state.achievements.filter(a => a.unlocked).length : null
    },
    { path: '/settings', label: 'Guild Hall', icon: '⚙️' }
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen">
      {/* Medieval Header */}
      <header className="wood-bg border-b-4 border-yellow-600 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold flex items-center text-yellow-100" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                <span className="mr-3 text-4xl">⚔️</span>
                Quest Tavern
              </h1>
              <div className="medieval-scroll px-3 py-1">
                <Badge className="bg-yellow-600 text-yellow-100 border-yellow-800 font-medium" style={{ fontFamily: 'Cinzel, serif' }}>
                  {xpSystem.name}
                </Badge>
              </div>
            </div>
            
            {/* Adventurer Status */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-100" style={{ fontFamily: 'Cinzel, serif' }}>
                  {state.xp.currentXP} XP
                </div>
                <div className="text-sm text-yellow-200" style={{ fontFamily: 'Cinzel, serif' }}>Gold Pieces</div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="medieval-scroll px-4 py-2">
                  <Badge className={`${currentLevel.color} text-sm px-3 py-1 font-bold`} style={{ fontFamily: 'Cinzel, serif' }}>
                    {currentLevel.icon} {currentLevel.title}
                  </Badge>
                </div>
                <div className="text-sm text-yellow-200" style={{ fontFamily: 'Cinzel, serif' }}>
                  Level {currentLevel.level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Medieval Navigation */}
      <nav className="parchment-bg border-b-2 border-yellow-800 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-4 border-b-4 transition-all duration-200 ${
                  isActive(item.path)
                    ? 'border-yellow-600 bg-yellow-50 text-yellow-800'
                    : 'border-transparent text-yellow-900 hover:text-yellow-700 hover:bg-yellow-50'
                }`}
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <div className="medieval-scroll px-2 py-1">
                    <Badge className="bg-yellow-600 text-yellow-100 text-xs font-bold">
                      {item.badge}
                    </Badge>
                  </div>
                )}
              </Link>
            ))}
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