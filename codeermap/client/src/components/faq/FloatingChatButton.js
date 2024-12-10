import React, { useState } from 'react';
import MyChatBot from './ChatBot.js';
import './style/FloatingChatButton.css';

const FloatingChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Conditionally render the chatbot-container */}
            {isOpen && (
                <div className="chatbot-container">
                    <MyChatBot />
                </div>
            )}

            <div className="floating-chat-button" onClick={toggleChat}>
                <span>Chat with our bot!</span>
            </div>
        </div>
    );
};

export default FloatingChatButton;
