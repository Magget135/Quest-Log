import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const RewardEditModal = ({ reward, isOpen, onClose, onSave, xpSystem, categories, iconOptions }) => {
  const [editedReward, setEditedReward] = useState({
    name: '',
    cost: '',
    description: '',
    icon: '🎁',
    category: 'Treats'
  });

  useEffect(() => {
    if (reward) {
      setEditedReward({
        ...reward,
        cost: reward.cost.toString(),
        description: reward.description || '',
        icon: reward.icon || '🎁',
        category: reward.category || 'Treats'
      });
    }
  }, [reward]);

  const handleSave = () => {
    const cost = parseInt(editedReward.cost);
    
    if (cost < xpSystem.rewardRange.min || cost > xpSystem.rewardRange.max) {
      alert(`XP cost must be between ${xpSystem.rewardRange.min} and ${xpSystem.rewardRange.max}`);
      return;
    }

    const updatedReward = {
      ...editedReward,
      cost: cost
    };

    onSave(updatedReward);
  };

  if (!reward) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>✏️</span>
            <span>Edit Reward</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-reward-name">Reward Name</Label>
            <Input
              id="edit-reward-name"
              value={editedReward.name}
              onChange={(e) => setEditedReward({ ...editedReward, name: e.target.value })}
              placeholder="Enter reward name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-reward-cost">XP Cost</Label>
              <Input
                id="edit-reward-cost"
                type="number"
                min={xpSystem.rewardRange.min}
                max={xpSystem.rewardRange.max}
                value={editedReward.cost}
                onChange={(e) => setEditedReward({ ...editedReward, cost: e.target.value })}
              />
              <div className="text-xs text-gray-500 mt-1">
                Range: {xpSystem.rewardRange.min}-{xpSystem.rewardRange.max} XP
              </div>
            </div>

            <div>
              <Label htmlFor="edit-reward-icon">Icon</Label>
              <Select value={editedReward.icon} onValueChange={(value) => setEditedReward({ ...editedReward, icon: value })}>
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
          </div>

          <div>
            <Label htmlFor="edit-reward-category">Category</Label>
            <Select value={editedReward.category} onValueChange={(value) => setEditedReward({ ...editedReward, category: value })}>
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

          <div>
            <Label htmlFor="edit-reward-description">Description</Label>
            <Textarea
              id="edit-reward-description"
              value={editedReward.description}
              onChange={(e) => setEditedReward({ ...editedReward, description: e.target.value })}
              placeholder="Describe your reward..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardEditModal;