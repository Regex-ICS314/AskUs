import React from 'react';
import PropTypes from 'prop-types';
import ChatLoading from './ChatLoading';
import TypingAnimation from './TypingAnimation';

const ChatWindow = ({ chatHistory, chatSender, formatChatbotResponse, loading, chatEndRef }) => (
  <div className="chat-window">
    {chatHistory.map((message, index) => (
      <React.Fragment key={message.id || `message-${index}`}>
        {chatSender(message)}
        <div className={`chat-message ${message.sender}`}>
           <!-- // problem that formatChatbotResponse returns an object and the typing animation doesn't know how to render that -->
          {message.sender === 'bot' ? formatChatbotResponse(message.text) : message.text}
        </div>
      </React.Fragment>
    ))}
    {/* ChatLoading Circle is rendered here */}
    {loading && <ChatLoading />}
    <div ref={chatEndRef} />
  </div>
);

ChatWindow.propTypes = {
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // or number, depending on what you use
      sender: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
  chatSender: PropTypes.func.isRequired, // For chatSender function
  formatChatbotResponse: PropTypes.func.isRequired, // For formatChatbotResponse function
  loading: PropTypes.bool.isRequired, // For loading state
};

export default ChatWindow;
