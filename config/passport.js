const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const User = require('../models/User');

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/user/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOneAndUpdate(
      { outlookId: profile.id },
      {
        outlookId: profile.id,
        email: profile.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      { upsert: true, new: true }
    );
    done(null, user);
  } catch (error) {
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
