import React, { useState } from 'react';
import './style/FAQPage.css';

const questionsAndAnswers = [
    { id: 1, question: "How does the system estimate battery life?", answer: "The system uses a combination of usage patterns, temperature, and battery specifications to estimate battery longevity.", tag: "Battery" },
    { id: 2, question: "How do I interpret the simulation results?", answer: "Simulation results offer insights into daily energy production, potential savings, and system efficiency.", tag: "Simulation" },
    { id: 3, question: "Is it possible to add more solar panels in the simulation?", answer: "Yes, you can increase the number of panels in the simulation to see how additional panels affect energy production.", tag: "Solar Panels" },
    { id: 4, question: "Can I simulate different solar panel brands?", answer: "Yes, the simulation tool allows you to compare different solar panel brands to see how each performs.", tag: "Solar Panels" },
    { id: 5, question: "How accurate is the energy output prediction?", answer: "Our simulation uses advanced algorithms and weather data to predict energy output with high accuracy.", tag: "Simulation" },
    { id: 6, question: "What factors affect battery performance?", answer: "Battery performance can be affected by temperature, charge cycles, and energy demand.", tag: "Battery" },
    { id: 7, question: "How can I maximize the battery life of my system?", answer: "To extend battery life, avoid deep discharges, maintain optimal temperature, and use energy efficiently.", tag: "Battery" },
    { id: 8, question: "What is included in the simulation report?", answer: "The report includes estimated energy production, cost savings, environmental impact, and potential system efficiency.", tag: "Simulation" },
    { id: 9, question: "How does the system handle cloudy days?", answer: "The simulation adjusts for weather variations, such as cloudy days, to estimate realistic energy production." },
    { id: 10, question: "Does the simulation take weather conditions into account?", answer: "Yes, our simulation includes local weather data to provide more accurate energy production estimates." },
    { id: 11, question: "How often should I perform a simulation?", answer: "It's recommended to run a simulation annually or when there are significant changes in energy usage patterns." },
    { id: 12, question: "What is the recommended battery capacity for my setup?", answer: "The recommended battery capacity depends on your daily energy usage, solar panel output, and backup needs." },
    { id: 14, question: "Can I export the simulation results?", answer: "Yes, you can export the results as a PDF or CSV file for further analysis." },
    { id: 15, question: "Is the simulation free to use?", answer: "Yes, our basic simulation is free to use. Advanced features may require a subscription." },
];

const actionButtons = [
    { label: "View Simulation Guide", description: "Read our guide to understand how the simulation works and calculates energy yield." },
    { label: "Battery Optimization Tips", description: "Discover how to extend the lifespan of your battery and optimize performance." },
    { label: "Different Solar Panel Options", description: "Explore the various solar panel options available in the simulation." },
    { label: "Calculate Savings", description: "Use our tool to calculate how much you can save with solar energy." },
];


function FAQPage() {
    const [activeId, setActiveId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [generalComments, setGeneralComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Contact form state
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactMessage, setContactMessage] = useState("");


    const toggleAnswer = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleFilterChange = (e) => setSelectedTag(e.target.value);

    const filteredQuestions = questionsAndAnswers.filter(({ question, tag }) => {
        const matchesSearch = question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === "All" || tag === selectedTag;
        return matchesSearch && matchesTag;
    });

    return (
        <div className="faq-page">
            <h1 className="faq-title">Frequently Asked Questions</h1>

            {/* Action Buttons Grid */}
            <div className="action-buttons">
                {actionButtons.slice(0, 4).map((button, index) => (
                    <div key={index} className="action-button">
                        <h3>{button.label}</h3>
                        <p>{button.description}</p>
                    </div>
                ))}
            </div>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select onChange={handleFilterChange} value={selectedTag}>
                    <option value="All">All Topics</option>
                    <option value="Solar Panels">Solar Panels</option>
                    <option value="Battery">Battery</option>
                    <option value="Simulation">Simulation</option>
                </select>
            </div>

            <div className="faq-list">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map(({ id, question, answer }) => (
                        <div key={id} className="faq-item">
                            <div className="faq-question" onClick={() => toggleAnswer(id)}>
                                <span>{question}</span>
                                <span className="faq-icon">{activeId === id ? "−" : "+"}</span>
                            </div>
                            {activeId === id && (
                                <div className="faq-answer">
                                    {answer}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No results found for your search. Please try a different term or browse by topic.</p>
                    </div>
                )}
            </div>


            {/* Contact Us Section */}
            <div className="contact-us-section">
                <h2>Couldn't find your question?</h2>
                <p>If you have any other questions or need assistance, please contact us through out <a href="/contact" className="information-contact-link">contact page</a>.</p>
            </div>
        </div>
    );
}
export default FAQPage;