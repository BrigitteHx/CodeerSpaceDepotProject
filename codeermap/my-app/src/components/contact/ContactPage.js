import React, { useState } from 'react';
import './style/ContactForm.css';
import axios from 'axios';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Email format validation
        if (!validateEmailFormat(formData.email)) {
            setStatus("Invalid email format. Please enter a valid email.");
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/contact', formData);
            setStatus("Your message has been sent successfully!");
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            setStatus("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-left-panel">
                <h1>Contact us!</h1>
                <p>
                    We'd love to hear from you! Fill out the form and we'll get back to you as soon as possible.
                </p>
            </div>
            <div className="contact-right-panel">
                <h1>Contact Form</h1>
                <form onSubmit={handleSubmit} className="contact-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="First and last name *"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail address *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <textarea
                        name="message"
                        placeholder="How can we help you? *"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="contact-submit-button" disabled={loading}>
                        {loading ? "Sending..." : "Send"}
                    </button>
                    {status && <p className="status-message">{status}</p>}
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
