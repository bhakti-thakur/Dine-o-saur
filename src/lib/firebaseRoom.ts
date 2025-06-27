import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp
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