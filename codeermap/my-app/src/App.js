import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/welcomepage/Header';
import MainContent from './components/welcomepage/MainContent';
import Footer from './components/welcomepage/Footer';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import PasswordReset from './components/password_reset/Password_reset';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password_reset" element={<PasswordReset />} /> {/* Voeg de nieuwe route toe */}
          </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
