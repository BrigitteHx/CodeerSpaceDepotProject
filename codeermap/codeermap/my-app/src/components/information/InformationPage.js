import React from 'react';
import './style/InfoForm.css';

const InformationPage = () => {
    return (
        <div className="information-container">
            <div className="information-intro">
                <div className="information-section">
                    <h1 className="information-title">Home Battery Simulator: Manage Your Energy, Save Costs</h1>
                    <p className="information-description">
                        The Home Battery Simulator allows you to explore the benefits of using a home battery to manage your energy
                        consumption and reduce costs. By simulating energy usage and storage, this tool provides insights into
                        potential savings and optimal energy usage.
                    </p>
                </div>
                <div className="information-section features">
                    <h2 className="information-section-title">Key Features and How to Use Them</h2>
                    <p className="information-section-description">The Home Battery Simulator offers several interactive features to help you explore various energy storage and management strategies.</p>
                    <ul className="information-feature-list">
                        <li className="information-feature-item"><strong>Input Your Energy Parameters:</strong> Enter solar panel capacity, battery capacity, and hourly consumption for accurate simulations.</li>
                        <li className="information-feature-item"><strong>Simulate Charging and Discharging Cycles:</strong> Set charging and discharging times to understand the impact on energy costs and consumption.</li>
                        <li className="information-feature-item"><strong>Daily Cost Overview:</strong> Compare your projected energy costs with and without a battery.</li>
                        <li className="information-feature-item"><strong>Graphical Visualizations:</strong> View battery status, energy flow, and cost savings in easy-to-understand charts.</li>
                    </ul>
                </div>
                <div className="information-section security">
                    <h2 className="information-section-title">Security and Privacy</h2>
                    <p className="information-section-description">We take your data security and privacy seriously. Here are the measures in place to protect your information:</p>
                    <ul className="information-security-list">
                        <li className="information-security-item"><strong>Data Encryption:</strong> All data entered is encrypted to ensure privacy.</li>
                        <li className="information-security-item"><strong>No Personal Data Collection:</strong> The simulator does not require personal information.</li>
                        <li className="information-security-item"><strong>Secure Access:</strong> The application uses HTTPS for a secure connection.</li>
                        <li className="information-security-item"><strong>Optional Local Storage:</strong> Save your settings locally on your device for future use.</li>
                    </ul>
                </div>
                <div className="information-section accessibility">
                    <h2 className="information-section-title">Accessibility Features</h2>
                    <p className="information-section-description">The Home Battery Simulator is designed to be accessible for all users, including those with disabilities.</p>
                    <ul className="information-accessibility-list">
                        <li className="information-accessibility-item"><strong>Text Scaling:</strong> Adjust text size for better readability.</li>
                        <li className="information-accessibility-item"><strong>High-Contrast Mode:</strong> Available for users with visual impairments.</li>
                        <li className="information-accessibility-item"><strong>Screen Reader Compatibility:</strong> The simulator works with screen readers.</li>
                        <li className="information-accessibility-item"><strong>Keyboard Navigation:</strong> Access features with keyboard shortcuts.</li>
                    </ul>
                </div>
                <div className="information-section faq">
                    <h2 className="information-section-title">Frequently Asked Questions (FAQ)</h2>
                    <div className="information-faq-item">
                        <h3 className="information-faq-question">What is the purpose of the Home Battery Simulator?</h3>
                        <p className="information-faq-answer">The simulator helps you explore how a home battery system can store excess solar energy, potentially lowering your electricity costs.</p>
                    </div>
                    <div className="information-faq-item">
                        <h3 className="information-faq-question">How do I know what battery capacity to set?</h3>
                        <p className="information-faq-answer">Battery capacity depends on your solar system size and daily energy needs. A larger capacity allows more storage but may be more costly in practice.</p>
                    </div>
                    <div className="information-faq-item">
                        <h3 className="information-faq-question">Can I save my simulation settings?</h3>
                        <p className="information-faq-answer">Yes, you can save settings locally on your device for future use.</p>
                    </div>
                    <div className="information-faq-item">
                        <h3 className="information-faq-question">Is my data secure?</h3>
                        <p className="information-faq-answer">Absolutely. The simulator uses data encryption and does not collect personal information.</p>
                    </div>
                </div>
                <div className="information-section contact-support">
                    <h2 className="information-section-title">Contact and Support</h2>
                    <p className="information-section-description">If you have any questions or issues, please reach out to our support team:</p>
                    <ul className="information-contact-list">
                        <li className="information-contact-item">Email: <a href="mailto:support@homebatterysimulator.com" className="information-contact-email">support@homebatterysimulator.com</a></li>
                        <li className="information-contact-item">Phone: +1 (555) 123-4567</li>
                        <li className="information-contact-item">Live Chat: Available on weekdays from 9 AM to 5 PM</li>
                    </ul>
                </div>
                <div className="information-section update-log">
                    <h2 className="information-section-title">Update Log</h2>
                    <ul className="information-update-log-list">
                        <li className="information-update-log-item"><strong>Version 2.1 (October 2024):</strong> Added high-contrast mode and improved graphical interface.</li>
                        <li className="information-update-log-item"><strong>Version 2.0 (August 2024):</strong> Introduced local data storage and updated algorithm for accurate predictions.</li>
                    </ul>
                </div>
                <div className="information-section acknowledgements">
                    <h2 className="information-section-title">Acknowledgements</h2>
                    <p className="information-section-description">The development of the Home Battery Simulator was made possible by the team at [Your Company], with guidance from DaVinci College.</p>
                </div>
            </div>
            <div className="information-faq-prompt">
                <h2 className="information-faq-title">Do you have any questions about using it?</h2>
                <p className="information-faq-description">
                    Your question may be among the frequently asked questions!<br />
                    If not, please contact us here: <a href="/contact" className="information-contact-link">contact page</a>.
                </p>
            </div>
        </div>
    );
};

export default InformationPage;
