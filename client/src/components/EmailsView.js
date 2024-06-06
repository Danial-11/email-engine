import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmailsView.css';

const EmailsView = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/emails', { withCredentials: true });
        setEmails(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  if (loading) return <p>Loading emails...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="emails-container">
      <h1>Emails</h1>
      <ul className="emails-list">
        {emails.map(email => (
          <li key={email._id} className="email-item">
            <div className="email-header">
              <strong>{email._source.subject}</strong> from {email._source.sender}
            </div>
            <p className="email-body">{email._source.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailsView;
