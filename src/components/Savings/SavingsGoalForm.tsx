import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { SavingsGoal } from '../../models/types';
import { formatDateForInput } from '../../utils/dateUtils';
import { generateRandomColor } from '../../utils/formatters';

interface SavingsGoalFormProps {
  goal?: SavingsGoal;
  onComplete: () => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({ goal, onComplete }) => {
  const { addSavingsGoal, updateSavingsGoal } = useFinance();
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    targetAmount: goal?.targetAmount.toString() || '',
    currentAmount: goal?.currentAmount.toString() || '0',
    deadline: goal ? formatDateForInput(goal.deadline) : '',
    color: goal?.color || generateRandomColor(),
  });
  const [errors, setErrors] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
    };
    let isValid = true;

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title';
      isValid = false;
    }

    // Validate target amount
    if (!formData.targetAmount || 
        isNaN(Number(formData.targetAmount)) || 
        Number(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Please enter a valid amount greater than zero';
      isValid = false;
    }

    // Validate current amount
    if (formData.currentAmount && 
        (isNaN(Number(formData.currentAmount)) || 
         Number(formData.currentAmount) < 0)) {
      newErrors.currentAmount = 'Current amount must be a positive number';
      isValid = false;
    }

    // Validate that current doesn't exceed target
    if (Number(formData.currentAmount) > Number(formData.targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
      isValid = false;
    }

    // Validate deadline
    if (!formData.deadline) {
      newErrors.deadline = 'Please select a deadline';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const goalData = {
      title: formData.title.trim(),
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount),
      deadline: new Date(formData.deadline).toISOString(),
      color: formData.color,
    };

    if (goal) {
      updateSavingsGoal({ ...goalData, id: goal.id });
    } else {
      addSavingsGoal(goalData);
    }

    onComplete();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, color: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="title" className="form-label">Goal Title</label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Vacation Fund"
            required
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        
        <div className="col-md-6 mb-3">
          <label htmlFor="deadline" className="form-label">Target Date</label>
          <input
            type="date"
            className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          {errors.deadline && <div className="invalid-feedback">{errors.deadline}</div>}
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="targetAmount" className="form-label">Target Amount</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className={`form-control ${errors.targetAmount ? 'is-invalid' : ''}`}
              id="targetAmount"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
            {errors.targetAmount && <div className="invalid-feedback">{errors.targetAmount}</div>}
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <label htmlFor="currentAmount" className="form-label">Current Amount</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`form-control ${errors.currentAmount ? 'is-invalid' : ''}`}
              id="currentAmount"
              name="currentAmount"
              value={formData.currentAmount}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.currentAmount && <div className="invalid-feedback">{errors.currentAmount}</div>}
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <label htmlFor="color" className="form-label">Color</label>
          <div className="d-flex">
            <input
              type="color"
              className="form-control form-control-color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleColorChange}
              title="Choose your color"
            />
            <div 
              className="ms-2 rounded" 
              style={{ 
                backgroundColor: formData.color,
                width: '100%',
                height: '38px'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-end mt-2">
        <button type="button" className="btn btn-outline-secondary me-2" onClick={onComplete}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {goal ? 'Update Goal' : 'Add Goal'}
        </button>
      </div>
    </form>
  );
};

export default SavingsGoalForm;