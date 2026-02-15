# ⚡ Quick Start Guide

## Option 1: Automated Setup (Recommended)

Run the setup script:

```powershell
.\setup.ps1
```

Then follow the on-screen instructions.

## Option 2: Manual Setup

### Step 1: Create .env file

```powershell
cd backend
Copy-Item -Path ".env.example" -Destination ".env"
cd ..
```

### Step 2: Install Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

### Step 3: Seed Admin User

```powershell
cd backend
npm run seed
```

You should see: `✅ Admin user created successfully`

### Step 4: Start Backend (Terminal 1)

```powershell
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000 in development mode
```

### Step 5: Start Frontend (Terminal 2 - NEW WINDOW)

```powershell
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 6: Open Browser

Go to: **http://localhost:5173**

Login with:
- **Email**: `admin@foodbridge.local`
- **Password**: `Admin@12345`

## Troubleshooting

### MongoDB Not Running?

```powershell
# Start MongoDB service
net start MongoDB

# OR if not installed as service:
mongod --dbpath="C:\data\db"
```

### Port 5000 Already in Use?

```powershell
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Clear Everything and Start Fresh?

```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd ../frontend
Remove-Item -Recurse -Force node_modules
npm install
```

## What's Next?

1. ✅ Login as admin
2. ✅ Create a test user (Sign up)
3. ✅ Verify the user (Admin Dashboard → Users → Approve)
4. ✅ Test donation flow
5. ✅ Test receive flow
6. ✅ Create volunteer account and test delivery

## Need Help?

Check **SETUP.md** for detailed instructions and common issues.
