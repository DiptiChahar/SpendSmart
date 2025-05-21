import React, { useState } from 'react';
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
import { groupExpensesByDay } from '../../utils/dateUtils';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  subWeeks, 
  endOfDay 
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

interface SpendingTrendsChartProps {
  expenses: Expense[];
}

type TimeRange = 'week' | 'month' | '3months';

const SpendingTrendsChart: React.FC<SpendingTrendsChartProps> = ({ expenses }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  const getDateRange = (range: TimeRange) => {
    const now = new Date();
    
    switch (range) {
      case 'week':
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case '3months':
        return {
          start: startOfMonth(subMonths(now, 2)),
          end: endOfDay(now)
        };
      default:
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 })
        };
    }
  };

  const range = getDateRange(timeRange);
  const groupedData = groupExpensesByDay(expenses, range.start, range.end);
  
  const chartData = {
    labels: groupedData.map(d => d.date),
    datasets: [
      {
        label: 'Daily Spending',
        data: groupedData.map(d => d.total),
        fill: 'origin',
        backgroundColor: 'rgba(50, 115, 220, 0.1)',
        borderColor: 'rgba(50, 115, 220, 1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(50, 115, 220, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        },
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

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <div className="btn-group" role="group" aria-label="Time range">
          <button 
            type="button" 
            className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            type="button" 
            className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            type="button" 
            className={`btn ${timeRange === '3months' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('3months')}
          >
            3 Months
          </button>
        </div>
      </div>
      
      <div style={{ height: '300px' }}>
        {groupedData.length > 0 ? (
          <Line data={chartData} options={options as any} />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <p className="text-muted">No expense data available for this period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingTrendsChart;