import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Expense } from '../../models/types';
import { format, parseISO, setMonth, setYear, getMonth, getYear } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyComparisonChartProps {
  expenses: Expense[];
}

const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({ expenses }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Group expenses by month for the selected year
  const monthlyData = Array(12).fill(0);
  
  expenses.forEach(expense => {
    const date = parseISO(expense.date);
    const year = getYear(date);
    const month = getMonth(date);
    
    if (year === selectedYear) {
      monthlyData[month] += expense.amount;
    }
  });
  
  // Prepare chart data
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = setMonth(new Date(), i);
    return format(date, 'MMM');
  });
  
  const chartData = {
    labels: months,
    datasets: [
      {
        label: `Monthly Expenses (${selectedYear})`,
        data: monthlyData,
        backgroundColor: 'rgba(50, 115, 220, 0.6)',
        borderColor: 'rgba(50, 115, 220, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
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
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          }
        }
      }
    }
  };

  // Available years for selection (current year and up to 3 years back)
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto' }}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options as any} />
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;