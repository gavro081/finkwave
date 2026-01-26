import axios from "axios";

export const baseURL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;
let refreshTimeout: number | null = null;

export const clearRefreshTimeout = () => {
	if (refreshTimeout) {
		clearTimeout(refreshTimeout);
		refreshTimeout = null;
	}
};

export const scheduleTokenRefresh = (expiryTimeSeconds: number) => {
	clearRefreshTimeout();

	const refreshTime = (expiryTimeSeconds - 60) * 1000;
	if (refreshTime <= 0) {
		refreshTokenMethod();
	} else {
		refreshTimeout = setTimeout(refreshTokenMethod, refreshTime);
	}
};

export const refreshTokenMethod = async (): Promise<void | null> => {
	if (refreshPromise) {
		return refreshPromise;
	}

	refreshPromise = (async () => {
		try {
			const refreshResponse = await axiosInstance.post<{
				tokenExpiresIn: number;
			}>("/auth/refresh");
			scheduleTokenRefresh(refreshResponse.data.tokenExpiresIn);
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			refreshPromise = null;
		}
	})();
	return refreshPromise;
};

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalConfig = error.config;
		if (
			[401, 403].includes(error.response?.status) &&
			!originalConfig._retry &&
			originalConfig.url !== "/auth/refresh"
		) {
			originalConfig._retry = true;

			try {
				await refreshTokenMethod();
				return axiosInstance(originalConfig);
			} catch (err) {
				clearRefreshTimeout();
				return Promise.reject(err);
			}
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
