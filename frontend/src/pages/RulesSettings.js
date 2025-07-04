import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useXP } from '../contexts/XPContext';

const RulesSettings = () => {
  const { toast } = useToast();
  const { dispatch } = useXP();
  
  const handleResetQuests = () => {
    if (window.confirm('Are you sure you want to reset all quests? This action cannot be undone.')) {
      localStorage.removeItem('questLogState');
      dispatch({ type: 'RESET_ALL' });
      toast({
        title: "Reset Complete",
        description: "All quests and progress have been reset."
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>Rules & Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Learn how the Quest Log system works and customize your experience.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>🎮 How Quest Log Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">📊 XP System</h3>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• <strong>Common Quests:</strong> 50 XP - Simple daily tasks</li>
                <li>• <strong>Rare Quests:</strong> 75 XP - Weekly or important tasks</li>
                <li>• <strong>Epic Quests:</strong> 150 XP - Major projects or challenges</li>
                <li>• <strong>Legendary Quests:</strong> 200 XP - Life-changing achievements</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">🎯 Quest Status</h3>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• <strong>⏳ Pending:</strong> Quest is ready to start</li>
                <li>• <strong>🔄 In Progress:</strong> Currently working on this quest</li>
                <li>• <strong>✅ Completed:</strong> Quest finished, XP awarded</li>
                <li>• <strong>❌ Incomplete:</strong> Quest failed or abandoned</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">📅 Due Date Colors</h3>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• <strong className="text-red-600">🔴 Red:</strong> Overdue quests</li>
                <li>• <strong className="text-blue-600">🔵 Blue:</strong> Due today</li>
                <li>• <strong className="text-green-600">🟢 Green:</strong> Future quests</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">🎁 Reward System</h3>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• Earn XP by completing quests</li>
                <li>• Spend XP on rewards like gaming time, treats, or personal credits</li>
                <li>• Create custom rewards with your own XP costs</li>
                <li>• Balance earning and spending to maintain motivation</li>
                <li>• Higher-ranked quests give more XP for bigger rewards</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">🏆 Level System</h3>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• Your level is based on total XP earned (not current XP)</li>
                <li>• Each level has a name and XP requirement</li>
                <li>• Customize level names and requirements in Level Settings</li>
                <li>• Progress bars show your advancement to the next level</li>
                <li>• Levels provide long-term motivation for consistent quest completion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>🔄 Recurring Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-600">
            <p>
              Set up tasks that automatically generate quests based on your schedule. Perfect for:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Daily habits (exercise, reading, meditation)</li>
              <li>• Weekly routines (meal prep, cleaning, planning)</li>
              <li>• Monthly goals (review progress, set new objectives)</li>
              <li>• Weekday work tasks (check emails, team meetings)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>🎨 Custom Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-600">
            <p>
              Create personalized rewards that motivate you:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Set your own XP costs based on what feels fair</li>
              <li>• Add emojis to make rewards visually appealing</li>
              <li>• Include notes to remind yourself what the reward includes</li>
              <li>• Edit or delete rewards anytime to keep them relevant</li>
              <li>• Balance small daily rewards with bigger milestone rewards</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>💡 Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-600">
            <li>• Start with Common quests to build momentum</li>
            <li>• Use Epic and Legendary ranks for important goals</li>
            <li>• Set realistic due dates to avoid too many overdue quests</li>
            <li>• Create custom rewards that truly motivate you</li>
            <li>• Customize your level system to match your goals</li>
            <li>• Review your progress weekly to stay motivated</li>
            <li>• Don't be afraid to adjust quest ranks based on actual difficulty</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">🚨 Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">
            This action will permanently delete all your quests, progress, and XP. This cannot be undone!
          </p>
          <Button 
            onClick={handleResetQuests}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            🔄 Reset All Quests
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesSettings;