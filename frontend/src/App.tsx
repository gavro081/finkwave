import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllUsers from "./pages/AllUsers";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Nav from "./pages/Nav";
import Register from "./pages/Register";
import UserDetail from "./pages/UserDetail";
import MusicalCollection from "./pages/MusicalCollection";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
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
