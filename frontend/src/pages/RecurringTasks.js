import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { useToast } from '../hooks/use-toast';
import { mockRecurringTasks, questRanks, frequencies } from '../data/mock';

const RecurringTasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState(mockRecurringTasks);
  const [newTask, setNewTask] = useState({
    name: '',
    rank: '',
    frequency: '',
    days: [],
    status: 'Active'
  });
  
  const getRankColor = (rank) => {
    const colors = {
      'Common': 'bg-gray-100 text-gray-800',
      'Rare': 'bg-blue-100 text-blue-800',
      'Epic': 'bg-purple-100 text-purple-800',
      'Legendary': 'bg-yellow-100 text-yellow-800'
    };
    return colors[rank] || 'bg-gray-100 text-gray-800';
  };
  
  const handleAddTask = () => {
    if (!newTask.name || !newTask.rank || !newTask.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      lastAdded: new Date().toISOString().split('T')[0]
    };
    
    setTasks([...tasks, taskWithId]);
    setNewTask({
      name: '',
      rank: '',
      frequency: '',
      days: [],
      status: 'Active'
    });
    
    toast({
      title: "Recurring Task Added! 🔄",
      description: `"${newTask.name}" has been added to your recurring tasks.`
    });
  };
  
  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'Active' ? 'Inactive' : 'Active' }
        : task
    ));
  };
  
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Recurring task has been removed."
    });
  };
  
  const getFrequencyDisplay = (frequency, days) => {
    if (frequency === 'Daily') return 'Every day';
    if (frequency === 'Weekly') return `Every ${days.join(', ')}`;
    if (frequency === 'Monthly') return `Monthly on ${days.join(', ')}`;
    if (frequency === 'Weekdays') return 'Monday to Friday';
    return frequency;
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🔁</span>
            <span>Recurring Tasks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Set up tasks that automatically generate quests based on your schedule.
            Perfect for building consistent habits! 💪
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Recurring Task ➕</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="taskName">Task Name</Label>
              <Input
                id="taskName"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                placeholder="Enter task name"
              />
            </div>
            <div>
              <Label htmlFor="taskRank">Quest Rank</Label>
              <Select value={newTask.rank} onValueChange={(value) => setNewTask({ ...newTask, rank: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  {questRanks.map(rank => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={newTask.frequency} onValueChange={(value) => setNewTask({ ...newTask, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddTask} className="w-full md:w-auto">
            ➕ Add Recurring Task
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Recurring Tasks 📅</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recurring tasks yet. Add your first recurring task above! 🎯</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>
                      <Badge className={getRankColor(task.rank)}>
                        {task.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>{getFrequencyDisplay(task.frequency, task.days)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={task.status === 'Active'}
                          onCheckedChange={() => toggleTaskStatus(task.id)}
                        />
                        <span className={task.status === 'Active' ? 'text-green-600' : 'text-gray-500'}>
                          {task.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{task.lastAdded}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteTask(task.id)}
                      >
                        🗑️
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringTasks;