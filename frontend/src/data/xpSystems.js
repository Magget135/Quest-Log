// XP Systems for Quest Log RPG
export const XP_SYSTEMS = {
  SIMPLE: {
    id: 'simple',
    name: 'Simple Starter',
    description: 'Minimalist system for casual adventurers. Great for beginners.',
    ranks: [
      { value: 'Easy', label: 'Easy', xp: 10, color: 'bg-green-100 text-green-800' },
      { value: 'Medium', label: 'Medium', xp: 20, color: 'bg-yellow-100 text-yellow-800' },
      { value: 'Hard', label: 'Hard', xp: 30, color: 'bg-orange-100 text-orange-800' },
      { value: 'Extreme', label: 'Extreme', xp: 50, color: 'bg-red-100 text-red-800' }
    ],
    rewardRange: { min: 0, max: 50 },
    monthlyBonusXP: [0, 10, 20, 30, 40],
    levelThresholds: [0, 250, 600, 1000, 1500]
  },
  DEFAULT: {
    id: 'default',
    name: 'Default',
    description: 'Balanced XP system for all players. Simple and easy to use.',
    ranks: [
      { value: 'Common', label: 'Common', xp: 25, color: 'bg-gray-100 text-gray-800' },
      { value: 'Rare', label: 'Rare', xp: 50, color: 'bg-blue-100 text-blue-800' },
      { value: 'Epic', label: 'Epic', xp: 75, color: 'bg-purple-100 text-purple-800' },
      { value: 'Legendary', label: 'Legendary', xp: 100, color: 'bg-yellow-100 text-yellow-800' }
    ],
    rewardRange: { min: 0, max: 150 },
    monthlyBonusXP: [0, 25, 50, 75, 100],
    levelThresholds: [0, 500, 1200, 2000, 3000]
  },
  CHALLENGER: {
    id: 'challenger',
    name: 'Heroic Grind',
    description: 'Challenging system with steeper XP climb. Best for committed players.',
    ranks: [
      { value: 'Novice', label: 'Novice', xp: 50, color: 'bg-gray-100 text-gray-800' },
      { value: 'Skilled', label: 'Skilled', xp: 100, color: 'bg-green-100 text-green-800' },
      { value: 'Veteran', label: 'Veteran', xp: 150, color: 'bg-blue-100 text-blue-800' },
      { value: 'Elite', label: 'Elite', xp: 200, color: 'bg-purple-100 text-purple-800' }
    ],
    rewardRange: { min: 50, max: 400 },
    monthlyBonusXP: [0, 40, 80, 120, 160],
    levelThresholds: [0, 750, 1800, 3000, 4500]
  },
  PRECISION: {
    id: 'precision',
    name: 'Epic Precision',
    description: 'Detailed system with more ranks and XP steps. Ideal for power users.',
    ranks: [
      { value: 'Tier I', label: 'Tier I', xp: 30, color: 'bg-gray-100 text-gray-800' },
      { value: 'Tier II', label: 'Tier II', xp: 60, color: 'bg-blue-100 text-blue-800' },
      { value: 'Tier III', label: 'Tier III', xp: 90, color: 'bg-green-100 text-green-800' },
      { value: 'Tier IV', label: 'Tier IV', xp: 120, color: 'bg-purple-100 text-purple-800' }
    ],
    rewardRange: { min: 0, max: 300 },
    monthlyBonusXP: [0, 20, 45, 65, 85],
    levelThresholds: [0, 400, 950, 1600, 2400]
  },
  ULTRA_RPG: {
    id: 'ultra_rpg',
    name: 'Relaxed Explorer',
    description: 'Slower pace with lower XP values. Ideal for relaxed or busy schedules.',
    ranks: [
      { value: 'Fledgling', label: 'Fledgling', xp: 15, color: 'bg-gray-100 text-gray-800' },
      { value: 'Adept', label: 'Adept', xp: 25, color: 'bg-green-100 text-green-800' },
      { value: 'Hero', label: 'Hero', xp: 40, color: 'bg-blue-100 text-blue-800' },
      { value: 'Warlord', label: 'Warlord', xp: 60, color: 'bg-red-100 text-red-800' }
    ],
    rewardRange: { min: 0, max: 75 },
    monthlyBonusXP: [0, 15, 30, 45, 60],
    levelThresholds: [0, 300, 720, 1200, 1800]
  }
};

export const LEVEL_TITLES = [
  { level: 1, title: 'Wanderer', color: 'bg-gray-100 text-gray-800', icon: '🚶' },
  { level: 2, title: 'Explorer', color: 'bg-green-100 text-green-800', icon: '🧭' },
  { level: 3, title: 'Champion', color: 'bg-blue-100 text-blue-800', icon: '🏆' },
  { level: 4, title: 'Legend', color: 'bg-purple-100 text-purple-800', icon: '⭐' },
  { level: 5, title: 'Mythic', color: 'bg-yellow-100 text-yellow-800', icon: '🌟' }
];

export const AUTO_CLEANUP_OPTIONS = [
  { value: 'disabled', label: 'Disabled' },
  { value: '1week', label: '1 Week' },
  { value: '2weeks', label: '2 Weeks' },
  { value: '1month', label: '1 Month' },
  { value: '2months', label: 'Bi-Monthly' }
];

export const getXPSystem = (systemId) => {
  return Object.values(XP_SYSTEMS).find(system => system.id === systemId) || XP_SYSTEMS.DEFAULT;
};

export const getCurrentLevel = (totalXP, xpSystem) => {
  const thresholds = xpSystem.levelThresholds;
  let level = 1;
  
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalXP >= thresholds[i]) {
      level = i + 1;
      break;
    }
  }
  
  return {
    level,
    ...LEVEL_TITLES[level - 1],
    xpRequired: thresholds[level - 1],
    nextLevelXP: thresholds[level] || null
  };
};

export const getLevelProgress = (totalXP, xpSystem) => {
  const currentLevel = getCurrentLevel(totalXP, xpSystem);
  
  if (!currentLevel.nextLevelXP) {
    return { progress: 100, progressXP: 0, totalXPForNext: 0 };
  }
  
  const progressXP = totalXP - currentLevel.xpRequired;
  const totalXPForNext = currentLevel.nextLevelXP - currentLevel.xpRequired;
  const progress = Math.min(100, (progressXP / totalXPForNext) * 100);
  
  return { progress, progressXP, totalXPForNext };
};