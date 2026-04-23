// Clean implementation: carsData + rendering + filters
const cars = [
    { id: '1', name: 'Tesla Model 3', make: 'Tesla', model: 'Model 3', year: 2024, pricePerDay: 89, image: 'images/tesla-model3.jpg', category: 'electric', transmission: 'automatic', seats: 5, companyName: 'Premium Rentals' },
    { id: '2', name: 'BMW X5', make: 'BMW', model: 'X5', year: 2023, pricePerDay: 125, image: 'images/bmw-x5.jpg', category: 'suv', transmission: 'automatic', seats: 7, companyName: 'Luxury Auto Rentals' },
    { id: '3', name: 'Honda Civic', make: 'Honda', model: 'Civic', year: 2023, pricePerDay: 45, image: 'images/honda-civic.jpg', category: 'sedan', transmission: 'automatic', seats: 5, companyName: 'City Rentals' },
    { id: '4', name: 'Ford Mustang', make: 'Ford', model: 'Mustang', year: 2024, pricePerDay: 95, image: 'images/ford-mustang.jpg', category: 'sports', transmission: 'manual', seats: 4, companyName: 'Sports Car Rentals' },
    { id: '5', name: 'Toyota RAV4', make: 'Toyota', model: 'RAV4', year: 2023, pricePerDay: 65, image: 'images/toyota-rav4.jpg', category: 'suv', transmission: 'automatic', seats: 5, companyName: 'Family Rentals' },
    { id: '6', name: 'Mercedes C-Class', make: 'Mercedes-Benz', model: 'C-Class', year: 2024, pricePerDay: 110, image: 'images/mercedes-c-class.jpg', category: 'luxury', transmission: 'automatic', seats: 5, companyName: 'Premium Rentals' },
    { id: '7', name: 'Audi A4', make: 'Audi', model: 'A4', year: 2023, pricePerDay: 98, image: 'images/audi-a4.jpg', category: 'luxury', transmission: 'automatic', seats: 5, companyName: 'Luxury Auto Rentals' },
    { id: '8', name: 'Jeep Wrangler', make: 'Jeep', model: 'Wrangler', year: 2024, pricePerDay: 85, image: 'images/jeep-wrangler.jpg', category: 'suv', transmission: 'automatic', seats: 5, companyName: 'Adventure Rentals' },
    { id: '9', name: 'Porsche 911', make: 'Porsche', model: '911', year: 2024, pricePerDay: 250, image: 'images/porsche-911.jpg', category: 'sports', transmission: 'automatic', seats: 2, companyName: 'Sports Car Rentals' },
    { id: '10', name: 'Chevrolet Tahoe', make: 'Chevrolet', model: 'Tahoe', year: 2023, pricePerDay: 95, image: 'images/chevrolet-tahoe.jpg', category: 'suv', transmission: 'automatic', seats: 8, companyName: 'Family Rentals' },
    { id: '11', name: 'Toyota Camry', make: 'Toyota', model: 'Camry', year: 2023, pricePerDay: 52, image: 'images/toyota-camry.jpg', category: 'sedan', transmission: 'automatic', seats: 5, companyName: 'Family Rentals' },
    { id: '12', name: 'Mazda CX-5', make: 'Mazda', model: 'CX-5', year: 2024, pricePerDay: 70, image: 'images/mazda-cx5.jpg', category: 'suv', transmission: 'automatic', seats: 5, companyName: 'City Rentals' },
    { id: '13', name: 'Volkswagen Jetta', make: 'Volkswagen', model: 'Jetta', year: 2023, pricePerDay: 48, image: 'images/volkswagen-jetta.jpg', category: 'sedan', transmission: 'automatic', seats: 5, companyName: 'Budget Rentals' },
    { id: '14', name: 'Lexus RX', make: 'Lexus', model: 'RX', year: 2024, pricePerDay: 135, image: 'images/lexus-rx.jpg', category: 'luxury', transmission: 'automatic', seats: 7, companyName: 'Luxury Auto Rentals' },
    { id: '15', name: 'Hyundai Elantra', make: 'Hyundai', model: 'Elantra', year: 2023, pricePerDay: 42, image: 'images/hyundai-elantra.jpg', category: 'sedan', transmission: 'automatic', seats: 5, companyName: 'Budget Rentals' },
    { id: '16', name: 'Chevrolet Corvette', make: 'Chevrolet', model: 'Corvette', year: 2024, pricePerDay: 200, image: 'images/chevrolet-corvette.jpg', category: 'sports', transmission: 'automatic', seats: 2, companyName: 'Sports Car Rentals' },
    { id: '17', name: 'Subaru Outback', make: 'Subaru', model: 'Outback', year: 2023, pricePerDay: 68, image: 'images/subaru-outback.jpg', category: 'suv', transmission: 'automatic', seats: 5, companyName: 'Adventure Rentals' },
    { id: '18', name: 'Kia Sportage', make: 'Kia', model: 'Sportage', year: 2024, pricePerDay: 62, image: 'images/kia-sportage.jpg', category: 'suv', transmission: 'automatic', seats: 5, companyName: 'City Rentals' },
    { id: '19', name: 'Dodge Charger', make: 'Dodge', model: 'Charger', year: 2023, pricePerDay: 78, image: 'images/dodge-charger.jpg', category: 'sports', transmission: 'automatic', seats: 5, companyName: 'Sports Car Rentals' },
    { id: '20', name: 'Ford F-150', make: 'Ford', model: 'F-150', year: 2024, pricePerDay: 88, image: 'images/ford-f150.jpg', category: 'truck', transmission: 'automatic', seats: 3, companyName: 'Work & Utility Rentals' },
    { id: '21', name: 'Nissan Leaf', make: 'Nissan', model: 'Leaf', year: 2024, pricePerDay: 72, image: 'images/nissan-leaf.jpg', category: 'electric', transmission: 'automatic', seats: 5, companyName: 'Premium Rentals' }
];

