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
import { XP_SYSTEMS, AUTO_CLEANUP_OPTIONS, getXPSystem } from '../data/xpSystems';
import { isCurrentMonth, formatMonthYear } from '../utils/timeUtils';
import CloseableTip from '../components/CloseableTip';
import CollapsiblePanel from '../components/CollapsiblePanel';

const Settings = () => {
  const { state, dispatch, getXPSystemInfo, canClaimMonthlyBonus } = useQuest();
  const { toast } = useToast();
  const [confirmXPChange, setConfirmXPChange] = useState(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetOptions, setResetOptions] = useState({
    eraseRewards: true,
    resetXPSystem: false
  });
  
  const currentXPSystem = getXPSystemInfo();
  const canClaimBonus = canClaimMonthlyBonus();
  
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
  
  const handleCalendarViewChange = (setting, value) => {
    const newCalendarView = {
      ...state.settings.calendarView,
      [setting]: value
    };
    
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { calendarView: newCalendarView }
    });
    
    toast({
      title: "Settings Updated",
      description: "Calendar view settings have been saved.",
    });
  };
  
  const applyMonthlyBonus = () => {
    if (!canClaimBonus) {
      toast({
        title: "Already Claimed",
        description: "You've already claimed your monthly bonus this month. Try again next month!",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'APPLY_MONTHLY_BONUS' });
    toast({
      title: "Monthly Bonus Applied! 🎁",
      description: "Your monthly XP bonus has been added to your total!",
      duration: 5000
    });
  };
  
  const confirmResetEverything = () => {
    dispatch({ 
      type: 'RESET_EVERYTHING', 
      payload: resetOptions 
    });
    setShowResetDialog(false);
    setResetOptions({ eraseRewards: true, resetXPSystem: false });
    toast({
      title: "Everything Reset! 🧨",
      description: "All your data has been reset. Welcome to your fresh adventure!",
      duration: 5000
    });
  };
  
  const getMonthlyBonusAmount = () => {
    const userLevel = state.xp.totalEarned;
    const level = currentXPSystem.levelThresholds.findIndex(threshold => userLevel < threshold);
    const actualLevel = level === -1 ? currentXPSystem.levelThresholds.length : level;
    return currentXPSystem.monthlyBonusXP[Math.min(actualLevel - 1, currentXPSystem.monthlyBonusXP.length - 1)] || 0;
  };
  
  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>Rules & Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Customize your Quest Log experience and learn about system rules. Click on any section below to expand or collapse it.
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
          
          <CloseableTip 
            id="xp-system-tip"
            icon="💡"
            title="Fair Play Tip"
            className="bg-yellow-50 border-yellow-200"
          >
            <p className="text-yellow-700">
              Choose a system that fits your lifestyle. Lower XP systems are easier to manage. 
              Higher XP systems give you more customization.
            </p>
          </CloseableTip>
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
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="cleanup-rewards" className="text-sm">
                    Include Recent Reward Usage cleanup
                  </Label>
                  <Switch
                    id="cleanup-rewards"
                    checked={state.settings.autoCleanup.includeRewards}
                    onCheckedChange={(checked) => handleAutoCleanupChange('includeRewards', checked)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Calendar View Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📅</span>
            <span>Calendar View Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="calendar-enabled" className="text-base font-medium">
                Enable Calendar View
              </Label>
              <p className="text-sm text-gray-600">
                Show quest calendar below the Active Quest Log on Dashboard
              </p>
            </div>
            <Switch
              id="calendar-enabled"
              checked={state.settings.calendarView.enabled}
              onCheckedChange={(checked) => handleCalendarViewChange('enabled', checked)}
            />
          </div>
          
          {state.settings.calendarView.enabled && (
            <div className="pl-4 border-l-2 border-gray-200">
              <div>
                <Label htmlFor="default-view">Default Calendar View</Label>
                <Select 
                  value={state.settings.calendarView.defaultView} 
                  onValueChange={(value) => handleCalendarViewChange('defaultView', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day View</SelectItem>
                    <SelectItem value="week">Week View</SelectItem>
                    <SelectItem value="month">Month View</SelectItem>
                  </SelectContent>
                </Select>
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
              <span>Monthly XP Bonus</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Apply your monthly XP bonus based on your current level and XP system.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Bonus:</span>
                    <span className="font-semibold text-green-700">{getMonthlyBonusAmount()} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Claimed:</span>
                    <span className="text-gray-700">
                      {formatMonthYear(state.xp.lastMonthlyBonus)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={canClaimBonus ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                      {canClaimBonus ? '✅ Available' : '⏳ Claimed this month'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={applyMonthlyBonus}
              disabled={!canClaimBonus}
              className={`w-full ${
                canClaimBonus 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              🎁 {canClaimBonus ? 'Claim Monthly Bonus' : 'Already Claimed'}
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
              onClick={() => setShowResetDialog(true)}
              variant="destructive"
              className="w-full"
            >
              🧨 Reset Everything
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">⚠️</span>
                  <h4 className="font-medium text-yellow-800">Warning</h4>
                </div>
                <p className="text-sm text-yellow-700">
                  Changing your XP system will remove your current quest rank setup and reset your reward XP range. 
                  Continue?
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">New System Details:</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {getXPSystem(confirmXPChange)?.name}</p>
                  <p><strong>Description:</strong> {getXPSystem(confirmXPChange)?.description}</p>
                  <p><strong>Reward Range:</strong> {getXPSystem(confirmXPChange)?.rewardRange.min}–{getXPSystem(confirmXPChange)?.rewardRange.max} XP</p>
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
      
      {/* Reset Everything Confirmation */}
      {showResetDialog && (
        <Dialog open={showResetDialog} onOpenChange={() => setShowResetDialog(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>🧨</span>
                <span>Reset Everything</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">⚠️</span>
                  <h4 className="font-medium text-red-800">Are you sure?</h4>
                </div>
                <p className="text-sm text-red-700">
                  This will erase your entire progress, rewards, and tasks. This cannot be undone.
                </p>
              </div>
              
              {/* Reset Options */}
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800">Reset Options:</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="erase-rewards" className="text-sm font-medium">
                    🔥 Erase All Rewards
                  </Label>
                  <Switch
                    id="erase-rewards"
                    checked={resetOptions.eraseRewards}
                    onCheckedChange={(checked) => setResetOptions(prev => ({ ...prev, eraseRewards: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reset-xp-system" className="text-sm font-medium">
                    🧪 Reset XP System to Default
                  </Label>
                  <Switch
                    id="reset-xp-system"
                    checked={resetOptions.resetXPSystem}
                    onCheckedChange={(checked) => setResetOptions(prev => ({ ...prev, resetXPSystem: checked }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-red-800">This will delete:</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>• All active quests</p>
                  <p>• All completed quests</p>
                  <p>• All recurring tasks</p>
                  {resetOptions.eraseRewards && <p>• All claimed rewards</p>}
                  {resetOptions.eraseRewards && <p>• All user-created rewards</p>}
                  <p>• Total XP earned/spent</p>
                  <p>• Level progress (reset to Level 1)</p>
                  <p>• Inventory contents</p>
                  {resetOptions.eraseRewards && <p>• All reward logs</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-green-800">This will keep:</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {!resetOptions.resetXPSystem && <p>• Current XP System setting</p>}
                  <p>• Default XP Systems</p>
                  <p>• Default Rank/Reward suggestions</p>
                  {!resetOptions.eraseRewards && <p>• Default Rewards (not custom ones)</p>}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResetDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmResetEverything}
                  variant="destructive"
                >
                  🧨 Yes, Reset Everything
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