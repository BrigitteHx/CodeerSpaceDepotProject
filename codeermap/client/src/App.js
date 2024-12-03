import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/welcomepage/Header';
import MainContent from './components/welcomepage/MainContent';
import Footer from './components/welcomepage/Footer';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import PasswordReset from './components/password_reset/Password_reset';
import ResetPassword from './components/password_reset/NewPassword';
import Homepage from './components/homepage/homepage';
import SolarDashboard from './components/solar_dashboard/solarDashboard';
import BatteryDashboard from './components/battery_dashboard/batteryDashboard';
import ContactPage from './components/contactpage/ContactPage'; // ContactPage import toegevoegd
import InformationPage from './components/information/InformationPage'; // InformationPage import toegevoegd
import AboutUsPage from './components/aboutus/AboutUs';
import FAQPage from './components/faq/FAQPage';
import FeedbackForm from './components/feedback/FeedbackForm';
import FloatingChatButton from './components/faq/FloatingChatButton';
import PersonalInfoPage from './components/user_account/PersonalInfoPage';
import DataSharingPage from './components/user_account/DataSharingPage';
import DashboardPage from './components/user_account/DashboardPage';
import SettingsPage from './components/user_account/SettingsPage';
import Sidebar from './components/user_account/Sidebar';
import UserAccountLayout from './components/user_account/UserAccountLayout';
import { PrivateRoute, PublicRoute } from './components/routes/PrivateRoute';
import { AuthProvider, useAuth } from './components/AuthContext';
import MfaVerificationPage from './components/mfa/MfaVerificationPage';
import Swal from 'sweetalert2';
import './App.css';


function LogoutTimer() {
  const logoutTimeout = 15 * 60 * 1000; // 15 minutes
  const navigate = useNavigate();
  const { loggedIn, logout } = useAuth(); // Access loggedIn state and logout method

  const handleLogout = useCallback(() => {
    logout(); // Call the logout method from AuthContext
    Swal.fire({
      icon: "error",
      title: "Logged out",
      text: "You has been logged out due to inactivity",
    });
    navigate('/login');
  }, [logout, navigate]);

  useEffect(() => {
    if (!loggedIn) return; 

    let timer = setTimeout(handleLogout, logoutTimeout);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(handleLogout, logoutTimeout);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [loggedIn, handleLogout, logoutTimeout]);

  return null;
}

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
            <Route path="/aboutus" element={< AboutUsPage/>} />
            <Route path="/faq" element={< FAQPage/>} />
            <Route path="/feedback" element={<FeedbackForm />} />
            
            <Route path="/mfa-verification" element={
              <PrivateRoute requireMfa>
                <MfaVerificationPage />
              </PrivateRoute>
            } />

            {/* User Account Section (Nested Routes) */}
            <Route 
              path="/user-account/*" 
              element={
                <PrivateRoute>
                  <UserAccountLayout />
                </PrivateRoute>
              }
            >
              <Route path="personal-info" element={<PersonalInfoPage />} />
              <Route path="data-sharing" element={<DataSharingPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />

            <Route path="/home" element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            } />
            <Route path="/solardashboard" element={
              <PrivateRoute>
                <SolarDashboard />
              </PrivateRoute>
            } />
            <Route path="//batterydashboard" element={
              <PrivateRoute>
                <BatteryDashboard />
              </PrivateRoute>
            } />
          </Routes>
          <FloatingChatButton />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
