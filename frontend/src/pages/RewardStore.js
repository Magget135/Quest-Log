import React, { useState } from 'react';
import { useQuest } from '../contexts/QuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import RewardEditModal from '../components/RewardEditModal';

const RewardStore = () => {
  const { state, dispatch, canAffordReward, getXPSystemInfo } = useQuest();
  const { toast } = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({
    name: '',
    cost: '',
    description: '',
    icon: '🎁',
    category: 'Treats'
  });
  
  const xpSystem = getXPSystemInfo();
  
  const categories = ['Entertainment', 'Treats', 'Digital', 'Learning', 'Self-Care', 'Activities'];
  const iconOptions = ['🎮', '🍿', '📱', '📚', '🍦', '💰', '🎁', '⭐', '🏆', '🎯', '🎨', '🎵', '🍕', '☕', '🛍️'];
  
  const handleAddReward = () => {
    if (!newReward.name || !newReward.cost) {
      toast({
        title: "Missing Information",
        description: "Please fill in reward name and XP cost.",
        variant: "destructive"
      });
      return;
    }
    
    const cost = parseInt(newReward.cost);
    if (cost < xpSystem.rewardRange.min || cost > xpSystem.rewardRange.max) {
      toast({
        title: "Invalid XP Cost",
        description: `XP cost must be between ${xpSystem.rewardRange.min} and ${xpSystem.rewardRange.max} for your current XP system.`,
        variant: "destructive"
      });
      return;
    }
    
    const rewardData = {
      ...newReward,
      cost: cost,
      isCustom: true
    };
    
    dispatch({ type: 'ADD_REWARD', payload: rewardData });
    setNewReward({
      name: '',
      cost: '',
      description: '',
      icon: '🎁',
      category: 'Treats'
    });
    setShowAddForm(false);
    
    toast({
      title: "Reward Added! 🛍️",
      description: `"${newReward.name}" has been added to your reward store.`
    });
  };
  
  const handleClaimReward = (reward) => {
    if (!canAffordReward(reward.cost)) {
      toast({
        title: "Insufficient XP",
        description: `You need ${reward.cost} XP to claim this reward. You currently have ${state.xp.currentXP} XP.`,
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'CLAIM_REWARD', payload: reward.id });
    toast({
      title: "Reward Claimed! 🎉",
      description: `"${reward.name}" has been added to your inventory!`
    });
  };
  
  const handleEditReward = (reward) => {
    setEditingReward(reward);
  };
  
  const handleDeleteReward = (rewardId) => {
    dispatch({ type: 'DELETE_REWARD', payload: rewardId });
    toast({
      title: "Reward Removed",
      description: "Reward has been deleted from your store."
    });
  };
  
  const getCategoryColor = (category) => {
    const colors = {
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Treats': 'bg-orange-100 text-orange-800',
      'Digital': 'bg-blue-100 text-blue-800',
      'Learning': 'bg-green-100 text-green-800',
      'Self-Care': 'bg-pink-100 text-pink-800',
      'Activities': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };
  
  const groupedRewards = state.rewards.reduce((groups, reward) => {
    const category = reward.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(reward);
    return groups;
  }, {});
  
  return (
    <div className="space-y-6">
      {/* Store Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>🛍️</span>
              <span>Mystic Reward Emporium</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">
                💰 {state.xp.currentXP} XP
              </Badge>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                ➕ Add Reward
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t border-purple-200 mt-4 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reward-name">Reward Name</Label>
                  <Input
                    id="reward-name"
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    placeholder="Enter reward name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reward-cost">XP Cost ({xpSystem.rewardRange.min}-{xpSystem.rewardRange.max})</Label>
                  <Input
                    id="reward-cost"
                    type="number"
                    min={xpSystem.rewardRange.min}
                    max={xpSystem.rewardRange.max}
                    value={newReward.cost}
                    onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
                    placeholder="XP cost"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reward-icon">Icon</Label>
                  <Select value={newReward.icon} onValueChange={(value) => setNewReward({ ...newReward, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(icon => (
                        <SelectItem key={icon} value={icon}>
                          <span className="text-lg">{icon}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reward-category">Category</Label>
                  <Select value={newReward.category} onValueChange={(value) => setNewReward({ ...newReward, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="reward-description">Description</Label>
                  <Textarea
                    id="reward-description"
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                    placeholder="Describe your reward..."
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddReward} className="bg-purple-600 hover:bg-purple-700">
                  Add to Store
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* XP System Info */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-gray-900">Fair Play Reminder</h3>
                <p className="text-sm text-gray-600">
                  Be fair with your XP reward values. Setting unrealistic XP can break your system and reduce motivation.
                </p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Current System: {xpSystem.name}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Reward Categories */}
      <div className="space-y-6">
        {Object.entries(groupedRewards).map(([category, rewards]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(category)}>
                    {category}
                  </Badge>
                </div>
                <Badge variant="secondary">{rewards.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                      canAffordReward(reward.cost) 
                        ? 'border-green-200 bg-gradient-to-br from-white to-green-50' 
                        : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 opacity-75'
                    }`}
                  >
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{reward.icon || reward.name.charAt(0)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                        {reward.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {reward.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          💰 {reward.cost} XP
                        </Badge>
                        {reward.isCustom && (
                          <Badge variant="outline" className="text-purple-600 border-purple-300">
                            Custom
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleClaimReward(reward)}
                          disabled={!canAffordReward(reward.cost)}
                          className={`flex-1 ${
                            canAffordReward(reward.cost)
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {canAffordReward(reward.cost) ? '🛒 Claim' : '🔒 Need XP'}
                        </Button>
                        
                        {reward.isCustom && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditReward(reward)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              ✏️
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteReward(reward.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              🗑️
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {state.rewards.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">🛍️</div>
            <p className="text-lg font-medium mb-2">No rewards available</p>
            <p className="text-gray-600 mb-4">Add your first reward to start building your store!</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700">
              ➕ Add First Reward
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Reward Edit Modal */}
      {editingReward && (
        <RewardEditModal
          reward={editingReward}
          isOpen={!!editingReward}
          onClose={() => setEditingReward(null)}
          onSave={(updatedReward) => {
            dispatch({ type: 'UPDATE_REWARD', payload: updatedReward });
            setEditingReward(null);
            toast({
              title: "Reward Updated! 🛍️",
              description: "Your reward has been successfully updated."
            });
          }}
          xpSystem={xpSystem}
          categories={categories}
          iconOptions={iconOptions}
        />
      )}
    </div>
  );
};

export default RewardStore;