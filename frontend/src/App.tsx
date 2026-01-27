import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AllUsers from "./pages/AllUsers";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Nav from "./pages/Nav";
import Register from "./pages/Register";
import UserDetailView from "./pages/UserDetailView";

const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Nav />
			<main className="grow">
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
				path: "/users/:userId",
				element: <UserDetailView />,
			},
			{
				path: "/register",
				element: <Register />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
