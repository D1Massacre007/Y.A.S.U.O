# Frontend Integration Guide

This guide explains how to integrate the Toronto Riders frontend with the backend API.

## Setup

1. Add the API client script to your HTML pages before `script.js`:

```html
<script src="api-client.js"></script>
<script src="script.js"></script>
```

2. The API client exposes a global `TorontoRidersAPI` object with methods for:
   - Authentication (`TorontoRidersAPI.auth`)
   - User management (`TorontoRidersAPI.user`)
   - Vehicle operations (`TorontoRidersAPI.vehicle`)
   - Booking operations (`TorontoRidersAPI.booking`)

## Authentication

### Sign Up

Replace the localStorage-based signup with API call:

```javascript
// OLD CODE (in script.js - handleSignUp function)
const newUser = {
    fullname, email, phone, password, accountType, businessname
};
allUsers.push(newUser);
localStorage.setItem('torontoriders_users', JSON.stringify(allUsers));

// NEW CODE
try {
    const response = await TorontoRidersAPI.auth.signup({
        fullname, email, phone, password, accountType, businessname
    });
    
    // User data is automatically stored in sessionStorage by API client
    alert('Account created successfully!');
    
    // Redirect based on account type
    if (accountType === 'business') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
} catch (error) {
    alert(error.message || 'Error creating account');
}
```

### Sign In

Replace the localStorage-based signin:

```javascript
// OLD CODE (in script.js - handleSignIn function)
const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
if (!user || user.password !== password) {
    alert('Invalid credentials');
    return;
}

// NEW CODE
try {
    const response = await TorontoRidersAPI.auth.signin({ email, password });
    
    // User data is automatically stored in sessionStorage by API client
    alert('Sign in successful! Welcome back, ' + response.data.user.fullname);
    
    // Redirect based on account type
    if (response.data.user.accountType === 'business') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
} catch (error) {
    alert(error.message || 'Invalid credentials');
}
```

### Logout

Replace sessionStorage removal:

```javascript
// OLD CODE
function handleLogout() {
    sessionStorage.removeItem('torontoriders_current_user');
    sessionStorage.removeItem('torontoriders_user');
    updateAuthUI();
    window.location.href = 'index.html';
}

// NEW CODE
function handleLogout() {
    TorontoRidersAPI.auth.logout();
    updateAuthUI();
    window.location.href = 'index.html';
}
```

## Vehicle Management

### Load Vehicles

Replace hardcoded vehicle data:

```javascript
// OLD CODE (in script.js)
let allCars = [ /* hardcoded array */ ];

// NEW CODE
let allCars = [];

async function loadVehicles() {
    try {
        const response = await TorontoRidersAPI.vehicle.getAll();
        allCars = response.data.vehicles;
        renderCars(); // Update UI
    } catch (error) {
        console.error('Error loading vehicles:', error);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
    loadVehicles();
    updateAuthUI();
});
```

### Filter Vehicles

Use API filtering:

```javascript
async function applyFilters() {
    try {
        const filters = {
            category: Array.from(filterState.categories).join(','),
            transmission: Array.from(filterState.transmissions).join(','),
            make: Array.from(filterState.makes).join(','),
            maxPrice: filterState.priceMax,
            search: filterState.search,
            available: true
        };
        
        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });
        
        const response = await TorontoRidersAPI.vehicle.getAll(filters);
        allCars = response.data.vehicles;
        renderCars();
    } catch (error) {
        console.error('Error filtering vehicles:', error);
    }
}
```

### Add Vehicle (Business Users)

In admin.html, replace localStorage save:

```javascript
// OLD CODE
async function handleAddVehicle(e) {
    e.preventDefault();
    const vehicleData = { /* collect form data */ };
    
    const businessVehicles = JSON.parse(localStorage.getItem('torontoriders_business_vehicles') || '[]');
    businessVehicles.push(vehicleData);
    localStorage.setItem('torontoriders_business_vehicles', JSON.stringify(businessVehicles));
}

// NEW CODE
async function handleAddVehicle(e) {
    e.preventDefault();
    
    const vehicleData = {
        id: `vehicle_${Date.now()}`,
        name: document.getElementById('vehicleName').value,
        make: document.getElementById('vehicleMake').value,
        model: document.getElementById('vehicleModel').value,
        year: parseInt(document.getElementById('vehicleYear').value),
        category: document.getElementById('vehicleCategory').value,
        transmission: document.getElementById('vehicleTransmission').value,
        seats: parseInt(document.getElementById('vehicleSeats').value),
        pricePerDay: parseFloat(document.getElementById('vehiclePrice').value),
        image: document.getElementById('vehicleImage').value,
        features: document.getElementById('vehicleFeatures').value.split(',').map(f => f.trim()),
        fuelType: document.getElementById('vehicleFuel').value
    };
    
    try {
        const response = await TorontoRidersAPI.vehicle.create(vehicleData);
        alert('Vehicle added successfully!');
        loadBusinessVehicles(); // Reload list
    } catch (error) {
        alert(error.message || 'Error adding vehicle');
    }
}
```

## Booking Management

### Create Booking

Replace localStorage booking save:

```javascript
// In checkout.html - form submission
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const bookingData = {
        vehicleId: selectedVehicle.id,
        pickupDate: document.getElementById('pickupDate').value,
        pickupTime: document.getElementById('pickupTime').value,
        pickupLocation: document.getElementById('pickupLocation').value,
        returnDate: document.getElementById('returnDate').value,
        returnTime: document.getElementById('returnTime').value,
        returnLocation: document.getElementById('returnLocation').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        addOns: {
            gps: document.getElementById('gps').checked,
            insurance: document.getElementById('insurance').checked,
            childSeat: document.getElementById('childSeat').checked,
            extraDriver: document.getElementById('extraDriver').checked
        },
        pricing: {
            subtotal: parseFloat(document.getElementById('summarySubtotal').textContent.replace('$', '')),
            addOnsTotal: parseFloat(document.getElementById('summaryAddOns').textContent.replace('$', '')),
            taxes: parseFloat(document.getElementById('summaryTaxes').textContent.replace('$', '')),
            total: parseFloat(document.getElementById('summaryTotal').textContent.replace('$', ''))
        }
    };
    
    try {
        const response = await TorontoRidersAPI.booking.create(bookingData);
        alert('Booking created successfully!');
        window.location.href = 'my_rentals.html';
    } catch (error) {
        alert(error.message || 'Error creating booking');
    }
}
```

### Load Bookings

Replace localStorage booking retrieval:

```javascript
// In my_rentals.html
async function loadRentals() {
    try {
        const response = await TorontoRidersAPI.booking.getAll();
        const bookings = response.data.bookings;
        displayBookings(bookings);
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

function displayBookings(bookings) {
    const container = document.getElementById('rentalsContent');
    
    if (bookings.length === 0) {
        container.innerHTML = '<p>No bookings found</p>';
        return;
    }
    
    container.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <h3>${booking.vehicleDetails.name}</h3>
            <p>${booking.vehicleDetails.make} ${booking.vehicleDetails.model}</p>
            <p>Pickup: ${new Date(booking.pickupDate).toLocaleDateString()}</p>
            <p>Return: ${new Date(booking.returnDate).toLocaleDateString()}</p>
            <p>Total: $${booking.pricing.total.toFixed(2)}</p>
            <button onclick="cancelBooking('${booking.id}')">Cancel</button>
        </div>
    `).join('');
}
```

### Check Availability

Before creating a booking:

```javascript
async function checkAvailability() {
    const vehicleId = selectedVehicle.id;
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    try {
        const response = await TorontoRidersAPI.booking.checkAvailability(
            vehicleId, pickupDate, returnDate
        );
        
        if (!response.data.available) {
            alert('Vehicle is not available for selected dates');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error checking availability:', error);
        return false;
    }
}
```

## Error Handling

Always wrap API calls in try-catch blocks:

```javascript
try {
    const response = await TorontoRidersAPI.vehicle.getAll();
    // Handle success
} catch (error) {
    if (error.message.includes('Not authorized')) {
        // Redirect to login
        window.location.href = 'sign_in.html';
    } else {
        alert(error.message || 'An error occurred');
    }
}
```

## Migration Checklist

- [ ] Add `api-client.js` to all HTML pages
- [ ] Update sign up form handler
- [ ] Update sign in form handler
- [ ] Update logout handler
- [ ] Replace vehicle loading with API calls
- [ ] Update vehicle filtering
- [ ] Update business vehicle management
- [ ] Replace booking creation
- [ ] Update booking list loading
- [ ] Add availability checking
- [ ] Test all user flows
- [ ] Remove old localStorage code (optional - keep as fallback)

## Backwards Compatibility

You can keep localStorage as a fallback for offline functionality. Check if backend is available:

```javascript
async function loadVehicles() {
    try {
        // Try API first
        const response = await TorontoRidersAPI.vehicle.getAll();
        allCars = response.data.vehicles;
    } catch (error) {
        // Fallback to localStorage
        console.log('Using cached data');
        allCars = JSON.parse(localStorage.getItem('cached_vehicles') || '[]');
    }
    renderCars();
}
```
