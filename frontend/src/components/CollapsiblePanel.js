import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const CollapsiblePanel = ({ 
  icon, 
  title, 
  children, 
  defaultExpanded = true,
  className = "",
  headerClassName = "",
  contentClassName = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={`transition-all duration-200 ${className}`}>
      <CardHeader 
        className={`cursor-pointer hover:bg-gray-50 transition-colors ${headerClassName}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>{icon}</span>
            <span>{title}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-500 hover:text-gray-700 transition-transform duration-200"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ⌄
          </Button>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className={`border-t border-gray-200 animate-in slide-in-from-top-2 duration-200 ${contentClassName}`}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default CollapsiblePanel;