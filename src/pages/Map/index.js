import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
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

// Component để cập nhật center của map
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRoute, setShowRoute] = useState(false);

  // Xử lý khi click vào nút location
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
        
        {/* Marker vị trí người dùng */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <strong>Vị trí của bạn</strong>
            </Popup>
          </Marker>
        )}

        {/* Markers nhà hàng */}
        {restaurants.map(restaurant => (
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

        {/* Route */}
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