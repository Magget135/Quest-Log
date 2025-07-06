import React from 'react';
import { useQuest } from '../contexts/QuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatCompletedTimestamp } from '../utils/timeUtils';

const Statistics = () => {
  const { state, getCurrentLevelInfo, getXPSystemInfo } = useQuest();
  
  const currentLevel = getCurrentLevelInfo();
  const xpSystem = getXPSystemInfo();
  
  // Calculate various statistics
  const totalQuestsCompleted = state.completedQuests.length;
  const totalRewardsClaimed = state.claimedRewards.length;
  const totalXPEarned = state.xp.totalEarned;
  const totalXPSpent = state.xp.totalSpent;
  const currentXP = state.xp.currentXP;
  const averageXPPerQuest = totalQuestsCompleted > 0 ? Math.round(totalXPEarned / totalQuestsCompleted) : 0;
  const averageXPPerReward = totalRewardsClaimed > 0 ? Math.round(totalXPSpent / totalRewardsClaimed) : 0;
  
  // Calculate quest rank distribution
  const questRankDistribution = state.completedQuests.reduce((acc, quest) => {
    acc[quest.rank] = (acc[quest.rank] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate most active days
  const dayActivity = state.completedQuests.reduce((acc, quest) => {
    const dayOfWeek = new Date(quest.dateCompleted).toLocaleDateString('en-US', { weekday: 'long' });
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
    return acc;
  }, {});
  
  const mostActiveDay = Object.entries(dayActivity).reduce((a, b) => 
    dayActivity[a[0]] > dayActivity[b[0]] ? a : b, ['None', 0]
  );

  return (
    <div className="space-y-6">
      {/* Journey Journal Header */}
      <div className="medieval-card p-6 shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-3xl">📊</span>
          <h1 className="text-3xl font-bold text-yellow-800" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
            Journey Journal
          </h1>
        </div>
        <p className="text-yellow-700 font-medium" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          Your complete adventure statistics and progress tracking. Review your epic journey through the realm.
        </p>
      </div>

      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-2xl">⚔️</span>
              <span>Current Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{currentLevel.level}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="text-center">
              <Badge className={`${currentLevel.color} text-lg px-3 py-1 font-bold`} style={{ fontFamily: 'Cinzel, serif' }}>
                {currentLevel.icon} {currentLevel.title}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{currentXP}</div>
              <div className="text-sm text-gray-600">Available XP</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span>Quest Mastery</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalQuestsCompleted}</div>
              <div className="text-sm text-gray-600">Total Quests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalXPEarned}</div>
              <div className="text-sm text-gray-600">Total XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{averageXPPerQuest}</div>
              <div className="text-sm text-gray-600">Average XP Per Quest</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎁</span>
              <span>Reward Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalRewardsClaimed}</div>
              <div className="text-sm text-gray-600">Total Rewards Claimed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalXPSpent}</div>
              <div className="text-sm text-gray-600">Total XP Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{averageXPPerReward}</div>
              <div className="text-sm text-gray-600">Average XP Per Reward</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quest Rank Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎖️</span>
              <span>Quest Rank Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(questRankDistribution).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(questRankDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([rank, count]) => (
                    <div key={rank} className="flex items-center justify-between">
                      <Badge className={`${getRankColor(rank)} font-bold`} style={{ fontFamily: 'Cinzel, serif' }}>
                        {rank}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{count} quests</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${(count / totalQuestsCompleted) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No quest data available</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📅</span>
              <span>Activity Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Most Active Day:</span>
                <span className="font-bold text-blue-600">{mostActiveDay[0]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quests on {mostActiveDay[0]}:</span>
                <span className="font-bold text-green-600">{mostActiveDay[1]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Streak:</span>
                <span className="font-bold text-purple-600">Epic! 🔥</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Longest Streak:</span>
                <span className="font-bold text-yellow-600">Legendary! ⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🧪</span>
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 mb-2">Current XP System</h3>
              <div className="flex justify-between">
                <span className="text-gray-600">System:</span>
                <span className="font-bold text-blue-600">{xpSystem.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="text-sm text-gray-700">{xpSystem.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reward Range:</span>
                <span className="font-bold text-green-600">{xpSystem.rewardRange.min}-{xpSystem.rewardRange.max}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 mb-2">Progress Overview</h3>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sessions:</span>
                <span className="font-bold text-purple-600">{totalQuestsCompleted + totalRewardsClaimed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net XP Balance:</span>
                <span className="font-bold text-yellow-600">{totalXPEarned - totalXPSpent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Efficiency Rate:</span>
                <span className="font-bold text-green-600">
                  {totalXPEarned > 0 ? Math.round(((totalXPEarned - totalXPSpent) / totalXPEarned) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get rank colors
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

export default Statistics;