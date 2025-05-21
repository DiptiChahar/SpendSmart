import React from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import SummaryCards from './SummaryCards';
import SpendingTrendsChart from './SpendingTrendsChart';
import SpendingBreakdown from './SpendingBreakdown';
import UpcomingPayments from './UpcomingPayments';
import SavingsOverview from './SavingsOverview';

const DashboardPage: React.FC = () => {
  const { 
    expenses, 
    dashboardSummary, 
    upcomingPayments, 
    savingsGoals 
  } = useFinance();

  return (
    <div className="container-fluid fade-in">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-4">Dashboard</h1>
        </div>
      </div>

      <SummaryCards summary={dashboardSummary} />

      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title">Spending Trends</h5>
            </div>
            <div className="card-body">
              <SpendingTrendsChart expenses={expenses} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title">Spending Breakdown</h5>
            </div>
            <div className="card-body">
              <SpendingBreakdown expenses={expenses} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title">Savings Goals</h5>
            </div>
            <div className="card-body">
              <SavingsOverview goals={savingsGoals} />
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title">Upcoming Payments</h5>
            </div>
            <div className="card-body">
              <UpcomingPayments subscriptions={upcomingPayments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;