import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ restaurants, onSelectRestaurant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
      setShowResults(true);
    } else {
      setFilteredRestaurants([]);
      setShowResults(false);
    }
  }, [searchTerm, restaurants]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm nhà hàng..."
          className="w-full px-10 py-2.5 bg-white rounded-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 
              rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {filteredRestaurants.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto">
              {filteredRestaurants.map(restaurant => (
                <button
                  key={restaurant.id}
                  onClick={() => {
                    onSelectRestaurant(restaurant);
                    setShowResults(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100
                    last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-gray-900">{restaurant.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{restaurant.address}</div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {restaurant.type} • {restaurant.priceRange}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-gray-500">
              Không tìm thấy kết quả phù hợp
            </div>
          )}
        </div>
      )}
    </div>
  );
};