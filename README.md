# VedAstro - Astrological Consultation Platform

VedAstro is a comprehensive, full-stack platform designed to connect users with professional astrologers. It facilitates profile management, real-time consultation (chat/call), e-commerce capabilities for astrological remedies, and features a robust administrative dashboard for platform management.

## 🌟 Project Overview

The project is divided into two primary repositories/folders:
- **`vedastro`**: The Frontend Application
- **`vedastro-backend`**: The Backend API Server

---

## 💻 Frontend (`vedastro`)

The frontend is a modern web application built for speed, responsiveness, and a dynamic user experience.

### **Tech Stack**
- **Framework**: Next.js (App Router)
- **Library**: React 
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **API Communication**: Axios
- **Real-time**: Socket.io-client

### **Key Features**
- **Role-Based Interfaces**: Separate flows for Users, Astrologers, and Admins.
- **Dynamic Profiles**: Users and Astrologers can manage their profiles, upload avatars, and add specific details (like astrological charts, languages, skills).
- **Authentication**: OTP-based login system for smooth user onboarding.
- **E-Commerce Module**: Features a shopping cart, checkout form, and payment method selection for purchasing products/remedies.
- **Consultation Interface**: Real-time chat windows and consultation toolbar for active sessions.
- **Responsive Design**: Mobile-first components, interactive toolbars, and sheets for seamless access on all devices.

---

## ⚙️ Backend (`vedastro-backend`)

The backend is designed to handle API requests, manage real-time connections, and interact with the database efficiently.

### **Tech Stack**
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Real-time**: Socket.io
- **Architecture**: Modular approach (Routes, Controllers, Services, Models)

### **Key Features**
- **RESTful API**: Cleanly structured endpoints for users, auth, products, and consultations.
- **Real-time WebSockets**: Socket.io integration to manage live chat and status updates between Users and Astrologers.
- **Data Validation & Middleware**: Secures routes, verifies roles, and ensures data integrity before it reaches the database.
- **Scalable Structure**: Divided into `modules`, `routes`, `models`, and `services` to ensure code is maintainable.

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

### 1. Setup the Backend
Navigate to the backend directory, install dependencies, and start the development server.

```bash
cd vedastro-backend
npm install
npm run dev
```
*Note: The backend runs on `http://localhost:5000` by default. Ensure your environment variables (like MongoDB URI and JWT secrets) are properly configured in a `.env` file.*

### 2. Setup the Frontend
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the frontend development server.

```bash
cd vedastro
npm install
npm run dev
```
*Note: The frontend runs on `http://localhost:3000` by default.*

---

## 📂 Folder Structure Overview

```text
VedAstro/
├── vedastro/                     # Frontend Application
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   ├── components/           # Reusable UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API caller functions
│   │   ├── store/                # Zustand state stores
│   │   └── types/                # TypeScript definitions
│   └── public/                   # Static assets
│
└── vedastro-backend/             # Backend Application
    ├── src/
    │   ├── config/               # DB and environment configuration
    │   ├── middlewares/          # Auth and validation middlewares
    │   ├── models/               # Mongoose schemas
    │   ├── modules/              # Core business logic
    │   └── routes/               # Express API routes
    └── server.js                 # Entry point
```

---

## 🔒 License
Private Property. All Rights Reserved.
