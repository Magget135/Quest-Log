import React, { useState } from 'react';
import { useQuest } from '../contexts/QuestContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { frequencies, dayOptions, customFrequencyUnits, endConditionTypes } from '../data/mock';
import CustomFrequencyBuilder from '../components/CustomFrequencyBuilder';

const RecurringTasks = () => {
  const { state, dispatch, getXPSystemInfo } = useQuest();
  const { toast } = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCustomFrequency, setShowCustomFrequency] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    rank: '',
    frequency: 'Daily',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    status: 'Active',
    isImportant: false,
    startBeforeDue: 0,
    customFrequency: null,
    yearlyDate: ''
  });
  
  const xpSystem = getXPSystemInfo();
  
  const handleAddTask = () => {
    if (!newTask.name || !newTask.rank || !newTask.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in task name, rank, and frequency.",
        variant: "destructive"
      });
      return;
    }

    // Validate custom frequency
    if (newTask.frequency === 'Custom' && !newTask.customFrequency) {
      toast({
        title: "Missing Custom Frequency",
        description: "Please configure your custom frequency settings.",
        variant: "destructive"
      });
      return;
    }

    // Validate yearly date
    if (newTask.frequency === 'Yearly' && !newTask.yearlyDate) {
      toast({
        title: "Missing Yearly Date",
        description: "Please specify the yearly date for this task.",
        variant: "destructive"
      });
      return;
    }
    
    // Find XP for selected rank
    const selectedRank = xpSystem.ranks.find(r => r.value === newTask.rank);
    const xpReward = selectedRank ? selectedRank.xp : 0;
    
    const taskData = {
      ...newTask,
      xpReward,
      lastAdded: new Date().toISOString().split('T')[0],
      // Set appropriate days based on frequency
      days: newTask.frequency === 'Weekends' ? ['Sat', 'Sun'] :
            newTask.frequency === 'Yearly' ? [] :
            newTask.frequency === 'Custom' && newTask.customFrequency ? 
              (newTask.customFrequency.unit === 'weeks' ? newTask.customFrequency.weeklyDays : []) :
            newTask.days
    };
    
    dispatch({ type: 'ADD_RECURRING_TASK', payload: taskData });
    setNewTask({
      name: '',
      rank: '',
      frequency: 'Daily',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      status: 'Active',
      isImportant: false,
      startBeforeDue: 0,
      customFrequency: null,
      yearlyDate: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "Recurring Task Added! 🔄",
      description: `"${newTask.name}" will now appear automatically.`
    });
  };
  
  const handleToggleStatus = (taskId) => {
    const task = state.recurringTasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'Active' ? 'Paused' : 'Active';
      dispatch({ 
        type: 'UPDATE_RECURRING_TASK', 
        payload: { ...task, status: newStatus }
      });
      
      toast({
        title: `Task ${newStatus}`,
        description: `"${task.name}" is now ${newStatus.toLowerCase()}.`
      });
    }
  };
  
  const handleDeleteTask = (taskId) => {
    const task = state.recurringTasks.find(t => t.id === taskId);
    if (task) {
      if (window.confirm(`Are you sure you want to permanently delete "${task.name}"? This cannot be undone.`)) {
        dispatch({ type: 'DELETE_RECURRING_TASK', payload: taskId });
        toast({
          title: "Task Permanently Deleted",
          description: `"${task.name}" has been removed from your recurring tasks.`
        });
      }
    }
  };
  
  const handleAddToQuests = (task) => {
    const questData = {
      name: task.name,
      rank: task.rank,
      dueDate: new Date().toISOString().split('T')[0],
      description: 'Auto-generated from recurring task',
      xpReward: task.xpReward,
      isImportant: task.isImportant,
      attachments: []
    };
    
    dispatch({ type: 'ADD_QUEST', payload: questData });
    
    // Update last added date
    dispatch({ 
      type: 'UPDATE_RECURRING_TASK', 
      payload: { ...task, lastAdded: new Date().toISOString().split('T')[0] }
    });
    
    toast({
      title: "Added to Quest Log! 📜",
      description: `"${task.name}" has been added to your active quests.`
    });
  };
  
  const getRankColor = (rank) => {
    const rankObj = xpSystem.ranks.find(r => r.value === rank);
    return rankObj ? rankObj.color : 'bg-gray-100 text-gray-800';
  };
  
  const getFrequencyIcon = (frequency) => {
    const icons = {
      'Daily': '📅',
      'Weekly': '📆',
      'Monthly': '🗓️',
      'Weekdays': '💼',
      'Yearly': '🎂',
      'Weekends': '🎮',
      'Custom': '🔧'
    };
    return icons[frequency] || '🔄';
  };

  const getFrequencyDescription = (task) => {
    const { frequency, customFrequency, yearlyDate, days } = task;
    
    switch (frequency) {
      case 'Yearly':
        return yearlyDate ? `Every ${yearlyDate} (${getMonthDayName(yearlyDate)})` : 'Yearly';
      case 'Weekends':
        return 'Saturday & Sunday';
      case 'Custom':
        if (!customFrequency) return 'Custom';
        const { interval, unit, weeklyDays, endCondition, endAfter, endDate } = customFrequency;
        let desc = `Every ${interval} ${interval === 1 ? unit.slice(0, -1) : unit}`;
        if (unit === 'weeks' && weeklyDays?.length > 0) {
          desc += ` on ${weeklyDays.join(', ')}`;
        }
        if (endCondition === 'after') {
          desc += ` (${endAfter} times)`;
        } else if (endCondition === 'on' && endDate) {
          desc += ` until ${new Date(endDate).toLocaleDateString()}`;
        }
        return desc;
      default:
        return frequency;
    }
  };

  const getMonthDayName = (yearlyDate) => {
    if (!yearlyDate) return '';
    try {
      const [month, day] = yearlyDate.split('-');
      const date = new Date(2024, parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } catch {
      return yearlyDate;
    }
  };

  const handleFrequencyChange = (frequency) => {
    if (frequency === 'Custom') {
      setShowCustomFrequency(true);
    } else if (frequency === 'Weekends') {
      setNewTask(prev => ({ 
        ...prev, 
        frequency, 
        days: ['Sat', 'Sun'],
        customFrequency: null,
        yearlyDate: ''
      }));
    } else if (frequency === 'Yearly') {
      setNewTask(prev => ({ 
        ...prev, 
        frequency, 
        days: [],
        customFrequency: null
      }));
    } else {
      setNewTask(prev => ({ 
        ...prev, 
        frequency,
        customFrequency: null,
        yearlyDate: ''
      }));
    }
  };

  const handleCustomFrequencyChange = (customFrequency) => {
    setNewTask(prev => ({ 
      ...prev, 
      frequency: 'Custom',
      customFrequency,
      days: customFrequency.unit === 'weeks' ? customFrequency.weeklyDays : []
    }));
  };
  
  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };
  
  const getStatusIcon = (status) => {
    return status === 'Active' ? '🟢' : '⏸️';
  };
  
  const handleDayToggle = (day) => {
    const newDays = newTask.days.includes(day)
      ? newTask.days.filter(d => d !== day)
      : [...newTask.days, day];
    setNewTask({ ...newTask, days: newDays });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>🔄</span>
              <span>Recurring Quest Templates</span>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ➕ Add Recurring Task
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t border-blue-200 mt-4 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-name">Task Name</Label>
                  <Input
                    id="task-name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    placeholder="Enter recurring task name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="task-rank">Task Rank</Label>
                  <Select value={newTask.rank} onValueChange={(value) => setNewTask({ ...newTask, rank: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {xpSystem.ranks.map(rank => (
                        <SelectItem key={rank.value} value={rank.value}>
                          <div className="flex items-center space-x-2">
                            <Badge className={rank.color} variant="outline">
                              {rank.label}
                            </Badge>
                            <span className="text-sm text-gray-600">({rank.xp} XP)</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="task-frequency">Frequency</Label>
                  <Select value={newTask.frequency} onValueChange={handleFrequencyChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {getFrequencyIcon(freq.value)} {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="start-before-due">Add to Active Quests</Label>
                  <Select 
                    value={newTask.startBeforeDue.toString()} 
                    onValueChange={(value) => setNewTask({ ...newTask, startBeforeDue: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">On due date</SelectItem>
                      <SelectItem value="1">1 day before due</SelectItem>
                      <SelectItem value="2">2 days before due</SelectItem>
                      <SelectItem value="3">3 days before due</SelectItem>
                      <SelectItem value="4">4 days before due</SelectItem>
                      <SelectItem value="5">5 days before due</SelectItem>
                      <SelectItem value="6">6 days before due</SelectItem>
                      <SelectItem value="7">7 days before due</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="task-important"
                    checked={newTask.isImportant}
                    onCheckedChange={(checked) => setNewTask({ ...newTask, isImportant: checked })}
                  />
                  <Label htmlFor="task-important" className="text-sm">Mark as Important</Label>
                </div>
              </div>
              
              {(newTask.frequency === 'Weekly' || newTask.frequency === 'Weekdays') && (
                <div>
                  <Label>Active Days</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dayOptions.map(day => (
                      <Button
                        key={day.value}
                        size="sm"
                        variant={newTask.days.includes(day.value) ? "default" : "outline"}
                        onClick={() => handleDayToggle(day.value)}
                        className="text-xs"
                      >
                        {day.value}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {newTask.frequency === 'Yearly' && (
                <div>
                  <Label htmlFor="yearly-date">Yearly Date (MM-DD)</Label>
                  <Input
                    id="yearly-date"
                    type="date"
                    value={newTask.yearlyDate ? `2024-${newTask.yearlyDate}` : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const date = new Date(e.target.value);
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setNewTask({ ...newTask, yearlyDate: `${month}-${day}` });
                      } else {
                        setNewTask({ ...newTask, yearlyDate: '' });
                      }
                    }}
                    className="border-blue-200 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    This task will repeat on this date every year
                  </p>
                </div>
              )}

              {newTask.frequency === 'Custom' && newTask.customFrequency && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-purple-900">Custom Frequency Set</h4>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowCustomFrequency(true)}
                      className="text-purple-600 border-purple-300"
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-purple-800">
                    {getFrequencyDescription({ frequency: 'Custom', customFrequency: newTask.customFrequency })}
                  </p>
                </div>
              )}

              {newTask.frequency === 'Custom' && !newTask.customFrequency && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-yellow-900">Custom Frequency Required</h4>
                      <p className="text-sm text-yellow-800">Configure your custom recurrence pattern</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => setShowCustomFrequency(true)}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700">
                  Add Recurring Task
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Status Filter Info */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-gray-900">Status Guide</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>🟢 Active:</strong> Task will regenerate automatically in daily cycles</p>
                <p><strong>⏸️ Paused:</strong> Task is temporarily disabled and won't regenerate</p>
                <p><strong>🗑️ Delete:</strong> Permanently removes the task (cannot be undone)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recurring Tasks List */}
      <div className="space-y-4">
        {state.recurringTasks.map((task) => (
          <Card 
            key={task.id}
            className={`transition-all duration-200 ${
              task.status === 'Active' 
                ? 'border-green-200 bg-gradient-to-r from-white to-green-50' 
                : 'border-orange-200 bg-gradient-to-r from-white to-orange-50'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.name}</h3>
                    <Badge className={getRankColor(task.rank)}>
                      {task.rank}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusIcon(task.status)} {task.status}
                    </Badge>
                    {task.isImportant && (
                      <Badge variant="outline" className="border-yellow-400 text-yellow-700">
                        ⭐ Important
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{getFrequencyIcon(task.frequency)} {getFrequencyDescription(task)}</span>
                    <span>✨ {task.xpReward} XP</span>
                    {task.startBeforeDue > 0 && (
                      <span>⏰ Starts {task.startBeforeDue} day{task.startBeforeDue > 1 ? 's' : ''} early</span>
                    )}
                    {task.lastAdded && (
                      <span>📅 Last added: {new Date(task.lastAdded).toLocaleDateString()}</span>
                    )}
                    {task.days && task.days.length < 7 && task.frequency !== 'Custom' && task.frequency !== 'Weekends' && (
                      <span>📌 {task.days.join(', ')}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {task.status === 'Active' && (
                    <Button
                      size="sm"
                      onClick={() => handleAddToQuests(task)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      ➕ Add to Quests
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(task.id)}
                    className={task.status === 'Active' 
                      ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                      : 'border-green-200 text-green-600 hover:bg-green-50'
                    }
                  >
                    {task.status === 'Active' ? '⏸️ Pause' : '▶️ Resume'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTask(task.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {state.recurringTasks.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-4">🔄</div>
              <p className="text-lg font-medium mb-2">No recurring tasks</p>
              <p className="text-gray-600 mb-4">Create templates for tasks you do regularly!</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                ➕ Add First Recurring Task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Usage Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>💡</span>
            <span>Recurring Tasks Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>📅 Daily:</strong> Perfect for habits like exercise, reading, or meditation</p>
            <p><strong>📆 Weekly:</strong> Great for weekly reviews, cleaning, or skill practice</p>
            <p><strong>🗓️ Monthly:</strong> Ideal for goal setting, planning, or major tasks</p>
            <p><strong>💼 Weekdays:</strong> Work-related tasks that only happen on business days</p>
            <p><strong>🎂 Yearly:</strong> Annual events like birthdays, anniversaries, or renewals</p>
            <p><strong>🎮 Weekends Only:</strong> Leisure activities for Saturday and Sunday</p>
            <p><strong>🔧 Custom Frequency:</strong> Advanced patterns like "every 2 weeks on Monday and Friday"</p>
            <p><strong>⏰ Start Before Due:</strong> Add tasks to quest log days before they're actually due</p>
            <p><strong>⭐ Important:</strong> Marked tasks are protected from auto-cleanup</p>
            <p><strong>🟢 Active vs ⏸️ Paused:</strong> Only active tasks regenerate in daily cycles</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Custom Frequency Builder Dialog */}
      {showCustomFrequency && (
        <Dialog open={showCustomFrequency} onOpenChange={setShowCustomFrequency}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Custom Frequency Configuration</DialogTitle>
            </DialogHeader>
            <CustomFrequencyBuilder
              customFrequency={newTask.customFrequency}
              onFrequencyChange={handleCustomFrequencyChange}
              onClose={() => setShowCustomFrequency(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RecurringTasks;