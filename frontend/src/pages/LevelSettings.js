import React, { useState } from 'react';
import { useXP } from '../contexts/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';

const LevelSettings = () => {
  const { state, dispatch, getCurrentLevel, getNextLevel, getLevelProgress } = useXP();
  const { toast } = useToast();
  const [levels, setLevels] = useState(state.levels);
  const [newLevel, setNewLevel] = useState({ name: '', xpRequired: '' });
  const [editingLevel, setEditingLevel] = useState(null);
  
  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const levelProgress = getLevelProgress();
  
  const handleAddLevel = () => {
    if (!newLevel.name || !newLevel.xpRequired) {
      toast({
        title: "Missing Information",
        description: "Please fill in both level name and XP required.",
        variant: "destructive"
      });
      return;
    }
    
    const xpRequired = parseInt(newLevel.xpRequired);
    if (isNaN(xpRequired) || xpRequired < 0) {
      toast({
        title: "Invalid XP",
        description: "XP required must be a positive number.",
        variant: "destructive"
      });
      return;
    }
    
    const levelColors = [
      'bg-gray-100 text-gray-800',
      'bg-green-100 text-green-800',
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800'
    ];
    
    const newLevelObj = {
      id: Math.max(...levels.map(l => l.id)) + 1,
      name: newLevel.name,
      xpRequired,
      color: levelColors[levels.length % levelColors.length]
    };
    
    const updatedLevels = [...levels, newLevelObj].sort((a, b) => a.xpRequired - b.xpRequired);
    setLevels(updatedLevels);
    setNewLevel({ name: '', xpRequired: '' });
    
    toast({
      title: "Level Added! 🎯",
      description: `"${newLevel.name}" has been added to your level system.`
    });
  };
  
  const handleUpdateLevel = (levelId, updates) => {
    const updatedLevels = levels.map(level =>
      level.id === levelId ? { ...level, ...updates } : level
    ).sort((a, b) => a.xpRequired - b.xpRequired);
    
    setLevels(updatedLevels);
    setEditingLevel(null);
    
    toast({
      title: "Level Updated! ✏️",
      description: "Level has been successfully updated."
    });
  };
  
  const handleDeleteLevel = (levelId) => {
    if (levels.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one level.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedLevels = levels.filter(level => level.id !== levelId);
    setLevels(updatedLevels);
    
    toast({
      title: "Level Deleted",
      description: "Level has been removed from your system."
    });
  };
  
  const handleSaveChanges = () => {
    dispatch({ type: 'UPDATE_LEVELS', payload: levels });
    toast({
      title: "Changes Saved! 💾",
      description: "Your level system has been updated."
    });
  };
  
  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to default levels? This will remove all custom levels.')) {
      const defaultLevels = [
        { id: 1, name: 'Novice', xpRequired: 0, color: 'bg-gray-100 text-gray-800' },
        { id: 2, name: 'Apprentice', xpRequired: 250, color: 'bg-green-100 text-green-800' },
        { id: 3, name: 'Hero', xpRequired: 500, color: 'bg-blue-100 text-blue-800' },
        { id: 4, name: 'Champion', xpRequired: 1000, color: 'bg-purple-100 text-purple-800' },
        { id: 5, name: 'Legend', xpRequired: 2000, color: 'bg-yellow-100 text-yellow-800' },
        { id: 6, name: 'Master', xpRequired: 4000, color: 'bg-red-100 text-red-800' }
      ];
      
      setLevels(defaultLevels);
      dispatch({ type: 'UPDATE_LEVELS', payload: defaultLevels });
      
      toast({
        title: "Reset Complete",
        description: "Level system has been reset to default settings."
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📊</span>
            <span>Level Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Customize your level system by defining level names and XP requirements.
              Create your own progression path!
            </p>
            
            {/* Current Level Display */}
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
              <Badge className={`${currentLevel.color} text-lg px-3 py-1`}>
                🏆 {currentLevel.name}
              </Badge>
              <div className="text-sm text-gray-600">
                Current Level • {state.xp.totalEarned} XP Earned
              </div>
              {nextLevel && (
                <div className="text-sm text-blue-600">
                  Next: {nextLevel.name} ({nextLevel.xpRequired} XP required)
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add New Level */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Level ➕</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="levelName">Level Name</Label>
              <Input
                id="levelName"
                value={newLevel.name}
                onChange={(e) => setNewLevel({ ...newLevel, name: e.target.value })}
                placeholder="e.g., Dragon Slayer"
              />
            </div>
            <div>
              <Label htmlFor="xpRequired">XP Required</Label>
              <Input
                id="xpRequired"
                type="number"
                value={newLevel.xpRequired}
                onChange={(e) => setNewLevel({ ...newLevel, xpRequired: e.target.value })}
                placeholder="e.g., 1500"
              />
            </div>
          </div>
          <Button onClick={handleAddLevel} className="w-full md:w-auto">
            ➕ Add Level
          </Button>
        </CardContent>
      </Card>
      
      {/* Current Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Current Levels 🎯</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {levels.map((level, index) => (
              <div
                key={level.id}
                className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
              >
                {editingLevel === level.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={level.name}
                        onChange={(e) => setLevels(levels.map(l => 
                          l.id === level.id ? { ...l, name: e.target.value } : l
                        ))}
                        placeholder="Level name"
                      />
                      <Input
                        type="number"
                        value={level.xpRequired}
                        onChange={(e) => setLevels(levels.map(l => 
                          l.id === level.id ? { ...l, xpRequired: parseInt(e.target.value) } : l
                        ))}
                        placeholder="XP required"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateLevel(level.id, levels.find(l => l.id === level.id))}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✅ Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingLevel(null)}
                      >
                        ❌ Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Badge className={level.color}>
                        Level {index + 1}
                      </Badge>
                      <div>
                        <div className="font-semibold">{level.name}</div>
                        <div className="text-sm text-gray-600">
                          {level.xpRequired} XP required
                        </div>
                      </div>
                      {currentLevel.id === level.id && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingLevel(level.id)}
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteLevel(level.id)}
                        disabled={levels.length <= 1}
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Level Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Level Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">Here are some popular level progression ideas:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Fantasy Theme</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Peasant (0 XP)</li>
                  <li>• Squire (100 XP)</li>
                  <li>• Knight (300 XP)</li>
                  <li>• Paladin (600 XP)</li>
                  <li>• Hero (1000 XP)</li>
                  <li>• Legend (1500 XP)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Professional Theme</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Intern (0 XP)</li>
                  <li>• Junior (200 XP)</li>
                  <li>• Associate (500 XP)</li>
                  <li>• Senior (1000 XP)</li>
                  <li>• Lead (2000 XP)</li>
                  <li>• Executive (4000 XP)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Button 
          onClick={handleSaveChanges}
          className="bg-blue-600 hover:bg-blue-700"
        >
          💾 Save All Changes
        </Button>
        <Button 
          onClick={handleResetToDefault}
          variant="outline"
        >
          🔄 Reset to Default
        </Button>
      </div>
    </div>
  );
};

export default LevelSettings;