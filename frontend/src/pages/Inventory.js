import React, { useState } from 'react';
import { useQuest } from '../contexts/QuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { formatCompletedTimestamp } from '../utils/timeUtils';

const Inventory = () => {
  const { state, dispatch } = useQuest();
  const { toast } = useToast();
  const [useItemDialog, setUseItemDialog] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleUseItem = (item) => {
    setUseItemDialog(item);
  };
  
  const confirmUseItem = () => {
    if (useItemDialog) {
      dispatch({ type: 'USE_INVENTORY_ITEM', payload: useItemDialog.id });
      
      // Generate dynamic success message
      const messages = [
        `🎉 You've used ${useItemDialog.rewardName}! Enjoy your well-earned reward!`,
        `🧙 ${useItemDialog.rewardName} has been activated. Great work, adventurer!`,
        `🍀 You claimed ${useItemDialog.rewardName}. Don't forget to treat yourself.`,
        `⚡ ${useItemDialog.rewardName} is now ready to be enjoyed!`,
        `🎊 Time to enjoy your ${useItemDialog.rewardName}! You've earned it!`
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      toast({
        title: "Reward Activated! ✨",
        description: randomMessage,
        duration: 5000
      });
      
      setUseItemDialog(null);
    }
  };
  
  const getCategoryIcon = (rewardName) => {
    const name = rewardName.toLowerCase();
    if (name.includes('gaming') || name.includes('game')) return '🎮';
    if (name.includes('movie') || name.includes('film')) return '🍿';
    if (name.includes('social') || name.includes('media')) return '📱';
    if (name.includes('book') || name.includes('read')) return '📚';
    if (name.includes('ice cream') || name.includes('treat')) return '🍦';
    if (name.includes('money') || name.includes('spend')) return '💰';
    return '🎁';
  };
  
  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-green-600 text-white shadow-2xl cursor-pointer" onClick={() => setIsCollapsed(false)}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎒</span>
              <span className="font-bold">Inventory</span>
              <Badge className="bg-white text-green-600 font-bold">
                {state.inventory.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inventory Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>🎒</span>
              <span>Adventurer's Inventory</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                {state.inventory.length} item{state.inventory.length !== 1 ? 's' : ''}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="text-green-800 hover:text-green-900 hover:bg-green-100"
              >
                ✕
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-2xl">🎒</div>
            <div>
              <h3 className="font-semibold text-gray-900">Your Claimed Rewards</h3>
              <p className="text-sm text-gray-600">
                These are rewards you've claimed with XP. Click "Use" when you're ready to enjoy them!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Inventory Items */}
      {state.inventory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.inventory.map((item) => (
            <Card 
              key={item.id} 
              className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">{getCategoryIcon(item.rewardName)}</div>
                <CardTitle className="text-lg">{item.rewardName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.description && (
                  <p className="text-sm text-gray-600 text-center">
                    {item.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">XP Cost:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      💰 {item.xpCost} XP
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Claimed:</span>
                    <span className="text-gray-700">
                      {formatCompletedTimestamp(item.dateClaimed)}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleUseItem(item)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  ✨ Use Reward
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎒</div>
            <h3 className="text-xl font-semibold mb-2">Inventory is Empty</h3>
            <p className="text-gray-600 mb-6">
              Claim some rewards from the Reward Store to fill your inventory!
            </p>
            <Button 
              onClick={() => window.location.href = '/rewards'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              🛍️ Visit Reward Store
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Use Item Confirmation Dialog */}
      {useItemDialog && (
        <Dialog open={!!useItemDialog} onOpenChange={() => setUseItemDialog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>✨</span>
                <span>Use Reward</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{getCategoryIcon(useItemDialog.rewardName)}</div>
                <h3 className="text-lg font-semibold">{useItemDialog.rewardName}</h3>
                {useItemDialog.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {useItemDialog.description}
                  </p>
                )}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <h4 className="font-medium text-yellow-800">Ready to enjoy your reward?</h4>
                    <p className="text-sm text-yellow-700">
                      Once used, this item will be removed from your inventory.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setUseItemDialog(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmUseItem}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✨ Use Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Inventory;