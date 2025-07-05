import React, { useState, useEffect } from 'react';
import { useQuest } from '../contexts/QuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Switch } from '../components/ui/switch';
import { useToast } from '../hooks/use-toast';
import { formatRelativeDueDate, getDueDateColor, getPastDueInfo } from '../utils/timeUtils';
import QuestEditModal from '../components/QuestEditModal';
import MonthlyBonusPopup from '../components/MonthlyBonusPopup';
import CalendarView from '../components/CalendarView';
import TaskProgressBadge from '../components/TaskProgressBadge';
import Badges from '../components/Badges';
import { getAchievementProgress } from '../data/achievements';

const Dashboard = () => {
  const { state, dispatch, getCurrentLevelInfo, getLevelProgressInfo, getXPSystemInfo } = useQuest();
  const { toast } = useToast();
  
  const [newQuest, setNewQuest] = useState({
    name: '',
    rank: '',
    dueDate: '',
    dueTime: '',
    description: '',
    isImportant: false
  });
  
  const [editingQuest, setEditingQuest] = useState(null);
  const [sortOption, setSortOption] = useState(() => {
    return localStorage.getItem('questSortOption') || 'due_date_asc';
  });
  const [showAchievements, setShowAchievements] = useState(false);
  
  const currentLevel = getCurrentLevelInfo();
  const levelProgress = getLevelProgressInfo();
  const xpSystem = getXPSystemInfo();
  const achievementProgress = getAchievementProgress(state.achievements || []);

  // Show achievement unlock notifications
  useEffect(() => {
    const achievementNotifications = state.notifications?.filter(n => n.type === 'achievement_unlock') || [];
    achievementNotifications.forEach(notification => {
      if (notification.achievement) {
        toast({
          title: "🎉 Achievement Unlocked!",
          description: (
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{notification.achievement.icon}</span>
              <div>
                <div className="font-semibold">{notification.achievement.name}</div>
                <div className="text-sm text-gray-600">{notification.achievement.description}</div>
              </div>
            </div>
          ),
          duration: 5000,
          className: "border-yellow-200 bg-yellow-50"
        });
        
        // Dismiss the notification after showing it
        dispatch({ type: 'DISMISS_NOTIFICATION', payload: notification.id });
      }
    });
  }, [state.notifications, toast, dispatch]);

  // Sorting options
  const sortOptions = [
    { value: 'due_date_asc', label: 'Due Date (Chronological)' },
    { value: 'due_date_desc', label: 'Due Date (Newest First)' },
    { value: 'xp_high_low', label: 'XP (High to Low)' },
    { value: 'xp_low_high', label: 'XP (Low to High)' },
    { value: 'status_priority', label: 'Status Priority' },
    { value: 'name_a_z', label: 'Name (A-Z)' },
    { value: 'name_z_a', label: 'Name (Z-A)' }
  ];

  // Sort quests based on selected option
  const getSortedQuests = () => {
    const questsCopy = [...state.quests];
    
    switch (sortOption) {
      case 'due_date_asc':
        return questsCopy.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      case 'due_date_desc':
        return questsCopy.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      case 'xp_high_low':
        return questsCopy.sort((a, b) => b.xpReward - a.xpReward);
      case 'xp_low_high':
        return questsCopy.sort((a, b) => a.xpReward - b.xpReward);
      case 'status_priority':
        const statusOrder = {
          'not_started': 1,
          'pending': 2,
          'in_progress': 3,
          'delaying': 4,
          'on_hold': 5,
          'almost_done': 6,
          'abandoned': 7
        };
        return questsCopy.sort((a, b) => {
          const statusA = statusOrder[a.progressStatus] || 1;
          const statusB = statusOrder[b.progressStatus] || 1;
          return statusA - statusB;
        });
      case 'name_a_z':
        return questsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_z_a':
        return questsCopy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return questsCopy;
    }
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    localStorage.setItem('questSortOption', newSortOption);
  };
  
  const handleAddQuest = () => {
    if (!newQuest.name || !newQuest.rank || !newQuest.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in quest name, rank, and due date.",
        variant: "destructive"
      });
      return;
    }
    
    // Combine date and time if time is provided
    let fullDueDate = newQuest.dueDate;
    if (newQuest.dueTime) {
      fullDueDate = `${newQuest.dueDate}T${newQuest.dueTime}`;
    }
    
    // Find XP for selected rank
    const selectedRank = xpSystem.ranks.find(r => r.value === newQuest.rank);
    const xpReward = selectedRank ? selectedRank.xp : 0;
    
    const questWithXP = {
      ...newQuest,
      dueDate: fullDueDate,
      xpReward,
      dateAdded: new Date().toISOString().split('T')[0],
      attachments: []
    };
    
    dispatch({ type: 'ADD_QUEST', payload: questWithXP });
    setNewQuest({
      name: '',
      rank: '',
      dueDate: '',
      dueTime: '',
      description: '',
      isImportant: false
    });
    
    toast({
      title: "Quest Added! 📜",
      description: `"${newQuest.name}" has been added to your quest log.`
    });
  };
  
  const handleCompleteQuest = (questId) => {
    dispatch({ type: 'COMPLETE_QUEST', payload: questId });
    toast({
      title: "Quest Completed! 🎉",
      description: "XP has been added to your total!"
    });
  };
  
  const handleEditQuest = (quest) => {
    setEditingQuest(quest);
  };
  
  const handleDeleteQuest = (questId) => {
    dispatch({ type: 'DELETE_QUEST', payload: questId });
    toast({
      title: "Quest Deleted",
      description: "Quest has been removed from your log."
    });
  };

  const handleProgressChange = (questId, newStatus) => {
    dispatch({ 
      type: 'UPDATE_QUEST_PROGRESS', 
      payload: { id: questId, progressStatus: newStatus } 
    });
  };
  
  const getRankColor = (rank) => {
    const rankObj = xpSystem.ranks.find(r => r.value === rank);
    return rankObj ? rankObj.color : 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <MonthlyBonusPopup />
      
      {/* Hero Section - Level & XP Summary */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-xl">
            <span className="text-2xl">🏆</span>
            <span>Adventurer Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Level Progress */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge className={`${currentLevel.color} text-lg px-4 py-2 font-semibold`}>
                  {currentLevel.icon} {currentLevel.title}
                </Badge>
                <span className="text-lg text-gray-600 font-medium">
                  Level {currentLevel.level}
                </span>
              </div>
              
              {currentLevel.nextLevelXP && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progress to Level {currentLevel.level + 1}</span>
                    <span>{levelProgress.progressXP}/{levelProgress.totalXPForNext} XP</span>
                  </div>
                  <Progress value={levelProgress.progress} className="h-3" />
                  <div className="text-sm text-gray-500 font-medium">
                    {Math.round(levelProgress.progress)}% complete
                  </div>
                </div>
              )}
              
              {!currentLevel.nextLevelXP && (
                <div className="text-base text-purple-600 font-bold bg-purple-50 p-3 rounded-lg">
                  🌟 Maximum level achieved! You are a true legend!
                </div>
              )}
            </div>
            
            {/* XP & Achievement Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-yellow-600">{state.xp.currentXP}</div>
                <div className="text-sm text-gray-600 font-medium">Current XP</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-green-600">{state.xp.totalEarned}</div>
                <div className="text-sm text-gray-600 font-medium">Total Earned</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600">{state.xp.completedQuests}</div>
                <div className="text-sm text-gray-600 font-medium">Completed</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-purple-600">{achievementProgress.unlocked}</div>
                <div className="text-sm text-gray-600 font-medium">Achievements</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout for Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - Quest Management (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Quick Add Quest - Compact Version */}
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <span>📜</span>
                <span>Quick Add Quest</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    value={newQuest.name}
                    onChange={(e) => setNewQuest({ ...newQuest, name: e.target.value })}
                    placeholder="What needs to be done?"
                    className="border-purple-200 focus:border-purple-500 text-base"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={newQuest.rank} onValueChange={(value) => setNewQuest({ ...newQuest, rank: value })}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-500">
                      <SelectValue placeholder="Rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {xpSystem.ranks.map(rank => (
                        <SelectItem key={rank.value} value={rank.value}>
                          <Badge className={rank.color} variant="outline">
                            {rank.label}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="date"
                  value={newQuest.dueDate}
                  onChange={(e) => setNewQuest({ ...newQuest, dueDate: e.target.value })}
                  className="border-purple-200 focus:border-purple-500"
                />
                <Input
                  type="time"
                  value={newQuest.dueTime}
                  onChange={(e) => setNewQuest({ ...newQuest, dueTime: e.target.value })}
                  placeholder="Time (optional)"
                  className="border-purple-200 focus:border-purple-500"
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newQuest.isImportant}
                    onCheckedChange={(checked) => setNewQuest({ ...newQuest, isImportant: checked })}
                  />
                  <Label className="text-sm font-medium">Important</Label>
                </div>
              </div>
              
              {/* Expandable Description */}
              {newQuest.description || false ? (
                <Textarea
                  value={newQuest.description}
                  onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                  placeholder="Add description (optional)..."
                  className="border-purple-200 focus:border-purple-500"
                  rows={2}
                />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewQuest({ ...newQuest, description: '' })}
                  className="text-gray-600"
                >
                  + Add Description
                </Button>
              )}
              
              <Button 
                onClick={handleAddQuest} 
                className="w-full bg-purple-600 hover:bg-purple-700 font-semibold py-2"
                disabled={!newQuest.name || !newQuest.rank || !newQuest.dueDate}
              >
                ⚔️ Add Quest
              </Button>
            </CardContent>
          </Card>
          
          {/* Active Quest Log */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">⚔️</span>
                  <span>Active Quest Log</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="sort-select" className="text-sm text-gray-600">Sort:</Label>
                    <Select value={sortOption} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-48 h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {state.quests.length} active
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getSortedQuests().map((quest) => {
                  const pastDueInfo = getPastDueInfo(quest.dueDate);
                  
                  return (
                    <div
                      key={quest.id}
                      className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${getDueDateColor(quest.dueDate)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">{quest.name}</h3>
                            <Badge className={getRankColor(quest.rank)} variant="outline">
                              {quest.rank}
                            </Badge>
                            <TaskProgressBadge
                              questId={quest.id}
                              currentStatus={quest.progressStatus || 'not_started'}
                              onStatusChange={handleProgressChange}
                              size="sm"
                            />
                            {quest.isImportant && (
                              <Badge variant="outline" className="border-yellow-400 text-yellow-700">
                                ⭐ Important
                              </Badge>
                            )}
                            {pastDueInfo && (
                              <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                                {pastDueInfo}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>📅 {formatRelativeDueDate(quest.dueDate)}</span>
                            <span>✨ {quest.xpReward} XP</span>
                          </div>
                          
                          {quest.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {quest.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditQuest(quest)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleCompleteQuest(quest.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✅
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteQuest(quest.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {state.quests.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">⚔️</div>
                    <p className="text-lg font-medium mb-2">No active quests</p>
                    <p>Create your first quest above to begin your adventure! 🎯</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Achievements & Quick Stats (1/3 width) */}
        <div className="space-y-6">
          
          {/* Quick Achievement Overview */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <span>🏆</span>
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {achievementProgress.unlocked}/{achievementProgress.total}
                </div>
                <div className="text-sm text-gray-600 mb-3">Badges Unlocked</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${achievementProgress.percentage}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-indigo-600">
                  {achievementProgress.percentage}% Complete
                </div>
              </div>
              
              {/* Recent Achievements */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Recent Unlocks:</h4>
                {state.achievements
                  ?.filter(a => a.unlocked)
                  ?.slice(-3)
                  ?.reverse()
                  ?.map(achievement => (
                    <div
                      key={achievement.id}
                      className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-indigo-100"
                    >
                      <span className="text-lg">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  )) || (
                  <p className="text-sm text-gray-500 italic text-center py-2">
                    Complete quests to unlock achievements!
                  </p>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAchievements(!showAchievements)}
                className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                View All Achievements
              </Button>
            </CardContent>
          </Card>

          {/* Calendar Preview */}
          {state.settings.calendarView?.enabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <span>📅</span>
                  <span>Quest Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarView onEditQuest={handleEditQuest} compact={true} />
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Full Achievements View (when expanded) */}
      {showAchievements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>🏆</span>
                <span>All Achievements</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAchievements(false)}
                className="text-gray-600"
              >
                Collapse
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badges achievements={state.achievements || []} />
          </CardContent>
        </Card>
      )}
      
      {/* Quest Edit Modal */}
      {editingQuest && (
        <QuestEditModal
          quest={editingQuest}
          isOpen={!!editingQuest}
          onClose={() => setEditingQuest(null)}
          onSave={(updatedQuest) => {
            dispatch({ type: 'UPDATE_QUEST', payload: updatedQuest });
            setEditingQuest(null);
            toast({
              title: "Quest Updated! 📝",
              description: "Your quest has been successfully updated."
            });
          }}
          xpSystem={xpSystem}
        />
      )}
    </div>
  );
};

export default Dashboard;