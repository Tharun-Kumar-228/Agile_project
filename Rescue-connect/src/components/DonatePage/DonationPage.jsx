import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import FoodItem from "./FoodItem";
import LocationInput from "./LocationInput";
import RequestedDonations from "./RequestedDonations";

export default function DonatePage() {
  const [foods, setFoods] = useState([{ name: "", quantity: "", unit: "kg", expiryDuration: "", photo: null, preview: null }]);
  const [location, setLocation] = useState({ lat: "", lng: "", address: "" });
  const [cameraIndex, setCameraIndex] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: "" }),
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  const handleFoodChange = (index, field, value) => {
    const newFoods = [...foods];
    newFoods[index][field] = value;
    setFoods(newFoods);
  };

  const handleFileChange = (index, file) => {
    if (!file) return;
    const newFoods = [...foods];
    newFoods[index].photo = file;
    newFoods[index].preview = URL.createObjectURL(file);
    setFoods(newFoods);
  };

  const openCamera = (index) => {
    setCameraIndex(index);
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    }).catch(() => { alert("Cannot access camera"); setCameraIndex(null); });
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
      video.srcObject.getTracks().forEach(track => track.stop());
      setCameraIndex(null);
    });
  };

  const addFood = () => setFoods([...foods, { name: "", quantity: "", unit: "kg", expiryDuration: "", photo: null, preview: null }]);
  const removeFood = (index) => setFoods(foods.filter((_, i) => i !== index));
  const handleLocationChange = (field, value) => setLocation({ ...location, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    formData.append("address", location.address || "");

    formData.append("foods", JSON.stringify(foods.map(({ name, quantity, unit, expiryDuration }) => ({ name, quantity, unit, expiryDuration }))));

    foods.forEach((food, index) => { if (food.photo) formData.append(`foods[${index}][photo]`, food.photo, food.photo.name); });

    try {
      await axios.post("http://localhost:5000/api/donations", formData, { headers: { "Content-Type": "multipart/form-data" } });
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
          <FoodItem
            key={index}
            food={food}
            index={index}
            handleFoodChange={handleFoodChange}
            handleFileChange={handleFileChange}
            openCamera={openCamera}
            removeFood={foods.length > 1 ? removeFood : null}
            cameraIndex={cameraIndex}
            videoRef={videoRef}
            canvasRef={canvasRef}
            captureImage={captureImage}
          />
        ))}

        <button type="button" onClick={addFood} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Food</button>
        <LocationInput location={location} handleLocationChange={handleLocationChange} />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Post Donation</button>
        {message && <p className="mt-4 text-center font-medium text-green-600">{message}</p>}
      </form>

      {/* Requested Donations */}
      <RequestedDonations receiverId={userId} />
    </div>
  );
}
