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
    console.log("createRoom: Creating room", { roomId: room.id, roomType: room.type, expectedUsers: room.expectedUsers });
    await setDoc(roomRef(room.id), payload);
    console.log("createRoom: Successfully created room", { roomId: room.id });
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

// Add or update a user in a room
export async function upsertUser(roomId: string, user: User) {
  try {
    console.log("upsertUser: Adding user to room", { roomId, userId: user.id, userName: user.name });
    await setDoc(userRef(roomId, user.id), {
      ...user,
      joinedAt: serverTimestamp(),
    });
    console.log("upsertUser: Successfully added user to room", { roomId, userId: user.id });
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

// Listen to room and its users in real time
export function listenRoomWithUsers(roomId: string, cb: (room: Room | null, users: User[]) => void) {
  if (!roomId) {
    console.warn("listenRoomWithUsers: Invalid roomId");
    return () => {};
  }
  
  try {
    // Listen to room document
    const roomUnsub = onSnapshot(
      roomRef(roomId),
      (roomDoc) => {
        if (!roomDoc.exists()) {
          console.warn("listenRoomWithUsers: Room document does not exist for roomId:", roomId);
          cb(null, []);
        } else {
          const roomData = roomDoc.data() as Room;
          console.log("listenRoomWithUsers: Room data received:", roomData);
          
          // Listen to users subcollection
          const usersUnsub = onSnapshot(
            collection(db, 'rooms', roomId, 'users'),
            (usersSnapshot) => {
              const users: User[] = [];
              usersSnapshot.forEach((userDoc) => {
                users.push(userDoc.data() as User);
              });
              console.log("listenRoomWithUsers: Users data received:", users);
              
              // Combine room data with users
              const roomWithUsers = {
                ...roomData,
                users: users
              };
              
              cb(roomWithUsers, users);
            },
            (error) => {
              console.error("listenRoomWithUsers: Users listener error:", error);
              cb(roomData, []);
            }
          );
          
          // Return cleanup function that unsubscribes from both
          return () => {
            usersUnsub();
          };
        }
      },
      (error) => {
        console.error("listenRoomWithUsers: Room listener error:", error);
        cb(null, []);
      }
    );
    
    return () => {
      roomUnsub();
    };
  } catch (error) {
    console.error("listenRoomWithUsers setup error:", error);
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
  console.log("fetchAndCacheRestaurants: Starting fetch", { roomId, location, tags });
  
  const db = getFirestore();
  const restaurantsRef = doc(db, 'rooms', roomId, 'restaurants', 'list');
  
  try {
    // Check cache first
    const docSnap = await getDoc(restaurantsRef);
    const now = Date.now();
    
    // If already fetched within 5 minutes, return cached data
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.fetchedAt && now - data.fetchedAt.toMillis() < 5 * 60 * 1000) {
        console.log("fetchAndCacheRestaurants: Returning cached data", { count: data.restaurants?.length });
        return data.restaurants || [];
      }
    }
    
    // Get API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey || apiKey === 'your_google_places_api_key_here') {
      console.warn("fetchAndCacheRestaurants: Google Places API key not configured, using fallback data");
      return getFallbackRestaurants(tags);
    }
    
    console.log("fetchAndCacheRestaurants: Fetching from Google Places API");
    
    // Build Google Places API URL - using nearby search
    const radius = 5000; // 5km radius
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = new URLSearchParams({
      location: `${location.lat},${location.lng}`,
      radius: radius.toString(),
      type: 'restaurant',
      key: apiKey,
      rankby: 'rating' // Rank by rating for better results
    });
    
    // Add keywords if available
    if (tags.length > 0) {
      // Use the first few tags as keywords
      const keywords = tags.slice(0, 3).join(' ');
      params.append('keyword', keywords);
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    console.log("fetchAndCacheRestaurants: API URL", url.replace(apiKey, '***'));
    
    // Make the API request
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.status !== 'OK' && result.status !== 'ZERO_RESULTS') {
      console.error("fetchAndCacheRestaurants: Google Places API error", result);
      throw new Error(`Google Places API returned status: ${result.status}`);
    }
    
    console.log("fetchAndCacheRestaurants: API response", { 
      status: result.status, 
      resultCount: result.results?.length || 0 
    });
    
    // Process and transform the results
    const restaurants = (result.results || []).map((r: any) => {
      // Get photo URL if available
      let imageUrl = '';
      if (r.photos && r.photos.length > 0) {
        const photoRef = r.photos[0].photo_reference;
        imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${apiKey}`;
      }
      
      // Extract cuisine types from place types
      const cuisineTypes = r.types?.filter((type: string) => 
        type.includes('restaurant') || 
        type.includes('food') || 
        type.includes('meal')
      ) || [];
      
      // Determine price level
      const priceLevel = r.price_level ? '$'.repeat(r.price_level) : '';
      
      return {
        id: r.place_id,
        name: r.name,
        image: imageUrl,
        rating: r.rating || 0,
        cuisine: cuisineTypes.join(', '),
        address: r.vicinity || '',
        website: '', // Would need additional API call to get website
        priceRange: priceLevel,
        tags: tags.filter(tag => 
          r.name.toLowerCase().includes(tag.toLowerCase()) || 
          cuisineTypes.some((type: string) => type.toLowerCase().includes(tag.toLowerCase()))
        ),
        lat: r.geometry?.location?.lat,
        lng: r.geometry?.location?.lng,
        openNow: r.opening_hours?.open_now || false,
        userRatingsTotal: r.user_ratings_total || 0
      };
    });
    
    console.log("fetchAndCacheRestaurants: Processed restaurants", { count: restaurants.length });
    
    // Cache the results in Firestore
    await setDoc(restaurantsRef, {
      restaurants,
      fetchedAt: serverTimestamp(),
      location,
      tags
    });
    
    return restaurants;
    
  } catch (error) {
    console.error("fetchAndCacheRestaurants: Error fetching restaurants", error);
    
    // If we have cached data, return it even if expired
    try {
      const docSnap = await getDoc(restaurantsRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("fetchAndCacheRestaurants: Returning expired cached data as fallback");
        return data.restaurants || [];
      }
    } catch (cacheError) {
      console.error("fetchAndCacheRestaurants: Error accessing cache", cacheError);
    }
    
    // Return fallback data if all else fails
    console.log("fetchAndCacheRestaurants: Using fallback restaurant data");
    return getFallbackRestaurants(tags);
  }
}

// Fallback restaurant data when Google Places API is not available
function getFallbackRestaurants(tags: string[]) {
  const fallbackRestaurants = [
    {
      id: 'restaurant_1',
      name: 'The Urban Bistro',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      rating: 4.5,
      cuisine: 'Modern American, Bistro',
      address: '123 Main Street, Downtown',
      website: '',
      priceRange: '$$',
      tags: ['modern', 'bistro', 'american'],
      lat: 40.7128,
      lng: -74.0060,
      openNow: true,
      userRatingsTotal: 245
    },
    {
      id: 'restaurant_2',
      name: 'Sakura Sushi Bar',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      rating: 4.7,
      cuisine: 'Japanese, Sushi',
      address: '456 Oak Avenue, Midtown',
      website: '',
      priceRange: '$$$',
      tags: ['japanese', 'sushi', 'asian'],
      lat: 40.7589,
      lng: -73.9851,
      openNow: true,
      userRatingsTotal: 189
    },
    {
      id: 'restaurant_3',
      name: 'Pizza Palace',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      rating: 4.3,
      cuisine: 'Italian, Pizza',
      address: '789 Pine Street, West Side',
      website: '',
      priceRange: '$',
      tags: ['italian', 'pizza', 'casual'],
      lat: 40.7505,
      lng: -73.9934,
      openNow: true,
      userRatingsTotal: 312
    },
    {
      id: 'restaurant_4',
      name: 'Taco Fiesta',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      rating: 4.1,
      cuisine: 'Mexican, Tacos',
      address: '321 Elm Street, East Village',
      website: '',
      priceRange: '$',
      tags: ['mexican', 'tacos', 'casual'],
      lat: 40.7265,
      lng: -73.9860,
      openNow: true,
      userRatingsTotal: 156
    },
    {
      id: 'restaurant_5',
      name: 'Le Petit Bistro',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      rating: 4.6,
      cuisine: 'French, Bistro',
      address: '654 Maple Drive, Upper East Side',
      website: '',
      priceRange: '$$$',
      tags: ['french', 'bistro', 'elegant'],
      lat: 40.7648,
      lng: -73.9808,
      openNow: true,
      userRatingsTotal: 203
    },
    {
      id: 'restaurant_6',
      name: 'Spice Garden',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      rating: 4.4,
      cuisine: 'Indian, Curry',
      address: '987 Cedar Lane, Queens',
      website: '',
      priceRange: '$$',
      tags: ['indian', 'curry', 'spicy'],
      lat: 40.7505,
      lng: -73.9934,
      openNow: true,
      userRatingsTotal: 178
    }
  ];
  
  // Filter restaurants based on user preferences if available
  if (tags.length > 0) {
    return fallbackRestaurants.filter(restaurant => 
      tags.some(tag => 
        restaurant.tags.some(restaurantTag => 
          restaurantTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }
  
  return fallbackRestaurants;
} 