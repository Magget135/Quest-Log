import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TASK_PROGRESS_STATUS, getTaskProgressStatus } from '../data/xpSystems';

const TaskProgressBadge = ({ questId, currentStatus, onStatusChange, size = "sm" }) => {
  const [isChanging, setIsChanging] = useState(false);
  const statusData = getTaskProgressStatus(currentStatus);

  const handleStatusChange = (newStatus) => {
    setIsChanging(true);
    onStatusChange(questId, newStatus);
    
    // Add a small delay for animation effect
    setTimeout(() => {
      setIsChanging(false);
    }, 300);
  };

  return (
    <div className={`transition-all duration-300 ${isChanging ? 'transform scale-110' : ''}`}>
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="h-auto p-0 border-0 bg-transparent hover:bg-transparent focus:ring-0">
          <SelectValue asChild>
            <Badge 
              variant="outline" 
              className={`${statusData.color} cursor-pointer hover:opacity-80 transition-all duration-200 ${
                size === "xs" ? "text-xs px-2 py-1" : "text-sm px-3 py-1"
              }`}
            >
              <span className="mr-1">{statusData.emoji}</span>
              {statusData.label}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.values(TASK_PROGRESS_STATUS).map(status => (
            <SelectItem key={status.id} value={status.id}>
              <div className="flex items-center space-x-2">
                <span>{status.emoji}</span>
                <span>{status.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskProgressBadge;