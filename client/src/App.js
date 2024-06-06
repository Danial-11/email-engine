import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmailsView from './components/EmailsView';
import './App.css';
import './components/EmailsView.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={
            <div>
              <h1>Welcome to the Email Client</h1>
              <a href="http://localhost:5000/api/user/login">Login with Outlook</a>
            </div>
          } />
          <Route path="/email_view" element={<EmailsView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
