import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import SavingsGoalForm from './SavingsGoalForm';
import SavingsGoalList from './SavingsGoalList';
import { Plus } from 'lucide-react';

const SavingsPage: React.FC = () => {
  const { savingsGoals } = useFinance();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container-fluid fade-in">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1 className="mb-0">Savings Goals</h1>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end align-items-center">
          <button 
            className="btn btn-primary d-flex align-items-center"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} className="me-1" />
            {showForm ? 'Cancel' : 'Add Goal'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">New Savings Goal</h5>
              </div>
              <div className="card-body">
                <SavingsGoalForm onComplete={() => setShowForm(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      <SavingsGoalList goals={savingsGoals} />
    </div>
  );
};

export default SavingsPage;