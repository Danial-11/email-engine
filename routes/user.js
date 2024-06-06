const express = require('express');
const passport = require('passport');
const fetchEmails = require('../services/syncEmails');
const router = express.Router();
const { client } = require('../config/elasticsearch');

router.get('/login', passport.authenticate('oauth2'));

router.get('/callback', passport.authenticate('oauth2', {
  failureRedirect: '/api/user/login',
  successRedirect: '/api/user/emails',
}));

router.get('/emails', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const user = req.user;
  try {
    await fetchEmails(user);
    // Introduce a delay before proceeding
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

        res.json(emails.hits.hits);
      } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Error fetching emails' });
      }
    }, 3000); // 3 seconds delay
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Error fetching emails' });
  }
});

module.exports = router;