// global state
let allCars = [...cars];

// Load business vehicles from localStorage and merge with default cars
function loadBusinessVehicles() {
    const businessVehiclesJson = localStorage.getItem('torontoriders_business_vehicles');
    const businessVehicles = businessVehiclesJson ? JSON.parse(businessVehiclesJson) : [];
    
    // Merge business vehicles with default cars
    allCars = [...cars, ...businessVehicles];
}

// initialization
document.addEventListener('DOMContentLoaded', () => {
    loadBusinessVehicles();
    initializePage();
    updateAuthUI();
});

function updateAuthUI() {
    const currentUser = JSON.parse(sessionStorage.getItem('torontoriders_current_user') || 'null');
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const adminLink = document.getElementById('adminLink');
    const bookingLink = document.getElementById('bookingLink');
    const myRentalsLink = document.getElementById('myRentalsLink');
    
    if (!navAuth || !navUser) return;
    
    if (currentUser && currentUser.email) {
        // User is logged in
        navAuth.style.display = 'none';
        navUser.style.display = 'flex';
        document.getElementById('userEmail').textContent = currentUser.email;
        
        // Show admin link if business user
        if (currentUser.accountType === 'business') {
            if (adminLink) adminLink.style.display = 'inline-block';
            // Hide booking link for business users
            if (bookingLink) bookingLink.style.display = 'none';
            // Hide my rentals for business users
            if (myRentalsLink) myRentalsLink.style.display = 'none';
        } else {
            // Customer user
            if (adminLink) adminLink.style.display = 'none';
            // Show booking and my rentals for customers
            if (bookingLink) bookingLink.style.display = 'inline-block';
            if (myRentalsLink) myRentalsLink.style.display = 'inline-block';
        }
    } else {
        // User is not logged in
        navAuth.style.display = 'flex';
        navUser.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (bookingLink) bookingLink.style.display = 'inline-block';
        if (myRentalsLink) myRentalsLink.style.display = 'none';
    }
}

function handleLogout() {
    sessionStorage.removeItem('torontoriders_current_user');
    sessionStorage.removeItem('torontoriders_user');
    updateAuthUI();
    window.location.href = 'index.html';
}

function initializePage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const p = String(page).toLowerCase();
    if (p === 'index.html' || p === '' || p === 'home') loadRecommendedCars();
    if (p === 'cars.html' || p.includes('cars')) {
        initCarsPage();
    }
    // Car details page
    if (p === 'car_details.html' || p.includes('car_details')) {
        // initialize details using existing function
        initCarDetailsPage();
    }
}

function loadRecommendedCars() {
    const container = document.getElementById('recommendedCars');
    if (!container) return;
    const recommended = allCars.slice(0,3);
    container.innerHTML = recommended.map(c => createCarCard(c)).join('');
}

function createCarCard(car) {
    return `
        <div class="car-card" onclick="selectCar('${car.id}')">
            <img src="${car.image}" alt="${car.name}" onerror="tryAlternateOrFallback(this)">
            <div class="car-card-content">
                <div class="car-card-header">
                    <h3>${car.name}</h3>
                    <div class="car-card-price">$${car.pricePerDay}/day</div>
                </div>
                <div class="car-category-badge">${car.category.toUpperCase()}</div>
                <div class="car-card-details">
                    <div class="car-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                            <circle cx="7" cy="17" r="2"></circle>
                            <circle cx="17" cy="17" r="2"></circle>
                        </svg>
                        ${car.year}
                    </div>
                    <div class="car-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6m6-9h-6m-6 0h6m-3-3 3 3-3 3"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        ${car.transmission}
                    </div>
                    <div class="car-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        ${car.seats} seats
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectCar(carId) {
    const car = allCars.find(c => c.id === carId);
    if (!car) return;
    sessionStorage.setItem('selectedCar', JSON.stringify(car));
    // Navigate to a dedicated details page
    window.location.href = 'car_details.html?selected=' + encodeURIComponent(carId);
}

// Filters & listing
let filterState = { companies: new Set(), makes: new Set(), categories: new Set(), transmissions: new Set(), search: '', priceMax: null };

function initCarsPage() {
    buildFilterUI();
    const si = document.getElementById('searchInput');
    if (si) si.addEventListener('input', e => { filterState.search = e.target.value.trim(); renderCars(); });
    const clearBtn = document.getElementById('clearFilters'); if (clearBtn) clearBtn.addEventListener('click', clearFilters);

    const preCompany = sessionStorage.getItem('companyFilter');
    if (preCompany) {
        setTimeout(() => {
            const checkbox = document.querySelector(`input[data-filter-type="company"][value="${CSS.escape(preCompany)}"]`);
            if (checkbox) { checkbox.checked = true; filterState.companies.add(preCompany); }
            renderCars();
            sessionStorage.removeItem('companyFilter');
        }, 60);
    } else {
        // Check if filtering by car make (brand)
        const preMake = sessionStorage.getItem('makeFilter');
        if (preMake) {
            setTimeout(() => {
                const checkbox = document.querySelector(`input[data-filter-type="make"][value="${CSS.escape(preMake)}"]`);
                if (checkbox) { checkbox.checked = true; filterState.makes.add(preMake); }
                renderCars();
                sessionStorage.removeItem('makeFilter');
            }, 60);
        } else renderCars();
    }
}

function buildFilterUI() {
    const container = document.getElementById('filters'); if (!container) return;
    const companies = Array.from(new Set(allCars.map(c => c.companyName))).sort();
    const makes = Array.from(new Set(allCars.map(c => c.make))).sort();
    const categories = Array.from(new Set(allCars.map(c => c.category))).sort();
    const transmissions = Array.from(new Set(allCars.map(c => c.transmission))).sort();
    container.innerHTML = '';
    container.appendChild(buildFilterGroup('Rental Company','company',companies));
    container.appendChild(buildFilterGroup('Make','make',makes));
    container.appendChild(buildFilterGroup('Category','category',categories));
    container.appendChild(buildFilterGroup('Transmission','transmission',transmissions));

    // price
    const priceWrapper = document.createElement('div'); priceWrapper.className = 'price-filter';
    const priceTitle = document.createElement('h4'); priceTitle.textContent = 'Price per Day';
    const rangeWrap = document.createElement('div'); rangeWrap.className = 'range-wrap';
    const range = document.createElement('input'); range.type='range'; range.min='0'; range.max='350'; range.step='5'; range.value='350'; range.id='priceRange';
    const priceVal = document.createElement('div'); priceVal.className='price-value'; priceVal.textContent = `Up to $${range.value}/day`;
    rangeWrap.appendChild(range); rangeWrap.appendChild(priceVal); priceWrapper.appendChild(priceTitle); priceWrapper.appendChild(rangeWrap); container.appendChild(priceWrapper);
    filterState.priceMax = parseInt(range.value,10);
    range.addEventListener('input', e => { filterState.priceMax = parseInt(e.target.value,10); priceVal.textContent = `Up to $${filterState.priceMax}/day`; renderCars(); });
}

function buildFilterGroup(title,type,items) {
    const wrapper = document.createElement('div'); wrapper.className='filter-group'; const h = document.createElement('h4'); h.textContent=title; wrapper.appendChild(h);
    items.forEach(item => {
        const id = `filter-${type}-${item.replace(/\s+/g,'-')}`;
        const label = document.createElement('label'); label.className='filter-label';
        const input = document.createElement('input'); input.type='checkbox'; input.setAttribute('data-filter-type', type); input.value=item; input.id=id; input.addEventListener('change', onFilterChange);
        const span = document.createElement('span'); span.textContent = item;
        label.appendChild(input); label.appendChild(span); wrapper.appendChild(label);
    });
    return wrapper;
}

function onFilterChange(e) {
    const input = e.target; const type = input.getAttribute('data-filter-type'); const value = input.value;
    const map = { company: filterState.companies, make: filterState.makes, category: filterState.categories, transmission: filterState.transmissions };
    const set = map[type]; if (!set) return; if (input.checked) set.add(value); else set.delete(value); renderCars();
}

function clearFilters() {
    filterState = { companies: new Set(), makes: new Set(), categories: new Set(), transmissions: new Set(), search: '', priceMax: null };
    document.querySelectorAll('#filters input[type=checkbox]').forEach(cb => cb.checked = false);
    const si = document.getElementById('searchInput'); if (si) si.value = '';
    const pr = document.getElementById('priceRange'); if (pr) { pr.value = pr.max; filterState.priceMax = parseInt(pr.value,10); }
    renderCars();
}

function renderCars() {
    const grid = document.getElementById('carsGrid'); const countEl = document.getElementById('resultsCount'); if (!grid) return;
    const results = applyFilters(); grid.innerHTML = results.map(car => createListingCard(car)).join('') || '<p style="color:var(--color-gray-dark)">No cars found.</p>';
    if (countEl) countEl.textContent = `${results.length} cars available`;
}

function applyFilters() {
    return allCars.filter(car => {
        if (filterState.companies.size > 0 && !filterState.companies.has(car.companyName)) return false;
        if (filterState.makes.size > 0 && !filterState.makes.has(car.make)) return false;
        if (filterState.categories.size > 0 && !filterState.categories.has(car.category)) return false;
        if (filterState.transmissions.size > 0 && !filterState.transmissions.has(car.transmission)) return false;
        if (filterState.search) {
            const q = filterState.search.toLowerCase(); const hay = `${car.name} ${car.make} ${car.model} ${car.companyName}`.toLowerCase(); if (!hay.includes(q)) return false;
        }
        if (filterState.priceMax != null && typeof car.pricePerDay === 'number') { if (car.pricePerDay > filterState.priceMax) return false; }
        return true;
    });
}

function createListingCard(car) {
    return `
        <div class="car-card">
            <img src="${car.image}" alt="${car.name}" onerror="tryAlternateOrFallback(this)">
            <div class="car-card-content">
                <div class="car-card-header">
                    <h3>${car.name}</h3>
                    <div class="car-card-price">$${car.pricePerDay}/day</div>
                </div>
                <div style="color:var(--color-gray-dark);font-size:0.95rem;margin-bottom:0.5rem">${car.companyName} • ${car.make} ${car.model} (${car.year})</div>
                <div class="car-category-badge">${car.category.toUpperCase()}</div>
                <div class="car-card-details">
                    <div class="car-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        ${car.seats} seats
                    </div>
                    <div class="car-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6m6-9h-6m-6 0h6m-3-3 3 3-3 3"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        ${car.transmission}
                    </div>
                </div>
                <div style="margin-top:0.75rem;text-align:right">
                    <button class="btn-primary" onclick="selectCar('${car.id}')">View Details</button>
                </div>
            </div>
        </div>
    `;
}

// Fallback when external image fails: set a small SVG data-uri placeholder
function setImageFallback(img) {
    if (!img) return;
    try {
        const svg = `
            <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
                <rect width='100%' height='100%' fill='%23f3f4f6' rx='12' ry='12'/>
                <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial, Helvetica, sans-serif' font-size='28'>Image unavailable</text>
            </svg>`;
        img.onerror = null;
        img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    } catch (e) {
        // last resort: remove image
        img.style.display = 'none';
    }
}

// Try alternate extension (.png <-> .jpg) once before using the SVG fallback.
function tryAlternateOrFallback(img) {
    if (!img) return;
    try {
        const attempted = img.dataset.attempt || '0';
        if (attempted === '0') {
            img.dataset.attempt = '1';
            const src = img.getAttribute('src') || '';
            // try swapping between .jpg/.jpeg and .png
            if (/\.jpe?g$/i.test(src)) {
                const alt = src.replace(/\.jpe?g$/i, '.png');
                img.onerror = function() { tryAlternateOrFallback(img); };
                img.src = alt;
                return;
            } else if (/\.png$/i.test(src)) {
                const alt = src.replace(/\.png$/i, '.jpg');
                img.onerror = function() { tryAlternateOrFallback(img); };
                img.src = alt;
                return;
            }
        }
    } catch (e) {
        // fall through to fallback
    }
    // if we get here, either alternate was attempted or there isn't one — use the SVG fallback
    setImageFallback(img);
}



function openCompany(companyName) { sessionStorage.setItem('companyFilter', companyName); window.location.href = 'cars.html'; }

function openBrand(brandName) { sessionStorage.setItem('makeFilter', brandName); window.location.href = 'cars.html'; }

function initCarDetailsPage() {
    const container = document.getElementById("carDetailsContainer");
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedId = urlParams.get("selected");

    let car = null;
    if (selectedId) {
        car = allCars.find(c => c.id === selectedId);
    }
    if (!car) {
        const storedCar = sessionStorage.getItem("selectedCar");
        if (storedCar) {
            car = JSON.parse(storedCar);
        }
    }
    if (!car) {
        container.innerHTML = "<p> No car selected.</p>";
        return;
    }

    container.innerHTML = `
        <div class="car-details-wrapper">

            <a href="cars.html" class="back-link">← Back to All Cars</a>

            <div class="car-details-main">
                <div class="car-details-image">
                    <img src="${car.image}" alt="${car.name}" onerror="tryAlternateOrFallback(this)">
                </div>

                <div class="car-details-info">
                    <span class= "car-details-badge">${car.category.charAt(0).toUpperCase() + car.category.slice(1)}</span>
                    <h2>${car.name}</h2>
                    <p class="car-details-sub">${car.make} ${car.model} (${car.year})</p>
                 <div class="car-spec-box">

                        <div class="spec-row">
                            <div class="spec-item">
                                <strong>Seats</strong>
                                <p>${car.seats} passengers</p>
                            </div>

                            <div class="spec-item">
                                <strong>Transmission</strong>
                                <p>${car.transmission}</p>
                            </div>
                        </div>

                        <div class="spec-row">
                            <div class="spec-item">
                                <strong>Year</strong>
                                <p>${car.year}</p>
                            </div>

                            <div class="spec-item">
                                <strong>Company</strong>
                                <p>${car.companyName}</p>
                            </div>
                        </div>

                    </div>

                    <div class="car-details-section">
                        <h3>Description</h3>
                        <p>Experience driving with the ${car.name}. Perfect for city driving, long trips, and everything in between.</p>
                    </div>

                    <div class="car-details-section">
                        <h3>Rental Price</h3>
                        <div class="car-price-box">
                            <span>$${car.pricePerDay} per day</span>
                            <button class="btn-primary" 
onclick="if(checkBusinessAccess()) rentThisCar(${JSON.stringify(car).replace(/"/g, '&quot;')})">
    Rent This Car
