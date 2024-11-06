import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ restaurants, onSelectRestaurant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside of search component
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
        restaurant.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
      setShowResults(true);
    } else {
      setFilteredRestaurants([]);
      setShowResults(false);
    }
  }, [searchTerm, restaurants]);

  const handleSelectRestaurant = (restaurant) => {
    onSelectRestaurant(restaurant);
    setSearchTerm('');
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-1000 w-full max-w-md px-4" ref={searchRef}>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm nhà hàng..."
            className="w-full px-4 py-2 pl-10 pr-10 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {showResults && filteredRestaurants.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {filteredRestaurants.map(restaurant => (
              <button
                key={restaurant.id}
                onClick={() => handleSelectRestaurant(restaurant)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <div className="font-medium">{restaurant.name}</div>
                <div className="text-sm text-gray-600">
                  {restaurant.type} • {restaurant.priceRange}
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && searchTerm && filteredRestaurants.length === 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg p-4 text-center text-gray-500">
            Không tìm thấy kết quả phù hợp
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;