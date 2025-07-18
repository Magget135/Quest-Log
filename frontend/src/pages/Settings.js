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
import { Settings as SettingsIcon, Trophy, Archive, Zap, AlertTriangle, Gift, Calendar, Info } from 'lucide-react';

const Settings = () => {
  const { state, dispatch, getXPSystemInfo, canClaimMonthlyBonus } = useQuest();
  const { toast } = useToast();
  const [confirmXPChange, setConfirmXPChange] = useState(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-800">Settings</h1>
        </div>
        <p className="text-blue-700">
          Customize your Quest Tavern experience with these simple settings.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-2 shadow-sm">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'general', label: 'General', icon: SettingsIcon },
            { id: 'automation', label: 'Automation', icon: Zap },
            { id: 'advanced', label: 'Advanced', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* XP System Selection */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
              <CardTitle className="flex items-center space-x-2 text-purple-800">
                <Trophy className="w-5 h-5" />
                <span>Experience System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-blue-900">Current System</h3>
                  <p className="text-sm text-blue-700">{currentXPSystem.description}</p>
                </div>
                <Badge className="bg-blue-600 text-white px-3 py-1 text-sm">
                  {currentXPSystem.name}
                </Badge>
              </div>
              
              <div>
                <Label htmlFor="xp-system" className="text-sm font-medium text-gray-700 mb-2 block">
                  Choose your experience system:
                </Label>
                <Select value={state.settings.xpSystem} onValueChange={handleXPSystemChange}>
                  <SelectTrigger className="border-gray-300">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Quest Rewards</h4>
                  <div className="space-y-1">
                    {currentXPSystem.ranks.map(rank => (
                      <div key={rank.value} className="flex justify-between">
                        <Badge variant="outline" className={rank.color}>
                          {rank.label}
                        </Badge>
                        <span className="text-gray-600 font-medium">{rank.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">System Info</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shop Range:</span>
                      <span className="font-medium">{currentXPSystem.rewardRange.min}-{currentXPSystem.rewardRange.max} XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Bonus:</span>
                      <span className="font-medium">{currentXPSystem.monthlyBonusXP.join(' / ')} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Bonus */}
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Gift className="w-5 h-5" />
                <span>Monthly Bonus</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    Claim your monthly XP bonus based on your current level.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Bonus:</span>
                        <span className="font-semibold text-green-600">{getMonthlyBonusAmount()} XP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Claimed:</span>
                        <span className="text-gray-700">{formatMonthYear(state.xp.lastMonthlyBonus)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={canClaimBonus ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}>
                          {canClaimBonus ? '✅ Ready' : '⏳ Claimed'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={applyMonthlyBonus}
                    disabled={!canClaimBonus}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {canClaimBonus ? 'Claim Monthly Bonus' : 'Already Claimed'}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">How it works:</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Monthly bonuses are based on your level</p>
                    <p>• Higher levels get more bonus XP</p>
                    <p>• Available once per month</p>
                    <p>• Helps you progress faster</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Automation Settings */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          {/* Auto-Archive */}
          <Card className="border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <Archive className="w-5 h-5" />
                <span>Auto-Archive</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-cleanup-toggle" className="text-base font-medium text-gray-900">
                    Enable Auto-Archive
                  </Label>
                  <p className="text-sm text-gray-600">
                    Automatically move completed quests to your archive after a set time
                  </p>
                </div>
                <Switch
                  id="auto-cleanup-toggle"
                  checked={state.settings.autoCleanup.enabled}
                  onCheckedChange={(checked) => handleAutoCleanupChange('enabled', checked)}
                />
              </div>
              
              {state.settings.autoCleanup.enabled && (
                <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <Label htmlFor="cleanup-frequency" className="text-sm font-medium text-gray-700 mb-2 block">
                      Archive completed quests after:
                    </Label>
                    <Select 
                      value={state.settings.autoCleanup.frequency} 
                      onValueChange={(value) => handleAutoCleanupChange('frequency', value)}
                    >
                      <SelectTrigger className="border-gray-300">
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
                      <Label htmlFor="recurring-only" className="text-sm font-medium text-gray-700">
                        Only archive daily tasks
                      </Label>
                      <Switch
                        id="recurring-only"
                        checked={state.settings.autoCleanup.recurringOnly}
                        onCheckedChange={(checked) => handleAutoCleanupChange('recurringOnly', checked)}
                      />
                    </div>
                  
                    <div className="flex items-center justify-between">
                      <Label htmlFor="keep-important" className="text-sm font-medium text-gray-700">
                        Keep important quests
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

          {/* Calendar View */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Calendar className="w-5 h-5" />
                <span>Calendar View</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="calendar-enabled" className="text-base font-medium text-gray-900">
                    Show Calendar
                  </Label>
                  <p className="text-sm text-gray-600">
                    Display a calendar view of your quests on the main page
                  </p>
                </div>
                <Switch
                  id="calendar-enabled"
                  checked={state.settings.calendarView.enabled}
                  onCheckedChange={(checked) => handleCalendarViewChange('enabled', checked)}
                />
              </div>
              
              {state.settings.calendarView.enabled && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <Label htmlFor="default-view" className="text-sm font-medium text-gray-700 mb-2 block">
                    Default calendar view:
                  </Label>
                  <Select 
                    value={state.settings.calendarView.defaultView} 
                    onValueChange={(value) => handleCalendarViewChange('defaultView', value)}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day View</SelectItem>
                      <SelectItem value="week">Week View</SelectItem>
                      <SelectItem value="month">Month View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Settings */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {/* Help & Tips */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Info className="w-5 h-5" />
                <span>Quick Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Getting Started</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Complete quests to earn XP</p>
                    <p>• Use XP to buy rewards from the shop</p>
                    <p>• Set up daily tasks for recurring activities</p>
                    <p>• Check your achievements progress</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Pro Tips</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Higher XP systems offer more customization</p>
                    <p>• Use the calendar to schedule important quests</p>
                    <p>• Mark urgent quests with the important flag</p>
                    <p>• Claim your monthly bonus regularly</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span>Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">⚠️ Reset All Data</h4>
                  <p className="text-sm text-red-800">
                    This will permanently delete all your quests, rewards, and progress. This cannot be undone!
                  </p>
                </div>
                
                <Button 
                  onClick={() => setShowResetDialog(true)}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Reset Everything
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* XP System Change Confirmation */}
      {confirmXPChange && (
        <Dialog open={!!confirmXPChange} onOpenChange={() => setConfirmXPChange(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Confirm XP System Change</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Warning</h4>
                <p className="text-sm text-orange-800">
                  Changing your XP system will adjust your quest rewards and reset your reward shop range. Continue?
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">New System:</h4>
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
                  className="bg-orange-600 hover:bg-orange-700"
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
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Reset Everything</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Are you sure?</h4>
                <p className="text-sm text-red-800">
                  This will permanently delete all your data and cannot be undone.
                </p>
              </div>
              
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800">Reset Options:</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="erase-rewards" className="text-sm font-medium">
                    Delete all rewards
                  </Label>
                  <Switch
                    id="erase-rewards"
                    checked={resetOptions.eraseRewards}
                    onCheckedChange={(checked) => setResetOptions(prev => ({ ...prev, eraseRewards: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reset-xp-system" className="text-sm font-medium">
                    Reset XP system to default
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
                  <p>• All your quests and tasks</p>
                  <p>• All your progress and XP</p>
                  <p>• Your inventory and claimed rewards</p>
                  {resetOptions.eraseRewards && <p>• Your custom rewards</p>}
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
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, Reset Everything
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