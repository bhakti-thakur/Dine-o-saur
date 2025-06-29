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
  },
  {
    id: '6',
    name: 'Burger Haven',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    rating: 4.1,
    cuisine: 'American',
    address: '101 Burger Ln, Uptown',
    website: 'https://burgerhaven.com',
    priceRange: '$',
    tags: ['american', 'savory']
  },
  {
    id: '7',
    name: 'Green Leaf',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    rating: 4.7,
    cuisine: 'Mediterranean',
    address: '202 Olive Rd, Midtown',
    website: 'https://greenleaf.com',
    priceRange: '$$',
    tags: ['mediterranean', 'vegetarian', 'vegan']
  },
  {
    id: '8',
    name: 'Parisian Delights',
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=400',
    rating: 4.3,
    cuisine: 'French',
    address: '303 Baguette St, Downtown',
    website: 'https://parisiandelights.com',
    priceRange: '$$$',
    tags: ['french', 'sweet', 'vegetarian']
  },
  {
    id: '9',
    name: 'Seoul Food',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.5,
    cuisine: 'Korean',
    address: '404 Kimchi Ave, Koreatown',
    website: 'https://seoulfood.com',
    priceRange: '$$',
    tags: ['korean', 'spicy', 'umami']
  },
  {
    id: '10',
    name: 'Bangkok Bites',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400',
    rating: 4.2,
    cuisine: 'Thai',
    address: '505 Lemongrass Blvd, Eastside',
    website: 'https://bangkokbites.com',
    priceRange: '$$',
    tags: ['thai', 'spicy', 'sour']
  },
  {
    id: '11',
    name: 'Vegan Vibes',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    rating: 4.9,
    cuisine: 'Vegan',
    address: '606 Plant St, Midtown',
    website: 'https://veganvibes.com',
    priceRange: '$$',
    tags: ['vegan', 'vegetarian', 'gluten-free']
  },
  {
    id: '12',
    name: 'Falafel House',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.0,
    cuisine: 'Mediterranean',
    address: '707 Chickpea Dr, Downtown',
    website: 'https://falafelhouse.com',
    priceRange: '$',
    tags: ['mediterranean', 'vegetarian', 'halal']
  },
  {
    id: '13',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    rating: 4.6,
    cuisine: 'Italian',
    address: '808 Mozzarella Ln, Westside',
    website: 'https://pizzapalace.com',
    priceRange: '$$',
    tags: ['italian', 'savory', 'vegetarian']
  },
  {
    id: '14',
    name: 'Tandoori Nights',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.3,
    cuisine: 'Indian',
    address: '909 Curry St, Downtown',
    website: 'https://tandoorinights.com',
    priceRange: '$$',
    tags: ['indian', 'spicy', 'halal']
  },
  {
    id: '15',
    name: 'Sushi Zen',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400',
    rating: 4.8,
    cuisine: 'Japanese',
    address: '1010 Sashimi Ave, Midtown',
    website: 'https://sushizen.com',
    priceRange: '$$$',
    tags: ['japanese', 'umami', 'gluten-free']
  },
  {
    id: '16',
    name: 'Tortilla Town',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.1,
    cuisine: 'Mexican',
    address: '1111 Salsa Rd, Westside',
    website: 'https://tortillatown.com',
    priceRange: '$',
    tags: ['mexican', 'spicy', 'vegetarian']
  },
  {
    id: '17',
    name: 'Dragon Wok',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.4,
    cuisine: 'Chinese',
    address: '1212 Bamboo Dr, Chinatown',
    website: 'https://dragonwok.com',
    priceRange: '$$',
    tags: ['chinese', 'umami', 'halal']
  },
  {
    id: '18',
    name: 'Crepe Corner',
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=400',
    rating: 4.2,
    cuisine: 'French',
    address: '1313 Paris St, Downtown',
    website: 'https://crepecorner.com',
    priceRange: '$$',
    tags: ['french', 'sweet', 'vegetarian']
  },
  {
    id: '19',
    name: 'Kimchi Kitchen',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.5,
    cuisine: 'Korean',
    address: '1414 Seoul Ave, Koreatown',
    website: 'https://kimchikitchen.com',
    priceRange: '$$',
    tags: ['korean', 'spicy', 'umami']
  },
  {
    id: '20',
    name: 'Pad Thai Express',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400',
    rating: 4.3,
    cuisine: 'Thai',
    address: '1515 Noodle St, Eastside',
    website: 'https://padthaiexpress.com',
    priceRange: '$$',
    tags: ['thai', 'spicy', 'sour']
  },
  {
    id: '21',
    name: 'Veggie Delight',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    rating: 4.7,
    cuisine: 'Vegan',
    address: '1616 Greenway, Midtown',
    website: 'https://veggiedelight.com',
    priceRange: '$$',
    tags: ['vegan', 'vegetarian', 'gluten-free']
  },
  {
    id: '22',
    name: 'Shawarma Stop',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.0,
    cuisine: 'Mediterranean',
    address: '1717 Pita Pl, Downtown',
    website: 'https://shawarmastop.com',
    priceRange: '$',
    tags: ['mediterranean', 'halal', 'savory']
  },
  {
    id: '23',
    name: 'Pasta Point',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    rating: 4.6,
    cuisine: 'Italian',
    address: '1818 Penne Rd, Westside',
    website: 'https://pastapoint.com',
    priceRange: '$$',
    tags: ['italian', 'savory', 'vegetarian']
  },
  {
    id: '24',
    name: 'Curry House',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.3,
    cuisine: 'Indian',
    address: '1919 Masala St, Downtown',
    website: 'https://curryhouse.com',
    priceRange: '$$',
    tags: ['indian', 'spicy', 'halal']
  },
  {
    id: '25',
    name: 'Tempura Town',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400',
    rating: 4.8,
    cuisine: 'Japanese',
    address: '2020 Tempura Ave, Midtown',
    website: 'https://tempuratown.com',
    priceRange: '$$$',
    tags: ['japanese', 'umami', 'gluten-free']
  },
  {
    id: '26',
    name: 'Burrito Bros',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.1,
    cuisine: 'Mexican',
    address: '2121 Salsa Rd, Westside',
    website: 'https://burritobros.com',
    priceRange: '$',
    tags: ['mexican', 'spicy', 'vegetarian']
  },
  {
    id: '27',
    name: 'Lotus Garden',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.4,
    cuisine: 'Chinese',
    address: '2222 Lotus Dr, Chinatown',
    website: 'https://lotusgarden.com',
    priceRange: '$$',
    tags: ['chinese', 'umami', 'halal']
  },
  {
    id: '28',
    name: 'Bistro Belle',
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=400',
    rating: 4.2,
    cuisine: 'French',
    address: '2323 Paris St, Downtown',
    website: 'https://bistrobelle.com',
    priceRange: '$$',
    tags: ['french', 'sweet', 'vegetarian']
  },
  {
    id: '29',
    name: 'Bibimbap Bowl',
    image: 'https://images.unsplash.com/photo-1504674900247-ec6b0b1b7a6b?w=400',
    rating: 4.5,
    cuisine: 'Korean',
    address: '2424 Seoul Ave, Koreatown',
    website: 'https://bibimbapbowl.com',
    priceRange: '$$',
    tags: ['korean', 'spicy', 'umami']
  },
  {
    id: '30',
    name: 'Noodle Nook',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400',
    rating: 4.3,
    cuisine: 'Thai',
    address: '2525 Noodle St, Eastside',
    website: 'https://noodlenook.com',
    priceRange: '$$',
    tags: ['thai', 'spicy', 'sour']
  },
]; 