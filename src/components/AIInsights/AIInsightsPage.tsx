import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface FinanceData {
  incomes: string[];
  expenses: string[];
  goals: string;
  incomeMonthly: string;
}

const AIInsightsPage: React.FC = () => {
  const [financeData, setFinanceData] = useState<FinanceData>({
    incomes: [''],
    expenses: [''],
    goals: '',
    incomeMonthly: ''
  });
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/analyze-spending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(financeData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze spending');
      }

      const data = await response.json();
      setResponse(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, there was an error analyzing your financial data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIncome = () => {
    setFinanceData((prev: FinanceData) => ({
      ...prev,
      incomes: [...prev.incomes, '']
    }));
  };

  const handleAddExpense = () => {
    setFinanceData((prev: FinanceData) => ({
      ...prev,
      expenses: [...prev.expenses, '']
    }));
  };

  const handleIncomeChange = (index: number, value: string) => {
    setFinanceData((prev: FinanceData) => ({
      ...prev,
      incomes: prev.incomes.map((income: string, i: number) => i === index ? value : income)
    }));
  };

  const handleExpenseChange = (index: number, value: string) => {
    setFinanceData((prev: FinanceData) => ({
      ...prev,
      expenses: prev.expenses.map((expense: string, i: number) => i === index ? value : expense)
    }));
  };

  return (
    <div className="container-fluid fade-in">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-4">AI Financial Insights</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Income Sources</label>
                  {financeData.incomes.map((income, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter income source and amount"
                        value={income}
                        onChange={(e) => handleIncomeChange(index, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mt-2"
                    onClick={handleAddIncome}
                  >
                    Add Income Source
                  </button>
                </div>

                <div className="mb-4">
                  <label className="form-label">Expenses</label>
                  {financeData.expenses.map((expense, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter expense category and amount"
                        value={expense}
                        onChange={(e) => handleExpenseChange(index, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mt-2"
                    onClick={handleAddExpense}
                  >
                    Add Expense
                  </button>
                </div>

                <div className="mb-4">
                  <label className="form-label">Financial Goals</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="What are your financial goals?"
                    value={financeData.goals}
                    onChange={(e) => setFinanceData(prev => ({ ...prev, goals: e.target.value }))}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Income Frequency</label>
                  <select
                    className="form-select"
                    value={financeData.incomeMonthly}
                    onChange={(e) => setFinanceData(prev => ({ ...prev, incomeMonthly: e.target.value }))}
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <Send size={18} className="me-2" />
                  )}
                  Analyze Finances
                </button>
              </form>

              {response && (
                <div className="mt-4">
                  <h5 className="card-title mb-3">Financial Analysis:</h5>
                  <div className="bg-light rounded p-4">
                    {response.split('\n').map((line, index) => (
                      <p key={index} className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;