import React from 'react';
import PropTypes from 'prop-types';

const ChatHistoryTable = ({ message }) => (
  <tr>
    <td>{message.sender}</td>
    <td>{message.message}</td>
    <td>{message.stars}</td>
    <td>{message.feedback}</td>
    <td>{message.sentAt.toLocaleString()}</td>
  </tr>
);

ChatHistoryTable.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    stars: PropTypes.number.isRequired,
    feedback: PropTypes.string.isRequired,
    sentAt: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};

export default ChatHistoryTable;
