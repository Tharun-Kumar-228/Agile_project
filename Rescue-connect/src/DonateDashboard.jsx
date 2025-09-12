import React, { useState, useEffect } from "react";

export default function DonateDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user donations
  useEffect(() => {
    const fetchDonations = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/user-donations/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setDonations(data.donations);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Countdown in hours/minutes
  const getCountdown = (createdAt, expiryHours) => {
    const now = new Date();
    const expiryTime = new Date(createdAt);
    expiryTime.setHours(expiryTime.getHours() + Number(expiryHours));

    const diffMs = expiryTime - now;
    if (diffMs <= 0) return "Expired";

    const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMin = Math.floor((diffMs / 1000 / 60) % 60);

    return `${diffHrs}h ${diffMin}m left`;
  };

  if (loading) return <p>Loading donations...</p>;

  if (!donations.length) return <p>No donations made yet.</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">My Donations</h1>

      {donations.map((donation) => (
        <div
          key={donation._id}
          className="border rounded-lg shadow-md p-4 mb-6 bg-white hover:shadow-xl transition-shadow"
        >
          <p className="font-semibold mb-2">
            Donation ID: {donation._id} | Status: {donation.status}
          </p>
          <p className="mb-2 text-sm text-gray-600">
            Location: Lat {donation.location.lat}, Lng {donation.location.lng}
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Created At: {new Date(donation.createdAt).toLocaleString()}
          </p>

          <h3 className="font-bold mb-2">Foods:</h3>
          <div className="grid gap-4">
            {donation.foods.map((food, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold">{food.name}</p>
                  <p className="text-sm">
                    Quantity: {food.quantity} {food.unit}
                  </p>
                  <p className="text-sm">Expiry: {food.expiryDuration} hrs</p>
                  <p className="text-sm">
                    Countdown: {getCountdown(donation.createdAt, food.expiryDuration)}
                  </p>
                  <p className="text-sm">Status: {food.status}</p>
                </div>
                {food.photo && (
                  <img
                    src={`http://localhost:5000/${food.photo}`}
                    alt={food.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
