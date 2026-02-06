export interface User {
	username: string;
	fullName: string;
	email?: string;
	profilePhoto?: string | null;
	role?: "ADMIN" | "NONADMIN";
}

export interface ArtistContribution {
	id: number;
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
	cover?: string | null;
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
	isSavedByCurrentUser: boolean;
}

export interface BaseNonAdminUser {
	username: string;
	fullName: string;
	userType: string;
	profilePhoto: string;
	followers: number;
	following: number;
	isFollowedByCurrentUser: boolean;
}

export type UserRegisterType = "ARTIST" | "LISTENER";

export type SearchCategory = "songs" | "albums" | "artists" | "users";

export interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export interface BasicSong {
	id: number;
	title: string;
	artist: string;
	cover?: string;
}

export interface BasicPlaylist {
	id: number;
	name: string;
	songCount: number;
}
