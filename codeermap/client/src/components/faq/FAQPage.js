import React, { useState } from 'react';
import './style/FAQPage.css';

const questionsAndAnswers = [
    { id: 1, question: "How does the system estimate battery life?", answer: "The system uses a combination of usage patterns, temperature, and battery specifications to estimate battery longevity.", tag: "Battery" },
    { id: 2, question: "How do I interpret the simulation results?", answer: "Simulation results offer insights into daily energy production, potential savings, and system efficiency.", tag: "Simulation" },
    { id: 3, question: "Is it possible to add more solar panels in the simulation?", answer: "Yes, you can increase the number of panels in the simulation to see how additional panels affect energy production.", tag: "Solar Panels" },
    { id: 4, question: "Can I simulate different solar panel brands?", answer: "Yes, the simulation tool allows you to compare different solar panel brands to see how each performs.", tag: "Solar Panels" },
    { id: 5, question: "How accurate is the energy output prediction?", answer: "Our simulation uses advanced algorithms and weather data to predict energy output with high accuracy.", tag: "Simulation" },
    { id: 6, question: "What factors affect battery performance?", answer: "Battery performance can be affected by temperature, charge cycles, and energy demand.", tag: "Battery" },
    { id: 7, question: "What is included in the simulation report?", answer: "The report includes estimated energy production, cost savings, environmental impact, and potential system efficiency.", tag: "Simulation" },
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
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Filter questions based on search term and selected tag
    const filteredQuestions = questionsAndAnswers.filter(({ question, tag }) => {
        const matchesSearch = question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === "All" || tag === selectedTag;
        return matchesSearch && matchesTag;
    });

    const toggleAnswer = (id) => setActiveId(activeId === id ? null : id);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(true); // Show suggestions when typing
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false); // Hide suggestions when clicked
    };

    const suggestions = questionsAndAnswers
        .filter(({ question }) => question.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(({ question }) => question);

    return (
        <div className="faq-page">
            <h1 className="faq-title">Frequently Asked Questions</h1>

            {/* Search Bar */}
            <div className="search-bar" style={{ position: "relative" }}>
                <div className="search-input-container">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
                    <option value="All">All Topics</option>
                    <option value="Solar Panels">Solar Panels</option>
                    <option value="Battery">Battery</option>
                    <option value="Simulation">Simulation</option>
                </select>

                {/* Suggestions Bar */}
                {showSuggestions && searchTerm && (
                    <div className="suggestions-bar">
                        {suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))
                        ) : (
                            <div className="suggestion-item">No suggestions found</div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons Grid */}
            <div className="action-buttons">
                {actionButtons.slice(0, 4).map((button, index) => (
                    <div key={index} className="action-button">
                        <h3>{button.label}</h3>
                        <p>{button.description}</p>
                    </div>
                ))}
            </div>

            {/* FAQ List */}
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
                <p>If you have any other questions or need assistance, please contact us through our <a href="/contact" className="information-contact-link">contact page</a>.</p>
            </div>
        </div>
    );
}

export default FAQPage;