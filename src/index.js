require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookiesParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();
// middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookiesParser());
app.use('/', express.static(path.join(__dirname, '../public')));
// Routes
app.use('/', require('./routes/root'));
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})


