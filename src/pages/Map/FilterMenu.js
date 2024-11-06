import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { CUISINE_TYPES } from './restaurantData';

export const FilterMenu = ({ 
  selectedTypes,
  onTypeChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onRatingChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Các khoảng giá
  const priceRanges = [
    { id: 'all', label: 'Tất cả' },
    { id: 'cheap', label: 'Dưới 50,000đ', min: 0, max: 50000 },
    { id: 'medium', label: '50,000đ - 100,000đ', min: 50000, max: 100000 },
    { id: 'expensive', label: 'Trên 100,000đ', min: 100000, max: Infinity }
  ];

  // Các mức đánh giá
  const ratingOptions = [
    { value: 0, label: 'Tất cả' },
    { value: 3, label: 'Trên 3 sao' },
    { value: 4, label: 'Trên 4 sao' },
    { value: 4.5, label: 'Trên 4.5 sao' }
  ];

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (!selectedTypes.includes('all')) count += selectedTypes.length;
    if (priceRange !== 'all') count += 1;
    if (minRating > 0) count += 1;
    return count;
  };

  return (
    <div className="absolute top-20 right-4 z-1000">
      {/* Toggle button */}
      <button
        onClick={handleToggleMenu}
        className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-5 h-5" />
        <span className="font-medium">Bộ lọc</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-sm">
            {getActiveFiltersCount()}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter menu */}
      {isOpen && (
        <div className="mt-2 bg-white rounded-lg shadow-lg p-4 w-72">
          {/* Menu header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Tùy chọn lọc</h3>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Cuisine types */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Thể loại ẩm thực</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {CUISINE_TYPES.map(type => (
                <label key={type.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.id)}
                    onChange={() => onTypeChange(type.id)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Khoảng giá</h4>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <label key={range.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.id}
                    checked={priceRange === range.id}
                    onChange={() => onPriceRangeChange(range.id)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="font-medium mb-2">Đánh giá</h4>
            <div className="space-y-2">
              {ratingOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rating"
                    value={option.value}
                    checked={minRating === option.value}
                    onChange={() => onRatingChange(option.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};