import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AllUsers from "./pages/AllUsers";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import MusicalCollection from "./pages/MusicalCollection";
import Nav from "./pages/Nav";
import Register from "./pages/Register";
import UserDetail from "./pages/UserDetail";

const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
				}`}
			>
				<Outlet />
			</main>
		</div>
	);
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
				path: "/collection/:type/:id",
				element: <MusicalCollection />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
