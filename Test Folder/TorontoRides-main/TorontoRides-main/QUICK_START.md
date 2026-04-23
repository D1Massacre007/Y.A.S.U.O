# Toronto Riders Backend - Quick Start Guide

## ✅ What's Been Created

A complete backend API for Toronto Riders car rental platform with:

### Backend Structure
```
backend/
├── models/
│   ├── User.js          # User authentication & profiles
│   ├── Vehicle.js       # Vehicle inventory management
│   └── Booking.js       # Booking system with availability checking
├── routes/
│   ├── auth.js          # Sign up, sign in endpoints
│   ├── users.js         # User profile management
│   ├── vehicles.js      # Vehicle CRUD operations
│   └── bookings.js      # Booking management
├── middleware/
│   └── auth.js          # JWT authentication & authorization
├── server.js            # Express server setup
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── README.md            # Full API documentation
```

### Frontend Integration
- `api-client.js` - Ready-to-use API client library
- `INTEGRATION_GUIDE.md` - Step-by-step integration instructions
- `api-test.html` - Interactive API testing interface

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
- `JWT_SECRET` to a secure random string
- `MONGODB_URI` if using remote MongoDB

### Step 3: Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 4: Start Backend
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚗 Toronto Riders API server running on port 5000
📍 Environment: development
```

### Step 5: Test the API
Open `api-test.html` in your browser to test all endpoints!

## 📋 API Endpoints Summary

### Public Endpoints (No Auth Required)
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `GET /api/vehicles` - Browse vehicles
- `GET /api/vehicles/:id` - View vehicle details
- `POST /api/bookings/check-availability` - Check dates

### Protected Endpoints (Requires Token)
- `GET /api/users/me` - Get profile
- `PUT /api/users/me` - Update profile
- `GET /api/bookings` - Get my bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id` - Cancel booking

### Business Only Endpoints
- `POST /api/vehicles` - Add vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Remove vehicle
- `GET /api/vehicles/business/my-vehicles` - My vehicles

## 🔧 Frontend Integration

### Option 1: Quick Test (No Integration)
Use `api-test.html` to interact with the API directly.

### Option 2: Full Integration (Recommended)

1. Add to your HTML pages:
```html
<script src="api-client.js"></script>
<script src="script.js"></script>
```

2. Replace localStorage code with API calls:
```javascript
// OLD: Sign up with localStorage
localStorage.setItem('torontoriders_users', JSON.stringify(users));

// NEW: Sign up with API
const response = await TorontoRidersAPI.auth.signup({
    fullname, email, phone, password, accountType
});
```

3. See `INTEGRATION_GUIDE.md` for detailed examples!

## 🎯 Key Features

### 1. Authentication
- Secure JWT token-based auth
- Password hashing with bcrypt
- Role-based access (customer/business)

### 2. Vehicle Management
- Full CRUD operations
- Advanced filtering (category, price, make, etc.)
- Business ownership tracking

### 3. Booking System
- Availability checking
- Conflict prevention
- Status tracking (pending → confirmed → active → completed)
- Cancel bookings

### 4. Data Validation
- Email format validation
- Date range validation
- Required field checks
- Type checking

### 5. Security
- Helmet.js security headers
- CORS protection
- JWT token verification
- Password hashing
- Input sanitization

## 📊 Database Schema

### Users Collection
```javascript
{
  fullname: "John Doe",
  email: "john@example.com",
  phone: "(416) 555-0123",
  password: "hashed_password",
  accountType: "customer",  // or "business"
  businessname: "Doe Rentals",  // for business accounts
  isActive: true,
  createdAt: ISODate("2025-12-03"),
  lastLogin: ISODate("2025-12-03")
}
```

### Vehicles Collection
```javascript
{
  id: "tesla-model-3-2024",
  name: "Tesla Model 3",
  make: "Tesla",
  model: "Model 3",
  year: 2024,
  category: "electric",
  transmission: "automatic",
  seats: 5,
  pricePerDay: 89,
  image: "images/tesla.jpg",
  features: ["Autopilot", "Premium Audio"],
  isAvailable: true,
  businessOwner: ObjectId("..."),  // if business-owned
  businessEmail: "business@example.com",
  fuelType: "electric"
}
```

### Bookings Collection
```javascript
{
  id: "booking_1733259600000",
  user: ObjectId("..."),
  vehicle: ObjectId("..."),
  vehicleDetails: { id, name, make, model, pricePerDay },
  pickupDate: ISODate("2025-12-10"),
  pickupTime: "10:00",
  pickupLocation: "downtown",
  returnDate: ISODate("2025-12-15"),
  returnTime: "10:00",
  returnLocation: "downtown",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "(416) 555-0123",
  licenseNumber: "D1234567",
  addOns: { gps: true, insurance: true, childSeat: false, extraDriver: false },
  pricing: { subtotal: 445, addOnsTotal: 100, taxes: 70.85, total: 615.85 },
  status: "confirmed",
  bookingDate: ISODate("2025-12-03")
}
```

## 🧪 Testing Examples

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname":"Test User",
    "email":"test@example.com",
    "phone":"4165550123",
    "password":"password123",
    "accountType":"customer"
  }'

# Get vehicles
curl http://localhost:5000/api/vehicles

# Get filtered vehicles
curl "http://localhost:5000/api/vehicles?category=sedan&maxPrice=100"
```

### Using the API Client
```javascript
// Sign up
const response = await TorontoRidersAPI.auth.signup({
    fullname: "Test User",
    email: "test@example.com",
    phone: "(416) 555-0123",
    password: "password123",
    accountType: "customer"
});

// Get vehicles
const vehicles = await TorontoRidersAPI.vehicle.getAll({
    category: "sedan",
    maxPrice: 100
});

// Create booking
const booking = await TorontoRidersAPI.booking.create({
    vehicleId: "tesla-model-3-2024",
    pickupDate: "2025-12-10",
    // ... other booking data
});
```

## 🐛 Common Issues

### "MongoDB connection error"
- Make sure MongoDB is running: `brew services start mongodb-community`
- Check `MONGODB_URI` in `.env`

### "Port 5000 is already in use"
- Kill the process: `lsof -ti:5000 | xargs kill -9`
- Or change `PORT` in `.env`

### "JWT must be provided"
- You need to sign in first to get a token
- Protected endpoints require authentication

### CORS errors
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Make sure backend is running

## 📚 Next Steps

1. **Test the API**: Open `api-test.html` and try all endpoints
2. **Read Full Docs**: Check `backend/README.md` for detailed API docs
3. **Integrate Frontend**: Follow `INTEGRATION_GUIDE.md`
4. **Deploy**: See main `README.md` for deployment instructions

## 🎉 You're Ready!

Your backend is fully functional and ready to use. Start with `api-test.html` to verify everything works, then integrate with your frontend using `api-client.js`.

**Need help?** Check the documentation files:
- `backend/README.md` - Complete API reference
- `INTEGRATION_GUIDE.md` - Frontend integration steps
- `README.md` - Project overview and deployment

Happy coding! 🚗💨
