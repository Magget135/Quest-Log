import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

const QuestEditModal = ({ quest, isOpen, onClose, onSave, xpSystem }) => {
  const [editedQuest, setEditedQuest] = useState({
    name: '',
    rank: '',
    dueDate: '',
    dueTime: '',
    reward: '',
    description: '',
    isImportant: false
  });

  useEffect(() => {
    if (quest) {
      // Parse the dueDate to separate date and time
      const dueDateTime = quest.dueDate ? new Date(quest.dueDate) : null;
      const dueDate = dueDateTime ? dueDateTime.toISOString().split('T')[0] : '';
      const dueTime = dueDateTime ? dueDateTime.toTimeString().split(' ')[0].substring(0, 5) : '';

      setEditedQuest({
        ...quest,
        dueDate,
        dueTime,
        description: quest.description || '',
        reward: quest.reward || ''
      });
    }
  }, [quest]);

  const handleSave = () => {
    // Combine date and time
    let fullDueDate = editedQuest.dueDate;
    if (editedQuest.dueTime) {
      fullDueDate = `${editedQuest.dueDate}T${editedQuest.dueTime}`;
    }

    // Find XP for selected rank
    const selectedRank = xpSystem.ranks.find(r => r.value === editedQuest.rank);
    const xpReward = selectedRank ? selectedRank.xp : editedQuest.xpReward;

    const updatedQuest = {
      ...editedQuest,
      dueDate: fullDueDate,
      xpReward
    };

    onSave(updatedQuest);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // For now, just store file name - in a real app you'd upload to server
      const newAttachment = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        dateUploaded: new Date().toISOString()
      };
      
      setEditedQuest({
        ...editedQuest,
        attachments: [...(editedQuest.attachments || []), newAttachment]
      });
    }
  };

  const removeAttachment = (attachmentId) => {
    setEditedQuest({
      ...editedQuest,
      attachments: editedQuest.attachments.filter(att => att.id !== attachmentId)
    });
  };

  if (!quest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>✏️</span>
            <span>Edit Quest</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Quest Name</Label>
            <Input
              id="edit-name"
              value={editedQuest.name}
              onChange={(e) => setEditedQuest({ ...editedQuest, name: e.target.value })}
              placeholder="Enter quest name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-rank">Quest Rank</Label>
              <Select 
                value={editedQuest.rank} 
                onValueChange={(value) => setEditedQuest({ ...editedQuest, rank: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  {xpSystem.ranks.map(rank => (
                    <SelectItem key={rank.value} value={rank.value}>
                      <div className="flex items-center space-x-2">
                        <Badge className={rank.color} variant="outline">
                          {rank.label}
                        </Badge>
                        <span className="text-sm text-gray-600">({rank.xp} XP)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-reward">Reward (Optional)</Label>
              <Input
                id="edit-reward"
                value={editedQuest.reward}
                onChange={(e) => setEditedQuest({ ...editedQuest, reward: e.target.value })}
                placeholder="What will you reward yourself?"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-date">Due Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editedQuest.dueDate}
                onChange={(e) => setEditedQuest({ ...editedQuest, dueDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-time">Due Time (Optional)</Label>
              <Input
                id="edit-time"
                type="time"
                value={editedQuest.dueTime}
                onChange={(e) => setEditedQuest({ ...editedQuest, dueTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={editedQuest.description}
              onChange={(e) => setEditedQuest({ ...editedQuest, description: e.target.value })}
              placeholder="Add quest details, notes, or requirements..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="edit-attachment">Attach File (Optional)</Label>
            <Input
              id="edit-attachment"
              type="file"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
            {editedQuest.attachments && editedQuest.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                <Label className="text-sm text-gray-600">Attached Files:</Label>
                {editedQuest.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span>📎</span>
                      <span className="text-sm">{attachment.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(attachment.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      🗑️
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-important"
              checked={editedQuest.isImportant}
              onCheckedChange={(checked) => setEditedQuest({ ...editedQuest, isImportant: checked })}
            />
            <Label htmlFor="edit-important">Mark as Important</Label>
            <Badge variant="outline" className="border-yellow-400 text-yellow-700">
              ⭐ Protected from auto-cleanup
            </Badge>
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

export default QuestEditModal;