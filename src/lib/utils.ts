import { Room, User, Restaurant, SwipeAction, RestaurantMatch } from './types';

// Generate a random 6-character alphanumeric room ID
export function generateRoomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate a random user ID
export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Generate a random user name
export function generateUserName(): string {
  const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Quinn'];
  return names[Math.floor(Math.random() * names.length)];
}

// Calculate room expiry time
export function calculateExpiryTime(minutes: number = 30): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// Check if room has expired
export function isRoomExpired(room: Room): boolean {
  return new Date() > room.expiresAt;
}

// Filter restaurants based on user preferences
export function filterRestaurantsByPreferences(
  restaurants: Restaurant[],
  preferences: string[]
): Restaurant[] {
  if (preferences.length === 0) return restaurants;
  
  return restaurants.filter(restaurant => 
    restaurant.tags.some(tag => preferences.includes(tag))
  );
}

// Calculate restaurant matches based on swipe data
export function calculateMatches(
  restaurants: Restaurant[],
  swipes: SwipeAction[]
): RestaurantMatch[] {
  const restaurantScores = new Map<string, { likes: number; superLikes: number; score: number }>();
  
  // Initialize scores
  restaurants.forEach(restaurant => {
    restaurantScores.set(restaurant.id, { likes: 0, superLikes: 0, score: 0 });
  });
  
  // Calculate scores from swipes
  swipes.forEach(swipe => {
    const current = restaurantScores.get(swipe.restaurantId);
    if (current) {
      if (swipe.action === 'like') {
        current.likes++;
        current.score += 1;
      } else if (swipe.action === 'superlike') {
        current.superLikes++;
        current.score += 3;
      }
      restaurantScores.set(swipe.restaurantId, current);
    }
  });
  
  // Convert to RestaurantMatch array and sort by score
  return restaurants
    .map(restaurant => {
      const scores = restaurantScores.get(restaurant.id)!;
      return {
        restaurant,
        score: scores.score,
        likes: scores.likes,
        superLikes: scores.superLikes
      };
    })
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Get top matches based on room type
export function getTopMatches(matches: RestaurantMatch[], roomType: 'couple' | 'group'): RestaurantMatch[] {
  const maxResults = roomType === 'couple' ? 3 : 5;
  return matches.slice(0, maxResults);
}

// Check if all users in a room are done swiping
export function areAllUsersDone(users: User[]): boolean {
  return users.length > 0 && users.every(user => user.isDoneSwiping);
}

// Format rating for display
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

// Open restaurant in maps
export function openInMaps(address: string): void {
  const encodedAddress = encodeURIComponent(address);
  window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
}

// Open restaurant website
export function openWebsite(url: string): void {
  window.open(url, '_blank');
} 