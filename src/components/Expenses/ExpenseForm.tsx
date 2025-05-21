import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { Expense, EXPENSE_CATEGORIES } from '../../models/types';
import { formatDateForInput } from '../../utils/dateUtils';

interface ExpenseFormProps {
  expense?: Expense;
  onComplete: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onComplete }) => {
  const { addExpense, updateExpense } = useFinance();
  const [formData, setFormData] = useState({
    amount: expense?.amount.toString() || '',
    category: expense?.category || EXPENSE_CATEGORIES[0],
    date: expense ? formatDateForInput(expense.date) : new Date().toISOString().split('T')[0],
    description: expense?.description || '',
  });
  const [errors, setErrors] = useState({
    amount: '',
    description: '',
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
      amount: '',
      description: '',
    };
    let isValid = true;

    // Validate amount
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than zero';
      isValid = false;
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const expenseData = {
      amount: Number(formData.amount),
      category: formData.category,
      date: new Date(formData.date).toISOString(),
      description: formData.description.trim(),
    };

    if (expense) {
      updateExpense({ ...expenseData, id: expense.id });
    } else {
      addExpense(expenseData);
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 col-lg-3 mb-3">
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
        
        <div className="col-md-6 col-lg-3 mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Grocery shopping"
            required
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>
      </div>
      
      <div className="d-flex justify-content-end mt-2">
        <button type="button" className="btn btn-outline-secondary me-2" onClick={onComplete}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {expense ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;