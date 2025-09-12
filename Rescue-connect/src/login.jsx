import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <== for navigation

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "donor", // default
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // <== hook from react-router-dom

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ store needed data in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        setMessage("Login successful ✅");

        // ✅ forward to /dashboard
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Login failed ❌");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
            <option value="volunteer">Volunteer</option>
            <option value="recipient">Recipient</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-medium text-red-600">{message}</p>
      )}
    </div>
  );
}
