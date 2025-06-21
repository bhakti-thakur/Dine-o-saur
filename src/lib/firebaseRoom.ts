import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { Room, User, SwipeAction } from './types';

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
  await setDoc(roomRef(room.id), {
    ...room,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    stage: 'waiting',
  });
}

// Add or update a user in a room
export async function upsertUser(roomId: string, user: User) {
  await setDoc(userRef(roomId, user.id), {
    ...user,
    joinedAt: serverTimestamp(),
  });
}

// Listen to room changes in real time
export function listenRoom(roomId: string, cb: (room: Room | null) => void) {
  return onSnapshot(roomRef(roomId), (doc) => {
    cb(doc.exists() ? doc.data() as Room : null);
  });
}

// Listen to users in a room in real time
export function listenUsers(roomId: string, cb: (users: User[]) => void) {
  return onSnapshot(collection(db, 'rooms', roomId, 'users'), (snap) => {
    cb(snap.docs.map(d => d.data() as User));
  });
}

// Listen to swipes in a room in real time
export function listenSwipes(roomId: string, cb: (swipes: SwipeAction[]) => void) {
  return onSnapshot(swipesRef(roomId), (snap) => {
    cb(snap.docs.map(d => d.data() as SwipeAction));
  });
}

// Update room stage
export async function updateRoomStage(roomId: string, stage: string) {
  await updateDoc(roomRef(roomId), { stage });
}

// Mark user as done swiping
export async function markUserDone(roomId: string, userId: string) {
  await updateDoc(userRef(roomId, userId), { isDoneSwiping: true });
}

// Add a swipe action
export async function addSwipe(roomId: string, swipe: SwipeAction) {
  await addDoc(swipesRef(roomId), { ...swipe, timestamp: serverTimestamp() });
}

// Remove a user from a room
export async function removeUser(roomId: string, userId: string) {
  await deleteDoc(userRef(roomId, userId));
} 