import React from 'react';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../../models/types';

interface CategoryFilterProps {
  selectedCategory: ExpenseCategory | 'All';
  onCategoryChange: (category: ExpenseCategory | 'All') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="category-filter">
      <select
        className="form-select form-select-sm"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as ExpenseCategory | 'All')}
        aria-label="Filter by category"
      >
        <option value="All">All Categories</option>
        {EXPENSE_CATEGORIES.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;