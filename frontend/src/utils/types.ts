export interface User {
  username: string;
  fullName: string;
  email?: string;
  profilePhoto?: string | null;
  role?: "ADMIN" | "NONADMIN";
}

export interface ArtistContribution {
  musicalEntityId: number;
  title: string;
  genre: string;
  role: string;
  entityType: string;
}
export interface MusicalEntity {
  id: number;
  title: string;
  genre: string;
  type: string;
  releasedBy: string;
}

export interface Playlist {
  id: number;
  name: string;
  cover: string;
  creatorName: string;
}

export interface BaseNonAdminUser {
  id: number;
  fullName: string;
  userType: string;
  profilePhoto: string;
  followers: number;
  following: number;
  isFollowedByCurrentUser: boolean;
}
