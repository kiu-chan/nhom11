import React from 'react';
import { X } from 'lucide-react';

export const FilterMenu = ({
  selectedTypes,
  onTypeChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onRatingChange,
  onClearFilters,
  cuisineTypes,
}) => {
  const priceRanges = [
    { id: 'all', label: 'Tất cả' },
    { id: 'cheap', label: 'Dưới 50,000đ', min: 0, max: 50000 },
    { id: 'medium', label: '50,000đ - 100,000đ', min: 50000, max: 100000 },
    { id: 'expensive', label: 'Trên 100,000đ', min: 100000, max: Infinity }
  ];

  const ratingOptions = [
    { value: 0, label: 'Tất cả' },
    { value: 3, label: 'Trên 3 sao' },
    { value: 4, label: 'Trên 4 sao' },
    { value: 4.5, label: 'Trên 4.5 sao' }
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (!selectedTypes.includes('all')) count += selectedTypes.length;
    if (priceRange !== 'all') count += 1;
    if (minRating > 0) count += 1;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
        {activeCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700
              bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Xóa ({activeCount})</span>
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Cuisine Types */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Loại hình ẩm thực</h3>
          <div className="space-y-2">
            {cuisineTypes.map(type => (
              <label 
                key={type.id} 
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 
                  rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => onTypeChange(type.id)}
                  className="rounded border-gray-300 text-blue-600 
                    focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Khoảng giá</h3>
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label 
                key={range.id} 
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 
                  rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="priceRange"
                  value={range.id}
                  checked={priceRange === range.id}
                  onChange={() => onPriceRangeChange(range.id)}
                  className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Đánh giá</h3>
          <div className="space-y-2">
            {ratingOptions.map(option => (
              <label 
                key={option.value} 
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 
                  rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="rating"
                  value={option.value}
                  checked={minRating === option.value}
                  onChange={() => onRatingChange(option.value)}
                  className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  {option.label}
                  {option.value > 0 && (
                    <span className="ml-1 text-yellow-500">
                      {"★".repeat(Math.floor(option.value))}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};