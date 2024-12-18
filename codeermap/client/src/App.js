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
import SimulatieForm from './components/simulatie_dashboard/SimulatieForm';
import SimulatieResults from './components/simulatie_dashboard/SimulatieResults'; 
import EnergyPrices  from './components/simulatie_dashboard/EnergyPrices';
import SunHours from './components/simulatie_dashboard/SunHours';
import SimulatieDashboard from './components/simulatie_dashboard/SimulatieDashboard';
import PrivateRoute from './components/PrivateRoute'; 
import { AuthProvider } from './components/AuthContext';
import AboutUs from './components/about_us/AboutUsPage';
import AboutUsPage from "./components/about_us2/AboutUsPage2"
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
            <Route path="/about_us" element={<AboutUs />} />
            <Route path="/about_us2" element={<AboutUsPage />} />
            <Route path="/simulatie" element={<SimulatieForm userId={1} />} />
            <Route path="/simulatie-results/:userId" element={<SimulatieResults />} />
            <Route path="/energy-prices" element={<EnergyPrices />} />
            <Route path="/sun-hours" element={<SunHours />} />
            <Route path="/simulatie_dashboard" element={<SimulatieDashboard />} />

            
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
