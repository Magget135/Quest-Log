import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import CloseableTip from '../components/CloseableTip';

const RewardStore = () => {
  const { state, dispatch, canAffordReward, getXPSystemInfo } = useQuest();
  const { toast } = useToast();
  const location = useLocation();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({
    name: '',
    cost: '',
    description: '',
    icon: '🎁',
    category: 'Treats'
  });
  
  // Auto-open add form if on /rewards/add route
  useEffect(() => {
    if (location.pathname === '/rewards/add') {
      setShowAddForm(true);
    }
  }, [location.pathname]);
  
  const xpSystem = getXPSystemInfo();
  
  // Custom categories management
  const [customCategories, setCustomCategories] = useState(
    JSON.parse(localStorage.getItem('customCategories') || '[]')
  );
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // Default categories that can be deleted
  const defaultCategories = ['Entertainment', 'Treats', 'Digital', 'Learning', 'Self-Care', 'Activities'];
  const [activeCategories, setActiveCategories] = useState(
    JSON.parse(localStorage.getItem('activeCategories') || JSON.stringify(defaultCategories))
  );
  
  const categories = [...activeCategories, ...customCategories];
  const iconOptions = ['🎮', '🍿', '📱', '📚', '🍦', '💰', '🎁', '⭐', '🏆', '🎯', '🎨', '🎵', '🍕', '☕', '🛍️'];
  
  const handleAddReward = () => {
    if (!newReward.name || !newReward.cost) {
      toast({
        title: "Missing Information",
        description: "Please fill in reward name and gold cost.",
        variant: "destructive"
      });
      return;
    }
    
    const cost = parseInt(newReward.cost);
    if (cost < xpSystem.rewardRange.min || cost > xpSystem.rewardRange.max) {
      toast({
        title: "Invalid Gold Cost",
        description: `Gold cost must be between ${xpSystem.rewardRange.min} and ${xpSystem.rewardRange.max} for your current XP system.`,
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
      description: `"${newReward.name}" has been added to the merchant's emporium.`
    });
  };
  
  const handleClaimReward = (reward) => {
    if (!canAffordReward(reward.cost)) {
      toast({
        title: "Insufficient Gold",
        description: `You need ${reward.cost} gold pieces to claim this reward. You currently have ${state.xp.currentXP} gold.`,
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
      description: "Reward has been deleted from the emporium."
    });
  };
  
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    if (categories.includes(newCategory)) {
      toast({
        title: "Category Exists",
        description: "This category already exists.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedCustomCategories = [...customCategories, newCategory];
    setCustomCategories(updatedCustomCategories);
    localStorage.setItem('customCategories', JSON.stringify(updatedCustomCategories));
    setNewCategory('');
    setShowCategoryForm(false);
    
    toast({
      title: "Category Added! 🏷️",
      description: `"${newCategory}" has been added to your categories.`
    });
  };
  
  const handleDeleteCategory = (categoryToDelete) => {
    // Check if category has rewards
    const hasRewards = state.rewards.some(reward => reward.category === categoryToDelete);
    if (hasRewards) {
      toast({
        title: "Cannot Delete Category",
        description: "This category contains rewards. Please remove all rewards first.",
        variant: "destructive"
      });
      return;
    }
    
    // Remove from custom categories
    if (customCategories.includes(categoryToDelete)) {
      const updatedCustomCategories = customCategories.filter(cat => cat !== categoryToDelete);
      setCustomCategories(updatedCustomCategories);
      localStorage.setItem('customCategories', JSON.stringify(updatedCustomCategories));
    }
    
    // Remove from active categories (for defaults)
    if (activeCategories.includes(categoryToDelete)) {
      const updatedActiveCategories = activeCategories.filter(cat => cat !== categoryToDelete);
      setActiveCategories(updatedActiveCategories);
      localStorage.setItem('activeCategories', JSON.stringify(updatedActiveCategories));
    }
    
    toast({
      title: "Category Deleted",
      description: `"${categoryToDelete}" has been removed from your categories.`
    });
  };
  
  const getCategoryColor = (category) => {
    const colors = {
      'Entertainment': 'bg-purple-600 text-purple-100',
      'Treats': 'bg-orange-600 text-orange-100',
      'Digital': 'bg-blue-600 text-blue-100',
      'Learning': 'bg-green-600 text-green-100',
      'Self-Care': 'bg-pink-600 text-pink-100',
      'Activities': 'bg-yellow-600 text-yellow-100'
    };
    return colors[category] || 'bg-gray-600 text-gray-100';
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
      <div className="medieval-card p-6 shadow-xl medieval-corners">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">💰</span>
            <h1 className="text-3xl font-bold text-yellow-800 medieval-text-title">
              The Merchant's Emporium
            </h1>
          </div>
          <div className="medieval-scroll px-4 py-2">
            <Badge className="bg-yellow-600 text-yellow-100 text-lg px-3 py-1 font-bold medieval-text-header">
              {state.xp.currentXP} Gold Pieces
            </Badge>
          </div>
        </div>
        
        <p className="text-yellow-700 font-medium medieval-text-body mb-6">
          Welcome, brave adventurer! Trade your hard-earned gold pieces for magnificent rewards and treasures.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 medieval-scroll">
            <div className="text-2xl font-bold text-yellow-800 medieval-text-header">{state.xp.currentXP}</div>
            <div className="text-sm text-yellow-700 font-bold medieval-text-body">Current Gold</div>
          </div>
          <div className="text-center p-4 medieval-scroll">
            <div className="text-2xl font-bold text-yellow-800 medieval-text-header">{state.xp.totalSpent}</div>
            <div className="text-sm text-yellow-700 font-bold medieval-text-body">Gold Spent</div>
          </div>
          <div className="text-center p-4 medieval-scroll">
            <div className="text-2xl font-bold text-yellow-800 medieval-text-header">{state.rewards.length}</div>
            <div className="text-sm text-yellow-700 font-bold medieval-text-body">Available Rewards</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="medieval-button"
        >
          {showAddForm ? '📜 Hide Scroll' : '📜 Create New Reward'}
        </Button>
        
        <Button 
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          variant="outline"
          className="border-yellow-600 text-yellow-800 hover:bg-yellow-50 medieval-text-header"
        >
          🏷️ Manage Categories
        </Button>
      </div>

      {/* Tips */}
      <CloseableTip 
        id="reward-store-tip"
        icon="💡"
        title="Merchant's Wisdom"
        className="bg-yellow-50 border-yellow-600 medieval-scroll"
      >
        <p className="text-yellow-700 medieval-text-body">
          Create rewards that truly motivate you! Set appropriate gold costs based on your quest completion rate. 
          The merchant recommends balancing cost with your earning speed for maximum satisfaction.
        </p>
      </CloseableTip>

      {/* Category Management Form */}
      {showCategoryForm && (
        <div className="medieval-card p-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-4 medieval-text-header">
            🏷️ Manage Reward Categories
          </h3>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name..."
                className="flex-1 border-yellow-600 bg-yellow-50 medieval-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button onClick={handleAddCategory} className="medieval-button">
                Add Category
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 medieval-text-header">Current Categories:</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-1 medieval-scroll px-3 py-1">
                    <Badge className={getCategoryColor(category)} style={{ fontFamily: 'Cinzel, serif' }}>
                      {category}
                    </Badge>
                    {(customCategories.includes(category) || !defaultCategories.includes(category)) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category)}
                        className="h-4 w-4 p-0 text-red-600 hover:text-red-800"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Reward Form */}
      {showAddForm && (
        <div className="medieval-card p-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-4 medieval-text-header">
            📜 Create New Reward
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="reward-name" className="font-bold text-yellow-800 medieval-text-header">Reward Name</Label>
                <Input
                  id="reward-name"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  placeholder="What treasure awaits?"
                  className="border-yellow-600 bg-yellow-50 medieval-input"
                />
              </div>
              
              <div>
                <Label htmlFor="reward-cost" className="font-bold text-yellow-800 medieval-text-header">
                  Gold Cost ({xpSystem.rewardRange.min}-{xpSystem.rewardRange.max})
                </Label>
                <Input
                  id="reward-cost"
                  type="number"
                  value={newReward.cost}
                  onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
                  placeholder="How much gold?"
                  min={xpSystem.rewardRange.min}
                  max={xpSystem.rewardRange.max}
                  className="border-yellow-600 bg-yellow-50 medieval-input"
                />
              </div>
              
              <div>
                <Label htmlFor="reward-icon" className="font-bold text-yellow-800 medieval-text-header">Icon</Label>
                <Select value={newReward.icon} onValueChange={(value) => setNewReward({ ...newReward, icon: value })}>
                  <SelectTrigger className="border-yellow-600 bg-yellow-50">
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
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="reward-category" className="font-bold text-yellow-800 medieval-text-header">Category</Label>
                <Select value={newReward.category} onValueChange={(value) => setNewReward({ ...newReward, category: value })}>
                  <SelectTrigger className="border-yellow-600 bg-yellow-50">
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
              
              <div>
                <Label htmlFor="reward-description" className="font-bold text-yellow-800 medieval-text-header">Description (Optional)</Label>
                <Textarea
                  id="reward-description"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  placeholder="Describe this magnificent treasure..."
                  rows={3}
                  className="border-yellow-600 bg-yellow-50 medieval-input"
                />
              </div>
              
              <Button 
                onClick={handleAddReward} 
                className="w-full medieval-button"
                disabled={!newReward.name || !newReward.cost}
              >
                💰 Add to Emporium
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Rewards Display */}
      <div className="space-y-6">
        {Object.entries(groupedRewards).map(([category, rewards]) => (
          <div key={category} className="medieval-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-yellow-800 flex items-center space-x-2 medieval-text-header">
                <span>🏷️</span>
                <span>{category}</span>
              </h3>
              <div className="medieval-scroll px-3 py-1">
                <Badge className={getCategoryColor(category)} style={{ fontFamily: 'Cinzel, serif' }}>
                  {rewards.length} items
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <div key={reward.id} className="quest-parchment p-4 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{reward.icon}</span>
                      <h4 className="font-bold text-yellow-900 medieval-text-header">{reward.name}</h4>
                    </div>
                    <div className="medieval-scroll px-2 py-1">
                      <Badge className="bg-yellow-600 text-yellow-100 font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                        {reward.cost} Gold
                      </Badge>
                    </div>
                  </div>
                  
                  {reward.description && (
                    <p className="text-sm text-yellow-700 mb-3 medieval-text-body">
                      {reward.description}
                    </p>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleClaimReward(reward)}
                      disabled={!canAffordReward(reward.cost)}
                      className={`flex-1 ${
                        canAffordReward(reward.cost) 
                          ? 'medieval-button' 
                          : 'opacity-50 cursor-not-allowed bg-gray-400'
                      }`}
                    >
                      {canAffordReward(reward.cost) ? '💰 Purchase' : '💸 Too Expensive'}
                    </Button>
                    
                    {reward.isCustom && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditReward(reward)}
                          className="border-blue-400 text-blue-700 hover:bg-blue-50 medieval-text-header"
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteReward(reward.id)}
                          className="border-red-400 text-red-700 hover:bg-red-50 medieval-text-header"
                        >
                          🗑️
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedRewards).length === 0 && (
          <div className="medieval-card p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-yellow-800 mb-2 medieval-text-header">Empty Emporium</h3>
            <p className="text-yellow-700 mb-4 medieval-text-body">
              The merchant's shelves are bare! Create your first reward to stock the emporium.
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="medieval-button"
            >
              📜 Create First Reward
            </Button>
          </div>
        )}
      </div>

      {/* Edit Reward Modal */}
      {editingReward && (
        <RewardEditModal
          reward={editingReward}
          isOpen={!!editingReward}
          onClose={() => setEditingReward(null)}
          onSave={(updatedReward) => {
            dispatch({ type: 'UPDATE_REWARD', payload: updatedReward });
            setEditingReward(null);
            toast({
              title: "Reward Updated! 📝",
              description: "Your reward has been successfully updated."
            });
          }}
          categories={categories}
          iconOptions={iconOptions}
          xpSystem={xpSystem}
        />
      )}
    </div>
  );
};

export default RewardStore;