import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function DonatePage() {
  const [foods, setFoods] = useState([
    { name: "", quantity: "", unit: "kg", expiryDuration: "", photo: null, preview: null },
  ]);
  const [location, setLocation] = useState({ lat: "", lng: "", address: "" });
  const [cameraIndex, setCameraIndex] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  // Auto-fetch location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "",
          }),
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  // Handle food input changes
  const handleFoodChange = (index, field, value) => {
    const newFoods = [...foods];
    newFoods[index][field] = value;
    setFoods(newFoods);
  };

  // File upload
  const handleFileChange = (index, file) => {
    if (!file) return;
    const newFoods = [...foods];
    newFoods[index].photo = file;
    newFoods[index].preview = URL.createObjectURL(file);
    setFoods(newFoods);
  };

  // Camera handlers
  const openCamera = (index) => {
    setCameraIndex(index);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error(err);
        alert("Cannot access camera");
        setCameraIndex(null);
      });
  };

  const captureImage = (index) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.png", { type: "image/png" });
      handleFileChange(index, file);

      // Stop camera
      const stream = video.srcObject;
      if (stream) stream.getTracks().forEach((track) => track.stop());
      setCameraIndex(null);
    });
  };

  const addFood = () => {
    setFoods([...foods, { name: "", quantity: "", unit: "kg", expiryDuration: "", photo: null, preview: null }]);
  };

  const removeFood = (index) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  const handleLocationChange = (field, value) => {
    setLocation({ ...location, [field]: value });
  };

  // Submit donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (foods.length === 0) return alert("Add at least one food item");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    formData.append("address", location.address || "");
    
    // Append foods as JSON string
    formData.append("foods", JSON.stringify(foods.map(({ name, quantity, unit, expiryDuration }) => ({ name, quantity, unit, expiryDuration }))));

    // Append photos separately
    foods.forEach((food, index) => {
      if (food.photo) {
        formData.append(`foods[${index}][photo]`, food.photo, food.photo.name);
      }
    });

    try {
      await axios.post("http://localhost:5000/api/donations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Donation posted successfully ✅");
      setFoods([{ name: "", quantity: "", unit: "kg", expiryDuration: "", photo: null, preview: null }]);
      setLocation({ lat: "", lng: "", address: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error posting donation ❌");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Post Food Donation</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {foods.map((food, index) => (
          <div key={index} className="border p-4 rounded space-y-3">
            <h2 className="font-medium">Food Item {index + 1}</h2>
            <input type="text" placeholder="Name" value={food.name} onChange={(e) => handleFoodChange(index, "name", e.target.value)} className="w-full px-3 py-2 border rounded" required />
            <input type="number" placeholder="Quantity" value={food.quantity} onChange={(e) => handleFoodChange(index, "quantity", e.target.value)} className="w-full px-3 py-2 border rounded" required />
            <select value={food.unit} onChange={(e) => handleFoodChange(index, "unit", e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="kg">kg</option>
              <option value="persons">persons</option>
            </select>
            <input type="number" placeholder="Expiry Duration (hours)" value={food.expiryDuration} onChange={(e) => handleFoodChange(index, "expiryDuration", e.target.value)} className="w-full px-3 py-2 border rounded" required />

            {/* Upload & Camera */}
            <div className="space-y-2">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(index, e.target.files[0])} />
              {cameraIndex !== index && <button type="button" onClick={() => openCamera(index)} className="bg-blue-600 text-white px-2 py-1 rounded">Open Camera</button>}
              {cameraIndex === index && (
                <div>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 border rounded mb-2" />
                  <button type="button" onClick={() => captureImage(index)} className="bg-green-600 text-white px-2 py-1 rounded">Capture Photo</button>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              )}
              {food.preview && <img src={food.preview} alt="Preview" className="w-full h-48 object-cover rounded mt-2" />}
            </div>

            {foods.length > 1 && <button type="button" onClick={() => removeFood(index)} className="text-red-600">Remove</button>}
          </div>
        ))}

        <button type="button" onClick={addFood} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Food</button>

        {/* Location */}
        <div className="border p-4 rounded space-y-3">
          <h2 className="font-medium">Location</h2>
          <input type="number" placeholder="Latitude" value={location.lat} onChange={(e) => handleLocationChange("lat", e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="number" placeholder="Longitude" value={location.lng} onChange={(e) => handleLocationChange("lng", e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="text" placeholder="Address (optional)" value={location.address} onChange={(e) => handleLocationChange("address", e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Post Donation</button>

        {message && <p className="mt-4 text-center font-medium text-green-600">{message}</p>}
      </form>
    </div>
  );
}
