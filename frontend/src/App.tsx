import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";

const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			{/* <Nav /> */}
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
