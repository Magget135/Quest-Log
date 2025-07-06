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
  const [activeTab, setActiveTab] = useState('rules');
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
      {/* Medieval Settings Header */}
      <div className="medieval-card p-6 shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-3xl">🏛️</span>
          <h1 className="text-3xl font-bold text-yellow-800" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
            Settings
          </h1>
        </div>
        <p className="text-yellow-700 font-medium" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          Customize your Quest Tavern experience and review the ancient guild rules. Use the tabs below to navigate different settings sections.
        </p>
      </div>

      {/* Horizontal Tabs */}
      <div className="medieval-card p-2 shadow-lg">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'rules', label: 'Rules & Tips', icon: '📜' },
            { id: 'xp', label: 'Experience System', icon: '⚙️' },
            { id: 'cleanup', label: 'Archive Management', icon: '🗃' },
            { id: 'quests', label: 'Quest Customization', icon: '🎯' },
            { id: 'merchant', label: 'Merchant & Tribute', icon: '💰' },
            { id: 'danger', label: 'Danger Zone', icon: '☠️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-yellow-600 text-yellow-100 shadow-lg'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'rules' && (
        <CollapsiblePanel 
          icon="📜" 
          title="Ancient Guild Rules & Guidelines" 
          className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 medieval-card"
          defaultExpanded={true}
          showCloseButton={false}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-blue-900 flex items-center space-x-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  <span>🎯</span>
                  <span>Gold & Quest Mastery</span>
                </h3>
                <div className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  <p><strong>✅ Gold Earning:</strong> Only completed quests earn gold pieces—progress status is visual only</p>
                  <p><strong>🔄 Daily Tasks:</strong> Only added to Active Quest Registry when within start-before-due range</p>
                  <p><strong>📈 Progress Status:</strong> "In Progress", "Delaying", etc. are for tracking only—no gold until "Completed"</p>
                  <p><strong>⚡ Quest Completion:</strong> Immediately awards gold and moves quest to chronicles</p>
                  <p><strong>🎁 Monthly Tribute:</strong> Auto-issued monthly gold bonus must be claimed via Settings or popup</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-blue-900 flex items-center space-x-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  <span>⚠️</span>
                  <span>Guild Warnings</span>
                </h3>
                <div className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  <p><strong>🧪 XP System Changes:</strong> Changing XP system deletes previous ranks and adjusts reward range</p>
                  <p><strong>🗑️ Data Loss:</strong> Deleted rewards, categories, or quests cannot be recovered</p>
                  <p><strong>🧨 Reset Warning:</strong> "Reset Everything" permanently erases all progress and data</p>
                  <p><strong>💾 Auto-Save:</strong> All changes are automatically saved to your local guild records</p>
                  <p><strong>🔒 Privacy:</strong> Your quest data stays local on your device only</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-4 medieval-scroll">
              <h4 className="font-bold text-yellow-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>💡 Master's Wisdom</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                <div>
                  <p><strong>🎮 Adventure:</strong> Use Urgent tags for high-priority quests</p>
                  <p><strong>📅 Scheduling:</strong> Set daily tasks with appropriate start-before-due timing</p>
                </div>
                <div>
                  <p><strong>🏆 Progression:</strong> Higher XP systems offer more customization but require more effort</p>
                  <p><strong>🎁 Rewards:</strong> Balance gold costs with your completion rate for motivation</p>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-yellow-500">
                <p className="text-center text-yellow-800 font-medium italic" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  🌟 "Remember, your journey is uniquely yours. Set fair XP, challenge yourself, and enjoy the quest. Every hero starts small." 🌟
                </p>
              </div>
            </div>
          </div>
        </CollapsiblePanel>
      )}

      {activeTab === 'xp' && (
        <CollapsiblePanel 
          icon="🧪" 
          title="Experience System Configuration" 
          className="border-purple-200 medieval-card"
          defaultExpanded={true}
          showCloseButton={false}
        >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-600 rounded-lg medieval-scroll">
            <div>
              <h3 className="font-bold text-blue-900" style={{ fontFamily: 'Cinzel, serif' }}>Current System</h3>
              <p className="text-sm text-blue-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>{currentXPSystem.description}</p>
            </div>
            <div className="medieval-scroll px-3 py-1">
              <Badge className="bg-blue-600 text-blue-100 text-lg px-3 py-1 font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                {currentXPSystem.name}
              </Badge>
            </div>
          </div>
          
          <div>
            <Label htmlFor="xp-system" className="font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>Choose Experience System</Label>
            <Select value={state.settings.xpSystem} onValueChange={handleXPSystemChange}>
              <SelectTrigger className="border-yellow-600 bg-yellow-50 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(XP_SYSTEMS).map(system => (
                  <SelectItem key={system.id} value={system.id}>
                    <div className="flex flex-col">
                      <span className="font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{system.name}</span>
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Libre Baskerville, serif' }}>{system.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* XP System Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>Quest Ranks & Gold</h4>
              <div className="space-y-1">
                {currentXPSystem.ranks.map(rank => (
                  <div key={rank.value} className="flex justify-between text-sm">
                    <Badge className={rank.color} variant="outline" style={{ fontFamily: 'Cinzel, serif' }}>
                      {rank.label}
                    </Badge>
                    <span className="text-gray-600 font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{rank.xp} Gold</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>System Limits</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600" style={{ fontFamily: 'Libre Baskerville, serif' }}>Reward Gold Range:</span>
                  <span className="font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{currentXPSystem.rewardRange.min}-{currentXPSystem.rewardRange.max}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600" style={{ fontFamily: 'Libre Baskerville, serif' }}>Monthly Tribute:</span>
                  <span className="font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{currentXPSystem.monthlyBonusXP.join(' / ')} Gold</span>
                </div>
              </div>
            </div>
          </div>
          
          <CloseableTip 
            id="xp-system-tip"
            icon="💡"
            title="Fair Play Wisdom"
            className="bg-yellow-50 border-yellow-600 medieval-scroll"
          >
            <p className="text-yellow-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Choose a system that fits your adventuring lifestyle. Lower XP systems are easier to manage. 
              Higher XP systems give you more customization options.
            </p>
          </CloseableTip>
        </div>
      </CollapsiblePanel>

      {/* Auto Cleanup Panel */}
      <CollapsiblePanel 
        icon="🗑️" 
        title="Archive Management" 
        className="border-orange-200 medieval-card"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-cleanup-toggle" className="text-base font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>
                Enable Auto-Archive
              </Label>
              <p className="text-sm text-yellow-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                Automatically archive completed quests after a specified time
              </p>
            </div>
            <Switch
              id="auto-cleanup-toggle"
              checked={state.settings.autoCleanup.enabled}
              onCheckedChange={(checked) => handleAutoCleanupChange('enabled', checked)}
            />
          </div>
          
          {state.settings.autoCleanup.enabled && (
            <div className="space-y-4 pl-4 border-l-4 border-yellow-600 bg-yellow-50 p-4 rounded medieval-scroll">
              <div>
                <Label htmlFor="cleanup-frequency" className="font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>Archive completed quests after</Label>
                <Select 
                  value={state.settings.autoCleanup.frequency} 
                  onValueChange={(value) => handleAutoCleanupChange('frequency', value)}
                >
                  <SelectTrigger className="border-yellow-600 bg-yellow-50 mt-2">
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
                  <Label htmlFor="recurring-only" className="text-sm font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>
                    Only archive daily tasks
                  </Label>
                  <Switch
                    id="recurring-only"
                    checked={state.settings.autoCleanup.recurringOnly}
                    onCheckedChange={(checked) => handleAutoCleanupChange('recurringOnly', checked)}
                  />
                </div>
              
                <div className="flex items-center justify-between">
                  <Label htmlFor="keep-important" className="text-sm font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>
                    Keep quests marked as "Urgent"
                  </Label>
                  <Switch
                    id="keep-important"
                    checked={state.settings.autoCleanup.keepImportant}
                    onCheckedChange={(checked) => handleAutoCleanupChange('keepImportant', checked)}
                  />
                </div>
              
                <div className="flex items-center justify-between">
                  <Label htmlFor="cleanup-rewards" className="text-sm font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>
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
        </div>
      </CollapsiblePanel>

      {/* Quest Customization Panel */}
      <CollapsiblePanel 
        icon="🎨" 
        title="Quest Customization" 
        className="border-green-200 medieval-card"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="calendar-enabled" className="text-base font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>
                Enable Quest Calendar
              </Label>
              <p className="text-sm text-yellow-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                Show quest calendar below the Active Quest Registry in Main Hall
              </p>
            </div>
            <Switch
              id="calendar-enabled"
              checked={state.settings.calendarView.enabled}
              onCheckedChange={(checked) => handleCalendarViewChange('enabled', checked)}
            />
          </div>
          
          {state.settings.calendarView.enabled && (
            <div className="pl-4 border-l-4 border-green-600 bg-green-50 p-4 rounded medieval-scroll">
              <div>
                <Label htmlFor="default-view" className="font-bold text-green-800" style={{ fontFamily: 'Cinzel, serif' }}>Default Calendar View</Label>
                <Select 
                  value={state.settings.calendarView.defaultView} 
                  onValueChange={(value) => handleCalendarViewChange('defaultView', value)}
                >
                  <SelectTrigger className="border-green-600 bg-green-50 mt-2">
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
        </div>
      </CollapsiblePanel>

      {/* Daily Tasks Rules Panel */}
      <CollapsiblePanel 
        icon="🔄" 
        title="Daily Task Settings" 
        className="border-cyan-200 medieval-card"
        defaultExpanded={false}
      >
        <div className="space-y-4">
          <div className="bg-cyan-50 border-2 border-cyan-600 rounded-lg p-4 medieval-scroll">
            <h4 className="font-bold text-cyan-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>🔄 Daily Task Behavior</h4>
            <div className="space-y-2 text-sm text-cyan-800" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              <p><strong>⏰ Start Before Due:</strong> Tasks appear in Active Quest Registry based on your configured timing (0-7 days early)</p>
              <p><strong>📅 Frequency Types:</strong> Daily, Weekly, Monthly, Weekdays, Yearly, Weekends Only, or Custom patterns</p>
              <p><strong>🔧 Custom Frequency:</strong> Create advanced patterns like "every 2 weeks on Monday and Friday"</p>
              <p><strong>🎂 Yearly Tasks:</strong> Perfect for birthdays, anniversaries, or annual renewals</p>
              <p><strong>🎮 Weekend Tasks:</strong> Leisure activities automatically scheduled for Saturday and Sunday</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>Frequency Examples</h4>
              <div className="space-y-1 text-sm text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                <p><strong>📅 Daily:</strong> Exercise, journaling, meditation</p>
                <p><strong>📆 Weekly:</strong> Grocery shopping, weekly review</p>
                <p><strong>🗓️ Monthly:</strong> Goal setting, bill paying</p>
                <p><strong>🎂 Yearly:</strong> Birthday planning, insurance renewal</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>Advanced Features</h4>
              <div className="space-y-1 text-sm text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                <p><strong>🔧 Custom:</strong> "Every 3 weeks on Tuesday"</p>
                <p><strong>⏰ Early Start:</strong> "Add 2 days before due"</p>
                <p><strong>🎮 Weekends:</strong> "Only Saturday & Sunday"</p>
                <p><strong>📅 End Conditions:</strong> "After 10 times" or "Until Dec 31"</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsiblePanel>

      {/* Reward Settings & Monthly Bonus Panel */}
      <CollapsiblePanel 
        icon="🎁" 
        title="Merchant Settings & Monthly Tribute" 
        className="border-yellow-200 medieval-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-yellow-900 flex items-center space-x-2" style={{ fontFamily: 'Cinzel, serif' }}>
              <span>🎁</span>
              <span>Monthly Gold Tribute</span>
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-yellow-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                Claim your monthly gold tribute based on your current level and experience system.
              </p>
              <div className="bg-green-50 border-2 border-green-600 rounded-lg p-3 medieval-scroll">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Libre Baskerville, serif' }}>Available Tribute:</span>
                    <span className="font-bold text-green-700" style={{ fontFamily: 'Cinzel, serif' }}>{getMonthlyBonusAmount()} Gold</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Libre Baskerville, serif' }}>Last Claimed:</span>
                    <span className="text-gray-700" style={{ fontFamily: 'Cinzel, serif' }}>
                      {formatMonthYear(state.xp.lastMonthlyBonus)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Libre Baskerville, serif' }}>Status:</span>
                    <div className="medieval-scroll px-2 py-1">
                      <Badge className={canClaimBonus ? 'bg-green-600 text-green-100' : 'bg-orange-600 text-orange-100'} style={{ fontFamily: 'Cinzel, serif' }}>
                        {canClaimBonus ? '✅ Available' : '⏳ Claimed this month'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={applyMonthlyBonus}
              disabled={!canClaimBonus}
              className={`w-full medieval-button ${
                !canClaimBonus 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              🎁 {canClaimBonus ? 'Claim Monthly Tribute' : 'Already Claimed'}
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-yellow-900 flex items-center space-x-2" style={{ fontFamily: 'Cinzel, serif' }}>
              <span>🏆</span>
              <span>Merchant Guidelines</span>
            </h3>
            <div className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              <p><strong>💰 Cost Balance:</strong> Set reward costs based on your average quest completion rate</p>
              <p><strong>🎯 Motivation:</strong> Use rewards as motivation for completing challenging quests</p>
              <p><strong>⚖️ Gold Range:</strong> Rewards must stay within your current XP system's range</p>
              <p><strong>🛍️ Custom Rewards:</strong> Create personalized rewards that matter to you</p>
              <p><strong>📦 Inventory:</strong> Claimed rewards go to inventory—use them when earned!</p>
            </div>
          </div>
        </div>
      </CollapsiblePanel>

      {/* Danger Zone Panel */}
      <CollapsiblePanel 
        icon="💥" 
        title="Danger Zone" 
        className="border-red-600 bg-gradient-to-r from-red-50 to-pink-50 medieval-card"
        defaultExpanded={false}
      >
        <div className="space-y-4">
          <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 medieval-scroll">
            <h4 className="font-bold text-red-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>⚠️ Irreversible Actions</h4>
            <p className="text-sm text-red-800" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              These actions permanently destroy guild records and cannot be undone. Use with extreme caution.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>💾 Guild Records Management</h4>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Reset all quest tavern data to start fresh. This action cannot be undone.
            </p>
            <Button 
              onClick={() => setShowResetDialog(true)}
              variant="destructive"
              className="w-full medieval-button bg-red-600 hover:bg-red-700"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              🧨 Reset Everything
            </Button>
          </div>
        </div>
      </CollapsiblePanel>
      
      {/* XP System Change Confirmation */}
      {confirmXPChange && (
        <Dialog open={!!confirmXPChange} onOpenChange={() => setConfirmXPChange(null)}>
          <DialogContent className="max-w-md medieval-card">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2" style={{ fontFamily: 'Cinzel, serif' }}>
                <span>⚠️</span>
                <span>Confirm XP System Change</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-4 animate-pulse medieval-scroll">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">⚠️</span>
                  <h4 className="font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>Warning</h4>
                </div>
                <p className="text-sm text-yellow-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Changing your XP system will remove your current quest rank setup and reset your reward gold range. 
                  Continue?
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold" style={{ fontFamily: 'Cinzel, serif' }}>New System Details:</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {getXPSystem(confirmXPChange)?.name}</p>
                  <p><strong>Description:</strong> {getXPSystem(confirmXPChange)?.description}</p>
                  <p><strong>Reward Range:</strong> {getXPSystem(confirmXPChange)?.rewardRange.min}–{getXPSystem(confirmXPChange)?.rewardRange.max} Gold</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmXPChange(null)}
                  className="border-yellow-600 text-yellow-800 hover:bg-yellow-50"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmXPSystemChange}
                  className="medieval-button bg-red-600 hover:bg-red-700"
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
          <DialogContent className="max-w-md medieval-card">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2" style={{ fontFamily: 'Cinzel, serif' }}>
                <span>🧨</span>
                <span>Reset Everything</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 animate-pulse medieval-scroll">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">⚠️</span>
                  <h4 className="font-bold text-red-800" style={{ fontFamily: 'Cinzel, serif' }}>Are you sure?</h4>
                </div>
                <p className="text-sm text-red-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  This will erase your entire guild progress, rewards, and tasks. This cannot be undone.
                </p>
              </div>
              
              {/* Reset Options */}
              <div className="space-y-3 bg-gray-50 rounded-lg p-4 medieval-scroll">
                <h4 className="font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>Reset Options:</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="erase-rewards" className="text-sm font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                    🔥 Erase All Rewards
                  </Label>
                  <Switch
                    id="erase-rewards"
                    checked={resetOptions.eraseRewards}
                    onCheckedChange={(checked) => setResetOptions(prev => ({ ...prev, eraseRewards: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reset-xp-system" className="text-sm font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
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
                <h4 className="font-bold text-red-800" style={{ fontFamily: 'Cinzel, serif' }}>This will destroy:</h4>
                <div className="text-sm text-gray-700 space-y-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  <p>• All active quests</p>
                  <p>• All completed quests</p>
                  <p>• All daily tasks</p>
                  {resetOptions.eraseRewards && <p>• All claimed rewards</p>}
                  {resetOptions.eraseRewards && <p>• All user-created rewards</p>}
                  <p>• Total gold earned/spent</p>
                  <p>• Level progress (reset to Level 1)</p>
                  <p>• Inventory contents</p>
                  {resetOptions.eraseRewards && <p>• All reward logs</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-green-800" style={{ fontFamily: 'Cinzel, serif' }}>This will preserve:</h4>
                <div className="text-sm text-gray-700 space-y-1" style={{ fontFamily: 'Libre Baskerville, serif' }}>
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
                  className="border-yellow-600 text-yellow-800 hover:bg-yellow-50"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmResetEverything}
                  variant="destructive"
                  className="medieval-button bg-red-600 hover:bg-red-700"
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