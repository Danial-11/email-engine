const axios = require('axios');
const User = require('../models/User');
const { client } = require('../config/elasticsearch');

const fetchEmails = async (user) => {
  const url = 'https://graph.microsoft.com/v1.0/me/messages';
  const headers = { Authorization: `Bearer ${user.accessToken}` };
  const params = {
    '$top': 10,
    '$orderby': 'receivedDateTime desc',
    '$select': 'subject,from,body,isRead,receivedDateTime'
  };

  try {
    const response = await axios.get(url, { headers, params });
    const emails = response.data.value;

    if (!emails || emails.length === 0) {
      console.log('No emails found for user:', user.email);
      return;
    }

    console.log(`Fetched ${emails.length} emails for user: ${user.email}`);

    for (const email of emails) {
      console.log(`Indexing email from: ${email.from ? email.from.emailAddress.address : 'Unknown'}`);
      await client.index({
        index: 'emails',
        body: {
          userId: user.outlookId,
          subject: email.subject,
          sender: email.from && email.from.emailAddress ? email.from.emailAddress.address : 'Unknown',
          body: email.body ? email.body.content : '',
          status: email.isRead ? 'read' : 'unread',
          date: email.receivedDateTime
        }
      });
    }
  } catch (error) {
    console.error(`Error fetching emails for user: ${user.email}`, error.response ? error.response.data : error.message);
  }
};

const syncEmails = async () => {
  const users = await User.find();
  for (const user of users) {
    await fetchEmails(user);
  }
};

setInterval(syncEmails, 3600000); // Sync every hour

module.exports = syncEmails;
