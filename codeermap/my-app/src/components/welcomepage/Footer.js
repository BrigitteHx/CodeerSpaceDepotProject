import React from 'react';
import './Style/Footer.css'; // Ensure you have this file for styling
import logo from './images/logo.png';

// Importing icons (assuming you have them in the project)
import twitterIcon from './images/twitterIcon.png';
import linkedinIcon from './images/linkedinIcon.png';
import instagramIcon from './images/instagramIcon.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span className="company-name">Solar Panel Simulation</span>
        </div>

        <nav className="footer-nav">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Help Center</a>
          <a href="#">Careers</a>
          <a href="#">Contact us</a>
          <a href="#">FAQs</a>
        </nav>

        <div className="email-subscribe">
          <input type="email" placeholder="name@example.com" />
          <button>Subscribe</button>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="social-media">
            <a href="#"><img src={twitterIcon} alt="Twitter" /></a>
            <a href="#"><img src={linkedinIcon} alt="LinkedIn" /></a>
            <a href="#"><img src={instagramIcon} alt="Instagram" /></a>
        </div>

        <select className="language-select">
          <option value="English">English</option>
          <option value="Dutch">Dutch</option>
        </select>
        <p>© 2024 Solar Panel Simulation, Inc. • <a href="#">Privacy</a> • <a href="#">Terms</a> • <a href="#">Sitemap</a></p>
      </div>
    </footer>
  );
};

export default Footer;
