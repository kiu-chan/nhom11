import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { restaurants, DEFAULT_CENTER, DEFAULT_ZOOM } from './restaurantData';
import { RouteComponent } from './RouteComponent';
import { RestaurantPopup } from './RestaurantPopup';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Helper component to update map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapComponent = () => {
  // State declarations
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['all']);
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);

  const handleLocationClick = () => {
    if (isLocating) return;

    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter([location.lat, location.lng]);
          setMapZoom(16);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    }
  };

  // Handlers
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(value.toLowerCase()) ||
        restaurant.type.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectRestaurant = (restaurant) => {
    setMapCenter(restaurant.position);
    setMapZoom(18);
    setSearchTerm('');
    setShowResults(false);
  };

  const handleDirectionsClick = (restaurant) => {
    if (!userLocation) {
      handleLocationClick();
    }
    setSelectedRestaurant(restaurant);
    setShowRoute(true);
  };

  const handleTypeChange = (typeId) => {
    setSelectedTypes(prev => {
      if (typeId === 'all') {
        return ['all'];
      }
      const newTypes = prev.filter(t => t !== 'all');
      if (prev.includes(typeId)) {
        const filtered = newTypes.filter(t => t !== typeId);
        return filtered.length ? filtered : ['all'];
      }
      return [...newTypes, typeId];
    });
  };

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!selectedTypes.includes('all') && 
        !restaurant.cuisineTypes.some(type => selectedTypes.includes(type))) {
      return false;
    }
    if (restaurant.rating < minRating) return false;
    if (priceRange !== 'all') {
      const prices = restaurant.priceRange.match(/\d+,\d+/g);
      if (!prices) return false;
      const [min, max] = prices.map(price => parseInt(price.replace(',', '')));
      const avgPrice = (min + max) / 2;

      switch (priceRange) {
        case 'cheap':
          if (avgPrice > 50000) return false;
          break;
        case 'medium':
          if (avgPrice <= 50000 || avgPrice > 100000) return false;
          break;
        case 'expensive':
          if (avgPrice <= 100000) return false;
          break;
      }
    }
    return true;
  });

  return (
    <div className="h-screen w-screen flex">
      {/* Left Sidebar - now part of the main layout */}
      <div className="w-60 h-full bg-white border-r border-gray-200 flex-shrink-0">
        {/* Search Section */}
        <div className="p-2 relative search-container">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm nhà hàng..."
              className="w-full pl-2 pr-2 py-1 border border-gray-300 text-sm"
            />
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="absolute left-2 right-2 mt-1 bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map(restaurant => (
                <div
                  key={restaurant.id}
                  onClick={() => handleSelectRestaurant(restaurant)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="text-sm font-medium">{restaurant.name}</div>
                  <div className="text-xs text-gray-500">{restaurant.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="px-2">
          <h2 className="text-base font-medium mb-3">Bộ lọc</h2>

          {/* Location Button */}
          <button
            onClick={handleLocationClick}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded 
              flex items-center gap-2 hover:bg-gray-50 text-sm"
          >
            <MapPin className={`w-4 h-4 ${isLocating ? 'text-gray-400' : 'text-gray-700'}`} />
            <span>Vị trí của bạn</span>
          </button>
          
          {/* Cuisine Type */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Loại hình ẩm thực</h3>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'vietnamese', label: 'Ẩm thực Việt Nam' },
                { id: 'streetfood', label: 'Đồ ăn vỉa hè' },
                { id: 'noodles', label: 'Mì & Bún' },
                { id: 'rice', label: 'Cơm & Xôi' },
                { id: 'drinks', label: 'Đồ uống' },
                { id: 'breakfast', label: 'Ăn sáng' },
                { id: 'seafood', label: 'Hải sản' },
                { id: 'snacks', label: 'Đồ ăn vặt' },
                { id: 'traditional', label: 'Món ăn truyền thống' },
                { id: 'chinese', label: 'Ẩm thực Trung Hoa' }
              ].map(type => (
                <label key={type.id} className="flex items-center text-sm">
                  <input 
                    type="checkbox"
                    checked={selectedTypes.includes(type.id)}
                    onChange={() => handleTypeChange(type.id)}
                    className="mr-2 h-4 w-4"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Khoảng giá</h3>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'cheap', label: 'Dưới 50,000đ' },
                { id: 'medium', label: '50,000đ - 100,000đ' },
                { id: 'expensive', label: 'Trên 100,000đ' }
              ].map(range => (
                <label key={range.id} className="flex items-center text-sm">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === range.id}
                    onChange={() => setPriceRange(range.id)}
                    className="mr-2 h-4 w-4"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Đánh giá</h3>
            <div className="space-y-1">
              {[
                { value: 0, label: 'Tất cả' },
                { value: 3, label: 'Trên 3 sao ★★★' },
                { value: 4, label: 'Trên 4 sao ★★★★' },
                { value: 4.5, label: 'Trên 4.5 sao ★★★★★' }
              ].map(rating => (
                <label key={rating.value} className="flex items-center text-sm">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating.value}
                    onChange={() => setMinRating(rating.value)}
                    className="mr-2 h-4 w-4"
                  />
                  {rating.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1">
        <MapContainer 
          center={mapCenter}
          zoom={mapZoom} 
          className="h-full w-full"
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            url="https://tmdt.fimo.edu.vn/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <strong>Vị trí của bạn</strong>
              </Popup>
            </Marker>
          )}

          {filteredRestaurants.map(restaurant => (
            <Marker 
              key={restaurant.id} 
              position={restaurant.position}
            >
              <Popup>
                <RestaurantPopup 
                  restaurant={restaurant}
                  onDirectionsClick={() => handleDirectionsClick(restaurant)}
                />
              </Popup>
            </Marker>
          ))}

          {showRoute && selectedRestaurant && userLocation && (
            <RouteComponent 
              start={userLocation}
              end={selectedRestaurant.position}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;