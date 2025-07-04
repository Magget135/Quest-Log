import React from 'react';
import { useXP } from '../contexts/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';

const RewardStore = () => {
  const { state, dispatch } = useXP();
  const { toast } = useToast();
  
  const handleRedeemReward = (rewardId) => {
    const reward = state.rewards.find(r => r.id === rewardId);
    if (!reward) return;
    
    if (state.xp.currentXP < reward.cost) {
      toast({
        title: "Insufficient XP",
        description: `You need ${reward.cost} XP to redeem this reward. You have ${state.xp.currentXP} XP.`,
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'REDEEM_REWARD', payload: rewardId });
    toast({
      title: "Reward Redeemed! 🎉",
      description: `Enjoy your "${reward.name}"! ${reward.emoji}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🎁</span>
            <span>Reward Store</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {state.xp.currentXP} XP Available
            </div>
            <p className="text-gray-600">
              Choose your rewards and enjoy the fruits of your hard work!
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.rewards.map((reward) => (
          <Card key={reward.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-6xl">{reward.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900">{reward.name}</h3>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {reward.cost} XP
                </Badge>
                <Button
                  onClick={() => handleRedeemReward(reward.id)}
                  disabled={state.xp.currentXP < reward.cost}
                  className={`w-full ${
                    state.xp.currentXP < reward.cost
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {state.xp.currentXP < reward.cost ? (
                    <>🔒 Need {reward.cost - state.xp.currentXP} more XP</>
                  ) : (
                    <>🎁 Redeem</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>💡 Reward Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-600">
            <li>• Complete higher-ranked quests to earn more XP!</li>
            <li>• Epic and Legendary quests give the most XP rewards</li>
            <li>• Plan your rewards carefully - XP spent cannot be recovered</li>
            <li>• Set up recurring tasks to earn consistent XP daily</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardStore;