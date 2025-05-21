import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './contexts/FinanceContext';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Pages
import DashboardPage from './components/Dashboard/DashboardPage';
import ExpensesPage from './components/Expenses/ExpensesPage';
import SavingsPage from './components/Savings/SavingsPage';
import SubscriptionsPage from './components/Subscriptions/SubscriptionsPage';
import ReportsPage from './components/Reports/ReportsPage';
import AIInsightsPage from './components/AIInsights/AIInsightsPage';

function App() {
  // Set page title
  useEffect(() => {
    document.title = 'SpendSmart';
  }, []);

  return (
    <FinanceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="savings" element={<SavingsPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="ai-insights" element={<AIInsightsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App;