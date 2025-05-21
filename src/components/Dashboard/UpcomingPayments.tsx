import React from 'react';
import { Subscription } from '../../models/types';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { Calendar, Clock } from 'lucide-react';

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
}

const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ subscriptions }) => {
  if (subscriptions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <p className="text-muted">No upcoming payments in the next 7 days</p>
      </div>
    );
  }

  // Sort by date (closest first)
  const sortedSubscriptions = [...subscriptions].sort((a, b) => 
    new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
  );

  return (
    <div className="upcoming-payments">
      <ul className="list-group">
        {sortedSubscriptions.map(subscription => (
          <li key={subscription.id} className="list-group-item border-0 px-0 py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">{subscription.name}</h6>
                <div className="d-flex align-items-center">
                  <Calendar size={14} className="text-muted me-1" />
                  <small className="text-muted">
                    {formatDate(subscription.nextPaymentDate)}
                  </small>
                </div>
              </div>
              <div className="text-end">
                <h6 className="mb-0 fw-bold">{formatCurrency(subscription.amount)}</h6>
                <small className="text-muted">{subscription.frequency}</small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingPayments;