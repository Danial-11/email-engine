const express = require('express');
const passport = require('passport');
const fetchEmails = require('../services/syncEmails');
const router = express.Router();
const { client } = require('../config/elasticsearch');

router.get('/login', passport.authenticate('oauth2'));

router.get('/callback', passport.authenticate('oauth2', {
  failureRedirect: '/api/user/login',
  session: true,
}), async (req, res) => {
  try {
    const user = req.user;
    await fetchEmails(user);

    setTimeout(async () => {
      try {
        const emails = await client.search({
          index: 'emails',
          body: {
            query: {
              match: { userId: user.outlookId }
            }
          }
        });

        req.session.emails = emails.hits.hits;

        // Redirect to the frontend emails view
        res.redirect('http://localhost:3000/email_view');
      } catch (error) {
        console.error('Error fetching emails:', error);
        res.redirect('/api/user/login');
      }
    }, 3000);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.redirect('/api/user/login');
  }
});

router.get('/emails', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  res.json(req.session.emails || []);
});

module.exports = router;
