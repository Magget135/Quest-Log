import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useXP } from '../contexts/XPContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const Layout = ({ children }) => {
  const location = useLocation();
  const { state } = useXP();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/completed', label: 'Completed Quests', icon: '✅' },
    { path: '/rewards', label: 'Reward Store', icon: '🎁' },
    { path: '/recurring', label: 'Recurring Tasks', icon: '🔁' },
    { path: '/settings', label: 'Rules & Settings', icon: '⚙️' }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                RPG Log 🗡️
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-sm font-medium">
                ⭐ {state.xp.currentXP} XP
              </Badge>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;