import React, { useState } from 'react';
import { useXP } from '../contexts/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';

const RewardStore = () => {
  const { state, dispatch } = useXP();
  const { toast } = useToast();
  const [newReward, setNewReward] = useState({
    name: '',
    cost: '',
    emoji: '',
    note: ''
  });
  const [editingReward, setEditingReward] = useState(null);
  
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
  
  const handleAddCustomReward = () => {
    if (!newReward.name || !newReward.cost) {
      toast({
        title: "Missing Information",
        description: "Please fill in reward name and XP cost.",
        variant: "destructive"
      });
      return;
    }
    
    const cost = parseInt(newReward.cost);
    if (isNaN(cost) || cost <= 0) {
      toast({
        title: "Invalid Cost",
        description: "XP cost must be a positive number.",
        variant: "destructive"
      });
      return;
    }
    
    const rewardData = {
      name: newReward.name,
      cost,
      emoji: newReward.emoji || '🎁',
      note: newReward.note || '',
      isCustom: true
    };
    
    dispatch({ type: 'ADD_CUSTOM_REWARD', payload: rewardData });
    setNewReward({ name: '', cost: '', emoji: '', note: '' });
    
    toast({
      title: "Custom Reward Added! 🎯",
      description: `"${newReward.name}" has been added to your reward store.`
    });
  };
  
  const handleUpdateReward = (rewardId, updates) => {
    const cost = parseInt(updates.cost);
    if (isNaN(cost) || cost <= 0) {
      toast({
        title: "Invalid Cost",
        description: "XP cost must be a positive number.",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'UPDATE_CUSTOM_REWARD', payload: { id: rewardId, ...updates, cost } });
    setEditingReward(null);
    
    toast({
      title: "Reward Updated! ✏️",
      description: "Your custom reward has been successfully updated."
    });
  };
  
  const handleDeleteReward = (rewardId) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      dispatch({ type: 'DELETE_CUSTOM_REWARD', payload: rewardId });
      toast({
        title: "Reward Deleted",
        description: "Custom reward has been removed from your store."
      });
    }
  };
  
  const defaultRewards = state.rewards.filter(r => !r.isCustom);
  const customRewards = state.rewards.filter(r => r.isCustom);
  
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
      
      <Tabs defaultValue="default" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">Default Rewards</TabsTrigger>
          <TabsTrigger value="custom">Custom Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="default" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultRewards.map((reward) => (
              <Card key={reward.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">{reward.emoji}</div>
                    <h3 className="text-xl font-semibold text-gray-900">{reward.name}</h3>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {reward.cost} XP
                    </Badge>
                    {reward.note && (
                      <p className="text-sm text-gray-600 italic">{reward.note}</p>
                    )}
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
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6">
          {/* Add Custom Reward */}
          <Card>
            <CardHeader>
              <CardTitle>Add Custom Reward ➕</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rewardName">Reward Name</Label>
                  <Input
                    id="rewardName"
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    placeholder="e.g., 30 Min Gaming"
                  />
                </div>
                <div>
                  <Label htmlFor="rewardCost">XP Cost</Label>
                  <Input
                    id="rewardCost"
                    type="number"
                    value={newReward.cost}
                    onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
                    placeholder="e.g., 75"
                  />
                </div>
                <div>
                  <Label htmlFor="rewardEmoji">Emoji (Optional)</Label>
                  <Input
                    id="rewardEmoji"
                    value={newReward.emoji}
                    onChange={(e) => setNewReward({ ...newReward, emoji: e.target.value })}
                    placeholder="🎮"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="rewardNote">Note/Tip (Optional)</Label>
                  <Textarea
                    id="rewardNote"
                    value={newReward.note}
                    onChange={(e) => setNewReward({ ...newReward, note: e.target.value })}
                    placeholder="What this reward is about..."
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleAddCustomReward} className="w-full md:w-auto">
                ➕ Add Custom Reward
              </Button>
            </CardContent>
          </Card>
          
          {/* Custom Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customRewards.map((reward) => (
              <Card key={reward.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  {editingReward === reward.id ? (
                    <div className="space-y-4">
                      <Input
                        value={reward.name}
                        onChange={(e) => setNewReward({ ...reward, name: e.target.value })}
                        placeholder="Reward name"
                      />
                      <Input
                        type="number"
                        value={reward.cost}
                        onChange={(e) => setNewReward({ ...reward, cost: e.target.value })}
                        placeholder="XP cost"
                      />
                      <Input
                        value={reward.emoji}
                        onChange={(e) => setNewReward({ ...reward, emoji: e.target.value })}
                        placeholder="Emoji"
                        maxLength={2}
                      />
                      <Textarea
                        value={reward.note}
                        onChange={(e) => setNewReward({ ...reward, note: e.target.value })}
                        placeholder="Note/tip"
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateReward(reward.id, newReward)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✅ Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingReward(null)}
                        >
                          ❌ Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-6xl">{reward.emoji}</div>
                      <h3 className="text-xl font-semibold text-gray-900">{reward.name}</h3>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {reward.cost} XP
                      </Badge>
                      {reward.note && (
                        <p className="text-sm text-gray-600 italic">{reward.note}</p>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleRedeemReward(reward.id)}
                          disabled={state.xp.currentXP < reward.cost}
                          className={`flex-1 ${
                            state.xp.currentXP < reward.cost
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-purple-600 hover:bg-purple-700'
                          }`}
                        >
                          {state.xp.currentXP < reward.cost ? (
                            <>🔒 Need {reward.cost - state.xp.currentXP}</>
                          ) : (
                            <>🎁 Redeem</>
                          )}
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingReward(reward.id);
                            setNewReward(reward);
                          }}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteReward(reward.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {customRewards.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No custom rewards yet. Add your first custom reward above! 🎯</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>💡 Reward Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-600">
            <li>• Create rewards that motivate you personally</li>
            <li>• Balance small daily rewards with bigger milestone rewards</li>
            <li>• Use emojis to make your rewards more visually appealing</li>
            <li>• Set XP costs that feel fair for the reward value</li>
            <li>• Add notes to remind yourself what the reward includes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardStore;