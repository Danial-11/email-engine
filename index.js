const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/email-engine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Load models
require('./models/User');
require('./config/passport'); // Passport configuration

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

// Routes
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

app.listen(5000, () => console.log('Server started on port 5000'));
