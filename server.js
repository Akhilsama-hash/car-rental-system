const express = require('express');
const path = require('path');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Initialize database
Database.initTables();

// API Routes

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const user = await Database.registerUser(req.body);
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Database.loginUser(email, password);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all users (admin only)
app.get('/api/users', async (req, res) => {
    try {
        const users = await Database.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all cars
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Database.getAllCars();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new car (admin only)
app.post('/api/cars', async (req, res) => {
    try {
        const car = await Database.addCar(req.body);
        res.json({ success: true, car });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
    try {
        const booking = await Database.createBooking(req.body);
        res.json({ success: true, booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all bookings (admin only)
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Database.getAllBookings();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user bookings
app.get('/api/bookings/:userId', async (req, res) => {
    try {
        const bookings = await Database.getUserBookings(req.params.userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'car-rental.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure PostgreSQL is running and database "car_rental" exists');
});