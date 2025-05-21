import React from 'react';
import { SavingsGoal } from '../../models/types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { formatDate, getDaysRemaining } from '../../utils/dateUtils';
import { Clock } from 'lucide-react';

interface SavingsOverviewProps {
  goals: SavingsGoal[];
}

const SavingsOverview: React.FC<SavingsOverviewProps> = ({ goals }) => {
  if (goals.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <p className="text-muted">No savings goals found</p>
      </div>
    );
  }

  // Sort by percentage completion (highest first)
  const sortedGoals = [...goals].sort((a, b) => 
    (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount)
  );

  return (
    <div className="savings-overview">
      {sortedGoals.map(goal => {
        const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
        const daysRemaining = getDaysRemaining(goal.deadline);
        
        return (
          <div key={goal.id} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className="mb-0">{goal.title}</h6>
              <div className="text-end">
                <span className="fw-semibold">{formatPercentage(progressPercentage)}</span>
              </div>
            </div>
            
            <div className="progress mb-2" style={{ height: '8px' }}>
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
              <small className="text-muted">
                {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
              </small>
              <small className="text-muted d-flex align-items-center">
                <Clock size={14} className="me-1" />
                {daysRemaining > 0 
                  ? `${daysRemaining} days left` 
                  : 'Deadline passed'}
              </small>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavingsOverview;