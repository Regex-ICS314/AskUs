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
    sender: PropTypes.string,
    sentAt: PropTypes.instanceOf(Date),
    message: PropTypes.string,
    feedback: PropTypes.string,
    stars: PropTypes.number,
  }).isRequired,
};
export default ChatHistoryTable;
