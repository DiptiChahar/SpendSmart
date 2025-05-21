import React, { useState } from 'react';
import { Subscription } from '../../models/types';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { useFinance } from '../../contexts/FinanceContext';
import { Trash2, Edit, Calendar } from 'lucide-react';
import SubscriptionForm from './SubscriptionForm';

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions }) => {
  const { deleteSubscription } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id === editingId ? null : id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      deleteSubscription(id);
    }
  };

  // Sort by next payment date
  const sortedSubscriptions = [...subscriptions].sort((a, b) => 
    new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
  );

  if (subscriptions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted mb-0">No subscriptions found</p>
      </div>
    );
  }

  return (
    <div className="subscription-list">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col" className="text-center">Frequency</th>
              <th scope="col" className="text-end">Amount</th>
              <th scope="col" className="text-center">Next Payment</th>
              <th scope="col" style={{ width: '100px' }}></th>
            </tr>
          </thead>
          <tbody>
            {sortedSubscriptions.map(subscription => (
              <React.Fragment key={subscription.id}>
                <tr>
                  <td>{subscription.name}</td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {subscription.category}
                    </span>
                  </td>
                  <td className="text-center">{subscription.frequency}</td>
                  <td className="text-end fw-bold">{formatCurrency(subscription.amount)}</td>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <Calendar size={14} className="me-1 text-muted" />
                      {formatDate(subscription.nextPaymentDate)}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-end">
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => handleEdit(subscription.id)}
                        aria-label="Edit subscription"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(subscription.id)}
                        aria-label="Delete subscription"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {editingId === subscription.id && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <div className="p-3 bg-light">
                        <SubscriptionForm 
                          subscription={subscription} 
                          onComplete={() => setEditingId(null)} 
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionList;