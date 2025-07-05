import React, { useState } from 'react';
import { useXP } from '../contexts/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { questRanks, questStatuses } from '../data/mock';
import { formatRelativeDueDate, getDateStatus } from '../utils/timeUtils';

const Dashboard = () => {
  const { state, dispatch, getCurrentLevel, getNextLevel, getLevelProgress } = useXP();
  const { toast } = useToast();
  const [newQuest, setNewQuest] = useState({
    name: '',
    rank: '',
    dueDate: '',
    dueTime: '',
    status: 'Pending',
    reward: '',
    xpReward: 0
  });
  
  const [selectedReward, setSelectedReward] = useState('');
  
  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const levelProgress = getLevelProgress();
  
  const getDateColor = (dueDate) => {
    const status = getDateStatus(dueDate);
    switch (status) {
      case 'overdue': return 'border-l-red-500 bg-red-50';
      case 'today': return 'border-l-blue-500 bg-blue-50';
      case 'future': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };
  
  const getRankColor = (rank) => {
    const rankObj = questRanks.find(r => r.value === rank);
    return rankObj ? rankObj.color : 'bg-gray-100 text-gray-800';
  };
  
  const getStatusIcon = (status) => {
    const statusObj = questStatuses.find(s => s.value === status);
    return statusObj ? statusObj.icon : '⏳';
  };
  
  const getXPByRank = (rank) => {
    switch (rank) {
      case 'Common': return 50;
      case 'Rare': return 75;
      case 'Epic': return 150;
      case 'Legendary': return 200;
      default: return 50;
    }
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
    
    const questWithXP = {
      ...newQuest,
      dueDate: fullDueDate,
      xpReward: getXPByRank(newQuest.rank),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    dispatch({ type: 'ADD_QUEST', payload: questWithXP });
    setNewQuest({
      name: '',
      rank: '',
      dueDate: '',
      dueTime: '',
      status: 'Pending',
      reward: '',
      xpReward: 0
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
  
  const handleRedeemReward = () => {
    if (!selectedReward) return;
    
    const reward = state.rewards.find(r => r.id === selectedReward);
    if (!reward) return;
    
    if (state.xp.currentXP < reward.cost) {
      toast({
        title: "Insufficient XP",
        description: `You need ${reward.cost} XP to redeem this reward.`,
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'REDEEM_REWARD', payload: selectedReward });
    setSelectedReward('');
    toast({
      title: "Reward Redeemed! 🎁",
      description: `Enjoy your "${reward.name}"!`
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Level & XP Summary */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🏆</span>
            <span>Level & XP Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge className={`${currentLevel.color} text-lg px-3 py-1`}>
                  🏆 {currentLevel.name}
                </Badge>
                <span className="text-sm text-gray-600">
                  Level {currentLevel.id}
                </span>
              </div>
              
              {nextLevel && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {nextLevel.name}</span>
                    <span>{levelProgress.progressXP}/{levelProgress.totalXPForNext} XP</span>
                  </div>
                  <Progress value={levelProgress.progress} className="h-3" />
                  <div className="text-xs text-gray-500">
                    {Math.round(levelProgress.progress)}% complete
                  </div>
                </div>
              )}
            </div>
            
            {/* XP Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{state.xp.currentXP}</div>
                <div className="text-sm text-gray-600">Current XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{state.xp.totalEarned}</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{state.xp.totalSpent}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{state.xp.completedQuests}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add New Quest */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Quest 📜</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="questName">Quest Name</Label>
              <Input
                id="questName"
                value={newQuest.name}
                onChange={(e) => setNewQuest({ ...newQuest, name: e.target.value })}
                placeholder="Enter quest name"
              />
            </div>
            <div>
              <Label htmlFor="questRank">Quest Rank</Label>
              <Select value={newQuest.rank} onValueChange={(value) => setNewQuest({ ...newQuest, rank: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  {questRanks.map(rank => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label} ({getXPByRank(rank.value)} XP)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newQuest.dueDate}
                onChange={(e) => setNewQuest({ ...newQuest, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dueTime">Due Time (Optional)</Label>
              <Input
                id="dueTime"
                type="time"
                value={newQuest.dueTime}
                onChange={(e) => setNewQuest({ ...newQuest, dueTime: e.target.value })}
                placeholder="Leave empty for all day"
              />
            </div>
          </div>
          <Button onClick={handleAddQuest} className="w-full md:w-auto">
            ➕ Add Quest
          </Button>
        </CardContent>
      </Card>
      
      {/* Active Quests */}
      <Card>
        <CardHeader>
          <CardTitle>Active Quest List ⚔️</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.quests.map((quest) => (
              <div
                key={quest.id}
                className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${getDateColor(quest.dueDate)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{quest.name}</h3>
                      <Badge className={getRankColor(quest.rank)}>
                        {quest.rank}
                      </Badge>
                      <span className="text-lg">{getStatusIcon(quest.status)}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📅 {formatRelativeDueDate(quest.dueDate)}</span>
                      <span>Status: {quest.status}</span>
                      <span>XP: {quest.xpReward}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleCompleteQuest(quest.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      ✅ Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dispatch({ type: 'DELETE_QUEST', payload: quest.id })}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {state.quests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No active quests. Add your first quest above! 🎯</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Reward Redemption */}
      <Card>
        <CardHeader>
          <CardTitle>Reward Redemption 🎁</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Select value={selectedReward} onValueChange={setSelectedReward}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a reward" />
              </SelectTrigger>
              <SelectContent>
                {state.rewards.map(reward => (
                  <SelectItem key={reward.id} value={reward.id}>
                    {reward.emoji} {reward.name} - {reward.cost} XP
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleRedeemReward} disabled={!selectedReward}>
              🎁 Redeem
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;