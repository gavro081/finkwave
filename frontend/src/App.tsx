import { useEffect, useState } from "react";
import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./components/LoadingSpinner";
import MiniPlayer from "./components/MiniPlayer";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/authContext";
import { usePlayer } from "./context/playerContext";
import AllUsers from "./pages/AllUsers";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import MusicalCollection from "./pages/MusicalCollection";
import Nav from "./pages/Nav";
import Register from "./pages/Register";
import SongDetail from "./pages/SongDetail";
import UserDetail from "./pages/UserDetail";

const MainLayout = () => {
	const { user } = useAuth();
	const { currentSong } = usePlayer();
	const location = useLocation();
	// show sidebar only if user is logged in and is on the landing page
	const isLandingPage = location.pathname === "/";
	const [isSidebarOpen, setIsSidebarOpen] = useState(!!user && isLandingPage);

	// Open sidebar when user logs in and navigates to landing page
	useEffect(() => {
		if (user && isLandingPage) {
			setIsSidebarOpen(true);
		}
	}, [user, isLandingPage]);

	return (
		<div className="flex flex-col min-h-screen bg-[#121212]">
			<Nav
				isSidebarOpen={isSidebarOpen}
				onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
			/>
			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<main
				className={`grow transition-all duration-300 pt-20 ${
					isSidebarOpen ? "ml-64" : "ml-0"
				} ${currentSong ? "pb-20" : ""}`}
			>
				<Outlet />
			</main>
			<MiniPlayer />
		</div>
	);
};

const Layout = () => {
	const { isAuthLoading } = useAuth();

	if (isAuthLoading) {
		return <LoadingSpinner />;
	}

	return <MainLayout />;
};

const router = createBrowserRouter([
	{
		path: "",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <LandingPage />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/users",
				element: <AllUsers />,
			},
			{
				path: "/users/:username",
				element: <UserDetail />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/songs/:id",
				element: <SongDetail />,
			},
			{
				path: "/collection/:type/:id",
				element: <MusicalCollection />,
			},
			{
				path: "/me",
				element: <UserDetail />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
