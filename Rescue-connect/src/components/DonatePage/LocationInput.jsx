import React from "react";

export default function LocationInput({ location, handleLocationChange }) {
  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-medium">Location</h2>
      <input type="number" placeholder="Latitude" value={location.lat} onChange={(e) => handleLocationChange("lat", e.target.value)} className="w-full px-3 py-2 border rounded" required />
      <input type="number" placeholder="Longitude" value={location.lng} onChange={(e) => handleLocationChange("lng", e.target.value)} className="w-full px-3 py-2 border rounded" required />
      <input type="text" placeholder="Address (optional)" value={location.address} onChange={(e) => handleLocationChange("address", e.target.value)} className="w-full px-3 py-2 border rounded" />
    </div>
  );
}
