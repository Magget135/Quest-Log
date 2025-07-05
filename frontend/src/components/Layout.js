import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuest } from '../contexts/QuestContext';
import { Badge } from './ui/badge';

const Layout = ({ children }) => {
  const location = useLocation();
  const { state, getCurrentLevelInfo, getXPSystemInfo } = useQuest();
  
  const currentLevel = getCurrentLevelInfo();
  const xpSystem = getXPSystemInfo();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/archive', label: 'Archive', icon: '📚' },
    { path: '/rewards', label: 'Reward Store', icon: '🛍️' },
    { 
      path: '/inventory', 
      label: 'Inventory', 
      icon: '🎒',
      badge: state.inventory.length > 0 ? state.inventory.length : null
    },
    { path: '/recurring', label: 'Recurring Tasks', icon: '🔄' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold flex items-center">
                <span className="mr-2">⚔️</span>
                Quest Log
              </h1>
              <Badge className="bg-white/20 text-white border-white/30">
                {xpSystem.name}
              </Badge>
            </div>
            
            {/* Level & XP Display */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold">{state.xp.currentXP} XP</div>
                <div className="text-xs opacity-90">Current XP</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={`${currentLevel.color} text-sm px-3 py-1`}>
                  {currentLevel.icon} {currentLevel.title}
                </Badge>
                <div className="text-sm opacity-90">
                  Level {currentLevel.level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                  isActive(item.path)
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <Badge className="ml-2 bg-purple-100 text-purple-800">
                    {item.badge}
                  </Badge>
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