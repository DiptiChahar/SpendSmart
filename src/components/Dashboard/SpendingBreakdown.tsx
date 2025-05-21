import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Expense, ExpenseCategory } from '../../models/types';
import { formatCurrency } from '../../utils/formatters';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface SpendingBreakdownProps {
  expenses: Expense[];
}

const SpendingBreakdown: React.FC<SpendingBreakdownProps> = ({ expenses }) => {
  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    
    acc[category] += amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);
  
  // Prepare data for chart
  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);
  
  // Skip rendering chart if no data
  if (categories.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <p className="text-muted">No expense data available</p>
      </div>
    );
  }
  
  // Chart colors
  const backgroundColors = [
    'rgba(50, 115, 220, 0.8)',
    'rgba(35, 209, 96, 0.8)',
    'rgba(255, 221, 87, 0.8)',
    'rgba(255, 56, 96, 0.8)',
    'rgba(92, 106, 196, 0.8)',
    'rgba(32, 156, 238, 0.8)',
    'rgba(255, 159, 67, 0.8)',
    'rgba(108, 92, 231, 0.8)',
    'rgba(0, 209, 178, 0.8)',
    'rgba(253, 121, 168, 0.8)',
  ];
  
  // Prepare chart data
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: backgroundColors.slice(0, categories.length),
        borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Pie data={chartData} options={options as any} />
    </div>
  );
};

export default SpendingBreakdown;