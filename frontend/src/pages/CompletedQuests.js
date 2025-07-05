import React from 'react';
import { useXP } from '../contexts/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { formatCompletedTimestamp } from '../utils/timeUtils';

const CompletedQuests = () => {
  const { state } = useXP();
  
  const getRankColor = (rank) => {
    const colors = {
      'Common': 'bg-gray-100 text-gray-800',
      'Rare': 'bg-blue-100 text-blue-800',
      'Epic': 'bg-purple-100 text-purple-800',
      'Legendary': 'bg-yellow-100 text-yellow-800'
    };
    return colors[rank] || 'bg-gray-100 text-gray-800';
  };
  
  const totalXPEarned = state.completedQuests.reduce((sum, quest) => sum + quest.xpEarned, 0);
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>✅</span>
            <span>Completed Quests Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{state.completedQuests.length}</div>
              <div className="text-sm text-gray-600">Total Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{totalXPEarned}</div>
              <div className="text-sm text-gray-600">Total XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {state.completedQuests.length > 0 ? Math.round(totalXPEarned / state.completedQuests.length) : 0}
              </div>
              <div className="text-sm text-gray-600">Average XP per Quest</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quest History 📋</CardTitle>
        </CardHeader>
        <CardContent>
          {state.completedQuests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No completed quests yet. Start completing some quests to see your progress! 🎯</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quest Name</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>XP Earned</TableHead>
                  <TableHead>Date Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.completedQuests
                  .sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted))
                  .map((quest) => (
                    <TableRow key={quest.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{quest.name}</TableCell>
                      <TableCell>
                        <Badge className={getRankColor(quest.rank)}>
                          {quest.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-yellow-600">
                          +{quest.xpEarned} XP
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          ⏰ {formatCompletedTimestamp(quest.dateCompleted)}
                        </span>
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

export default CompletedQuests;