import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import SubscriptionForm from './SubscriptionForm';
import SubscriptionList from './SubscriptionList';
import SubscriptionSummary from './SubscriptionSummary';
import { Plus } from 'lucide-react';

const SubscriptionsPage: React.FC = () => {
  const { subscriptions } = useFinance();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container-fluid fade-in">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1 className="mb-0">Subscriptions</h1>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end align-items-center">
          <button 
            className="btn btn-primary d-flex align-items-center"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} className="me-1" />
            {showForm ? 'Cancel' : 'Add Subscription'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">New Subscription</h5>
              </div>
              <div className="card-body">
                <SubscriptionForm onComplete={() => setShowForm(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-12">
          <SubscriptionSummary subscriptions={subscriptions} />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Your Subscriptions</h5>
            </div>
            <div className="card-body p-0">
              <SubscriptionList subscriptions={subscriptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;