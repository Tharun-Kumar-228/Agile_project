// Receive.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Receive() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold">Receive Page</h1>
    </div>
  );
}
