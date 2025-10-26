
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  adoptedStreets: string[];
  totalPoints: number;
  level: number;
  joinedDate: string;
  bio?: string;
}

export interface CleanupLog {
  id: string;
  userId: string;
  userName: string;
  date: string;
  location: string;
  duration: number; // in minutes
  trashBags: number;
  points: number;
  photos: string[];
  notes?: string;
  beforePhoto?: string;
  afterPhoto?: string;
}

export interface HazardReport {
  id: string;
  userId: string;
  userName: string;
  type: 'pothole' | 'debris' | 'large-trash' | 'other';
  location: string;
  description: string;
  photos: string[];
  reportedDate: string;
  status: 'reported' | 'in-progress' | 'resolved';
  severity: 'low' | 'medium' | 'high';
}

export interface PlantPost {
  id: string;
  userId: string;
  userName: string;
  plantName: string;
  scientificName?: string;
  location: string;
  photos: string[];
  description: string;
  isPollinatorFriendly: boolean;
  careInstructions?: string;
  postedDate: string;
  likes: number;
}

export interface CommunityEvent {
  id: string;
  organizerId: string;
  organizerName: string;
  title: string;
  description: string;
  type: 'cleanup' | 'block-party' | 'planting' | 'other';
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  maxAttendees?: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  totalPoints: number;
  cleanupCount: number;
  rank: number;
}
