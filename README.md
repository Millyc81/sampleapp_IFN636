# 🍎 Diet Tracking App

A full-stack web application for tracking daily food intake, monitoring nutrition, and achieving health goals.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## ✨ Features

### Core Features
- **User Authentication** - Register, login, and JWT-based authentication
- **Food Database** - Searchable database of 45+ common foods with nutritional information
- **Meal Logging** - Log foods to Breakfast, Lunch, Dinner, or Snack categories
- **Nutrition Tracking** - Track calories, protein, carbs, and fat intake
- **Daily Dashboard** - Visual progress rings and macro-nutrient breakdown
- **Profile Management** - Update user information and preferences

### Technical Features
- 🔐 Secure JWT authentication
- 📱 Responsive design (mobile + desktop)
- 🗄️ MongoDB database with Docker
- 🚀 PM2 process management
- 🔄 CI/CD pipeline with GitHub Actions
- ☁️ AWS EC2 deployment ready

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime environment |
| Express.js | 4.x | Web framework |
| MongoDB | 6.0 | Database |
| Mongoose | 7.x | ODM for MongoDB |
| JWT | 9.x | Authentication |
| bcryptjs | 2.x | Password hashing |
| PM2 | Latest | Process management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| React Router DOM | 6.x | Routing |
| Axios | 1.x | HTTP client |
| Tailwind CSS | 3.x | Styling |
| Recharts | 2.x | Charts |

### DevOps
| Tool | Purpose |
|------|---------|
| GitHub Actions | CI/CD automation |
| Docker | MongoDB containerization |
| Nginx | Reverse proxy |
| AWS EC2 | Cloud hosting |


## 📋 Prerequisites

### Local Development
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB installed locally or Docker
- Git

### Production (AWS EC2)
- Ubuntu 22.04 or 24.04 instance
- Ports open: 22 (SSH), 80 (HTTP), 5001 (Backend API)
- Domain name (optional)

## 🚀 Installation

### 1. Clone the Repository
``git clone https://github.com/Millyc81/sampleapp_IFN636.git
cd sampleapp_IFN636``
### 2. Backend Setup
``
cd backend
npm install
cat > .env << 'EOF'
PORT=5001
MONGO_URI=mongodb://localhost:27017/diet-tracker
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
EOF``
### 3. Frontend Setup
``
cd ../frontend
npm install
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5001
EOF``
### 4. Start MongoDB
``
docker run -d \
  --name mongodb \
  --restart always \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:6.0``
5. Seed the Database
``
cd backend
node scripts/seedFoods.js
``

## Running The Application
``
cd backend
pm2 start server.js --name diet-tracker-backend
pm2 save
pm2 startup  # Copy and run the command it gives you
cd backend
pm2 start server.js --name diet-tracker-backend
pm2 save
pm2 startup  # Copy and run the command it gives you
cd frontend
npm run build
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx
``

