import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { useQuest } from '../contexts/QuestContext';
import { useToast } from '../hooks/use-toast';

const MonthlyBonusPopup = () => {
  const { state, dispatch, canClaimMonthlyBonus, getCurrentLevelInfo, getXPSystemInfo } = useQuest();
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [dismissedForMonth, setDismissedForMonth] = useState(null);
  
  const currentLevel = getCurrentLevelInfo();
  const xpSystem = getXPSystemInfo();
  
  // Calculate bonus amount
  const getBonusAmount = () => {
    const levelIndex = currentLevel.level - 1;
    return xpSystem.monthlyBonusXP[levelIndex] || 0;
  };
  
  // Get current month identifier
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}`;
  };
  
  // Get month range for display
  const getMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    return `${formatDate(firstDay)} – ${formatDate(lastDay)}`;
  };
  
  useEffect(() => {
    const currentMonth = getCurrentMonth();
    const dismissed = localStorage.getItem('monthlyBonusDismissed');
    
    // Show popup if:
    // 1. User can claim monthly bonus
    // 2. Not dismissed for this month
    // 3. Has XP (not a brand new user)
    if (canClaimMonthlyBonus() && 
        dismissed !== currentMonth && 
        state.xp.totalEarned > 0 &&
        getBonusAmount() > 0) {
      setShowPopup(true);
    }
  }, [canClaimMonthlyBonus, state.xp.totalEarned]);
  
  const handleClaimBonus = () => {
    dispatch({ type: 'APPLY_MONTHLY_BONUS' });
    setShowPopup(false);
    toast({
      title: "Monthly Bonus Claimed! 🎁",
      description: `+${getBonusAmount()} XP has been added to your total!`,
      duration: 5000
    });
  };
  
  const handleDismiss = () => {
    const currentMonth = getCurrentMonth();
    localStorage.setItem('monthlyBonusDismissed', currentMonth);
    setShowPopup(false);
  };
  
  if (!showPopup) return null;
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-lg">
        <CardContent className="p-6 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-1 h-auto"
            onClick={handleDismiss}
          >
            <X size={16} />
          </Button>
          
          <div className="text-center space-y-4">
            <div className="text-4xl">🎁</div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-yellow-800">
                Monthly XP Bonus Available!
              </h3>
              <p className="text-sm text-yellow-700">
                You've earned a monthly XP bonus of <strong>+{getBonusAmount()}</strong> for staying at {currentLevel.icon} <strong>{currentLevel.title}</strong>!
              </p>
            </div>
            
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
              <div className="text-xs text-yellow-600">
                <strong>Bonus period:</strong> {getMonthRange()}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleClaimBonus}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                🎁 Claim Bonus
              </Button>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyBonusPopup;