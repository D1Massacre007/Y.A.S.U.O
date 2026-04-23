// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('torontoriders_token');
};

// Set token in localStorage
const setToken = (token) => {
    localStorage.setItem('torontoriders_token', token);
};

// Remove token from localStorage
const removeToken = () => {
    localStorage.removeItem('torontoriders_token');
};

// API request helper with authentication
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Authentication API
const authAPI = {
    // Sign up
    signup: async (userData) => {
        const data = await apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        if (data.data.token) {
            setToken(data.data.token);
            // Store user data in sessionStorage
            sessionStorage.setItem('torontoriders_current_user', JSON.stringify(data.data.user));
        }
        
        return data;
    },
    
    // Sign in
    signin: async (credentials) => {
        const data = await apiRequest('/auth/signin', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (data.data.token) {
            setToken(data.data.token);
            // Store user data in sessionStorage
            sessionStorage.setItem('torontoriders_current_user', JSON.stringify(data.data.user));
        }
        
        return data;
    },
    
    // Logout
    logout: () => {
        removeToken();
        sessionStorage.removeItem('torontoriders_current_user');
        sessionStorage.removeItem('torontoriders_user');
        sessionStorage.removeItem('torontoriders_booking');
    }
};

// User API
const userAPI = {
    // Get current user profile
    getProfile: async () => {
        return await apiRequest('/users/me');
    },
    
    // Update profile
    updateProfile: async (userData) => {
        return await apiRequest('/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }
};

// Vehicle API
const vehicleAPI = {
    // Get all vehicles with filters
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/vehicles?${queryParams}` : '/vehicles';
        return await apiRequest(endpoint);
    },
    
    // Get single vehicle
    getById: async (id) => {
        return await apiRequest(`/vehicles/${id}`);
    },
    
    // Create vehicle (business only)
    create: async (vehicleData) => {
        return await apiRequest('/vehicles', {
            method: 'POST',
            body: JSON.stringify(vehicleData)
        });
    },
    
    // Update vehicle (business only)
    update: async (id, vehicleData) => {
        return await apiRequest(`/vehicles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(vehicleData)
        });
    },
    
    // Delete vehicle (business only)
    delete: async (id) => {
        return await apiRequest(`/vehicles/${id}`, {
            method: 'DELETE'
        });
    },
    
    // Get my vehicles (business only)
    getMyVehicles: async () => {
        return await apiRequest('/vehicles/business/my-vehicles');
    }
};

// Booking API
const bookingAPI = {
    // Get all bookings for current user
    getAll: async (status = null) => {
        const endpoint = status ? `/bookings?status=${status}` : '/bookings';
        return await apiRequest(endpoint);
    },
    
    // Get single booking
    getById: async (id) => {
        return await apiRequest(`/bookings/${id}`);
    },
    
    // Create booking
    create: async (bookingData) => {
        return await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    },
    
    // Update booking status
    updateStatus: async (id, status) => {
        return await apiRequest(`/bookings/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },
    
    // Cancel booking
    cancel: async (id) => {
        return await apiRequest(`/bookings/${id}`, {
            method: 'DELETE'
        });
    },
    
    // Check vehicle availability
    checkAvailability: async (vehicleId, pickupDate, returnDate) => {
        return await apiRequest('/bookings/check-availability', {
            method: 'POST',
            body: JSON.stringify({ vehicleId, pickupDate, returnDate })
        });
    }
};

// Export APIs
window.TorontoRidersAPI = {
    auth: authAPI,
    user: userAPI,
    vehicle: vehicleAPI,
    booking: bookingAPI
};
