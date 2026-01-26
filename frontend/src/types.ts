export interface UserResponse {
	username: string;
	role: "ADMIN" | "NONADMIN";
}

export interface User {
	username: string;
	fullName: string;
	email: string;
	profilePhoto?: string | null;
	role?: "ADMIN" | "NONADMIN";
}
