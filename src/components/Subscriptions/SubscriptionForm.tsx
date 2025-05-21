import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { Subscription, SUBSCRIPTION_FREQUENCIES, EXPENSE_CATEGORIES } from '../../models/types';
import { formatDateForInput } from '../../utils/dateUtils';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onComplete: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ subscription, onComplete }) => {
  const { addSubscription, updateSubscription } = useFinance();
  const [formData, setFormData] = useState({
    name: subscription?.name || '',
    amount: subscription?.amount.toString() || '',
    frequency: subscription?.frequency || 'Monthly',
    startDate: subscription ? formatDateForInput(subscription.startDate) : new Date().toISOString().split('T')[0],
    category: subscription?.category || 'Entertainment',
  });
  const [errors, setErrors] = useState({
    name: '',
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {
      name: '',
      amount: '',
    };
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter a name';
      isValid = false;
    }

    // Validate amount
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than zero';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const subscriptionData = {
      name: formData.name.trim(),
      amount: Number(formData.amount),
      frequency: formData.frequency,
      startDate: new Date(formData.startDate).toISOString(),
      category: formData.category,
    };

    if (subscription) {
      updateSubscription({ 
        ...subscriptionData, 
        id: subscription.id,
        nextPaymentDate: subscription.nextPaymentDate
      });
    } else {
      addSubscription(subscriptionData);
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="name" className="form-label">Subscription Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Netflix"
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        
        <div className="col-md-6 mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
            {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <label htmlFor="frequency" className="form-label">Billing Frequency</label>
          <select
            className="form-select"
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
          >
            {SUBSCRIPTION_FREQUENCIES.map(freq => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-4 mb-3">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="d-flex justify-content-end mt-2">
        <button type="button" className="btn btn-outline-secondary me-2" onClick={onComplete}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {subscription ? 'Update Subscription' : 'Add Subscription'}
        </button>
      </div>
    </form>
  );
};

export default SubscriptionForm;