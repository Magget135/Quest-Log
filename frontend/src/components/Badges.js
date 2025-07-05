import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ACHIEVEMENT_CATEGORIES, getAchievementProgress } from '../data/achievements';

const Badges = ({ achievements, className = '' }) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const progress = getAchievementProgress(achievements);
  
  // Filter achievements based on selected filters
  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = filterCategory === 'all' || achievement.category === filterCategory;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'unlocked' && achievement.unlocked) ||
      (filterStatus === 'locked' && !achievement.unlocked);
    
    return categoryMatch && statusMatch;
  });
  
  // Group achievements by category for better organization
  const groupedAchievements = filteredAchievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {});
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Achievement Progress Header */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>🏆</span>
              <span>Achievements & Badges</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">
              {progress.unlocked} of {progress.total} ({progress.percentage}%)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="space-y-2">
              <p className="text-gray-600">
                Track your progress and unlock badges by completing quests, earning XP, and exploring all features!
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-green-600 font-medium">
                  🔓 {progress.unlocked} Unlocked
                </span>
                <span className="text-gray-500">
                  🔒 {progress.total - progress.unlocked} Locked
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full md:w-48">
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {progress.percentage}% Complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🔍</span>
            <span>Filter Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Category
              </label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.values(ACHIEVEMENT_CATEGORIES).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Badges</SelectItem>
                  <SelectItem value="unlocked">Unlocked Only</SelectItem>
                  <SelectItem value="locked">Locked Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Achievement Grid */}
      <div className="space-y-6">
        {Object.keys(groupedAchievements).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium text-gray-600 mb-2">No badges found</p>
              <p className="text-gray-500">Try adjusting your filters to see more achievements.</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105
                        ${achievement.unlocked 
                          ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                        }
                      `}
                    >
                      {/* Unlock animation overlay */}
                      {achievement.unlocked && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                      
                      {/* Badge Icon */}
                      <div className="text-center mb-3">
                        <div className={`
                          text-4xl mb-2 transition-all duration-300
                          ${achievement.unlocked ? 'filter-none' : 'filter grayscale'}
                        `}>
                          {achievement.unlocked ? achievement.icon : '🔒'}
                        </div>
                        <h3 className={`
                          font-semibold text-lg
                          ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}
                        `}>
                          {achievement.name}
                        </h3>
                      </div>
                      
                      {/* Badge Description */}
                      <div className="text-center space-y-2">
                        <p className={`
                          text-sm
                          ${achievement.unlocked ? 'text-gray-700' : 'text-gray-500'}
                        `}>
                          {achievement.description}
                        </p>
                        
                        {/* Unlock Date or Hint */}
                        {achievement.unlocked ? (
                          <div className="text-xs text-green-600 font-medium">
                            🎉 Unlocked {formatDate(achievement.dateUnlocked)}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic">
                            💡 {achievement.hint}
                          </div>
                        )}
                      </div>
                      
                      {/* Badge Status */}
                      <div className="mt-3 text-center">
                        <Badge 
                          className={
                            achievement.unlocked 
                              ? 'bg-green-100 text-green-800 border-green-300' 
                              : 'bg-gray-100 text-gray-600 border-gray-300'
                          }
                          variant="outline"
                        >
                          {achievement.unlocked ? '🔓 Unlocked' : '🔒 Locked'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Achievement Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📊</span>
            <span>Achievement Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{progress.unlocked}</div>
              <div className="text-sm text-gray-600">Total Unlocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{progress.total - progress.unlocked}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{progress.percentage}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(ACHIEVEMENT_CATEGORIES).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Badges;