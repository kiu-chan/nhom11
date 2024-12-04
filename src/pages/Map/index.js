import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AppLayout } from './AppLayout';
import { SearchBar } from './SearchBar';
import { FilterMenu } from './FilterMenu';
import { LocationButton } from './LocationButton';
import { RestaurantPopup } from './RestaurantPopup';
import { RouteComponent } from './RouteComponent';
import { restaurants, DEFAULT_CENTER, DEFAULT_ZOOM, CUISINE_TYPES } from './restaurantData';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = () => {
  // State
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

  // Handlers
  const handleLocationClick = useCallback(() => {
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
  }, [isLocating]);

  const handleDirectionsClick = useCallback((restaurant) => {
    if (!userLocation) {
      handleLocationClick();
    }
    setSelectedRestaurant(restaurant);
    setShowRoute(true);
  }, [userLocation, handleLocationClick]);

  const handleTypeChange = useCallback((typeId) => {
    setSelectedTypes(prev => {
      if (typeId === 'all') return ['all'];
      const newTypes = prev.filter(t => t !== 'all');
      if (prev.includes(typeId)) {
        return newTypes.filter(t => t !== typeId);
      }
      return [...newTypes, typeId];
    });
  }, []);

  const handleSelectRestaurant = useCallback((restaurant) => {
    setMapCenter(restaurant.position);
    setMapZoom(18);
    setSelectedRestaurant(restaurant);
  }, []);

  // Filter restaurants
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
      const priceRanges = {
        cheap: { max: 50000 },
        medium: { min: 50000, max: 100000 },
        expensive: { min: 100000 }
      };
      const range = priceRanges[priceRange];
      const [min, max] = restaurant.priceRange
        .match(/\d+,\d+/g)
        .map(price => parseInt(price.replace(',', '')));
      const avgPrice = (min + max) / 2;

      if (range.max && avgPrice > range.max) return false;
      if (range.min && avgPrice < range.min) return false;
    }

    return true;
  });

  // Map instance
  const map = (
    <MapContainer 
      center={mapCenter}
      zoom={mapZoom} 
      className="w-full h-full"
    >
      <TileLayer
        url="https://tmdt.fimo.edu.vn/hot/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <div className="font-medium">Vị trí của bạn</div>
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
  );

  return (
    <AppLayout
      searchBar={
        <SearchBar 
          restaurants={restaurants}
          onSelectRestaurant={handleSelectRestaurant}
        />
      }
      sidebar={
        <FilterMenu 
          selectedTypes={selectedTypes}
          onTypeChange={handleTypeChange}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          minRating={minRating}
          onRatingChange={setMinRating}
          onClearFilters={() => {
            setSelectedTypes(['all']);
            setPriceRange('all');
            setMinRating(0);
          }}
          cuisineTypes={CUISINE_TYPES}
        />
      }
      locationButton={
        <LocationButton 
          onClick={handleLocationClick}
          isLocating={isLocating}
        />
      }
      map={map}
    />
  );
};

export default MapComponent;