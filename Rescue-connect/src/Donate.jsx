import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Donate() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    photo: null,
    preview: null,
    expiryDuration: "", // in hours
    status: "Pending", // default status
  });
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [user, setUser] = useState({});
  const [cameraOpen, setCameraOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!userId || !username || !role) {
      navigate("/login");
    } else {
      setUser({ userId, username, role });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFood({ ...newFood, photo: file, preview: URL.createObjectURL(file) });
    }
  };

  const openCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error(err);
      alert("Cannot access camera");
      setCameraOpen(false);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.png", { type: "image/png" });
      setNewFood({ ...newFood, photo: file, preview: URL.createObjectURL(file) });

      // Stop camera
      const stream = video.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      setCameraOpen(false);
    });
  };

  const addFood = () => {
    if (!newFood.name || !newFood.quantity || !newFood.expiryDuration) {
      alert("Please fill in name, quantity, and expiry duration");
      return;
    }
    setFoods([...foods, newFood]);
    setNewFood({
      name: "",
      quantity: "",
      unit: "kg",
      photo: null,
      preview: null,
      expiryDuration: "",
      status: "Pending",
    });
    setFormOpen(false); // hide form after adding food
  };

  const handleSubmit = async () => {
    if (foods.length === 0) {
      alert("Add at least one food item");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.userId);
    formData.append("location", JSON.stringify(location));

    foods.forEach((food) => {
      formData.append(
        "foods",
        JSON.stringify({
          name: food.name,
          quantity: food.quantity,
          unit: food.unit,
          expiryDuration: food.expiryDuration,
          status: food.status,
        })
      );
      if (food.photo) formData.append("photos", food.photo);
    });

    try {
      const res = await fetch("http://localhost:5000/api/add-donation", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("Donation added successfully!");
        setFoods([]);
      } else {
        alert(data.message || "Error adding donation");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto relative">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4 text-center">Donate Food</h1>

      {/* List of added foods */}
      {foods.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-2 text-lg">Food List</h2>
          {foods.map((food, idx) => (
            <div key={idx} className="flex items-center justify-between border p-2 rounded mb-1">
              <span>
                {food.name} - {food.quantity} {food.unit} | Expires in: {food.expiryDuration} hrs
              </span>
              {food.preview && (
                <img src={food.preview} alt="food" className="w-16 h-16 object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Food form */}
      {formOpen && (
        <div className="space-y-2 mb-4 p-4 border rounded bg-gray-50">
          <input
            type="text"
            name="name"
            value={newFood.name}
            onChange={handleChange}
            placeholder="Food Name"
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex gap-2">
            <input
              type="number"
              name="quantity"
              value={newFood.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="flex-1 px-3 py-2 border rounded"
            />
            <select
              name="unit"
              value={newFood.unit}
              onChange={handleChange}
              className="px-2 py-2 border rounded"
            >
              <option value="kg">kg</option>
              <option value="persons">persons</option>
            </select>
          </div>

          <input
            type="number"
            name="expiryDuration"
            value={newFood.expiryDuration}
            onChange={handleChange}
            placeholder="Expiry Duration (hours)"
            className="w-full px-3 py-2 border rounded"
          />

          <div className="flex gap-2">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
              onClick={openCamera}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Capture
            </button>
          </div>

          {newFood.preview && (
            <img src={newFood.preview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />
          )}

          <button
            onClick={addFood}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-2"
          >
            + Add Food
          </button>
        </div>
      )}

      {cameraOpen && (
        <div className="mb-4">
          <video ref={videoRef} autoPlay className="w-full rounded border mb-2" />
          <button
            onClick={captureImage}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Capture Photo
          </button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

      {/* Floating + button */}
      <button
        onClick={() => setFormOpen(!formOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 text-white text-3xl font-bold shadow-lg flex items-center justify-center hover:bg-blue-700"
      >
        +
      </button>

      {/* Submit donation */}
      {foods.length > 0 && (
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
        >
          Submit Donation
        </button>
      )}
    </div>
  );
}
