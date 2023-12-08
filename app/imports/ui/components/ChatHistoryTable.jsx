import React from 'react';

const ChatHistoryTable = ({ message }) => (
  <tr>
    <td>{message.sender}</td>
    <td>{message.message}</td>
    <td>{message.stars}</td>
    <td>{message.feedback}</td>
    <td>{message.sentAt.toLocaleString()}</td>
  </tr>
);


export default ChatHistoryTable;