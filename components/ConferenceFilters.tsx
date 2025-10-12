'use client';

import React, { useState } from 'react';
import { ConferenceFilters as Filters } from '@/types/conference';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ConferenceFiltersProps {
  onFilterChange: (filters: Filters) => void;
  categories: string[];
}

export function ConferenceFilters({ onFilterChange, categories }: ConferenceFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const handleApplyFilters = () => {
    const filters: Filters = {
      searchTerm: searchTerm || undefined,
      dateRange: {
        start: dateStart || undefined,
        end: dateEnd || undefined,
      },
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      priceRange: {
        min: priceMin ? Number(priceMin) : undefined,
        max: priceMax ? Number(priceMax) : undefined,
      },
    };
    onFilterChange(filters);
  };

  const handleReset = () => {
    setSearchTerm('');
    setDateStart('');
    setDateEnd('');
    setSelectedCategories([]);
    setPriceMin('');
    setPriceMax('');
    onFilterChange({});
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Conferences</h2>

      {/* Search */}
      <div>
        <Input
          label="Search"
          type="text"
          placeholder="Search by name, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            placeholder="Start Date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
          <Input
            type="date"
            placeholder="End Date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button onClick={handleApplyFilters} fullWidth>
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="outline" fullWidth>
          Reset
        </Button>
      </div>
    </div>
  );
}
