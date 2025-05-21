// Format currency amounts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Generate a random color for charts
export const generateRandomColor = (): string => {
  const colors = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f43f5e', // rose
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#a855f7'  // purple
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Get contrast text color (black or white) based on background color
export const getContrastColor = (hexColor: string): string => {
  // Remove the hash if present
  hexColor = hexColor.replace('#', '');
  
  // Parse hex color to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark ones
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Truncate long strings
export const truncateString = (str: string, maxLength: number = 30): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

// Format frequency to monthly equivalent for comparison
export const normalizeToMonthlyAmount = (
  amount: number, 
  frequency: string
): number => {
  switch (frequency) {
    case 'Weekly':
      return amount * 4.33; // Average weeks in a month
    case 'Biweekly':
      return amount * 2.17; // Biweekly is 26 times per year / 12
    case 'Monthly':
      return amount;
    case 'Quarterly':
      return amount / 3;
    case 'Yearly':
      return amount / 12;
    default:
      return amount;
  }
};