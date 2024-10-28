import React from 'react';
import { Navigation2 } from 'lucide-react';

export const RestaurantPopup = ({ restaurant, onDirectionsClick }) => {
  return (
    <div style={{ minWidth: '200px' }}>
      <h3 className="text-lg font-bold mb-2">{restaurant.name}</h3>
      <div className="space-y-1 text-sm">
        <p><strong>Loại hình:</strong> {restaurant.type}</p>
        <p>
          <strong>Đánh giá:</strong> {restaurant.rating}/5
          <span className="ml-1">{"⭐".repeat(Math.floor(restaurant.rating))}</span>
        </p>
        <p><strong>Giá:</strong> {restaurant.priceRange}</p>
        <p><strong>Địa chỉ:</strong> {restaurant.address}</p>
        <p><strong>SĐT:</strong> {restaurant.phone}</p>
        <p><strong>Giờ mở cửa:</strong> {restaurant.openTime}</p>
        <button
          onClick={onDirectionsClick}
          className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-2 w-full justify-center"
        >
          <Navigation2 className="w-4 h-4" />
          Chỉ đường
        </button>
      </div>
    </div>
  );
};