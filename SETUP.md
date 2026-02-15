# 🚀 FoodBridge Setup Guide

## Prerequisites Checklist

- ✅ Node.js v16+ installed
- ✅ MongoDB installed and running
- ✅ Git (optional)

## Step-by-Step Setup

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies (DONE ✅)
npm install

# Create .env file from example
Copy-Item -Path ".env.example" -Destination ".env"

# Edit .env file if needed (optional - defaults work for local development)
# You can use: notepad .env

# Start MongoDB (if not running)
# Option 1: If MongoDB is installed as Windows Service
net start MongoDB

# Option 2: If MongoDB is installed manually
# mongod --dbpath="C:\data\db"

# Seed admin user
npm run seed

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

### 2. Frontend Setup

```powershell
# Open a NEW terminal window
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on: **http://localhost:5173**

### 3. Access the Application

1. Open browser and go to: **http://localhost:5173**
2. Login with admin credentials:
   - **Email**: `admin@foodbridge.local`
   - **Password**: `Admin@12345`

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB service
net start MongoDB

# OR if MongoDB is not installed as service, run:
mongod --dbpath="C:\data\db"
```

### Issue 2: Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in backend/.env
# PORT=5001
```

### Issue 3: Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```powershell
# Delete node_modules and reinstall
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Same for frontend
cd ../frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue 4: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Ensure backend is running on port 5000
- Ensure frontend is running on port 5173
- Check `CLIENT_URL` in backend/.env matches frontend URL

### Issue 5: File Upload Error

**Error**: `ENOENT: no such file or directory, open 'uploads/verification/...'`

**Solution**:
```powershell
# Create uploads directory
cd backend
New-Item -ItemType Directory -Path "uploads/verification" -Force
```

## Testing the Application

### 1. Test Admin Login
1. Go to http://localhost:5173/login
2. Login with admin credentials
3. You should see the Admin Dashboard

### 2. Test User Signup
1. Click "Sign up here"
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123
   - Role: Select any role (e.g., NGO)
   - Upload a document (any image or PDF)
3. Click "Sign up"
4. You should be redirected to dashboard (with pending verification status)

### 3. Test User Verification (Admin)
1. Login as admin
2. Go to "Users" tab
3. You should see "Test User" in pending verification
4. Click "Approve" to verify the user
5. Logout and login as Test User to test verified features

### 4. Test Donation Flow
1. Login as verified user
2. Click "Donate Food"
3. Fill in donation details
4. Click on map to set location (or use "Use My Location")
5. Submit donation
6. Donation should appear in dashboard

### 5. Test Receive Flow
1. Create another verified user account
2. Login with new user
3. Click "Receive Food"
4. You should see available donations
5. Click "Request Food" on any donation

### 6. Test Volunteer Flow
1. Create a volunteer account (no verification needed)
2. Accept a pickup request
3. Mark as completed

## Environment Variables Explained

### Backend (.env)

```env
# Server Configuration
NODE_ENV=development          # development | production
PORT=5000                     # Backend server port

# Database
MONGO_URI=mongodb://localhost:27017/foodbridge  # MongoDB connection string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRE=7d                 # Access token expiry
JWT_REFRESH_EXPIRE=30d        # Refresh token expiry

# Admin Credentials
ADMIN_EMAIL=admin@foodbridge.local
ADMIN_PASSWORD=Admin@12345

# URLs
CLIENT_URL=http://localhost:5173    # Frontend URL
SERVER_URL=http://localhost:5000    # Backend URL
```

## Project Structure

```
foodbridge/
├── backend/
│   ├── src/
│   │   ├── config/db.js              # MongoDB connection
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.js
│   │   │   ├── donationController.js
│   │   │   ├── volunteerController.js
│   │   │   └── adminController.js
│   │   ├── middleware/               # Auth, upload, etc.
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── models/                   # Database schemas
│   │   │   ├── User.js
│   │   │   └── Donation.js
│   │   ├── routes/                   # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── donationRoutes.js
│   │   │   ├── volunteerRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── scripts/seed.js           # Database seeding
│   │   ├── utils/generateToken.js    # JWT utilities
│   │   └── server.js                 # Entry point
│   ├── uploads/                      # Uploaded files
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Example env file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── LocationPicker.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── Donate/
│   │   │   │   └── DonatePage.jsx
│   │   │   ├── Receive/
│   │   │   │   └── ReceivePage.jsx
│   │   │   ├── Volunteer/
│   │   │   │   └── VolunteerDashboard.jsx
│   │   │   ├── Admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── History/
│   │   │       └── HistoryPage.jsx
│   │   ├── store/                    # Redux state management
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── donationSlice.js
│   │   │       └── notificationSlice.js
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── README.md                         # Project documentation
└── SETUP.md                          # This file
```

## Quick Commands Reference

### Backend
```powershell
npm run dev      # Start development server
npm run seed     # Seed admin user
npm start        # Start production server
```

### Frontend
```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Next Steps

1. ✅ Complete setup following steps above
2. ✅ Test all user flows
3. 🔧 Customize as needed
4. 🚀 Deploy to production (optional)

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in .env
2. Change JWT secrets to strong random strings
3. Use MongoDB Atlas for database
4. Deploy to Heroku, Railway, or DigitalOcean

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to Vercel, Netlify, or any static host
3. Update `VITE_API_URL` to point to production backend

## Support

If you encounter any issues:
1. Check this guide first
2. Review error messages carefully
3. Check MongoDB is running
4. Ensure all dependencies are installed
5. Verify .env file is configured correctly

---

**Happy Coding! 🎉**
