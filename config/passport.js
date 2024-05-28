require('dotenv').config();
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');
const User = require('../models/User');

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/user/callback',
  scope: [
    'openid',
    'profile',
    'email',
    'offline_access',
    'https://graph.microsoft.com/User.Read',
    'https://graph.microsoft.com/Mail.Read'
  ]
}, async (accessToken, refreshToken, params, profile, done) => {
  try {
    // Fetch user profile from Microsoft Graph API
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userProfile = response.data;

    console.log('User Profile:', userProfile);

    const user = await User.findOneAndUpdate(
      { outlookId: userProfile.id },
      {
        outlookId: userProfile.id,
        email: userProfile.mail || userProfile.userPrincipalName,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      { upsert: true, new: true }
    );
    done(null, user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
