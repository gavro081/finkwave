export interface User {
	username: string;
	fullName: string;
	email?: string;
	profilePhoto?: string | null;
	isAdmin: boolean;
	isArtist: boolean;
}

export interface ArtistContribution {
	id: number;
	title: string;
	genre: string;
	role: string;
	entityType: string;
	isLikedByCurrentUser: boolean;
	cover?: string | null;
	link?: string | null;
}

export interface MusicalEntity {
	id: number;
	title: string;
	genre: string;
	type: string;
	releasedBy: string;
	artistUsername?: string;
	cover?: string | null;
	isLikedByCurrentUser?: boolean;
}

export interface Song extends MusicalEntity {
	type: "SONG";
	album?: string;
	albumId?: number;
	link?: string;
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

export interface SongContribution {
	artistName: string;
	role: string;
}

export interface SongReview {
	id: {
		listenerId: number;
		musicalEntityId: number;
	};
	author: string;
	authorUsername: string;
	grade: number;
	comment: string;
}

export interface SongDetail extends MusicalEntity {
	type: "SONG";
	album?: string | null;
	link?: string | null;
	contributions: SongContribution[];
	reviews: SongReview[];
}

export interface BasicSong {
	id: number;
	title: string;
	artist: string;
	artistUsername?: string;
	cover?: string;
	link?: string;
	album?: string;
	albumId?: number;
}

export interface BasicPlaylist {
	id: number;
	name: string;
	songCount: number;
}

export interface CatalogItem {
	id: number;
	title: string;
	genre: string;
	cover: string | null;
	type: "SONG" | "ALBUM";
	releaseDate: string;
}

export interface Contributor {
	id: number;
	fullName: string;
	role: string;
}

export interface ArtistSearchResult {
	id: number;
	username: string;
	fullName: string;
	profilePhoto?: string;
}

export interface SongEntry {
	title: string;
	link: string;
	contributors: Contributor[];
}
