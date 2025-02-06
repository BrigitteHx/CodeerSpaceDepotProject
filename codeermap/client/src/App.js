import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/welcomepage/Header';
import MainContent from './components/welcomepage/MainContent';
import Footer from './components/welcomepage/Footer';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import PasswordReset from './components/password_reset/Password_reset';
import ResetPassword from './components/password_reset/NewPassword';
import FAQPage from './components/faq/FAQPage';
import FloatingChatButton from './components/faq/FloatingChatButton';
import ContactPage from './components/contact/ContactPage'; 
import InformationPage from './components/information/InformationPage';
import Homepage from './components/homepage/homepage';
import PersonalInfoPage from './components/user_account/PersonalInfoPage';
import DataSharingPage from './components/user_account/DataSharingPage';
import DashboardPage from './components/user_account/DashboardPage';
import SettingsPage from './components/user_account/SettingsPage';
import Sidebar from './components/user_account/Sidebar';
import UserAccountLayout from './components/user_account/UserAccountLayout';
import FeedbackForm from './components/feedback/FeedbackForm';
import BatteryDashboard from './components/battery_dashboard/batteryDashboard';
import SolarDashboard from './components/solar_dashboard/solarDashboard';
import AboutUs from './components/about_us/AboutUsPage';
import SimulationForm from './components/simulation_dashboard/SimulationForm';
import EnergyPrices  from './components/simulation_dashboard/EnergyPrices';
import SunHours from './components/simulation_dashboard/SunHours';
import SimulationDashboard from './components/simulation_dashboard/SimulationDashboard';
import PrivateRoute from './components/PrivateRoute'; 
import { AuthProvider } from './components/AuthContext';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password_reset" element={<PasswordReset />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/information" element={<InformationPage />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/battery_dashboard" element={<BatteryDashboard />} />
            <Route path="/solar_dashboard" element={<SolarDashboard />} />
            <Route path="/simulation_dashboard" element={<SimulationDashboard />} />
            <Route path="/simulationForm" element={<SimulationForm />} />
            <Route path="/energy-prices" element={<EnergyPrices />} />
            <Route path="/sun-hours" element={<SunHours />} />
            <Route path="/about_us" element={<AboutUs />} />
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

            {/* Protect /home route */}
            <Route 
              path="/home" 
              element={
                <PrivateRoute>
                  <Homepage />
                </PrivateRoute>
              }     
            />
          </Routes>

          <FloatingChatButton />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
