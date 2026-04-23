# Toronto Riders - Car Rental Platform

A full-stack car rental application with a modern frontend and RESTful API backend.

## 🚀 Features

### Frontend
- **User Authentication**: Sign up and sign in for customers and business users
- **Vehicle Browsing**: Filter and search vehicles by category, price, make, and features
- **Booking System**: Complete booking flow with date selection, add-ons, and pricing
- **Customer Portal**: View and manage rental bookings
- **Business Dashboard**: Manage vehicles, view bookings, and analytics
- **Responsive Design**: Mobile-friendly interface

### Backend
- **RESTful API**: Built with Node.js and Express
- **MongoDB Database**: Scalable NoSQL database for data persistence
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Customer and business user roles
- **Booking Management**: Availability checking and conflict prevention
- **Data Validation**: Input validation and error handling

## 📁 Project Structure

```
TorontoRiders.ca/
├── backend/                  # Backend API
│   ├── models/              # MongoDB models
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   └── Booking.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── vehicles.js
│   │   └── bookings.js
│   ├── middleware/          # Express middleware
│   │   └── auth.js
│   ├── server.js           # Express app setup
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── api-client.js           # Frontend API integration
├── script.js               # Frontend JavaScript
├── styles.css              # Styling
├── index.html              # Home page
├── cars.html               # Vehicle listing
├── car_details.html        # Vehicle details
├── booking.html            # Booking form
├── checkout.html           # Order summary
├── my_rentals.html         # Customer bookings
├── business_rentals.html   # Business bookings
├── admin.html              # Business dashboard
├── sign_in.html            # Sign in page
├── sign_up.html            # Sign up page
├── company.html            # About page
├── setup.sh                # Setup script
├── INTEGRATION_GUIDE.md    # Frontend integration guide
└── README.md               # This file
```

## 🛠️ Installation

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn**

### Quick Start

1. **Clone or navigate to the repository**:
```bash
cd /Users/michaelhbeishi/TorontoRiders.ca
```

2. **Run the setup script**:
```bash
./setup.sh
```

3. **Configure environment variables**:
```bash
cd backend
nano .env  # or use your preferred editor
```

Update the following:
```env
MONGODB_URI=mongodb://localhost:27017/torontoriders
JWT_SECRET=your_secure_random_secret_key_here
```

4. **Start MongoDB**:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

5. **Start the backend server**:
```bash
cd backend
npm run dev
```

The API will be running at `http://localhost:5000`

6. **Open the frontend**:

Simply open `index.html` in your browser, or use a local server:
```bash
# Using Python
python -m http.server 3000

# Using Node.js http-server
npx http-server -p 3000
```

Then navigate to `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env` with:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/torontoriders

# Authentication
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=30d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend API Configuration

Edit `api-client.js` if your backend runs on a different port:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📖 API Documentation

Full API documentation is available in `backend/README.md`.

### Quick Reference

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user

#### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle (business)
- `PUT /api/vehicles/:id` - Update vehicle (business)
- `DELETE /api/vehicles/:id` - Delete vehicle (business)

#### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/check-availability` - Check availability
- `PUT /api/bookings/:id/status` - Update status
- `DELETE /api/bookings/:id` - Cancel booking

## 🔗 Frontend Integration

The frontend can use either:

1. **Backend API** (recommended for production)
   - Real-time data synchronization
   - Secure authentication
   - Persistent data storage

2. **localStorage** (current fallback)
   - Offline functionality
   - No server required
   - Data stored locally

See `INTEGRATION_GUIDE.md` for detailed integration instructions.

## 👥 User Roles

### Customer
- Browse and search vehicles
- Make bookings
- View and manage their rentals
- Update profile

### Business
- Add and manage vehicles
- View bookings for their vehicles
- Access admin dashboard
- Update business profile

## 🧪 Testing

### Test the API

Using curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullname":"Test User","email":"test@example.com","phone":"4165550123","password":"password123","accountType":"customer"}'

# Get vehicles
curl http://localhost:5000/api/vehicles
```

### Test the Frontend

1. Create a customer account
2. Browse vehicles on the cars page
3. Select a vehicle and make a booking
4. View bookings in My Rentals

For business testing:
1. Create a business account
2. Add a vehicle in Admin Panel
3. View bookings for your vehicles

## 🚀 Deployment

### Backend Deployment

**Recommended platforms:**
- [Heroku](https://www.heroku.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [DigitalOcean](https://www.digitalocean.com/)

**MongoDB hosting:**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

**Steps:**
1. Set up MongoDB Atlas cluster
2. Update `MONGODB_URI` in production environment
3. Set secure `JWT_SECRET`
4. Deploy backend to your platform
5. Update `FRONTEND_URL` for CORS

### Frontend Deployment

**Recommended platforms:**
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

**Steps:**
1. Update `API_BASE_URL` in `api-client.js` to production backend URL
2. Deploy static files to hosting platform

## 📝 Development

### Running in Development Mode

Backend with auto-reload:
```bash
cd backend
npm run dev
```

Frontend with live reload (using http-server):
```bash
npx http-server -p 3000
```

### Making Changes

1. **Backend changes**: Server auto-reloads with nodemon
2. **Frontend changes**: Refresh browser to see changes
3. **API changes**: Update `api-client.js` if endpoints change

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS Errors

Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL.

### Authentication Issues

Check that:
- JWT_SECRET is set in backend .env
- Token is being stored in localStorage
- Authorization header is included in requests

## 📄 License

MIT

## 👤 Author

Toronto Riders Team

## 🙏 Acknowledgments

- Vehicle data structure inspired by industry standards
- UI design follows modern web best practices
- Security implementations based on OWASP guidelines
