import React, { useState, useEffect } from 'react';
import { X, Info, Settings, RotateCcw } from 'lucide-react';

export default function DemoDataNotification({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show notification after a brief delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow fade out animation
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-amber-50 border-4 border-amber-900 rounded-lg max-w-md w-full transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-4 py-3 rounded-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-amber-200" />
              <h3 className="text-lg font-bold text-amber-100">Welcome, New Adventurer!</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-amber-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 font-semibold mb-2">🎮 Sample Data Loaded</p>
            <p className="text-blue-700 text-sm">
              Your account includes <strong>demo quest data</strong> for exploration purposes only. 
              This helps you understand how the Quest Tavern system works!
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-amber-900 flex items-center">
              <span className="mr-2">📚</span>
              Here's what you can explore:
            </h4>
            
            <ul className="text-sm text-amber-800 space-y-2 ml-4">
              <li>• <strong>Active Quests</strong> - See how quest management works</li>
              <li>• <strong>XP & Level System</strong> - Experience the RPG progression</li>
              <li>• <strong>Rewards & Inventory</strong> - Try claiming and using rewards</li>
              <li>• <strong>Achievements</strong> - Discover the achievement system</li>
              <li>• <strong>Calendar View</strong> - Explore quest scheduling</li>
              <li>• <strong>Recurring Tasks</strong> - See automated quest creation</li>
            </ul>
          </div>
          
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-800 font-semibold mb-2">🎯 Recommended Process:</p>
            <ol className="text-green-700 text-sm space-y-1 list-decimal list-inside">
              <li>Explore the demo data and try different features</li>
              <li>Choose your preferred XP system in <Settings className="w-4 h-4 inline mx-1" /> Settings</li>
              <li>Use the <RotateCcw className="w-4 h-4 inline mx-1" /> Reset option to start fresh</li>
              <li>Begin creating your personalized quest system!</li>
            </ol>
          </div>
          
          <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-800 text-sm">
              <strong>💡 Pro Tip:</strong> The demo data is completely safe to interact with. 
              Complete quests, claim rewards, and test everything! You can always reset when ready.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 pb-4">
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            🚀 Start Exploring!
          </button>
        </div>
      </div>
    </div>
  );
}