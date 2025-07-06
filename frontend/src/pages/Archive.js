import React, { useState } from 'react';
import { useQuest } from '../contexts/QuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { formatCompletedTimestamp } from '../utils/timeUtils';

const Archive = () => {
  const { state } = useQuest();
  const [filter, setFilter] = useState('all');
  
  const getRankColor = (rank) => {
    const colors = {
      'Common': 'bg-gray-100 text-gray-800',
      'Easy': 'bg-green-100 text-green-800',
      'Rare': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Epic': 'bg-purple-100 text-purple-800',
      'Hard': 'bg-orange-100 text-orange-800',
      'Legendary': 'bg-yellow-100 text-yellow-800',
      'Extreme': 'bg-red-100 text-red-800',
      'Novice': 'bg-gray-100 text-gray-800',
      'Skilled': 'bg-green-100 text-green-800',
      'Veteran': 'bg-blue-100 text-blue-800',
      'Elite': 'bg-purple-100 text-purple-800',
      'Tier I': 'bg-gray-100 text-gray-800',
      'Tier II': 'bg-blue-100 text-blue-800',
      'Tier III': 'bg-green-100 text-green-800',
      'Tier IV': 'bg-purple-100 text-purple-800',
      'Fledgling': 'bg-gray-100 text-gray-800',
      'Adept': 'bg-green-100 text-green-800',
      'Hero': 'bg-blue-100 text-blue-800',
      'Warlord': 'bg-red-100 text-red-800'
    };
    return colors[rank] || 'bg-gray-100 text-gray-800';
  };
  
  const getCategoryIcon = (rewardName) => {
    const name = rewardName.toLowerCase();
    if (name.includes('gaming') || name.includes('game')) return '🎮';
    if (name.includes('movie') || name.includes('film')) return '🍿';
    if (name.includes('social') || name.includes('media')) return '📱';
    if (name.includes('book') || name.includes('read')) return '📚';
    if (name.includes('ice cream') || name.includes('treat')) return '🍦';
    if (name.includes('money') || name.includes('spend')) return '💰';
    return '🎁';
  };
  
  // Create combined timeline
  const createTimeline = () => {
    const items = [];
    
    // Add completed quests
    state.completedQuests.forEach(quest => {
      items.push({
        type: 'quest',
        id: quest.id,
        name: quest.name,
        rank: quest.rank,
        xpEarned: quest.xpEarned,
        date: quest.dateCompleted,
        reward: quest.reward
      });
    });
    
    // Add claimed rewards
    state.claimedRewards.forEach(reward => {
      items.push({
        type: 'reward',
        id: reward.id,
        name: reward.rewardName,
        xpCost: reward.xpCost,
        date: reward.dateUsed || reward.dateClaimed,
        dateClaimed: reward.dateClaimed,
        dateUsed: reward.dateUsed
      });
    });
    
    // Sort by date (newest first)
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  const filteredItems = () => {
    const timeline = createTimeline();
    if (filter === 'quests') return timeline.filter(item => item.type === 'quest');
    if (filter === 'rewards') return timeline.filter(item => item.type === 'reward');
    return timeline;
  };
  
  const totalQuestXP = state.completedQuests.reduce((sum, quest) => sum + quest.xpEarned, 0);
  const totalRewardXP = state.claimedRewards.reduce((sum, reward) => sum + reward.xpCost, 0);
  
  return (
    <div className="space-y-6">
      {/* Adventure Archive Header */}
      <div className="medieval-card p-6 shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-3xl">🧭</span>
          <h1 className="text-3xl font-bold text-yellow-800" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
            Adventure Archive
          </h1>
        </div>
        <p className="text-yellow-700 font-medium" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          Your complete adventure history including completed quests and reward claims. Every victory and treasure is recorded here.
        </p>
      </div>
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📚</span>
            <span>Adventure Archive</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{state.completedQuests.length}</div>
              <div className="text-sm text-gray-600">Quests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{totalQuestXP}</div>
              <div className="text-sm text-gray-600">Total Quest XP</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{state.claimedRewards.length}</div>
              <div className="text-sm text-gray-600">Rewards Used</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{totalRewardXP}</div>
              <div className="text-sm text-gray-600">Total Reward XP</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>📋</span>
              <span>History Timeline</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All History</SelectItem>
                  <SelectItem value="quests">Quests Only</SelectItem>
                  <SelectItem value="rewards">Rewards Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-lg font-medium mb-2">No archive data</p>
              <p>Complete some quests or use some rewards to see your history!</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems().map((item) => (
                    <TableRow key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge className={item.type === 'quest' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                          {item.type === 'quest' ? '⚔️ Quest' : '🎁 Reward'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {item.type === 'reward' && (
                            <span className="text-lg">{getCategoryIcon(item.name)}</span>
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {item.type === 'quest' ? (
                          <div className="space-y-1">
                            <Badge className={getRankColor(item.rank)}>
                              {item.rank}
                            </Badge>
                            {item.reward && (
                              <div className="text-xs text-gray-500">
                                Reward: {item.reward}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {item.dateUsed ? (
                              <Badge className="bg-green-100 text-green-800">
                                ✅ Used
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                📦 Claimed
                              </Badge>
                            )}
                            {item.dateUsed && (
                              <div className="text-xs text-gray-500">
                                Claimed: {formatCompletedTimestamp(item.dateClaimed)}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <span className={`font-semibold ${
                          item.type === 'quest' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.type === 'quest' ? '+' : '-'}{item.xpEarned || item.xpCost} XP
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">
                          {formatCompletedTimestamp(item.date)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Detailed Stats by Category */}
      {state.completedQuests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚔️</span>
                <span>Quest Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average XP per Quest:</span>
                  <span className="font-semibold">
                    {state.completedQuests.length > 0 
                      ? Math.round(totalQuestXP / state.completedQuests.length) 
                      : 0} XP
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Most Recent Quest:</span>
                  <span className="font-semibold">
                    {state.completedQuests.length > 0 
                      ? formatCompletedTimestamp(
                          state.completedQuests.sort((a, b) => 
                            new Date(b.dateCompleted) - new Date(a.dateCompleted)
                          )[0].dateCompleted
                        )
                      : 'None'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quest Time:</span>
                  <span className="font-semibold">Epic journey! 🏆</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🎁</span>
                <span>Reward Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average XP per Reward:</span>
                  <span className="font-semibold">
                    {state.claimedRewards.length > 0 
                      ? Math.round(totalRewardXP / state.claimedRewards.length) 
                      : 0} XP
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Most Recent Reward:</span>
                  <span className="font-semibold">
                    {state.claimedRewards.length > 0 
                      ? formatCompletedTimestamp(
                          state.claimedRewards.sort((a, b) => 
                            new Date(b.dateUsed || b.dateClaimed) - new Date(a.dateUsed || a.dateClaimed)
                          )[0].dateUsed || state.claimedRewards[0].dateClaimed
                        )
                      : 'None'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite Category:</span>
                  <span className="font-semibold">Well-deserved! 🎉</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Archive;