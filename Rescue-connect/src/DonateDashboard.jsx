import React, { useState, useEffect } from "react";

export default function DonateDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

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

  // Filter donations based on active tab
  const filteredDonations = donations.filter(donation => {
    if (activeTab === "all") return true;
    return donation.status.toLowerCase() === activeTab;
  });

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "status-badge completed";
      case "pending": return "status-badge pending";
      case "expired": return "status-badge expired";
      case "in-progress": return "status-badge in-progress";
      default: return "status-badge";
    }
  };

  if (loading) return (
    <div className="donate-dashboard loading">
      <div className="spinner"></div>
      <p>Loading your donations...</p>
    </div>
  );

  if (!donations.length) return (
    <div className="donate-dashboard empty-state">
      <div className="empty-icon">📤</div>
      <h2>No donations yet</h2>
      <p>Your donation history will appear here once you make your first contribution.</p>
      <button className="cta-button">Make a Donation</button>
    </div>
  );

  return (
    <div className="donate-dashboard">
      <header className="dashboard-header">
        <h1>My Donations</h1>
        <p>Track and manage your food donations</p>
      </header>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === "all" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("all")}
        >
          All Donations
        </button>
        <button 
          className={activeTab === "pending" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button 
          className={activeTab === "in-progress" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("in-progress")}
        >
          In Progress
        </button>
        <button 
          className={activeTab === "completed" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>

      <div className="donations-container">
        {filteredDonations.length === 0 ? (
          <div className="no-results">
            <p>No {activeTab !== "all" ? activeTab : ""} donations found.</p>
          </div>
        ) : (
          filteredDonations.map((donation) => (
            <div key={donation._id} className="donation-card">
              <div className="card-header">
                <div className="donation-info">
                  <h3>Donation #{donation._id.slice(-6).toUpperCase()}</h3>
                  <span className={getStatusClass(donation.status)}>
                    {donation.status}
                  </span>
                </div>
                <div className="donation-meta">
                  <span className="date">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </span>
                  <span className="location">
                    📍 {donation.location.lat.toFixed(4)}, {donation.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="foods-grid">
                {donation.foods.map((food, idx) => (
                  <div key={idx} className="food-item">
                    <div className="food-details">
                      <h4>{food.name}</h4>
                      <div className="food-meta">
                        <span className="quantity">
                          {food.quantity} {food.unit}
                        </span>
                        <span className="expiry">
                          ⏱️ {food.expiryDuration} hours
                        </span>
                      </div>
                      <div className="countdown">
                        {getCountdown(donation.createdAt, food.expiryDuration)}
                      </div>
                      <span className="food-status">
                        {food.status}
                      </span>
                    </div>
                    {food.photo && (
                      <div className="food-image">
                        <img
                          src={`http://localhost:5000/${food.photo}`}
                          alt={food.name}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .donate-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #333;
        }
        
        .dashboard-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .dashboard-header p {
          font-size: 1.1rem;
          color: #718096;
        }
        
        .dashboard-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 1px;
        }
        
        .tab {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          font-weight: 500;
          color: #718096;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .tab:hover {
          color: #4299e1;
        }
        
        .tab.active {
          color: #4299e1;
          font-weight: 600;
        }
        
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background-color: #4299e1;
          border-radius: 3px 3px 0 0;
        }
        
        .donations-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .donation-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .donation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid #edf2f7;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .donation-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .donation-info h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }
        
        .status-badge {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-block;
          width: fit-content;
        }
        
        .status-badge.pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .status-badge.completed {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .status-badge.expired {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        
        .status-badge.in-progress {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .donation-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        
        .date, .location {
          font-size: 0.9rem;
          color: #718096;
        }
        
        .foods-grid {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        
        .food-item {
          display: flex;
          justify-content: space-between;
          padding: 1.25rem;
          background-color: #f8fafc;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }
        
        .food-item:hover {
          background-color: #edf2f7;
        }
        
        .food-details {
          flex: 1;
        }
        
        .food-details h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.75rem 0;
        }
        
        .food-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .quantity, .expiry {
          font-size: 0.9rem;
          color: #4a5568;
        }
        
        .countdown {
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }
        
        .food-status {
          font-size: 0.85rem;
          padding: 0.25rem 0.5rem;
          background-color: #edf2f7;
          border-radius: 4px;
          color: #4a5568;
        }
        
        .food-image {
          margin-left: 1rem;
        }
        
        .food-image img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .loading, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }
        
        .empty-state h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }
        
        .empty-state p {
          font-size: 1.1rem;
          color: #718096;
          max-width: 500px;
          margin-bottom: 2rem;
        }
        
        .cta-button {
          padding: 0.875rem 1.75rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .cta-button:hover {
          background-color: #3182ce;
        }
        
        .no-results {
          text-align: center;
          padding: 3rem;
          color: #718096;
          font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
          .donate-dashboard {
            padding: 1.5rem 1rem;
          }
          
          .dashboard-header h1 {
            font-size: 2rem;
          }
          
          .dashboard-tabs {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .tab {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
          
          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .donation-meta {
            align-items: flex-start;
          }
          
          .foods-grid {
            grid-template-columns: 1fr;
          }
          
          .food-item {
            flex-direction: column;
          }
          
          .food-image {
            margin: 1rem 0 0 0;
            align-self: center;
          }
        }
      `}</style>
    </div>
  );
}