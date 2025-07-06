import React, { useState, useRef } from 'react';
import { LEVEL_TITLES } from '../data/xpSystems';

const LevelTooltip = ({ children, xpSystem, currentLevel }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const getLevelData = () => {
    return LEVEL_TITLES.map((levelInfo, index) => {
      const xpRequired = xpSystem.levelThresholds[index];
      const monthlyTribute = xpSystem.monthlyBonusXP[index] || 0;
      
      return {
        level: levelInfo.level,
        title: levelInfo.title,
        icon: levelInfo.icon,
        xpRequired,
        monthlyTribute,
        isCurrent: currentLevel.level === levelInfo.level
      };
    });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150); // Small delay to prevent flickering
  };

  const handleTooltipMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsVisible(!isVisible)} // Mobile support
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-4 border-yellow-600 rounded-lg shadow-2xl p-6 medieval-scroll">
            {/* Parchment Header */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-yellow-800 flex items-center justify-center space-x-2" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                <span>🏅</span>
                <span>Adventurer Ranks</span>
                <span>🏅</span>
              </h3>
              <div className="h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent rounded-full mt-2"></div>
            </div>

            {/* Levels Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs font-bold text-yellow-800 pb-2 border-b border-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
                <div>Rank</div>
                <div>Title</div>
                <div>XP Req.</div>
                <div>Monthly</div>
              </div>
              
              {getLevelData().map((level) => (
                <div 
                  key={level.level}
                  className={`grid grid-cols-4 gap-2 text-sm py-2 px-2 rounded transition-all duration-200 ${
                    level.isCurrent 
                      ? 'bg-yellow-200 border-2 border-yellow-700 shadow-md' 
                      : 'hover:bg-yellow-100'
                  }`}
                  style={{ fontFamily: 'Libre Baskerville, serif' }}
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">{level.icon}</span>
                    <span className="font-bold text-yellow-800">{level.level}</span>
                  </div>
                  <div className="font-medium text-yellow-900">{level.title}</div>
                  <div className="font-bold text-green-700">{level.xpRequired}</div>
                  <div className="font-bold text-purple-700">{level.monthlyTribute}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-yellow-400">
              <p className="text-xs text-yellow-700 text-center italic" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                ✨ Monthly Tribute is auto-granted each month based on your current rank ✨
              </p>
            </div>

            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelTooltip;