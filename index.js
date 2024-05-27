// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/email-engine')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

app.listen(5000, () => console.log('Server started on port 5000'));
