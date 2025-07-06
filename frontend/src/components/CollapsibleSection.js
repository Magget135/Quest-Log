import React, { useState } from 'react';
import { Button } from './ui/button';

const CollapsibleSection = ({ 
  title, 
  icon, 
  children, 
  defaultExpanded = false,
  className = "",
  showCloseButton = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    return (
      <div className={`medieval-card p-4 border-2 border-yellow-600 bg-yellow-50 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{icon}</span>
            <span className="font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>
              {title}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-100"
          >
            <span className="text-sm">Expand ▼</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`medieval-card p-6 border-2 border-yellow-600 bg-yellow-50 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{icon}</span>
          <span className="font-bold text-yellow-800" style={{ fontFamily: 'Cinzel, serif' }}>
            {title}
          </span>
        </div>
        {showCloseButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-100"
          >
            <span className="text-sm">✕</span>
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection;