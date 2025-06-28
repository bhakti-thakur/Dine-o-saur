'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Heart, Utensils, Sparkles } from 'lucide-react';
import { ROOM_TYPES } from '@/lib/constants';
import { generateRoomId } from '@/lib/utils';

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<string>('');
  const router = useRouter();

  const handleCreateRoom = () => {
    if (!selectedType) return;
    
    const roomId = generateRoomId();
    router.push(`/room/${roomId}?type=${selectedType}`);
  };

  const handleJoinRoom = () => {
    router.push('/join');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Utensils className="w-12 h-12 text-orange-500 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Dine-o-saur
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the perfect restaurant together. <br/> No login required, just swipe and decide where to eat with your group!
          </p>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16 text-gray-400"
        >
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Group Decision</h3>
            <p className="text-gray-600">Perfect for couples and groups up to 8 people</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Swipe & Match</h3>
            <p className="text-gray-600">Tinder-style interface for restaurant discovery</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-600">AI-powered recommendations based on preferences</p>
          </div>
        </motion.div>

        {/* Room Type Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-400 text-center mb-8">Start a Room</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {ROOM_TYPES.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type.id)}
                className={`p-6 rounded-2xl text-gray-400 border transition-all ${
                  selectedType === type.id
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="text-4xl mb-3">{type.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                <p className="text-gray-600">Up to {type.maxUsers} people</p>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateRoom}
            disabled={!selectedType}
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all ${
              selectedType
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Room
          </motion.button>
        </motion.div>

        {/* Join Room Option */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center text-gray-600 mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          
          <button
            onClick={handleJoinRoom}
            className="text-orange-600 hover:text-orange-700 font-semibold text-lg underline"
          >
            Join an existing room
          </button>
        </motion.div>
      </div>
    </div>
  );
}
