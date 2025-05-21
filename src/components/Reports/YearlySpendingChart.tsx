import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Expense } from '../../models/types';
import { 
  parseISO, 
  format, 
  eachMonthOfInterval, 
  startOfYear, 
  endOfYear,
  startOfMonth,
  endOfMonth,
  isWithinInterval
} from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface YearlySpendingChartProps {
  expenses: Expense[];
}

const YearlySpendingChart: React.FC<YearlySpendingChartProps> = ({ expenses }) => {
  const currentYear = new Date().getFullYear();
  
  // Get all months in the current year
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(currentYear, 0, 1)),
    end: endOfYear(new Date(currentYear, 0, 1))
  });
  
  // Group expenses by month for the current year
  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
    
    const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      month: format(month, 'MMM'),
      total
    };
  });
  
  // Calculate the running total for cumulative line
  let runningTotal = 0;
  const cumulativeData = monthlyData.map(data => {
    runningTotal += data.total;
    return runningTotal;
  });
  
  // Prepare chart data
  const chartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlyData.map(data => data.total),
        borderColor: 'rgba(50, 115, 220, 1)',
        backgroundColor: 'rgba(50, 115, 220, 0.5)',
        yAxisID: 'y',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(50, 115, 220, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
      {
        label: 'Cumulative Spending',
        data: cumulativeData,
        borderColor: 'rgba(255, 56, 96, 1)',
        backgroundColor: 'rgba(255, 56, 96, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(255, 56, 96, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
      }
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          }
        }
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options as any} />
    </div>
  );
};

export default YearlySpendingChart;