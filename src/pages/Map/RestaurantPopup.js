import React from 'react';
import { Navigation2, Phone, Clock, MapPin } from 'lucide-react';

export const RestaurantPopup = ({ restaurant, onDirectionsClick }) => {
  return (
    <div className="min-w-[280px] max-w-[320px]">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{restaurant.name}</h3>
      
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <span className="text-sm text-gray-600">{restaurant.address}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{restaurant.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{restaurant.openTime}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="text-sm">
            <span className="text-gray-500">Loại hình:</span>
            <span className="ml-2 text-gray-700">{restaurant.type}</span>
          </div>

          <div className="text-sm">
            <span className="text-gray-500">Giá:</span>
            <span className="ml-2 text-gray-700">{restaurant.priceRange}</span>
          </div>

          <div className="text-sm">
            <span className="text-gray-500">Đánh giá:</span>
            <span className="ml-2">
              <span className="text-gray-700">{restaurant.rating}/5</span>
              <span className="ml-1 text-yellow-500">
                {"★".repeat(Math.floor(restaurant.rating))}
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={onDirectionsClick}
          className="mt-4 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
            text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Navigation2 className="w-4 h-4" />
          <span>Chỉ đường</span>
        </button>
      </div>
    </div>
  );
};