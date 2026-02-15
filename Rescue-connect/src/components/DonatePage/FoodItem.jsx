import React from "react";

export default function FoodItem({
  food,
  index,
  handleFoodChange,
  handleFileChange,
  openCamera,
  removeFood,
  cameraIndex,
  videoRef,
  canvasRef,
  captureImage,
}) {
  return (
    <div className="border p-4 rounded space-y-3">
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

      {removeFood && <button type="button" onClick={() => removeFood(index)} className="text-red-600">Remove</button>}
    </div>
  );
}
