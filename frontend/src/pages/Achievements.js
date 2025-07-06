import React from 'react';
import { useQuest } from '../contexts/QuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Badges from '../components/Badges';
import { getAchievementProgress } from '../data/achievements';

const Achievements = () => {
  const { state, getCurrentLevelInfo } = useQuest();
  
  const currentLevel = getCurrentLevelInfo();
  const progress = getAchievementProgress(state.achievements || []);
  
  // Calculate additional statistics
  const unlockedAchievements = state.achievements?.filter(a => a.unlocked) || [];
  const totalXPFromQuests = state.xp.totalEarned;
  const totalQuestsCompleted = state.completedQuests?.length || 0;
  const totalRewardsClaimed = state.claimedRewards?.length || 0;
  
  // Recent achievements (last 5 unlocked)
  const recentAchievements = unlockedAchievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Achievements Header */}
      <div className="medieval-card p-6 shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-3xl">🏆</span>
          <h1 className="text-3xl font-bold text-yellow-800" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
            Achievements
          </h1>
        </div>
        <p className="text-yellow-700 font-medium" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          Your collection of earned badges and achievements. Complete challenging quests and reach milestones to unlock more honors.
        </p>
      </div>

      {/* Achievement Statistics */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📊</span>
            <span>Achievement Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{progress.unlocked}</div>
              <div className="text-sm text-gray-600">Achievements Earned</div>
              <div className="mt-2">
                <Badge className="bg-yellow-100 text-yellow-800">
                  {progress.percentage}% Complete
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalQuestsCompleted}</div>
              <div className="text-sm text-gray-600">Quests Completed</div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800">
                  {totalXPFromQuests} XP Earned
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{currentLevel.level}</div>
              <div className="text-sm text-gray-600">Current Level</div>
              <div className="mt-2">
                <Badge className={`${currentLevel.color} font-bold`} style={{ fontFamily: 'Cinzel, serif' }}>
                  {currentLevel.icon} {currentLevel.title}
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalRewardsClaimed}</div>
              <div className="text-sm text-gray-600">Rewards Claimed</div>
              <div className="mt-2">
                <Badge className="bg-purple-100 text-purple-800">
                  Epic Journey! 🌟
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🆕</span>
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-yellow-600 text-yellow-100 mb-1">
                      🏆 Unlocked
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Achievements Component */}
      <Badges achievements={state.achievements || []} />
    </div>
  );
};

export default Achievements;