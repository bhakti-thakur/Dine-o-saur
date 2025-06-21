'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Heart, X, Star, MapPin, Globe, Copy, Check } from 'lucide-react';
import { Room, User, Restaurant, SwipeAction } from '@/lib/types';
import { MOCK_RESTAURANTS } from '@/lib/constants';
import { filterRestaurantsByPreferences, formatRating, copyToClipboard, openInMaps, openWebsite } from '@/lib/utils';

interface SwipeScreenProps {
  room: Room;
  currentUser: User;
  onComplete: () => void;
}

export default function SwipeScreen({ room, currentUser, onComplete }: SwipeScreenProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState<SwipeAction[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Filter restaurants based on all users' preferences
    const allPreferences = room.users.flatMap(user => user.preferences);
    const filteredRestaurants = filterRestaurantsByPreferences(MOCK_RESTAURANTS, allPreferences);
    setRestaurants(filteredRestaurants);
  }, [room]);

  const handleSwipe = (action: 'like' | 'skip' | 'superlike') => {
    if (currentIndex >= restaurants.length) return;

    const currentRestaurant = restaurants[currentIndex];
    const swipeAction: SwipeAction = {
      roomId: room.id,
      userId: currentUser.id,
      restaurantId: currentRestaurant.id,
      action,
      timestamp: new Date()
    };

    setSwipes(prev => [...prev, swipeAction]);
    setCurrentIndex(prev => prev + 1);

    // Check if we've swiped through all restaurants
    if (currentIndex + 1 >= restaurants.length) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      handleSwipe('like');
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe('skip');
    }
  };

  const handleCopyAddress = async (address: string) => {
    const success = await copyToClipboard(address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading restaurants...</p>
      </div>
    );
  }

  if (currentIndex >= restaurants.length) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Heart className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4">All done!</h2>
        <p className="text-gray-600">You've swiped through all the restaurants.</p>
      </div>
    );
  }

  const currentRestaurant = restaurants[currentIndex];
  const progress = ((currentIndex + 1) / restaurants.length) * 100;

  return (
    <div className="max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Restaurant {currentIndex + 1} of {restaurants.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Restaurant Card */}
      <motion.div
        key={currentRestaurant.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Restaurant Image */}
        <div className="relative h-64 bg-gray-200">
          <img
            src={currentRestaurant.image}
            alt={currentRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="font-semibold">{formatRating(currentRestaurant.rating)}</span>
          </div>
          <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1">
            <span className="font-semibold text-gray-700">{currentRestaurant.priceRange}</span>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{currentRestaurant.name}</h3>
          <p className="text-gray-600 mb-4">{currentRestaurant.cuisine}</p>
          
          <div className="flex items-center text-gray-500 mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{currentRestaurant.address}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => openInMaps(currentRestaurant.address)}
              className="flex-1 flex items-center justify-center py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Maps
            </button>
            {currentRestaurant.website && (
              <button
                onClick={() => openWebsite(currentRestaurant.website!)}
                className="flex-1 flex items-center justify-center py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                Website
              </button>
            )}
            <button
              onClick={() => handleCopyAddress(currentRestaurant.address)}
              className="flex-1 flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Swipe Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('skip')}
          className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-8 h-8 text-gray-600" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('superlike')}
          className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
        >
          <Star className="w-8 h-8 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
        >
          <Heart className="w-8 h-8 text-white" />
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Swipe right to like, left to skip, or use the buttons below
        </p>
      </div>
    </div>
  );
} 