</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    `;
}

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

function togglePassword() {
    const passwordField = document.getElementById('password');
    if (!passwordField) return;
    const isPassword = passwordField.type === 'password';
    passwordField.type = isPassword ? 'text' : 'password';
}

function toggleSignUpPassword() {
    const passwordField = document.getElementById('signup-password');
    if (!passwordField) return;
    const isPassword = passwordField.type === 'password';
    passwordField.type = isPassword ? 'text' : 'password';
}

function toggleConfirmPassword() {
    const passwordField = document.getElementById('confirm-password');
    if (!passwordField) return;
    const isPassword = passwordField.type === 'password';
    passwordField.type = isPassword ? 'text' : 'password';
}

// ========================================
// PASSWORD STRENGTH AND MATCHING
// ========================================

function checkPasswordStrength() {
    const password = document.getElementById('signup-password').value;
    const strengthDisplay = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        strengthDisplay.style.display = 'none';
        return;
    }
    
    strengthDisplay.style.display = 'flex';
    
    let strength = 0;
    
    // Check password length
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength++;
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) strength++;
    
    // Check for numbers
    if (/\d/.test(password)) strength++;
    
    // Check for special characters
    if (/[!@#$%^&*]/.test(password)) strength++;
    
    // Remove all strength classes
    strengthFill.classList.remove('weak', 'fair', 'strong');
    strengthText.classList.remove('weak', 'fair', 'strong');
    
    if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength <= 4) {
        strengthFill.classList.add('fair');
        strengthText.classList.add('fair');
        strengthText.textContent = 'Fair password';
    } else {
        strengthFill.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
    
    // Also check match if confirm password has value
    if (document.getElementById('confirm-password').value) {
        checkPasswordMatch();
    }
}

function checkPasswordMatch() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const matchDisplay = document.getElementById('passwordMatch');
    
    if (!confirmPassword) {
        matchDisplay.style.display = 'none';
        return;
    }
    
    matchDisplay.style.display = 'block';
    matchDisplay.classList.remove('match', 'mismatch');
    
    if (password === confirmPassword) {
        matchDisplay.classList.add('match');
        matchDisplay.textContent = '✓ Passwords match';
    } else {
        matchDisplay.classList.add('mismatch');
        matchDisplay.textContent = '✗ Passwords do not match';
    }
}

// ========================================
// ACCOUNT TYPE SELECTION
// ========================================

function toggleBusinessField() {
    const accountType = document.querySelector('input[name="accountType"]:checked').value;
    const businessNameGroup = document.getElementById('businessNameGroup');
    const businessNameInput = document.getElementById('businessname');
    
    if (accountType === 'business') {
        businessNameGroup.style.display = 'block';
        businessNameInput.required = true;
    } else {
        businessNameGroup.style.display = 'none';
        businessNameInput.required = false;
        businessNameInput.value = '';
    }
}

// Handle sign in form submission
document.addEventListener('DOMContentLoaded', () => {
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }
    
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
    }
});

function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.querySelector('input[name="remember"]').checked;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Check if user exists by retrieving all registered users
    const allUsersJson = localStorage.getItem('torontoriders_users');
    const allUsers = allUsersJson ? JSON.parse(allUsersJson) : [];
    
    // Find user with matching email
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        alert('User not found. Please sign up first or check your email address.');
        return;
    }
    
    // Verify password (in a real app, this would be hashed and verified on server)
    if (user.password !== password) {
        alert('Invalid password. Please try again.');
        return;
    }
    
    // Store sign-in session
    const userData = {
        email: email,
        fullname: user.fullname,
        accountType: user.accountType,
        businessname: user.businessname || null,
        rememberMe: rememberMe,
        lastLogin: new Date().toISOString()
    };
    
    if (rememberMe) {
        localStorage.setItem('torontoriders_user', JSON.stringify(userData));
    }
    
    // Set session storage for current login
    sessionStorage.setItem('torontoriders_current_user', JSON.stringify(userData));
    
    // Show success message
    alert('Sign in successful! Welcome back, ' + user.fullname + '.');
    
    // Redirect based on account type
    if (user.accountType === 'business') {
        // Redirect business users to admin panel
        window.location.href = 'admin.html';
    } else {
        // Redirect regular users to home page
        window.location.href = 'index.html';
    }
}

function handleSignUp(e) {
    e.preventDefault();
    
    const accountType = document.querySelector('input[name="accountType"]:checked').value;
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const businessname = accountType === 'business' ? document.getElementById('businessname').value.trim() : '';
    const terms = document.querySelector('input[name="terms"]').checked;
    
    // Basic validation
    if (!fullname || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    // Business name validation if business account
    if (accountType === 'business' && !businessname) {
        alert('Please enter a business name');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Phone format validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number');
        return;
    }
    
    // Password strength validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Password match validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Terms validation
    if (!terms) {
        alert('Please agree to the Terms of Service');
        return;
    }
    
    // Check if user already exists
    const allUsersJson = localStorage.getItem('torontoriders_users');
    const allUsers = allUsersJson ? JSON.parse(allUsersJson) : [];
    
    if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('An account with this email already exists. Please sign in instead.');
        return;
    }
    
    // Create new user with password and account type
    const newUser = {
        fullname: fullname,
        email: email,
        phone: phone,
        password: password,
        accountType: accountType,
        businessname: businessname || null,
        createdAt: new Date().toISOString()
    };
    
    // Add to users list
    allUsers.push(newUser);
    localStorage.setItem('torontoriders_users', JSON.stringify(allUsers));
    
    // Store current user session
    const userData = {
        fullname: fullname,
        email: email,
        accountType: accountType,
        businessname: businessname || null,
        lastLogin: new Date().toISOString()
    };
    localStorage.setItem('torontoriders_user', JSON.stringify(userData));
    sessionStorage.setItem('torontoriders_current_user', JSON.stringify(userData));
    
    // Show success message
    const accountTypeText = accountType === 'business' ? 'business' : 'customer';
    alert(`${accountTypeText.charAt(0).toUpperCase() + accountTypeText.slice(1)} account created successfully! Redirecting...`);
    
    // Redirect based on account type
    if (accountType === 'business') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
}

/* ==========================================
   CHECKOUT PAGE FUNCTIONALITY
   ========================================== */

function initCheckoutPage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (page.toLowerCase() !== 'checkout.html') return;

    // Load booking data from session
    loadCheckoutData();
    
    // Setup coverage option listeners
    setupCoverageListeners();
    
    // Setup date validation
    setupDateValidation();
    
    // Setup payment button
    const paymentBtn = document.querySelector('.checkout-btn');
    if (paymentBtn) {
        paymentBtn.addEventListener('click', handlePayment);
    }
}

function loadCheckoutData() {
    // Get data from sessionStorage (set when user clicks "Rent" on car details)
    const bookingData = JSON.parse(sessionStorage.getItem('torontoriders_booking') || '{}');
    
    // Car info
    const selectedCar = bookingData.car || cars[0];
    document.getElementById('checkoutCarName').textContent = selectedCar.name || 'Tesla Model 3';
    document.getElementById('checkoutCarDesc').textContent = `${selectedCar.make || 'Tesla'} ${selectedCar.model || 'Model 3'}`;
    document.getElementById('checkoutCarImage').src = selectedCar.image || 'images/tesla.jpg';
    document.getElementById('pricePerDay').textContent = `$${selectedCar.pricePerDay || 89}`;
    
    // Setup date inputs
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');
    
    if (startDateInput && endDateInput) {
        if (bookingData.startDate) {
            startDateInput.value = bookingData.startDate;
        }
        if (bookingData.endDate) {
            endDateInput.value = bookingData.endDate;
        }
        
        startDateInput.addEventListener('change', updateCheckoutDays);
        endDateInput.addEventListener('change', updateCheckoutDays);
    }
    
    updateCheckoutDays();
}

function updateCheckoutDays() {
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');
    
    if (!startDateInput || !endDateInput) return;
    
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        if (days > 0) {
            document.getElementById('checkoutDays').textContent = days;
            document.getElementById('summaryDays').textContent = days;
            
            // Calculate car rental price
            const pricePerDay = parseFloat(document.getElementById('pricePerDay').textContent.replace('$', ''));
            const carRentalPrice = days * pricePerDay;
            document.getElementById('carRentalPrice').textContent = `$${carRentalPrice.toFixed(2)}`;
            
            updateTotalPrice();
        }
    } else {
        document.getElementById('checkoutDays').textContent = '0';
        document.getElementById('summaryDays').textContent = '0';
        document.getElementById('carRentalPrice').textContent = '$0.00';
    }
}

function setupCoverageListeners() {
    const coverageRadios = document.querySelectorAll('input[name="coverage"]');
    coverageRadios.forEach(radio => {
        radio.addEventListener('change', handleCoverageChange);
    });
}

function handleCoverageChange() {
    updateTotalPrice();
}

function updateTotalPrice() {
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');
    
    if (!startDateInput || !endDateInput) return;
    
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return;
    
    const pricePerDay = parseFloat(document.getElementById('pricePerDay').textContent.replace('$', ''));
    const carRentalPrice = days * pricePerDay;
    
    // Get selected coverage
    const checkedCoverage = document.querySelector('input[name="coverage"]:checked');
    let coveragePrice = 0;
    
    if (checkedCoverage) {
        const coverageValue = checkedCoverage.value;
        if (coverageValue === 'basic') {
            coveragePrice = 15 * days;
        } else if (coverageValue === 'premium') {
            coveragePrice = 30 * days;
        }
    }
    
    document.getElementById('coveragePrice').textContent = `$${coveragePrice.toFixed(2)}`;
    
    const totalPrice = carRentalPrice + coveragePrice;
    document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
}

function handlePayment() {
    const currentUser = JSON.parse(sessionStorage.getItem('torontoriders_current_user') || 'null');
    
    if (!currentUser) {
        alert('Please sign in to complete your booking.');
        window.location.href = 'sign_in.html';
        return;
    }

    const bookingData = JSON.parse(sessionStorage.getItem('torontoriders_booking') || '{}');
    const car = bookingData.car;

    if (!car) {
        alert('No car selected.');
        return;
    }

    const startDate = document.getElementById('startDateInput')?.value;
    const endDate = document.getElementById('endDateInput')?.value;

    // ✅ FIX: ensure vehicleDetails is stored
    const newBooking = {
        id: Date.now(),
        email: currentUser.email,
        vehicle: car,
        vehicleDetails: car, // ✅ CRITICAL FIX
        pickupDate: startDate,
        returnDate: endDate,
        createdAt: new Date().toISOString()
    };

    const bookingsJson = localStorage.getItem('torontoriders_bookings');
    const allBookings = bookingsJson ? JSON.parse(bookingsJson) : [];

    allBookings.push(newBooking);
    localStorage.setItem('torontoriders_bookings', JSON.stringify(allBookings));

    const totalPrice = document.getElementById('totalPrice').textContent;
    alert(`Payment of ${totalPrice} processed successfully! Your booking is confirmed.`);

    sessionStorage.removeItem('torontoriders_booking');

    window.location.href = 'my_rentals.html';
}

function rentThisCar(vehicle) {
    console.log("Saving vehicle:", vehicle);

    sessionStorage.setItem('selectedVehicle', JSON.stringify(vehicle));

    window.location.href = 'booking.html';
}



function checkBusinessAccess() {
    const userRole = localStorage.getItem('userRole');

    if (userRole === 'business') {
        alert('Business accounts cannot rent vehicles.');
        return false;
    }

    return true;
}



function setupDateValidation() {
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');
    
    if (!startDateInput || !endDateInput) return;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Set minimum date to today for both inputs
    startDateInput.min = todayString;
    endDateInput.min = todayString;
    
    // When start date changes, update end date minimum
    startDateInput.addEventListener('change', () => {
        const startDate = startDateInput.value;
        if (startDate) {
            // End date must be at least the start date
            endDateInput.min = startDate;
            
            // If end date is now before start date, clear it
            if (endDateInput.value && endDateInput.value < startDate) {
                endDateInput.value = '';
                updateCheckoutDays();
            }
        }
    });
}

// Check if a vehicle is booked during the requested date range
function isVehicleBooked(vehicleId, pickupDate, returnDate) {
    const bookingsJson = localStorage.getItem('torontoriders_bookings');
    const allBookings = bookingsJson ? JSON.parse(bookingsJson) : [];
    
    // Convert dates to comparable format
    const requestStart = new Date(pickupDate);
    const requestEnd = new Date(returnDate);
    
    // Check if any existing booking overlaps with requested dates
    const conflict = allBookings.some(booking => {
        if (booking.vehicle?.id !== vehicleId) return false;
        
        const bookingStart = new Date(booking.pickupDate);
        const bookingEnd = new Date(booking.returnDate);
        
        // Check for date overlap: no conflict if one period ends before the other starts
        const noOverlap = requestEnd <= bookingStart || requestStart >= bookingEnd;
        return !noOverlap; // Return true if there IS an overlap
    });
    
    return conflict;
}

// Initialize checkout page on load
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    initCheckoutPage();
});

document.addEventListener('DOMContentLoaded', function () {

    const userRole = localStorage.getItem('userRole');

    // Find rent button(s)
    const rentButtons = document.querySelectorAll('.rent-btn');

    if (userRole === 'business') {
        rentButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }
});