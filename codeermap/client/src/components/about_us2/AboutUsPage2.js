import React, { useState } from 'react';
import './style/AboutUs2.css';
import { FaCogs, FaGlobe, FaUsers, FaEnvelope } from 'react-icons/fa'; //

function AboutUsPage() {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="about-page">
            {/* Header with Logo */}
            <header className="about-header">
                <img 
                    src={require('./logo_simulation.png')} 
                    alt="Solar Panel Simulation Logo" 
                    className="about-logo" 
                />
                <h1 className="about-title">About Us</h1>
                <p className="about-description">
                    Discover how we empower homeowners to optimize energy usage and embrace renewable solutions.
                </p>
            </header>

{/* Accordion Sections */}
    <div className="accordion">
        <div className={`accordion-item ${activeSection === 'what-we-do' ? 'active' : ''}`}>
            <div 
                className="accordion-header" 
                onClick={() => toggleSection('what-we-do')}
            >
                <h2>
                    <FaCogs /> What We Do
                </h2>
                <span>{activeSection === 'what-we-do' ? '−' : '+'}</span>
            </div>
            {activeSection === 'what-we-do' && (
                <div className="accordion-content">
                    <p>
                        With our advanced simulation tool, you can explore how a home battery benefits your household. 
                        Experiment with scenarios, optimize your energy usage, and make informed decisions.
                    </p>
                </div>
            )}
        </div>

        <div className={`accordion-item ${activeSection === 'our-goal' ? 'active' : ''}`}>
            <div 
                className="accordion-header" 
                onClick={() => toggleSection('our-goal')}
            >
                <h2>
                    <FaGlobe /> Our Goal
                </h2>
                <span>{activeSection === 'our-goal' ? '−' : '+'}</span>
            </div>
            {activeSection === 'our-goal' && (
                <div className="accordion-content">
                    <p>
                        Our goal is to provide a user-friendly platform that helps you save on energy costs while contributing 
                        to a greener future. Explore sustainable strategies with ease.
                    </p>
                </div>
            )}
        </div>

        <div className={`accordion-item ${activeSection === 'team' ? 'active' : ''}`}>
            <div 
                className="accordion-header" 
                onClick={() => toggleSection('team')}
            >
                <h2>
                    <FaUsers /> Meet Our Team
                </h2>
                <span>{activeSection === 'team' ? '−' : '+'}</span>
            </div>
            {activeSection === 'team' && (
                <div className="accordion-content">
                    <p>
                        We are a dedicated group of developers, engineers, and energy enthusiasts passionate about 
                        innovative energy solutions and sustainable living.
                    </p>
                </div>
            )}
        </div>

        <div className={`accordion-item ${activeSection === 'contact' ? 'active' : ''}`}>
            <div 
                className="accordion-header" 
                onClick={() => toggleSection('contact')}
            >
                <h2>
                    <FaEnvelope /> Contact Us
                </h2>
                <span>{activeSection === 'contact' ? '−' : '+'}</span>
            </div>
            {activeSection === 'contact' && (
                <div className="accordion-content">
                    <p>
                        Have questions or feedback? We’d love to hear from you. Visit our 
                        <a href="/contact" className="contact-link"> Contact Page </a> to reach out or connect with us directly.
                    </p>
                    <div className="contact-info">
                        <p><strong>Email:</strong> support@thuisbatterij.com</p>
                        <p><strong>Phone:</strong> +31 123 456 789</p>
                    </div>
                </div>
            )}
        </div>
    </div>

            {/* Mission, Vision, Values */}
            <div className="mission-section">
                <h2>Our Mission, Vision, and Values</h2>
                <div className="mission-cards">
                    <div className="card">
                        <h3>Mission</h3>
                        <p>
                            To help households embrace renewable energy and make informed decisions about energy efficiency.
                        </p>
                    </div>
                    <div className="card">
                        <h3>Vision</h3>
                        <p>
                            A world where sustainable energy solutions are accessible to everyone.
                        </p>
                    </div>
                    <div className="card">
                        <h3>Values</h3>
                        <p>
                            Innovation, sustainability, and user empowerment.
                        </p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="timeline-section">
                <h2>Our Journey</h2>
                <div className="timeline">
                    <div className="timeline-item">
                        <h3>2020</h3>
                        <p>We started with a vision to simplify renewable energy adoption.</p>
                    </div>
                    <div className="timeline-item">
                        <h3>2021</h3>
                        <p>Our first prototype of the Thuisbatterij Simulator went live.</p>
                    </div>
                    <div className="timeline-item">
                        <h3>2023</h3>
                        <p>We integrated real-time energy price data and user profiles.</p>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="testimonials-section">
                <h2>What Our Users Say</h2>
                <div className="testimonials">
                    <div className="testimonial">
                        <p>"The simulator helped me optimize my energy usage and save on costs!"</p>
                        <span>- Alex J.</span>
                    </div>
                    <div className="testimonial">
                        <p>"A user-friendly tool that made renewable energy planning simple and fun!"</p>
                        <span>- Maria K.</span>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="stats-section">
                <h2>By the Numbers</h2>
                <div className="stats-grid">
                    <div className="stat">
                        <h3>5,000+</h3>
                        <p>Simulations Run</p>
                    </div>
                    <div className="stat">
                        <h3>98%</h3>
                        <p>User Satisfaction</p>
                    </div>
                    <div className="stat">
                        <h3>10+</h3>
                        <p>Countries Reached</p>
                    </div>
                </div>
            </div>

        {/* Parent Company Section */}
          <div className="parent-company-section">
              <div className="company-content">
                  <h3>Learn more about us</h3>
                  <p>
                      Discover more about our parent company: 
                      <a href="https://www.depotsoftware.com/" target="_blank" className="company-link">
                          <FaGlobe /> Depot Software
                      </a>
                  </p>
              </div>
          </div>
        </div>
    );
}

export default AboutUsPage;