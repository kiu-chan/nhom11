import React from 'react';
import { MapPin } from 'lucide-react';

export const LocationButton = ({ onClick, isLocating }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLocating}
      className={`p-3 bg-white rounded-lg shadow-lg transition-all
        ${isLocating 
          ? 'bg-gray-50 cursor-not-allowed' 
          : 'hover:bg-gray-50 active:scale-95'
        }`}
      title="Vị trí của bạn"
    >
      <MapPin 
        className={`w-5 h-5 ${isLocating ? 'text-gray-400' : 'text-gray-700'}`}
      />
    </button>
  );
};