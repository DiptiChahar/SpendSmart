// Types for finance data

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date string
  description: string;
}

export type ExpenseCategory = 
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Housing'
  | 'Utilities'
  | 'Healthcare'
  | 'Shopping'
  | 'Education'
  | 'Travel'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Entertainment',
  'Housing',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Education',
  'Travel',
  'Other'
];

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: SubscriptionFrequency;
  startDate: string; // ISO date string
  category: ExpenseCategory;
  nextPaymentDate: string; // ISO date string
}

export type SubscriptionFrequency = 
  | 'Weekly'
  | 'Biweekly'
  | 'Monthly'
  | 'Quarterly'
  | 'Yearly';

export const SUBSCRIPTION_FREQUENCIES: SubscriptionFrequency[] = [
  'Weekly',
  'Biweekly',
  'Monthly',
  'Quarterly',
  'Yearly'
];

export interface DashboardSummary {
  totalExpenses: number;
  weeklyAverage: number;
  monthlyTotal: number;
  largestExpense: {
    amount: number;
    category: ExpenseCategory;
  };
  savingsProgress: number;
  upcomingPayments: number;
}