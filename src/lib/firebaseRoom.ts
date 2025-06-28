import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  getFirestore
} from 'firebase/firestore';
import { Room, User, SwipeAction } from './types';
import { getApps } from 'firebase/app';

console.log(getApps());

// Room document reference
export function roomRef(roomId: string) {
  return doc(db, 'rooms', roomId);
}

// User document reference
export function userRef(roomId: string, userId: string) {
  return doc(db, 'rooms', roomId, 'users', userId);
}

// Swipes collection reference
export function swipesRef(roomId: string) {
  return collection(db, 'rooms', roomId, 'swipes');
}

// Create a new room
export async function createRoom(room: Room) {
  const payload = {
    ...room,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    stage: 'waiting',
  };
  try {
    await setDoc(roomRef(room.id), payload);
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

// Add or update a user in a room
export async function upsertUser(roomId: string, user: User) {
  try {
    await setDoc(userRef(roomId, user.id), {
      ...user,
      joinedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error upserting user:", error);
    throw error;
  }
}

// Listen to room changes in real time
export function listenRoom(roomId: string, cb: (room: Room | null) => void) {
  if (!roomId) {
    console.warn("listenRoom: Invalid roomId");
    return () => {};
  }
  try {
    return onSnapshot(
      roomRef(roomId),
      (doc) => {
        if (!doc.exists()) {
          console.warn("listenRoom: Room document does not exist for roomId:", roomId);
          cb(null);
        } else {
          const data = doc.data();
          console.log("listenRoom: Room data received:", data);
          cb(data as Room);
        }
      },
      (error) => {
        console.error("listenRoom Firestore error:", error);
        cb(null);
      }
    );
  } catch (error) {
    console.error("listenRoom setup error:", error);
    return () => {};
  }
}

// Update room stage
export async function updateRoomStage(roomId: string, stage: string) {
  await updateDoc(roomRef(roomId), { stage });
}

// Mark user as done swiping
export async function markUserDone(roomId: string, userId: string) {
  await updateDoc(userRef(roomId, userId), { isDoneSwiping: true });
}

// Remove a user from a room
export async function removeUser(roomId: string, userId: string) {
  await deleteDoc(userRef(roomId, userId));
}

// Fetch and cache restaurants for a room using Google Places API
export async function fetchAndCacheRestaurants(roomId: string, location: { lat: number; lng: number }, tags: string[]) {
  const db = getFirestore();
  const restaurantsRef = doc(db, 'rooms', roomId, 'restaurants', 'list');
  const docSnap = await getDoc(restaurantsRef);
  const now = Date.now();
  // If already fetched within 5 minutes, return cached data
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.fetchedAt && now - data.fetchedAt.toMillis() < 5 * 60 * 1000) {
      return data.restaurants;
    }
  }
  // Build Google Places API URL
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const radius = 8000; // 8km
  const keyword = tags.join(',');
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=restaurant&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;
  const response = await fetch(url);
  const result = await response.json();
  const restaurants = (result.results || []).map((r: any) => ({
    id: r.place_id,
    name: r.name,
    image: r.photos && r.photos.length > 0 ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${r.photos[0].photo_reference}&key=${apiKey}` : '',
    rating: r.rating,
    cuisine: '', // Google Places does not provide cuisine directly
    address: r.vicinity,
    website: r.website || '',
    priceRange: '', // Not available from Places API
    tags: tags.filter(tag => r.name.toLowerCase().includes(tag.toLowerCase()) || (r.types && r.types.includes(tag.toLowerCase()))),
    lat: r.geometry && r.geometry.location ? r.geometry.location.lat : undefined,
    lng: r.geometry && r.geometry.location ? r.geometry.location.lng : undefined,
  }));
  // Cache in Firestore
  await setDoc(restaurantsRef, {
    restaurants,
    fetchedAt: serverTimestamp(),
  });
  return restaurants;
} 