import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

/** Component that renders the chat history, has an admin mode or a user mode.
* Admin mode opens a table of all messages, user mode goes to the chat session.
 * @returns A box for representing each session for a user */
// eslint-disable-next-line react/prop-types
const ChatHistory = ({ session, deleteSession, adminMode, user }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleRowClickUser = () => {
    navigate('/chatbot');
  };

  const handleRowClickAdmin = () => {
    navigate('/admin/usermessages');
    localStorage.setItem('userForViewingHistory', user);
    localStorage.setItem('sessionForViewingHistory', session._id);
  };

  // Convert the date to a string
  const dateString = session.sentAt.toLocaleString();
  return (
    <Row
      className="mb-3 border p-1 "
      key={session._id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ background: '#907139' }}
    >
      <Col
        onClick={adminMode ? handleRowClickAdmin : handleRowClickUser}
        className={`${isHovered ? 'text-primary' : 'text-dark'}`}
      >
        <h5>{session.latestQuery}</h5>
        <p>{dateString}</p>
      </Col>
      <Col
        xs={1}
        className={`d-flex justify-content-center align-items-center ${isHovered ? 'text-primary' : 'text-dark'}`}
      >
        <Trash onClick={() => deleteSession(session._id)} />
      </Col>
    </Row>
  );
};

ChatHistory.propTypes = {
  session: PropTypes.shape({
    latestQuery: PropTypes.string,
    sentAt: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  }).isRequired,
  // eslint-disable-next-line react/require-default-props
  adminMode: PropTypes.bool,
  deleteSession: PropTypes.func.isRequired,
};

export default ChatHistory;
