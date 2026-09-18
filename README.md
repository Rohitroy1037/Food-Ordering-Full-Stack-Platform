# 🍲 RasoiMitra (रसोई मित्र) — Full-Stack Food Ordering & Real-Time Delivery Tracking Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-purple.svg)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.2-764ABC.svg)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-green.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A modern, high-performance, full-stack food delivery web application built with **React**, **Redux Toolkit**, **Tailwind CSS**, and an autonomous, self-contained **Node.js/Express** backend. RasoiMitra connects food lovers with 22+ partner restaurants, 70+ authentic regional dishes, dynamic food-level search, multiple payment gateways, and real-time live GPS order tracking.

---

## 🌟 Key Features

### 1. 🛵 Live Order Tracking System
- **Animated GPS Route Map**: Interactive vector-styled street map showcasing restaurant origin pin (🏪), customer destination (🏠) with pulsating radar wave, and a smoothly moving delivery scooter (`🛵`).
- **4-Stage Order Stepper**:
  1. `Order Confirmed & Received`
  2. `Chef is Preparing Your Food 🍳`
  3. `Out for Delivery & On The Way 🛵`
  4. `Delivered 🎉`
- **Dynamic ETA Countdown**: Real-time minute countdown calculated from order timestamp.
- **Delivery Partner Profile**: Shows rider photo, name, rating (4.9 ⭐), vehicle number, verified safety badges, direct "Call Rider" link, and quick doorstep instructions modal.
- **Demo GPS Simulator**: Instant-switch toolbar `[1. Confirmed] [2. Cooking 🍳] [3. On The Way 🛵] [4. Delivered 🎉]` to test and preview all tracking stages in real time.

### 2. 🔐 User Authentication (Sign In & Sign Up)
- **Interactive Auth Modal & Dedicated Pages**: Accessible globally across the app or via direct URLs (`/signin`, `/signup`).
- **1-Click Demo Login**: Pre-seeded demo account (`rohit@example.com` / `password123`) to log in instantly without typing credentials.
- **Redux & LocalStorage Persistence**: Login session stays active across browser refreshes.
- **Profile Dropdown Menu**: Accessible from header with saved addresses, quick link to active orders, and one-click sign out.

### 3. 💳 Multi-Option Payment Gateway & Checkout
- **UPI Payments**: Supports **Google Pay**, **PhonePe**, **Paytm**, **CRED UPI**, or custom UPI ID (`username@bank`).
- **Net Banking**: All top Indian banks (HDFC, SBI, ICICI, Axis, Kotak, PNB).
- **Cash on Delivery (COD)**: Option to pay with cash or doorstep QR code upon arrival.
- **Customer Autofill**: Automatically populates customer name, phone number, and address from the logged-in profile.

### 4. 🔍 Food-Level Discovery & Multi-Restaurant Search
- **Search by Dish or Cuisine**: Search for any food item (e.g. *Biryani, Butter Chicken, Dosa, Paneer Tikka*) and instantly see which restaurants have that specific dish available with live price and preview tags.
- **Filter by Food Type**: Pure Veg, Non-Veg, Ratings, Delivery Time, and Price.

### 5. 🛒 Persistent Redux Shopping Cart
- Grouped items with real-time `+` / `-` quantity controls and remove actions.
- Automatically synchronized with `localStorage` so items never disappear on page refresh.
- Accurate bill calculations (item subtotal, delivery fee waiver on orders over ₹300, platform fee, and grand total).

