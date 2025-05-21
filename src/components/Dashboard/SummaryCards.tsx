import React from 'react';
import { DashboardSummary } from '../../models/types';
import { formatCurrency } from '../../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar 
} from 'lucide-react';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="card-subtitle text-muted">Total Expenses</h6>
              <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                <DollarSign size={20} className="text-primary" />
              </div>
            </div>
            <h5 className="card-title mb-0 d-flex align-items-center">
              {formatCurrency(summary.totalExpenses)}
            </h5>
            <small className="text-muted">Lifetime spending</small>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="card-subtitle text-muted">Weekly Average</h6>
              <div className="rounded-circle bg-success bg-opacity-10 p-2">
                <TrendingUp size={20} className="text-success" />
              </div>
            </div>
            <h5 className="card-title mb-0">
              {formatCurrency(summary.weeklyAverage)}
            </h5>
            <small className="text-muted">Average per day</small>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="card-subtitle text-muted">Monthly Total</h6>
              <div className="rounded-circle bg-warning bg-opacity-10 p-2">
                <TrendingDown size={20} className="text-warning" />
              </div>
            </div>
            <h5 className="card-title mb-0">
              {formatCurrency(summary.monthlyTotal)}
            </h5>
            <small className="text-muted">Current month</small>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="card-subtitle text-muted">Upcoming Payments</h6>
              <div className="rounded-circle bg-danger bg-opacity-10 p-2">
                <Calendar size={20} className="text-danger" />
              </div>
            </div>
            <h5 className="card-title mb-0">
              {summary.upcomingPayments}
            </h5>
            <small className="text-muted">In the next 7 days</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;