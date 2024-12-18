import React from 'react';
import './style/AboutUs.css';
import { FaSolarPanel, FaBatteryFull, FaWarehouse } from 'react-icons/fa';
import { GiSolarPower } from 'react-icons/gi';
import { FiUsers } from 'react-icons/fi';
import { MdOutlineSupportAgent } from 'react-icons/md';

const AboutUsPage = () => {
    return (
        <div className="about-us-page">
            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">Redefining Efficiency for a Sustainable Future</h1>
                <p className="hero-subtitle">
                    <strong>DEPOT Software</strong> delivers innovative solutions to optimize processes, improve sustainability, and drive efficiency for the ISO Tank Container Industry.
                </p>
            </div>

            {/* Our Mission Section */}
            <section className="mission-section">
                <div className="section-content">
                    <h2>Our Mission</h2>
                    <p>
                        Empowering service providers with advanced tools that streamline operations, enhance safety, and promote eco-friendly practices. Innovation and sustainability guide everything we do.
                    </p>
                </div>
                <div className="section-icon">
                    <GiSolarPower  className="icon-mission" />
                </div>
            </section>

            {/* What We Do Section */}
            <section className="services-section">
                <h2>What We Do</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <FaSolarPanel className="service-icon" />
                        <h3>Solar Panel Simulation</h3>
                        <p>
                            Analyze and optimize energy consumption with smart solar panel simulation tools.
                        </p>
                    </div>
                    <div className="service-card">
                        <FaBatteryFull className="service-icon" />
                        <h3>Battery Management</h3>
                        <p>
                            Maximize energy efficiency and reduce costs with intelligent battery management solutions.
                        </p>
                    </div>
                    <div className="service-card">
                        <FaWarehouse className="service-icon" />
                        <h3>Depot Efficiency</h3>
                        <p>
                            Simplify yard operations with industry-leading depot management software.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="story-section">
                <h2>Our Story</h2>
                <p>
                    Since 1996, DEPOT Software has been at the forefront of depot management innovation. 
                    Operating near the Port of Rotterdam, we’ve combined expertise with a passion for sustainable solutions. 
                    As part of Lucrasoft ICT Group, we remain committed to empowering the ISO Tank Container Industry.
                </p>
            </section>


            {/* Core Values Section */}
            <section className="values-section">
                <h2>Our Values</h2>
                <div className="values-grid">
                    <div className="value-item">
                        <GiSolarPower  className="value-icon" />
                        <h3>Innovation</h3>
                        <p>Leading with groundbreaking solutions that redefine industry standards.</p>
                    </div>
                    <div className="value-item">
                        <FiUsers className="value-icon" />
                        <h3>Collaboration</h3>
                        <p>Partnering with clients to deliver tailored solutions for their needs.</p>
                    </div>
                    <div className="value-item">
                        <MdOutlineSupportAgent className="value-icon" />
                        <h3>Sustainability</h3>
                        <p>Building tools that contribute to a greener, cleaner future.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <h2>Discover How We Can Help</h2>
                <p>
                    Ready to optimize your depot operations? Visit our website or contact us to learn more about how DEPOT Software can transform your business.
                </p>
                <a
                    href="https://www.depotsoftware.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button"
                >
                    Visit Our Website
                </a>
            </section>
        </div>
    );
};

export default AboutUsPage;
