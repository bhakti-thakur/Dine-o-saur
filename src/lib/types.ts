export interface Room {
  id: string;
  type: 'couple' | 'group';
  createdAt: Date;
  expiresAt: Date;
  users: User[];
  isActive: boolean;
  stage: 'waiting' | 'preferences' | 'swiping' | 'results';
  expectedUsers?: number;
  swipeDeadline?: string;
}

export interface User {
  id: string;
  name: string;
  preferences: string[];
  isDoneSwiping: boolean;
  joinedAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  address: string;
  website?: string;
  priceRange: string;
  tags: string[];
}

export interface SwipeAction {
  roomId: string;
  userId: string;
  restaurantId: string;
  action: 'like' | 'skip' | 'superlike';
  timestamp: Date;
}

export interface RestaurantMatch {
  restaurant: Restaurant;
  score: number;
  likes: number;
  superLikes: number;
}

export interface FoodPreference {
  id: string;
  name: string;
  category: 'cuisine' | 'taste' | 'diet';
  icon: string;
} 