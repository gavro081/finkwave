import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllUsers from "./components/userProfile/AllUsersHelper";
import UserDetail from "./components/userProfile/UserDetail";

function Home() {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8080/");
      const data = await response.json();
      console.log(data);
    };
    fetchData();
  });

  return (
    <>
      <p className="text-red-500">ok</p>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<AllUsers />} />
        <Route path="/users/:userId" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
