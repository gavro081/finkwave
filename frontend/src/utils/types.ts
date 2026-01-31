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
  isLikedByCurrentUser: boolean;
}

export interface MusicalEntity {
  id: number;
  title: string;
  genre: string;
  type: string;
  releasedBy: string;
  isLikedByCurrentUser?: boolean;
}

export interface Song extends MusicalEntity {
  type: "SONG";
}

export interface Album extends MusicalEntity {
  type: "ALBUM";
  songs: Song[];
}

export interface Playlist {
  id: number;
  name: string;
  cover: string;
  creatorName: string;
  songsInPlaylist: Song[];
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
