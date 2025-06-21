'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Copy, Check } from 'lucide-react';

export default function JoinPage() {
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomCode.trim().length === 6) {
      router.push(`/room/${roomCode.toUpperCase()}`);
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-orange-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Join a Room</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Enter the 6-character room code to join your friends
          </p>
        </motion.div>

        {/* Join Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
                Room Code
              </label>
              <input
                id="roomCode"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinRoom}
              disabled={roomCode.trim().length !== 6}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all ${
                roomCode.trim().length === 6
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Join Room
            </motion.button>
          </div>
        </motion.div>

        {/* Share Link Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Share this link</h3>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
              <span className="text-sm text-gray-600 truncate flex-1">
                {typeof window !== 'undefined' ? window.location.origin : 'https://dineosaur.vercel.app'}
              </span>
              <button
                onClick={handleCopyLink}
                className="ml-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Share this link with your friends to let them join easily
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 