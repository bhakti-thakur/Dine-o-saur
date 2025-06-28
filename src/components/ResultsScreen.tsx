'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, MapPin, Globe, Copy, Check, Star, Heart } from 'lucide-react';
import { Room, RestaurantMatch } from '@/lib/types';
import { MOCK_RESTAURANTS } from '@/lib/constants';
import { calculateMatches, getTopMatches, copyToClipboard, openInMaps, openWebsite } from '@/lib/utils';
import { listenSwipes } from '@/lib/firebaseRoom';
import Image from 'next/image';

interface ResultsScreenProps {
  room: Room;
  roomId: string;
}

export default function ResultsScreen({ room, roomId }: ResultsScreenProps) {
  const [matches, setMatches] = useState<RestaurantMatch[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Listen to real-time swipes from Firestore
    const unsubscribe = listenSwipes(roomId, (swipes) => {
      const allMatches = calculateMatches(MOCK_RESTAURANTS, swipes);
      const topMatches = getTopMatches(allMatches, room.type);
      setMatches(topMatches);
    });

    return () => unsubscribe();
  }, [roomId, room.type]);

  const handleCopyAddress = async (address: string, restaurantName: string) => {
    const success = await copyToClipboard(address);
    if (success) {
      setCopied(restaurantName);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-4xl font-bold mb-4">Your Top Matches!</h2>
        <p className="text-xl text-gray-600">
          Based on your group&apos;s preferences, here are the best restaurants for you
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {matches.map((match, index) => (
          <motion.div
            key={match.restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Rank Badge */}
            <div className="relative">
              <Image
                src={match.restaurant.image}
                alt={match.restaurant.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-gray-800">{getRankIcon(index)}</span>
              </div>
              <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center shadow-lg">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{match.restaurant.rating}</span>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{match.restaurant.name}</h3>
              <p className="text-gray-600 mb-3">{match.restaurant.cuisine}</p>
              
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{match.restaurant.address}</span>
              </div>

              {/* Score Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Group Score</span>
                  <span className="font-bold text-lg text-orange-600">{match.score} pts</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-1" />
                    <span>{match.likes} likes</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-purple-500 mr-1" />
                    <span>{match.superLikes} super likes</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => openInMaps(match.restaurant.address)}
                  className="flex items-center justify-center py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Maps
                </button>
                {match.restaurant.website && (
                  <button
                    onClick={() => openWebsite(match.restaurant.website!)}
                    className="flex items-center justify-center py-2 px-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Website
                  </button>
                )}
                <button
                  onClick={() => handleCopyAddress(match.restaurant.address, match.restaurant.name)}
                  className="flex items-center justify-center py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  {copied === match.restaurant.name ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {matches.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
          <p className="text-gray-600">
            It looks like no one has swiped on restaurants yet. Wait for your group to finish swiping!
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-shadow"
          >
            Start New Room
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 