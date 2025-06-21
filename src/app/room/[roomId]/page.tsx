'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Copy, Check, ArrowLeft } from 'lucide-react';
import { generateUserId, generateUserName, calculateExpiryTime } from '@/lib/utils';
import { ROOM_EXPIRY_MINUTES } from '@/lib/constants';
import { User, Room } from '@/lib/types';
import PreferencePicker from '@/components/PreferencePicker';
import SwipeScreen from '@/components/SwipeScreen';
import ResultsScreen from '@/components/ResultsScreen';
import {
  createRoom,
  upsertUser,
  listenRoom,
  listenUsers,
  updateRoomStage,
  markUserDone,
  removeUser
} from '@/lib/firebaseRoom';

type RoomStage = 'waiting' | 'preferences' | 'swiping' | 'results';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const roomType = searchParams.get('type') as 'couple' | 'group';
  
  const [stage, setStage] = useState<RoomStage>('waiting');
  const [room, setRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  // --- Firestore Real-Time Listeners ---
  useEffect(() => {
    if (!roomId) return;
    // Listen to room document
    const unsubRoom = listenRoom(roomId, (roomData) => {
      if (roomData) {
        setRoom(roomData as Room);
        setStage(roomData.stage || 'waiting');
      }
    });
    // Listen to users in room
    const unsubUsers = listenUsers(roomId, setUsers);
    return () => {
      unsubRoom();
      unsubUsers();
    };
  }, [roomId]);

  // --- On Mount: Create/Join Room and User ---
  useEffect(() => {
    if (!roomId) return;
    // Generate or get user from localStorage
    let user = null;
    const stored = localStorage.getItem('dineosaur_user');
    if (stored) {
      user = JSON.parse(stored);
    } else {
      user = {
        id: generateUserId(),
        name: generateUserName(),
        preferences: [],
        isDoneSwiping: false,
        joinedAt: new Date()
      };
      localStorage.setItem('dineosaur_user', JSON.stringify(user));
    }
    setCurrentUser(user);
    // Create room if not exists
    createRoom({
      id: roomId,
      type: roomType || 'group',
      createdAt: new Date(),
      expiresAt: calculateExpiryTime(ROOM_EXPIRY_MINUTES),
      users: [],
      isActive: true,
      stage: 'waiting',
    }).catch(() => {});
    // Add user to Firestore
    upsertUser(roomId, user);
    // Remove user on unload
    const cleanup = () => removeUser(roomId, user.id);
    window.addEventListener('beforeunload', cleanup);
    return () => window.removeEventListener('beforeunload', cleanup);
  }, [roomId, roomType]);

  // --- Progression Logic ---
  // 1. Waiting: Advance to preferences when all users have joined (2 for couple, up to 8 for group)
  useEffect(() => {
    if (!room || !users.length) return;
    if (stage === 'waiting') {
      if ((room.type === 'couple' && users.length === 2) || (room.type === 'group' && users.length >= 2)) {
        updateRoomStage(roomId, 'preferences');
      }
    }
  }, [stage, users, room, roomId]);

  // 2. Preferences: Advance to swiping when all users have selected preferences
  useEffect(() => {
    if (!room || !users.length) return;
    if (stage === 'preferences') {
      const allDone = users.every(u => u.preferences && u.preferences.length >= 3);
      if (allDone) {
        updateRoomStage(roomId, 'swiping');
      }
    }
  }, [stage, users, room, roomId]);

  // 3. Swiping: Advance to results when all users are done swiping
  useEffect(() => {
    if (!room || !users.length) return;
    if (stage === 'swiping') {
      const allDone = users.every(u => u.isDoneSwiping);
      if (allDone) {
        updateRoomStage(roomId, 'results');
      }
    }
  }, [stage, users, room, roomId]);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy link');
    }
  };

  const handlePreferencesComplete = async (preferences: string[]) => {
    if (currentUser) {
      await upsertUser(roomId, { ...currentUser, preferences });
      setCurrentUser({ ...currentUser, preferences });
    }
  };

  const handleSwipingComplete = async () => {
    if (currentUser) {
      await markUserDone(roomId, currentUser.id);
      setCurrentUser({ ...currentUser, isDoneSwiping: true });
    }
  };

  if (!room || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Room {roomId}</h1>
                <p className="text-sm text-gray-600">
                  {room.type === 'couple' ? 'Couple' : 'Group'} • {users.length} users
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCopyLink}
              className="flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {stage === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <Users className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Waiting for others...</h2>
              <p className="text-gray-600 mb-8">
                Share the room code with your friends to start the restaurant discovery journey!
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">Room Code</p>
                <p className="text-3xl font-mono font-bold text-gray-800 tracking-widest">{roomId}</p>
              </div>
              
              <div className="text-left bg-orange-50 rounded-xl p-6">
                <h3 className="font-semibold mb-3">How it works:</h3>
                <ol className="text-sm text-gray-700 space-y-2">
                  <li>1. Everyone joins the room using the code above</li>
                  <li>2. Each person selects their food preferences</li>
                  <li>3. Swipe through restaurant recommendations</li>
                  <li>4. Get matched with the best options for your group!</li>
                </ol>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'preferences' && currentUser && (
          <PreferencePicker
            onComplete={handlePreferencesComplete}
            currentPreferences={currentUser.preferences}
            roomId={roomId}
            userId={currentUser.id}
          />
        )}

        {stage === 'swiping' && currentUser && (
          <SwipeScreen
            room={room}
            onComplete={handleSwipingComplete}
            roomId={roomId}
            userId={currentUser.id}
          />
        )}

        {stage === 'results' && (
          <ResultsScreen
            room={room}
            roomId={roomId}
          />
        )}
      </div>
    </div>
  );
} 