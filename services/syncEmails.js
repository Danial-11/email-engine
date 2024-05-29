const axios = require('axios');
const User = require('../models/User');
const { client } = require('../config/elasticsearch');

const fetchEmails = async (user) => {
  const outlookApiUrl = 'https://graph.microsoft.com/v1.0/me/messages';
  const headers = {
    Authorization: `Bearer ${user.accessToken}`,
  };

  try {
    const response = await axios.get(outlookApiUrl, { headers });
    const emails = response.data.value;

    for (const email of emails) {
      await client.index({
        index: 'emails',
        body: {
          userId: user._id,
          subject: email.subject,
          sender: email.from.emailAddress.address,
          body: email.body.content,
          status: email.isRead ? 'read' : 'unread',
          date: new Date(email.receivedDateTime)
        },
        id: email.id 
      });
    }
    console.log(`Fetched and indexed emails for user: ${user.email}`);
  } catch (error) {
    console.error(`Error fetching emails for user: ${user.email}`, error);
  }
};

const syncEmails = async () => {
  const users = await User.find({});
  for (const user of users) {
    await fetchEmails(user);
  }
};

// Run syncEmails function periodically (e.g., every minute)
setInterval(syncEmails, 60000);

module.exports = syncEmails;
