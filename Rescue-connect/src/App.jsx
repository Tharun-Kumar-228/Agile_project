// src/App.jsx
import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Dashboard from "./Dashboard";
import Donate from "./Donate";
import Receive from "./Recieve";
import DonateDashboard from "./DonateDashboard";
import './App.css';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🍲</span>
            <span>Rescue Connect</span>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="nav-item">Home</div>
            <div className="nav-item">How It Works</div>
            <div className="nav-item">Impact</div>
            <div className="nav-item">Get Involved</div>
            <div className="nav-item">Emergency Response</div>
            <div className="nav-item">Contact</div>
          </div>
          
          <div className="nav-buttons">
            {/* changed buttons to Link */}
            <Link to="/login">
              <button className="btn-login">Login</button>
            </Link>
            <Link to="/signup">
              <button className="btn-signup">Sign Up</button>
            </Link>
          </div>
          
          <div 
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Rescue Food. Feed People.</h1>
          <p>Connecting surplus food with those who need it most through our intelligent matching platform</p>
          <div className="hero-buttons">
            <button className="btn-donate">Donate Food</button>
            <button className="btn-volunteer">Volunteer</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="food-donation-card">
            <div className="card-header">
              <span className="location-pin">📍</span>
              <span>Fresh Bakery, Downtown</span>
            </div>
            <div className="card-content">
              <h3>50+ pastries available</h3>
              <p>Prepared 2 hours ago • Feeds 25+ people</p>
            </div>
            <div className="card-actions">
              <button>Claim for Distribution</button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Report Surplus</h3>
            <p>Donors post available food with details on type, quantity, and pickup location</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Smart Matching</h3>
            <p>Our algorithm matches food with nearby NGOs and volunteers in seconds</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Efficient Logistics</h3>
            <p>Volunteers receive optimized routes for pickup and delivery</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Feed Communities</h3>
            <p>Food reaches those in need quickly, reducing waste and hunger</p>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="impact">
        <h2>Our Impact</h2>
        <div className="stats">
          <div className="stat">
            <h3>125,890</h3>
            <p>Meals Delivered</p>
          </div>
          <div className="stat">
            <h3>56,200</h3>
            <p>Lbs of Food Saved</p>
          </div>
          <div className="stat">
            <h3>2,450</h3>
            <p>Active Volunteers</p>
          </div>
          <div className="stat">
            <h3>320</h3>
            <p>Partner Organizations</p>
          </div>
        </div>
      </section>

      {/* Emergency Response Section */}
      <section className="emergency-mode">
        <div className="emergency-content">
          <h2>Emergency Response Mode</h2>
          <p>During disasters, our platform shifts to coordinate bulk food relief efforts, ensuring equitable distribution when it's needed most</p>
          <button className="btn-emergency">Learn About Emergency Response</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FoodRescue</h3>
            <p>Connecting surplus food with hunger since 2023</p>
          </div>
          <div className="footer-section">
            <h4>Get Involved</h4>
            <p>Donate Food</p>
            <p>Volunteer</p>
            <p>Partner With Us</p>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <p>How It Works</p>
            <p>FAQ</p>
            <p>Blog</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>info@foodrescue.org</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 FoodRescue. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// main App component with routing
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/receive" element={<Receive />} />
      <Route path="/donate-dashboard" element={<DonateDashboard />} />
    </Routes>
  );
}
