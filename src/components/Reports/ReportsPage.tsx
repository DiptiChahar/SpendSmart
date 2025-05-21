import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import MonthlyComparisonChart from './MonthlyComparisonChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import YearlySpendingChart from './YearlySpendingChart';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../../models/types';

const ReportsPage: React.FC = () => {
  const { expenses } = useFinance();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');

  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedCategory);

  return (
    <div className="container-fluid fade-in">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-4">Reports</h1>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-4 mb-md-0">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Filter by Category</h5>
            </div>
            <div className="card-body">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | 'All')}
              >
                <option value="All">All Categories</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="mt-4">
                <p className="text-muted mb-2">Category Statistics</p>
                <ul className="list-unstyled">
                  <li className="mb-1">
                    <strong>Total Expenses:</strong> {filteredExpenses.length}
                  </li>
                  <li className="mb-1">
                    <strong>Total Amount:</strong> ${filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </li>
                  <li>
                    <strong>Average Amount:</strong> ${filteredExpenses.length ? (filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / filteredExpenses.length).toFixed(2) : '0.00'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-8 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Monthly Comparison</h5>
            </div>
            <div className="card-body">
              <MonthlyComparisonChart expenses={filteredExpenses} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Category Breakdown</h5>
            </div>
            <div className="card-body">
              <CategoryBreakdownChart expenses={expenses} />
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Yearly Spending</h5>
            </div>
            <div className="card-body">
              <YearlySpendingChart expenses={expenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;