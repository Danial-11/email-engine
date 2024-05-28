require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); // Import express-session

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/email-engine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

// Configure session middleware
app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session()); // Enable session support

// Load models
require('./models/User');
require('./config/passport'); // Passport configuration

// Routes
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

app.listen(5000, () => console.log('Server started on port 5000'));
