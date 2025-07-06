import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Archive from './pages/Archive';
import Statistics from './pages/Statistics';
import RewardStore from './pages/RewardStore';
import Inventory from './pages/Inventory';
import RecurringTasks from './pages/RecurringTasks';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import TimezoneFooter from './components/TimezoneFooter';
import { QuestProvider } from './contexts/QuestContext';
import NotificationManager from './components/NotificationManager';
import './App.css';

function App() {
  return (
    <QuestProvider>
      <Router>
        <div className="min-h-screen wood-bg flex flex-col">
          <div className="flex-1">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/rewards" element={<RewardStore />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/recurring" element={<RecurringTasks />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </div>
          <TimezoneFooter />
          <NotificationManager />
          <Toaster />
        </div>
      </Router>
    </QuestProvider>
  );
}

export default App;