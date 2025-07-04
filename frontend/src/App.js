import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CompletedQuests from './pages/CompletedQuests';
import RewardStore from './pages/RewardStore';
import RecurringTasks from './pages/RecurringTasks';
import RulesSettings from './pages/RulesSettings';
import { XPProvider } from './contexts/XPContext';
import './App.css';

function App() {
  return (
    <XPProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/completed" element={<CompletedQuests />} />
              <Route path="/rewards" element={<RewardStore />} />
              <Route path="/recurring" element={<RecurringTasks />} />
              <Route path="/settings" element={<RulesSettings />} />
            </Routes>
          </Layout>
          <Toaster />
        </div>
      </Router>
    </XPProvider>
  );
}

export default App;