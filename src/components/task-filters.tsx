'use client';

import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Search } from 'lucide-react';
import { TASK_CATEGORIES, TaskCategory } from '@/lib/categories';

type TaskFiltersProps = {
  currentCategory: string;
  handleCategoryChange:  React.Dispatch<React.SetStateAction<string>>;
  currentSearchTerm: string;
  handleSearchTermChange:  React.Dispatch<React.SetStateAction<string>>;
};

/**
 * TaskFilters Component
 * 
 * TODO (Task C - Stretch): Make the category filter functional
 * The UI is here, but it doesn't actually filter tasks yet.
 * You'll need to lift state up to the parent component and pass tasks as a prop.
 */
export function TaskFilters({ currentCategory, handleCategoryChange, currentSearchTerm, handleSearchTermChange }: TaskFiltersProps) {
  // The filter UI is implemented, but not wired up yet
  // Hint: You'll need useState to manage the selected category
  // Hint: Pass the selected category back to the parent to filter the tasks

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">
          Search tasks
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search tasks..."
            className="pl-10"
            value={currentSearchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full sm:w-48">
        <Label htmlFor="category-filter" className="sr-only">
          Filter by category
        </Label>
        <Select 
          defaultValue="all" 
          value={currentCategory} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {TASK_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


