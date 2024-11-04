import React from 'react';
import './style/InfoForm.css';

const InformationPage = () => {
    return (
        <div className="information-container">
            <div className="intro-section">
                <div className="section">
                    <h1>Home Battery Simulator: Manage Your Energy, Save Costs</h1>
                    <p>
                        The Home Battery Simulator allows you to explore the benefits of using a home battery to manage your energy
                        consumption and reduce costs. By simulating energy usage and storage, this tool provides insights into
                        potential savings and optimal energy usage.
                    </p>
                </div>
                <div className="faq-prompt">
                    <h2>Do you have any questions about using it?</h2>
                    <p>
                        Your question may be among the frequently asked questions!<br />
                        If not, please contact us here: <a href="/contact" className="contact-link">contact page</a>.
                    </p>
                </div>
            </div>

            <div className="section features">
                <h2>Key Features and How to Use Them</h2>
                <p>The Home Battery Simulator offers several interactive features to help you explore various energy storage and management strategies.</p>
                <ul>
                    <li><strong>Input Your Energy Parameters:</strong> Enter solar panel capacity, battery capacity, and hourly consumption for accurate simulations.</li>
                    <li><strong>Simulate Charging and Discharging Cycles:</strong> Set charging and discharging times to understand the impact on energy costs and consumption.</li>
                    <li><strong>Daily Cost Overview:</strong> Compare your projected energy costs with and without a battery.</li>
                    <li><strong>Graphical Visualizations:</strong> View battery status, energy flow, and cost savings in easy-to-understand charts.</li>
                </ul>
            </div>

            <div className="section security">
                <h2>Security and Privacy</h2>
                <p>We take your data security and privacy seriously. Here are the measures in place to protect your information:</p>
                <ul>
                    <li><strong>Data Encryption:</strong> All data entered is encrypted to ensure privacy.</li>
                    <li><strong>No Personal Data Collection:</strong> The simulator does not require personal information.</li>
                    <li><strong>Secure Access:</strong> The application uses HTTPS for a secure connection.</li>
                    <li><strong>Optional Local Storage:</strong> Save your settings locally on your device for future use.</li>
                </ul>
            </div>

            <div className="section accessibility">
                <h2>Accessibility Features</h2>
                <p>The Home Battery Simulator is designed to be accessible for all users, including those with disabilities.</p>
                <ul>
                    <li><strong>Text Scaling:</strong> Adjust text size for better readability.</li>
                    <li><strong>High-Contrast Mode:</strong> Available for users with visual impairments.</li>
                    <li><strong>Screen Reader Compatibility:</strong> The simulator works with screen readers.</li>
                    <li><strong>Keyboard Navigation:</strong> Access features with keyboard shortcuts.</li>
                </ul>
            </div>

            <div className="section faq">
                <h2>Frequently Asked Questions (FAQ)</h2>
                <div className="faq-item">
                    <h3>What is the purpose of the Home Battery Simulator?</h3>
                    <p>The simulator helps you explore how a home battery system can store excess solar energy, potentially lowering your electricity costs.</p>
                </div>
                <div className="faq-item">
                    <h3>How do I know what battery capacity to set?</h3>
                    <p>Battery capacity depends on your solar system size and daily energy needs. A larger capacity allows more storage but may be more costly in practice.</p>
                </div>
                <div className="faq-item">
                    <h3>Can I save my simulation settings?</h3>
                    <p>Yes, you can save settings locally on your device for future use.</p>
                </div>
                <div className="faq-item">
                    <h3>Is my data secure?</h3>
                    <p>Absolutely. The simulator uses data encryption and does not collect personal information.</p>
                </div>
            </div>

            <div className="section contact-support">
                <h2>Contact and Support</h2>
                <p>If you have any questions or issues, please reach out to our support team:</p>
                <ul>
                    <li>Email: <a href="mailto:support@homebatterysimulator.com">support@homebatterysimulator.com</a></li>
                    <li>Phone: +1 (555) 123-4567</li>
                    <li>Live Chat: Available on weekdays from 9 AM to 5 PM</li>
                </ul>
            </div>

            <div className="section update-log">
                <h2>Update Log</h2>
                <ul>
                    <li><strong>Version 2.1 (October 2024):</strong> Added high-contrast mode and improved graphical interface.</li>
                    <li><strong>Version 2.0 (August 2024):</strong> Introduced local data storage and updated algorithm for accurate predictions.</li>
                </ul>
            </div>

            <div className="section acknowledgements">
                <h2>Acknowledgements</h2>
                <p>The development of the Home Battery Simulator was made possible by the team at [Your Company], with guidance from DaVinci College.</p>
            </div>
        </div>
    );
};

export default InformationPage;
