import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Expense, 
  SavingsGoal, 
  Subscription, 
  DashboardSummary,
  ExpenseCategory
} from '../models/types';
import { 
  getExpenses, 
  getSavingsGoals, 
  getSubscriptions, 
  saveExpenses, 
  saveSavingsGoals, 
  saveSubscriptions,
  initializeWithSampleData
} from '../utils/localStorage';
import { 
  getCurrentWeekRange, 
  getCurrentMonthRange, 
  filterExpensesByDateRange,
  calculateNextPaymentDate,
  getUpcomingPayments
} from '../utils/dateUtils';
import { generateId, normalizeToMonthlyAmount } from '../utils/formatters';

interface FinanceContextType {
  // State
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
  filteredExpenses: Expense[];
  selectedCategory: ExpenseCategory | 'All';
  dashboardSummary: DashboardSummary;
  upcomingPayments: Subscription[];
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  
  addSubscription: (subscription: Omit<Subscription, 'id' | 'nextPaymentDate'>) => void;
  updateSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  
  setSelectedCategory: (category: ExpenseCategory | 'All') => void;
  resetData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary>({
    totalExpenses: 0,
    weeklyAverage: 0,
    monthlyTotal: 0,
    largestExpense: {
      amount: 0,
      category: 'Other',
    },
    savingsProgress: 0,
    upcomingPayments: 0,
  });
  const [upcomingPayments, setUpcomingPayments] = useState<Subscription[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    initializeWithSampleData();
    setExpenses(getExpenses());
    setSavingsGoals(getSavingsGoals());
    setSubscriptions(getSubscriptions());
  }, []);

  // Update filtered expenses when expenses or category changes
  useEffect(() => {
    const filtered = selectedCategory === 'All'
      ? expenses
      : expenses.filter(expense => expense.category === selectedCategory);
    
    // Sort by date (newest first)
    const sorted = [...filtered].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setFilteredExpenses(sorted);
  }, [expenses, selectedCategory]);

  // Update dashboard summary when data changes
  useEffect(() => {
    // Calculate weekly and monthly totals
    const weekRange = getCurrentWeekRange();
    const monthRange = getCurrentMonthRange();
    
    const weeklyExpenses = filterExpensesByDateRange(expenses, weekRange.start, weekRange.end);
    const monthlyExpenses = filterExpensesByDateRange(expenses, monthRange.start, monthRange.end);
    
    const weeklyTotal = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Find largest expense
    let largestExpense = { amount: 0, category: 'Other' as ExpenseCategory };
    if (expenses.length > 0) {
      const largest = [...expenses].sort((a, b) => b.amount - a.amount)[0];
      largestExpense = {
        amount: largest.amount,
        category: largest.category,
      };
    }
    
    // Calculate savings progress
    const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const savingsProgress = totalSavingsTarget > 0 
      ? (totalCurrentSavings / totalSavingsTarget) * 100 
      : 0;
    
    // Get upcoming payments
    const upcoming = getUpcomingPayments(subscriptions);
    setUpcomingPayments(upcoming);
    
    setDashboardSummary({
      totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      weeklyAverage: weeklyTotal / 7,
      monthlyTotal,
      largestExpense,
      savingsProgress,
      upcomingPayments: upcoming.length,
    });
  }, [expenses, savingsGoals, subscriptions]);

  // Expense actions
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const updateExpense = (expense: Expense) => {
    const updatedExpenses = expenses.map(exp => 
      exp.id === expense.id ? expense : exp
    );
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  // Savings goal actions
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: generateId() };
    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);
  };

  const updateSavingsGoal = (goal: SavingsGoal) => {
    const updatedGoals = savingsGoals.map(g => 
      g.id === goal.id ? goal : g
    );
    setSavingsGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);
  };

  const deleteSavingsGoal = (id: string) => {
    const updatedGoals = savingsGoals.filter(goal => goal.id !== id);
    setSavingsGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);
  };

  // Subscription actions
  const addSubscription = (subscription: Omit<Subscription, 'id' | 'nextPaymentDate'>) => {
    const nextPaymentDate = calculateNextPaymentDate(subscription.startDate, subscription.frequency);
    const newSubscription = { 
      ...subscription, 
      id: generateId(),
      nextPaymentDate
    };
    const updatedSubscriptions = [...subscriptions, newSubscription];
    setSubscriptions(updatedSubscriptions);
    saveSubscriptions(updatedSubscriptions);
  };

  const updateSubscription = (subscription: Subscription) => {
    // Recalculate next payment date if frequency or start date changed
    const existingSubscription = subscriptions.find(s => s.id === subscription.id);
    let updatedSubscription = subscription;
    
    if (existingSubscription &&
        (existingSubscription.frequency !== subscription.frequency ||
         existingSubscription.startDate !== subscription.startDate)) {
      updatedSubscription = {
        ...subscription,
        nextPaymentDate: calculateNextPaymentDate(subscription.startDate, subscription.frequency)
      };
    }
    
    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === subscription.id ? updatedSubscription : sub
    );
    setSubscriptions(updatedSubscriptions);
    saveSubscriptions(updatedSubscriptions);
  };

  const deleteSubscription = (id: string) => {
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updatedSubscriptions);
    saveSubscriptions(updatedSubscriptions);
  };

  // Reset all data
  const resetData = () => {
    setExpenses([]);
    setSavingsGoals([]);
    setSubscriptions([]);
    saveExpenses([]);
    saveSavingsGoals([]);
    saveSubscriptions([]);
  };

  const value: FinanceContextType = {
    expenses,
    savingsGoals,
    subscriptions,
    filteredExpenses,
    selectedCategory,
    dashboardSummary,
    upcomingPayments,
    
    addExpense,
    updateExpense,
    deleteExpense,
    
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    
    addSubscription,
    updateSubscription,
    deleteSubscription,
    
    setSelectedCategory,
    resetData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook for using the finance context
export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};