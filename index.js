require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { createIndices } = require('./config/elasticsearch');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/email-engine')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

require('./models/User');
require('./config/passport');

app.use('/api/user', userRoutes);

// Initialize Elasticsearch indices
createIndices();

app.listen(5000, () => console.log('Server started on port 5000'));
