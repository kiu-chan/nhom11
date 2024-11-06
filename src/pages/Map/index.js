import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { restaurants, DEFAULT_CENTER, DEFAULT_ZOOM } from './restaurantData';
import { RouteComponent } from './RouteComponent';
import { RestaurantPopup } from './RestaurantPopup';
import { FilterMenu } from './FilterMenu';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Helper function to extract numeric price from price range string
const getAveragePrice = (priceRange) => {
  const prices = priceRange.match(/\d+,\d+/g);
  if (!prices) return 0;
  const numericPrices = prices.map(price => 
    parseInt(price.replace(',', ''))
  );
  return (numericPrices[0] + numericPrices[1]) / 2;
};

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  
  // Filter states
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
        return newTypes.filter(t => t !== typeId);
      } else {
        return [...newTypes, typeId];
      }
    });
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleRatingChange = (rating) => {
    setMinRating(Number(rating));
  };

  const handleClearFilters = () => {
    setSelectedTypes(['all']);
    setPriceRange('all');
    setMinRating(0);
  };

  // Filter restaurants based on all criteria
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Filter by cuisine type
    if (!selectedTypes.includes('all') && 
        !restaurant.cuisineTypes.some(type => selectedTypes.includes(type))) {
      return false;
    }

    // Filter by rating
    if (restaurant.rating < minRating) {
      return false;
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const avgPrice = getAveragePrice(restaurant.priceRange);
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
    <div style={{ 
      height: "100vh", 
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0
    }}>
      {/* Nút location */}
      <div 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
        }}
        className="bg-white rounded-lg shadow-lg"
      >
        <button
          onClick={handleLocationClick}
          disabled={isLocating}
          className={`p-3 rounded-lg transition-colors duration-200 flex items-center justify-center
            ${isLocating ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          title="Vị trí của bạn"
        >
          <MapPin className={`w-6 h-6 ${isLocating ? 'text-gray-400' : 'text-gray-700'}`} />
        </button>
      </div>

      {/* Filter Menu */}
      <FilterMenu 
        selectedTypes={selectedTypes}
        onTypeChange={handleTypeChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        minRating={minRating}
        onRatingChange={handleRatingChange}
        onClearFilters={handleClearFilters}
      />

      {/* Map */}
      <MapContainer 
        center={mapCenter}
        zoom={mapZoom} 
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          url="https://tmdt.fimo.edu.vn/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
  );
};

export default MapComponent;