import { Expense, SavingsGoal, Subscription } from '../models/types';

// Keys for localStorage
const EXPENSES_KEY = 'spendsmart-expenses';
const SAVINGS_GOALS_KEY = 'spendsmart-savings-goals';
const SUBSCRIPTIONS_KEY = 'spendsmart-subscriptions';

// Expenses
export const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const getExpenses = (): Expense[] => {
  const storedExpenses = localStorage.getItem(EXPENSES_KEY);
  return storedExpenses ? JSON.parse(storedExpenses) : [];
};

// Savings Goals
export const saveSavingsGoals = (goals: SavingsGoal[]): void => {
  localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(goals));
};

export const getSavingsGoals = (): SavingsGoal[] => {
  const storedGoals = localStorage.getItem(SAVINGS_GOALS_KEY);
  return storedGoals ? JSON.parse(storedGoals) : [];
};

// Subscriptions
export const saveSubscriptions = (subscriptions: Subscription[]): void => {
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
};

export const getSubscriptions = (): Subscription[] => {
  const storedSubscriptions = localStorage.getItem(SUBSCRIPTIONS_KEY);
  return storedSubscriptions ? JSON.parse(storedSubscriptions) : [];
};

// Clear all data (for testing or reset functionality)
export const clearAllData = (): void => {
  localStorage.removeItem(EXPENSES_KEY);
  localStorage.removeItem(SAVINGS_GOALS_KEY);
  localStorage.removeItem(SUBSCRIPTIONS_KEY);
};

// Create or update sample data
export const initializeWithSampleData = (): void => {
  if (!localStorage.getItem(EXPENSES_KEY)) {
    const sampleExpenses: Expense[] = [
      {
        id: '1',
        amount: 2500,
        category: 'Food',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Grocery shopping'
      },
      {
        id: '2',
        amount: 1200,
        category: 'Transport',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Uber ride'
      },
      {
        id: '3',
        amount: 800,
        category: 'Entertainment',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Movie ticket'
      },
      {
        id: '4',
        amount: 5000,
        category: 'Housing',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Electricity bill'
      },
      {
        id: '5',
        amount: 1800,
        category: 'Food',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Restaurant dinner'
      }
    ];
    saveExpenses(sampleExpenses);
  }

  if (!localStorage.getItem(SAVINGS_GOALS_KEY)) {
    const sampleGoals: SavingsGoal[] = [
      {
        id: '1',
        title: 'Vacation Fund',
        targetAmount: 100000,
        currentAmount: 35000,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        color: '#6366f1'
      },
      {
        id: '2',
        title: 'New Laptop',
        targetAmount: 75000,
        currentAmount: 25000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        color: '#8b5cf6'
      }
    ];
    saveSavingsGoals(sampleGoals);
  }

  if (!localStorage.getItem(SUBSCRIPTIONS_KEY)) {
    const sampleSubscriptions: Subscription[] = [
      {
        id: '1',
        name: 'Netflix',
        amount: 649,
        frequency: 'Monthly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Entertainment',
        nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Gym Membership',
        amount: 2500,
        frequency: 'Monthly',
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Healthcare',
        nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    saveSubscriptions(sampleSubscriptions);
  }
};