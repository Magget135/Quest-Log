import React, { useState } from 'react';
import { useQuest } from '../contexts/QuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { XP_SYSTEMS, AUTO_CLEANUP_OPTIONS } from '../data/xpSystems';

const Settings = () => {
  const { state, dispatch, getXPSystemInfo } = useQuest();
  const { toast } = useToast();
  const [confirmXPChange, setConfirmXPChange] = useState(null);
  
  const currentXPSystem = getXPSystemInfo();
  
  const handleXPSystemChange = (newSystemId) => {
    if (newSystemId !== state.settings.xpSystem) {
      setConfirmXPChange(newSystemId);
    }
  };
  
  const confirmXPSystemChange = () => {
    if (confirmXPChange) {
      dispatch({ type: 'CHANGE_XP_SYSTEM', payload: confirmXPChange });
      toast({
        title: "XP System Changed! ⚙️",
        description: "Your XP system has been updated. Rewards have been adjusted to fit the new range.",
        duration: 5000
      });
      setConfirmXPChange(null);
    }
  };
  
  const handleAutoCleanupChange = (setting, value) => {
    const newAutoCleanup = {
      ...state.settings.autoCleanup,
      [setting]: value
    };
    
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { autoCleanup: newAutoCleanup }
    });
    
    toast({
      title: "Settings Updated",
      description: "Auto-cleanup settings have been saved.",
    });
  };
  
  const applyMonthlyBonus = () => {
    dispatch({ type: 'APPLY_MONTHLY_BONUS' });
  };
  
  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
      dispatch({ type: 'RESET_ALL' });
      toast({
        title: "Data Reset",
        description: "All data has been reset to default values.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>Quest Log Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Customize your quest log experience with XP systems, auto-cleanup, and other preferences.
          </p>
        </CardContent>
      </Card>
      
      {/* XP System Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🧪</span>
            <span>XP System Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-blue-900">Current System</h3>
              <p className="text-sm text-blue-700">{currentXPSystem.description}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
              {currentXPSystem.name}
            </Badge>
          </div>
          
          <div>
            <Label htmlFor="xp-system">Choose XP System</Label>
            <Select value={state.settings.xpSystem} onValueChange={handleXPSystemChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(XP_SYSTEMS).map(system => (
                  <SelectItem key={system.id} value={system.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{system.name}</span>
                      <span className="text-xs text-gray-500">{system.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* XP System Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Quest Ranks & XP</h4>
              <div className="space-y-1">
                {currentXPSystem.ranks.map(rank => (
                  <div key={rank.value} className="flex justify-between text-sm">
                    <Badge className={rank.color} variant="outline">
                      {rank.label}
                    </Badge>
                    <span className="text-gray-600">{rank.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">System Limits</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reward XP Range:</span>
                  <span>{currentXPSystem.rewardRange.min}-{currentXPSystem.rewardRange.max}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Bonus:</span>
                  <span>{currentXPSystem.monthlyBonusXP.join(' / ')} XP</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <span className="text-lg">💡</span>
              <div>
                <h4 className="font-medium text-yellow-800">Fair Play Tip</h4>
                <p className="text-sm text-yellow-700">
                  Choose a system that fits your lifestyle. Lower XP systems are easier to manage. 
                  Higher XP systems give you more customization.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Auto-Cleanup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🗑️</span>
            <span>Auto-Cleanup Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-cleanup-toggle" className="text-base font-medium">
                Enable Auto-Cleanup
              </Label>
              <p className="text-sm text-gray-600">
                Automatically delete completed tasks after a specified time
              </p>
            </div>
            <Switch
              id="auto-cleanup-toggle"
              checked={state.settings.autoCleanup.enabled}
              onCheckedChange={(checked) => handleAutoCleanupChange('enabled', checked)}
            />
          </div>
          
          {state.settings.autoCleanup.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              <div>
                <Label htmlFor="cleanup-frequency">Delete completed tasks after</Label>
                <Select 
                  value={state.settings.autoCleanup.frequency} 
                  onValueChange={(value) => handleAutoCleanupChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUTO_CLEANUP_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="recurring-only" className="text-sm">
                    Only delete recurring tasks
                  </Label>
                  <Switch
                    id="recurring-only"
                    checked={state.settings.autoCleanup.recurringOnly}
                    onCheckedChange={(checked) => handleAutoCleanupChange('recurringOnly', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="keep-important" className="text-sm">
                    Keep tasks marked as "Important"
                  </Label>
                  <Switch
                    id="keep-important"
                    checked={state.settings.autoCleanup.keepImportant}
                    onCheckedChange={(checked) => handleAutoCleanupChange('keepImportant', checked)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Monthly Bonus & Data Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎁</span>
              <span>Monthly Bonus</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Apply your monthly XP bonus based on your current level and XP system.
            </p>
            <Button 
              onClick={applyMonthlyBonus}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              🎁 Apply Monthly Bonus
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💾</span>
              <span>Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Reset all quest log data to start fresh. This action cannot be undone.
            </p>
            <Button 
              onClick={resetAllData}
              variant="destructive"
              className="w-full"
            >
              🗑️ Reset All Data
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* XP System Change Confirmation */}
      {confirmXPChange && (
        <Dialog open={!!confirmXPChange} onOpenChange={() => setConfirmXPChange(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>⚠️</span>
                <span>Confirm XP System Change</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Warning</h4>
                <p className="text-sm text-yellow-700">
                  Changing your XP system will remove your current quest rank setup and reset your reward XP range. 
                  Continue?
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">New System Details:</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {XP_SYSTEMS[confirmXPChange]?.name}</p>
                  <p><strong>Description:</strong> {XP_SYSTEMS[confirmXPChange]?.description}</p>
                  <p><strong>Reward Range:</strong> {XP_SYSTEMS[confirmXPChange]?.rewardRange.min}-{XP_SYSTEMS[confirmXPChange]?.rewardRange.max} XP</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmXPChange(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmXPSystemChange}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Change
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Settings;