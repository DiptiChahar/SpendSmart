import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import CategoryFilter from './CategoryFilter';
import { useFinance } from '../../contexts/FinanceContext';
import { Plus } from 'lucide-react';

const ExpensesPage: React.FC = () => {
  const { 
    filteredExpenses, 
    selectedCategory, 
    setSelectedCategory,
    expenses
  } = useFinance();
  
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container-fluid fade-in">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1 className="mb-0">Expenses</h1>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end align-items-center">
          <button 
            className="btn btn-primary d-flex align-items-center"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} className="me-1" />
            {showForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">New Expense</h5>
              </div>
              <div className="card-body">
                <ExpenseForm onComplete={() => setShowForm(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Expense History</h5>
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>
            <div className="card-body p-0">
              <ExpenseList expenses={filteredExpenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;