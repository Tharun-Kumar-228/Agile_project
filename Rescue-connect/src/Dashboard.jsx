import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Rescue Connect</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-20 space-y-12">
        <h2 className="text-2xl font-bold">
          Welcome, {user ? user.username : "User"}!
        </h2>

        <div className="flex space-x-20">
          {/* Donate Button */}
          <button
            onClick={() => navigate("/donate")}
            className="w-48 h-48 rounded-full bg-green-600 text-white text-xl font-bold shadow-lg hover:bg-green-700 transition"
          >
            Donate
          </button>

          {/* Receive Button */}
          <button
            onClick={() => navigate("/receive")}
            className="w-48 h-48 rounded-full bg-yellow-500 text-white text-xl font-bold shadow-lg hover:bg-yellow-600 transition"
          >
            Receive
          </button>
        </div>
      </div>
    </div>
  );
}
