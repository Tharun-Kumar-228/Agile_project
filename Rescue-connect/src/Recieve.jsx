import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReceivePage() {
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState("");

  const receiverId = localStorage.getItem("userId"); // logged-in user

  useEffect(() => {
    fetchPendingDonations();
  }, []);

  const fetchPendingDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donations/pending");
      setDonations(res.data.donations);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error fetching donations ❌");
    }
  };
const requestDonation = async (donationId) => {
  try {
    await axios.post(`http://localhost:5000/api/recievers/donations/request/${donationId}`, { receiverId });
    setMessage("Donation requested successfully ✅");
    fetchPendingDonations(); // refresh list if needed
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "Error requesting donation ❌");
  }
};

  const getExpiryTimeLeft = (food, createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const expiryTime = createdTime + food.expiryDuration * 60 * 60 * 1000;
    const diff = expiryTime - Date.now();
    if (diff <= 0) return "Expired";
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Donations</h1>
      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      {donations.length === 0 ? (
        <p className="text-center">No pending donations available.</p>
      ) : (
        donations.map((donation) => {
          const hasExpiredFoods = donation.foods.every(food => {
            const expiry = getExpiryTimeLeft(food, donation.createdAt);
            return expiry === "Expired";
          });
          if (hasExpiredFoods) return null; // skip donation if all foods expired

          return (
            <div key={donation._id} className="border p-4 rounded mb-6">
              <h2 className="font-semibold text-lg mb-2">Donation ID: {donation._id}</h2>
              <p className="mb-2">
                Location: Lat {donation.location.lat}, Lng {donation.location.lng}
                {donation.location.address && `, Address: ${donation.location.address}`}
              </p>
              <p className="mb-2">Donor: {donation.userId}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                {donation.foods.map((food, idx) => {
                  const expiry = getExpiryTimeLeft(food, donation.createdAt);
                  if (expiry === "Expired") return null;
                  return (
                    <div key={idx} className="border p-2 rounded flex flex-col items-center">
                      {food.photo && <img src={`http://localhost:5000${food.photo}`} alt={food.name} className="w-32 h-32 object-cover rounded mb-2" />}
                      <p className="font-medium">{food.name}</p>
                      <p>Quantity: {food.quantity} {food.unit}</p>
                      <p>Expires in: {expiry}</p>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => requestDonation(donation._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Request Donation
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
