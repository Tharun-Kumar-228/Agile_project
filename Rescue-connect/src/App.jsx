import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Dashboard from "./Dashboard";
import Donate from "./components/DonatePage/DonationPage";
import Receive from "./Recieve";
import DonateDashboard from "./DonateDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";
import PublicDashboard from "./PublicDashboard";
import './App.css';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className={`navbar ${scrollPosition > 50 ? 'scrolled' : ''}`}>
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
        <div className="hero-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1>Rescue Food. <span className="gradient-text">Feed People.</span></h1>
            <p>Connecting surplus food with those who need it most through our intelligent matching platform</p>
            <div className="hero-buttons">
              <button className="btn-donate">
                <i className="fas fa-utensils"></i>
                Donate Food
              </button>
              <button className="btn-volunteer">
                <i className="fas fa-hands-helping"></i>
                Volunteer
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="main-card">
              <div className="card-header">
                <span className="location-pin">📍</span>
                <span>Fresh Bakery, Downtown</span>
                <span className="live-badge">Live</span>
              </div>
              <div className="card-content">
                <h3>50+ pastries available</h3>
                <div className="food-details">
                  <span><i className="fas fa-clock"></i> Prepared 2 hours ago</span>
                  <span><i className="fas fa-users"></i> Feeds 25+ people</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '75%'}}></div>
                </div>
                <p>75% claimed</p>
              </div>
              <div className="card-actions">
                <button>Claim for Distribution</button>
              </div>
            </div>
            
            <div className="floating-card card-1">
              <div className="floating-content">
                <i className="fas fa-bread-slice"></i>
                <span>Bakery Items</span>
              </div>
            </div>
            
            <div className="floating-card card-2">
              <div className="floating-content">
                <i className="fas fa-apple-alt"></i>
                <span>Fresh Produce</span>
              </div>
            </div>
            
            <div className="floating-card card-3">
              <div className="floating-content">
                <i className="fas fa-egg"></i>
                <span>Perishables</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Our seamless process from donation to delivery</p>
        </div>
        
        <div className="steps">
          <div className="step">
            <div className="step-visual">
              <div className="step-number">1</div>
              <div className="step-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
            </div>
            <h3>Report Surplus</h3>
            <p>Donors post available food with details on type, quantity, and pickup location</p>
          </div>
          
          <div className="step">
            <div className="step-visual">
              <div className="step-number">2</div>
              <div className="step-icon">
                <i className="fas fa-project-diagram"></i>
              </div>
            </div>
            <h3>Smart Matching</h3>
            <p>Our algorithm matches food with nearby NGOs and volunteers in seconds</p>
          </div>
          
          <div className="step">
            <div className="step-visual">
              <div className="step-number">3</div>
              <div className="step-icon">
                <i className="fas fa-route"></i>
              </div>
            </div>
            <h3>Efficient Logistics</h3>
            <p>Volunteers receive optimized routes for pickup and delivery</p>
          </div>
          
          <div className="step">
            <div className="step-visual">
              <div className="step-number">4</div>
              <div className="step-icon">
                <i className="fas fa-heart"></i>
              </div>
            </div>
            <h3>Feed Communities</h3>
            <p>Food reaches those in need quickly, reducing waste and hunger</p>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="impact">
        <div className="impact-background">
          <div className="impact-overlay"></div>
        </div>
        
        <div className="section-header">
          <h2>Our Impact</h2>
          <p>Making a difference one meal at a time</p>
        </div>
        
        <div className="stats">
          <div className="stat">
            <div className="stat-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <h3 data-count="125890">0</h3>
            <p>Meals Delivered</p>
          </div>
          
          <div className="stat">
            <div className="stat-icon">
              <i className="fas fa-weight-hanging"></i>
            </div>
            <h3 data-count="56200">0</h3>
            <p>Lbs of Food Saved</p>
          </div>
          
          <div className="stat">
            <div className="stat-icon">
              <i className="fas fa-hands-helping"></i>
            </div>
            <h3 data-count="2450">0</h3>
            <p>Active Volunteers</p>
          </div>
          
          <div className="stat">
            <div className="stat-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <h3 data-count="320">0</h3>
            <p>Partner Organizations</p>
          </div>
        </div>
      </section>

      {/* Emergency Response Section */}
      <section className="emergency-mode">
        <div className="emergency-content">
          <div className="emergency-alert">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Emergency Response Mode</span>
          </div>
          
          <h2>Rapid Response When Disaster Strikes</h2>
          <p>During disasters, our platform shifts to coordinate bulk food relief efforts, ensuring equitable distribution when it's needed most</p>
          
          <div className="emergency-features">
            <div className="emergency-feature">
              <i className="fas fa-bolt"></i>
              <h4>Rapid Deployment</h4>
              <p>Activate emergency protocols within minutes</p>
            </div>
            
            <div className="emergency-feature">
              <i className="fas fa-map-marked-alt"></i>
              <h4>Real-time Tracking</h4>
              <p>Monitor food distribution in affected areas</p>
            </div>
            
            <div className="emergency-feature">
              <i className="fas fa-users-cog"></i>
              <h4>Coordinated Efforts</h4>
              <p>Connect organizations for maximum impact</p>
            </div>
          </div>
          
          <button className="btn-emergency">
            <i className="fas fa-info-circle"></i>
            Learn About Emergency Response
          </button>
        </div>
        
        <div className="emergency-visual">
          <div className="radar-animation">
            <div className="radar-circle"></div>
            <div className="radar-sweep"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🍲</span>
              <span>Rescue Connect</span>
            </div>
            <p>Connecting surplus food with hunger since 2023</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Get Involved</h4>
            <ul>
              <li><a href="#">Donate Food</a></li>
              <li><a href="#">Volunteer</a></li>
              <li><a href="#">Partner With Us</a></li>
              <li><a href="#">Organize a Drive</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Success Stories</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li><i className="fas fa-envelope"></i> info@foodrescue.org</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-map-marker-alt"></i> 123 Care Avenue, Compassion City</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2023 Rescue Connect. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main App component with routing
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
       <Route path="/dashboard" element={<DonateDashboard />} /> {/* General User */}
      <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/public-dashboard" element={<PublicDashboard />} />
    </Routes>
  );
}