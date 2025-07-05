import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const CloseableTip = ({ id, icon, title, children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const dismissed = localStorage.getItem(`tip-dismissed-${id}`);
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, [id]);
  
  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`tip-dismissed-${id}`, 'true');
  };
  
  if (!isVisible) return null;
  
  return (
    <Card className={`relative ${className}`}>
      <CardContent className="pt-6">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-1 h-auto"
          onClick={handleClose}
        >
          <X size={16} />
        </Button>
        
        <div className="flex items-start space-x-2 pr-8">
          <span className="text-lg">{icon}</span>
          <div>
            <h4 className="font-medium mb-2">{title}</h4>
            <div className="text-sm">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CloseableTip;