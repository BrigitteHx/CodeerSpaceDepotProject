import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/welcomepage/Header';
import MainContent from './components/welcomepage/MainContent';
import Footer from './components/welcomepage/Footer';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import PasswordReset from './components/password_reset/Password_reset';
import ResetPassword from './components/password_reset/NewPassword';
import Homepage from './components/homepage/homepage';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
import ContactPage from './components/contact/ContactPage'; // Importeer ContactPage component
import InformationPage from './components/information/InformationPage';
import UserAccountPage from './components/user_account/UserAccountPage';
import FaqPage from './components/faq/FaqPage';
import SettingsPage from './components/settings/SettingsPage';
import BatteryDashboard from './components/battery_dashboard/batteryDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password_reset" element={<PasswordReset />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/information" element={<InformationPage />} />
            
            {/* Protect the /home route */}
            <Route 
              path="/home" 
              element={
                <PrivateRoute>
                  <Homepage />
                </PrivateRoute>
              } 
            />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/user-account" element={<UserAccountPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/battery-dashboard" element={<BatteryDashboard />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
