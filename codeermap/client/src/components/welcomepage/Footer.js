import React from 'react';
import './style/Footer.css'; // Ensure you have this file for styling
import logo from './images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faXTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <footer>
      <div className='footerContainer'>
        <div className='socialIcons'>
          <a href='#'><i><FontAwesomeIcon icon={faFacebookF} /></i></a>
          <a href='#'><i><FontAwesomeIcon icon={faInstagram} /></i></a>
          <a href='#'><i><FontAwesomeIcon icon={faXTwitter} /></i></a>
          <a href='#'><i><FontAwesomeIcon icon={faLinkedinIn} /></i></a>
        </div> 

        <div className='footerNav'>
          <ul>
            <li><a href='/home'>Home</a></li>
            <li><a href='/information'>Information</a></li>
            <li><a href='/contact'>Contact us</a></li>
            <li><a href='/FAQ'>FAQ</a></li>
            <li><a href='/about_us'>About us</a></li>
            <li><a href='/feedback'>Rate us</a></li>
          </ul>
        </div>

      </div>

      <div className='footerBottom'>
          <p>Copyright &copy;2024; Solar Panel Simulation</p>
        </div>
    </footer>
  );
};

export default Footer;
