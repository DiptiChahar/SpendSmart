import { 
  format, 
  parseISO, 
  startOfWeek, 
  endOfWeek,
  startOfMonth,
  endOfMonth, 
  eachDayOfInterval, 
  isBefore,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  isWithinInterval,
  differenceInDays
} from 'date-fns';

import { Expense, Subscription, SubscriptionFrequency } from '../models/types';

// Format date as string
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

// Format date for form inputs (YYYY-MM-DD)
export const formatDateForInput = (dateString: string): string => {
  return format(parseISO(dateString), 'yyyy-MM-dd');
};

// Get current date as ISO string
export const getCurrentDateISO = (): string => {
  return new Date().toISOString();
};

// Create a date range for the current week
export const getCurrentWeekRange = () => {
  const now = new Date();
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 })
  };
};

// Create a date range for the current month
export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  };
};

// Filter expenses by date range
export const filterExpensesByDateRange = (
  expenses: Expense[], 
  startDate: Date, 
  endDate: Date
): Expense[] => {
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: startDate, end: endDate });
  });
};

// Group expenses by day, week, or month for charts
export const groupExpensesByDay = (
  expenses: Expense[], 
  startDate: Date, 
  endDate: Date
): { date: string; total: number }[] => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(day => {
    const dayExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      date: format(day, 'MMM d'),
      total
    };
  });
};

// Calculate next payment date based on frequency
export const calculateNextPaymentDate = (
  startDate: string, 
  frequency: SubscriptionFrequency
): string => {
  const date = parseISO(startDate);
  let nextDate = date;
  
  // Calculate the next payment date based on today
  const today = new Date();
  
  // Keep advancing the date until we find one in the future
  while (isBefore(nextDate, today)) {
    switch (frequency) {
      case 'Weekly':
        nextDate = addWeeks(nextDate, 1);
        break;
      case 'Biweekly':
        nextDate = addWeeks(nextDate, 2);
        break;
      case 'Monthly':
        nextDate = addMonths(nextDate, 1);
        break;
      case 'Quarterly':
        nextDate = addQuarters(nextDate, 1);
        break;
      case 'Yearly':
        nextDate = addYears(nextDate, 1);
        break;
    }
  }
  
  return nextDate.toISOString();
};

// Get upcoming payments in the next 7 days
export const getUpcomingPayments = (subscriptions: Subscription[]): Subscription[] => {
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  return subscriptions.filter(subscription => {
    const paymentDate = parseISO(subscription.nextPaymentDate);
    return isWithinInterval(paymentDate, { start: today, end: nextWeek });
  });
};

// Calculate days remaining until deadline
export const getDaysRemaining = (deadlineDate: string): number => {
  const today = new Date();
  const deadline = parseISO(deadlineDate);
  return differenceInDays(deadline, today);
};