const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', passport.authenticate('oauth2'));

router.get('/callback', passport.authenticate('oauth2', {
  failureRedirect: '/login',
  successRedirect: '/', // Redirect to your dashboard or home page
}));

module.exports = router;
