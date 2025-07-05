import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Edit } from 'lucide-react';
import { useQuest } from '../contexts/QuestContext';
import { formatDistanceToNow, format, startOfDay, endOfDay, isToday, isPast, isFuture, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, isSameDay, parseISO, isValid } from 'date-fns';
import TaskProgressBadge from './TaskProgressBadge';

const CalendarView = ({ onEditQuest }) => {
  const { state, getXPSystemInfo, dispatch } = useQuest();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // 'day', 'week', 'month'
  
  const xpSystem = getXPSystemInfo();

  const handleProgressChange = (questId, newStatus) => {
    dispatch({ 
      type: 'UPDATE_QUEST_PROGRESS', 
      payload: { id: questId, progressStatus: newStatus } 
    });
  };
  
  // Get quest color based on due date
  const getQuestColor = (dueDate) => {
    const due = parseISO(dueDate);
    if (!isValid(due)) return 'bg-gray-100 text-gray-800';
    
    if (isPast(due) && !isToday(due)) return 'bg-red-100 text-red-800 border-red-300';
    if (isToday(due)) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (isFuture(due)) return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-gray-100 text-gray-800';
  };
  
  // Get rank color
  const getRankColor = (rank) => {
    const rankObj = xpSystem.ranks.find(r => r.value === rank);
    return rankObj ? rankObj.color : 'bg-gray-100 text-gray-800';
  };
  
  // Get overdue info
  const getOverdueInfo = (dueDate) => {
    const due = parseISO(dueDate);
    if (!isValid(due) || !isPast(due) || !isToday(due)) return null;
    
    const now = new Date();
    const diffMs = now - due;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) return `${diffHours}h overdue`;
    if (diffMins > 0) return `${diffMins}m overdue`;
    return 'Just due';
  };
  
  // Navigation functions
  const navigatePrevious = () => {
    if (viewType === 'day') setCurrentDate(subDays(currentDate, 1));
    if (viewType === 'week') setCurrentDate(subWeeks(currentDate, 1));
    if (viewType === 'month') setCurrentDate(subMonths(currentDate, 1));
  };
  
  const navigateNext = () => {
    if (viewType === 'day') setCurrentDate(addDays(currentDate, 1));
    if (viewType === 'week') setCurrentDate(addWeeks(currentDate, 1));
    if (viewType === 'month') setCurrentDate(addMonths(currentDate, 1));
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };
  
  // Filter quests by date range
  const getQuestsForDateRange = (startDate, endDate) => {
    return state.quests.filter(quest => {
      const dueDate = parseISO(quest.dueDate);
      if (!isValid(dueDate)) return false;
      return dueDate >= startDate && dueDate <= endDate;
    });
  };
  
  // Day View Component
  const DayView = () => {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    const quests = getQuestsForDateRange(dayStart, dayEnd);
    
    // Separate timed and all-day events
    const timedQuests = quests.filter(quest => quest.dueDate.includes('T'));
    const allDayQuests = quests.filter(quest => !quest.dueDate.includes('T'));
    
    // Generate hour slots
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="space-y-4">
        {/* All Day Events */}
        {allDayQuests.length > 0 && (
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-600 mb-2">All Day</h4>
            <div className="space-y-2">
              {allDayQuests.map(quest => (
                <QuestBlock key={quest.id} quest={quest} onClick={() => onEditQuest(quest)} onProgressChange={handleProgressChange} />
              ))}
            </div>
          </div>
        )}
        
        {/* Hourly Schedule */}
        <div className="space-y-1">
          {hours.map(hour => {
            const hourQuests = timedQuests.filter(quest => {
              const dueTime = parseISO(quest.dueDate);
              return isValid(dueTime) && dueTime.getHours() === hour;
            });
            
            return (
              <div key={hour} className="flex border-b border-gray-100 min-h-12">
                <div className="w-16 text-sm text-gray-500 py-2">
                  {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                </div>
                <div className="flex-1 py-1 pl-4">
                  {hourQuests.map(quest => (
                    <QuestBlock key={quest.id} quest={quest} onClick={() => onEditQuest(quest)} compact />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Week View Component
  const WeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {days.map(day => (
          <div key={day.toISOString()} className="p-2 text-center border-b font-medium text-sm">
            <div>{format(day, 'EEE')}</div>
            <div className={`text-lg ${isToday(day) ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
        
        {/* Day Cells */}
        {days.map(day => {
          const dayQuests = getQuestsForDateRange(startOfDay(day), endOfDay(day));
          
          return (
            <div key={day.toISOString()} className="border border-gray-200 min-h-32 p-1">
              <div className="space-y-1">
                {dayQuests.slice(0, 3).map(quest => (
                  <QuestBlock key={quest.id} quest={quest} onClick={() => onEditQuest(quest)} compact />
                ))}
                {dayQuests.length > 3 && (
                  <div className="text-xs text-gray-500">+{dayQuests.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Month View Component
  const MonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="p-2 text-center border-b font-medium text-sm text-gray-600">
            {day}
          </div>
        ))}
        
        {/* Day Cells */}
        {days.map(day => {
          const dayQuests = getQuestsForDateRange(startOfDay(day), endOfDay(day));
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          
          return (
            <div key={day.toISOString()} className={`border border-gray-200 min-h-24 p-1 ${!isCurrentMonth ? 'bg-gray-50' : ''}`}>
              <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayQuests.slice(0, 2).map(quest => (
                  <QuestBlock key={quest.id} quest={quest} onClick={() => onEditQuest(quest)} mini />
                ))}
                {dayQuests.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayQuests.length - 2}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Get current view title
  const getViewTitle = () => {
    if (viewType === 'day') return format(currentDate, 'EEEE, MMMM d, yyyy');
    if (viewType === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }
    if (viewType === 'month') return format(currentDate, 'MMMM yyyy');
    return '';
  };
  
  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon size={20} />
            <span>📅 Quest Calendar</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={navigatePrevious}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={navigateNext}>
              <ChevronRight size={16} />
            </Button>
          </div>
          
          <h3 className="text-lg font-semibold text-indigo-800">
            {getViewTitle()}
          </h3>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewType === 'day' && <DayView />}
        {viewType === 'week' && <WeekView />}
        {viewType === 'month' && <MonthView />}
      </CardContent>
    </Card>
  );
};

// Quest Block Component
const QuestBlock = ({ quest, onClick, compact = false, mini = false, onProgressChange }) => {
  const { getXPSystemInfo } = useQuest();
  const xpSystem = getXPSystemInfo();
  
  const getQuestColor = (dueDate) => {
    const due = parseISO(dueDate);
    if (!isValid(due)) return 'bg-gray-100 text-gray-800 border-gray-300';
    
    if (isPast(due) && !isToday(due)) return 'bg-red-100 text-red-800 border-red-300';
    if (isToday(due)) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (isFuture(due)) return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };
  
  const getRankColor = (rank) => {
    const rankObj = xpSystem.ranks.find(r => r.value === rank);
    return rankObj ? rankObj.color : 'bg-gray-100 text-gray-800';
  };
  
  const getOverdueInfo = (dueDate) => {
    const due = parseISO(dueDate);
    if (!isValid(due) || !isPast(due) || !isToday(due)) return null;
    
    const now = new Date();
    const diffMs = now - due;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) return `${diffHours}h overdue`;
    if (diffMins > 0) return `${diffMins}m overdue`;
    return 'Just due';
  };
  
  const overdue = getOverdueInfo(quest.dueDate);
  const hasTime = quest.dueDate.includes('T');
  
  if (mini) {
    return (
      <div 
        className={`p-1 rounded text-xs border cursor-pointer hover:shadow-sm transition-all ${getQuestColor(quest.dueDate)}`}
        onClick={() => onClick(quest)}
      >
        <div className="truncate font-medium">{quest.name}</div>
        {hasTime && (
          <div className="text-xs opacity-75">
            {format(parseISO(quest.dueDate), 'HH:mm')}
          </div>
        )}
      </div>
    );
  }
  
  if (compact) {
    return (
      <div 
        className={`p-2 rounded border cursor-pointer hover:shadow-md transition-all ${getQuestColor(quest.dueDate)}`}
        onClick={() => onClick(quest)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-medium text-sm truncate">{quest.name}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={`${getRankColor(quest.rank)} text-xs`}>
                {quest.rank}
              </Badge>
              {hasTime && (
                <div className="text-xs flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{format(parseISO(quest.dueDate), 'HH:mm')}</span>
                </div>
              )}
              {overdue && (
                <Badge variant="destructive" className="text-xs">
                  {overdue}
                </Badge>
              )}
            </div>
          </div>
          <Edit size={14} className="opacity-50" />
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`p-3 rounded-lg border cursor-pointer hover:shadow-lg transition-all ${getQuestColor(quest.dueDate)}`}
      onClick={() => onClick(quest)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-semibold">{quest.name}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className={getRankColor(quest.rank)}>
              {quest.rank}
            </Badge>
            <span className="text-sm">✨ {quest.xpReward} XP</span>
            {quest.isImportant && (
              <Badge variant="outline" className="border-yellow-400 text-yellow-700">
                ⭐ Important
              </Badge>
            )}
            {hasTime && (
              <div className="text-sm flex items-center space-x-1">
                <Clock size={14} />
                <span>{format(parseISO(quest.dueDate), 'HH:mm')}</span>
              </div>
            )}
            {overdue && (
              <Badge variant="destructive">
                {overdue}
              </Badge>
            )}
          </div>
          {quest.description && (
            <p className="text-sm opacity-75 mt-2 line-clamp-2">{quest.description}</p>
          )}
        </div>
        <Edit size={16} className="opacity-50" />
      </div>
    </div>
  );
};

export default CalendarView;