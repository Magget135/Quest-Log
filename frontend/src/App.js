import React, { useState, useEffect } from 'react';
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
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DemoDataNotification from './components/DemoDataNotification';
import NotificationManager from './components/NotificationManager';
import './App.css';

function AppContent() {
  const [showDemoNotification, setShowDemoNotification] = useState(false);
  
  // Show demo notification for new users after they log in
  useEffect(() => {
    const hasSeenDemo = localStorage.getItem('hasSeenDemoNotification');
    if (!hasSeenDemo) {
      const timer = setTimeout(() => {
        setShowDemoNotification(true);
      }, 2000); // Show after 2 seconds of being logged in
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleCloseDemoNotification = () => {
    setShowDemoNotification(false);
    localStorage.setItem('hasSeenDemoNotification', 'true');
  };
  
  return (
    <QuestProvider>
      <Router>
        <div className="min-h-screen wood-bg flex flex-col">
          <div className="flex-1">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/stats" element={<Statistics />} />
                <Route path="/rewards" element={<RewardStore />} />
                <Route path="/rewards/add" element={<RewardStore />} />
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
          
          {/* Demo Data Notification */}
          {showDemoNotification && (
            <DemoDataNotification onClose={handleCloseDemoNotification} />
          )}
        </div>
      </Router>
    </QuestProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;