### 6. ⚡ 100% Self-Contained Local Backend
- No fragile third-party scrapers or broken external Swiggy APIs.
- Fast Express 5 REST API running on port `5000` with file-based JSON persistence (`backend/data/`).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, React Icons |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`), Context API |
| **Styling** | Tailwind CSS, Modern Glassmorphism, Micro-Animations |
| **Backend** | Node.js, Express 5, CORS, ES Modules |
| **Database** | Structured JSON Data Stores (`restaurants.json`, `menus.json`, `orders.json`, `users.json`) |
| **Dev Tools** | Git, Vite Dev Proxy, PowerShell, Postman / REST Client |

---

## 📁 Project Directory Structure

```text
RasoiMitra/
├── backend/
│   ├── data/
│   │   ├── about.json         # Developer profile & portfolio information
│   │   ├── menus.json         # 70+ dishes with verified images & prices
│   │   ├── messages.json      # Contact form inquiries
│   │   ├── orders.json        # Stored orders & delivery tracking states
│   │   ├── restaurants.json   # 22+ partner restaurant metadata
│   │   └── users.json         # Registered user accounts
│   ├── routes/
│   │   ├── aboutRoutes.js     # GET /api/about
│   │   ├── authRoutes.js      # POST /api/auth/signup, /signin, /users
│   │   ├── contactRoutes.js   # POST /api/contact
│   │   ├── menuRoutes.js      # GET /api/menu/:id
│   │   ├── orderRoutes.js     # POST /api/orders, GET /api/orders/:orderId, PATCH status
│   │   └── restaurantRoutes.js# GET /api/restaurants (search by food or restro)
│   └── server.js              # Express 5 server configuration & route mounting
├── src/
│   ├── api/                   # Local API client abstractions
│   ├── Components/
│   │   ├── Layout/
│   │   │   ├── AppLayout.jsx  # Global layout with Header, AuthModal, Footer, Redux Provider
│   │   │   ├── Header.jsx     # Navigation bar, user greeting, profile dropdown, cart count
│   │   │   └── Footer.jsx     # Responsive footer
│   │   ├── UI/
│   │   │   ├── AuthModal.jsx  # Sign In / Sign Up popup dialog with 1-click demo login
│   │   │   ├── Card.jsx       # Restaurant display cards with dish preview chips
│   │   │   └── Recipe.jsx     # Detailed restaurant menu viewer & item selector
│   │   └── utils/
│   │       ├── cartSlice.jsx  # Redux slice for cart management + localStorage sync
│   │       ├── userSlice.jsx  # Redux slice for authentication & user profile
│   │       └── contextApi.jsx # Festival theme context
│   ├── Pages/
│   │   ├── Home.jsx           # Landing hero, top offers & highlighted restaurants
│   │   ├── Foods.jsx          # Food catalog with search by food & restaurant
│   │   ├── Cart.jsx           # Cart management, checkout, UPI/NetBanking/COD payments
│   │   ├── TrackOrder.jsx     # Real-time GPS map, rider tracking, live ETA, status stepper
│   │   ├── AuthPage.jsx       # Dedicated /signin and /signup pages
│   │   ├── About.jsx          # Developer profile & background
│   │   └── Contact.jsx        # Contact form with backend persistence
│   ├── App.jsx                # React Router DOM configuration
│   ├── Store.jsx              # Redux Toolkit store combining cart & user reducers
│   ├── index.css              # Tailwind CSS imports & animations
│   └── main.jsx               # Application entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or above)
- [Git](https://git-scm.com/)

### 2. Clone Repository
```bash
git clone https://github.com/Rohitroy1037/Food-Ordering-Full-Stack-Platform.git
cd Food-Ordering-Full-Stack-Platform
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Application

You need both the Express backend and the Vite frontend running:

#### Terminal 1: Start Express Backend (Port 5000)
```bash
node backend/server.js
```
*Backend server runs on `http://localhost:5000`*

#### Terminal 2: Start Vite Dev Server (Port 5173)
```bash
npm run dev
```
*Frontend opens at `http://localhost:5173`*

---

## 🔑 Demo Account Credentials

You can test the application immediately using the pre-configured user credentials or click **"1-Click Login ✨"** in the Sign In modal:

- **Email**: `rohit@example.com`
- **Password**: `password123`
- **Name**: Rohit Roy
- **Address**: Flat 402, Green Avenue, Model Town

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Create a new user account (name, email, password, phone, address).
- `POST /api/auth/signin` — Authenticate user and return session profile.
- `GET /api/auth/users` — List registered users.

### Restaurants & Menus (`/api`)
- `GET /api/restaurants` — List all 22+ restaurants. Supports query `?search=dishOrRestro` for dish-level discovery.
- `GET /api/menu/:resId` — Fetch full menu categories and dish items for a restaurant.

### Orders & Tracking (`/api/orders`)
- `POST /api/orders` — Place a new order with items, delivery address, payment method, and assigned rider.
- `GET /api/orders/:orderId` — Fetch live order tracking state with calculated progress, ETA, and rider coordinates.
- `GET /api/orders/latest` — Fetch the most recently placed order.
- `PATCH /api/orders/:orderId/status` — Simulate stages `[1, 2, 3, 4]` for testing real-time movement.

---

## 👨‍💻 Developer & Author

**Rohit Roy**  
- **GitHub**: [@Rohitroy1037](https://github.com/Rohitroy1037)  
- **Project Repository**: [Food-Ordering-Full-Stack-Platform](https://github.com/Rohitroy1037/Food-Ordering-Full-Stack-Platform)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
