import React, { useState } from 'react';
import { Expense } from '../../models/types';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { useFinance } from '../../contexts/FinanceContext';
import { Trash2, Edit, ChevronRight, ChevronDown } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const { deleteExpense } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setExpandedId(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (expenses.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted mb-0">No expenses found</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th scope="col" style={{ width: '40px' }}></th>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col" className="text-end">Amount</th>
              <th scope="col" style={{ width: '100px' }}></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <React.Fragment key={expense.id}>
                <tr>
                  <td className="text-center">
                    <button 
                      className="btn btn-sm btn-link p-0"
                      onClick={() => toggleExpand(expense.id)}
                      aria-label={expandedId === expense.id ? "Collapse" : "Expand"}
                    >
                      {expandedId === expense.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </td>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.description}</td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {expense.category}
                    </span>
                  </td>
                  <td className="text-end fw-bold">{formatCurrency(expense.amount)}</td>
                  <td>
                    <div className="d-flex justify-content-end">
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => handleEdit(expense.id)}
                        aria-label="Edit expense"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(expense.id)}
                        aria-label="Delete expense"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === expense.id && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <div className="p-3 bg-light">
                        {editingId === expense.id ? (
                          <ExpenseForm 
                            expense={expense} 
                            onComplete={() => setEditingId(null)} 
                          />
                        ) : (
                          <div className="row">
                            <div className="col-md-6">
                              <h6 className="mb-2">Details</h6>
                              <p className="mb-1"><strong>Date:</strong> {formatDate(expense.date)}</p>
                              <p className="mb-1"><strong>Category:</strong> {expense.category}</p>
                              <p className="mb-0"><strong>Amount:</strong> {formatCurrency(expense.amount)}</p>
                            </div>
                            <div className="col-md-6">
                              <h6 className="mb-2">Description</h6>
                              <p>{expense.description}</p>
                            </div>
                          </div>
                        )}
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

export default ExpenseList;