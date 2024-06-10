# Email Engine Project
This project is a simple email client that connects with Outlook accounts, fetches emails, and displays them on a web interface.
The backend is built with Node.js, Express, and MongoDB, while the frontend is developed using React. The project uses Passport.js for authentication and
Elasticsearch for storing and searching emails.

# Features
  OAuth2 authentication with Outlook
  Fetch and display emails from the Outlook account
  Store emails in Elasticsearch
  Display emails on a web interface
  Backend and frontend integration
  
# Prerequisites
  Node.js
  MongoDB
  Elasticsearch
  npm or yarn
  Setup
  Backend
  
# Clone the repository
``
git clone https://github.com/yourusername/email-engine.git
cd email-engine
Install backend dependencies
``

Start the backend server

# Frontend
Navigate to the client directory
Start the frontend server
``
cd client
npm install
npm start
``

# Usage
Login with Outlook
Navigate to ``http://localhost:3000``
Click on "Login with Outlook" to authenticate.

# View Emails
After authentication, you will be redirected to ``http://localhost:3000/email_view`` where you can see the list of your emails.