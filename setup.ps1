# FoodBridge Setup Script
# Run this script to set up the project automatically

Write-Host "🍔 FoodBridge Setup Script" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js v16+ first." -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host ""
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoService -and $mongoService.Status -eq 'Running') {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB service not running. Attempting to start..." -ForegroundColor Yellow
        Start-Service -Name MongoDB -ErrorAction SilentlyContinue
        Write-Host "✅ MongoDB started" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  MongoDB service not found. Make sure MongoDB is installed and running." -ForegroundColor Yellow
    Write-Host "   You can start it manually with: mongod --dbpath=C:\data\db" -ForegroundColor Yellow
}

# Backend Setup
Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Cyan
Write-Host "-------------------" -ForegroundColor Cyan

Set-Location -Path "backend"

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Create .env file if it doesn't exist
if (Test-Path ".env") {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item -Path ".env.example" -Destination ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
}

# Create uploads directory
if (-not (Test-Path "uploads/verification")) {
    Write-Host "Creating uploads directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "uploads/verification" -Force | Out-Null
    Write-Host "✅ Uploads directory created" -ForegroundColor Green
}

Set-Location -Path ".."

# Frontend Setup
Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Cyan
Write-Host "--------------------" -ForegroundColor Cyan

Set-Location -Path "frontend"

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

Set-Location -Path ".."

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Seed the admin user:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run seed" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the backend server (in one terminal):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the frontend server (in another terminal):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open your browser and go to:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Login with admin credentials:" -ForegroundColor White
Write-Host "   Email: admin@foodbridge.local" -ForegroundColor Gray
Write-Host "   Password: Admin@12345" -ForegroundColor Gray
Write-Host ""
Write-Host "For more details, see SETUP.md" -ForegroundColor Yellow
Write-Host ""
