import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { customFrequencyUnits, endConditionTypes, dayOptions } from '../data/mock';

const CustomFrequencyBuilder = ({ 
  customFrequency, 
  onFrequencyChange, 
  onClose 
}) => {
  const [frequency, setFrequency] = useState(customFrequency || {
    interval: 1,
    unit: 'weeks',
    days: ['Mon'],
    endCondition: 'never',
    endAfter: 10,
    endDate: '',
    weeklyDays: ['Mon']
  });

  const [showWeeklyDays, setShowWeeklyDays] = useState(frequency.unit === 'weeks');

  useEffect(() => {
    setShowWeeklyDays(frequency.unit === 'weeks');
  }, [frequency.unit]);

  const handleIntervalChange = (value) => {
    setFrequency(prev => ({ ...prev, interval: parseInt(value) || 1 }));
  };

  const handleUnitChange = (value) => {
    setFrequency(prev => ({ 
      ...prev, 
      unit: value,
      weeklyDays: value === 'weeks' ? prev.weeklyDays : []
    }));
  };

  const handleDayToggle = (day) => {
    setFrequency(prev => ({
      ...prev,
      weeklyDays: prev.weeklyDays.includes(day) 
        ? prev.weeklyDays.filter(d => d !== day)
        : [...prev.weeklyDays, day].sort((a, b) => {
            const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return order.indexOf(a) - order.indexOf(b);
          })
    }));
  };

  const handleEndConditionChange = (value) => {
    setFrequency(prev => ({ ...prev, endCondition: value }));
  };

  const handleEndAfterChange = (value) => {
    setFrequency(prev => ({ ...prev, endAfter: parseInt(value) || 1 }));
  };

  const handleEndDateChange = (value) => {
    setFrequency(prev => ({ ...prev, endDate: value }));
  };

  const generatePreview = () => {
    const { interval, unit, weeklyDays, endCondition, endAfter, endDate } = frequency;
    
    let preview = `Repeats every ${interval} ${interval === 1 ? unit.slice(0, -1) : unit}`;
    
    if (unit === 'weeks' && weeklyDays.length > 0) {
      preview += ` on ${weeklyDays.join(', ')}`;
    }
    
    if (endCondition === 'after') {
      preview += ` for ${endAfter} occurrences`;
    } else if (endCondition === 'on' && endDate) {
      preview += ` until ${new Date(endDate).toLocaleDateString()}`;
    }
    
    return preview;
  };

  const handleSave = () => {
    const finalFrequency = {
      ...frequency,
      weeklyDays: frequency.unit === 'weeks' ? frequency.weeklyDays : []
    };
    onFrequencyChange(finalFrequency);
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>🔧</span>
            <span>Custom Frequency Builder</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Repeat Every Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Repeat Every</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interval">Every</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                max="999"
                value={frequency.interval}
                onChange={(e) => handleIntervalChange(e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="unit">Time Unit</Label>
              <Select value={frequency.unit} onValueChange={handleUnitChange}>
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customFrequencyUnits.map(unit => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Weekly Days Selection */}
        {showWeeklyDays && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Repeat On</h3>
            <div className="grid grid-cols-7 gap-2">
              {dayOptions.map(day => (
                <Button
                  key={day.value}
                  size="sm"
                  variant={frequency.weeklyDays.includes(day.value) ? "default" : "outline"}
                  onClick={() => handleDayToggle(day.value)}
                  className="text-xs p-2 h-10"
                >
                  {day.value}
                </Button>
              ))}
            </div>
            {frequency.weeklyDays.length === 0 && (
              <p className="text-sm text-red-600">Please select at least one day</p>
            )}
          </div>
        )}

        {/* End Condition Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Ends</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="end-condition">End Condition</Label>
              <Select value={frequency.endCondition} onValueChange={handleEndConditionChange}>
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {endConditionTypes.map(condition => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {frequency.endCondition === 'after' && (
              <div>
                <Label htmlFor="end-after">Number of Occurrences</Label>
                <Input
                  id="end-after"
                  type="number"
                  min="1"
                  max="999"
                  value={frequency.endAfter}
                  onChange={(e) => handleEndAfterChange(e.target.value)}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            )}

            {frequency.endCondition === 'on' && (
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={frequency.endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📋 Preview</h4>
          <p className="text-blue-800">{generatePreview()}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={showWeeklyDays && frequency.weeklyDays.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Save Custom Frequency
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomFrequencyBuilder;