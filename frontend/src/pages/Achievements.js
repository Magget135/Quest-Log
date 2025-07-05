import React from 'react';
import { useQuest } from '../contexts/QuestContext';
import Badges from '../components/Badges';

const Achievements = () => {
  const { state } = useQuest();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Badges achievements={state.achievements || []} />
    </div>
  );
};

export default Achievements;