import React, { useState } from 'react';
import { SavingsGoal } from '../../models/types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { formatDate, getDaysRemaining } from '../../utils/dateUtils';
import { useFinance } from '../../contexts/FinanceContext';
import { Edit, Trash2, Clock, PiggyBank } from 'lucide-react';
import SavingsGoalForm from './SavingsGoalForm';

interface SavingsGoalListProps {
  goals: SavingsGoal[];
}

const SavingsGoalList: React.FC<SavingsGoalListProps> = ({ goals }) => {
  const { updateSavingsGoal, deleteSavingsGoal } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<Record<string, string>>({});

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      deleteSavingsGoal(id);
    }
  };

  const handleContribution = (goal: SavingsGoal) => {
    const amount = contributionAmount[goal.id];
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    const updatedGoal = {
      ...goal,
      currentAmount: Math.min(goal.currentAmount + Number(amount), goal.targetAmount)
    };

    updateSavingsGoal(updatedGoal);
    
    // Clear the input field
    setContributionAmount(prev => ({ ...prev, [goal.id]: '' }));
  };

  const handleContributionChange = (id: string, value: string) => {
    setContributionAmount(prev => ({ ...prev, [id]: value }));
  };

  if (goals.length === 0) {
    return (
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center p-5">
              <PiggyBank size={48} className="text-muted mb-3" />
              <h5>No savings goals yet</h5>
              <p className="text-muted">Create your first savings goal to start tracking your progress.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {goals.map(goal => {
        const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
        const daysRemaining = getDaysRemaining(goal.deadline);
        const isCompleted = goal.currentAmount >= goal.targetAmount;
        
        return (
          <div key={goal.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div 
                className="card-header d-flex justify-content-between align-items-center"
                style={{ 
                  backgroundColor: goal.color,
                  color: goal.color ? '#fff' : 'inherit',
                  borderBottom: `1px solid ${goal.color}`
                }}
              >
                <h5 className="card-title mb-0">{goal.title}</h5>
                <div>
                  <button 
                    className="btn btn-sm btn-light me-1"
                    onClick={() => setEditingId(goal.id === editingId ? null : goal.id)}
                    aria-label="Edit goal"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="btn btn-sm btn-light"
                    onClick={() => handleDelete(goal.id)}
                    aria-label="Delete goal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {editingId === goal.id ? (
                <div className="card-body">
                  <SavingsGoalForm 
                    goal={goal} 
                    onComplete={() => setEditingId(null)} 
                  />
                </div>
              ) : (
                <>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <p className="text-muted mb-0">Target</p>
                        <h5>{formatCurrency(goal.targetAmount)}</h5>
                      </div>
                      <div className="text-end">
                        <p className="text-muted mb-0">Current</p>
                        <h5>{formatCurrency(goal.currentAmount)}</h5>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="progress mb-2" style={{ height: '10px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ 
                            width: `${progressPercentage}%`,
                            backgroundColor: goal.color 
                          }}
                          aria-valuenow={progressPercentage} 
                          aria-valuemin={0} 
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small>{formatPercentage(progressPercentage)} complete</small>
                        <small className="d-flex align-items-center text-muted">
                          <Clock size={14} className="me-1" />
                          {daysRemaining > 0 
                            ? `${daysRemaining} days left` 
                            : 'Deadline passed'}
                        </small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <p className="text-muted mb-0 me-2">Deadline:</p>
                      <p className="mb-0">{formatDate(goal.deadline)}</p>
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="card-footer bg-light">
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Amount"
                          aria-label="Contribution amount"
                          value={contributionAmount[goal.id] || ''}
                          onChange={(e) => handleContributionChange(goal.id, e.target.value)}
                          min="0.01"
                          step="0.01"
                        />
                        <button 
                          className="btn btn-outline-primary"
                          type="button"
                          onClick={() => handleContribution(goal)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavingsGoalList;