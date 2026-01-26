import {
	createContext,
	useContext,
	useEffect,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";
import axiosInstance, {
	refreshTokenMethod,
	scheduleTokenRefresh,
} from "../api/axiosInstance";
import { type User } from "../types";

interface AuthContextType {
	user: User | undefined;
	setUser: Dispatch<SetStateAction<User | undefined>>;
	isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: undefined,
	setUser: () => {},
	isAuthLoading: false,
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [isAuthLoading, setIsAuthLoading] = useState(true);

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				await refreshTokenMethod();
				const response = await axiosInstance.get<{
					tokenExpiresIn: number;
					user: User;
				}>("/auth/user");
				setUser(response.data.user);
				scheduleTokenRefresh(response.data.tokenExpiresIn);
			} catch (error) {
				setUser(undefined);
			} finally {
				setIsAuthLoading(false);
			}
		};

		fetchUserDetails();
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser, isAuthLoading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
