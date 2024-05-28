const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  outlookId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
