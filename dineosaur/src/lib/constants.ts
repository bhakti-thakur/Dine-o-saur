import { FoodPreference } from './types';

export const FOOD_PREFERENCES: FoodPreference[] = [
  // Cuisines
  { id: 'chinese', name: 'Chinese', category: 'cuisine', icon: '🥡' },
  { id: 'indian', name: 'Indian', category: 'cuisine', icon: '🍛' },
  { id: 'italian', name: 'Italian', category: 'cuisine', icon: '🍝' },
  { id: 'mexican', name: 'Mexican', category: 'cuisine', icon: '🌮' },
  { id: 'japanese', name: 'Japanese', category: 'cuisine', icon: '🍱' },
  { id: 'thai', name: 'Thai', category: 'cuisine', icon: '🍜' },
  { id: 'mediterranean', name: 'Mediterranean', category: 'cuisine', icon: '🥙' },
  { id: 'american', name: 'American', category: 'cuisine', icon: '🍔' },
  { id: 'french', name: 'French', category: 'cuisine', icon: '🥐' },
  { id: 'korean', name: 'Korean', category: 'cuisine', icon: '🍖' },
  
  // Tastes
  { id: 'spicy', name: 'Spicy', category: 'taste', icon: '🌶️' },
  { id: 'sweet', name: 'Sweet', category: 'taste', icon: '🍰' },
  { id: 'savory', name: 'Savory', category: 'taste', icon: '🧀' },
  { id: 'sour', name: 'Sour', category: 'taste', icon: '🍋' },
  { id: 'umami', name: 'Umami', category: 'taste', icon: '🍄' },
  
  // Diets
  { id: 'vegetarian', name: 'Vegetarian', category: 'diet', icon: '🥬' },
  { id: 'vegan', name: 'Vegan', category: 'diet', icon: '🌱' },
  { id: 'gluten-free', name: 'Gluten-Free', category: 'diet', icon: '🌾' },
  { id: 'halal', name: 'Halal', category: 'diet', icon: '🕌' },
  { id: 'kosher', name: 'Kosher', category: 'diet', icon: '✡️' },
];

export const ROOM_TYPES = [
  { id: 'couple', name: 'Couple', maxUsers: 2, icon: '💕' },
  { id: 'group', name: 'Group', maxUsers: 8, icon: '👥' },
];

export const ROOM_EXPIRY_MINUTES = 30;
export const MIN_PREFERENCES = 3;
export const MAX_PREFERENCES = 8;

// Mock restaurant data for development
export const MOCK_RESTAURANTS = [
  {
    id: '1',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    rating: 4.5,
    cuisine: 'Indian',
    address: '123 Main St, Downtown',
    website: 'https://spicegarden.com',
    priceRange: '$$',
    tags: ['indian', 'spicy', 'vegetarian']
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    rating: 4.8,
    cuisine: 'Japanese',
    address: '456 Oak Ave, Midtown',
    website: 'https://sakurasushi.com',
    priceRange: '$$$',
    tags: ['japanese', 'savory', 'umami']
  },
  {
    id: '3',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    rating: 4.2,
    cuisine: 'Mexican',
    address: '789 Pine St, Westside',
    website: 'https://tacofiesta.com',
    priceRange: '$',
    tags: ['mexican', 'spicy', 'savory']
  },
  {
    id: '4',
    name: 'Bella Italia',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    rating: 4.6,
    cuisine: 'Italian',
    address: '321 Elm St, Eastside',
    website: 'https://bellaitalia.com',
    priceRange: '$$',
    tags: ['italian', 'savory', 'vegetarian']
  },
  {
    id: '5',
    name: 'Golden Dragon',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
    rating: 4.4,
    cuisine: 'Chinese',
    address: '654 Maple Dr, Chinatown',
    website: 'https://goldendragon.com',
    priceRange: '$$',
    tags: ['chinese', 'savory', 'umami']
  }
]; 