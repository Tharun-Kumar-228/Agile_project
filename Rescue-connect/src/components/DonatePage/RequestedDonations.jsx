import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DonorRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  const donorId = localStorage.getItem("userId"); // Donor ID stored in localStorage

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/donations/requests/${donorId}`);
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error fetching requests ❌");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Requests for Your Donations</h1>
      {message && <p className="text-red-600 text-center mb-4">{message}</p>}

      {requests.length === 0 ? (
        <p className="text-center">No requests for your donations yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="border p-4 rounded mb-6">
            <h2 className="font-semibold text-lg mb-2">
              Donation ID: {req.linkedDonation?._id}
            </h2>
            <p className="mb-2">
              Receiver: {req.userId?.name || "N/A"} ({req.userId?.email || "No email"})
            </p>
            <p className="mb-2">Status: {req.status}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {req.requestedFoods.map((food, idx) => (
                <div key={idx} className="border p-2 rounded flex flex-col items-center">
                  {food.photo && (
                    <img
                      src={`http://localhost:5000${food.photo}`}
                      alt={food.name}
                      className="w-32 h-32 object-cover rounded mb-2"
                    />
                  )}
                  <p className="font-medium">{food.name}</p>
                  <p>
                    Quantity: {food.quantity} {food.unit}
                  </p>
                  <p>Expires in: {food.expiryDuration} hours</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
