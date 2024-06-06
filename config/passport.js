require('dotenv').config();
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');

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
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userProfile = response.data;

    const user = {
      outlookId: userProfile.id,
      email: userProfile.mail || userProfile.userPrincipalName,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    done(null, user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
