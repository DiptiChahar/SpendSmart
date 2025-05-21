import React from 'react';
import { Subscription } from '../../models/types';
import { formatCurrency, normalizeToMonthlyAmount } from '../../utils/formatters';
import { CreditCard, TrendingDown, Calendar, Clock } from 'lucide-react';

interface SubscriptionSummaryProps {
  subscriptions: Subscription[];
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({ subscriptions }) => {
  // Calculate total monthly cost
  const monthlyTotal = subscriptions.reduce((total, sub) => {
    return total + normalizeToMonthlyAmount(sub.amount, sub.frequency);
  }, 0);

  // Calculate total annual cost
  const annualTotal = monthlyTotal * 12;

  // Count upcoming payments in the next 30 days
  const upcomingCount = subscriptions.filter(sub => {
    const nextPaymentDate = new Date(sub.nextPaymentDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return nextPaymentDate <= thirtyDaysFromNow;
  }).length;

  return (
    <div className="row">
      <div className="col-md-4 mb-4 mb-md-0">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="card-subtitle text-muted">Monthly Cost</h6>
              <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                <CreditCard size={20} className="text-primary" />
              </div>
            </div>
            <h4 className="card-title mb-0">
              {formatCurrency(monthlyTotal)}
            </h4>
            <small className="text-muted">Per month</small>
          </div>
        </div>
      </div>
      
      <div className="col-md-4 mb-4 mb-md-0">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="card-subtitle text-muted">Annual Cost</h6>
              <div className="rounded-circle bg-warning bg-opacity-10 p-2">
                <TrendingDown size={20} className="text-warning" />
              </div>
            </div>
            <h4 className="card-title mb-0">
              {formatCurrency(annualTotal)}
            </h4>
            <small className="text-muted">Per year</small>
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="card-subtitle text-muted">Upcoming Payments</h6>
              <div className="rounded-circle bg-success bg-opacity-10 p-2">
                <Calendar size={20} className="text-success" />
              </div>
            </div>
            <h4 className="card-title mb-0">
              {upcomingCount}
            </h4>
            <small className="text-muted">In the next 30 days</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSummary;